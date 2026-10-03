<script lang="ts">
  import WheelView from './components/WheelView.svelte';
  import WheelList from './components/WheelList.svelte';
  import WheelEditor from './components/WheelEditor.svelte';
  import SettingsSheet from './components/SettingsSheet.svelte';
  import Toast from './components/Toast.svelte';
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
  {#key app.view.wheelId}
    <WheelEditor wheelId={app.view.wheelId} />
  {/key}
{:else}
  <WheelView />
{/if}

{#if app.settingsOpen}
  <SettingsSheet />
{/if}

<Toast />
