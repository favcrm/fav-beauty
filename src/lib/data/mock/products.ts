import type { Product } from "../types";

/** Seed retail products — the beauty equivalent of FavCRM `ProductListItem`. */
export const products: Product[] = [
  {
    id: "prd-serum-01",
    slug: "lumiere-radiance-serum",
    name: "Lumière Radiance Serum",
    brand: "Lueur Atelier",
    category: "skincare",
    description:
      "A weightless vitamin-C and peptide serum that evens tone and lifts dullness over four weeks of use. The serum we reach for in every facial.",
    price: 720,
    currency: "HKD",
    stock: 24,
    image: null,
    hue: 28,
    featured: true,
  },
  {
    id: "prd-cleanser-01",
    slug: "soft-clay-cleansing-balm",
    name: "Soft Clay Cleansing Balm",
    brand: "Lueur Atelier",
    category: "skincare",
    description:
      "A melting balm-to-milk cleanser with kaolin and camellia oil. Dissolves the day without stripping the barrier.",
    price: 340,
    currency: "HKD",
    stock: 41,
    image: null,
    hue: 36,
    featured: true,
  },
  {
    id: "prd-mist-01",
    slug: "rosewater-veil-mist",
    name: "Rosewater Veil Mist",
    brand: "Lueur Atelier",
    category: "skincare",
    description:
      "A fine hydrating mist of triple-distilled rosewater and panthenol. A reset between meetings.",
    price: 260,
    currency: "HKD",
    stock: 60,
    image: null,
    hue: 344,
    featured: false,
  },
  {
    id: "prd-mask-01",
    slug: "overnight-barrier-mask",
    name: "Overnight Barrier Mask",
    brand: "Lueur Atelier",
    category: "skincare",
    description:
      "A rich ceramide sleeping mask that repairs while you rest. Wake to calm, cushioned skin.",
    price: 480,
    currency: "HKD",
    stock: 18,
    image: null,
    hue: 14,
    featured: true,
  },
  {
    id: "prd-hairoil-01",
    slug: "gloss-finishing-hair-oil",
    name: "Gloss Finishing Hair Oil",
    brand: "Lueur Atelier",
    category: "hair",
    description:
      "A dry-touch oil that tames flyaways and adds salon shine without weight. Used to finish every blow-dry.",
    price: 380,
    currency: "HKD",
    stock: 33,
    image: null,
    hue: 6,
    featured: false,
  },
  {
    id: "prd-shampoo-01",
    slug: "bond-repair-shampoo",
    name: "Bond Repair Shampoo",
    brand: "Lueur Atelier",
    category: "hair",
    description:
      "A gentle, colour-safe cleanser that strengthens lifted and coloured hair wash after wash.",
    price: 300,
    currency: "HKD",
    stock: 27,
    image: null,
    hue: 158,
    featured: false,
  },
  {
    id: "prd-bodyoil-01",
    slug: "contour-body-oil",
    name: "Contour Body Oil",
    brand: "Lueur Atelier",
    category: "body",
    description:
      "A fast-absorbing oil of squalane and grapefruit used in our sculpt massage. For skin that feels cared for.",
    price: 420,
    currency: "HKD",
    stock: 22,
    image: null,
    hue: 142,
    featured: false,
  },
  {
    id: "prd-tool-01",
    slug: "jade-contour-stone",
    name: "Jade Contour Stone",
    brand: "Lueur Atelier",
    category: "tools",
    description:
      "A hand-finished jade tool for at-home lymphatic massage. The ritual that extends your facial.",
    price: 290,
    currency: "HKD",
    stock: 15,
    image: null,
    hue: 152,
    featured: true,
  },
];

export function findProduct(idOrSlug: string): Product | undefined {
  return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}
