import { NextResponse } from "next/server";

export const runtime = "nodejs";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clean(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_NOTIFICATION_FROM;
  const recipient = process.env.ORDER_NOTIFICATION_EMAIL ?? "univers.mikawaii@hotmail.com";

  if (!apiKey || !from) {
    return NextResponse.json({ error: "Le service de courriel n’est pas configuré." }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Honeypot field: genuine visitors never see or fill it.
  if (clean(body.website, 100)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 254).toLowerCase();
  const orderNumber = clean(body.orderNumber, 100);
  const message = clean(body.message, 3000);

  if (!name || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10) {
    return NextResponse.json(
      { error: "Veuillez fournir un nom, un courriel valide et un message d’au moins 10 caractères." },
      { status: 400 }
    );
  }

  const subject = `Message du formulaire de contact${orderNumber ? ` — ${orderNumber}` : ""}`;
  const text = [
    "Nouveau message depuis le site Univers Mikawaii",
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
          Nouveau message Univers Mikawaii
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
    console.error("[contact] Resend rejected message:", await response.text());
    return NextResponse.json(
      { error: "Le message n’a pas pu être envoyé. Réessayez ou écrivez-nous directement par courriel." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}