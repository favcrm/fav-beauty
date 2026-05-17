<script lang="ts">
  import { get } from "svelte/store";
  import { cart, cartTotal, clearCart } from "$lib/stores/cart";
  import { auth } from "$lib/stores/auth";
  import { placeOrder, type Order } from "$lib/stores/orders";
  import { formatMoney } from "$lib/format";
  import { toasts } from "$lib/stores/toast";
  import Button from "$lib/components/Button.svelte";
  import Field from "$lib/components/Field.svelte";

  const account = get(auth).account;
  let name = $state(account?.name ?? "");
  let email = $state(account?.email ?? "");
  let phone = $state(account?.phone ?? "");
  let address = $state("");
  let placed = $state<Order | null>(null);

  const currency = $derived($cart[0]?.currency ?? "HKD");
  const shipping = $derived($cartTotal >= 800 ? 0 : 60);
  const grand = $derived($cartTotal + shipping);

  function submit(event: SubmitEvent) {
    event.preventDefault();
    if (!name || !email.includes("@") || !phone || !address) {
      toasts.error("Please complete every field.");
      return;
    }
    placed = placeOrder({
      lines: get(cart),
      total: grand,
      currency,
      customerName: name,
      customerEmail: email,
    });
    clearCart();
    toasts.success("Order placed.");
  }
</script>

<svelte:head><title>Checkout — Lueur</title></svelte:head>

<section class="shell py-14">
  {#if placed}
    <div
      class="reveal mx-auto flex max-w-xl flex-col items-center gap-6 py-12 text-center"
    >
      <span class="text-3xl text-accent">✦</span>
      <h1 class="font-display text-display-md text-ink">
        Thank you, {placed.customerName.split(" ")[0]}.
      </h1>
      <p class="font-sans leading-relaxed text-ink-soft">
        Order <strong class="text-ink">{placed.id}</strong> is confirmed. A
        receipt is on its way to {placed.customerEmail}.
      </p>
      <div class="font-display text-4xl text-ink">
        {formatMoney(placed.total, placed.currency)}
      </div>
      <div class="flex gap-3">
        <Button href="/shop" size="md">Continue shopping</Button>
        <Button href="/account/orders" variant="outline" size="md"
          >View orders</Button
        >
      </div>
    </div>
  {:else if $cart.length === 0}
    <div class="flex flex-col items-start gap-5">
      <h1 class="font-display text-display-md text-ink">Checkout</h1>
      <p class="font-display text-2xl italic text-ink-soft">
        There is nothing to check out yet.
      </p>
      <Button href="/shop" size="md">Browse the shop</Button>
    </div>
  {:else}
    <h1 class="font-display text-display-md text-ink">Checkout</h1>
    <div class="mt-10 grid gap-12 lg:grid-cols-[1fr_22rem]">
      <form class="reveal flex flex-col gap-8" onsubmit={submit}>
        <fieldset class="flex flex-col gap-5">
          <legend class="eyebrow !text-ink-soft mb-2">Contact</legend>
          <div class="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" bind:value={name} required />
            <Field label="Phone" bind:value={phone} type="tel" required />
          </div>
          <Field label="Email" bind:value={email} type="email" required />
        </fieldset>

        <fieldset class="flex flex-col gap-5">
          <legend class="eyebrow !text-ink-soft mb-2">Delivery</legend>
          <Field
            label="Delivery address"
            bind:value={address}
            multiline
            required
          />
        </fieldset>

        <fieldset class="flex flex-col gap-3">
          <legend class="eyebrow !text-ink-soft mb-2">Payment</legend>
          <div
            class="border border-line bg-bone p-4 font-sans text-[0.78rem] text-ink-soft"
          >
            Demo checkout — no card is charged. In live mode this step hands off
            to the FavCRM payment gateway.
          </div>
        </fieldset>

        <Button type="submit" size="lg" full>
          Place order — {formatMoney(grand, currency)}
        </Button>
      </form>

      <aside class="h-fit border border-line bg-bone p-6 lg:sticky lg:top-28">
        <h2 class="font-display text-2xl text-ink">Your order</h2>
        <ul
          class="mt-4 flex flex-col gap-2 border-t border-line pt-4 font-sans text-sm"
        >
          {#each $cart as line (line.productId)}
            <li class="flex justify-between gap-3">
              <span class="text-ink-soft">{line.name} × {line.quantity}</span>
              <span class="text-ink"
                >{formatMoney(line.price * line.quantity, line.currency)}</span
              >
            </li>
          {/each}
        </ul>
        <dl
          class="mt-4 flex flex-col gap-2 border-t border-line pt-4 font-sans text-sm"
        >
          <div class="flex justify-between">
            <dt class="text-ink-soft">Subtotal</dt>
            <dd class="text-ink">{formatMoney($cartTotal, currency)}</dd>
          </div>
          <div class="flex justify-between">
            <dt class="text-ink-soft">Delivery</dt>
            <dd class="text-ink">
              {shipping === 0
                ? "Complimentary"
                : formatMoney(shipping, currency)}
            </dd>
          </div>
        </dl>
        <div
          class="mt-4 flex items-baseline justify-between border-t border-ink pt-4"
        >
          <span
            class="font-sans text-[0.7rem] uppercase tracking-wide text-ink-soft"
            >Total</span
          >
          <span class="font-display text-3xl text-ink"
            >{formatMoney(grand, currency)}</span
          >
        </div>
      </aside>
    </div>
  {/if}
</section>
