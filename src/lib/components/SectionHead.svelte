<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    eyebrow?: string;
    numeral?: string;
    title: string;
    align?: "left" | "center";
    children?: Snippet;
  }
  let {
    eyebrow = "",
    numeral = "",
    title,
    align = "left",
    children,
  }: Props = $props();
</script>

<div
  class="flex flex-col gap-3 {align === 'center'
    ? 'items-center text-center'
    : ''}"
>
  {#if eyebrow || numeral}
    <div class="flex items-center gap-3">
      {#if numeral}
        <span class="font-sans text-[0.7rem] tracking-wide text-ink-faint"
          >{numeral}</span
        >
        <span class="h-px w-8 bg-line"></span>
      {/if}
      {#if eyebrow}<span class="eyebrow">{eyebrow}</span>{/if}
    </div>
  {/if}
  <h2
    class="font-display text-display-md text-ink {align === 'center'
      ? 'max-w-2xl'
      : 'max-w-3xl'}"
  >
    {title}
  </h2>
  {#if children}
    <div
      class="max-w-xl font-sans text-[0.95rem] leading-relaxed text-ink-soft"
    >
      {@render children()}
    </div>
  {/if}
</div>
