import { duplicateWheel, exampleWheel, type Wheel } from '../model/wheel';
import {
  createLocalStorageRepository,
  exportBackup,
  mergeWheels,
  parseBackup,
  type WheelRepository,
} from '../storage/wheelRepository';
import { loadSettings, saveSettings, type Settings } from '../storage/settings';
import { remainingEntries, removeFromRun, resetRun, startRun, type RunSession } from '../spin/runSession';
import { getTheme } from '../../themes/registry';

/** `wheelId: null` opens the editor for a new wheel. */
export type View = { name: 'wheel' } | { name: 'list' } | { name: 'edit'; wheelId: string | null };

export interface Toast {
  message: string;
  action?: { label: string; run: () => void };
}

/**
 * Central app state. Every mutation goes through a method here and is saved immediately,
 * so components never touch storage directly.
 */
export class AppState {
  wheels = $state<Wheel[]>([]);
  settings = $state<Settings>(loadSettings());
  view = $state<View>({ name: 'wheel' });
  settingsOpen = $state(false);
  toast = $state<Toast | null>(null);
  private toastTimer: ReturnType<typeof setTimeout> | undefined;
  private run = $state<RunSession | null>(null);

  activeWheel = $derived(
    this.wheels.find((w) => w.id === this.settings.lastWheelId) ?? this.wheels[0] ?? null,
  );
  remaining = $derived(
    this.activeWheel && this.run ? remainingEntries(this.activeWheel, this.run) : (this.activeWheel?.entries ?? []),
  );
  removedCount = $derived((this.activeWheel?.entries.length ?? 0) - this.remaining.length);
  theme = $derived(getTheme(this.settings.themeId));

  constructor(private repo: WheelRepository = createLocalStorageRepository()) {
    this.wheels = repo.loadAll();
    if (this.wheels.length === 0) {
      this.wheels = [exampleWheel()];
      this.persistWheels();
    }
  }

  // ---- navigation ----

  show(view: View): void {
    this.view = view;
  }

  selectWheel(id: string): void {
    this.updateSettings({ lastWheelId: id });
    this.run = null;
    this.view = { name: 'wheel' };
  }

  // ---- wheels ----

  /** Inserts a new wheel or replaces the saved version of an existing one. */
  saveWheel(wheel: Wheel): void {
    const saved = { ...wheel, updatedAt: Date.now() };
    const index = this.wheels.findIndex((w) => w.id === wheel.id);
    if (index === -1) this.wheels.push(saved);
    else this.wheels[index] = saved;
    this.persistWheels();
  }

  duplicate(id: string): Wheel | null {
    const original = this.wheels.find((w) => w.id === id);
    if (!original) return null;
    const copy = duplicateWheel($state.snapshot(original));
    this.wheels.push(copy);
    this.persistWheels();
    this.showToast(`Kopie „${copy.name}“ angelegt`, {
      label: 'Bearbeiten',
      run: () => this.show({ name: 'edit', wheelId: copy.id }),
    });
    return copy;
  }

  updateWheel(id: string, changes: Partial<Omit<Wheel, 'id'>>): void {
    const wheel = this.wheels.find((w) => w.id === id);
    if (!wheel) return;
    Object.assign(wheel, changes, { updatedAt: Date.now() });
    this.persistWheels();
  }

  deleteWheel(id: string): void {
    this.wheels = this.wheels.filter((w) => w.id !== id);
    if (this.settings.lastWheelId === id) this.updateSettings({ lastWheelId: this.wheels[0]?.id ?? null });
    this.persistWheels();
  }

  // ---- current run (never changes the saved wheel) ----

  pickedEntry(entryId: string): void {
    const wheel = this.activeWheel;
    if (!wheel?.removeAfterPick) return;
    this.run = removeFromRun(this.run ?? startRun(wheel), entryId);
  }

  resetRun(): void {
    if (this.run) this.run = resetRun(this.run);
  }

  // ---- feedback ----

  showToast(message: string, action?: Toast['action']): void {
    clearTimeout(this.toastTimer);
    this.toast = { message, action };
    this.toastTimer = setTimeout(() => (this.toast = null), 4000);
  }

  dismissToast(): void {
    clearTimeout(this.toastTimer);
    this.toast = null;
  }

  // ---- settings ----

  updateSettings(changes: Partial<Settings>): void {
    Object.assign(this.settings, changes);
    saveSettings($state.snapshot(this.settings));
  }

  // ---- backup ----

  exportBackup(): string {
    return exportBackup($state.snapshot(this.wheels));
  }

  /** Returns the number of imported wheels; throws on invalid files. */
  importBackup(json: string): number {
    const imported = parseBackup(json);
    this.wheels = mergeWheels($state.snapshot(this.wheels), imported);
    this.persistWheels();
    return imported.length;
  }

  private persistWheels(): void {
    try {
      this.repo.saveAll($state.snapshot(this.wheels));
    } catch (err) {
      // Usually a full storage quota – mostly from many pictures.
      console.error('Räder konnten nicht gespeichert werden', err);
      this.showToast('Speicher voll – bitte ein paar Bilder oder Räder löschen');
    }
  }
}

export const app = new AppState();
