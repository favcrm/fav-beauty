import { listEvents } from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, parent }) => {
  const { companyId } = await parent();
  return { events: await listEvents({ fetch, companyId }) };
};
