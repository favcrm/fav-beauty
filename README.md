# fav-beauty — FavCRM Beauty Storefront Template

A production-grade website template for **beauty businesses** — salons, skin clinics and
spas. Company site, online booking, retail shop, membership and member accounts, built on
[SvelteKit](https://kit.svelte.dev) and styled with an editorial-luxury aesthetic.

It is designed to be **deployed by anyone, with zero configuration**. Clone it, push it to
Vercel, and you get a complete, working beauty site running on built-in demo data. Connect
a FavCRM workspace later to go live.

---

## Deploy in one click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/favcrm/fav-beauty)

No environment variables are required. The site ships with seed treatments, products,
stylists, membership tiers and journal entries — it just works.

> This is a **GitHub template repository**. Click **“Use this template”** to create your
> own copy, then deploy that.

## Run locally

```bash
pnpm install
pnpm dev
```

Open <http://localhost:5173>. That is the whole setup.

## Modes

| Mode               | When                         | Data source                                 |
| ------------------ | ---------------------------- | ------------------------------------------- |
| **Demo** (default) | No env vars set              | Seed data in `src/lib/data/mock/`           |
| **Live** (phase 2) | `VITE_FAVCRM_COMPANY_ID` set | `@favcrm/sdk` against your FavCRM workspace |

The whole UI talks only to `src/lib/data/provider.ts`. Demo mode is fully implemented today;
live SDK wiring plugs in behind the same functions (see `provider.ts`).

## Make it yours

Everything an agency needs to rebrand lives in a few files — no component edits required.

| What                          | Where                               |
| ----------------------------- | ----------------------------------- |
| Salon name, contact, hours    | `src/lib/data/mock/brand.ts`        |
| Treatments / booking services | `src/lib/data/mock/treatments.ts`   |
| Stylists / staff              | `src/lib/data/mock/stylists.ts`     |
| Retail products               | `src/lib/data/mock/products.ts`     |
| Membership tiers              | `src/lib/data/mock/tiers.ts`        |
| Journal posts & events        | `src/lib/data/mock/content.ts`      |
| Colours, fonts                | `src/app.css`, `tailwind.config.ts` |

Treatment, stylist and product records carry an optional `image` field — leave it `null`
and the template renders an elegant tinted gradient plate; set a URL to use real photography.

## What's included

- **Home** — editorial landing with featured treatments, products, membership and journal
- **Treatments** — service menu, detail pages, and a 4-step booking flow with availability
- **Shop** — product grid, detail pages, cart and checkout
- **Membership** — tier comparison with enrolment
- **Accounts** — passwordless (OTP) sign-in, member dashboard, booking & order history
- **Journal & Events** — content pages
- **About / Contact** — company pages

In demo mode, bookings, orders and accounts persist to `localStorage` so the full flow is
demoable without a backend.

## Environment variables (optional)

See `.env.example`. All are optional; unset means demo mode.

## Tech

SvelteKit 2 · Svelte 5 · Tailwind CSS 3 · TypeScript · `@sveltejs/adapter-vercel`

```bash
pnpm check   # type-check
pnpm lint    # lint + format check
pnpm build   # production build
```

---

Built for the FavCRM headless platform.
