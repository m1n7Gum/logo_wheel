<script lang="ts">
  import Icon from './Icon.svelte';
  import { app } from '../lib/state/app.svelte';

  let { disabled = false }: { disabled?: boolean } = $props();

  const wheel = $derived(app.activeWheel);
  const showReset = $derived(!!wheel && (wheel.removeAfterPick || app.removedCount > 0));
</script>

<nav class="toolbar" class:disabled>
  <button class="tool name" onclick={() => app.show({ name: 'list' })} {disabled}>
    <Icon name="list" />
    <span>{wheel?.name ?? 'Räder'}</span>
  </button>

  {#if wheel}
    <button class="tool" onclick={() => app.show({ name: 'edit', wheelId: wheel.id })} {disabled}>
      <Icon name="edit" />
      <span>Bearbeiten</span>
    </button>
  {/if}

  {#if showReset && wheel}
    <button class="tool reset" class:active={app.removedCount > 0} onclick={() => app.resetRun()} disabled={disabled || app.removedCount === 0}>
      <Icon name="reset" />
      <span>{app.remaining.length}/{wheel.entries.length}</span>
    </button>
  {/if}

  <div class="spacer"></div>

  <button
    class="tool"
    class:muted={app.settings.muted}
    onclick={() => app.updateSettings({ muted: !app.settings.muted })}
    aria-pressed={app.settings.muted}
  >
    <Icon name={app.settings.muted ? 'mute' : 'sound'} />
    <span>{app.settings.muted ? 'Ton aus' : 'Ton an'}</span>
  </button>

  <button class="tool" onclick={() => (app.settingsOpen = true)} {disabled}>
    <Icon name="settings" />
    <span>Optionen</span>
  </button>
</nav>

<style>
  .toolbar {
    display: flex;
    gap: 6px;
    padding: 8px;
    background: var(--surface);
    border-color: var(--border);
    border-style: solid;
    border-width: 0;
  }
  .spacer {
    flex: 1;
  }
  .tool {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    min-width: 64px;
    min-height: 56px;
    padding: 6px 8px;
    border: 0;
    border-radius: var(--radius);
    background: transparent;
    color: var(--text);
    font: 600 12px/1.15 var(--font-family);
    cursor: pointer;
  }
  .tool:active:not(:disabled) {
    background: var(--border);
  }
  .tool:disabled {
    opacity: 0.4;
  }
  .tool span {
    max-width: 88px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .name span {
    font-weight: 800;
  }
  .reset.active {
    background: var(--accent);
    color: var(--accent-text);
  }
  .muted {
    color: var(--text-muted);
  }

  @media (orientation: landscape) {
    .toolbar {
      flex-direction: column;
      border-left-width: 1px;
      padding-top: max(8px, env(safe-area-inset-top));
      padding-bottom: max(8px, env(safe-area-inset-bottom));
      padding-right: max(8px, env(safe-area-inset-right));
      overflow-y: auto;
    }
  }
  @media (orientation: portrait) {
    .toolbar {
      flex-direction: row;
      border-bottom-width: 1px;
      padding-top: max(8px, env(safe-area-inset-top));
      overflow-x: auto;
    }
  }
</style>
