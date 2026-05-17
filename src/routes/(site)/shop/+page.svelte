<script lang="ts">
  import { listProducts, productCategories } from "$lib/data/provider";
  import ProductCard from "$lib/components/ProductCard.svelte";

  const all = listProducts();
  const categories = ["all", ...productCategories()];
  let active = $state("all");
  const shown = $derived(
    active === "all" ? all : all.filter((p) => p.category === active),
  );
</script>

<svelte:head><title>Atelier Shop — Lueur</title></svelte:head>

<section class="shell pt-14">
  <div class="reveal flex flex-col gap-5 border-b border-line pb-10">
    <span class="eyebrow">The atelier shop</span>
    <h1 class="max-w-3xl font-display text-display-lg text-ink">
      The products we trust, on our own shelves.
    </h1>
    <p class="max-w-xl font-sans leading-relaxed text-ink-soft">
      A short, considered range — skincare, hair and body formulas we use in
      every treatment. Nothing here we wouldn't reach for ourselves.
    </p>
  </div>

  <div class="flex flex-wrap gap-2 py-8">
    {#each categories as cat (cat)}
      <button
        onclick={() => (active = cat)}
        class="rounded-full border px-5 py-2 font-sans text-[0.68rem] uppercase tracking-wide transition-colors
               {active === cat
          ? 'border-ink bg-ink text-paper'
          : 'border-line text-ink-soft hover:border-ink'}"
      >
        {cat}
      </button>
    {/each}
  </div>

  <div class="grid gap-x-7 gap-y-10 pb-24 sm:grid-cols-2 lg:grid-cols-4">
    {#each shown as product (product.id)}
      <ProductCard {product} />
    {/each}
  </div>
</section>
