<script lang="ts">
  import { page } from "$app/stores";
  import { cartCount } from "$lib/stores/cart";
  import { auth } from "$lib/stores/auth";
  import { getBrand } from "$lib/data/provider";
  import Button from "./Button.svelte";

  const brand = getBrand();

  const links = [
    { href: "/treatments", label: "Treatments" },
    { href: "/shop", label: "Atelier Shop" },
    { href: "/membership", label: "Membership" },
    { href: "/journal", label: "Journal" },
    { href: "/about", label: "The House" },
  ];

  let mobileOpen = $state(false);
  const path = $derived($page.url.pathname);

  function isActive(href: string): boolean {
    return path === href || path.startsWith(href + "/");
  }
</script>

<header
  class="sticky top-0 z-40 border-b border-line bg-paper/92 backdrop-blur-sm"
>
  <div class="shell flex items-center justify-between gap-6 py-4">
    <a href="/" class="group flex items-baseline gap-2">
      <span class="font-display text-3xl leading-none tracking-tight text-ink"
        >{brand.name}</span
      >
      <span
        class="hidden font-sans text-[0.6rem] uppercase tracking-eyebrow text-ink-faint sm:inline"
      >
        {brand.tagline}
      </span>
    </a>

    <nav class="hidden items-center gap-8 lg:flex">
      {#each links as link (link.href)}
        <a
          href={link.href}
          class="link-underline font-sans text-[0.74rem] uppercase tracking-wide transition-colors
                 {isActive(link.href)
            ? 'text-accent'
            : 'text-ink-soft hover:text-ink'}"
        >
          {link.label}
        </a>
      {/each}
    </nav>

    <div class="flex items-center gap-3 sm:gap-5">
      <a
        href="/account"
        class="hidden font-sans text-[0.74rem] uppercase tracking-wide text-ink-soft transition-colors hover:text-accent sm:inline"
      >
        {$auth.account ? $auth.account.name.split(" ")[0] : "Sign in"}
      </a>
      <a
        href="/cart"
        class="relative font-sans text-[0.74rem] uppercase tracking-wide text-ink-soft transition-colors hover:text-accent"
      >
        Cart
        {#if $cartCount > 0}
          <span
            class="absolute -right-3.5 -top-2 grid h-4 w-4 place-items-center rounded-full bg-accent text-[0.55rem] text-paper"
          >
            {$cartCount}
          </span>
        {/if}
      </a>
      <div class="hidden sm:block">
        <Button href="/treatments" size="sm">Book a visit</Button>
      </div>
      <button
        class="flex h-8 w-8 flex-col items-center justify-center gap-1.5 lg:hidden"
        onclick={() => (mobileOpen = !mobileOpen)}
        aria-label="Menu"
        aria-expanded={mobileOpen}
      >
        <span
          class="h-px w-5 bg-ink transition-transform duration-300"
          class:translate-y-[3.5px]={mobileOpen}
          class:rotate-45={mobileOpen}
        ></span>
        <span
          class="h-px w-5 bg-ink transition-transform duration-300"
          class:-translate-y-[3.5px]={mobileOpen}
          class:-rotate-45={mobileOpen}
        ></span>
      </button>
    </div>
  </div>

  {#if mobileOpen}
    <div class="border-t border-line bg-paper lg:hidden">
      <nav class="shell flex flex-col py-4">
        {#each links as link (link.href)}
          <a
            href={link.href}
            class="border-b border-line/60 py-3 font-display text-2xl text-ink"
            onclick={() => (mobileOpen = false)}
          >
            {link.label}
          </a>
        {/each}
        <a
          href="/account"
          class="border-b border-line/60 py-3 font-display text-2xl text-ink"
          onclick={() => (mobileOpen = false)}
        >
          {$auth.account ? "My account" : "Sign in"}
        </a>
        <div class="pt-5">
          <Button href="/treatments" full onclick={() => (mobileOpen = false)}
            >Book a visit</Button
          >
        </div>
      </nav>
    </div>
  {/if}
</header>
