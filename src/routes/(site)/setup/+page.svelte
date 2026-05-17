<script lang="ts">
  import { getBrand, isLiveMode } from "$lib/data/provider";
  import { adminAuthApi } from "$lib/api/admin";
  import { adminLogin } from "$lib/stores/admin-auth";
  import { validateEmail, validateRequired } from "$lib/utils/form-validation";
  import Button from "$lib/components/Button.svelte";
  import Field from "$lib/components/Field.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  // companyId is resolved from the request hostname (hooks.server.ts) and
  // exposed via the root +layout.server.ts — the mode card reflects it.
  // It is stable per render, so capturing it once at init is intentional.
  // svelte-ignore state_referenced_locally
  const ctx = { companyId: data.companyId };
  const brand = getBrand(ctx);
  const live = isLiveMode(ctx);

  const seeded = $derived([
    { label: "Treatments", count: data.counts.treatments },
    { label: "Products", count: data.counts.products },
    { label: "Stylists", count: data.counts.stylists },
    { label: "Membership tiers", count: data.counts.tiers },
  ]);

  // ── Registration wizard ──

  let businessName = $state("");
  let firstName = $state("");
  let lastName = $state("");
  let email = $state("");
  let password = $state("");

  let error = $state("");
  let submitting = $state(false);
  let createdCompanyId = $state<string | null>(null);
  let createdCompanyName = $state("");
  let copied = $state(false);

  function validate(): string | null {
    const checks = [
      validateRequired(businessName, "businessName", "Business name"),
      validateRequired(firstName, "firstName", "First name"),
      validateRequired(lastName, "lastName", "Last name"),
      validateEmail(email),
    ];
    const found = checks.find(Boolean);
    if (found) return found.message;
    if (password.length < 8)
      return "Password must be at least 8 characters long.";
    return null;
  }

  async function handleRegister(e: Event) {
    e.preventDefault();
    error = "";

    const problem = validate();
    if (problem) {
      error = problem;
      return;
    }

    submitting = true;
    try {
      const res = await adminAuthApi.register({
        businessName,
        firstName,
        lastName,
        email,
        password,
      });
      adminLogin({
        jwt: res.token,
        refreshToken: res.refreshToken,
        user: res.user,
        companyName: res.company.name,
      });
      createdCompanyId = res.company.id;
      createdCompanyName = res.company.name;
    } catch (err: unknown) {
      error =
        err instanceof Error
          ? err.message
          : "Could not create your workspace. Please try again.";
    } finally {
      submitting = false;
    }
  }

  async function copyWorkspaceId() {
    if (!createdCompanyId || typeof navigator === "undefined") return;
    try {
      await navigator.clipboard.writeText(createdCompanyId);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch {
      // Clipboard unavailable — the ID is shown on screen regardless.
    }
  }
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
          you are ready, create a FavCRM workspace to make it live — bookings,
          members and orders become real, and the merchant admin panel ships
          built in at <code class="bg-bone px-1.5 py-0.5 text-[0.85em]"
            >/admin</code
          >.
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
                ? "Connected to a FavCRM workspace — serving live data."
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

      <!-- create workspace -->
      <div class="flex flex-col gap-4">
        <h2 class="font-display text-2xl text-ink">Create your workspace</h2>

        {#if createdCompanyId}
          <!-- success state -->
          <div
            class="flex flex-col gap-5 rounded-bloom border border-line bg-bone p-7"
          >
            <div class="flex items-center gap-3">
              <span
                class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent text-lg"
                >✦</span
              >
              <div class="font-display text-xl text-ink">
                Workspace created — welcome, {createdCompanyName}.
              </div>
            </div>

            <div class="flex flex-col gap-2">
              <span class="eyebrow !tracking-wide !text-ink-soft"
                >Your workspace ID</span
              >
              <div class="flex flex-wrap items-center gap-3">
                <code
                  class="break-all rounded-petal border border-line bg-paper px-3 py-2 font-sans text-[0.85rem] text-ink"
                  >{createdCompanyId}</code
                >
                <button
                  type="button"
                  onclick={copyWorkspaceId}
                  class="rounded-full border border-line px-4 py-1.5 font-sans text-[0.64rem] uppercase tracking-wide text-ink-soft transition-colors hover:border-accent hover:text-accent"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <p class="font-sans text-[0.86rem] leading-relaxed text-ink-soft">
              To make <em>this</em> storefront serve your new workspace's live data,
              do one of the following:
            </p>
            <ul
              class="flex flex-col gap-2 font-sans text-[0.86rem] leading-relaxed text-ink-soft"
            >
              <li>
                Set the environment variable <code
                  class="bg-paper px-1.5 py-0.5 text-[0.85em]"
                  >VITE_FAVCRM_COMPANY_ID</code
                > to the ID above and redeploy, or
              </li>
              <li>
                Register this deployment's hostname in FavCRM (a <code
                  class="bg-paper px-1.5 py-0.5 text-[0.85em]"
                  >storefront_domains</code
                > entry) — the storefront then resolves the workspace from its own
                hostname automatically, no redeploy needed.
              </li>
            </ul>

            <div class="flex flex-wrap gap-4">
              <Button href="/admin" size="md">Go to admin →</Button>
            </div>
          </div>
        {:else}
          <!-- registration form -->
          <p class="font-sans text-[0.86rem] leading-relaxed text-ink-soft">
            Sign up for FavCRM right here. This creates a fresh workspace and
            signs you straight into the merchant admin panel.
          </p>

          {#if error}
            <div
              class="rounded-petal border border-clay bg-bone p-3 font-sans text-[0.82rem] text-ink"
            >
              {error}
            </div>
          {/if}

          <form
            novalidate
            onsubmit={handleRegister}
            class="flex flex-col gap-5 rounded-bloom border border-line bg-paper p-7"
          >
            <Field
              label="Business name"
              bind:value={businessName}
              placeholder="Lueur Beauty Studio"
              required
            />
            <div class="grid gap-5 sm:grid-cols-2">
              <Field
                label="First name"
                bind:value={firstName}
                placeholder="Jane"
                required
              />
              <Field
                label="Last name"
                bind:value={lastName}
                placeholder="Doe"
                required
              />
            </div>
            <Field
              label="Email"
              type="email"
              bind:value={email}
              placeholder="you@studio.com"
              required
            />
            <Field
              label="Password"
              type="password"
              bind:value={password}
              hint="At least 8 characters."
              required
            />
            <div class="flex flex-wrap gap-4">
              <Button type="submit" size="md" disabled={submitting}>
                {submitting ? "Creating workspace…" : "Create workspace"}
              </Button>
            </div>
          </form>
        {/if}
      </div>

      <!-- already have a workspace -->
      <div class="flex flex-col gap-4">
        <h2 class="font-display text-2xl text-ink">
          Already have a workspace?
        </h2>
        <div class="rounded-bloom border border-line bg-bone p-6">
          <p class="font-sans text-[0.86rem] leading-relaxed text-ink-soft">
            Sign in to the merchant admin panel to manage your salon — services,
            staff, products, bookings and orders.
          </p>
          <p
            class="mt-2 font-sans text-[0.78rem] leading-relaxed text-ink-faint"
          >
            This storefront goes live by setting <code
              class="bg-paper px-1.5 py-0.5 text-[0.85em]"
              >VITE_FAVCRM_COMPANY_ID</code
            > to your workspace ID, or by registering this deployment's hostname in
            FavCRM.
          </p>
          <div class="mt-4 flex flex-wrap gap-4">
            <Button href="/admin" variant="outline" size="md"
              >Merchant login</Button
            >
          </div>
        </div>
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
