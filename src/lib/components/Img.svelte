<script lang="ts">
  /**
   * Image plate. Renders a real photo when `src` is provided, otherwise an
   * elegant warm-gradient field tinted by `hue` — so the template always
   * looks finished even before an agency adds photography.
   */
  interface Props {
    src?: string | null;
    hue?: number;
    label?: string;
    ratio?: string;
    rounded?: boolean;
    eager?: boolean;
    class?: string;
  }

  let {
    src = null,
    hue = 24,
    label = "",
    ratio = "4 / 5",
    rounded = true,
    eager = false,
    class: className = "",
  }: Props = $props();

  const base = $derived(`hsl(${hue} 34% 87%)`);
  const mid = $derived(`hsl(${(hue + 16) % 360} 40% 73%)`);
  const deep = $derived(`hsl(${(hue + 340) % 360} 30% 56%)`);
  const monogram = $derived(
    label
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0] ?? "")
      .join("")
      .toUpperCase(),
  );
</script>

<div
  class="img-plate {className}"
  class:rounded
  style="aspect-ratio: {ratio}; --c-base: {base}; --c-mid: {mid}; --c-deep: {deep};"
>
  {#if src}
    <img {src} alt={label} loading={eager ? "eager" : "lazy"} />
  {:else}
    <span class="monogram" aria-hidden="true">{monogram}</span>
  {/if}
  <span class="sheen" aria-hidden="true"></span>
</div>

<style>
  .img-plate {
    position: relative;
    width: 100%;
    overflow: hidden;
    background:
      radial-gradient(
        120% 90% at 18% 12%,
        rgba(255, 255, 255, 0.7),
        transparent 55%
      ),
      linear-gradient(
        150deg,
        var(--c-base) 0%,
        var(--c-mid) 58%,
        var(--c-deep) 130%
      );
    display: grid;
    place-items: center;
    isolation: isolate;
  }
  .rounded {
    border-radius: 2px;
  }
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .monogram {
    font-family: "Cormorant", Georgia, serif;
    font-style: italic;
    font-size: clamp(2.4rem, 7vw, 5rem);
    color: rgba(255, 255, 255, 0.62);
    letter-spacing: 0.04em;
    user-select: none;
  }
  .sheen {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(
      180deg,
      transparent 55%,
      rgba(33, 28, 23, 0.16)
    );
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.28);
  }
</style>
