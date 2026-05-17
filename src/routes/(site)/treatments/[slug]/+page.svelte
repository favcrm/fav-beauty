<script lang="ts">
  import { formatMoney, formatDuration } from "$lib/format";
  import Button from "$lib/components/Button.svelte";
  import Img from "$lib/components/Img.svelte";
  import TreatmentCard from "$lib/components/TreatmentCard.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  const treatment = $derived(data.treatment);
  const stylists = $derived(data.stylists);
  const related = $derived(data.related);
</script>

<svelte:head><title>{treatment.name} — Lueur</title></svelte:head>

<article class="shell pt-14">
  <a
    href="/treatments"
    class="link-underline font-sans text-[0.72rem] uppercase tracking-wide text-ink-soft"
  >
    ← All treatments
  </a>

  <div class="reveal mt-6 grid gap-12 pb-16 lg:grid-cols-[0.95fr_1.05fr]">
    <div>
      <Img
        src={treatment.image}
        hue={treatment.hue}
        label={treatment.name}
        ratio="4 / 5"
        eager
      />
    </div>

    <div class="flex flex-col gap-6">
      <span class="eyebrow"
        >{treatment.category} · {formatDuration(
          treatment.durationMinutes,
        )}</span
      >
      <h1 class="font-display text-display-md text-ink">{treatment.name}</h1>
      <p class="font-display text-2xl italic leading-snug text-accent">
        {treatment.tagline}
      </p>
      <p class="max-w-md font-sans leading-relaxed text-ink-soft">
        {treatment.description}
      </p>

      <div class="flex items-baseline gap-3 border-y border-line py-5">
        <span class="font-display text-4xl text-ink">
          {formatMoney(treatment.price, treatment.currency)}
        </span>
        <span
          class="font-sans text-[0.72rem] uppercase tracking-wide text-ink-faint"
        >
          from · {formatDuration(treatment.durationMinutes)}
        </span>
      </div>

      <div>
        <div class="eyebrow !text-ink-soft">The ritual includes</div>
        <ul class="mt-3 grid gap-2 sm:grid-cols-2">
          {#each treatment.includes as item (item)}
            <li class="flex items-start gap-2.5 font-sans text-sm text-ink">
              <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent"
              ></span>
              {item}
            </li>
          {/each}
        </ul>
      </div>

      {#if treatment.addons.length}
        <div>
          <div class="eyebrow !text-ink-soft">Optional add-ons</div>
          <ul
            class="mt-3 flex flex-col divide-y divide-line border-y border-line"
          >
            {#each treatment.addons as addon (addon.id)}
              <li
                class="flex items-center justify-between py-2.5 font-sans text-sm"
              >
                <span class="text-ink">{addon.name}</span>
                <span class="text-ink-soft"
                  >+{formatMoney(addon.price, treatment.currency)}</span
                >
              </li>
            {/each}
          </ul>
        </div>
      {/if}

      <div class="pt-2">
        <Button href={`/treatments/${treatment.slug}/book`} size="lg" full>
          Book this treatment
        </Button>
      </div>
    </div>
  </div>

  <!-- specialists -->
  <section class="border-t border-line py-16">
    <h2 class="font-display text-display-md text-ink">Your specialists</h2>
    <div class="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {#each stylists as stylist (stylist.id)}
        <div class="flex flex-col">
          <Img
            src={stylist.image}
            hue={stylist.hue}
            label={stylist.name}
            ratio="1 / 1"
          />
          <h3 class="mt-4 font-display text-xl text-ink">{stylist.name}</h3>
          <span
            class="mt-0.5 font-sans text-[0.68rem] uppercase tracking-wide text-ink-faint"
          >
            {stylist.title}
          </span>
        </div>
      {/each}
    </div>
  </section>

  {#if related.length}
    <section class="border-t border-line py-16">
      <h2 class="font-display text-display-md text-ink">You may also like</h2>
      <div class="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {#each related as item (item.id)}
          <TreatmentCard treatment={item} />
        {/each}
      </div>
    </section>
  {/if}
</article>
