<script lang="ts">
  import { listEvents } from "$lib/data/provider";
  import { formatMoney, formatDate } from "$lib/format";
  import { toasts } from "$lib/stores/toast";
  import Button from "$lib/components/Button.svelte";
  import Img from "$lib/components/Img.svelte";

  const events = listEvents();
  let reserved = $state<string[]>([]);

  function reserve(slug: string, title: string) {
    if (reserved.includes(slug)) return;
    reserved = [...reserved, slug];
    toasts.success(`Reserved your seat — ${title}`);
  }
</script>

<svelte:head><title>Events — Lueur</title></svelte:head>

<section class="shell pt-14">
  <div class="reveal flex flex-col gap-5 border-b border-line pb-10">
    <span class="eyebrow">Atelier events</span>
    <h1 class="max-w-3xl font-display text-display-lg text-ink">
      Evenings at the house.
    </h1>
    <p class="max-w-xl font-sans leading-relaxed text-ink-soft">
      Small-group clinics, masterclasses and member previews. Seats are limited
      — the rooms are intentionally intimate.
    </p>
  </div>

  <div class="flex flex-col divide-y divide-line border-b border-line py-4">
    {#each events as event (event.slug)}
      <article
        class="grid gap-6 py-10 lg:grid-cols-[0.7fr_1.3fr_auto] lg:items-center"
      >
        <Img src={null} hue={event.hue} label={event.title} ratio="4 / 3" />
        <div class="flex flex-col gap-2">
          <span
            class="font-sans text-[0.66rem] uppercase tracking-wide text-accent"
          >
            {formatDate(event.date, {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
            · {event.startTime}
          </span>
          <h2 class="font-display text-3xl text-ink">{event.title}</h2>
          <p class="max-w-md font-sans text-sm leading-relaxed text-ink-soft">
            {event.summary}
          </p>
          <span
            class="mt-1 font-sans text-[0.7rem] uppercase tracking-wide text-ink-faint"
          >
            {event.location} · {event.seatsLeft} seats left
          </span>
        </div>
        <div class="flex flex-col items-start gap-3 lg:items-end">
          <span class="font-display text-3xl text-ink">
            {event.price === 0
              ? "Free"
              : formatMoney(event.price, event.currency)}
          </span>
          <Button
            size="md"
            onclick={() => reserve(event.slug, event.title)}
            disabled={reserved.includes(event.slug)}
          >
            {reserved.includes(event.slug) ? "Seat reserved" : "Reserve a seat"}
          </Button>
        </div>
      </article>
    {/each}
  </div>
</section>
