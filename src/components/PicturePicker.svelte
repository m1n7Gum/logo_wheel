<script lang="ts" module>
  import type { SoundPosition } from '../lib/pictures/catalog';

  /** Word and sound are two ways to search the same pictures; mouth motor exercises are a set of their own. */
  type SearchBy = 'word' | 'sound';

  // Remembered while the app is open, so picking several pictures for one sound is quick.
  let lastMotor = false;
  let lastSearchBy: SearchBy = 'word';
  let lastSound = '';
  let lastPosition: SoundPosition = 'start';
  let lastNounsOnly = false;
  let lastCategory = 'animals';
  let lastAnimal = 'dino';
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import Icon from './Icon.svelte';
  import type { EntryImage } from '../lib/model/wheel';
  import { fetchPictogram, type Pictogram } from '../lib/pictures/arasaac';
  import { loadCatalog, type Catalog } from '../lib/pictures/catalog';
  import { MOTOR_ANIMALS, MOTOR_EXERCISES, MOTOR_GROUPS, motorPictureUrl } from '../lib/pictures/mouthMotor';

  let {
    initialQuery = '',
    hasImage = false,
    onpick,
    onpickall,
    onremove,
    onclose,
  }: {
    initialQuery?: string;
    hasImage?: boolean;
    onpick: (image: EntryImage, keyword: string) => void;
    /** Adds several pictures at once; only offered when the dialog adds new entries. */
    onpickall?: (pictures: { image: EntryImage; keyword: string }[]) => void;
    onremove?: () => void;
    onclose: () => void;
  } = $props();

  const PAGE = 60;
  const POSITIONS: { id: SoundPosition; label: string }[] = [
    { id: 'start', label: 'Am Anfang' },
    { id: 'middle', label: 'In der Mitte' },
    { id: 'end', label: 'Am Ende' },
    { id: 'any', label: 'Überall' },
  ];

  // The dialog is recreated for every pick, so the initial value is all it needs.
  // svelte-ignore state_referenced_locally
  let motor = $state(initialQuery.trim() ? false : lastMotor);
  // svelte-ignore state_referenced_locally
  let searchBy = $state<SearchBy>(initialQuery.trim() ? 'word' : lastSearchBy);
  // svelte-ignore state_referenced_locally
  let query = $state(initialQuery);
  let sound = $state(lastSound);
  let position = $state(lastPosition);
  let nounsOnly = $state(lastNounsOnly);
  let category = $state(lastCategory);
  let animal = $state(lastAnimal);
  let limit = $state(PAGE);

  let catalog = $state<Catalog | null>(null);
  let catalogError = $state(false);
  let pickError = $state(false);
  let loadingId = $state<number | null>(null);
  let input: HTMLInputElement | undefined = $state();

  onMount(() => {
    loadCatalog().then(
      (c) => (catalog = c),
      () => (catalogError = true),
    );
    input?.focus();
  });

  const results = $derived.by((): Pictogram[] => {
    if (!catalog) return [];
    if (searchBy === 'sound') return catalog.searchSound(sound, position, nounsOnly);
    return query.trim() ? catalog.searchWord(query) : catalog.inCategory(category);
  });
  const showCategories = $derived(searchBy === 'word' && !query.trim());
  /** Tongue and lip exercises apart, like the practice's two card sets. */
  const motorGroups = $derived.by(() => {
    const a = MOTOR_ANIMALS.find((x) => x.id === animal) ?? MOTOR_ANIMALS[0];
    return MOTOR_GROUPS.map((g) => ({
      ...g,
      pictures: MOTOR_EXERCISES.filter((e) => e.group === g.id).map((e) => ({
        id: e.id,
        keyword: e.label,
        image: { src: motorPictureUrl(a, e) },
      })),
    }));
  });

  // A new search starts at the top again.
  $effect(() => {
    void [searchBy, query, sound, position, nounsOnly, category];
    limit = PAGE;
  });

  // Remember the settings for the next time the dialog opens.
  $effect(() => {
    lastMotor = motor;
    lastSearchBy = searchBy;
    lastSound = sound;
    lastPosition = position;
    lastNounsOnly = nounsOnly;
    lastCategory = category;
    lastAnimal = animal;
  });

  /** One tap empties the search – deleting letter by letter is tedious on a tablet. */
  function clearSearch() {
    if (searchBy === 'word') query = '';
    else sound = '';
    input?.focus();
  }

  function showMotor(next: boolean) {
    motor = next;
    if (!next) queueMicrotask(() => input?.focus());
  }

  function switchSearch(next: SearchBy) {
    searchBy = next;
    queueMicrotask(() => input?.focus());
  }

  async function pick(p: Pictogram) {
    loadingId = p.id;
    pickError = false;
    try {
      onpick(await fetchPictogram(p.id), p.keyword);
    } catch {
      pickError = true;
    } finally {
      loadingId = null;
    }
  }

</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && onclose()} />

<div class="backdrop" onclick={onclose} aria-hidden="true" transition:fade={{ duration: 150 }}></div>
<div class="dialog" role="dialog" aria-modal="true" aria-label="Bild auswählen" transition:fade={{ duration: 150 }}>
  <header>
    <h2>Bild auswählen</h2>
    <div class="tabs" role="tablist">
      <button role="tab" aria-selected={!motor} class:active={!motor} onclick={() => showMotor(false)}>
        Wörter
      </button>
      <button role="tab" aria-selected={motor} class:active={motor} onclick={() => showMotor(true)}>
        Mundmotorik
      </button>
    </div>
    <button class="ghost icon" onclick={onclose} aria-label="Schließen"><Icon name="close" /></button>
  </header>

  <div class="controls">
    {#if motor}
      <div class="chips">
        {#each MOTOR_ANIMALS as a (a.id)}
          <button class="chip" class:active={animal === a.id} onclick={() => (animal = a.id)}>{a.label}</button>
        {/each}
      </div>
    {:else}
      <!-- One box, so it is clear that the switch decides how the text is searched. -->
      <div class="search-row">
        <span class="search-by" aria-hidden="true">Suchen nach</span>
        <div class="segmented" role="radiogroup" aria-label="Suchen nach">
          <button role="radio" aria-checked={searchBy === 'word'} class:active={searchBy === 'word'} onclick={() => switchSearch('word')}>
            Wort
          </button>
          <button role="radio" aria-checked={searchBy === 'sound'} class:active={searchBy === 'sound'} onclick={() => switchSearch('sound')}>
            Laut
          </button>
        </div>
        <div class="search-field">
          {#if searchBy === 'word'}
            <input
              type="text"
              bind:this={input}
              bind:value={query}
              placeholder="Suchwort, z.B. Maus"
              enterkeyhint="search"
              autocomplete="off"
            />
          {:else}
            <input
              type="text"
              bind:this={input}
              bind:value={sound}
              placeholder="Laut, z.B. sch, k oder st"
              enterkeyhint="search"
              autocomplete="off"
              autocapitalize="off"
            />
          {/if}
          {#if searchBy === 'word' ? query : sound}
            <button class="clear" onclick={clearSearch} aria-label="Suche leeren"><Icon name="close" size={20} /></button>
          {/if}
        </div>
      </div>
      {#if searchBy === 'sound'}
        <div class="chips">
          {#each POSITIONS as p (p.id)}
            <button class="chip" class:active={position === p.id} onclick={() => (position = p.id)}>{p.label}</button>
          {/each}
          <label class="nouns"><input type="checkbox" bind:checked={nounsOnly} />Nur Nomen</label>
        </div>
      {:else if showCategories && catalog}
        <div class="chips">
          {#each catalog.categories as c (c.id)}
            <button class="chip" class:active={category === c.id} onclick={() => (category = c.id)}>{c.label}</button>
          {/each}
        </div>
      {/if}
    {/if}
  </div>

  <div class="results">
    {#if motor}
      {#each motorGroups as g (g.id)}
        <section class="group">
          <div class="group-head">
            <h3>{g.label}</h3>
            {#if onpickall}
              <button class="ghost" onclick={() => onpickall(g.pictures)}><Icon name="plus" />Alle {g.pictures.length} hinzufügen</button>
            {/if}
          </div>
          <ul>
            {#each g.pictures as m (m.id)}
              <li>
                <button class="tile" onclick={() => onpick(m.image, m.keyword)} aria-label={m.keyword}>
                  <img src={m.image.src} alt="" width="256" height="256" />
                  <span>{m.keyword}</span>
                </button>
              </li>
            {/each}
          </ul>
        </section>
      {/each}
    {:else if catalogError}
      <p class="note">Die Bilderliste konnte nicht geladen werden. Bitte die App neu starten.</p>
    {:else if !catalog}
      <p class="note">Bilder werden geladen …</p>
    {:else if searchBy === 'sound' && !sound.trim()}
      <p class="note">Einen Laut eingeben – dann erscheinen passende Wörter mit Bild. Gesucht wird nach dem, was man hört: „s“ findet „Fuß“, aber nicht „Stein“ (gesprochen „scht“); „sch“ findet auch „Stein“.</p>
    {:else if results.length === 0 && searchBy === 'sound' && position === 'end' && /^[bdg]$/i.test(sound.trim())}
      <p class="note">Am Wortende spricht man b, d, g wie p, t, k. „Hund“ steht deshalb unter „t“.</p>
    {:else if results.length === 0}
      <p class="note">Nichts gefunden. Ein anderes Wort probieren, z.B. die Einzahl („Maus“ statt „Mäuse“).</p>
    {:else}
      {#if searchBy === 'sound' || query.trim()}
        <p class="count">{results.length} Treffer</p>
      {/if}
      <ul>
        {#each results.slice(0, limit) as p (p.id + p.keyword)}
          <li>
            <button class="tile" onclick={() => pick(p)} disabled={loadingId !== null} aria-label={p.keyword}>
              <img src={p.previewUrl} alt="" loading="lazy" width="256" height="256" />
              <span>{loadingId === p.id ? 'Lädt …' : p.keyword}</span>
            </button>
          </li>
        {/each}
      </ul>
      {#if results.length > limit}
        <button class="ghost more" onclick={() => (limit += PAGE)}>Mehr anzeigen ({results.length - limit} weitere)</button>
      {/if}
    {/if}
  </div>

  {#if pickError || (hasImage && onremove)}
    <footer>
      {#if pickError}
        <p class="error">Das Bild konnte nicht geladen werden. Bitte die App neu starten und noch einmal versuchen.</p>
      {/if}
      {#if hasImage && onremove}
        <button class="ghost destructive-text" onclick={onremove}><Icon name="trash" />Bild entfernen</button>
      {/if}
    </footer>
  {/if}
</div>

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 60;
    background: var(--backdrop);
  }
  .dialog {
    position: fixed;
    z-index: 61;
    inset: max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom));
    max-width: 900px;
    margin: 0 auto;
    display: grid;
    grid-template-rows: auto auto 1fr auto;
    gap: 12px;
    padding: 16px;
    background: var(--bg);
    color: var(--text);
    border-radius: calc(var(--radius) * 1.2);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  }
  header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  h2 {
    margin: 0;
    font-size: 20px;
  }
  .tabs {
    display: flex;
    margin-right: auto;
    padding: 3px;
    border-radius: 999px;
    background: var(--surface);
    border: 2px solid var(--border);
  }
  .tabs button {
    min-height: 38px;
    padding: 0 18px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--text);
    font-weight: 700;
    cursor: pointer;
  }
  .tabs button.active {
    background: var(--accent);
    color: var(--accent-text);
  }
  .controls {
    display: grid;
    gap: 10px;
  }
  .search-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 12px;
    border: 2px solid var(--border);
    border-radius: calc(var(--radius) * 0.7);
    background: var(--surface);
  }
  .search-row:focus-within {
    border-color: var(--accent);
  }
  .search-by {
    flex: none;
    font-size: 14px;
    font-weight: 700;
    color: var(--text-muted);
  }
  .segmented {
    display: flex;
    flex: none;
    padding: 3px;
    border-radius: 999px;
    background: var(--bg);
  }
  .segmented button {
    min-height: 34px;
    padding: 0 14px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--text);
    font-weight: 700;
    cursor: pointer;
  }
  .segmented button.active {
    background: var(--accent);
    color: var(--accent-text);
  }
  /* The input lives inside the box, so it drops its own frame and is set off by a divider. */
  .search-field {
    position: relative;
    flex: 1;
    min-width: 0;
    border-left: 2px solid var(--border);
  }
  .search-field input {
    width: 100%;
    padding-right: 52px;
    border: 0;
    border-radius: 0;
    background: transparent;
  }
  .clear {
    position: absolute;
    top: 50%;
    right: 4px;
    transform: translateY(-50%);
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
  }
  .clear:hover,
  .clear:focus-visible {
    background: var(--surface);
    color: var(--text);
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
  }
  .chip {
    min-height: 38px;
    padding: 0 14px;
    border: 2px solid var(--border);
    border-radius: 999px;
    background: var(--surface);
    color: var(--text);
    font-weight: 700;
    cursor: pointer;
  }
  .chip.active {
    border-color: var(--accent);
    background: var(--accent);
    color: var(--accent-text);
  }
  .nouns {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: 8px;
    font-weight: 700;
  }
  .nouns input {
    width: 20px;
    height: 20px;
  }
  .results {
    overflow-y: auto;
    min-height: 0;
  }
  .count {
    margin: 0 0 8px;
    font-size: 14px;
    color: var(--text-muted);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 10px;
  }
  .tile {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: auto 1fr;
    gap: 4px;
    padding: 8px;
    border: 2px solid var(--border);
    border-radius: calc(var(--radius) * 0.7);
    background: #fff;
    color: #222;
    font-weight: 700;
    cursor: pointer;
  }
  .tile:hover,
  .tile:focus-visible {
    border-color: var(--accent);
  }
  .tile:disabled {
    cursor: wait;
  }
  .tile img {
    width: 100%;
    height: auto;
    aspect-ratio: 1;
    object-fit: contain;
  }
  /* Up to two lines, so longer names like „Zunge zum Kinn“ can be read in full. */
  .tile span {
    align-self: center;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
    text-wrap: balance;
    /* Long words like „Zungenschlafplatz“ break at a syllable, not after any letter; short
       ones like „Lippen“ stay whole. */
    hyphens: auto;
    hyphenate-limit-chars: 11 5 5;
    -webkit-hyphenate-limit-before: 5;
    -webkit-hyphenate-limit-after: 5;
    overflow-wrap: anywhere;
    line-height: 1.2;
  }
  .more {
    width: 100%;
    margin-top: 12px;
  }
  .note {
    margin: 8px 0;
    color: var(--text-muted);
  }
  .error {
    margin: 0;
    color: #c0392b;
    font-weight: 700;
  }
  footer {
    display: grid;
    gap: 8px;
    justify-items: start;
  }
  .group + .group {
    margin-top: 20px;
  }
  .group-head {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 8px;
  }
  h3 {
    margin: 0;
    font-size: 18px;
  }
  /* The tabs and the title do not fit next to each other on a phone. */
  @media (max-width: 560px) {
    h2,
    .search-by {
      display: none;
    }
  }
</style>
