# PropertyArena.ng

Nigeria’s property marketplace — buy, rent, short-let, and land with neighbourhood guides, property requests, subscriptions, ads, and an admin CMS. Monorepo: NestJS API + React (Vite) frontend.

**Repo:** https://github.com/easamuel/property-arena

---

## What’s in this project

### Public marketplace (FE)

| Area | What you get |
|------|----------------|
| **Homepage** | Full-bleed hero, Google-style search card, purpose tabs (Buy / Rent / Land / Short Let / Commercial), popular destination **cards** with correct SEO listing URLs |
| **Search & SEO URLs** | Canonical paths: `/for-sale/in/:state/:area?`, `/for-rent/…`, `/shortlet/…`, `/land/…` — location resolver maps Lekki → Lagos, Gwarinpa → Abuja, etc. |
| **Listings** | Browse, filters, featured, detail page with Arena Confidence, enquiry, WhatsApp, sticky mobile CTA |
| **Listing detail layout** | Gallery + **right sidebar flush to the top** (ads, agent card, enquiry) so promotions aren’t buried under photos |
| **Neighbourhood guides** | 24 states/cities, **350+ areas** (NPC-style taxonomy), hub + city + area pages, area filter |
| **Property requests** | Post / browse / detail / my requests (agents respond) |
| **Auth** | Signup, login, verify email, forgot / reset password |
| **Theme** | Light / dark with semantic tokens; sticky nav + transparent brand logo |
| **Subscriptions** | Plans UI + subscriber badges on listings |
| **Ads** | `AdSlot` placements (`homepage_sidebar`, `homepage_banner`, `listing_sidebar`, …) fed by CMS promotions |
| **CMS pages** | About, careers, contact, help, terms, privacy, cookies |
| **Articles** | List + detail with seeded / fallback guides |
| **Messages** | Inbox empty-state (realtime chat not wired yet) |

### Admin (`/admin`)

- Admin-only gate (`role === admin`)
- Dashboard, properties, users, agents, developers
- Leads, bookings, transactions, payments
- Packages & pricing, promotions & ads, media, reports
- Pages + articles CMS boards
- Settings

### API (NestJS + MongoDB)

| Module | Notes |
|--------|--------|
| **Auth** | JWT, verify / reset links; delivery via `AUTH_EMAIL_WEBHOOK` or SMTP env |
| **Users / agents / developers** | Roles incl. `admin` |
| **Properties** | CRUD, indexes, purpose incl. `shortlet`, featured |
| **Requests** | Buyer/tenant request domain |
| **Subscriptions** | Plans, features, entitlement engine, badges |
| **Payments** | Mock / Paystack / Flutterwave adapters + webhooks |
| **Platform CMS** | Public content for `page`, `article`, `promotion` (status `published` / `Active`) |
| **Seed** | Admin user, plans, CMS pages, articles, Active promos (dev) |

### Branding

- Logo: transparent PNG from official mark (`fe/public/logo.png`) — no white canvas box
- Marketplace green / admin red design languages

---

## Stack

| Layer | Tech |
|-------|------|
| API | Node.js, NestJS, TypeScript, MongoDB (Mongoose), Redis, BullMQ |
| FE | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Payments | Mock (local) · Paystack · Flutterwave |
| SEO | `react-helmet-async`, `sitemap.xml`, Vite prerender script |

---

## Repository layout

```
property-arena/
├── README.md                 ← this file
├── AGENT_HANDOFF.md          ← deeper agent/dev handoff notes
├── api/                      ← NestJS backend
│   ├── .env.example
│   └── src/
└── fe/                       ← React frontend
    ├── .env.example
    ├── public/               ← logo, sitemap, robots, designs
    └── src/
```

---

## Architecture rules (billing)

Domain modules (properties, leads, requests) **must not** decide access from raw payment rows.

Use:

`SubscriptionService.canPerformAction(userId, actionKey, quantity)` → entitlement engine.

Entitled statuses: `trial` | `active` | `grace_period`. Never activate a subscription from a browser redirect alone — verify webhook HMAC or server-side transaction verify. Plan prices are stored in **kobo** (integers).

---

## Prerequisites

- Node.js **20+**
- MongoDB on `127.0.0.1:27017` (or set `DATABASE_URL`)
- Redis on `127.0.0.1:6379` (queues / cache)

---

## Local setup

### 1. API

```bash
cd api
cp .env.example .env
npm install
npm run seed:subscription-plans   # optional dedicated plan seed
npm run start:dev                 # also runs soft CMS/admin seed in non-prod
```

Default API: **http://127.0.0.1:43121**  
Swagger / API prefix: `/api/v1`

Seeded admin (dev):

- Email: `admin@propertyarena.ng` (or `SEED_ADMIN_EMAIL`)
- Password: `Admin123!` (or `SEED_ADMIN_PASSWORD`)

Important env (see `api/.env.example`):

| Variable | Purpose |
|----------|---------|
| `FRONTEND_URL` | Links in verify / reset emails |
| `AUTH_EMAIL_WEBHOOK` / `AUTH_SMTP_*` | Auth email delivery |
| `DATABASE_URL` | Mongo connection |
| `JWT_SECRET` | Auth signing |
| Payment keys | Paystack / Flutterwave when not on mock |

### 2. Frontend

```bash
cd fe
cp .env.example .env
npm install
npm run dev
```

Default FE: **http://127.0.0.1:43122** (or Vite’s printed URL)

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | API base, e.g. `http://127.0.0.1:43121/api/v1` |
| `VITE_CLOUDINARY_CLOUD_NAME` | Listing media uploads |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset |

### 3. Production FE build

```bash
cd fe
npm run build    # tsc + vite + SEO prerender (~34 routes)
```

---

## Key product URLs (FE)

| Path | Description |
|------|-------------|
| `/` | Homepage + hero search |
| `/properties` | Listing browse |
| `/for-sale/in/lagos/lekki` | SEO location browse (example) |
| `/properties/:id` | Listing detail |
| `/neighbourhood` | Guides hub |
| `/neighbourhood/lagos` | State/city areas |
| `/request-property` · `/requests` | Property requests |
| `/articles` | Insights |
| `/login` · `/signup` · `/forgot-password` | Auth |
| `/subscription` | Plans (signed-in) |
| `/admin` | Admin CMS (admin role) |
| `/about` · `/contact` · `/help` · `/terms` · `/privacy` | CMS / static pages |

---

## Search correctness

Hero and popular cards use `fe/src/lib/locations.ts`:

- Free text like **Lekki** resolves to state **Lagos** + area **Lekki** → `/for-sale/in/lagos/lekki`
- **Gwarinpa** → `/for-sale/in/abuja/gwarinpa`
- Active tab (Buy / Rent / Land / Short Let / Commercial) selects the right purpose / SEO kind

---

## Theme & logo

- Theme toggle stores `pa-theme` and sets `html.dark` (class-based Tailwind dark)
- Semantic CSS tokens: `surface`, `ink`, `line`, `chip`, …
- Brand logo: `fe/public/logo.png` (transparent canvas). Regenerate from source with:

```bash
cd fe
node scripts/make-logo-transparent.cjs
```

---

## Deploy notes

- Set `FRONTEND_URL` and auth email (webhook or SMTP) in production
- Set Cloudinary vars for durable listing media
- Point FE `VITE_API_URL` at your deployed API
- Mongo + Redis required for API
- FE `vercel.json` present for SPA rewrites if deploying FE on Vercel

---

## Scripts cheat sheet

```bash
# API
cd api && npm run start:dev
cd api && npm run build && npm run start:prod
cd api && npm run seed:subscription-plans

# FE
cd fe && npm run dev
cd fe && npm run build
cd fe && npm run prerender
```

---

## Related docs

- `AGENT_HANDOFF.md` — deeper conventions, billing invariants, upstream sync notes

---

## License

UNLICENSED / private unless you change it. All rights reserved by the project owners.
