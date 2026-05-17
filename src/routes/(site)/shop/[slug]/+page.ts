import { error } from "@sveltejs/kit";
import { getProduct, listProducts } from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch, parent }) => {
  const { companyId } = await parent();
  const ctx = { fetch, companyId };
  const product = await getProduct(params.slug, ctx);
  if (!product) throw error(404, "That product could not be found.");
  const related = (await listProducts({ category: product.category }, ctx))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);
  return { product, related };
};
