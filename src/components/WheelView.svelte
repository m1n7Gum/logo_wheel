<script lang="ts">
  import Wheel from './Wheel.svelte';
  import SpinButton from './SpinButton.svelte';
  import ResultOverlay from './ResultOverlay.svelte';
  import Toolbar from './Toolbar.svelte';
  import Icon from './Icon.svelte';
  import { app } from '../lib/state/app.svelte';
  import { tick } from 'svelte';
  import { easeOutQuart, planSpin, segmentAngle, spinKeyframes } from '../lib/spin/spinEngine';
  import { Ticker } from '../lib/audio/ticker';
  import type { Entry } from '../lib/model/wheel';

  const ticker = new Ticker();
  $effect(() => {
    ticker.muted = app.settings.muted;
  });

  let wheel: Wheel | undefined = $state();
  let rotation = $state(0);
  let spinning = $state(false);
  let highlightIndex = $state<number | null>(null);
  let result = $state<Entry | null>(null);

  const theme = $derived(app.theme);
  const entries = $derived(app.remaining);
  const stageHeight = $derived(100 + theme.pointerSpace);

  function spin() {
    const count = entries.length;
    if (spinning || count === 0 || !wheel) return;
    ticker.unlock();
    highlightIndex = null;
    spinning = true;

    const start = rotation;
    const plan = planSpin(start, count);
    const animation = wheel.animateRotation(spinKeyframes(start, plan.endRotation), plan.durationMs);

    // The animation itself runs on the compositor; this loop only drives the ratchet sound.
    const seg = segmentAngle(count);
    let lastBoundary = Math.floor(start / seg);
    const startTime = performance.now();
    const listen = (now: number) => {
      const t = Math.min(1, (now - startTime) / plan.durationMs);
      const boundary = Math.floor((start + (plan.endRotation - start) * easeOutQuart(t)) / seg);
      if (boundary !== lastBoundary) {
        lastBoundary = boundary;
        ticker.tick(theme.tick);
      }
      if (t < 1 && spinning) requestAnimationFrame(listen);
    };
    requestAnimationFrame(listen);

    animation.finished.then(async () => {
      // Hand the final angle back to the static style before dropping the animation.
      rotation = plan.endRotation % 360;
      await tick();
      animation.cancel();
      finish(plan.targetIndex);
    });
  }

  function finish(index: number) {
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

<div class="screen" class:full={app.settings.toolbarHidden}>
  <main class="area">
    {#if !app.activeWheel || app.activeWheel.entries.length === 0}
      <div class="empty">
        <p>{app.activeWheel ? 'Dieses Rad hat noch keine Felder.' : 'Noch kein Rad vorhanden.'}</p>
        <button
          class="primary"
          onclick={() =>
            app.activeWheel
              ? app.show({ name: 'edit', wheelId: app.activeWheel.id })
              : app.show({ name: 'edit', wheelId: null })}
        >
          {app.activeWheel ? 'Felder hinzufügen' : 'Neues Rad anlegen'}
        </button>
      </div>
    {:else}
      <div class="stage" style:--stage-ratio={100 / stageHeight}>
        {#if theme.Decorations}
          <div class="scenery" style:--wheel-top="{(theme.pointerSpace / stageHeight) * 100}%">
            <theme.Decorations />
          </div>
        {/if}
        <div class="wheel-slot" style:top="{(theme.pointerSpace / stageHeight) * 100}%">
          {#if entries.length > 0}
            <Wheel bind:this={wheel} {entries} {rotation} {highlightIndex} {theme} />
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

  {#if app.settings.toolbarHidden}
    <button class="menu" onclick={() => app.updateSettings({ toolbarHidden: false })} aria-label="Menü einblenden">
      <Icon name="menu" />
    </button>
  {:else}
    <Toolbar disabled={spinning} />
  {/if}
</div>

{#if result}
  <ResultOverlay
    entry={result}
    willDisappear={!!app.activeWheel?.removeAfterPick}
    onclose={closeResult}
  />
{/if}

<style>
  .screen {
    height: 100dvh;
    display: grid;
    overflow: hidden;
  }
  .screen > :global(nav) {
    position: relative;
    z-index: 3;
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
  /* Side bar collapsed: the wheel area gets the whole screen. */
  .screen.full {
    grid-template: 1fr / 1fr;
  }
  .menu {
    position: absolute;
    z-index: 4;
    top: max(12px, env(safe-area-inset-top));
    right: max(12px, env(safe-area-inset-right));
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    border: 1px solid var(--border);
    border-radius: 50%;
    background: color-mix(in srgb, var(--surface) 85%, transparent);
    color: var(--text-muted);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    cursor: pointer;
  }
  .area {
    position: relative;
    container-type: size;
    display: grid;
    place-items: center;
    min-width: 0;
    min-height: 0;
    padding: max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-left))
      max(12px, env(safe-area-inset-bottom)) 12px;
  }
  /* Theme scenery lives in stage coordinates, behind the wheel. */
  .scenery {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }
  .stage {
    position: relative;
    /* As large as possible while keeping the stage's aspect ratio. */
    width: min(100cqw - 24px, (100cqh - 24px) * var(--stage-ratio));
    aspect-ratio: var(--stage-ratio);
    z-index: 1;
    user-select: none;
    -webkit-user-select: none;
  }
  .wheel-slot {
    position: absolute;
    z-index: 1;
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
    z-index: 2;
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
