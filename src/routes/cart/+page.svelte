<script lang="ts">
  import {
    cart,
    cartTotal,
    setQuantity,
    removeFromCart,
  } from "$lib/stores/cart";
  import { formatMoney } from "$lib/format";
  import Button from "$lib/components/Button.svelte";
  import Img from "$lib/components/Img.svelte";

  const currency = $derived($cart[0]?.currency ?? "HKD");
  const shipping = $derived($cartTotal >= 800 || $cartTotal === 0 ? 0 : 60);
</script>

<svelte:head><title>Cart — Lueur</title></svelte:head>

<section class="shell py-14">
  <h1 class="font-display text-display-md text-ink">Your cart</h1>

  {#if $cart.length === 0}
    <div
      class="mt-12 flex flex-col items-start gap-5 border-t border-line pt-12"
    >
      <p class="font-display text-2xl italic text-ink-soft">
        Your cart is quietly empty.
      </p>
      <Button href="/shop" size="md">Browse the shop</Button>
    </div>
  {:else}
    <div class="mt-10 grid gap-12 lg:grid-cols-[1fr_22rem]">
      <ul class="flex flex-col divide-y divide-line border-y border-line">
        {#each $cart as line (line.productId)}
          <li class="flex gap-5 py-6">
            <div class="w-24 shrink-0">
              <Img
                src={line.image}
                hue={line.hue}
                label={line.name}
                ratio="1 / 1"
              />
            </div>
            <div class="flex flex-1 flex-col gap-2">
              <div class="flex justify-between gap-4">
                <h2 class="font-display text-xl text-ink">{line.name}</h2>
                <span class="font-sans text-sm text-ink">
                  {formatMoney(line.price * line.quantity, line.currency)}
                </span>
              </div>
              <div class="mt-auto flex items-center gap-4">
                <div class="flex items-center border border-line">
                  <button
                    class="px-3 py-1.5 text-ink hover:text-accent"
                    onclick={() =>
                      setQuantity(line.productId, line.quantity - 1)}>−</button
                  >
                  <span class="w-9 text-center font-sans text-sm"
                    >{line.quantity}</span
                  >
                  <button
                    class="px-3 py-1.5 text-ink hover:text-accent"
                    onclick={() =>
                      setQuantity(line.productId, line.quantity + 1)}>+</button
                  >
                </div>
                <button
                  class="link-underline font-sans text-[0.68rem] uppercase tracking-wide text-ink-faint"
                  onclick={() => removeFromCart(line.productId)}
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        {/each}
      </ul>

      <aside class="h-fit border border-line bg-bone p-6 lg:sticky lg:top-28">
        <h2 class="font-display text-2xl text-ink">Summary</h2>
        <dl
          class="mt-5 flex flex-col gap-2 border-t border-line pt-4 font-sans text-sm"
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
          <span class="font-display text-3xl text-ink">
            {formatMoney($cartTotal + shipping, currency)}
          </span>
        </div>
        <div class="mt-6">
          <Button href="/checkout" size="lg" full>Proceed to checkout</Button>
        </div>
        <a
          href="/shop"
          class="mt-4 block text-center font-sans text-[0.7rem] uppercase tracking-wide text-ink-soft hover:text-accent"
        >
          Continue shopping
        </a>
      </aside>
    </div>
  {/if}
</section>
