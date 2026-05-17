<script lang="ts">
  import "../app.css";
  import SiteHeader from "$lib/components/SiteHeader.svelte";
  import SiteFooter from "$lib/components/SiteFooter.svelte";
  import ToastViewport from "$lib/components/ToastViewport.svelte";
  import { getBrand } from "$lib/data/provider";

  let { children } = $props();
  const brand = getBrand();
</script>

<svelte:head>
  <title>{brand.name} — {brand.tagline}</title>
  <meta
    name="description"
    content="{brand.name} is a beauty atelier offering considered facials, hair colour, bodywork and retail. Book online."
  />
</svelte:head>

<div class="grain flex min-h-screen flex-col">
  {#if brand.demoMode}
    <div class="bg-ink text-paper">
      <div
        class="shell flex items-center justify-center gap-2 py-1.5 text-center font-sans text-[0.64rem] uppercase tracking-wide"
      >
        <span class="h-1 w-1 rounded-full bg-blush"></span>
        Demo data — connect a FavCRM workspace to go live
      </div>
    </div>
  {/if}

  <SiteHeader />
  <main class="relative z-10 flex-1">
    {@render children()}
  </main>
  <SiteFooter />
  <ToastViewport />
</div>
