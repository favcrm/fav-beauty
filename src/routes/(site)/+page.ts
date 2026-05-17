import {
  featuredTreatments,
  featuredProducts,
  listTiers,
  listPosts,
} from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const [treatments, products, tiers, posts] = await Promise.all([
    featuredTreatments(fetch),
    featuredProducts(fetch),
    listTiers(fetch),
    listPosts(fetch),
  ]);
  return {
    treatments,
    products: products.slice(0, 4),
    tiers,
    posts: posts.slice(0, 3),
  };
};
