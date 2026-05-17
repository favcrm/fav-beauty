<script lang="ts">
  import { getBrand } from "$lib/data/provider";
  const brand = getBrand();
</script>

<svelte:head><title>Privacy — Lueur</title></svelte:head>

<section class="shell py-14">
  <div class="mx-auto max-w-2xl flex flex-col gap-6">
    <span class="eyebrow">Legal</span>
    <h1 class="font-display text-display-md text-ink">Privacy notice</h1>
    <p class="font-sans leading-relaxed text-ink-soft">
      This is template copy. {brand.legalName} should replace it with a privacy notice
      that reflects how the salon actually collects, stores and uses client information.
    </p>
    <p class="font-sans leading-relaxed text-ink-soft">
      In live mode, client records (bookings, contact details, treatment
      history) are held in the connected FavCRM workspace. Editing this page
      lives at
      <code class="bg-bone px-1.5 py-0.5 text-[0.85em]"
        >src/routes/privacy/+page.svelte</code
      >.
    </p>
  </div>
</section>
