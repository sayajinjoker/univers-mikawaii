import Stripe from "stripe";
import nextEnv from "@next/env";

// Mirror Next.js env loading so local scripts can read .env.local without manual exports.
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd(), false, { info: () => {}, error: () => {} });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? process.env.MIKAWAII_STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("Missing STRIPE_SECRET_KEY (or MIKAWAII_STRIPE_SECRET_KEY).");
  process.exit(1);
}

const hoursArg = Number.parseInt(process.argv[2] ?? "24", 10);
const lookbackHours = Number.isFinite(hoursArg) && hoursArg > 0 ? hoursArg : 24;
const createdGte = Math.floor(Date.now() / 1000) - (lookbackHours * 60 * 60);

const stripe = new Stripe(stripeSecretKey);

let hasIssue = false;
const checkedAt = new Date();

function formatUtc(value) {
  return new Date(value).toISOString();
}

function formatLocal(value) {
  return new Date(value).toLocaleString("fr-CA", { hour12: false });
}

console.log(`Reconciling paid sessions for the last ${lookbackHours} hour(s)...`);
console.log(`Checked at (UTC): ${formatUtc(checkedAt)}`);
console.log(`Checked at (local): ${formatLocal(checkedAt)}`);
console.log(`Window start (UTC): ${formatUtc(createdGte * 1000)}`);
console.log(`Window start (local): ${formatLocal(createdGte * 1000)}`);

for await (const session of stripe.checkout.sessions.list({
  created: { gte: createdGte },
  limit: 100,
})) {
  if (session.payment_status !== "paid") {
    continue;
  }

  const fulfilledAt = session.metadata?.fulfilledAt;
  if (fulfilledAt) {
    continue;
  }

  hasIssue = true;
  const createdMs = session.created * 1000;

  console.log("-");
  console.log(`Session: ${session.id}`);
  console.log(`Order ID: ${session.metadata?.orderId ?? session.client_reference_id ?? "n/a"}`);
  console.log(`Created (UTC): ${formatUtc(createdMs)}`);
  console.log(`Created (local): ${formatLocal(createdMs)}`);
  console.log(`Amount total: ${session.amount_total ?? 0} ${session.currency ?? "cad"}`);
  console.log(`Customer email: ${session.customer_details?.email ?? session.customer_email ?? "n/a"}`);
  console.log("Status: PAID but missing fulfilledAt metadata");
}

if (hasIssue) {
  console.error("Reconciliation found paid sessions with missing fulfillment marker.");
  process.exit(2);
}

console.log("No paid-unfulfilled sessions found in the selected window.");



