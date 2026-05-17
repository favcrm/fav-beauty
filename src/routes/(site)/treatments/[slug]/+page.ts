import { error } from "@sveltejs/kit";
import { getTreatment, listStylists, listTreatments } from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch, parent }) => {
  const { companyId } = await parent();
  const ctx = { fetch, companyId };
  const [treatment, stylists, allTreatments] = await Promise.all([
    getTreatment(params.slug, ctx),
    listStylists(ctx),
    listTreatments(ctx),
  ]);
  if (!treatment) throw error(404, "That treatment could not be found.");
  const related = allTreatments
    .filter((t) => t.id !== treatment.id && t.category === treatment.category)
    .slice(0, 3);
  return { treatment, stylists, related };
};
