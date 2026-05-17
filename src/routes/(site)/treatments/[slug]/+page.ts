import { error } from "@sveltejs/kit";
import { getTreatment, listStylists, listTreatments } from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
  const [treatment, stylists, allTreatments] = await Promise.all([
    getTreatment(params.slug, fetch),
    listStylists(fetch),
    listTreatments(fetch),
  ]);
  if (!treatment) throw error(404, "That treatment could not be found.");
  const related = allTreatments
    .filter((t) => t.id !== treatment.id && t.category === treatment.category)
    .slice(0, 3);
  return { treatment, stylists, related };
};
