<script lang="ts">
  import Icon from './Icon.svelte';
  import PageHeader from './PageHeader.svelte';
  import InstallHint from './InstallHint.svelte';
  import { app } from '../lib/state/app.svelte';

  const sorted = $derived([...app.wheels].sort((a, b) => a.name.localeCompare(b.name, 'de')));
</script>

<div class="page">
  <PageHeader title="Räder" backLabel="Zum Rad" onback={() => app.show({ name: 'wheel' })}>
    {#snippet actions()}
      <button class="primary" onclick={() => app.show({ name: 'edit', wheelId: app.addWheel().id })}>
        <Icon name="plus" />Neues Rad
      </button>
    {/snippet}
  </PageHeader>

  <div class="content">
    <InstallHint />
    <ul>
      {#each sorted as wheel (wheel.id)}
        <li class:active={wheel.id === app.activeWheel?.id}>
          <button class="pick" onclick={() => app.selectWheel(wheel.id)}>
            <span class="name">{wheel.name}</span>
            <span class="meta">
              {wheel.entries.length} Felder{wheel.removeAfterPick ? ' · verschwinden' : ''}
            </span>
          </button>
          <button class="ghost icon" onclick={() => app.duplicate(wheel.id)} aria-label="Duplizieren">
            <Icon name="copy" />
          </button>
          <button class="ghost icon" onclick={() => app.show({ name: 'edit', wheelId: wheel.id })} aria-label="Bearbeiten">
            <Icon name="edit" />
          </button>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 12px;
  }
  li {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 6px 6px 6px 0;
    background: var(--surface);
    border: 2px solid var(--border);
    border-radius: var(--radius);
  }
  li.active {
    border-color: var(--accent);
  }
  .pick {
    flex: 1;
    min-width: 0;
    display: grid;
    gap: 2px;
    text-align: left;
    padding: 12px 16px;
    background: none;
    border: 0;
    color: var(--text);
    cursor: pointer;
  }
  .name {
    font-weight: 800;
    font-size: 19px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .meta {
    color: var(--text-muted);
    font-size: 14px;
  }
</style>
