<script lang="ts">
  import Icon from './Icon.svelte';
  import { app } from '../lib/state/app.svelte';

  let { disabled = false }: { disabled?: boolean } = $props();

  const wheel = $derived(app.activeWheel);
  const vanish = $derived(!!wheel?.removeAfterPick);
  const showCounter = $derived(!!wheel && (vanish || app.removedCount > 0));

  function toggleVanish() {
    if (wheel) app.updateWheel(wheel.id, { removeAfterPick: !vanish });
  }
</script>

<nav class="toolbar">
  <div class="group">
    <button class="tile wheel-name" onclick={() => app.show({ name: 'list' })} {disabled}>
      <Icon name="list" />
      <span class="caption">Rad</span>
      <strong>{wheel?.name ?? 'Räder'}</strong>
    </button>
    <button class="tile" onclick={() => app.show({ name: 'edit', wheelId: null })} {disabled}>
      <Icon name="plus" />
      <span>Neues Rad</span>
    </button>
    {#if wheel}
      <button class="tile" onclick={() => app.show({ name: 'edit', wheelId: wheel.id })} {disabled}>
        <Icon name="edit" />
        <span>Bearbeiten</span>
      </button>
    {/if}
  </div>

  {#if wheel}
    <div class="group">
      <button class="tile toggle" class:on={vanish} onclick={toggleVanish} {disabled} aria-pressed={vanish}>
        <span class="switch" aria-hidden="true"><span></span></span>
        <span>Gezogene verschwinden</span>
      </button>
      {#if showCounter}
        <button
          class="tile counter"
          class:active={app.removedCount > 0}
          onclick={() => app.resetRun()}
          disabled={disabled || app.removedCount === 0}
        >
          <Icon name="reset" />
          <span><strong>{app.remaining.length}</strong> / {wheel.entries.length}</span>
          <span class="caption">Zurücksetzen</span>
        </button>
      {/if}
    </div>
  {/if}

  <div class="spacer"></div>

  <div class="group compact">
    <button
      class="tile"
      class:dimmed={app.settings.muted}
      onclick={() => app.updateSettings({ muted: !app.settings.muted })}
      aria-pressed={!app.settings.muted}
      aria-label={app.settings.muted ? 'Ton einschalten' : 'Ton ausschalten'}
    >
      <Icon name={app.settings.muted ? 'mute' : 'sound'} />
      <span>{app.settings.muted ? 'Ton aus' : 'Ton an'}</span>
    </button>
    <button class="tile" onclick={() => (app.settingsOpen = true)} {disabled}>
      <Icon name="settings" />
      <span>Optionen</span>
    </button>
  </div>
</nav>

<style>
  .toolbar {
    display: flex;
    gap: 14px;
    padding: 12px;
  }
  .group {
    display: flex;
    gap: 8px;
  }
  .spacer {
    flex: 1;
  }
  .tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 112px;
    min-height: 72px;
    padding: 10px 8px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.05);
    color: var(--text);
    font: 600 13px/1.2 var(--font-family);
    text-align: center;
    cursor: pointer;
    transition: transform 0.1s, background-color 0.2s, color 0.2s;
  }
  .tile:active:not(:disabled) {
    transform: scale(0.96);
  }
  .tile:disabled {
    opacity: 0.45;
  }
  .caption {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
  }
  .wheel-name strong {
    font-size: 15px;
    font-weight: 800;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    overflow-wrap: anywhere;
  }
  .counter strong {
    font-size: 18px;
  }
  .counter.active {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--accent-text);
  }
  .counter.active .caption {
    color: inherit;
    opacity: 0.85;
  }
  .dimmed {
    color: var(--text-muted);
  }

  /* Pill switch inside the toggle tile. */
  .switch {
    position: relative;
    width: 44px;
    height: 26px;
    border-radius: 13px;
    background: var(--border);
    transition: background-color 0.2s;
  }
  .switch span {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    transition: transform 0.2s;
  }
  .toggle.on .switch {
    background: var(--accent);
  }
  .toggle.on .switch span {
    transform: translateX(18px);
  }

  @media (orientation: landscape) {
    .toolbar,
    .group {
      flex-direction: column;
    }
    .toolbar {
      padding-top: max(12px, env(safe-area-inset-top));
      padding-bottom: max(12px, env(safe-area-inset-bottom));
      padding-right: max(12px, env(safe-area-inset-right));
      overflow-y: auto;
    }
  }
  @media (orientation: portrait) {
    .toolbar {
      padding-top: max(12px, env(safe-area-inset-top));
      overflow-x: auto;
    }
    .tile {
      width: auto;
      min-width: 92px;
      max-width: 140px;
    }
  }
</style>
