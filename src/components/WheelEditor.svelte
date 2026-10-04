<script lang="ts">
  import Icon from './Icon.svelte';
  import PageHeader from './PageHeader.svelte';
  import InstallHint from './InstallHint.svelte';
  import PicturePicker from './PicturePicker.svelte';
  import { app } from '../lib/state/app.svelte';
  import { createEntry, createWheel, newId, type EntryImage, type Wheel } from '../lib/model/wheel';

  /** `null` creates a new wheel. */
  let { wheelId }: { wheelId: string | null } = $props();

  // The editor works on a draft; nothing is stored until "Speichern & schließen".
  const saved = app.wheels.find((w) => w.id === wheelId);
  const isNew = !saved;
  let draft = $state<Wheel>(saved ? structuredClone($state.snapshot(saved)) : createWheel(''));
  const initial = JSON.stringify($state.snapshot(draft));
  const dirty = $derived(JSON.stringify($state.snapshot(draft)) !== initial);

  let newLabel = $state('');
  let bulkMode = $state(false);
  let bulkText = $state('');
  let confirmDiscard = $state(false);
  let confirmDelete = $state(false);
  let newInput: HTMLInputElement | undefined = $state();
  /** Open picture picker: for an existing entry, or `entryId: null` for a new one. */
  let picker = $state<{ entryId: string | null } | null>(null);
  const pickerEntry = $derived(picker?.entryId ? draft.entries.find((e) => e.id === picker?.entryId) : undefined);

  function addEntry() {
    const label = newLabel.trim();
    if (!label) return;
    draft.entries.push(createEntry(label));
    newLabel = '';
    newInput?.focus();
  }

  function pickImage(image: EntryImage, keyword: string) {
    if (pickerEntry) {
      pickerEntry.image = image;
      if (!pickerEntry.label.trim()) pickerEntry.label = keyword;
    } else {
      draft.entries.push(createEntry(newLabel.trim() || keyword, image));
      newLabel = '';
    }
    picker = null;
  }

  function removeImage() {
    if (pickerEntry) delete pickerEntry.image;
    picker = null;
  }

  function toggleBulk() {
    if (!bulkMode) bulkText = draft.entries.map((e) => e.label).join('\n');
    bulkMode = !bulkMode;
  }

  /** One entry per line; existing ids and pictures are kept by position. */
  function applyBulk() {
    const labels = bulkText.split('\n').map((l) => l.trim()).filter(Boolean);
    draft.entries = labels.map((label, i) => ({ ...draft.entries[i], id: draft.entries[i]?.id ?? newId(), label }));
  }

  function save() {
    const wheel = $state.snapshot(draft);
    wheel.name = wheel.name.trim() || 'Unbenanntes Rad';
    wheel.entries = wheel.entries
      .map((e) => ({ ...e, label: e.label.trim() }))
      .filter((e) => e.label !== '' || e.image);
    app.saveWheel(wheel);
    app.selectWheel(wheel.id);
  }

  function cancel() {
    if (dirty && !confirmDiscard) {
      confirmDiscard = true;
      return;
    }
    app.show(isNew ? { name: 'list' } : { name: 'wheel' });
  }

  function remove() {
    app.deleteWheel(draft.id);
    app.show({ name: 'list' });
  }
</script>

<div class="page">
  <PageHeader title={isNew ? 'Neues Rad' : 'Rad bearbeiten'} backLabel="Abbrechen" onback={cancel}>
    {#snippet actions()}
      <button class="primary" onclick={save}><Icon name="check" />Speichern & schließen</button>
    {/snippet}
  </PageHeader>

  <div class="content">
    {#if confirmDiscard}
      <div class="discard" role="alert">
        <span>Ungespeicherte Änderungen verwerfen?</span>
        <button class="ghost" onclick={() => (confirmDiscard = false)}>Weiter bearbeiten</button>
        <button class="destructive" onclick={cancel}>Verwerfen</button>
      </div>
    {/if}

    <InstallHint />

    <label class="field">
      <span>Name</span>
      <input type="text" bind:value={draft.name} placeholder="z.B. Laute – Frau Müller" />
    </label>

    <section>
      <div class="section-head">
        <h2>Felder ({draft.entries.length})</h2>
        <button class="ghost" onclick={toggleBulk}>{bulkMode ? 'Einzeln bearbeiten' : 'Als Liste bearbeiten'}</button>
      </div>

      {#if bulkMode}
        <textarea
          rows="12"
          bind:value={bulkText}
          oninput={applyBulk}
          placeholder={'Ein Feld pro Zeile, z.B.\nSch\nK\nKuh 🐄'}
        ></textarea>
      {:else}
        <ol>
          {#each draft.entries as entry, i (entry.id)}
            <li>
              <button
                class="ghost icon picture"
                onclick={() => (picker = { entryId: entry.id })}
                aria-label={entry.image ? 'Bild ändern' : 'Bild hinzufügen'}
              >
                {#if entry.image}<img src={entry.image.src} alt="" />{:else}<Icon name="image" />{/if}
              </button>
              <input type="text" bind:value={entry.label} placeholder={entry.image ? 'Nur Bild' : ''} />
              <button class="ghost icon" onclick={() => draft.entries.splice(i, 1)} aria-label="Feld löschen">
                <Icon name="trash" />
              </button>
            </li>
          {/each}
        </ol>
        <form class="add" onsubmit={(e) => (e.preventDefault(), addEntry())}>
          <input type="text" bind:value={newLabel} bind:this={newInput} placeholder="Neues Feld, z.B. Sch" enterkeyhint="done" />
          <button class="ghost" type="button" onclick={() => (picker = { entryId: null })}><Icon name="image" />Bild</button>
          <button class="primary" type="submit" disabled={!newLabel.trim()}><Icon name="plus" />Hinzufügen</button>
        </form>
        <p class="note">Mit „Bild“ ein Bild zum Wort suchen – so können auch Kinder mitspielen, die noch nicht lesen.</p>
      {/if}
    </section>

    {#if bulkMode && draft.entries.some((e) => e.image)}
      <p class="note">Bilder bleiben in der Liste nach Position erhalten.</p>
    {/if}

    {#if !isNew}
      <section class="danger">
        {#if confirmDelete}
          <span>Rad „{saved?.name}“ wirklich löschen?</span>
          <button class="ghost" onclick={() => (confirmDelete = false)}>Abbrechen</button>
          <button class="destructive" onclick={remove}><Icon name="trash" />Endgültig löschen</button>
        {:else}
          <button class="ghost" onclick={() => app.duplicate(draft.id)}><Icon name="copy" />Duplizieren</button>
          <button class="ghost destructive-text" onclick={() => (confirmDelete = true)}><Icon name="trash" />Rad löschen</button>
        {/if}
      </section>
    {/if}
  </div>
</div>

{#if picker}
  <PicturePicker
    initialQuery={pickerEntry ? pickerEntry.label : newLabel}
    hasImage={!!pickerEntry?.image}
    onpick={pickImage}
    onremove={removeImage}
    onclose={() => (picker = null)}
  />
{/if}

<style>
  .discard {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-radius: var(--radius);
    background: var(--surface);
    border: 2px solid #c0392b;
    font-weight: 700;
  }
  .discard span {
    flex: 1;
    min-width: 200px;
  }
  .field {
    display: grid;
    gap: 6px;
    font-weight: 700;
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
  .picture {
    flex: none;
    width: 48px;
    height: 48px;
    overflow: hidden;
  }
  .picture img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #fff;
  }
  .note {
    margin: 8px 0 0;
    font-size: 14px;
    color: var(--text-muted);
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
