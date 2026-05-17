<script lang="ts">
  import { getBrand } from "$lib/data/provider";
  import { toasts } from "$lib/stores/toast";

  const brand = getBrand();
  const year = new Date().getFullYear();

  let email = $state("");

  function subscribe(event: SubmitEvent) {
    event.preventDefault();
    if (!email.includes("@")) {
      toasts.error("Please enter a valid email.");
      return;
    }
    toasts.success("You're on the list — see you soon.");
    email = "";
  }
</script>

<footer class="border-t border-line bg-bone">
  <div class="shell grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
    <div>
      <div class="font-display text-4xl text-ink">{brand.name}</div>
      <p class="mt-3 max-w-xs font-sans text-sm leading-relaxed text-ink-soft">
        {brand.tagline} — considered treatments, honest skin advice and a calm room
        in the middle of the city.
      </p>
    </div>

    <div>
      <div class="eyebrow">Visit</div>
      <p class="mt-4 font-sans text-sm leading-relaxed text-ink-soft">
        {brand.address}<br />{brand.city}
      </p>
      <p class="mt-3 font-sans text-sm text-ink-soft">
        <a class="link-underline" href={`tel:${brand.phone}`}>{brand.phone}</a
        ><br />
        <a class="link-underline" href={`mailto:${brand.email}`}
          >{brand.email}</a
        >
      </p>
    </div>

    <div>
      <div class="eyebrow">Explore</div>
      <ul class="mt-4 flex flex-col gap-2 font-sans text-sm text-ink-soft">
        <li><a class="link-underline" href="/treatments">Treatments</a></li>
        <li><a class="link-underline" href="/shop">Atelier Shop</a></li>
        <li><a class="link-underline" href="/membership">Membership</a></li>
        <li><a class="link-underline" href="/journal">Journal</a></li>
        <li><a class="link-underline" href="/contact">Contact</a></li>
      </ul>
    </div>

    <div>
      <div class="eyebrow">The morning letter</div>
      <p class="mt-4 font-sans text-sm text-ink-soft">
        Seasonal rituals and member previews, once a month.
      </p>
      <form
        class="mt-4 flex items-center border-b border-ink"
        onsubmit={subscribe}
      >
        <input
          type="email"
          bind:value={email}
          placeholder="Your email"
          class="w-full border-0 bg-transparent px-0 py-2 font-sans text-sm text-ink placeholder:text-ink-faint focus:ring-0"
        />
        <button
          type="submit"
          class="font-sans text-[0.7rem] uppercase tracking-wide text-accent"
        >
          Join
        </button>
      </form>
      <div class="mt-5 flex gap-4">
        {#each brand.social as s (s.label)}
          <a
            href={s.href}
            class="font-sans text-[0.7rem] uppercase tracking-wide text-ink-soft transition-colors hover:text-accent"
          >
            {s.label}
          </a>
        {/each}
      </div>
    </div>
  </div>

  <div class="border-t border-line">
    <div
      class="shell flex flex-col gap-2 py-5 font-sans text-[0.68rem] uppercase tracking-wide text-ink-faint sm:flex-row sm:justify-between"
    >
      <span>© {year} {brand.legalName}. All rights reserved.</span>
      <span class="flex gap-5">
        <a class="hover:text-accent" href="/privacy">Privacy</a>
        <a class="hover:text-accent" href="/terms">Terms</a>
        <span>Powered by FavCRM</span>
      </span>
    </div>
  </div>
</footer>
