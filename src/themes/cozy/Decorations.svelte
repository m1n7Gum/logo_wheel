<script lang="ts">
  import HighlandCow from './animals/HighlandCow.svelte';
  import Alpaca from './animals/Alpaca.svelte';
  import Penguin from './animals/Penguin.svelte';
</script>

<div class="deco top-left"><Penguin /></div>
<div class="deco bottom-left"><HighlandCow /></div>
<div class="deco bottom-right"><Alpaca /></div>

<style>
  .deco {
    position: absolute;
    width: clamp(64px, 17vmin, 190px);
    aspect-ratio: 1;
    opacity: 0.95;
  }
  .deco :global(svg) {
    width: 100%;
    height: 100%;
    display: block;
  }
  .top-left { top: 8px; left: 8px; }
  .bottom-left { bottom: 8px; left: 8px; }
  .bottom-right { bottom: 0; right: 8px; }
</style>
