import {
  featuredTreatments,
  featuredProducts,
  listTiers,
  listPosts,
} from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, parent }) => {
  const { companyId } = await parent();
  const ctx = { fetch, companyId };
  const [treatments, products, tiers, posts] = await Promise.all([
    featuredTreatments(ctx),
    featuredProducts(ctx),
    listTiers(ctx),
    listPosts(ctx),
  ]);
  return {
    treatments,
    products: products.slice(0, 4),
    tiers,
    posts: posts.slice(0, 3),
  };
};
