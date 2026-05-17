<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    variant?: "solid" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    href?: string;
    type?: "button" | "submit";
    disabled?: boolean;
    full?: boolean;
    onclick?: () => void;
    children: Snippet;
  }

  let {
    variant = "solid",
    size = "md",
    href,
    type = "button",
    disabled = false,
    full = false,
    onclick,
    children,
  }: Props = $props();

  const sizes = {
    sm: "px-5 py-2 text-[0.66rem]",
    md: "px-7 py-3 text-[0.72rem]",
    lg: "px-9 py-4 text-[0.78rem]",
  };
  const variants = {
    solid: "bg-ink text-paper hover:bg-accent-deep",
    outline: "border border-ink text-ink hover:bg-ink hover:text-paper",
    ghost: "text-ink hover:text-accent",
  };
  const cls = $derived(
    [
      "inline-flex items-center justify-center gap-2 font-sans font-medium uppercase tracking-wide",
      "transition-all duration-300 ease-editorial disabled:opacity-40 disabled:pointer-events-none",
      sizes[size],
      variants[variant],
      full ? "w-full" : "",
    ].join(" "),
  );
</script>

{#if href}
  <a {href} class={cls} aria-disabled={disabled}>{@render children()}</a>
{:else}
  <button {type} {disabled} {onclick} class={cls}>{@render children()}</button>
{/if}
