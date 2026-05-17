<script lang="ts">
  import { formatMoney } from "$lib/format";
  import { addToCart } from "$lib/stores/cart";
  import { toasts } from "$lib/stores/toast";
  import Button from "$lib/components/Button.svelte";
  import Img from "$lib/components/Img.svelte";
  import ProductCard from "$lib/components/ProductCard.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  const product = $derived(data.product);
  const related = $derived(data.related);

  let qty = $state(1);

  function add() {
    addToCart(product, qty);
    toasts.success(`${product.name} added to cart`);
  }
</script>

<svelte:head><title>{product.name} — Lueur</title></svelte:head>

<article class="shell pt-14">
  <a
    href="/shop"
    class="link-underline font-sans text-[0.72rem] uppercase tracking-wide text-ink-soft"
  >
    ← Atelier shop
  </a>

  <div class="reveal mt-6 grid gap-12 pb-16 lg:grid-cols-2">
    <Img
      src={product.image}
      hue={product.hue}
      label={product.name}
      ratio="1 / 1"
      eager
    />

    <div class="flex flex-col gap-6">
      <span class="eyebrow">{product.brand} · {product.category}</span>
      <h1 class="font-display text-display-md text-ink">{product.name}</h1>
      <span class="font-display text-4xl text-ink"
        >{formatMoney(product.price, product.currency)}</span
      >
      <p class="max-w-md font-sans leading-relaxed text-ink-soft">
        {product.description}
      </p>

      <div class="flex items-center gap-4 border-y border-line py-5">
        <span class="eyebrow !text-ink-soft">Quantity</span>
        <div class="flex items-center border border-line">
          <button
            class="px-3.5 py-2 text-ink hover:text-accent"
            onclick={() => (qty = Math.max(1, qty - 1))}
          >
            −
          </button>
          <span class="w-10 text-center font-sans text-sm">{qty}</span>
          <button
            class="px-3.5 py-2 text-ink hover:text-accent"
            onclick={() => (qty = Math.min(product.stock, qty + 1))}
          >
            +
          </button>
        </div>
        <span
          class="font-sans text-[0.7rem] uppercase tracking-wide text-ink-faint"
        >
          {product.stock} in stock
        </span>
      </div>

      <Button size="lg" full onclick={add}
        >Add to cart — {formatMoney(
          product.price * qty,
          product.currency,
        )}</Button
      >

      <ul class="flex flex-col gap-2 font-sans text-[0.78rem] text-ink-soft">
        <li>· Complimentary atelier wrapping</li>
        <li>· Free local delivery over {formatMoney(800, product.currency)}</li>
        <li>· Used in our treatments — ask your specialist</li>
      </ul>
    </div>
  </div>

  {#if related.length}
    <section class="border-t border-line py-16">
      <h2 class="font-display text-display-md text-ink">
        More from {product.category}
      </h2>
      <div class="mt-10 grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {#each related as item (item.id)}
          <ProductCard product={item} />
        {/each}
      </div>
    </section>
  {/if}
</article>
