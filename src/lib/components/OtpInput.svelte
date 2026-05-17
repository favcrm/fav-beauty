<script lang="ts">
  interface Props {
    value: string;
    length?: number;
  }

  let { value = $bindable(""), length = 6 }: Props = $props();

  let inputs: HTMLInputElement[] = $state([]);
  const digits = $derived(Array.from({ length }, (_, i) => value[i] ?? ""));

  function setDigit(index: number, char: string) {
    const next = digits.slice();
    next[index] = char;
    value = next.join("");
  }

  function onInput(index: number, event: Event) {
    const target = event.target as HTMLInputElement;
    const char = target.value.replace(/\D/g, "").slice(-1);
    setDigit(index, char);
    target.value = char;
    if (char && index < length - 1) inputs[index + 1]?.focus();
  }

  function onKeydown(index: number, event: KeyboardEvent) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputs[index - 1]?.focus();
    }
  }

  function onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = (event.clipboardData?.getData("text") ?? "")
      .replace(/\D/g, "")
      .slice(0, length);
    value = pasted;
    pasted.split("").forEach((c, i) => {
      if (inputs[i]) inputs[i].value = c;
    });
    inputs[Math.min(pasted.length, length - 1)]?.focus();
  }
</script>

<div class="flex gap-2.5" role="group" aria-label="One-time code">
  {#each digits as digit, i (i)}
    <input
      bind:this={inputs[i]}
      inputmode="numeric"
      maxlength="1"
      value={digit}
      oninput={(e) => onInput(i, e)}
      onkeydown={(e) => onKeydown(i, e)}
      onpaste={onPaste}
      class="h-14 w-12 border border-line bg-paper text-center font-display text-2xl text-ink
             focus:border-accent focus:ring-0 transition-colors"
      aria-label={`Digit ${i + 1}`}
    />
  {/each}
</div>
