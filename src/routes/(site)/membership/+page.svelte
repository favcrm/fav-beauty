<script lang="ts">
  import { listTiers } from "$lib/data/provider";
  import { formatMoney } from "$lib/format";
  import { auth, updateAccount } from "$lib/stores/auth";
  import { toasts } from "$lib/stores/toast";
  import { goto } from "$app/navigation";
  import Button from "$lib/components/Button.svelte";

  const tiers = listTiers();
  const billingLabel = {
    free: "",
    monthly: "/ month",
    yearly: "/ year",
  } as const;

  function enroll(tierId: string) {
    if (!$auth.account) {
      toasts.info("Sign in to join the house.");
      goto("/account?next=/membership");
      return;
    }
    updateAccount({ tierId });
    const tier = tiers.find((t) => t.id === tierId);
    toasts.success(`Welcome to ${tier?.name}.`);
  }
</script>

<svelte:head><title>Membership — Lueur</title></svelte:head>

<section class="shell pt-14">
  <div class="reveal flex flex-col gap-5 border-b border-line pb-12">
    <span class="eyebrow">Membership</span>
    <h1 class="max-w-4xl font-display text-display-lg text-ink">
      Beauty rewards rhythm. <span class="italic text-accent"
        >Join the house.</span
      >
    </h1>
    <p class="max-w-xl font-sans leading-relaxed text-ink-soft">
      Membership is not a discount card — it is a commitment to consistency, the
      single thing that most reliably improves skin and hair. Choose the rhythm
      that suits you.
    </p>
  </div>

  <div class="grid gap-6 py-14 lg:grid-cols-3">
    {#each tiers as tier (tier.id)}
      {@const current = $auth.account?.tierId === tier.id}
      <div
        class="flex flex-col rounded-bloom border p-8 transition-colors
               {tier.popular
          ? 'border-ink bg-ink text-paper'
          : 'border-line bg-paper'}"
      >
        <div class="flex items-center justify-between">
          <h2
            class="font-display text-3xl {tier.popular
              ? 'text-paper'
              : 'text-ink'}"
          >
            {tier.name}
          </h2>
          {#if tier.popular}
            <span
              class="bg-blush px-2.5 py-1 font-sans text-[0.56rem] uppercase tracking-wide text-ink"
            >
              Most chosen
            </span>
          {/if}
        </div>
        <p
          class="mt-3 font-sans text-sm leading-relaxed {tier.popular
            ? 'text-paper/70'
            : 'text-ink-soft'}"
        >
          {tier.blurb}
        </p>

        <div class="mt-6 flex items-baseline gap-2">
          <span
            class="font-display text-5xl {tier.popular
              ? 'text-paper'
              : 'text-ink'}"
          >
            {tier.price === 0 ? "Free" : formatMoney(tier.price, tier.currency)}
          </span>
          <span
            class="font-sans text-[0.7rem] uppercase tracking-wide {tier.popular
              ? 'text-paper/55'
              : 'text-ink-faint'}"
          >
            {billingLabel[tier.billing]}
          </span>
        </div>

        <ul
          class="mt-6 flex flex-1 flex-col gap-2.5 border-t pt-6
                   {tier.popular ? 'border-paper/15' : 'border-line'}"
        >
          {#each tier.benefits as benefit (benefit)}
            <li
              class="flex items-start gap-2.5 font-sans text-[0.85rem]
                       {tier.popular ? 'text-paper/85' : 'text-ink'}"
            >
              <span
                class="mt-1.5 h-1 w-1 shrink-0 rounded-full {tier.popular
                  ? 'bg-blush'
                  : 'bg-accent'}"
              ></span>
              {benefit}
            </li>
          {/each}
        </ul>

        <div class="mt-8">
          {#if current}
            <div
              class="border py-3 text-center font-sans text-[0.7rem] uppercase tracking-wide
                        {tier.popular
                ? 'border-paper/30 text-paper/70'
                : 'border-line text-ink-soft'}"
            >
              Your current tier
            </div>
          {:else if tier.popular}
            <Button
              variant="outline"
              size="md"
              full
              onclick={() => enroll(tier.id)}
            >
              <span class="text-paper"
                >{tier.price === 0 ? "Join" : "Subscribe"}</span
              >
            </Button>
          {:else}
            <Button size="md" full onclick={() => enroll(tier.id)}>
              {tier.price === 0 ? "Join free" : "Subscribe"}
            </Button>
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <div class="border-t border-line py-14">
    <p
      class="mx-auto max-w-2xl text-center font-display text-2xl italic leading-snug text-ink-soft"
    >
      "Our members book ahead, return on schedule, and — measurably — see better
      results. The saving is pleasant. The rhythm is the point."
    </p>
  </div>
</section>
