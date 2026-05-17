import { error } from "@sveltejs/kit";
import { getPost } from "$lib/data/provider";
import type { PageLoad } from "./$types";

export const load: PageLoad = ({ params }) => {
  const post = getPost(params.slug);
  if (!post) throw error(404, "That journal entry could not be found.");
  return { post };
};
