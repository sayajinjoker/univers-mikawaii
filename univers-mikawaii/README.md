This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Stripe Setup (Payments + Invoicing + Tax)

1. Copy `.env.example` to `.env.local`.
2. Add your Stripe test keys from the Stripe Dashboard.
3. Keep `NEXT_PUBLIC_APP_URL=http://localhost:3000` for local development.

Required variables:

```bash
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_CURRENCY=cad
STRIPE_ALLOWED_COUNTRIES=CA,US
CHECKOUT_ALLOWED_ORIGINS=http://localhost:3000
CRON_SECRET=change_me_for_cron_auth
RECON_ALERT_EMAIL=alerts@example.com
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
ORDER_NOTIFICATION_FROM="L’Univers MiKawaii <onboarding@resend.dev>"
ORDER_NOTIFICATION_EMAIL=univers.mikawaii@hotmail.com
```

Install dependencies (already added in `package.json`):

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Current implementation details:

- `app/api/checkout/route.ts`: creates Checkout Sessions with:
  - server-side price recalculation (does not trust client price)
  - Stripe Tax (`automatic_tax.enabled`)
  - invoice creation (`invoice_creation.enabled`)
  - customer creation (`customer_creation: "always"`)
- `app/api/webhooks/stripe/route.ts`: verifies Stripe signatures and updates order status.
- `app/api/webhooks/stripe/route.ts`: sends an internal email on paid orders via Resend.
- `app/success/page.tsx`: verifies payment status from `session_id` before clearing cart.

Dashboard checklist before production:

1. Enable Stripe Tax in your account and configure tax registrations.
2. Configure your business details, branding, and receipt settings.
3. Add your production domain to `NEXT_PUBLIC_APP_URL` in deployment environment variables.
4. Switch from test keys to live keys in deployment.

Local webhook testing:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` secret printed by `stripe listen` into `STRIPE_WEBHOOK_SECRET` in `.env.local`.

Test flow:

- Add products to cart and click `Payer maintenant` on `/panier`.
- You are redirected to Stripe Checkout.
- On success, Stripe redirects to `/success` and cart is cleared only after server-side payment confirmation.
- On cancel, Stripe redirects to `/cancel` and the cart stays intact.

Use Stripe test card `4242 4242 4242 4242` with any future expiry date and any CVC/ZIP in test mode.

Reconciliation check (paid sessions missing fulfillment marker):

```bash
npm run reconcile:stripe
```

Optional custom window (hours):

```bash
node ./scripts/reconcile-stripe-fulfillment.mjs 48
```

Backfill helper for historical paid sessions missing `fulfilledAt` metadata:

```bash
npm run reconcile:backfill -- --dry-run cs_test_xxx cs_test_yyy
npm run reconcile:backfill -- cs_test_xxx cs_test_yyy
```

Cron reconciliation endpoint (for Vercel Cron):

- Route: `GET /api/cron/reconcile?hours=24`
- Auth header required: `Authorization: Bearer <CRON_SECRET>`
- `vercel.json` uses a once-daily schedule (Hobby plan compatible).
- Sends an alert email only when missing paid sessions are found.
- Alert recipient uses `RECON_ALERT_EMAIL` (fallback: `ORDER_NOTIFICATION_EMAIL`).

Local cron endpoint test:

```bash
npm run reconcile:cron:local
```

Local security smoke checks (origin allowlist, validation status codes, contact rate limit):

```bash
npm run smoke:security
```

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
