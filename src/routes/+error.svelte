<script lang="ts">
  import { page } from "$app/stores";
  import Button from "$lib/components/Button.svelte";
</script>

<svelte:head><title>Not found — Lueur</title></svelte:head>

<section
  class="shell flex min-h-[60vh] flex-col items-center justify-center gap-6 py-20 text-center"
>
  <span class="font-display text-display-xl italic text-accent"
    >{$page.status}</span
  >
  <h1 class="font-display text-display-md text-ink">
    {$page.error?.message ?? "This page slipped away."}
  </h1>
  <p class="max-w-sm font-sans leading-relaxed text-ink-soft">
    The page you were looking for isn't here. Let us guide you back to the
    atelier.
  </p>
  <div class="flex gap-3">
    <Button href="/" size="md">Return home</Button>
    <Button href="/treatments" variant="outline" size="md"
      >Browse treatments</Button
    >
  </div>
</section>
