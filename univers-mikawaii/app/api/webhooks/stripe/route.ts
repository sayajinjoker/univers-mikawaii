import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendBuyerOrderConfirmation, sendPaidOrderNotification, type EmailOrderItem, type StoredOrder } from "@/lib/order-notification";
import { getStripeServer } from "@/lib/stripe-server";
export const runtime = "nodejs";
function parseCustomization(description?: string | null) {
  if (!description) return undefined;
  const parts = Object.fromEntries(description.split(" | ").map((part) => {
    const index = part.indexOf(": ");
    return index >= 0 ? [part.slice(0, index), part.slice(index + 2)] : [part, ""];
  }));
  const scoop = Number(parts["Scoop"]);
  return {
    scoopCount: scoop === 2 ? 2 : 1,
    notes: parts["Preferences"] ?? "",
    surpriseStar: parts["Etoile surprise"] === "Oui",
    socialMediaVideo: parts["Video reseaux"] === "Oui",
    recipientName: parts["Destinataire"]?.trim() || undefined,
  };
}
export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return NextResponse.json({ error: "Configuration Stripe manquante (STRIPE_WEBHOOK_SECRET)." }, { status: 500 });
  const stripe = getStripeServer();
  const payload = await request.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Signature Stripe manquante." }, { status: 400 });
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Signature Stripe invalide." }, { status: 400 });
  }
  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      const eventSession = event.data.object as Stripe.Checkout.Session;
      const session = await stripe.checkout.sessions.retrieve(eventSession.id, {
        expand: ["line_items", "line_items.data.price.product"],
      });
      const orderId = session.metadata?.orderId ?? session.client_reference_id ?? session.id;
      const buyerEmail = session.customer_details?.email ?? session.customer_email ?? undefined;
      const shipping = session.collected_information?.shipping_details;
      const shippingAddress = shipping ? {
        name: shipping.name ?? undefined,
        line1: shipping.address.line1 ?? undefined,
        line2: shipping.address.line2 ?? undefined,
        city: shipping.address.city ?? undefined,
        state: shipping.address.state ?? undefined,
        postalCode: shipping.address.postal_code ?? undefined,
        country: shipping.address.country ?? undefined,
      } : undefined;
      const items: EmailOrderItem[] = [];
      for (const line of session.line_items?.data ?? []) {
        const product = typeof line.price?.product === "object" ? line.price.product : null;
        const name = product && "name" in product ? product.name : line.description ?? "Article";
        if (name === "Livraison") continue;
        const quantity = line.quantity ?? 1;
        const unitAmount = line.price?.unit_amount ?? Math.round((line.amount_total ?? 0) / quantity);
        items.push({
          id: Number(line.price?.metadata?.productId ?? 0),
          name,
          unitPrice: unitAmount / 100,
          quantity,
          customization: parseCustomization(product && "description" in product ? product.description : line.description),
          imageUrl: product && "metadata" in product ? product.metadata.image || undefined : undefined,

        });
      }
      const shippingAmount = Number(session.metadata?.deliveryPrice ?? 0);
      const deliveryMethod = session.metadata?.deliveryMethod ?? "pickup";
      const deliveryLabel = session.metadata?.deliveryLabel ?? "Cueillette au Terminus Beauport";
      const deliverySector = session.custom_fields?.find((field) => field.key === "delivery_sector")?.dropdown?.value ?? undefined;
      const currency = session.currency ?? process.env.STRIPE_CURRENCY ?? "cad";
      const now = new Date().toISOString();
      const order: StoredOrder = {
        id: orderId,
        status: "paid",
        currency,
        shippingAmount,
        createdAt: now,
        updatedAt: now,
        items,
        buyerEmail,
        shippingAddress,
        deliveryMethod,
        deliveryLabel,
        deliverySector,
        stripeSessionId: session.id,
        stripeCustomerId: typeof session.customer === "string" ? session.customer : undefined,
        stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
        stripeInvoiceId: typeof session.invoice === "string" ? session.invoice : undefined,
        stripePaymentStatus: session.payment_status,
      };
      const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : undefined;
      if (buyerEmail && paymentIntentId) {
        try { await stripe.paymentIntents.update(paymentIntentId, { receipt_email: buyerEmail }); } catch (error) {
          console.warn("[webhook] Could not request Stripe receipt:", error);
        }
      }
      const customerId = typeof session.customer === "string" ? session.customer : undefined;
      if (customerId) {
        try { await stripe.customers.update(customerId, { preferred_locales: ["fr-CA", "fr"] }); } catch (error) {
          console.warn("[webhook] Could not set customer locale:", error);
        }
      }
      const invoiceId = order.stripeInvoiceId;
      if (invoiceId) {
        try {
          let invoice = await stripe.invoices.retrieve(invoiceId);
          if (invoice.status !== "paid") {
            try { invoice = await stripe.invoices.pay(invoiceId, { paid_out_of_band: true }); } catch (error) {
              console.warn("[webhook] Invoice could not be forced paid:", error);
            }
          }
          order.stripeInvoicePdfUrl = invoice.invoice_pdf ?? undefined;
          order.stripeInvoiceHostedUrl = invoice.hosted_invoice_url ?? undefined;
        } catch (error) {
          console.warn("[webhook] Could not retrieve invoice:", error);
        }
      }
      const vendorResult = await sendPaidOrderNotification(order);
      console.log(`[webhook] Vendor email result for ${order.id}:`, vendorResult);
      if (!vendorResult.sent) {
        throw new Error(
          `Notification vendeur non envoyée: ${"reason" in vendorResult ? vendorResult.reason : "raison inconnue"}`
        );
      }

      if (buyerEmail) {
        const buyerResult = await sendBuyerOrderConfirmation(order, buyerEmail);
        console.log(`[webhook] Buyer email result for ${order.id}:`, buyerResult);
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Erreur webhook inconnue." }, { status: 500 });
  }
}
