import {
  listTreatments,
  listProducts,
  listStylists,
  listTiers,
} from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, parent }) => {
  const { companyId } = await parent();
  const ctx = { fetch, companyId };
  const [treatments, products, stylists, tiers] = await Promise.all([
    listTreatments(ctx),
    listProducts(undefined, ctx),
    listStylists(ctx),
    listTiers(ctx),
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
