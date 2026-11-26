import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  CheckoutValidationError,
  resolveCheckoutItems,
  type ResolvedCheckoutItem,
} from "@/lib/checkout-pricing";
import { parseCheckoutRequestBody } from "@/lib/api-schemas";
import { takeRateLimitToken } from "@/lib/rate-limit";
import { getClientIp, resolveTrustedCheckoutOrigin } from "@/lib/request-security";
import { getStripeServer } from "@/lib/stripe-server";
import { getDeliveryOption } from "@/lib/delivery";
import { getProductImageUrl, getScoopArticleCount } from "@/lib/products";

export const runtime = "nodejs";

const CHECKOUT_RATE_LIMIT = {
  namespace: "checkout",
  max: 12,
  windowMs: 10 * 60 * 1000,
} as const;

function toCents(amount: number) {
  return Math.round(amount * 100);
}

function buildPreferenceMetadata(notes?: string) {
  const metadata: Record<string, string> = {};
  const normalized = notes?.trim() ?? "";
  const chunkSize = 450;

  for (let index = 0, chunk = 0; index < normalized.length; index += chunkSize, chunk += 1) {
    metadata[`preferences_${String(chunk).padStart(2, "0")}`] = normalized.slice(index, index + chunkSize);
  }

  return metadata;
}

function buildCheckoutCustomizationSummary(customization: ResolvedCheckoutItem["customization"], articleCount: number) {
  if (!customization) return undefined;

  return `Personnalisation : ${customization.scoopCount} scoop${customization.scoopCount > 1 ? "s" : ""} · ${articleCount} articles · ${customization.audience === "child" ? "enfant" : "adulte"}`;
}

function buildCustomizationMetadata(customization: ResolvedCheckoutItem["customization"]) {
  if (!customization) return {};

  return {
    scoopCount: String(customization.scoopCount),
    audience: customization.audience,
    surpriseStar: customization.surpriseStar ? "Oui" : "Non",
    socialMediaVideo: customization.socialMediaVideo ? "Oui" : "Non",
    recipientName: customization.recipientName.slice(0, 100),
    ...buildPreferenceMetadata(customization.notes),
  };
}

export async function POST(request: Request) {
  try {
    const rateLimit = takeRateLimitToken(getClientIp(request), CHECKOUT_RATE_LIMIT);
    if (!rateLimit.ok) {
      return NextResponse.json(
        { error: "Trop de tentatives de paiement. Veuillez patienter avant de reessayer." },
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

    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json({ error: "Requete invalide." }, { status: 400 });
    }

    const parsed = parseCheckoutRequestBody(rawBody);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status ?? 400 });
    }

    const { items, deliveryMethod } = parsed.data;

    const trustedOrigin = resolveTrustedCheckoutOrigin(request);
    if (!trustedOrigin.ok) {
      return NextResponse.json({ error: trustedOrigin.error }, { status: trustedOrigin.status });
    }

    const origin = trustedOrigin.origin;

    const resolvedItems = resolveCheckoutItems(items);
    const delivery = getDeliveryOption(deliveryMethod);

    if (!delivery) {
      return NextResponse.json(
        { error: "Veuillez choisir un mode de livraison." },
        { status: 400 }
      );
    }

    const shipping = resolvedItems.length > 0 ? delivery.price : 0;

    const currency = (process.env.STRIPE_CURRENCY ?? "cad").toLowerCase();
    const stripe = getStripeServer();

    const orderId = crypto.randomUUID();

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = resolvedItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency,
        unit_amount: toCents(item.unitPrice),
        product_data: {
          name: item.name.slice(0, 250),
          description: buildCheckoutCustomizationSummary(item.customization, getScoopArticleCount(item.id, item.customization?.scoopCount ?? 1)),
          metadata: {
            productId: String(item.id),
            catalogName: item.name,
            image: getProductImageUrl(item.id),
            ...buildCustomizationMetadata(item.customization),
          },
        },
      },
    }));

    if (shipping > 0) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency,
          unit_amount: toCents(shipping),
          product_data: {
            name: "Livraison",
            description: delivery.label,
          },
        },
      });
    }

    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        line_items: lineItems,
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cancel`,
        locale: "fr",
        billing_address_collection: "required",
        custom_fields:
          delivery.id === "mikawaii-express"
            ? [
                {
                  key: "delivery_sector",
                  label: { type: "custom", custom: "Secteur Mikawaii-Express" },
                  type: "dropdown",
                  dropdown: {
                    options: [
                      { label: "Limoilou", value: "limoilou" },
                      { label: "Beauport", value: "beauport" },
                      { label: "Charlesbourg", value: "charlesbourg" },
                    ],
                  },
                },
              ]
            : undefined,
        shipping_address_collection:
          delivery.id === "mikawaii-express" || delivery.id === "canada-post"
            ? { allowed_countries: ["CA"] }
            : undefined,
        customer_creation: "always",
        invoice_creation: { enabled: true },
        excluded_payment_method_types: ["klarna", "paypal"],
        metadata: {
          orderId,
          salesPolicyAccepted: "true",
          salesPolicyVersion: "2026-11-22",
          deliveryMethod: delivery.id,
          deliveryLabel: delivery.label,
          deliveryPrice: shipping.toFixed(2),
        },
        client_reference_id: orderId,
      },
      {
        idempotencyKey: request.headers.get("x-idempotency-key") ?? orderId,
      }
    );

    if (!session.url) {
      return NextResponse.json({ error: "Session Stripe invalide (URL manquante)." }, { status: 500 });
    }

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    if (error instanceof CheckoutValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Erreur Stripe inconnue.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
