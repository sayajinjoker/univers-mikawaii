import Stripe from "stripe";
import nextEnv from "@next/env";
import { writeFileSync } from "node:fs";

// Mirror Next.js env loading so local scripts can read .env.local without manual exports.
const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd(), false, { info: () => {}, error: () => {} });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? process.env.MIKAWAII_STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("Missing STRIPE_SECRET_KEY (or MIKAWAII_STRIPE_SECRET_KEY).");
  process.exit(1);
}

const args = process.argv.slice(2);

function parseOptions(rawArgs) {
  let lookbackHours = 24;
  let csv = false;
  let outPath = null;

  for (let i = 0; i < rawArgs.length; i += 1) {
    const arg = rawArgs[i];
    if (arg === "--csv") {
      csv = true;
      continue;
    }

    if (arg === "--out") {
      outPath = rawArgs[i + 1] ?? null;
      i += 1;
      continue;
    }

    const parsed = Number.parseInt(arg, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      lookbackHours = parsed;
    }
  }

  return { lookbackHours, csv, outPath };
}

const { lookbackHours, csv: csvEnabled, outPath } = parseOptions(args);
const createdGte = Math.floor(Date.now() / 1000) - (lookbackHours * 60 * 60);

const stripe = new Stripe(stripeSecretKey);

let hasIssue = false;
const checkedAt = new Date();
const missingRows = [];

function recommendedAction(session) {
  if (session.livemode) {
    return "replay_webhook_or_manual_follow_up";
  }

  return "replay_webhook_or_mark_test_resolved";
}

function csvEscape(value) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function toCsv(rows) {
  const headers = [
    "session_id",
    "order_id",
    "created_utc",
    "created_local",
    "amount_total",
    "currency",
    "customer_email",
    "fulfilled_at",
    "livemode",
    "recommended_action",
  ];

  const lines = [headers.map(csvEscape).join(",")];
  for (const row of rows) {
    lines.push(
      [
        row.sessionId,
        row.orderId,
        row.createdUtc,
        row.createdLocal,
        row.amountTotal,
        row.currency,
        row.customerEmail,
        row.fulfilledAt,
        row.livemode,
        row.recommendedAction,
      ].map(csvEscape).join(",")
    );
  }

  return `${lines.join("\n")}\n`;
}

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
  const action = recommendedAction(session);
  console.log(`Action recommandee: ${action}`);
  console.log("Status: PAID but missing fulfilledAt metadata");

  missingRows.push({
    sessionId: session.id,
    orderId: session.metadata?.orderId ?? session.client_reference_id ?? "n/a",
    createdUtc: formatUtc(createdMs),
    createdLocal: formatLocal(createdMs),
    amountTotal: session.amount_total ?? 0,
    currency: (session.currency ?? "cad").toLowerCase(),
    customerEmail: session.customer_details?.email ?? session.customer_email ?? "n/a",
    fulfilledAt: session.metadata?.fulfilledAt ?? "",
    livemode: session.livemode,
    recommendedAction: action,
  });
}

if (csvEnabled) {
  const csvPayload = toCsv(missingRows);
  if (outPath) {
    writeFileSync(outPath, csvPayload, { encoding: "utf8" });
    console.log(`CSV report written to: ${outPath}`);
  } else {
    console.log("CSV report:");
    process.stdout.write(csvPayload);
  }
}

if (hasIssue) {
  console.error("Reconciliation found paid sessions with missing fulfillment marker.");
  process.exit(2);
}

console.log("No paid-unfulfilled sessions found in the selected window.");



