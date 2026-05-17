import { listTiers } from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, parent }) => {
  const { companyId } = await parent();
  return { tiers: await listTiers({ fetch, companyId }) };
};
