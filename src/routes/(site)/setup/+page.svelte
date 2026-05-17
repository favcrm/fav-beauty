<script lang="ts">
  import { getBrand, isLiveMode } from "$lib/data/provider";
  import {
    listTreatments,
    listProducts,
    listStylists,
    listTiers,
  } from "$lib/data/provider";
  import Button from "$lib/components/Button.svelte";

  const brand = getBrand();
  const live = isLiveMode();

  const seeded = [
    { label: "Treatments", count: listTreatments().length },
    { label: "Products", count: listProducts().length },
    { label: "Stylists", count: listStylists().length },
    { label: "Membership tiers", count: listTiers().length },
  ];

  const steps = [
    {
      n: "01",
      title: "Create a FavCRM workspace",
      body: "Sign up at app.favcrm.io and set up your salon — services, staff, products. Your workspace has a unique ID (a UUID).",
    },
    {
      n: "02",
      title: "Add the workspace ID",
      body: "In your Vercel project settings, add an environment variable VITE_FAVCRM_COMPANY_ID with your workspace UUID.",
    },
    {
      n: "03",
      title: "Redeploy",
      body: "Trigger a redeploy. The site switches from demo data to your live FavCRM workspace — bookings, members and orders become real.",
    },
  ];
</script>

<svelte:head><title>Setup — Lueur</title></svelte:head>

<section class="relative overflow-x-clip">
  <div
    class="bloom"
    style="width:30rem;height:30rem;top:-9rem;right:-8rem;background:radial-gradient(closest-side,rgba(236,198,193,0.55),transparent)"
  ></div>

  <div class="shell relative z-10 py-16">
    <div class="reveal mx-auto flex max-w-3xl flex-col gap-10">
      <header class="flex flex-col gap-4">
        <span class="eyebrow">Template setup</span>
        <h1 class="font-display text-display-lg text-ink">
          Connect this template to <span class="italic text-accent"
            >FavCRM.</span
          >
        </h1>
        <p class="font-sans leading-relaxed text-ink-soft">
          This template runs in two modes. Right now it is showing built-in demo
          content so you can deploy and explore with zero configuration. When
          you are ready, connect a FavCRM workspace to make it live.
        </p>
      </header>

      <!-- mode card -->
      <div
        class="flex flex-col gap-4 rounded-bloom border border-line bg-bone p-7 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="flex items-center gap-4">
          <span
            class="grid h-12 w-12 shrink-0 place-items-center rounded-full text-lg"
            class:bg-ink={!live}
            class:text-paper={!live}
            class:bg-accent={live}
          >
            {live ? "✦" : "◐"}
          </span>
          <div>
            <div class="font-display text-2xl text-ink">
              {live ? "Live mode" : "Demo mode"}
            </div>
            <div class="font-sans text-[0.8rem] text-ink-soft">
              {live
                ? "Connected to a FavCRM workspace."
                : "Showing built-in seed data — nothing is connected yet."}
            </div>
          </div>
        </div>
        <span
          class="w-fit rounded-full border border-line px-4 py-1.5 font-sans text-[0.64rem] uppercase tracking-wide text-ink-soft"
        >
          {brand.name} · {brand.city}
        </span>
      </div>

      <!-- demo contents -->
      {#if !live}
        <div class="flex flex-col gap-4">
          <h2 class="font-display text-2xl text-ink">What the demo includes</h2>
          <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {#each seeded as item (item.label)}
              <div
                class="rounded-petal border border-line bg-paper px-4 py-5 text-center"
              >
                <div class="font-display text-4xl text-ink">{item.count}</div>
                <div
                  class="mt-1 font-sans text-[0.62rem] uppercase tracking-wide text-ink-faint"
                >
                  {item.label}
                </div>
              </div>
            {/each}
          </div>
          <p class="font-sans text-[0.8rem] text-ink-soft">
            Edit the seed content in <code
              class="bg-bone px-1.5 py-0.5 text-[0.85em]"
              >src/lib/data/mock/</code
            > — or replace it entirely once your workspace is connected.
          </p>
        </div>
      {/if}

      <!-- go live steps -->
      <div class="flex flex-col gap-4">
        <h2 class="font-display text-2xl text-ink">Going live</h2>
        <ol class="flex flex-col gap-3">
          {#each steps as step (step.n)}
            <li
              class="flex gap-5 rounded-bloom border border-line bg-paper p-6"
            >
              <span class="font-display text-3xl italic text-accent"
                >{step.n}</span
              >
              <div class="flex flex-col gap-1">
                <h3 class="font-display text-xl text-ink">{step.title}</h3>
                <p
                  class="font-sans text-[0.86rem] leading-relaxed text-ink-soft"
                >
                  {step.body}
                </p>
              </div>
            </li>
          {/each}
        </ol>
      </div>

      <!-- phase 2 note -->
      <div
        class="rounded-bloom border border-dashed border-clay bg-bone/60 p-6"
      >
        <div class="eyebrow !text-ink-soft">Roadmap</div>
        <p class="mt-2 font-sans text-[0.86rem] leading-relaxed text-ink-soft">
          Live-mode data wiring (FavCRM SDK), a guided in-app registration flow
          and the merchant admin panel are part of the next release. Until then,
          demo mode is the full, deployable experience.
        </p>
      </div>

      <div class="flex flex-wrap gap-4">
        <Button href="/" size="md">Back to the site</Button>
        <Button href="https://app.favcrm.io" variant="outline" size="md">
          Open FavCRM
        </Button>
      </div>
    </div>
  </div>
</section>
