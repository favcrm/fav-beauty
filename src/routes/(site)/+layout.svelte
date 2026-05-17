<script lang="ts">
  import SiteHeader from "$lib/components/SiteHeader.svelte";
  import SiteFooter from "$lib/components/SiteFooter.svelte";
  import { getBrand } from "$lib/data/provider";

  let { children, data } = $props();
  // companyId is resolved from the request hostname by hooks.server.ts and
  // exposed via the root +layout.server.ts — so the demo banner reflects the
  // hostname-resolved live state, not just the build-time env var. It is
  // stable per render, so capturing it once at init is intentional.
  // svelte-ignore state_referenced_locally
  const brand = getBrand({ companyId: data.companyId });
</script>

<svelte:head>
  <title>{brand.name} — {brand.tagline}</title>
  <meta
    name="description"
    content="{brand.name} is a beauty atelier offering considered facials, hair colour, bodywork and retail. Book online."
  />
</svelte:head>

<div class="flex min-h-screen flex-col">
  {#if brand.demoMode}
    <a
      href="/setup"
      class="block bg-ink text-paper transition-colors hover:bg-accent-deep"
    >
      <div
        class="shell flex items-center justify-center gap-2 py-1.5 text-center font-sans text-[0.64rem] uppercase tracking-wide"
      >
        <span class="h-1 w-1 rounded-full bg-blush"></span>
        Demo data — connect a FavCRM workspace to go live
        <span aria-hidden="true">→</span>
      </div>
    </a>
  {/if}

  <SiteHeader />
  <main class="relative z-10 flex-1">
    {@render children()}
  </main>
  <SiteFooter />
</div>
