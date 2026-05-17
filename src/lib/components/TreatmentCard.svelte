<script lang="ts">
  import type { Treatment } from "$lib/data/types";
  import { formatMoney, formatDuration } from "$lib/format";
  import Img from "./Img.svelte";

  interface Props {
    treatment: Treatment;
    index?: number;
  }
  let { treatment, index }: Props = $props();
</script>

<a href={`/treatments/${treatment.slug}`} class="group flex flex-col">
  <div class="relative overflow-hidden">
    <div
      class="transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
    >
      <Img
        src={treatment.image}
        hue={treatment.hue}
        label={treatment.name}
        ratio="4 / 5"
      />
    </div>
    {#if index !== undefined}
      <span
        class="absolute left-3 top-3 font-sans text-[0.62rem] tracking-wide text-paper/80"
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    {/if}
  </div>
  <div class="mt-4 flex items-baseline justify-between gap-3">
    <h3
      class="font-display text-2xl leading-tight text-ink transition-colors group-hover:text-accent"
    >
      {treatment.name}
    </h3>
    <span class="shrink-0 font-sans text-sm text-ink"
      >{formatMoney(treatment.price, treatment.currency)}</span
    >
  </div>
  <p class="mt-1.5 font-sans text-sm leading-relaxed text-ink-soft">
    {treatment.tagline}
  </p>
  <span
    class="mt-3 font-sans text-[0.68rem] uppercase tracking-wide text-ink-faint"
  >
    {formatDuration(treatment.durationMinutes)} · {treatment.category}
  </span>
</a>
