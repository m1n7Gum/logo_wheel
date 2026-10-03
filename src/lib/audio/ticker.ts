export interface TickSound {
  /** Pitch of the ratchet click in Hz. */
  frequency: number;
  waveform: OscillatorType;
  /** 0..1 */
  volume: number;
}

export const DEFAULT_TICK: TickSound = { frequency: 1800, waveform: 'square', volume: 0.12 };

/**
 * Synthesized sounds via Web Audio (no audio files). The AudioContext must be
 * created/resumed inside a user gesture on iOS, hence `unlock()` on the spin tap.
 */
export class Ticker {
  muted = false;
  private ctx: AudioContext | null = null;
  private lastTick = 0;

  unlock(): void {
    if (this.muted) return;
    try {
      this.ctx ??= new AudioContext();
      if (this.ctx.state === 'suspended') void this.ctx.resume();
    } catch {
      this.ctx = null; // No audio available – the app simply stays silent.
    }
  }

  tick(sound: TickSound = DEFAULT_TICK): void {
    const ctx = this.readyContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    if (now - this.lastTick < 0.03) return; // avoid buzzing at high speed
    this.lastTick = now;
    this.blip(ctx, sound.frequency, sound.waveform, sound.volume, now, 0.035);
  }

  /** Short friendly two-note chime when a result is shown. */
  chime(sound: TickSound = DEFAULT_TICK): void {
    const ctx = this.readyContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    this.blip(ctx, 660, 'sine', sound.volume * 2, now, 0.25);
    this.blip(ctx, 990, 'sine', sound.volume * 2, now + 0.12, 0.35);
  }

  private readyContext(): AudioContext | null {
    if (this.muted || !this.ctx || this.ctx.state !== 'running') return null;
    return this.ctx;
  }

  private blip(
    ctx: AudioContext,
    frequency: number,
    waveform: OscillatorType,
    volume: number,
    start: number,
    duration: number,
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = waveform;
    osc.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(volume, start);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.01);
  }
}
