<script lang="ts">
  import { toasts } from "$lib/stores/toast";
  import { fly } from "svelte/transition";
</script>

<div
  class="pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col gap-2"
>
  {#each $toasts as toast (toast.id)}
    <div
      in:fly={{ y: 16, duration: 320 }}
      out:fly={{ y: 10, duration: 220 }}
      class="pointer-events-auto flex items-center gap-3 border bg-ink px-5 py-3 text-paper shadow-lift"
      class:border-accent={toast.tone === "error"}
      class:border-ink={toast.tone !== "error"}
    >
      <span
        class="h-1.5 w-1.5 rounded-full"
        class:bg-accent={toast.tone === "error"}
        class:bg-blush={toast.tone === "success"}
        class:bg-clay={toast.tone === "default"}
      ></span>
      <span class="font-sans text-[0.8rem] tracking-wide">{toast.message}</span>
    </div>
  {/each}
</div>
