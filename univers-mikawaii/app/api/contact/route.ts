import { NextResponse } from "next/server";
import { parseContactRequestBody } from "@/lib/api-schemas";
import { takeRateLimitToken } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/request-security";

export const runtime = "nodejs";

const CONTACT_RATE_LIMIT = {
  namespace: "contact",
  max: 5,
  windowMs: 10 * 60 * 1000,
} as const;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  const rateLimit = takeRateLimitToken(getClientIp(request), CONTACT_RATE_LIMIT);
  if (!rateLimit.ok) {
    return NextResponse.json(
      { error: "Trop de messages envoyes. Veuillez patienter avant de reessayer." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
          "X-RateLimit-Limit": String(rateLimit.limit),
          "X-RateLimit-Remaining": String(rateLimit.remaining),
          "X-RateLimit-Reset": String(Math.ceil(rateLimit.resetAt / 1000)),
        },
      }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_NOTIFICATION_FROM?.trim() || "L’Univers MiKawaii <onboarding@resend.dev>";
  const recipient = process.env.ORDER_NOTIFICATION_EMAIL ?? "univers.mikawaii@hotmail.com";

  if (!apiKey) {
    return NextResponse.json({ error: "Le service de courriel n’est pas configuré." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const parsed = parseContactRequestBody(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.error }, { status: parsed.status ?? 400 });
  }

  const { name, email, orderNumber, message, website } = parsed.data;

  // Honeypot field: genuine visitors never see or fill it.
  if (website) {
    return NextResponse.json({ ok: true });
  }

  const subject = `Message du formulaire de contact${orderNumber ? ` — ${orderNumber}` : ""}`;
  const text = [
    "Nouveau message depuis le site L’Univers MiKawaii",
    "",
    `Nom : ${name}`,
    `Courriel : ${email}`,
    `Commande : ${orderNumber || "Non indiquée"}`,
    "",
    "Message :",
    message,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,sans-serif;background:#fdf2f8;padding:24px;color:#374151">
      <div style="max-width:600px;margin:auto;background:#fff;border:1px solid #fbcfe8;border-radius:16px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#f9a8d4,#c4b5fd);padding:22px;text-align:center;font-weight:700;font-size:21px;color:#4c1d95">
          Nouveau message — L’Univers MiKawaii
        </div>
        <div style="padding:24px;line-height:1.6">
          <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
          <p><strong>Courriel :</strong> ${escapeHtml(email)}</p>
          <p><strong>Commande :</strong> ${escapeHtml(orderNumber || "Non indiquée")}</p>
          <div style="margin-top:18px;padding:16px;background:#fdf4ff;border-radius:12px;border:1px solid #f3e8ff;white-space:pre-wrap;overflow-wrap:anywhere">
            <strong>Message</strong><br/>${escapeHtml(message).replace(/\r?\n/g, "<br/>")}
          </div>
        </div>
      </div>
    </div>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [recipient],
      reply_to: email,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    console.error("[contact] Resend rejected message", {
      status: response.status,
      statusText: response.statusText,
    });
    return NextResponse.json(
      { error: "Le message n’a pas pu être envoyé. Réessayez ou écrivez-nous directement par courriel." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}