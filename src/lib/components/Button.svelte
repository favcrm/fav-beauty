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
    sm: "px-6 py-2.5 text-[0.66rem]",
    md: "px-8 py-3.5 text-[0.72rem]",
    lg: "px-10 py-4 text-[0.78rem]",
  };
  const variants = {
    solid:
      "bg-ink text-paper hover:bg-accent-deep shadow-soft hover:shadow-glow",
    outline: "border border-ink/70 text-ink hover:bg-ink hover:text-paper",
    ghost: "text-ink hover:text-accent",
  };
  const cls = $derived(
    [
      "inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium uppercase tracking-wide",
      "transition-all duration-300 ease-editorial hover:-translate-y-0.5",
      "disabled:opacity-40 disabled:pointer-events-none disabled:translate-y-0",
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
