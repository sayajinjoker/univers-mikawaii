# Nov 28 Launch Gate - Univers MiKawaii

Use this checklist as the live go/no-go sign-off for launch day.

Checked boxes below reflect what has already been validated in local/sandbox; re-confirm in production before go-live.

## A) Critical Blockers (must all be YES)

- [ ] Secrets rotated (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`)
- [ ] Production env verified (`CHECKOUT_ALLOWED_ORIGINS`, `NEXT_PUBLIC_APP_URL`, Stripe/Resend vars)
- [ ] Webhook end-to-end test passed (at least 2 paid test checkouts)
- [x] Vendor + buyer emails sent successfully on test orders
- [x] `/api/webhooks/stripe` returns 200 on real checkout events
- [x] Reconciliation run completed and reviewed (`npm run reconcile:stripe`)
- [ ] No unresolved paid-unfulfilled live orders (or each has documented manual resolution)
- [x] Dev-only routes locked/disabled in production (`app/api/dev/test-email/route.ts`)
- [ ] Legal pages reviewed for consistency (sales/final sale, delivery, privacy, business/contact details)

## B) Transactional Safety Checks (must all be YES)

- [ ] One retry scenario tested (refresh/re-submit) without duplicate fulfillment issue
- [ ] Reconciliation owner assigned (name + backup)
- [ ] Incident SLA defined (paid without `fulfilledAt` > 15 min = incident)
- [ ] Refund/dispute SOP documented (who, where, response time)

## C) Day-1 Operations (must all be YES)

- [ ] Stripe webhook deliveries monitored in dashboard
- [ ] Vercel logs monitored for 5xx and webhook errors
- [ ] Manual reconciliation cadence set (minimum daily; preferred every few hours)
- [ ] If backlog exists, apply backfill/replay workflow (`npm run reconcile:backfill -- --dry-run <sessionIds>` then real run)
- [ ] Support contact path tested (customer can reach business)


## D) Nice-to-Have (can be after launch)

- [ ] Enable Vercel Cron route (`/api/cron/reconcile?hours=24`) with `CRON_SECRET`
- [ ] Configure reconciliation alert recipient (`RECON_ALERT_EMAIL` or fallback `ORDER_NOTIFICATION_EMAIL`)
- [ ] Add CSP in `next.config.ts`
- [ ] Move rate limiting from in-memory store to shared store
- [ ] Improve reconciliation output (CSV/action columns)
- [ ] Fix image `sizes` warning for `next/image` `fill`

## Final Decision Rule

- GO: all items in sections A, B, and C are checked YES.
- NO-GO: any unchecked item in sections A, B, or C.

