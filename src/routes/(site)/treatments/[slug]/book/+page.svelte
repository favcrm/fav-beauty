<script lang="ts">
  import { get } from "svelte/store";
  import { listStylists, getTimeSlots } from "$lib/data/provider";
  import { formatMoney, formatDuration, formatDate } from "$lib/format";
  import { auth } from "$lib/stores/auth";
  import { createBooking } from "$lib/stores/bookings";
  import { toasts } from "$lib/stores/toast";
  import Button from "$lib/components/Button.svelte";
  import Field from "$lib/components/Field.svelte";
  import Img from "$lib/components/Img.svelte";
  import type { Booking } from "$lib/data/types";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  const treatment = $derived(data.treatment);
  const stylists = listStylists();

  let step = $state(1);
  let stylistId = $state(stylists[0].id);
  let dateISO = $state("");
  let time = $state("");
  let addonIds = $state<string[]>([]);

  const account = get(auth).account;
  let guestName = $state(account?.name ?? "");
  let guestEmail = $state(account?.email ?? "");
  let guestPhone = $state(account?.phone ?? "");
  let notes = $state("");

  let confirmed = $state<Booking | null>(null);

  // next 14 bookable days
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().slice(0, 10);
  });

  const slots = $derived(dateISO ? getTimeSlots(stylistId, dateISO) : []);
  const stylist = $derived(stylists.find((s) => s.id === stylistId)!);
  const addonTotal = $derived(
    treatment.addons
      .filter((a) => addonIds.includes(a.id))
      .reduce((sum, a) => sum + a.price, 0),
  );
  const total = $derived(treatment.price + addonTotal);
  const extraMinutes = $derived(
    treatment.addons
      .filter((a) => addonIds.includes(a.id))
      .reduce((sum, a) => sum + a.durationMinutes, 0),
  );

  function pickDate(d: string) {
    dateISO = d;
    time = "";
  }
  function toggleAddon(id: string) {
    addonIds = addonIds.includes(id)
      ? addonIds.filter((a) => a !== id)
      : [...addonIds, id];
  }
  function next() {
    if (step === 1 && (!dateISO || !time)) {
      toasts.error("Please choose a date and time.");
      return;
    }
    if (step === 3) {
      if (!guestName || !guestEmail.includes("@") || !guestPhone) {
        toasts.error("Please complete your details.");
        return;
      }
      confirm();
      return;
    }
    step += 1;
  }
  function back() {
    if (step > 1) step -= 1;
  }
  function confirm() {
    confirmed = createBooking({
      treatmentId: treatment.id,
      treatmentName: treatment.name,
      stylistId,
      stylistName: stylist.name,
      date: dateISO,
      time,
      addonIds,
      total,
      currency: treatment.currency,
      guestName,
      guestEmail,
      guestPhone,
      notes,
    });
    step = 4;
    toasts.success("Booking confirmed.");
  }

  const steps = ["Date & time", "Add-ons", "Your details", "Confirmed"];
</script>

<svelte:head><title>Book {treatment.name} — Lueur</title></svelte:head>

<section class="shell grid gap-12 py-14 lg:grid-cols-[1fr_22rem]">
  <!-- ── main column ──────────────────────────────────── -->
  <div class="reveal flex flex-col gap-8">
    <div>
      <a
        href={`/treatments/${treatment.slug}`}
        class="link-underline font-sans text-[0.72rem] uppercase tracking-wide text-ink-soft"
      >
        ← {treatment.name}
      </a>
      <h1 class="mt-4 font-display text-display-md text-ink">
        Book your visit
      </h1>
    </div>

    <!-- stepper -->
    <ol class="flex flex-wrap gap-x-6 gap-y-2 border-y border-line py-4">
      {#each steps as label, i (label)}
        <li
          class="flex items-center gap-2 font-sans text-[0.7rem] uppercase tracking-wide"
        >
          <span
            class="grid h-5 w-5 place-items-center rounded-full text-[0.6rem]
                   {step > i + 1
              ? 'bg-accent text-paper'
              : step === i + 1
                ? 'bg-ink text-paper'
                : 'border border-line text-ink-faint'}"
          >
            {i + 1}
          </span>
          <span class={step === i + 1 ? "text-ink" : "text-ink-faint"}
            >{label}</span
          >
        </li>
      {/each}
    </ol>

    {#if step === 1}
      <div class="flex flex-col gap-7">
        <div>
          <div class="eyebrow !text-ink-soft">Choose your specialist</div>
          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            {#each stylists as s (s.id)}
              <button
                onclick={() => {
                  stylistId = s.id;
                  time = "";
                }}
                class="flex items-center gap-3 border p-3 text-left transition-colors
                       {stylistId === s.id
                  ? 'border-ink'
                  : 'border-line hover:border-ink-soft'}"
              >
                <div class="w-12 shrink-0">
                  <Img src={s.image} hue={s.hue} label={s.name} ratio="1 / 1" />
                </div>
                <span>
                  <span
                    class="block font-display text-lg leading-tight text-ink"
                    >{s.name}</span
                  >
                  <span
                    class="font-sans text-[0.64rem] uppercase tracking-wide text-ink-faint"
                  >
                    {s.title}
                  </span>
                </span>
              </button>
            {/each}
          </div>
        </div>

        <div>
          <div class="eyebrow !text-ink-soft">Select a date</div>
          <div class="mt-3 flex gap-2 overflow-x-auto pb-2">
            {#each days as d (d)}
              {@const dt = new Date(d)}
              <button
                onclick={() => pickDate(d)}
                class="flex shrink-0 flex-col items-center border px-3.5 py-2.5 transition-colors
                       {dateISO === d
                  ? 'border-ink bg-ink text-paper'
                  : 'border-line hover:border-ink-soft'}"
              >
                <span
                  class="font-sans text-[0.6rem] uppercase tracking-wide opacity-70"
                >
                  {dt.toLocaleDateString("en-GB", { weekday: "short" })}
                </span>
                <span class="font-display text-xl leading-tight"
                  >{dt.getDate()}</span
                >
                <span class="font-sans text-[0.58rem] uppercase opacity-70">
                  {dt.toLocaleDateString("en-GB", { month: "short" })}
                </span>
              </button>
            {/each}
          </div>
        </div>

        {#if dateISO}
          <div>
            <div class="eyebrow !text-ink-soft">Available times</div>
            <div class="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {#each slots as slot (slot.time)}
                <button
                  disabled={!slot.available}
                  onclick={() => (time = slot.time)}
                  class="border py-2 font-sans text-sm transition-colors
                         {time === slot.time
                    ? 'border-ink bg-ink text-paper'
                    : slot.available
                      ? 'border-line text-ink hover:border-ink-soft'
                      : 'border-line/50 text-ink-faint line-through'}"
                >
                  {slot.time}
                </button>
              {/each}
            </div>
          </div>
        {/if}
      </div>
    {:else if step === 2}
      <div class="flex flex-col gap-3">
        <div class="eyebrow !text-ink-soft">Enhance your treatment</div>
        {#if treatment.addons.length}
          {#each treatment.addons as addon (addon.id)}
            <button
              onclick={() => toggleAddon(addon.id)}
              class="flex items-center justify-between border p-4 text-left transition-colors
                     {addonIds.includes(addon.id)
                ? 'border-ink bg-bone'
                : 'border-line hover:border-ink-soft'}"
            >
              <span class="flex items-center gap-3">
                <span
                  class="grid h-5 w-5 place-items-center border text-[0.6rem]
                         {addonIds.includes(addon.id)
                    ? 'border-ink bg-ink text-paper'
                    : 'border-line'}"
                >
                  {addonIds.includes(addon.id) ? "✓" : ""}
                </span>
                <span>
                  <span class="block font-display text-lg text-ink"
                    >{addon.name}</span
                  >
                  <span
                    class="font-sans text-[0.66rem] uppercase tracking-wide text-ink-faint"
                  >
                    +{formatDuration(addon.durationMinutes)}
                  </span>
                </span>
              </span>
              <span class="font-sans text-sm text-ink">
                +{formatMoney(addon.price, treatment.currency)}
              </span>
            </button>
          {/each}
        {:else}
          <p class="font-sans text-sm text-ink-soft">
            No add-ons for this treatment.
          </p>
        {/if}
      </div>
    {:else if step === 3}
      <div class="flex flex-col gap-5">
        <div class="eyebrow !text-ink-soft">
          {account ? "Confirm your details" : "Your details"}
        </div>
        <div class="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" bind:value={guestName} required />
          <Field label="Phone" bind:value={guestPhone} type="tel" required />
        </div>
        <Field label="Email" bind:value={guestEmail} type="email" required />
        <Field
          label="Notes for your specialist"
          bind:value={notes}
          multiline
          hint="Allergies, preferences, anything we should know."
        />
        {#if !account}
          <p class="font-sans text-[0.74rem] text-ink-faint">
            Booking as a guest. <a
              href="/account"
              class="link-underline text-accent">Sign in</a
            >
            to save your history.
          </p>
        {/if}
      </div>
    {:else}
      <!-- confirmation -->
      <div
        class="flex flex-col gap-6 rounded-bloom border border-line bg-bone p-8"
      >
        <span class="text-3xl text-accent">✦</span>
        <h2 class="font-display text-display-md text-ink">You're booked in.</h2>
        <p class="max-w-md font-sans leading-relaxed text-ink-soft">
          A confirmation has been sent to {confirmed?.guestEmail}. We look
          forward to seeing you.
        </p>
        <dl
          class="grid gap-x-8 gap-y-3 border-t border-line pt-5 sm:grid-cols-2"
        >
          <div>
            <dt
              class="font-sans text-[0.64rem] uppercase tracking-wide text-ink-faint"
            >
              Reference
            </dt>
            <dd class="font-display text-xl text-ink">{confirmed?.id}</dd>
          </div>
          <div>
            <dt
              class="font-sans text-[0.64rem] uppercase tracking-wide text-ink-faint"
            >
              When
            </dt>
            <dd class="font-display text-xl text-ink">
              {confirmed &&
                formatDate(confirmed.date, {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              · {confirmed?.time}
            </dd>
          </div>
          <div>
            <dt
              class="font-sans text-[0.64rem] uppercase tracking-wide text-ink-faint"
            >
              Specialist
            </dt>
            <dd class="font-display text-xl text-ink">
              {confirmed?.stylistName}
            </dd>
          </div>
          <div>
            <dt
              class="font-sans text-[0.64rem] uppercase tracking-wide text-ink-faint"
            >
              Total
            </dt>
            <dd class="font-display text-xl text-ink">
              {confirmed && formatMoney(confirmed.total, confirmed.currency)}
            </dd>
          </div>
        </dl>
        <div class="flex flex-wrap gap-3">
          <Button href="/account/bookings" size="md">View my bookings</Button>
          <Button href="/treatments" variant="outline" size="md"
            >Book another</Button
          >
        </div>
      </div>
    {/if}

    {#if step < 4}
      <div class="flex items-center justify-between border-t border-line pt-6">
        {#if step > 1}
          <button
            onclick={back}
            class="link-underline font-sans text-sm uppercase tracking-wide text-ink-soft"
          >
            ← Back
          </button>
        {:else}
          <span></span>
        {/if}
        <Button size="md" onclick={next}>
          {step === 3 ? "Confirm booking" : "Continue"}
        </Button>
      </div>
    {/if}
  </div>

  <!-- ── summary rail ─────────────────────────────────── -->
  <aside
    class="h-fit rounded-bloom border border-line bg-bone p-6 lg:sticky lg:top-28"
  >
    <Img
      src={treatment.image}
      hue={treatment.hue}
      label={treatment.name}
      ratio="3 / 2"
    />
    <h2 class="mt-4 font-display text-2xl text-ink">{treatment.name}</h2>
    <p class="mt-1 font-sans text-sm text-ink-soft">{treatment.tagline}</p>

    <dl
      class="mt-5 flex flex-col gap-2 border-t border-line pt-4 font-sans text-sm"
    >
      <div class="flex justify-between">
        <dt class="text-ink-soft">Treatment</dt>
        <dd class="text-ink">
          {formatMoney(treatment.price, treatment.currency)}
        </dd>
      </div>
      {#each treatment.addons.filter( (a) => addonIds.includes(a.id), ) as a (a.id)}
        <div class="flex justify-between">
          <dt class="text-ink-soft">{a.name}</dt>
          <dd class="text-ink">+{formatMoney(a.price, treatment.currency)}</dd>
        </div>
      {/each}
      <div class="flex justify-between">
        <dt class="text-ink-soft">Duration</dt>
        <dd class="text-ink">
          {formatDuration(treatment.durationMinutes + extraMinutes)}
        </dd>
      </div>
      {#if dateISO && time}
        <div class="flex justify-between">
          <dt class="text-ink-soft">When</dt>
          <dd class="text-ink">
            {formatDate(dateISO, { day: "numeric", month: "short" })} · {time}
          </dd>
        </div>
      {/if}
    </dl>

    <div
      class="mt-4 flex items-baseline justify-between border-t border-ink pt-4"
    >
      <span
        class="font-sans text-[0.7rem] uppercase tracking-wide text-ink-soft"
        >Total</span
      >
      <span class="font-display text-3xl text-ink"
        >{formatMoney(total, treatment.currency)}</span
      >
    </div>
  </aside>
</section>
