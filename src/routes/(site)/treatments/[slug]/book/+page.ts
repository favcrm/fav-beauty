import { error } from "@sveltejs/kit";
import { getTreatment, listStylists } from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch, parent }) => {
  const { companyId } = await parent();
  const ctx = { fetch, companyId };
  const [treatment, stylists] = await Promise.all([
    getTreatment(params.slug, ctx),
    listStylists(ctx),
  ]);
  if (!treatment) throw error(404, "That treatment could not be found.");
  return { treatment, stylists };
};
