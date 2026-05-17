<script lang="ts">
  import { listPosts } from "$lib/data/provider";
  import { formatDate } from "$lib/format";
  import Img from "$lib/components/Img.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  const post = $derived(data.post);
  const paragraphs = $derived(post.body.split("\n\n"));
  const more = $derived(
    listPosts()
      .filter((p) => p.slug !== post.slug)
      .slice(0, 2),
  );
</script>

<svelte:head><title>{post.title} — Lueur Journal</title></svelte:head>

<article class="shell pt-14">
  <a
    href="/journal"
    class="link-underline font-sans text-[0.72rem] uppercase tracking-wide text-ink-soft"
  >
    ← The journal
  </a>

  <header
    class="reveal mx-auto mt-8 flex max-w-2xl flex-col items-center gap-4 text-center"
  >
    <span class="font-sans text-[0.66rem] uppercase tracking-wide text-accent">
      {post.category} · {post.readMinutes} min read
    </span>
    <h1 class="font-display text-display-md text-ink">{post.title}</h1>
    <span
      class="font-sans text-[0.72rem] uppercase tracking-wide text-ink-faint"
    >
      {post.author} · {formatDate(post.publishedAt)}
    </span>
  </header>

  <div class="mx-auto mt-10 max-w-3xl">
    <Img src={null} hue={post.hue} label={post.category} ratio="16 / 9" />
  </div>

  <div class="mx-auto mt-10 flex max-w-2xl flex-col gap-6 pb-16">
    {#each paragraphs as para, i (i)}
      {#if i === 0}
        <p
          class="font-display text-2xl italic leading-snug text-ink first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:not-italic first-letter:leading-[0.8] first-letter:text-accent"
        >
          {para}
        </p>
      {:else}
        <p class="font-sans text-[1.02rem] leading-[1.85] text-ink-soft">
          {para}
        </p>
      {/if}
    {/each}
  </div>

  <section class="border-t border-line py-14">
    <h2 class="font-display text-display-md text-ink">Keep reading</h2>
    <div class="mt-8 grid gap-8 sm:grid-cols-2">
      {#each more as p (p.slug)}
        <a href={`/journal/${p.slug}`} class="group flex gap-5">
          <div class="w-28 shrink-0">
            <Img src={null} hue={p.hue} label={p.category} ratio="1 / 1" />
          </div>
          <div class="flex flex-col justify-center gap-1">
            <span
              class="font-sans text-[0.62rem] uppercase tracking-wide text-accent"
              >{p.category}</span
            >
            <h3
              class="font-display text-xl leading-tight text-ink transition-colors group-hover:text-accent"
            >
              {p.title}
            </h3>
          </div>
        </a>
      {/each}
    </div>
  </section>
</article>
