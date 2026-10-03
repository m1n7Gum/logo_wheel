<script lang="ts">
  import HighlandCow from './animals/HighlandCow.svelte';
  import Alpaca from './animals/Alpaca.svelte';
  import Penguin from './animals/Penguin.svelte';
  import Hills from './scenery/Hills.svelte';
  import Cloud from './scenery/Cloud.svelte';
</script>

<!--
  A meadow around the wheel; the highland cow peeks out from behind it, penguin and
  alpaca stand in the grass (with a soft shadow below).
  All positions are relative to the stage (100% width = wheel diameter).
-->
<div class="meadow"><Hills /><div class="ground"></div></div>

<div class="animal cow"><HighlandCow /></div>

<div class="grounded penguin">
  <div class="shadow"></div>
  <div class="figure"><Penguin /></div>
</div>

<div class="grounded alpaca">
  <div class="shadow"></div>
  <div class="figure"><Alpaca /></div>
</div>

<div class="cloud cloud-a"><Cloud /></div>
<div class="cloud cloud-b"><Cloud /></div>

<style>
  .meadow,
  .animal,
  .grounded,
  .cloud {
    position: absolute;
  }
  .meadow :global(svg),
  .animal :global(svg),
  .grounded :global(svg),
  .cloud :global(svg) {
    display: block;
    width: 100%;
    height: 100%;
  }

  /* Rolling hills with plain ground below, reaching past the screen edge. */
  .meadow {
    left: -80%;
    width: 260%;
    top: 80%;
  }
  .meadow :global(svg) {
    height: auto;
    aspect-ratio: 6;
  }
  .ground {
    height: 100vh;
    margin-top: -1px;
    background-color: #c6e3ad;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='70'%3E%3Cg stroke='%23a6d08f' stroke-width='2' stroke-linecap='round' fill='none'%3E%3Cpath d='M14 22q1-5 4-8M58 48q-1-5-4-8M96 16q1-5 4-8M84 62q-1-5-4-8M30 60q1-5 4-8'/%3E%3C/g%3E%3Ccircle cx='72' cy='28' r='3.2' fill='%23fff'/%3E%3Ccircle cx='72' cy='28' r='1.3' fill='%23ffcf4a'/%3E%3C/svg%3E");
  }

  .animal {
    aspect-ratio: 1;
  }
  .animal :global(svg),
  .figure :global(svg) {
    filter: drop-shadow(0 3px 4px rgba(90, 60, 45, 0.15));
  }

  /* An animal standing in the grass with a soft shadow below. */
  .grounded > * {
    position: absolute;
    left: 0;
    width: 100%;
  }
  .figure {
    bottom: 6%;
    height: 100%;
  }
  .shadow {
    bottom: 3%;
    left: 15%;
    width: 70%;
    height: 12%;
    border-radius: 50%;
    background: radial-gradient(closest-side, rgba(70, 110, 50, 0.35), transparent);
  }

  .cloud {
    aspect-ratio: 2;
    opacity: 0.9;
  }

  /* Landscape: room beside the wheel. */
  .cow { width: 22%; left: -13%; top: 34%; rotate: -10deg; }
  .penguin { width: 20%; aspect-ratio: 1; left: -15%; bottom: -1%; }
  .alpaca { width: 38%; aspect-ratio: 140 / 110; right: -27%; bottom: -2%; }
  .cloud-a { width: 20%; left: -27%; top: 52%; }
  .cloud-b { width: 17%; right: -24%; top: 40%; }

  /* Portrait: little room beside the wheel, so the animals hug its corners. */
  @media (orientation: portrait) {
    .meadow { top: 86%; }
    .cow { width: 17%; left: -2%; top: calc(var(--wheel-top) + 1%); rotate: -14deg; }
    .penguin { width: 16%; left: 0; bottom: -4%; }
    .alpaca { width: 29%; right: -3%; bottom: -4%; }
    .cloud { display: none; }
  }
</style>
