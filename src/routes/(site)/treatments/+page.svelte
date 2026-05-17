<script lang="ts">
  import { listTreatments } from "$lib/data/provider";
  import TreatmentCard from "$lib/components/TreatmentCard.svelte";

  const all = listTreatments();
  const categories = ["all", ...new Set(all.map((t) => t.category))];
  let active = $state("all");
  const shown = $derived(
    active === "all" ? all : all.filter((t) => t.category === active),
  );
</script>

<svelte:head><title>Treatments — Lueur</title></svelte:head>

<section class="shell pt-14">
  <div class="reveal flex flex-col gap-5 border-b border-line pb-10">
    <span class="eyebrow">The treatment menu</span>
    <h1 class="max-w-4xl font-display text-display-lg text-ink">
      Every treatment begins with a reading.
    </h1>
    <p class="max-w-xl font-sans leading-relaxed text-ink-soft">
      Choose a ritual below — your specialist will tailor it on the day. Prices
      are a starting point; nothing is added without a conversation first.
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

  <div class="grid gap-x-8 gap-y-12 pb-24 sm:grid-cols-2 lg:grid-cols-3">
    {#each shown as treatment, i (treatment.id)}
      <TreatmentCard {treatment} index={i} />
    {/each}
  </div>
</section>
