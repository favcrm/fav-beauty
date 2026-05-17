import {
  listTreatments,
  listProducts,
  listStylists,
  listTiers,
} from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const [treatments, products, stylists, tiers] = await Promise.all([
    listTreatments(fetch),
    listProducts(undefined, fetch),
    listStylists(fetch),
    listTiers(fetch),
  ]);
  return {
    counts: {
      treatments: treatments.length,
      products: products.length,
      stylists: stylists.length,
      tiers: tiers.length,
    },
  };
};
