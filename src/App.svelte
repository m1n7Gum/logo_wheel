<script lang="ts">
  import WheelView from './components/WheelView.svelte';
  import WheelList from './components/WheelList.svelte';
  import WheelEditor from './components/WheelEditor.svelte';
  import SettingsSheet from './components/SettingsSheet.svelte';
  import { app } from './lib/state/app.svelte';
  import { applyTheme } from './themes/registry';
  import { requestPersistentStorage } from './lib/storage/settings';

  $effect(() => applyTheme(app.theme));
  $effect(() => {
    void requestPersistentStorage();
  });
</script>

{#if app.view.name === 'list'}
  <WheelList />
{:else if app.view.name === 'edit'}
  <WheelEditor wheelId={app.view.wheelId} />
{:else}
  <WheelView />
{/if}

{#if app.settingsOpen}
  <SettingsSheet />
{/if}
