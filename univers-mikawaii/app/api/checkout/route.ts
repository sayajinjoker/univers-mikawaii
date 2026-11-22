import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  buildCustomizationDescription,
  resolveCheckoutItems,
  type CheckoutItemInput,
} from "@/lib/checkout-pricing";
import { getStripeServer } from "@/lib/stripe-server";
import { getDeliveryOption, type DeliveryMethod } from "@/lib/delivery";
import { getProductImageUrl } from "@/lib/products";

interface CheckoutRequestBody {
  items?: CheckoutItemInput[];
  acceptedSalesPolicy?: boolean;
  deliveryMethod?: DeliveryMethod;
}

export const runtime = "nodejs";

function toCents(amount: number) {
  return Math.round(amount * 100);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutRequestBody;
    const items = body.items ?? [];

    if (body.acceptedSalesPolicy !== true) {
      return NextResponse.json(
        { error: "Vous devez accepter la politique de vente finale avant le paiement." },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Le panier est vide." }, { status: 400 });
    }

    const resolvedItems = resolveCheckoutItems(items);
    const delivery = getDeliveryOption(body.deliveryMethod);

    if (!delivery) {
      return NextResponse.json(
        { error: "Veuillez choisir un mode de livraison." },
        { status: 400 }
      );
    }

    const shipping = resolvedItems.length > 0 ? delivery.price : 0;

    const currency = (process.env.STRIPE_CURRENCY ?? "cad").toLowerCase();
    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const stripe = getStripeServer();

    const orderId = crypto.randomUUID();

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = resolvedItems.map((item) => ({
      quantity: item.quantity,
      price_data: {
        currency,
        unit_amount: toCents(item.unitPrice),
        product_data: {
          name: item.name,
          description: buildCustomizationDescription(item.customization),
          metadata: {
            productId: String(item.id),
            image: getProductImageUrl(item.id),
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

    const session = await stripe.checkout.sessions.create({
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
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: `Commande ${orderId}`,
          metadata: {
            orderId,
            salesPolicyAccepted: "true",
            salesPolicyVersion: "2026-11-22",
            deliveryMethod: delivery.id,
            deliveryLabel: delivery.label,
            deliveryPrice: shipping.toFixed(2),
          },
        },
      },
      automatic_tax: {
        enabled: true,
      },
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
    });

    if (!session.url) {
      return NextResponse.json({ error: "Session Stripe invalide (URL manquante)." }, { status: 500 });
    }

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur Stripe inconnue.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
