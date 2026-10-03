<script lang="ts">
  import { isInstalledApp, isSamsungInternet } from '../lib/storage/settings';

  const installed = isInstalledApp();
  const samsung = isSamsungInternet();
</script>

{#if !installed}
  <div class="hint" role="note">
    {#if samsung}
      <strong>Bitte in Chrome öffnen:</strong> Samsung Internet installiert Web-Apps in einem veralteten
      Format, das neuere Android-Versionen blockieren. Diese Seite in <strong>Chrome</strong> öffnen →
      Menü ⋮ → „App installieren“. Sonst kann der Browser die gespeicherten Räder nach einiger Zeit löschen.
    {:else}
      <strong>Bitte als App installieren:</strong> Sonst kann der Browser die gespeicherten Räder nach
      einiger Zeit löschen. iPad: Safari → Teilen → „Zum Home-Bildschirm“. Android: Chrome → Menü ⋮ →
      „App installieren“.
    {/if}
  </div>
{/if}

<style>
  .hint {
    padding: 12px 16px;
    border-radius: var(--radius);
    background: color-mix(in srgb, var(--highlight) 30%, var(--surface));
    border: 1px solid color-mix(in srgb, var(--highlight) 70%, var(--border));
    color: var(--text);
    font-size: 15px;
    line-height: 1.4;
  }
</style>
