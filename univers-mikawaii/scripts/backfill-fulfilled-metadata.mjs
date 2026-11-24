import nextEnv from "@next/env";
import Stripe from "stripe";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd(), false, { info: () => {}, error: () => {} });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? process.env.MIKAWAII_STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("Missing STRIPE_SECRET_KEY (or MIKAWAII_STRIPE_SECRET_KEY).");
  process.exit(1);
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const sessionIds = args.filter((arg) => arg !== "--dry-run");

if (sessionIds.length === 0) {
  console.error("Usage: node ./scripts/backfill-fulfilled-metadata.mjs [--dry-run] <sessionId> [sessionId ...]");
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey);

let updated = 0;
let skipped = 0;
let failed = 0;

for (const sessionId of sessionIds) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      console.warn(`[skip] ${sessionId} is not paid (status: ${session.payment_status}).`);
      skipped += 1;
      continue;
    }

    if (session.metadata?.fulfilledAt) {
      console.warn(`[skip] ${sessionId} already has fulfilledAt (${session.metadata.fulfilledAt}).`);
      skipped += 1;
      continue;
    }

    const metadataUpdate = {
      ...session.metadata,
      fulfilledAt: new Date().toISOString(),
      fulfillmentChannel: "manual-backfill",
      fulfillmentNote: "Reconciliation backfill",
    };

    if (dryRun) {
      console.log(`[dry-run] would update ${sessionId}`, metadataUpdate);
      skipped += 1;
      continue;
    }

    await stripe.checkout.sessions.update(sessionId, { metadata: metadataUpdate });
    console.log(`[ok] updated ${sessionId}`);
    updated += 1;
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    console.error(`[fail] ${sessionId} - ${reason}`);
    failed += 1;
  }
}

console.log("-");
console.log(`Updated: ${updated}`);
console.log(`Skipped: ${skipped}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  process.exit(2);
}

