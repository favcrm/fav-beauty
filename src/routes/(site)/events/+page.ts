import { listEvents } from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  return { events: await listEvents(fetch) };
};
