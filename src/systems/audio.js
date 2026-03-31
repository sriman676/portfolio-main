/**
 * Tactical UI Audio Engine (Web Audio API)
 * No external assets required. Synthesizes digital 'pips' and 'hums'.
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterBus = null;
    this.muted = true;
  }

  // Initialized on first user interaction (unlocks AudioContext)
  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.masterBus = this.ctx.createGain();
    this.masterBus.gain.value = 0.15; // Global volume
    this.masterBus.connect(this.ctx.destination);
    this.muted = false;
    console.log('[AUDIO_INITIALIZED]');
  }

  setMute(val) {
    this.muted = val;
    if (this.masterBus) {
      this.masterBus.gain.setTargetAtTime(val ? 0 : 0.15, this.ctx.currentTime, 0.05);
    }
  }

  // Tactical UI Pip (High-frequency, short duration)
  playPip(freq = 880, duration = 0.04) {
    if (!this.ctx || this.muted || this.ctx.state === 'suspended') return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.masterBus);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Silent fail (browser block)
    }
  }

  // Mechanical 'Click' (Low-frequency, very short)
  playClick() {
    this.playPip(440, 0.02);
  }

  // Error/Alert (Descending slide)
  playAlert() {
    if (!this.ctx || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.masterBus);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }
}

export const audio = new AudioEngine();
