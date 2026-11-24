import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Dev-only diagnostic endpoint to test Resend email delivery without a full checkout.
 * Usage: GET /api/dev/test-email?to=someone@example.com
 * Disabled automatically in production.
 */
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Disabled in production." }, { status: 404 });
  }

  const url = new URL(request.url);
  const to = url.searchParams.get("to") ?? process.env.ORDER_NOTIFICATION_EMAIL;

  if (!to) {
    return NextResponse.json({ error: "Provide ?to=email@example.com" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_NOTIFICATION_FROM;

  if (!apiKey || !from) {
    return NextResponse.json(
      { error: "Missing RESEND_API_KEY or ORDER_NOTIFICATION_FROM in .env.local" },
      { status: 500 }
    );
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Test email - L’Univers MiKawaii",
      text: `Ceci est un email de test envoye a ${to} le ${new Date().toISOString()}.`,
    }),
  });

  const payload = await response.text();

  return NextResponse.json(
    {
      ok: response.ok,
      status: response.status,
      to,
      from,
      resendResponse: payload,
    },
    { status: response.ok ? 200 : 502 }
  );
}

