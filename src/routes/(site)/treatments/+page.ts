import { listTreatments } from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  return { treatments: await listTreatments(fetch) };
};
