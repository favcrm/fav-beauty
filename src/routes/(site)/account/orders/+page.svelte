<script lang="ts">
  import { orders } from "$lib/stores/orders";
  import { formatMoney, formatDate } from "$lib/format";
  import Button from "$lib/components/Button.svelte";
</script>

<svelte:head><title>My Orders — Lueur</title></svelte:head>

<section class="shell py-14">
  <div class="flex items-end justify-between gap-4 border-b border-line pb-8">
    <div class="flex flex-col gap-2">
      <span class="eyebrow">My account</span>
      <h1 class="font-display text-display-md text-ink">Your orders</h1>
    </div>
    <a
      href="/account"
      class="link-underline font-sans text-[0.72rem] uppercase tracking-wide text-ink-soft"
    >
      ← Account
    </a>
  </div>

  {#if $orders.length === 0}
    <div class="mt-12 flex flex-col items-start gap-5">
      <p class="font-display text-2xl italic text-ink-soft">No orders yet.</p>
      <Button href="/shop" size="md">Browse the shop</Button>
    </div>
  {:else}
    <ul class="mt-4 flex flex-col divide-y divide-line border-b border-line">
      {#each $orders as order (order.id)}
        <li class="flex flex-col gap-3 py-7">
          <div class="flex flex-wrap items-baseline justify-between gap-3">
            <h2 class="font-display text-2xl text-ink">{order.id}</h2>
            <span class="font-display text-2xl text-ink">
              {formatMoney(order.total, order.currency)}
            </span>
          </div>
          <span
            class="font-sans text-[0.7rem] uppercase tracking-wide text-ink-faint"
          >
            {formatDate(order.placedAt)} · {order.lines.length} item{order.lines
              .length === 1
              ? ""
              : "s"}
          </span>
          <ul
            class="flex flex-col gap-1 border-t border-line pt-3 font-sans text-sm text-ink-soft"
          >
            {#each order.lines as line (line.productId)}
              <li class="flex justify-between">
                <span>{line.name} × {line.quantity}</span>
                <span
                  >{formatMoney(
                    line.price * line.quantity,
                    line.currency,
                  )}</span
                >
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>
  {/if}
</section>
