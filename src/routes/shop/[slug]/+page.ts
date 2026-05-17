import { error } from "@sveltejs/kit";
import { getProduct } from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
  const product = getProduct(params.slug);
  if (!product) throw error(404, "That product could not be found.");
  return { product };
};
