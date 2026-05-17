<script lang="ts">
  import { getBrand } from "$lib/data/provider";
  import { toasts } from "$lib/stores/toast";
  import Button from "$lib/components/Button.svelte";
  import Field from "$lib/components/Field.svelte";
  import Img from "$lib/components/Img.svelte";

  const brand = getBrand();
  let name = $state("");
  let email = $state("");
  let message = $state("");
  let sent = $state(false);

  function submit(event: SubmitEvent) {
    event.preventDefault();
    if (!name || !email.includes("@") || !message) {
      toasts.error("Please complete every field.");
      return;
    }
    sent = true;
    toasts.success("Message sent — we'll reply within a day.");
    name = email = message = "";
  }
</script>

<svelte:head><title>Contact — Lueur</title></svelte:head>

<section class="shell grid gap-12 py-14 lg:grid-cols-[1fr_1fr]">
  <div class="reveal flex flex-col gap-6">
    <span class="eyebrow">Contact</span>
    <h1 class="font-display text-display-lg text-ink">Say hello.</h1>
    <p class="max-w-sm font-sans leading-relaxed text-ink-soft">
      For bookings, please use the online booker — it shows live availability.
      For everything else, this reaches the atelier directly.
    </p>

    <dl class="mt-2 flex flex-col gap-5 border-t border-line pt-6">
      <div>
        <dt class="eyebrow !text-ink-soft">Studio</dt>
        <dd class="mt-1.5 font-sans text-sm text-ink">
          {brand.address}<br />{brand.city}
        </dd>
      </div>
      <div>
        <dt class="eyebrow !text-ink-soft">Direct</dt>
        <dd class="mt-1.5 font-sans text-sm text-ink">
          <a class="link-underline" href={`tel:${brand.phone}`}>{brand.phone}</a
          ><br />
          <a class="link-underline" href={`mailto:${brand.email}`}
            >{brand.email}</a
          >
        </dd>
      </div>
      <div>
        <dt class="eyebrow !text-ink-soft">Hours</dt>
        <dd class="mt-1.5 font-sans text-sm text-ink">
          {#each brand.hours as h (h.day)}
            {h.day} — {h.range}<br />
          {/each}
        </dd>
      </div>
    </dl>

    <div class="mt-2">
      <Img hue={150} label="The Atelier" ratio="16 / 9" />
    </div>
  </div>

  <form
    class="flex h-fit flex-col gap-6 border border-line bg-bone p-8 lg:sticky lg:top-28"
    onsubmit={submit}
  >
    <h2 class="font-display text-2xl text-ink">Send a message</h2>
    <Field label="Your name" bind:value={name} required />
    <Field label="Email" bind:value={email} type="email" required />
    <Field label="Message" bind:value={message} multiline required />
    <Button type="submit" size="lg" full>Send message</Button>
    {#if sent}
      <p class="font-sans text-[0.76rem] text-ink-soft">
        Thank you — your message is with the atelier.
      </p>
    {/if}
  </form>
</section>
