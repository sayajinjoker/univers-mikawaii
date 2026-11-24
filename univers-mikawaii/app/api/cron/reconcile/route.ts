import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe-server";

export const runtime = "nodejs";

const MAX_LOOKBACK_HOURS = 24 * 7;

type MissingSession = {
  sessionId: string;
  orderId: string;
  createdUtc: string;
  amountTotal: number;
  currency: string;
  customerEmail: string;
};

function parseLookbackHours(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("hours");
  if (!raw) return 24;

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed)) return 24;

  return Math.min(Math.max(parsed, 1), MAX_LOOKBACK_HOURS);
}

function isAuthorized(request: Request) {
  const expectedSecret = process.env.CRON_SECRET;
  if (!expectedSecret) {
    return { ok: false as const, status: 503, error: "CRON_SECRET is not configured." };
  }

  const authHeader = request.headers.get("authorization");
  const expectedHeader = `Bearer ${expectedSecret}`;
  if (authHeader !== expectedHeader) {
    return { ok: false as const, status: 401, error: "Unauthorized." };
  }

  return { ok: true as const };
}

async function sendFailureAlertEmail(lookbackHours: number, missing: MissingSession[]) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_NOTIFICATION_FROM?.trim();
  const to = process.env.RECON_ALERT_EMAIL?.trim() || process.env.ORDER_NOTIFICATION_EMAIL?.trim();

  if (!apiKey || !from || !to) {
    console.warn("[cron:reconcile] Alert email skipped: missing RESEND_API_KEY, ORDER_NOTIFICATION_FROM, or recipient.");
    return;
  }

  const checkedAt = new Date().toISOString();
  const top = missing.slice(0, 20);
  const bodyLines = top.map((item) => {
    return `- session=${item.sessionId} | order=${item.orderId} | created_utc=${item.createdUtc} | amount=${item.amountTotal} ${item.currency} | customer=${item.customerEmail}`;
  });

  const text = [
    "Reconciliation alert: paid sessions missing fulfilledAt",
    "",
    `checked_at_utc: ${checkedAt}`,
    `lookback_hours: ${lookbackHours}`,
    `missing_count: ${missing.length}`,
    "",
    "Top entries:",
    ...bodyLines,
    ...(missing.length > top.length ? ["", `...and ${missing.length - top.length} more.`] : []),
  ].join("\n");

  const htmlRows = top
    .map((item) => `<tr><td style="padding:6px;border:1px solid #ddd;">${item.sessionId}</td><td style="padding:6px;border:1px solid #ddd;">${item.orderId}</td><td style="padding:6px;border:1px solid #ddd;">${item.createdUtc}</td><td style="padding:6px;border:1px solid #ddd;">${item.amountTotal} ${item.currency}</td><td style="padding:6px;border:1px solid #ddd;">${item.customerEmail}</td></tr>`)
    .join("");

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#222;">
      <h2>Reconciliation alert: paid sessions missing fulfilledAt</h2>
      <p><strong>Checked at (UTC):</strong> ${checkedAt}<br/>
      <strong>Lookback hours:</strong> ${lookbackHours}<br/>
      <strong>Missing count:</strong> ${missing.length}</p>
      <table style="border-collapse:collapse;font-size:13px;">
        <thead>
          <tr>
            <th style="padding:6px;border:1px solid #ddd;">Session</th>
            <th style="padding:6px;border:1px solid #ddd;">Order</th>
            <th style="padding:6px;border:1px solid #ddd;">Created UTC</th>
            <th style="padding:6px;border:1px solid #ddd;">Amount</th>
            <th style="padding:6px;border:1px solid #ddd;">Customer</th>
          </tr>
        </thead>
        <tbody>
          ${htmlRows}
        </tbody>
      </table>
      ${missing.length > top.length ? `<p>...and ${missing.length - top.length} more.</p>` : ""}
    </div>
  `;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `[ALERT] Reconciliation missing fulfillment (${missing.length})`,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const payload = await response.text();
    console.error("[cron:reconcile] Failed to send alert email", {
      status: response.status,
      payload,
    });
    return;
  }

  console.log("[cron:reconcile] Alert email sent", {
    to,
    missingCount: missing.length,
  });
}

export async function GET(request: Request) {
  const auth = isAuthorized(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const lookbackHours = parseLookbackHours(request);
  const createdGte = Math.floor(Date.now() / 1000) - (lookbackHours * 60 * 60);
  const stripe = getStripeServer();

  const missing: MissingSession[] = [];

  for await (const session of stripe.checkout.sessions.list({
    created: { gte: createdGte },
    limit: 100,
  })) {
    if (session.payment_status !== "paid") {
      continue;
    }

    if (session.metadata?.fulfilledAt) {
      continue;
    }

    missing.push({
      sessionId: session.id,
      orderId: session.metadata?.orderId ?? session.client_reference_id ?? "n/a",
      createdUtc: new Date(session.created * 1000).toISOString(),
      amountTotal: session.amount_total ?? 0,
      currency: (session.currency ?? "cad").toLowerCase(),
      customerEmail: session.customer_details?.email ?? session.customer_email ?? "n/a",
    });
  }

  if (missing.length > 0) {
    console.error("[cron:reconcile] paid sessions missing fulfilledAt", {
      count: missing.length,
      lookbackHours,
      sample: missing.slice(0, 5),
    });
    await sendFailureAlertEmail(lookbackHours, missing);
  } else {
    console.log("[cron:reconcile] no paid-unfulfilled sessions", { lookbackHours });
  }

  return NextResponse.json(
    {
      ok: missing.length === 0,
      lookbackHours,
      missingCount: missing.length,
      missing,
      checkedAt: new Date().toISOString(),
    },
    { status: missing.length === 0 ? 200 : 409 }
  );
}

