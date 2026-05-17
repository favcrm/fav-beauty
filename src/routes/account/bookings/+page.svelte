<script lang="ts">
  import { bookings, cancelBooking } from "$lib/stores/bookings";
  import { formatMoney, formatDate } from "$lib/format";
  import { toasts } from "$lib/stores/toast";
  import Button from "$lib/components/Button.svelte";

  function cancel(id: string) {
    cancelBooking(id);
    toasts.info("Booking cancelled.");
  }

  const statusTone = {
    confirmed: "text-accent",
    completed: "text-ink-soft",
    cancelled: "text-ink-faint line-through",
  } as const;
</script>

<svelte:head><title>My Bookings — Lueur</title></svelte:head>

<section class="shell py-14">
  <div class="flex items-end justify-between gap-4 border-b border-line pb-8">
    <div class="flex flex-col gap-2">
      <span class="eyebrow">My account</span>
      <h1 class="font-display text-display-md text-ink">Your bookings</h1>
    </div>
    <a
      href="/account"
      class="link-underline font-sans text-[0.72rem] uppercase tracking-wide text-ink-soft"
    >
      ← Account
    </a>
  </div>

  {#if $bookings.length === 0}
    <div class="mt-12 flex flex-col items-start gap-5">
      <p class="font-display text-2xl italic text-ink-soft">No bookings yet.</p>
      <Button href="/treatments" size="md">Book a treatment</Button>
    </div>
  {:else}
    <ul class="mt-4 flex flex-col divide-y divide-line border-b border-line">
      {#each $bookings as b (b.id)}
        <li class="grid gap-4 py-7 sm:grid-cols-[1fr_auto] sm:items-center">
          <div class="flex flex-col gap-1.5">
            <span
              class="font-sans text-[0.64rem] uppercase tracking-wide {statusTone[
                b.status
              ]}"
            >
              {b.status} · {b.id}
            </span>
            <h2 class="font-display text-2xl text-ink">{b.treatmentName}</h2>
            <span class="font-sans text-sm text-ink-soft">
              {formatDate(b.date, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
              · {b.time} · with {b.stylistName}
            </span>
          </div>
          <div class="flex items-center gap-5 sm:justify-end">
            <span class="font-display text-2xl text-ink"
              >{formatMoney(b.total, b.currency)}</span
            >
            {#if b.status === "confirmed"}
              <button
                class="link-underline font-sans text-[0.68rem] uppercase tracking-wide text-ink-faint"
                onclick={() => cancel(b.id)}
              >
                Cancel
              </button>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>
