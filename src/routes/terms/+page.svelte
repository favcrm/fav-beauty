<script lang="ts">
  import { getBrand } from "$lib/data/provider";
  const brand = getBrand();
</script>

<svelte:head><title>Terms — Lueur</title></svelte:head>

<section class="shell py-14">
  <div class="mx-auto max-w-2xl flex flex-col gap-6">
    <span class="eyebrow">Legal</span>
    <h1 class="font-display text-display-md text-ink">Terms of service</h1>
    <p class="font-sans leading-relaxed text-ink-soft">
      This is template copy. {brand.legalName} should replace it with terms covering
      bookings, cancellations, deposits, retail returns and membership conditions.
    </p>
    <p class="font-sans leading-relaxed text-ink-soft">
      Editing this page lives at
      <code class="bg-bone px-1.5 py-0.5 text-[0.85em]"
        >src/routes/terms/+page.svelte</code
      >.
    </p>
  </div>
</section>
