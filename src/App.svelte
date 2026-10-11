<script lang="ts">
  import WheelView from './components/WheelView.svelte';
  import WheelList from './components/WheelList.svelte';
  import WheelEditor from './components/WheelEditor.svelte';
  import SettingsSheet from './components/SettingsSheet.svelte';
  import Toast from './components/Toast.svelte';
  import { app } from './lib/state/app.svelte';
  import { applyTheme } from './themes/registry';
  import { requestPersistentStorage } from './lib/storage/settings';
  import { cacheAllPictures } from './lib/pictures/offlineCache.svelte';

  $effect(() => applyTheme(app.theme));
  $effect(() => {
    void requestPersistentStorage();
    // Give the app a moment to settle before downloading pictures in the background.
    const timer = setTimeout(() => void cacheAllPictures(), 3000);
    return () => clearTimeout(timer);
  });
</script>

<!-- Pictures that could not be stored while offline are fetched as soon as the internet is back. -->
<svelte:window ononline={() => void cacheAllPictures()} />

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
