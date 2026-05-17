<script lang="ts">
  import "../app.css";
  import ToastViewport from "$lib/components/ToastViewport.svelte";

  let { children } = $props();
</script>

<div class="grain">
  {@render children()}
</div>
<ToastViewport />
