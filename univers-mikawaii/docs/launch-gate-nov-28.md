# Gate de Lancement 28 nov - Univers MiKawaii

Utiliser cette checklist comme validation go/no-go en direct le jour du lancement.

Les cases cochees ci-dessous reflètent ce qui a deja ete valide en local/sandbox; revalider en production avant le go-live.

Legende des categories:
- `Code` = necessite une modification de code
- `Validation` = test/verification uniquement
- `Texte/Politique` = wording legal/operations ou processus
- `Config Vercel` / `Config Stripe` / `Config Resend` = configuration plateforme

## A) Bloqueurs critiques (tous doivent etre OUI)

- [ ] Secrets rotates (`STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`) - `Config Stripe`, `Config Resend`, `Config Vercel`
- [ ] Variables de production verifiees (`CHECKOUT_ALLOWED_ORIGINS`, `NEXT_PUBLIC_APP_URL`, vars Stripe/Resend) - `Config Vercel`, `Validation`
- [ ] Test webhook de bout en bout reussi (au moins 2 paiements de test) - `Validation`, `Config Stripe`
- [x] Emails vendeur + acheteur envoyes avec succes sur commandes de test - `Validation`, `Config Resend`
- [x] `/api/webhooks/stripe` retourne 200 sur de vrais evenements checkout - `Validation`, `Config Stripe`
- [x] Reconciliation executee et revue (`npm run reconcile:stripe`) - `Validation`
- [ ] Aucun paiement live non resolu sans fulfillment (ou resolution manuelle documentee) - `Validation`, `Texte/Politique`
- [x] Routes dev-only verrouillees/desactivees en production (`app/api/dev/test-email/route.ts`) - `Code`, `Validation`
- [ ] Pages legales revues pour coherence (vente/vente finale, livraison, confidentialite, details entreprise/contact) - `Texte/Politique`

## B) Verifications de securite transactionnelle (tous doivent etre OUI)

- [ ] Un scenario de retry teste (refresh/re-submit) sans duplication de fulfillment - `Validation`
- [ ] Responsable reconciliation defini (titulaire + backup) - `Texte/Politique`
- [ ] SLA incident defini (paiement sans `fulfilledAt` > 15 min = incident) - `Texte/Politique`
- [ ] SOP refund/litige documentee (qui, ou, delai de reponse) - `Texte/Politique`

## C) Operations jour J (tous doivent etre OUI)

- [ ] Livraisons webhook Stripe surveillees dans le dashboard - `Config Stripe`, `Validation`
- [ ] Logs Vercel surveilles (5xx et erreurs webhook) - `Config Vercel`, `Validation`
- [ ] Heartbeat cron recu (email `[CRON][env] Reconciliation OK (0)` ou alerte en cas d'echec) - `Config Vercel`, `Config Resend`, `Validation`
- [ ] Cadence de reconciliation manuelle definie (minimum quotidien; idealement toutes les quelques heures) - `Texte/Politique`
- [ ] S'il y a un backlog, appliquer le workflow backfill/replay (`npm run reconcile:backfill -- --dry-run <sessionIds>` puis run reel) - `Validation`
- [ ] Chemin de contact support teste (un client peut joindre l'entreprise) - `Validation`, `Texte/Politique`

## D) Nice-to-have (possible apres lancement)

- [ ] Activer la route Cron Vercel (`/api/cron/reconcile?hours=24`) avec `CRON_SECRET` - `Config Vercel`
- [ ] Configurer le destinataire d'alerte reconciliation (`RECON_ALERT_EMAIL` ou fallback `ORDER_NOTIFICATION_EMAIL`) - `Config Vercel`, `Config Resend`
- [x] Ajouter une CSP dans `next.config.ts` - `Code`
- [ ] Migrer le rate limiting de la memoire locale vers un store partage - `Code`, `Config Vercel`
- [x] Ameliorer la sortie de reconciliation (colonnes CSV/actions) - `Code`
- [x] Corriger l'avertissement `sizes` des images `next/image` avec `fill` - `Code`

## F) Tableau de suivi pre-release (Restant / En cours / Fait)

| Type de verification | Restant | En cours | Fait |
| --- | --- | --- | --- |
| Code | Rate limiting avec store partage. | - | Route dev verrouillee en prod (`app/api/dev/test-email/route.ts`).<br>CSP dans `next.config.ts`.<br>Sortie reconciliation (CSV/actions).<br>`next/image` + `sizes` avec `fill`. |
| Validation developpeur / tests techniques | Retry checkout sans duplication de fulfillment.<br>Aucun paiement live non resolu sans fulfillment.<br>Surveillance active webhook/logs jour J.<br>Reception heartbeat cron (ou alerte). | - | Emails vendeur/acheteur testes OK.<br>Webhook `200` sur checkout.<br>Reconciliation executee/revue. |
| Config production (Vercel/Stripe/Resend) | Secrets rotates.<br>Variables prod verifiees.<br>Cron + alertes reconciliation actives (`CRON_SECRET`, `RECON_ALERT_EMAIL`). | - | - |
| Validation equipe Univers MiKawaii (operations) | Responsable reconciliation + backup.<br>SLA incident define.<br>SOP refund/litige.<br>Cadence de reconciliation manuelle.<br>Support client teste. | - | - |
| Validation texte/politique/legal | Relecture et validation des pages legales (vente, livraison, confidentialite, contact). | - | - |

## Regle de decision finale

- GO: tous les items des sections A, B et C sont coches OUI.
- NO-GO: au moins un item non coche dans A, B ou C.

## E) Items restants uniquement cote code (non coches)

- Aucun item `Code` non coche dans les sections A, B ou C (bloqueurs de lancement).
- [ ] Migrer le rate limiting de la memoire locale vers un store partage - `Code`, `Config Vercel`

