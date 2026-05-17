import { listProducts, productCategories } from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, parent }) => {
  const { companyId } = await parent();
  const ctx = { fetch, companyId };
  const [products, categories] = await Promise.all([
    listProducts(undefined, ctx),
    productCategories(ctx),
  ]);
  return { products, categories };
};
