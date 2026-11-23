import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripeServer() {
  const secretKey = process.env.STRIPE_SECRET_KEY ?? process.env.MIKAWAII_STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("Configuration Stripe manquante (STRIPE_SECRET_KEY ou MIKAWAII_STRIPE_SECRET_KEY).");
  }

  if (!stripeInstance) {
    stripeInstance = new Stripe(secretKey);
  }

  return stripeInstance;
}
