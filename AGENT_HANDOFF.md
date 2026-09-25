# Property Arena NG — Agent Handoff

**Read this first** before continuing work. This document is the source of truth for the next agent.

---

## 1. What this project is

**Property Arena NG** — Nigeria real estate marketplace with a centralized subscription/billing engine.

- **Public brand UI:** PropertyArena.ng (green accents ≈ `#28A745`)
- **Admin UI:** PropertyARENA (red sidebar ≈ `#B91C1C`)
- Design mockups: `fe/public/designs/*.jpg` (STRICT visual reference)

---

## 2. Stack (do not change unless user asks)

| Layer | Stack |
|-------|--------|
| Backend | **Node.js + NestJS + TypeScript** + **MongoDB (Mongoose)** + Redis + BullMQ |
| Frontend | **React + TypeScript** + Vite + Tailwind |
| Payments | Adapter pattern: **Mock** (default locally) / Paystack / Flutterwave |

**Not PostgreSQL/MySQL** — the TMT upstream API was Mongo. Do not migrate DB unless the user explicitly requests it.

Upstream (private, user may only have **pull**):

- https://github.com/TMT-ICT-HUB/property-arena-api (`dev` branch)
- https://github.com/TMT-ICT-HUB/property-arena-fe (`dev` branch)

This deliverable is a **combined** tree under `property-arena/` for local/cloud work. Sync back to the two TMT repos only when the user has **write** access.

---

## 3. Folder layout

```
property-arena/
  AGENT_HANDOFF.md          ← this file
  README.md                 ← human runbook
  api/                      ← NestJS API (property-arena-api equivalent)
  fe/                       ← React FE (property-arena-fe equivalent)
```

Workspace root may also contain `_upstream/` clones of the private GitHub repos (reference only; not required to run).

---

## 4. Architecture invariants (billing)

1. **No domain module** may decide access by reading raw payment rows or ad-hoc user flags.
2. Gate mutations via:
   - `SubscriptionService.canPerformAction(userId, actionKey, quantity)`
   - or `EntitlementEngine.canPerformAction` / `consumeQuota`
3. Entitled statuses: `trial` | `active` | `grace_period`
4. **Never** activate a subscription from a browser redirect alone. Always:
   - HMAC-verify webhook, **or**
   - server-side `verifyTransaction(reference)`
5. First-month-free promo: **once per user** via `User.promoTrialUsed`
6. Money: plan prices stored in **kobo** (integer), not float Naira

Feature / action keys (examples):

- `active_listings` → `max_listings`
- `featured_listings` → `max_featured_listings`
- `lead_access` → `max_leads_per_month`
- `property_requests` → `max_property_requests_per_month`

Key API files:

- `api/src/modules/subscription/entitlement.engine.ts`
- `api/src/modules/subscription/subscription.service.ts`
- `api/src/modules/subscription/workers/billing.workers.ts`
- `api/src/modules/payment/providers/{mock,paystack,flutterwave}.provider.ts`
- `api/src/modules/webhook/webhook.service.ts`
- Property create gated in `api/src/modules/property/property.service.ts`

---

## 5. How to run locally

**Prereqs:** Node 20+, MongoDB `127.0.0.1:27017`, Redis `127.0.0.1:6379`

```bash
# API
cd property-arena/api
cp .env.example .env          # already tuned for ports 43121 / mock gateway
npm install
npm run seed:subscription-plans
npm run start:dev
# http://127.0.0.1:43121
# Swagger: http://127.0.0.1:43121/api/docs

# FE (other terminal)
cd property-arena/fe
cp .env.example .env          # VITE_API_URL=http://127.0.0.1:43121/api/v1
npm install
npm run dev
# http://127.0.0.1:43122
# Admin: http://127.0.0.1:43122/admin
```

Default ports (avoid 3000/5173 collisions):

- API: **43121**
- FE: **43122**

`PAYMENT_GATEWAY=mock` when Paystack/Flutterwave secrets are empty.

---

## 6. Important env vars (API)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Mongo connection string |
| `JWT_SECRET` | Auth |
| `FRONTEND_URL` | Checkout callback base |
| `REDIS_HOST` / `REDIS_PORT` | Cache + BullMQ |
| `PAYMENT_GATEWAY` | `mock` \| `paystack` \| `flutterwave` |
| `PAYSTACK_SECRET_KEY` | Live Paystack |
| `FLUTTERWAVE_SECRET_KEY` / `FLUTTERWAVE_SECRET_HASH` | Live Flutterwave |
| `SUBSCRIPTION_TRIAL_DAYS` | Default trial (plans also have `trialDays`) |

**Never commit real `.env` or PATs.** User previously pasted a GitHub PAT in chat — treat as compromised; use Cursor secrets only.

---

## 7. Frontend routes (mockup-aligned)

| Path | Purpose |
|------|---------|
| `/` | Marketplace homepage (green) |
| `/properties`, `/properties/:id` | Listings + detail (media/images) |
| `/request-property` | Buyer request flow |
| `/sell` | Sell/list marketing + form |
| `/subscription` | Plans from live API |
| `/admin/*` | Red admin shell: dashboard, properties, transactions, packages, leads, payments, media, reports, settings, promotions, pages, users, agents, developers |

Admin pages use realistic mock KPI/table data where aggregations are not yet wired; packages page should eventually call subscription plan admin APIs.

---

## 8. What’s done vs next

### Done
- NestJS API with subscription domain, entitlement gate, usage schema, workers
- Mock/Paystack/Flutterwave payment adapters
- Paystack webhook HMAC → BullMQ → verify → activate
- Seeded 7 subscription plans
- React FE + admin UI shell matching mockups
- Property create consumes listing quota

### Likely next (user priorities)
1. Pixel-tighten remaining mockup pages (search+map, messages, full settings forms)
2. Wire admin tables to real API aggregations
3. Property request / lead modules with entitlement gates
4. Media upload (Cloudinary) end-to-end
5. Deploy to user’s live server (Mongo + Redis + env + nginx)
6. When user has **write** on TMT repos: split/push `api/` → property-arena-api, `fe/` → property-arena-fe (`dev` branches)

---

## 9. Git / Cloud Agent notes

- Work may live on `main` and/or `cursor/admin-ui-property-arena-507c`
- New Project flow: do **not** open PRs unless the user asks
- User wants files as a **zip** for local PC; exclude `node_modules`, `.env`, `dist`, dumps

---

## 10. Quick health checks

```bash
curl -s http://127.0.0.1:43121/api/v1/subscription/plans | head
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:43122/
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:43122/admin
```

---

## 11. User context (non-technical)

- Org: TMT-ICT-HUB; GitHub user seen: `easamuel`
- Access to private TMT repos was **pull-only** last checked — cannot push without admin granting Write
- User asked to keep NestJS (Node) + React/TS; UI must follow provided mockup images
- User asked why Mongo: because existing TMT API is Mongoose; Postgres would be a full migration

When in doubt: **preserve billing invariants**, **match mockups**, **ask before changing DB or stack**.
