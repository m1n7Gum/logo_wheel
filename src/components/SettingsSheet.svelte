<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import Icon from './Icon.svelte';
  import InstallHint from './InstallHint.svelte';
  import { app } from '../lib/state/app.svelte';
  import { themes } from '../themes/registry';
  import type { Theme } from '../themes/types';
  import { ARASAAC_CREDIT } from '../lib/pictures/arasaac';

  let message = $state('');

  let fileInput: HTMLInputElement | undefined = $state();

  function swatch(theme: Theme): string {
    const colors = theme.segmentColors;
    const step = 360 / colors.length;
    const stops = colors.map((c, i) => `${c} ${i * step}deg ${(i + 1) * step}deg`).join(', ');
    return `conic-gradient(${stops})`;
  }

  async function exportWheels() {
    const date = new Date().toISOString().slice(0, 10);
    const file = new File([app.exportBackup()], `gluecksrad-backup-${date}.json`, { type: 'application/json' });
    // iPad: the share sheet offers "In Dateien sichern". Elsewhere: regular download.
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }
    const url = URL.createObjectURL(file);
    const a = Object.assign(document.createElement('a'), { href: url, download: file.name });
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function importWheels(event: Event & { currentTarget: HTMLInputElement }) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = '';
    if (!file) return;
    try {
      const count = app.importBackup(await file.text());
      message = `${count} ${count === 1 ? 'Rad' : 'Räder'} importiert.`;
    } catch (err) {
      message = `Import fehlgeschlagen: ${(err as Error).message}`;
    }
  }
</script>

<div class="backdrop" role="presentation" onclick={() => (app.settingsOpen = false)} transition:fade={{ duration: 150 }}></div>
<div class="sheet" role="dialog" aria-label="Optionen" transition:fly={{ x: 400, duration: 220 }}>
  <header>
    <h1>Optionen</h1>
    <button class="ghost icon" onclick={() => (app.settingsOpen = false)} aria-label="Schließen"><Icon name="close" /></button>
  </header>

  <section>
    <h2>Aussehen</h2>
    <div class="themes">
      {#each themes as theme (theme.id)}
        <button
          class="theme"
          class:selected={theme.id === app.theme.id}
          onclick={() => app.updateSettings({ themeId: theme.id })}
        >
          <span class="swatch" style:background={swatch(theme)}></span>
          {theme.name}
        </button>
      {/each}
    </div>
  </section>

  <section>
    <h2>Ton</h2>
    <label class="row">
      <input
        type="checkbox"
        checked={!app.settings.muted}
        onchange={(e) => app.updateSettings({ muted: !e.currentTarget.checked })}
      />
      Rattern beim Drehen
    </label>
    <p class="note">Auf dem iPad ist der Ton auch aus, wenn das Gerät auf lautlos steht.</p>
  </section>

  <section>
    <h2>Sicherung</h2>
    <p class="note">Räder werden automatisch auf diesem Tablet gespeichert. Mit einer Backup-Datei kannst du sie zusätzlich sichern oder auf ein anderes Gerät übertragen.</p>
    <div class="row">
      <button class="ghost" onclick={exportWheels}><Icon name="download" />Backup speichern</button>
      <button class="ghost" onclick={() => fileInput?.click()}><Icon name="upload" />Backup laden</button>
      <input bind:this={fileInput} type="file" accept="application/json,.json" hidden onchange={importWheels} />
    </div>
    {#if message}<p class="note">{message}</p>{/if}
  </section>

  <section>
    <h2>Bilder</h2>
    <p class="note">Alle Bilder sind in der App enthalten und funktionieren ohne Internet.</p>
    <p class="note credit">{ARASAAC_CREDIT}</p>
  </section>

  <InstallHint />
</div>

<style>
  .credit {
    font-size: 12px;
  }
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 40;
    background: var(--backdrop);
  }
  .sheet {
    position: fixed;
    z-index: 41;
    top: 0;
    right: 0;
    bottom: 0;
    width: min(440px, 100vw);
    overflow-y: auto;
    display: grid;
    align-content: start;
    gap: 20px;
    padding: max(16px, env(safe-area-inset-top)) max(20px, env(safe-area-inset-right))
      max(20px, env(safe-area-inset-bottom)) 20px;
    background: var(--bg);
    color: var(--text);
    box-shadow: -10px 0 40px rgba(0, 0, 0, 0.2);
  }
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  h1 {
    margin: 0;
    font-size: 24px;
  }
  h2 {
    margin: 0 0 10px;
    font-size: 17px;
  }
  .themes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .theme {
    display: grid;
    justify-items: center;
    gap: 8px;
    padding: 14px;
    border: 2px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
    color: var(--text);
    font: 700 16px var(--font-family);
    cursor: pointer;
  }
  .theme.selected {
    border-color: var(--accent);
    box-shadow: 0 0 0 2px var(--accent);
  }
  .swatch {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 3px solid var(--border);
  }
  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    font-size: 17px;
  }
  .row input[type='checkbox'] {
    width: 26px;
    height: 26px;
    accent-color: var(--accent);
  }
  .note {
    margin: 8px 0 0;
    color: var(--text-muted);
    font-size: 14px;
    line-height: 1.4;
  }
</style>
