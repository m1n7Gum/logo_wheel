import { createWheel, duplicateWheel, exampleWheel, type Wheel } from '../model/wheel';
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

export type View = { name: 'wheel' } | { name: 'list' } | { name: 'edit'; wheelId: string };

/**
 * Central app state. Every mutation goes through a method here and is saved immediately,
 * so components never touch storage directly.
 */
export class AppState {
  wheels = $state<Wheel[]>([]);
  settings = $state<Settings>(loadSettings());
  view = $state<View>({ name: 'wheel' });
  settingsOpen = $state(false);
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

  addWheel(): Wheel {
    const wheel = createWheel('Neues Rad');
    this.wheels.push(wheel);
    this.persistWheels();
    this.updateSettings({ lastWheelId: wheel.id });
    return wheel;
  }

  duplicate(id: string): void {
    const original = this.wheels.find((w) => w.id === id);
    if (!original) return;
    this.wheels.push(duplicateWheel($state.snapshot(original)));
    this.persistWheels();
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
    this.repo.saveAll($state.snapshot(this.wheels));
  }
}

export const app = new AppState();
