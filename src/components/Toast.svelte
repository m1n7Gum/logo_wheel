<script lang="ts">
  import { fly } from 'svelte/transition';
  import Icon from './Icon.svelte';
  import { app } from '../lib/state/app.svelte';
</script>

{#if app.toast}
  {@const toast = app.toast}
  <div class="toast" role="status" transition:fly={{ y: 40, duration: 200 }}>
    <Icon name="check" />
    <span>{toast.message}</span>
    {#if toast.action}
      <button
        onclick={() => {
          toast.action?.run();
          app.dismissToast();
        }}>{toast.action.label}</button
      >
    {/if}
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    z-index: 60;
    left: 50%;
    bottom: max(20px, env(safe-area-inset-bottom));
    translate: -50% 0;
    display: flex;
    align-items: center;
    gap: 12px;
    max-width: calc(100vw - 32px);
    padding: 10px 10px 10px 18px;
    border-radius: var(--radius);
    background: var(--text);
    color: var(--surface);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    font-weight: 700;
  }
  button {
    min-height: 44px;
    padding: 0 16px;
    border: 0;
    border-radius: calc(var(--radius) * 0.7);
    background: var(--accent);
    color: var(--accent-text);
    font-weight: 800;
    cursor: pointer;
  }
</style>
