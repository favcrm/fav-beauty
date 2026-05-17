import { listTiers } from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  return { tiers: await listTiers(fetch) };
};
