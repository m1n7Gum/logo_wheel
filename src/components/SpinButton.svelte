<script lang="ts">
  let { disabled, onspin }: { disabled: boolean; onspin: () => void } = $props();
</script>

<button class="spin" {disabled} onclick={onspin} aria-label="Rad drehen">Los!</button>

<style>
  .spin {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: max(4px, 1.2cqmin) solid var(--center-ring);
    background: var(--center-bg);
    color: var(--center-text);
    font: 800 clamp(18px, 4.5cqmin, 56px) / 1 var(--font-family);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
    cursor: pointer;
    transition: transform 0.12s, filter 0.2s;
  }
  .spin:active:not(:disabled) {
    transform: scale(0.94);
  }
  .spin:disabled {
    filter: saturate(0.4) brightness(0.9);
    cursor: default;
  }
</style>
