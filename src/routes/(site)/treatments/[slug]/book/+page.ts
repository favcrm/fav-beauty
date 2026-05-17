import { error } from "@sveltejs/kit";
import { getTreatment, listStylists } from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
  const [treatment, stylists] = await Promise.all([
    getTreatment(params.slug, fetch),
    listStylists(fetch),
  ]);
  if (!treatment) throw error(404, "That treatment could not be found.");
  return { treatment, stylists };
};
