class AudioService {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private activeOscillators = new Set<OscillatorNode>();

  private init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      // Master volume
      this.gainNode.gain.value = 0.5;
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
    if (!this.audioContext || !this.gainNode) return;

    const safeValue = Math.min(1, Math.max(0, value));
    this.gainNode.gain.setTargetAtTime(
      safeValue,
      this.audioContext.currentTime,
      0.01,
    );
  }

  public playTone(frequency: number, duration: number = 0.5) {
    this.init();
    if (!this.audioContext || !this.gainNode) return;

    if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(() => {});
    }

    const osc = this.audioContext.createOscillator();
    const noteGain = this.audioContext.createGain();

    // Use triangle wave for a "gamey" but musical sound
    osc.type = 'triangle'; 
    osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    // Envelope
    noteGain.connect(this.gainNode);
    osc.connect(noteGain);

    const now = this.audioContext.currentTime;
    
    // Attack
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.6, now + 0.02); // Faster attack for snappier feel
    
    // Decay/Release
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.start(now);
    osc.stop(now + duration);
    this.activeOscillators.add(osc);
    osc.addEventListener('ended', () => this.activeOscillators.delete(osc), { once: true });
  }

  public stopAll() {
    for (const osc of this.activeOscillators) {
      try {
        osc.stop();
      } catch {
        // The oscillator may already have stopped.
      }
    }
    this.activeOscillators.clear();
  }
}

export const audioService = new AudioService();
