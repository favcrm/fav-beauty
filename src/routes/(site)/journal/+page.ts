import { listPosts } from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, parent }) => {
  const { companyId } = await parent();
  return { posts: await listPosts({ fetch, companyId }) };
};
