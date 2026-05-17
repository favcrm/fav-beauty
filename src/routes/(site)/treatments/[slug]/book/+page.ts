import { error } from "@sveltejs/kit";
import { getTreatment } from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
  const treatment = getTreatment(params.slug);
  if (!treatment) throw error(404, "That treatment could not be found.");
  return { treatment };
};
