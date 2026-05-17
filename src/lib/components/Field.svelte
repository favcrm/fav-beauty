<script lang="ts">
  interface Props {
    label: string;
    value: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    multiline?: boolean;
    hint?: string;
  }

  let {
    label,
    value = $bindable(""),
    type = "text",
    placeholder = "",
    required = false,
    multiline = false,
    hint = "",
  }: Props = $props();

  const id = `f-${Math.random().toString(36).slice(2, 8)}`;
  const inputCls =
    "w-full border-0 border-b border-line bg-transparent px-0 py-2.5 font-sans text-[0.95rem] " +
    "text-ink placeholder:text-ink-faint focus:border-accent focus:ring-0 transition-colors";
</script>

<div class="flex flex-col gap-1.5">
  <label for={id} class="eyebrow !tracking-wide !text-ink-soft">{label}</label>
  {#if multiline}
    <textarea
      {id}
      bind:value
      {placeholder}
      {required}
      rows="3"
      class="{inputCls} resize-none"
    ></textarea>
  {:else}
    <input {id} {type} bind:value {placeholder} {required} class={inputCls} />
  {/if}
  {#if hint}
    <span class="font-sans text-[0.72rem] text-ink-faint">{hint}</span>
  {/if}
</div>
