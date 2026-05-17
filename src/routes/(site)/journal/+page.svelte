<script lang="ts">
  import { formatDate } from "$lib/format";
  import Img from "$lib/components/Img.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  const lead = $derived(data.posts[0]);
  const rest = $derived(data.posts.slice(1));
</script>

<svelte:head><title>Journal — Lueur</title></svelte:head>

<section class="shell pt-14">
  <div class="reveal flex flex-col gap-5 border-b border-line pb-10">
    <span class="eyebrow">The journal</span>
    <h1 class="max-w-3xl font-display text-display-lg text-ink">
      Notes from the atelier.
    </h1>
  </div>

  {#if lead}
    <a
      href={`/journal/${lead.slug}`}
      class="group mt-12 grid gap-8 lg:grid-cols-2"
    >
      <Img src={null} hue={lead.hue} label={lead.category} ratio="4 / 3" />
      <div class="flex flex-col justify-center gap-4">
        <span
          class="font-sans text-[0.66rem] uppercase tracking-wide text-accent"
        >
          {lead.category} · {lead.readMinutes} min read
        </span>
        <h2
          class="font-display text-display-md text-ink transition-colors group-hover:text-accent"
        >
          {lead.title}
        </h2>
        <p class="max-w-md font-sans leading-relaxed text-ink-soft">
          {lead.excerpt}
        </p>
        <span
          class="font-sans text-[0.72rem] uppercase tracking-wide text-ink-faint"
        >
          {lead.author} · {formatDate(lead.publishedAt)}
        </span>
      </div>
    </a>
  {/if}

  <div
    class="grid gap-8 border-t border-line py-16 sm:grid-cols-2 lg:grid-cols-3"
  >
    {#each rest as post (post.slug)}
      <a href={`/journal/${post.slug}`} class="group flex flex-col">
        <Img src={null} hue={post.hue} label={post.category} ratio="3 / 2" />
        <span
          class="mt-4 font-sans text-[0.66rem] uppercase tracking-wide text-accent"
        >
          {post.category} · {post.readMinutes} min
        </span>
        <h3
          class="mt-1.5 font-display text-2xl leading-tight text-ink transition-colors group-hover:text-accent"
        >
          {post.title}
        </h3>
        <p class="mt-2 font-sans text-sm leading-relaxed text-ink-soft">
          {post.excerpt}
        </p>
      </a>
    {/each}
  </div>
</section>
