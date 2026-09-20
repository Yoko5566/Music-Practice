interface ActiveVoice {
  oscillator: OscillatorNode;
  gain: GainNode;
}

class AudioService {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeVoices = new Map<string, ActiveVoice>();

  private init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.5;
    }
  }

  public async resume() {
    this.init();
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume().catch(() => {});
    }
  }

  public setMasterVolume(value: number) {
    this.init();
    if (!this.audioContext || !this.masterGain) return;

    const safeValue = Math.min(1, Math.max(0, value));
    this.masterGain.gain.setTargetAtTime(
      safeValue,
      this.audioContext.currentTime,
      0.01,
    );
  }

  public startTone(id: string, frequency: number) {
    this.init();
    if (!this.audioContext || !this.masterGain || this.activeVoices.has(id)) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }

    const oscillator = this.audioContext.createOscillator();
    const noteGain = this.audioContext.createGain();
    const now = this.audioContext.currentTime;

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, now);

    noteGain.gain.setValueAtTime(0.0001, now);
    noteGain.gain.exponentialRampToValueAtTime(0.32, now + 0.018);

    oscillator.connect(noteGain);
    noteGain.connect(this.masterGain);

    oscillator.start(now);
    this.activeVoices.set(id, { oscillator, gain: noteGain });
  }

  public stopTone(id: string) {
    if (!this.audioContext) return;

    const voice = this.activeVoices.get(id);
    if (!voice) return;

    this.activeVoices.delete(id);

    const now = this.audioContext.currentTime;
    const stopAt = now + 0.09;

    voice.gain.gain.cancelScheduledValues(now);
    voice.gain.gain.setTargetAtTime(0.0001, now, 0.025);

    try {
      voice.oscillator.stop(stopAt);
    } catch {
      // The oscillator may already have stopped.
    }
  }

  public playTone(frequency: number, duration: number = 0.5) {
    const id = `one-shot-${frequency}-${performance.now()}`;
    this.startTone(id, frequency);
    window.setTimeout(() => this.stopTone(id), Math.max(40, duration * 1000));
  }

  public stopAll() {
    for (const id of Array.from(this.activeVoices.keys())) {
      this.stopTone(id);
    }
  }
}

export const audioService = new AudioService();
