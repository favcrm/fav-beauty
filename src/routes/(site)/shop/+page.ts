import { listProducts, productCategories } from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  const [products, categories] = await Promise.all([
    listProducts(undefined, fetch),
    productCategories(fetch),
  ]);
  return { products, categories };
};
