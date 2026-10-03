<script lang="ts">
  import { fade, scale } from 'svelte/transition';

  let {
    label,
    willDisappear,
    onclose,
  }: { label: string; willDisappear: boolean; onclose: () => void } = $props();

  // Shrink long labels so they still fit on one or two lines.
  const fontSize = $derived(`min(${Math.round(150 / Math.max(2, [...label].length))}cqw, 26cqh)`);
  const hint = $derived(willDisappear ? 'Tippen – Feld verschwindet vom Rad' : 'Tippen zum Weitermachen');
</script>

<button class="backdrop" onclick={onclose} transition:fade={{ duration: 150 }} aria-label="Ergebnis schließen">
  <div class="card" transition:scale={{ duration: 250, start: 0.7 }}>
    <!-- Upside-down copy for the person sitting opposite. -->
    <div class="half flipped">
      <span class="label" style:font-size={fontSize}>{label}</span>
    </div>
    <div class="divider"></div>
    <div class="half">
      <span class="label" style:font-size={fontSize}>{label}</span>
      <span class="hint">{hint}</span>
    </div>
  </div>
</button>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: grid;
    place-items: center;
    padding: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom));
    background: var(--backdrop);
    border: 0;
    cursor: pointer;
  }
  .card {
    container-type: size;
    width: min(92vw, 820px);
    height: min(88dvh, 820px);
    display: grid;
    grid-template-rows: 1fr auto 1fr;
    background: var(--result-bg);
    color: var(--result-text);
    border-radius: calc(var(--radius) * 1.6);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
    overflow: hidden;
  }
  .half {
    position: relative;
    display: grid;
    place-items: center;
    padding: 2cqh 4cqw;
    min-height: 0;
  }
  .flipped {
    transform: rotate(180deg);
  }
  .label {
    font-family: var(--font-family);
    font-weight: 800;
    line-height: 1.05;
    text-align: center;
    overflow-wrap: anywhere;
  }
  .divider {
    height: 2px;
    margin: 0 8cqw;
    background: var(--border);
  }
  .hint {
    position: absolute;
    bottom: 2.5cqh;
    font-size: clamp(13px, 2.2cqh, 18px);
    color: var(--text-muted);
    font-family: var(--font-family);
  }
</style>
