<svelte:options namespace="svg" />

<!--
  A sloth hanging from a branch; its claw reaches into the wheel and marks the result.
  Stage: 100 × 126, wheel top at y = 26, pointer tip at (50, ~32.5).
-->
<g stroke-linecap="round" stroke-linejoin="round">
  <!-- branch -->
  <path d="M 14 8.5 Q 40 4.5 60 6.5 T 88 6" fill="none" stroke="#8a5a36" stroke-width="3.2" />
  <path d="M 70 6.6 Q 74 2.5 78 1.8" fill="none" stroke="#8a5a36" stroke-width="1.4" />
  <ellipse cx="17" cy="5.5" rx="4" ry="2" fill="#8cbf7a" transform="rotate(-25 17 5.5)" />
  <ellipse cx="22" cy="10.8" rx="3.5" ry="1.7" fill="#a5d18f" transform="rotate(20 22 10.8)" />
  <ellipse cx="79" cy="2" rx="3.6" ry="1.8" fill="#a5d18f" transform="rotate(-15 79 2)" />
  <ellipse cx="85" cy="9" rx="3.8" ry="1.9" fill="#8cbf7a" transform="rotate(25 85 9)" />

  <!-- limbs holding the branch -->
  <path d="M 36 12 L 34.5 7.2" stroke="#8d6a50" stroke-width="3.4" />
  <path d="M 41 12 L 41.5 6.8" stroke="#8d6a50" stroke-width="3.4" />
  <path d="M 54 12 L 55.5 6.6" stroke="#8d6a50" stroke-width="3.4" />

  <!-- body -->
  <ellipse cx="46" cy="14" rx="12.5" ry="5.8" fill="#a88466" />
  <ellipse cx="45" cy="15.5" rx="8" ry="3.2" fill="#b8967a" />

  <!-- reaching arm with claws = the pointer -->
  <path d="M 52 17 Q 48.5 23.5 50 29.6" fill="none" stroke="#8d6a50" stroke-width="3.3" />
  <path d="M 48.9 29.6 Q 48.3 31.2 48.7 32.4" fill="none" stroke="#3b2a20" stroke-width="0.8" />
  <path d="M 50 30 L 50 33.1" fill="none" stroke="#3b2a20" stroke-width="0.8" />
  <path d="M 51.1 29.6 Q 51.7 31.2 51.3 32.4" fill="none" stroke="#3b2a20" stroke-width="0.8" />

  <!-- head -->
  <circle cx="58.5" cy="17" r="6.4" fill="#a88466" />
  <ellipse cx="58.5" cy="18" rx="5" ry="4" fill="#f0dcc0" />
  <ellipse cx="56.4" cy="17.6" rx="1.8" ry="1.1" fill="#5a3f2e" transform="rotate(-18 56.4 17.6)" />
  <ellipse cx="60.6" cy="17.6" rx="1.8" ry="1.1" fill="#5a3f2e" transform="rotate(18 60.6 17.6)" />
  <circle cx="56.6" cy="17.5" r="0.55" fill="#1e140e" />
  <circle cx="60.4" cy="17.5" r="0.55" fill="#1e140e" />
  <circle cx="56.8" cy="17.3" r="0.18" fill="#ffffff" />
  <circle cx="60.6" cy="17.3" r="0.18" fill="#ffffff" />
  <ellipse cx="58.5" cy="19.3" rx="0.9" ry="0.6" fill="#3b2a20" />
  <path d="M 57.3 20.5 Q 58.5 21.5 59.7 20.5" fill="none" stroke="#3b2a20" stroke-width="0.35" />
  <circle cx="55" cy="19.6" r="0.8" fill="#f2a7a0" opacity="0.7" />
  <circle cx="62" cy="19.6" r="0.8" fill="#f2a7a0" opacity="0.7" />
</g>
