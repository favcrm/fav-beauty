import { error } from "@sveltejs/kit";
import { getPost, listPosts } from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params, fetch }) => {
  const [post, allPosts] = await Promise.all([
    getPost(params.slug, fetch),
    listPosts(fetch),
  ]);
  if (!post) throw error(404, "That journal entry could not be found.");
  const more = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);
  return { post, more };
};
