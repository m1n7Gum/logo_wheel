<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon from './Icon.svelte';

  let {
    title,
    backLabel,
    onback,
    actions,
  }: { title: string; backLabel?: string; onback?: () => void; actions?: Snippet } = $props();
</script>

<header>
  <div>
    {#if onback}<button class="ghost" onclick={onback}><Icon name="back" />{backLabel}</button>{/if}
  </div>
  <h1>{title}</h1>
  <div class="actions">{@render actions?.()}</div>
</header>

<style>
  header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 12px;
    padding: max(10px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) 10px
      max(16px, env(safe-area-inset-left));
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 0;
    z-index: 5;
  }
  header > :first-child {
    justify-self: start;
  }
  h1 {
    margin: 0;
    font-size: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .actions {
    justify-self: end;
    display: flex;
    gap: 8px;
  }
</style>
