# Seed data

Portable JSON snapshot of the template's demo catalogue. These files are the
framework-agnostic form of `src/lib/data/mock/*` — intended to seed a real
FavCRM workspace database when an agency provisions the template for a client.

| File | Records | Maps to (FavCRM) |
| --- | --- | --- |
| `brand.json` | company profile | workspace / company settings |
| `treatments.json` | 6 | booking services (+ add-ons) |
| `stylists.json` | 4 | booking resources / staff |
| `products.json` | 8 | shop products |
| `membershipTiers.json` | 3 | membership tiers |
| `journalPosts.json` | 4 | blog posts |
| `events.json` | 2 | events |
| `testimonials.json` | 3 | content (no FavCRM entity yet) |
| `manifest.json` | — | generation metadata + counts |

## Regenerating

The mock TypeScript modules remain the editable source. After changing them:

```bash
pnpm seed:export
```

This rewrites every file here so the JSON never drifts from the live template.

## Using it as a database seed

These shapes are the template's own domain types (`src/lib/data/types.ts`),
**not** FavCRM API shapes. A future seeder must map them — e.g. `treatments` →
`POST /v6/merchant/bookings/services`, `products` → shop product creation —
or insert directly into the workspace D1 database. The `image` fields point at
local `static/img/...` assets that are demo-only; real workspaces supply their
own media.
