<script lang="ts">
  import Wheel from './Wheel.svelte';
  import SpinButton from './SpinButton.svelte';
  import ResultOverlay from './ResultOverlay.svelte';
  import Toolbar from './Toolbar.svelte';
  import { app } from '../lib/state/app.svelte';
  import { easeOutQuart, indexAtPointer, planSpin, segmentAngle } from '../lib/spin/spinEngine';
  import { Ticker } from '../lib/audio/ticker';
  import type { Entry } from '../lib/model/wheel';

  const ticker = new Ticker();
  $effect(() => {
    ticker.muted = app.settings.muted;
  });

  let rotation = $state(0);
  let spinning = $state(false);
  let highlightIndex = $state<number | null>(null);
  let result = $state<Entry | null>(null);

  const theme = $derived(app.theme);
  const entries = $derived(app.remaining);
  const stageHeight = $derived(100 + theme.pointerSpace);

  function spin() {
    const count = entries.length;
    if (spinning || count === 0) return;
    ticker.unlock();
    highlightIndex = null;
    spinning = true;

    const startRotation = rotation;
    const plan = planSpin(startRotation, count);
    const seg = segmentAngle(count);
    let lastBoundary = Math.floor(startRotation / seg);
    const startTime = performance.now();

    const frame = (now: number) => {
      const t = Math.min(1, (now - startTime) / plan.durationMs);
      rotation = startRotation + (plan.endRotation - startRotation) * easeOutQuart(t);
      const boundary = Math.floor(rotation / seg);
      if (boundary !== lastBoundary) {
        lastBoundary = boundary;
        ticker.tick(theme.tick);
      }
      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        finish(indexAtPointer(rotation, count));
      }
    };
    requestAnimationFrame(frame);
  }

  function finish(index: number) {
    // Keep rotation small so numbers never grow unbounded.
    rotation %= 360;
    highlightIndex = index;
    const picked = entries[index];
    setTimeout(() => {
      spinning = false;
      result = picked;
      ticker.chime(theme.tick);
    }, 450);
  }

  function closeResult() {
    if (result) app.pickedEntry(result.id);
    result = null;
    highlightIndex = null;
  }
</script>

<div class="screen">
  <main class="area">
    {#if theme.Decorations}
      <div class="decorations"><theme.Decorations /></div>
    {/if}

    {#if !app.activeWheel || app.activeWheel.entries.length === 0}
      <div class="empty">
        <p>{app.activeWheel ? 'Dieses Rad hat noch keine Felder.' : 'Noch kein Rad vorhanden.'}</p>
        <button
          class="primary"
          onclick={() =>
            app.activeWheel
              ? app.show({ name: 'edit', wheelId: app.activeWheel.id })
              : app.show({ name: 'edit', wheelId: app.addWheel().id })}
        >
          {app.activeWheel ? 'Felder hinzufügen' : 'Neues Rad anlegen'}
        </button>
      </div>
    {:else}
      <div class="stage" style:--stage-ratio={100 / stageHeight}>
        <div class="wheel-slot" style:top="{(theme.pointerSpace / stageHeight) * 100}%">
          {#if entries.length > 0}
            <Wheel {entries} {rotation} {highlightIndex} {theme} />
          {:else}
            <div class="done">
              <p>Alle geschafft! 🎉</p>
              <button class="primary" onclick={() => app.resetRun()}>Neu starten</button>
            </div>
          {/if}
          {#if entries.length > 0}
            <div class="center">
              <SpinButton disabled={spinning} onspin={spin} />
            </div>
          {/if}
        </div>
        <svg class="pointer" viewBox="0 0 100 {stageHeight}" aria-hidden="true">
          <theme.Pointer />
        </svg>
      </div>
    {/if}
  </main>

  <Toolbar disabled={spinning} />
</div>

{#if result}
  <ResultOverlay
    label={result.label}
    willDisappear={!!app.activeWheel?.removeAfterPick}
    onclose={closeResult}
  />
{/if}

<style>
  .screen {
    height: 100dvh;
    display: grid;
  }
  @media (orientation: landscape) {
    .screen {
      grid-template-columns: 1fr auto;
    }
  }
  @media (orientation: portrait) {
    .screen {
      grid-template-rows: auto 1fr;
    }
    .screen > :global(nav) {
      order: -1;
    }
  }
  .area {
    position: relative;
    container-type: size;
    display: grid;
    place-items: center;
    min-width: 0;
    min-height: 0;
    overflow: hidden;
    padding: max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-left))
      max(12px, env(safe-area-inset-bottom)) 12px;
  }
  .decorations {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .stage {
    position: relative;
    /* As large as possible while keeping the stage's aspect ratio. */
    width: min(100cqw - 24px, (100cqh - 24px) * var(--stage-ratio));
    aspect-ratio: var(--stage-ratio);
    user-select: none;
    -webkit-user-select: none;
  }
  .wheel-slot {
    position: absolute;
    left: 0;
    width: 100%;
    aspect-ratio: 1;
    container-type: size;
  }
  .center {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 24%;
    height: 24%;
    transform: translate(-50%, -50%);
  }
  .pointer {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: visible;
    pointer-events: none;
  }
  .empty,
  .done {
    display: grid;
    place-items: center;
    align-content: center;
    gap: 16px;
    height: 100%;
    text-align: center;
    font-size: 22px;
    color: var(--text);
  }
  .done {
    border-radius: 50%;
    background: var(--surface);
    border: 6px solid var(--wheel-rim);
    font-size: clamp(20px, 6cqmin, 48px);
    font-weight: 800;
  }
  .done p,
  .empty p {
    margin: 0;
  }
</style>
