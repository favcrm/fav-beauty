<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import {
    auth,
    signIn,
    signOut,
    updateAccount,
    isValidOtp,
  } from "$lib/stores/auth";
  import { bookings } from "$lib/stores/bookings";
  import { orders } from "$lib/stores/orders";
  import { listTiers } from "$lib/data/provider";
  import { formatDate } from "$lib/format";
  import { toasts } from "$lib/stores/toast";
  import Button from "$lib/components/Button.svelte";
  import Field from "$lib/components/Field.svelte";
  import OtpInput from "$lib/components/OtpInput.svelte";

  const tiers = listTiers();

  // ── sign-in flow ──
  let stage = $state<"email" | "otp">("email");
  let email = $state("");
  let name = $state("");
  let otp = $state("");

  function sendOtp(event: SubmitEvent) {
    event.preventDefault();
    if (!email.includes("@")) {
      toasts.error("Please enter a valid email.");
      return;
    }
    stage = "otp";
    toasts.info("Demo code sent — enter any 6 digits.");
  }

  function verify(event: SubmitEvent) {
    event.preventDefault();
    if (!isValidOtp(otp)) {
      toasts.error("Enter the 6-digit code.");
      return;
    }
    signIn(email, name);
    toasts.success("Signed in.");
    const next = $page.url.searchParams.get("next");
    if (next) goto(next);
  }

  const account = $derived($auth.account);
  const tier = $derived(tiers.find((t) => t.id === account?.tierId));
  const upcoming = $derived($bookings.filter((b) => b.status === "confirmed"));

  let editPhone = $state("");
  $effect(() => {
    editPhone = account?.phone ?? "";
  });
  function savePhone() {
    updateAccount({ phone: editPhone });
    toasts.success("Details updated.");
  }
</script>

<svelte:head
  ><title>{account ? "My Account" : "Sign in"} — Lueur</title></svelte:head
>

<section class="shell py-14">
  {#if !account}
    <!-- ── sign in ───────────────────────────────────── -->
    <div class="reveal mx-auto flex max-w-md flex-col gap-7">
      <div class="flex flex-col gap-3 text-center">
        <span class="eyebrow">The house</span>
        <h1 class="font-display text-display-md text-ink">
          {stage === "email" ? "Sign in or join" : "Enter your code"}
        </h1>
        <p class="font-sans text-sm leading-relaxed text-ink-soft">
          {stage === "email"
            ? "We use a one-time code — no password to remember."
            : `A six-digit code was sent to ${email}.`}
        </p>
      </div>

      {#if stage === "email"}
        <form class="flex flex-col gap-5" onsubmit={sendOtp}>
          <Field
            label="Name (new members)"
            bind:value={name}
            placeholder="Optional"
          />
          <Field label="Email" bind:value={email} type="email" required />
          <Button type="submit" size="lg" full>Continue</Button>
        </form>
      {:else}
        <form class="flex flex-col items-center gap-6" onsubmit={verify}>
          <OtpInput bind:value={otp} />
          <Button type="submit" size="lg" full>Verify & sign in</Button>
          <button
            type="button"
            class="link-underline font-sans text-[0.7rem] uppercase tracking-wide text-ink-soft"
            onclick={() => (stage = "email")}
          >
            ← Use a different email
          </button>
        </form>
      {/if}

      <p class="text-center font-sans text-[0.72rem] text-ink-faint">
        Demo mode — any 6-digit code works. Live mode uses FavCRM OTP.
      </p>
    </div>
  {:else}
    <!-- ── dashboard ─────────────────────────────────── -->
    <div class="reveal flex flex-col gap-10">
      <div
        class="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-8"
      >
        <div class="flex flex-col gap-2">
          <span class="eyebrow">My account</span>
          <h1 class="font-display text-display-md text-ink">
            Welcome back, {account.name.split(" ")[0]}.
          </h1>
        </div>
        <button
          class="link-underline font-sans text-[0.72rem] uppercase tracking-wide text-ink-soft"
          onclick={() => signOut()}
        >
          Sign out
        </button>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <!-- membership card -->
        <div
          class="flex flex-col gap-3 border border-ink bg-ink p-6 text-paper"
        >
          <span class="eyebrow !text-blush">Membership</span>
          <span class="font-display text-3xl">{tier?.name ?? "Essential"}</span>
          <p class="font-sans text-[0.8rem] text-paper/65">{tier?.blurb}</p>
          <a
            href="/membership"
            class="mt-auto link-underline font-sans text-[0.7rem] uppercase tracking-wide text-blush"
          >
            Manage membership
          </a>
        </div>
        <!-- bookings stat -->
        <a
          href="/account/bookings"
          class="flex flex-col gap-2 border border-line p-6 transition-colors hover:border-ink"
        >
          <span class="eyebrow !text-ink-soft">Upcoming visits</span>
          <span class="font-display text-5xl text-ink">{upcoming.length}</span>
          <span
            class="mt-auto font-sans text-[0.7rem] uppercase tracking-wide text-accent"
            >View bookings →</span
          >
        </a>
        <!-- orders stat -->
        <a
          href="/account/orders"
          class="flex flex-col gap-2 border border-line p-6 transition-colors hover:border-ink"
        >
          <span class="eyebrow !text-ink-soft">Shop orders</span>
          <span class="font-display text-5xl text-ink">{$orders.length}</span>
          <span
            class="mt-auto font-sans text-[0.7rem] uppercase tracking-wide text-accent"
            >View orders →</span
          >
        </a>
      </div>

      <!-- details -->
      <div class="grid gap-6 border-t border-line pt-8 lg:grid-cols-2">
        <div class="flex flex-col gap-4">
          <span class="eyebrow !text-ink-soft">Your details</span>
          <dl class="flex flex-col divide-y divide-line border-y border-line">
            <div class="flex justify-between py-3 font-sans text-sm">
              <dt class="text-ink-soft">Name</dt>
              <dd class="text-ink">{account.name}</dd>
            </div>
            <div class="flex justify-between py-3 font-sans text-sm">
              <dt class="text-ink-soft">Email</dt>
              <dd class="text-ink">{account.email}</dd>
            </div>
            <div class="flex justify-between py-3 font-sans text-sm">
              <dt class="text-ink-soft">Member since</dt>
              <dd class="text-ink">{formatDate(account.joinedAt)}</dd>
            </div>
          </dl>
        </div>
        <div class="flex flex-col gap-4">
          <span class="eyebrow !text-ink-soft">Contact number</span>
          <Field label="Phone" bind:value={editPhone} type="tel" />
          <div><Button size="md" onclick={savePhone}>Save details</Button></div>
        </div>
      </div>
    </div>
  {/if}
</section>
