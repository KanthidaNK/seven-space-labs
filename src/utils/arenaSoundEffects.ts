/**
 * Zero-Dependency Web Audio API Sound Synthesizer for Quiz & Flashcard Arena (LAB 2)
 * Synthesizes high-fidelity audio feedback in real-time (0.01s latency)
 * without external audio files, CDNs, or network dependencies.
 */

class ArenaSoundSynthesizer {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch (e) {
      console.warn('Web Audio API not supported or blocked by browser policy:', e);
      return null;
    }
  }

  /**
   * Sound Effect: Correct Answer (เชิงบวก)
   * Dual ascending notes C5 (523Hz) -> G5 (784Hz) with subtle harmonic overtone C6 (1046Hz)
   * Bright, crystal-clear chime like Kahoot / Duolingo success sound.
   */
  playCorrect() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Note 1: C5 (523.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.22, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.35);

      // Note 2: G5 (783.99 Hz) with 80ms offset
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(783.99, now + 0.08);

      gain2.gain.setValueAtTime(0.001, now + 0.08);
      gain2.gain.linearRampToValueAtTime(0.26, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.08);
      osc2.stop(now + 0.55);

      // Sparkle chime harmonic: C6 (1046.5 Hz)
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(1046.5, now + 0.15);

      gain3.gain.setValueAtTime(0.001, now + 0.15);
      gain3.gain.linearRampToValueAtTime(0.12, now + 0.17);
      gain3.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc3.connect(gain3);
      gain3.connect(ctx.destination);

      osc3.start(now + 0.15);
      osc3.stop(now + 0.6);
    } catch (e) {
      console.warn('Error synthesizing correct sound:', e);
    }
  }

  /**
   * Sound Effect: Incorrect Answer (เตือนแบบนุ่มนวล ไม่บาดหู)
   * Descending notes E3 (164Hz) -> C3 (130Hz) with low-pass filter
   * Warm gentle buzzer / soft thud.
   */
  playWrong() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Note 1: E3 (~164.81 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      const filter1 = ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(164.81, now);

      filter1.type = 'lowpass';
      filter1.frequency.setValueAtTime(450, now);

      gain1.gain.setValueAtTime(0.001, now);
      gain1.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

      osc1.connect(filter1);
      filter1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.22);

      // Note 2: C3 (~130.81 Hz sliding downward slightly to ~110 Hz)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      const filter2 = ctx.createBiquadFilter();

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(130.81, now + 0.14);
      osc2.frequency.exponentialRampToValueAtTime(110.0, now + 0.42);

      filter2.type = 'lowpass';
      filter2.frequency.setValueAtTime(360, now + 0.14);

      gain2.gain.setValueAtTime(0.001, now + 0.14);
      gain2.gain.linearRampToValueAtTime(0.2, now + 0.16);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc2.connect(filter2);
      filter2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.14);
      osc2.stop(now + 0.45);
    } catch (e) {
      console.warn('Error synthesizing wrong sound:', e);
    }
  }

  /**
   * Sound Effect: Victory / Completion Fanfare
   * Ascending arpeggio when completing the quiz or reaching summary screen.
   */
  playVictory() {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const start = now + idx * 0.1;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === 3 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.2, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + (idx === 3 ? 0.6 : 0.25));

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + (idx === 3 ? 0.6 : 0.25));
      });
    } catch (e) {
      console.warn('Error synthesizing victory sound:', e);
    }
  }

  /**
   * Sound Effect: Subtle Click / Toggle
   * Short crisp feedback when toggling sound
   */
  playToggle(on: boolean) {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(on ? 880 : 440, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn('Error synthesizing toggle sound:', e);
    }
  }
}

export const arenaAudio = new ArenaSoundSynthesizer();
