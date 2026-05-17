<script lang="ts">
  import type { Product } from "$lib/data/types";
  import { formatMoney } from "$lib/format";
  import { addToCart } from "$lib/stores/cart";
  import { toasts } from "$lib/stores/toast";
  import Img from "./Img.svelte";

  interface Props {
    product: Product;
  }
  let { product }: Props = $props();

  function quickAdd(event: MouseEvent) {
    event.preventDefault();
    addToCart(product);
    toasts.success(`${product.name} added to cart`);
  }
</script>

<div class="group flex flex-col">
  <a href={`/shop/${product.slug}`} class="relative block overflow-hidden">
    <div
      class="transition-transform duration-700 ease-editorial group-hover:scale-[1.04]"
    >
      <Img
        src={product.image}
        hue={product.hue}
        label={product.name}
        ratio="1 / 1"
      />
    </div>
    {#if product.stock <= 18}
      <span
        class="absolute right-3 top-3 bg-paper px-2 py-1 font-sans text-[0.58rem] uppercase tracking-wide text-accent"
      >
        Low stock
      </span>
    {/if}
    <button
      onclick={quickAdd}
      class="absolute inset-x-0 bottom-0 translate-y-full bg-ink py-3 font-sans text-[0.66rem] uppercase tracking-wide text-paper transition-transform duration-300 ease-editorial group-hover:translate-y-0"
    >
      Quick add
    </button>
  </a>
  <span
    class="mt-3 font-sans text-[0.66rem] uppercase tracking-wide text-ink-faint"
    >{product.brand}</span
  >
  <a href={`/shop/${product.slug}`} class="mt-0.5">
    <h3
      class="font-display text-xl leading-tight text-ink transition-colors hover:text-accent"
    >
      {product.name}
    </h3>
  </a>
  <span class="mt-1 font-sans text-sm text-ink-soft"
    >{formatMoney(product.price, product.currency)}</span
  >
</div>
