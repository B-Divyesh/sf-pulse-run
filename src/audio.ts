export class PercussionAudio {
  private context: AudioContext | null = null;
  private output: GainNode | null = null;
  private lastBeat = -1;
  enabled = true;

  get isUnlocked(): boolean {
    return this.context !== null;
  }

  async unlock(): Promise<void> {
    if (!this.context) {
      this.context = new AudioContext();
      this.output = this.context.createGain();
      this.output.gain.value = this.enabled ? 0.24 : 0;
      this.output.connect(this.context.destination);
    }
    if (this.context.state === 'suspended') await this.context.resume();
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (this.output && this.context) {
      this.output.gain.setTargetAtTime(enabled ? 0.24 : 0, this.context.currentTime, 0.02);
    }
  }

  resetBeat(): void {
    this.lastBeat = -1;
  }

  tick(trackTime: number, track: number): void {
    if (!this.context || !this.output || !this.enabled) return;
    const beat = Math.floor(trackTime / 250);
    if (beat === this.lastBeat) return;
    this.lastBeat = beat;
    if (beat % 4 === 0) this.kick(track);
    if (beat % 4 === 2) this.snare(track);
    if (beat % 2 === 1) this.hat(track);
  }

  hit(lane: number, perfect: boolean): void {
    if (!this.context || !this.output || !this.enabled) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.value = 420 + lane * 90;
    gain.gain.setValueAtTime(perfect ? 0.1 : 0.065, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.07);
    oscillator.connect(gain).connect(this.output);
    oscillator.start();
    oscillator.stop(this.context.currentTime + 0.08);
  }

  private kick(track: number): void {
    if (!this.context || !this.output) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = track % 2 ? 'triangle' : 'sine';
    oscillator.frequency.setValueAtTime(120, this.context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(44, this.context.currentTime + 0.12);
    gain.gain.setValueAtTime(0.32, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.16);
    oscillator.connect(gain).connect(this.output);
    oscillator.start();
    oscillator.stop(this.context.currentTime + 0.17);
  }

  private snare(track: number): void {
    if (!this.context || !this.output) return;
    const buffer = this.context.createBuffer(1, this.context.sampleRate * 0.09, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < data.length; index += 1) {
      const envelope = 1 - index / data.length;
      data[index] = (Math.random() * 2 - 1) * envelope;
    }
    const source = this.context.createBufferSource();
    const filter = this.context.createBiquadFilter();
    const gain = this.context.createGain();
    source.buffer = buffer;
    filter.type = 'bandpass';
    filter.frequency.value = 1_000 + track * 110;
    gain.gain.value = 0.1;
    source.connect(filter).connect(gain).connect(this.output);
    source.start();
  }

  private hat(track: number): void {
    if (!this.context || !this.output) return;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = 'square';
    oscillator.frequency.value = 2_900 + track * 120;
    gain.gain.setValueAtTime(0.025, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.025);
    oscillator.connect(gain).connect(this.output);
    oscillator.start();
    oscillator.stop(this.context.currentTime + 0.03);
  }
}
