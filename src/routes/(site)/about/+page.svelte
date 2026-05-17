<script lang="ts">
  import { listStylists, getBrand } from "$lib/data/provider";
  import Button from "$lib/components/Button.svelte";
  import Img from "$lib/components/Img.svelte";

  const brand = getBrand();
  const stylists = listStylists();

  const values = [
    {
      n: "01",
      t: "Read first",
      d: "Every visit begins with a reading — skin, hair, the week you've had. We prescribe nothing blind.",
    },
    {
      n: "02",
      t: "Do less",
      d: "Fewer products, fewer steps. Consistency outperforms complexity, every time.",
    },
    {
      n: "03",
      t: "Be honest",
      d: "If a treatment won't serve you, we say so. Trust is the only thing worth keeping.",
    },
  ];
</script>

<svelte:head><title>The House — Lueur</title></svelte:head>

<section class="shell pt-14">
  <div
    class="reveal grid gap-10 border-b border-line pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end"
  >
    <div class="flex flex-col gap-5">
      <span class="eyebrow">The house</span>
      <h1 class="font-display text-display-lg text-ink">
        A small atelier with <span class="italic text-accent">long</span> relationships.
      </h1>
      <p class="max-w-md font-sans leading-relaxed text-ink-soft">
        {brand.name} opened as a single treatment room and a belief that beauty work
        should be unhurried, honest and personal. We have grown slowly, on purpose
        — enough specialists to care for you well, few enough to know you by name.
      </p>
    </div>
    <Img hue={28} label="The Atelier" ratio="4 / 3" />
  </div>

  <!-- values -->
  <div class="grid gap-10 py-16 lg:grid-cols-3">
    {#each values as v (v.n)}
      <div class="flex flex-col gap-3 border-t border-ink pt-5">
        <span class="font-sans text-[0.7rem] tracking-wide text-ink-faint"
          >{v.n}</span
        >
        <h2 class="font-display text-3xl text-ink">{v.t}</h2>
        <p class="font-sans text-sm leading-relaxed text-ink-soft">{v.d}</p>
      </div>
    {/each}
  </div>

  <!-- team -->
  <section class="border-t border-line py-16">
    <h2 class="max-w-2xl font-display text-display-md text-ink">
      The specialists
    </h2>
    <div class="mt-10 grid gap-8 sm:grid-cols-2">
      {#each stylists as s (s.id)}
        <div class="flex gap-5 border-t border-line pt-6">
          <div class="w-28 shrink-0">
            <Img src={s.image} hue={s.hue} label={s.name} ratio="3 / 4" />
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="font-display text-2xl leading-tight text-ink">
              {s.name}
            </h3>
            <span
              class="font-sans text-[0.64rem] uppercase tracking-wide text-accent"
              >{s.title}</span
            >
            <p class="font-sans text-[0.85rem] leading-relaxed text-ink-soft">
              {s.bio}
            </p>
          </div>
        </div>
      {/each}
    </div>
  </section>

  <!-- visit -->
  <section class="grid gap-10 border-t border-line py-16 lg:grid-cols-2">
    <div class="flex flex-col gap-4">
      <span class="eyebrow">Visit us</span>
      <h2 class="font-display text-display-md text-ink">{brand.address}</h2>
      <p class="font-sans leading-relaxed text-ink-soft">{brand.city}</p>
      <div class="pt-2">
        <Button href="/contact" size="md">Get in touch</Button>
      </div>
    </div>
    <div class="flex flex-col">
      <span class="eyebrow !text-ink-soft mb-4">Opening hours</span>
      <dl class="flex flex-col divide-y divide-line border-y border-line">
        {#each brand.hours as h (h.day)}
          <div class="flex justify-between py-3 font-sans text-sm">
            <dt class="text-ink">{h.day}</dt>
            <dd class="text-ink-soft">{h.range}</dd>
          </div>
        {/each}
      </dl>
    </div>
  </section>
</section>
