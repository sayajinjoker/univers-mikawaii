export interface EmailShippingAddress { name?: string; line1?: string; line2?: string; city?: string; state?: string; postalCode?: string; country?: string }
import PDFDocument from "pdfkit";
import { getScoopArticleCount } from "@/lib/products";
import { getStripeServer } from "@/lib/stripe-server";

export interface EmailOrderItem { id: number; name: string; unitPrice: number; quantity: number; imageUrl?: string; customization?: { scoopCount: number; notes: string; surpriseStar: boolean; socialMediaVideo: boolean; recipientName?: string; audience: "child" | "adult" } }
export interface StoredOrder { id: string; status: "draft" | "paid" | "expired" | "failed"; currency: string; shippingAmount: number; deliveryMethod?: string; deliveryLabel?: string; deliverySector?: string; createdAt: string; updatedAt: string; items: EmailOrderItem[]; buyerEmail?: string; shippingAddress?: EmailShippingAddress; stripeSessionId?: string; stripeCustomerId?: string; stripePaymentIntentId?: string; stripeInvoiceId?: string; stripeInvoicePdfUrl?: string; stripeInvoiceHostedUrl?: string; stripePaymentStatus?: string }
export type StoredOrderItem = EmailOrderItem;


const DEFAULT_NOTIFICATION_EMAIL = "univers.mikawaii@hotmail.com";
const DEFAULT_NOTIFICATION_FROM = "L’Univers MiKawaii <onboarding@resend.dev>";

function getBusinessDetails() {
  return {
    name: process.env.BUSINESS_LEGAL_NAME?.trim() || "L’Univers MiKawaii",
    contactEmail: process.env.BUSINESS_CONTACT_EMAIL?.trim() || DEFAULT_NOTIFICATION_EMAIL,
    phone: process.env.BUSINESS_CONTACT_PHONE?.trim(),
    address: process.env.BUSINESS_ADDRESS?.trim(),
    siteUrl: process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "",
  };
}

function getOrderReference(order: StoredOrder) {
  const date = new Date(order.createdAt);
  const datePart = Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("fr-CA", { timeZone: "America/Toronto" }).replaceAll("-", "");
  return `MIK-${datePart}-${order.id.replaceAll("-", "").slice(-6).toUpperCase()}`;
}

function getPublicImageUrl(imageUrl?: string) {
  if (!imageUrl) return "";
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  const base = getBusinessDetails().siteUrl;
  return base && !base.includes("localhost") ? `${base}${imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`}` : "";
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("fr-CA", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Toronto",
  }).format(new Date(value));
}

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(value: string) {
  return escapeHtml(value).replace(/\r?\n/g, "<br/>");
}

function customizationBadges(item: StoredOrderItem) {
  if (!item.customization) return [] as string[];

  const badges: string[] = [
    `${item.customization.scoopCount} boule(s)`,
    `${getScoopArticleCount(item.id, item.customization.scoopCount)} articles`,
    item.customization.audience === "child" ? "Pour un enfant" : "Pour un adulte",
  ];
  if (item.customization.surpriseStar) badges.push("Etoile surprise");
  if (item.customization.socialMediaVideo) badges.push("Video reseaux sociaux");

  return badges;
}

function formatCustomization(item: StoredOrderItem) {
  if (!item.customization) return "";

  const parts: string[] = [
    `boules: ${item.customization.scoopCount}`,
    `articles: ${getScoopArticleCount(item.id, item.customization.scoopCount)}`,
    `public: ${item.customization.audience === "child" ? "enfant" : "adulte"}`,
  ];
  if (item.customization.surpriseStar) parts.push("etoile surprise");
  if (item.customization.socialMediaVideo) parts.push("video reseaux: oui");
  if (item.customization.recipientName?.trim())
    parts.push(`destinataire: ${item.customization.recipientName.trim()}`);
  if (item.customization.notes.trim()) parts.push(
`notes: ${item.customization.notes.trim()}`);

  return ` (${parts.join(", ")})`;
}

function formatShippingAddressPlainText(order: StoredOrder) {
  const address = order.shippingAddress;
  if (!address) return [];

  const addressLines = [
    address.line1,
    address.line2,
    [address.city, address.state].filter(Boolean).join(", "),
    [address.postalCode, address.country].filter(Boolean).join(" "),
  ].filter((line) => line && line.trim().length > 0);

  return [
    "",
    "Adresse de livraison:",
    ...(address.name ? [address.name] : []),
    ...addressLines,
  ];
}

const EMAIL_WRAPPER_STYLE =
  "font-family: -apple-system, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #fdf2f8; padding: 24px;";
const CARD_STYLE =
  "max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fbcfe8;";
const HEADER_STYLE =
  "background: linear-gradient(135deg, #f9a8d4, #c4b5fd); padding: 24px; text-align: center;";
const BODY_STYLE = "padding: 24px; color: #374151; font-size: 14px; line-height: 1.6;";
const ITEM_CARD_STYLE =
  "border: 1px solid #f3e8ff; border-radius: 12px; padding: 16px; margin-bottom: 12px; background-color: #fdf4ff;";
const BADGE_STYLE =
  "display: inline-block; background-color: #ede9fe; color: #6d28d9; border-radius: 999px; padding: 4px 10px; font-size: 12px; margin: 2px 4px 2px 0;";
const NOTES_STYLE =
  "margin-top: 10px; padding: 10px 12px; background-color: #ffffff; border-left: 3px solid #f0abfc; border-radius: 6px; font-size: 13px; color: #4b5563; word-break: break-word;";
const TOTALS_ROW_STYLE = "display: flex; justify-content: space-between; padding: 4px 0;";
const FOOTER_STYLE =
  "padding: 16px 24px; text-align: center; font-size: 12px; color: #9ca3af; background-color: #fdf2f8;";

function getDeliveryDisplayLabel(order: StoredOrder) {
  const base = order.deliveryLabel ?? "Livraison";
  if (!order.deliverySector) return base;
  const sectors: Record<string, string> = {
    limoilou: "Limoilou",
    beauport: "Beauport",
    charlesbourg: "Charlesbourg",
  };
  return `${base} — ${sectors[order.deliverySector] ?? order.deliverySector}`;
}

function buildItemHtml(item: StoredOrderItem, currency: string) {
  const badges = customizationBadges(item);
  const notes = item.customization?.notes.trim();
  const recipientName = item.customization?.recipientName?.trim();
  const imageUrl = getPublicImageUrl(item.imageUrl);

  return `
    <div style="${ITEM_CARD_STYLE}">
      <div style="display: flex; align-items: flex-start; gap: 12px;">
        ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(item.name)}" width="64" height="64" style="width:64px;height:64px;border-radius:10px;object-fit:cover;display:block;" />` : ""}
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; gap: 8px; font-weight: 600; color: #1f2937;">
            <span>${item.quantity} × ${escapeHtml(item.name)}</span>
            <span style="white-space: nowrap;">${formatCurrency(item.unitPrice * item.quantity, currency)}</span>
          </div>
          ${recipientName ? `<div style="margin-top: 6px; font-size: 13px; color: #be185d; font-weight: 600;">Destinataire : ${escapeHtml(recipientName)}</div>` : ""}
          ${badges.length > 0 ? `<div style="margin-top: 8px;">${badges.map((badge) => `<span style="${BADGE_STYLE}">${escapeHtml(badge.replace("Video reseaux sociaux", "Vidéo pour réseaux sociaux").replace("Etoile", "Étoile"))}</span>`).join("")}</div>` : ""}
        </div>
      </div>
      ${notes ? `<div style="${NOTES_STYLE}"><strong>Notes client :</strong><br/>${nl2br(notes)}</div>` : ""}
    </div>
  `;
}

function buildTotalsHtml(order: StoredOrder) {
  const itemsSubtotal = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = itemsSubtotal + order.shippingAmount;
  const deliveryLabel = getDeliveryDisplayLabel(order);

  return `
    <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed #e5e7eb;">
      <div style="${TOTALS_ROW_STYLE} color: #6b7280;">
        <span>Sous-total</span><span>${formatCurrency(itemsSubtotal, order.currency)}</span>
      </div>
      <div style="${TOTALS_ROW_STYLE} color: #6b7280;">
        <span>${escapeHtml(deliveryLabel)}</span><span>${formatCurrency(order.shippingAmount, order.currency)}</span>
      </div>
      <div style="${TOTALS_ROW_STYLE} font-weight: 700; font-size: 16px; color: #1f2937; margin-top: 4px;">
        <span>Total</span><span>${formatCurrency(total, order.currency)}</span>
      </div>
    </div>
  `;
}

function buildShippingAddressHtml(order: StoredOrder) {
  const address = order.shippingAddress;
  if (!address) return "";

  const addressLines = [
    address.line1,
    address.line2,
    [address.city, address.state].filter(Boolean).join(", "),
    [address.postalCode, address.country].filter(Boolean).join(" "),
  ].filter((line) => line && line.trim().length > 0);

  return `
    <div style="margin-top: 16px; padding: 14px 16px; background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px;">
      <div style="font-weight: 700; color: #9a3412; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;">
        Adresse de livraison
      </div>
      ${address.name ? `<div style="font-weight: 600; color: #1f2937;">${escapeHtml(address.name)}</div>` : ""}
      ${addressLines.map((line) => `<div style="color: #4b5563; font-size: 13px;">${escapeHtml(line!)}</div>`).join("")}
    </div>
  `;
}

function buildBusinessFooterHtml() {
  const business = getBusinessDetails();
  const contactUrl = business.siteUrl && !business.siteUrl.includes("localhost")
    ? `${business.siteUrl}/contact`
    : `mailto:${business.contactEmail}`;
  const lines = [
    escapeHtml(business.name),
    business.address ? escapeHtml(business.address) : "",
    `<a href="${escapeHtml(contactUrl)}" style="color:#7c3aed;">${escapeHtml(business.contactEmail)}</a>`,
    business.phone ? escapeHtml(business.phone) : "",
  ].filter(Boolean);
  return `<div>${lines.join("<br/>")}</div>`;
}

function getDeliveryInstructions(order: StoredOrder) {
  if (order.deliveryMethod === "pickup") {
    return "Votre commande sera préparée, puis nous vous écrirons pour convenir du moment de cueillette au Terminus Beauport.";
  }
  if (order.deliveryMethod === "mikawaii-express") {
    return "Votre commande est confirmée pour la livraison Mikawaii-Express. Nous vous communiquerons le moment prévu après la préparation.";
  }
  return "Votre commande est confirmée pour l’expédition par Postes Canada. Le numéro de suivi sera envoyé par courriel lorsqu’il sera disponible.";
}

function buildVendorEmailHtml(order: StoredOrder) {
  const recipient = process.env.ORDER_NOTIFICATION_EMAIL ?? DEFAULT_NOTIFICATION_EMAIL;
  const reference = getOrderReference(order);

  return `

    <div style="${EMAIL_WRAPPER_STYLE}">
      <div style="${CARD_STYLE}">
        <div style="${HEADER_STYLE}">
          <div style="font-size: 22px; font-weight: 700; color: #4c1d95;">Nouvelle commande payée</div>
          <div style="font-size: 13px; color: #581c87; margin-top: 4px;">L’Univers MiKawaii</div>
        </div>
        <div style="${BODY_STYLE}">
          <div style="margin-bottom: 16px; font-size: 13px; color: #6b7280;">
            <div><strong>Commande Stripe :</strong> ${escapeHtml(order.id)}</div>
            <div><strong>Référence :</strong> ${escapeHtml(reference)}</div>
            <div><strong>Date :</strong> ${escapeHtml(formatDateTime(order.createdAt))}</div>
            <div><strong>Statut :</strong> Payée</div>
            <div><strong>Notification envoyée à :</strong> ${escapeHtml(recipient)}</div>
          </div>
          <div style="font-weight: 700; margin-bottom: 8px; color: #1f2937;">Articles commandés</div>
          ${order.items.map((item) => buildItemHtml(item, order.currency)).join("")}
          ${buildTotalsHtml(order)}
          ${buildShippingAddressHtml(order)}
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px dashed #e5e7eb; font-size: 12px; color: #9ca3af;">
            <div>Stripe session: ${escapeHtml(order.stripeSessionId ?? "n/a")}</div>
            <div>Stripe customer: ${escapeHtml(order.stripeCustomerId ?? "n/a")}</div>
            <div>Stripe payment intent: ${escapeHtml(order.stripePaymentIntentId ?? "n/a")}</div>
            <div>Email acheteur: ${escapeHtml(order.buyerEmail ?? "n/a")}</div>
          </div>
        </div>
        <div style="${FOOTER_STYLE}">
          L’Univers MiKawaii &mdash; notification interne automatique<br/>
          ${buildBusinessFooterHtml()}
        </div>
      </div>
    </div>
  `;
}

function buildInvoiceNoticeHtml(order: StoredOrder, hasAttachment: boolean) {
  if (hasAttachment) {
    return `
      <div style="text-align: center; margin: 20px 0; padding: 12px; border-radius: 12px; background: #f5f3ff; color: #5b21b6; font-size: 13px; font-weight: 600;">
        Votre facture marquée PAYÉE est jointe à ce courriel en format PDF.
      </div>
    `;
  }

  if (order.stripeInvoicePdfUrl) {
    return `
      <div style="text-align: center; margin: 20px 0; padding: 12px; border-radius: 12px; background: #f5f3ff; color: #5b21b6; font-size: 13px; font-weight: 600;">
        La pièce jointe facture n'a pas pu être générée. Vous pouvez télécharger votre facture ici :
        <a href="${escapeHtml(order.stripeInvoicePdfUrl)}" style="color:#6d28d9;">ouvrir la facture PDF</a>.
      </div>
    `;
  }

  return `
    <div style="text-align: center; margin: 20px 0; padding: 12px; border-radius: 12px; background: #f5f3ff; color: #5b21b6; font-size: 13px; font-weight: 600;">
      Votre facture est en cours de préparation et pourra vous être renvoyée sur demande.
    </div>
  `;
}

function buildBuyerEmailHtml(order: StoredOrder, hasInvoiceAttachment: boolean) {
  const reference = getOrderReference(order);
  const instructions = getDeliveryInstructions(order);
  const deliveryLabel = getDeliveryDisplayLabel(order);

  return `
    <div style="${EMAIL_WRAPPER_STYLE}">
      <div style="${CARD_STYLE}">
        <div style="${HEADER_STYLE}">
          <div style="font-size: 22px; font-weight: 700; color: #4c1d95;">Merci pour votre commande !</div>
          <div style="font-size: 13px; color: #581c87; margin-top: 4px;">L’Univers MiKawaii</div>
        </div>
        <div style="${BODY_STYLE}">
          <p>Bonjour,</p>
          <p>Nous avons bien reçu votre commande et votre paiement a été confirmé. Voici votre récapitulatif.</p>
          <div style="margin: 16px 0; padding: 14px; background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 12px; color: #6b21a8;">
            <div><strong>Numéro de commande :</strong> ${escapeHtml(reference)}</div>
            <div><strong>Mode de livraison :</strong> ${escapeHtml(deliveryLabel)}</div>
            <div><strong>Date :</strong> ${escapeHtml(formatDateTime(order.createdAt))}</div>
          </div>
          <div style="margin: 16px 0; padding: 14px 16px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; color: #166534;">
            <strong>Prochaine étape</strong><br/>${escapeHtml(instructions)}
          </div>
          <div style="font-weight: 700; margin: 18px 0 8px; color: #1f2937;">Articles commandés</div>
          ${order.items.map((item) => buildItemHtml(item, order.currency)).join("")}
          ${buildTotalsHtml(order)}
          ${buildShippingAddressHtml(order)}
          ${buildInvoiceNoticeHtml(order, hasInvoiceAttachment)}
          <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
            Politique : toutes les ventes sont finales, sous réserve des recours obligatoires prévus par la loi. Conservez votre numéro de commande pour toute communication avec nous.
          </p>
          <p style="margin-top: 16px;">Merci de votre confiance !<br/>L’équipe de L’Univers MiKawaii</p>
        </div>
        <div style="${FOOTER_STYLE}">
          ${buildBusinessFooterHtml()}
          <div style="margin-top: 8px;">Courriel automatique de confirmation — ne partagez pas vos données de paiement en répondant à ce message.</div>
        </div>
      </div>
    </div>
  `;
}

function buildPlainTextBody(order: StoredOrder) {
  const itemsSubtotal = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = itemsSubtotal + order.shippingAmount;
  const recipient = process.env.ORDER_NOTIFICATION_EMAIL ?? DEFAULT_NOTIFICATION_EMAIL;

  const lines = [
    "Nouvelle commande payee",
    "",
    `Commande: ${order.id}`,
    `Date: ${new Date().toLocaleString("fr-CA")}`,
    `Statut: ${order.status}`,
    `Destinataire notification: ${recipient}`,
    "",
    "Articles:",
    ...order.items.map(
      (item) =>
        `- ${item.quantity} x ${item.name}${formatCustomization(item)} @ ${formatCurrency(item.unitPrice, order.currency)}`
    ),
    "",
    `Sous-total: ${formatCurrency(itemsSubtotal, order.currency)}`,
    `${getDeliveryDisplayLabel(order)}: ${formatCurrency(order.shippingAmount, order.currency)}`,
    `Total: ${formatCurrency(total, order.currency)}`,
    ...formatShippingAddressPlainText(order),
    "",
    `Stripe session: ${order.stripeSessionId ?? "n/a"}`,
    `Stripe customer: ${order.stripeCustomerId ?? "n/a"}`,
    `Stripe payment intent: ${order.stripePaymentIntentId ?? "n/a"}`,
  ];

  return lines.join("\n");
}

function buildBuyerPlainTextBody(order: StoredOrder, hasInvoiceAttachment: boolean) {
  const itemsSubtotal = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const total = itemsSubtotal + order.shippingAmount;
  const business = getBusinessDetails();

  return [
    `Merci pour votre commande chez ${business.name} !`,
    "",
    `Numéro de commande : ${getOrderReference(order)}`,
    `Référence technique Stripe : ${order.stripePaymentIntentId ?? order.stripeSessionId ?? order.id}`,
    `Date : ${formatDateTime(order.createdAt)}`,
    `Mode de livraison : ${getDeliveryDisplayLabel(order)}`,
    "",
    `Prochaine étape : ${getDeliveryInstructions(order)}`,
    "",
    "Articles :",
    ...order.items.map((item) => `- ${item.quantity} × ${item.name}${formatCustomization(item)} @ ${formatCurrency(item.unitPrice, order.currency)}`),
    "",
    `Sous-total : ${formatCurrency(itemsSubtotal, order.currency)}`,
    `${getDeliveryDisplayLabel(order)} : ${formatCurrency(order.shippingAmount, order.currency)}`,
    `Total payé : ${formatCurrency(total, order.currency)}`,
    ...formatShippingAddressPlainText(order),
    "",
    ...(hasInvoiceAttachment
      ? ["La facture marquée PAYÉE est jointe à ce courriel en format PDF."]
      : order.stripeInvoicePdfUrl
        ? [`La pièce jointe facture n'a pas pu être générée. Vous pouvez télécharger la facture ici : ${order.stripeInvoicePdfUrl}`]
        : ["La facture est en cours de préparation et pourra vous être renvoyée sur demande."]),
    "",
    `Pour toute question : ${business.contactEmail}${business.phone ? ` ou ${business.phone}` : ""}`,
    ...(business.address ? [`${business.name} — ${business.address}`] : []),
    "",
    "Merci de votre confiance !",
    business.name,
  ].join("\n");
}

type SendResult =
  | { sent: true; skipped: false }
  | { sent: false; skipped: true; reason: string }
  | { sent: false; skipped: false; reason: string };

async function sendViaResend(params: {
  to: string;
  subject: string;
  text: string;
  html: string;
  idempotencyKey?: string;
  replyTo?: string;
  attachments?: Array<{ filename: string; content: string }>;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_NOTIFICATION_FROM?.trim() || DEFAULT_NOTIFICATION_FROM;

  if (!apiKey || !from) {
    const reason = "Missing RESEND_API_KEY or ORDER_NOTIFICATION_FROM.";
    console.warn(`[order-notification] Email skipped (to: ${params.to}). ${reason}`);
    return { sent: false, skipped: true, reason };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(params.idempotencyKey ? { "Idempotency-Key": params.idempotencyKey } : {}),
      },
      body: JSON.stringify({
        from,
        to: [params.to],
        subject: params.subject,
        text: params.text,
        html: params.html,
        ...(params.attachments ? { attachments: params.attachments } : {}),
        ...(params.replyTo ? { reply_to: params.replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const errorPayload = await response.text();
      console.error(
        `[order-notification] Resend rejected email (to: ${params.to}, status: ${response.status}): ${errorPayload}`
      );
      return { sent: false, skipped: false, reason: `HTTP ${response.status}: ${errorPayload}` };
    }

    console.log(`[order-notification] Email sent successfully to ${params.to}.`);
    return { sent: true, skipped: false };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown network error.";
    console.error(`[order-notification] Email send threw (to: ${params.to}): ${reason}`);
    return { sent: false, skipped: false, reason };
  }
}

function createPaidInvoicePdf(order: StoredOrder) {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({ size: "A4", margin: 48, info: { Title: `Facture ${getOrderReference(order)}` } });
    const business = getBusinessDetails();
    const itemsSubtotal = order.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    const total = itemsSubtotal + order.shippingAmount;

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fillColor("#4a3b47").font("Helvetica-Bold").fontSize(22).text(business.name);
    doc.moveDown(0.35).font("Helvetica-Bold").fontSize(17).fillColor("#15803d").text("FACTURE — PAYÉE");
    doc.moveDown(0.55).font("Helvetica").fontSize(10).fillColor("#374151");
    doc.text(`Numéro : ${getOrderReference(order)}`);
    doc.text(`Date : ${formatDateTime(order.createdAt)}`);
    doc.text(`Courriel du client : ${order.buyerEmail ?? "Non fourni"}`);
    doc.text(`Mode de livraison : ${getDeliveryDisplayLabel(order)}`);
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(12).text("Articles commandés");
    doc.moveDown(0.35);

    for (const item of order.items) {
       doc.font("Helvetica-Bold").fontSize(10).text(
         `${item.quantity} × ${item.name} — ${formatCurrency(item.unitPrice * item.quantity, order.currency)}`
       );
       if (item.customization) {
         const c = item.customization;
         const details = [
           `${c.scoopCount} scoop${c.scoopCount > 1 ? "s" : ""}`,
           `Articles : ${getScoopArticleCount(item.id, c.scoopCount)}`,
           `Public : ${c.audience === "child" ? "Enfant" : "Adulte"}`,
           `Étoile surprise : ${c.surpriseStar ? "Oui" : "Non"}`,
           `Vidéo réseaux sociaux : ${c.socialMediaVideo ? "Oui" : "Non"}`,
           c.recipientName?.trim() ? `Destinataire : ${c.recipientName.trim()}` : "",
           c.notes.trim() ? `Préférences : ${c.notes.trim()}` : "",
         ].filter(Boolean);

         doc.font("Helvetica").fontSize(9).fillColor("#374151");
         for (const detail of details) {
           doc.text(`• ${detail}`, { indent: 10, width: 480, align: "left" });
         }
       }
       doc.moveDown(0.55);
    }

    doc.moveDown(0.3).strokeColor("#e5e7eb").moveTo(48, doc.y).lineTo(547, doc.y).stroke();
    doc.moveDown(0.45).fillColor("#374151").font("Helvetica").fontSize(10);
    doc.text(`Sous-total : ${formatCurrency(itemsSubtotal, order.currency)}`, { align: "right" });
    doc.text(`${getDeliveryDisplayLabel(order)} : ${formatCurrency(order.shippingAmount, order.currency)}`, { align: "right" });
    doc.moveDown(0.25).font("Helvetica-Bold").fontSize(13).fillColor("#15803d");
    doc.text(`TOTAL PAYÉ : ${formatCurrency(total, order.currency)}`, { align: "right" });
    doc.moveDown(0.8).font("Helvetica").fontSize(9).fillColor("#6b7280");
    doc.text(`Référence Stripe : ${order.stripePaymentIntentId ?? order.stripeSessionId ?? order.id}`);
    doc.text("Aucun montant additionnel n’est dû sur cette commande.");

    if (order.shippingAddress) {
      const address = order.shippingAddress;
      doc.moveDown().fillColor("#4a3b47").font("Helvetica-Bold").fontSize(10).text("Adresse de livraison");
      doc.font("Helvetica").fontSize(9).fillColor("#374151");
      [address.name, address.line1, address.line2, [address.city, address.state].filter(Boolean).join(", "), [address.postalCode, address.country].filter(Boolean).join(" ")]
        .filter(Boolean)
        .forEach((line) => doc.text(line!));
    }

    doc.moveDown(1).font("Helvetica").fontSize(8).fillColor("#6b7280");
    doc.text([business.name, business.address, business.contactEmail, business.phone].filter(Boolean).join(" · "), { align: "center" });
    doc.text("Cette facture confirme que le paiement a été reçu.", { align: "center" });
    doc.end();
  });
}

async function buildInvoiceAttachment(order: StoredOrder) {
  const filename = `facture-${getOrderReference(order)}.pdf`;

  const resolveStripeInvoicePdfUrl = async () => {
    if (order.stripeInvoicePdfUrl) {
      return order.stripeInvoicePdfUrl;
    }

    if (!order.stripeInvoiceId) {
      return undefined;
    }

    try {
      const stripe = getStripeServer();
      let invoice = await stripe.invoices.retrieve(order.stripeInvoiceId);
      for (let attempt = 0; !invoice.invoice_pdf && attempt < 2; attempt += 1) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        invoice = await stripe.invoices.retrieve(order.stripeInvoiceId);
      }
      return invoice.invoice_pdf ?? undefined;
    } catch (error) {
      console.error("[order-notification] Could not resolve Stripe invoice PDF URL.", {
        orderId: order.id,
        stripeSessionId: order.stripeSessionId,
        stripeInvoiceId: order.stripeInvoiceId,
        error: error instanceof Error ? error.message : "Unknown Stripe invoice lookup error.",
      });
      return undefined;
    }
  };

  const downloadStripeInvoicePdf = async () => {
    const invoicePdfUrl = await resolveStripeInvoicePdfUrl();
    if (!invoicePdfUrl) {
      return undefined;
    }

    try {
      const response = await fetch(invoicePdfUrl);
      if (!response.ok) {
        console.error("[order-notification] Stripe invoice PDF download failed.", {
          orderId: order.id,
          stripeSessionId: order.stripeSessionId,
          stripeInvoiceId: order.stripeInvoiceId,
          status: response.status,
        });
        return undefined;
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return {
        filename,
        content: buffer.toString("base64"),
      };
    } catch (error) {
      console.error("[order-notification] Stripe invoice PDF download threw.", {
        orderId: order.id,
        stripeSessionId: order.stripeSessionId,
        stripeInvoiceId: order.stripeInvoiceId,
        error: error instanceof Error ? error.message : "Unknown Stripe invoice download error.",
      });
      return undefined;
    }
  };

  try {
    const invoicePdf = await createPaidInvoicePdf(order);
    return {
      filename,
      content: invoicePdf.toString("base64"),
    };
  } catch (error) {
    console.error("[order-notification] Invoice PDF generation failed; trying Stripe invoice PDF fallback.", {
      orderId: order.id,
      stripeSessionId: order.stripeSessionId,
      error: error instanceof Error ? error.message : "Unknown PDF error.",
    });

    const fallbackAttachment = await downloadStripeInvoicePdf();
    if (fallbackAttachment) {
      return fallbackAttachment;
    }

    console.error("[order-notification] Invoice attachment unavailable after all fallback attempts.", {
      orderId: order.id,
      stripeSessionId: order.stripeSessionId,
    });
    return undefined;
  }
}

export async function sendPaidOrderNotification(order: StoredOrder) {
  const to = process.env.ORDER_NOTIFICATION_EMAIL ?? DEFAULT_NOTIFICATION_EMAIL;
  const invoiceAttachment = await buildInvoiceAttachment(order);

  return sendViaResend({
    to,
    subject: `Nouvelle commande payée ${getOrderReference(order)} – L’Univers MiKawaii`,
    text: buildPlainTextBody(order),
    html: buildVendorEmailHtml(order),
    idempotencyKey: `vendor-${order.stripeSessionId ?? order.id}`,
    ...(invoiceAttachment ? { attachments: [invoiceAttachment] } : {}),
  });
}

export async function sendBuyerOrderConfirmation(order: StoredOrder, buyerEmail: string) {
  const invoiceAttachment = await buildInvoiceAttachment(order);

  return sendViaResend({
    to: buyerEmail,
    subject: `Confirmation de commande ${getOrderReference(order)} – L’Univers MiKawaii`,
    text: buildBuyerPlainTextBody(order, Boolean(invoiceAttachment)),
    html: buildBuyerEmailHtml(order, Boolean(invoiceAttachment)),
    idempotencyKey: `buyer-${order.stripeSessionId ?? order.id}`,
    replyTo: getBusinessDetails().contactEmail,
    ...(invoiceAttachment ? { attachments: [invoiceAttachment] } : {}),
  });
}
