/**
 * Exports the demo-mode seed data (src/lib/data/mock/*) to plain JSON in seed/.
 *
 * The JSON snapshot is the portable, framework-agnostic form of the dummy
 * catalogue — intended to be consumed later by a database seeder when a real
 * FavCRM workspace is provisioned for an agency.
 *
 * Run:  pnpm seed:export   (node --experimental-strip-types)
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

import { brand } from "../src/lib/data/mock/brand.ts";
import { treatments } from "../src/lib/data/mock/treatments.ts";
import { stylists } from "../src/lib/data/mock/stylists.ts";
import { products } from "../src/lib/data/mock/products.ts";
import { tiers } from "../src/lib/data/mock/tiers.ts";
import { posts, events, testimonials } from "../src/lib/data/mock/content.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "seed");
mkdirSync(outDir, { recursive: true });

const datasets = {
  brand,
  treatments,
  stylists,
  products,
  membershipTiers: tiers,
  journalPosts: posts,
  events,
  testimonials,
};

const manifest = {
  generatedAt: new Date().toISOString(),
  source: "src/lib/data/mock",
  note: "Demo seed data for the fav-beauty template. Regenerate with `pnpm seed:export`.",
  counts: {},
};

for (const [name, data] of Object.entries(datasets)) {
  const file = `${name}.json`;
  writeFileSync(join(outDir, file), JSON.stringify(data, null, 2) + "\n");
  manifest.counts[name] = Array.isArray(data) ? data.length : 1;
  console.log(`seed/${file} — ${manifest.counts[name]} record(s)`);
}

writeFileSync(
  join(outDir, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log("seed/manifest.json written");
