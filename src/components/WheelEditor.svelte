<script lang="ts">
  import Icon from './Icon.svelte';
  import PageHeader from './PageHeader.svelte';
  import InstallHint from './InstallHint.svelte';
  import { app } from '../lib/state/app.svelte';
  import { createEntry, newId, type Entry } from '../lib/model/wheel';

  let { wheelId }: { wheelId: string } = $props();

  const wheel = $derived(app.wheels.find((w) => w.id === wheelId));

  let newLabel = $state('');
  let bulkMode = $state(false);
  let bulkText = $state('');
  let confirmDelete = $state(false);
  let newInput: HTMLInputElement | undefined = $state();

  function setEntries(entries: Entry[]) {
    app.updateWheel(wheelId, { entries });
  }

  function addEntry() {
    const label = newLabel.trim();
    if (!wheel || !label) return;
    setEntries([...wheel.entries, createEntry(label)]);
    newLabel = '';
    newInput?.focus();
  }

  function renameEntry(index: number, label: string) {
    if (!wheel) return;
    setEntries(wheel.entries.map((e, i) => (i === index ? { ...e, label } : e)));
  }

  function removeEntry(index: number) {
    if (!wheel) return;
    setEntries(wheel.entries.filter((_, i) => i !== index));
  }

  function toggleBulk() {
    if (!wheel) return;
    if (!bulkMode) bulkText = wheel.entries.map((e) => e.label).join('\n');
    bulkMode = !bulkMode;
  }

  /** One entry per line; existing ids are kept by position. */
  function applyBulk(text: string) {
    if (!wheel) return;
    const labels = text.split('\n').map((l) => l.trim()).filter(Boolean);
    setEntries(labels.map((label, i) => ({ id: wheel.entries[i]?.id ?? newId(), label })));
  }

  function done() {
    // Drop entries that were emptied while editing.
    if (wheel) setEntries(wheel.entries.filter((e) => e.label.trim() !== ''));
    app.selectWheel(wheelId);
  }

  function remove() {
    app.deleteWheel(wheelId);
    app.show({ name: 'list' });
  }
</script>

{#if wheel}
  <div class="page">
    <PageHeader title="Rad bearbeiten" backLabel="Fertig" onback={done} />

    <div class="content">
      <InstallHint />
      <p class="saved"><Icon name="check" size={18} /> Änderungen werden automatisch gespeichert.</p>

      <label class="field">
        <span>Name</span>
        <input
          type="text"
          value={wheel.name}
          oninput={(e) => app.updateWheel(wheelId, { name: e.currentTarget.value })}
          placeholder="z.B. Laute – Frau Müller"
        />
      </label>

      <label class="switch">
        <input
          type="checkbox"
          checked={wheel.removeAfterPick}
          onchange={(e) => app.updateWheel(wheelId, { removeAfterPick: e.currentTarget.checked })}
        />
        <span>
          <strong>Gezogene Felder verschwinden</strong>
          <small>Nur für die aktuelle Runde – das gespeicherte Rad bleibt vollständig.</small>
        </span>
      </label>

      <section>
        <div class="section-head">
          <h2>Felder ({wheel.entries.length})</h2>
          <button class="ghost" onclick={toggleBulk}>{bulkMode ? 'Einzeln bearbeiten' : 'Als Liste bearbeiten'}</button>
        </div>

        {#if bulkMode}
          <textarea
            rows="12"
            bind:value={bulkText}
            oninput={() => applyBulk(bulkText)}
            placeholder={'Ein Feld pro Zeile, z.B.\nSch\nK\nKuh 🐄'}
          ></textarea>
        {:else}
          <ol>
            {#each wheel.entries as entry, i (entry.id)}
              <li>
                <input type="text" value={entry.label} oninput={(e) => renameEntry(i, e.currentTarget.value)} />
                <button class="ghost icon" onclick={() => removeEntry(i)} aria-label="Feld löschen">
                  <Icon name="trash" />
                </button>
              </li>
            {/each}
          </ol>
          <form class="add" onsubmit={(e) => (e.preventDefault(), addEntry())}>
            <input type="text" bind:value={newLabel} bind:this={newInput} placeholder="Neues Feld, z.B. Sch" enterkeyhint="done" />
            <button class="primary" type="submit" disabled={!newLabel.trim()}><Icon name="plus" />Hinzufügen</button>
          </form>
        {/if}
      </section>

      <section class="danger">
        {#if confirmDelete}
          <span>Rad „{wheel.name}“ wirklich löschen?</span>
          <button class="ghost" onclick={() => (confirmDelete = false)}>Abbrechen</button>
          <button class="destructive" onclick={remove}><Icon name="trash" />Endgültig löschen</button>
        {:else}
          <button class="ghost" onclick={() => app.duplicate(wheelId)}><Icon name="copy" />Duplizieren</button>
          <button class="ghost destructive-text" onclick={() => (confirmDelete = true)}><Icon name="trash" />Rad löschen</button>
        {/if}
      </section>
    </div>
  </div>
{/if}

<style>
  .saved {
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
    color: var(--text-muted);
    font-size: 14px;
  }
  .field {
    display: grid;
    gap: 6px;
    font-weight: 700;
  }
  .switch {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    cursor: pointer;
  }
  .switch input {
    width: 28px;
    height: 28px;
    accent-color: var(--accent);
    flex: none;
  }
  .switch span {
    display: grid;
    gap: 2px;
  }
  .switch small {
    color: var(--text-muted);
    font-size: 14px;
  }
  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  h2 {
    margin: 0;
    font-size: 18px;
  }
  ol {
    list-style: none;
    margin: 0 0 12px;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 8px;
  }
  li {
    display: flex;
    gap: 4px;
  }
  li input {
    flex: 1;
    min-width: 0;
  }
  .add {
    display: flex;
    gap: 8px;
  }
  .add input {
    flex: 1;
    min-width: 0;
  }
  textarea {
    width: 100%;
    resize: vertical;
  }
  .danger {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
  }
</style>
