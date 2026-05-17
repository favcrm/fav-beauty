import { listStylists } from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
  return { stylists: await listStylists(fetch) };
};
