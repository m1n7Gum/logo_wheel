<svelte:options namespace="svg" />

<!--
  A sloth hanging from a branch; its claw reaches into the wheel and marks the result.
  The U-shaped branch reaches far up so it always hangs in from the top screen edge.
  Drawn with the claw tip at (50, 34.2), then scaled down so it fits the stage:
  100 × 118, wheel top at y = 18, claw tip ~5.5 units inside the wheel.
-->
<g stroke-linejoin="round" stroke-linecap="round" transform="translate(50 23.5) scale(0.7) translate(-50 -34.2)">
  <!-- U-shaped branch hanging in from the top screen edge -->
  {#each [{ color: '#5b4033', width: 5.4 }, { color: '#9a6a43', width: 4.3 }] as { color, width }}
    <path
      d="M -10 -400 C 0 -180 8 -60 13 -12 C 15 3 22 7.6 36 7.6 L 64 7.6 C 78 7.6 85 3 87 -12 C 92 -60 100 -180 110 -400"
      fill="none"
      stroke={color}
      stroke-width={width}
    />
  {/each}
  <path d="M 11.4 -34 l 0.8 9 M 88.8 -42 l -0.8 9 M 40 7.4 l 9 0" fill="none" stroke="#7d5232" stroke-width="0.5" />
  <path d="M 87.6 -16 Q 92 -18 96 -24" fill="none" stroke="#5b4033" stroke-width="1.6" />
  <path d="M 87.6 -16 Q 92 -18 96 -24" fill="none" stroke="#9a6a43" stroke-width="0.6" />
  {#each [
    [11, -26, 160], [13.4, -8, 20], [17, 6, 40], [89, -32, -20], [86.6, 0, -160], [96, -24, -60], [70, 9.8, 60]
  ] as [x, y, a]}
    <g transform="translate({x} {y}) rotate({a})">
      <path d="M 0 0 C 2 -2.4 5.8 -2.4 7.6 0 C 5.8 2.4 2 2.4 0 0 Z" fill="#9fd08a" stroke="#5b4033" stroke-width="0.45" />
      <path d="M 0.6 0 L 6.4 0" stroke="#6fa85c" stroke-width="0.35" />
    </g>
  {/each}

  <!-- limbs gripping the branch -->
  {#each ['M 34 12.6 L 32.4 8.2', 'M 40 13.2 L 40.6 8.2', 'M 54.4 12 L 55.8 7.8'] as d}
    <path {d} stroke="#5b4033" stroke-width="4.1" fill="none" />
    <path {d} stroke="#a9876a" stroke-width="3" fill="none" />
  {/each}
  <path d="M 30.9 7.4 q 1.4 -1.8 3 -0.3 M 39.1 7.4 q 1.4 -1.8 3 -0.3 M 54.4 7 q 1.4 -1.8 3 -0.3" fill="none" stroke="#3b2a20" stroke-width="0.5" />

  <!-- body -->
  <ellipse cx="45" cy="14.2" rx="13" ry="6.3" fill="#b08d6e" stroke="#5b4033" stroke-width="0.55" />
  <path d="M 37 15.5 q 1.4 1 2.8 0 M 42 17 q 1.4 1 2.8 0 M 47 15.6 q 1.4 1 2.8 0" fill="none" stroke="#c9a888" stroke-width="0.45" />

  <!-- reaching arm with claws = the pointer -->
  <path d="M 53 17 Q 49 23.5 50 29.4" stroke="#5b4033" stroke-width="4.1" fill="none" />
  <path d="M 53 17 Q 49 23.5 50 29.4" stroke="#a9876a" stroke-width="3" fill="none" />
  <circle cx="50" cy="29.9" r="1.85" fill="#a9876a" stroke="#5b4033" stroke-width="0.55" />
  <path d="M 48.9 31 Q 48.4 32.6 48.9 33.6 M 50 31.4 L 50 34.2 M 51.1 31 Q 51.6 32.6 51.1 33.6" fill="none" stroke="#3b2a20" stroke-width="0.75" />

  <!-- head: hangs upside down like a real sloth, so its face is upright for the person opposite -->
  <g transform="rotate(180 59.5 17.6)">
  <circle cx="59.5" cy="17.6" r="6.9" fill="#b08d6e" stroke="#5b4033" stroke-width="0.55" />
  <ellipse cx="59.5" cy="18.9" rx="5.5" ry="4.4" fill="#f5e6cf" />
  <ellipse cx="57.1" cy="18.3" rx="2.1" ry="1.25" fill="#6b4a35" transform="rotate(-20 57.1 18.3)" />
  <ellipse cx="61.9" cy="18.3" rx="2.1" ry="1.25" fill="#6b4a35" transform="rotate(20 61.9 18.3)" />
  <circle cx="57.3" cy="18.2" r="0.9" fill="#1e140e" />
  <circle cx="61.7" cy="18.2" r="0.9" fill="#1e140e" />
  <circle cx="57.6" cy="17.85" r="0.34" fill="#fff" />
  <circle cx="62" cy="17.85" r="0.34" fill="#fff" />
  <ellipse cx="59.5" cy="20.2" rx="1" ry="0.65" fill="#3b2a20" />
  <path d="M 58.2 21.3 Q 59.5 22.4 60.8 21.3" fill="none" stroke="#3b2a20" stroke-width="0.4" />
  </g>
</g>
