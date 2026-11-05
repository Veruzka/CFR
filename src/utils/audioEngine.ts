// Real browser Web Audio API Beat Engine & Speech Reciter for CFR

class BeatEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private bpm: number = 92;
  private timerId: number | null = null;
  private currentStep: number = 0;
  private volume: number = 0.7;
  private masterGain: GainNode | null = null;
  private beatStyle: string = '90s Boom-Bap';
  private stepCallbacks: ((step: number) => void)[] = [];

  constructor() {
    // Lazy audio context creation upon user gesture
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setBpm(newBpm: number) {
    this.bpm = Math.max(60, Math.min(160, newBpm));
    if (this.isPlaying) {
      this.stop();
      this.play();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public setStyle(style: string) {
    this.beatStyle = style;
  }

  public onStep(cb: (step: number) => void) {
    this.stepCallbacks.push(cb);
  }

  public removeStepCallback(cb: (step: number) => void) {
    this.stepCallbacks = this.stepCallbacks.filter(c => c !== cb);
  }

  private triggerKick(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Pitch drops rapidly from 150Hz to 35Hz for punch
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);

    gain.gain.setValueAtTime(1.0, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.35);
  }

  private triggerSnare(time: number) {
    if (!this.ctx || !this.masterGain) return;

    // Noise component (snap/rattle)
    const bufferSize = this.ctx.sampleRate * 0.18;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.7, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.18);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    // Body tone component
    const bodyOsc = this.ctx.createOscillator();
    const bodyGain = this.ctx.createGain();
    bodyOsc.type = 'triangle';
    bodyOsc.frequency.setValueAtTime(180, time);
    bodyOsc.frequency.exponentialRampToValueAtTime(80, time + 0.08);

    bodyGain.gain.setValueAtTime(0.6, time);
    bodyGain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(this.masterGain);

    noise.start(time);
    bodyOsc.start(time);
    noise.stop(time + 0.18);
    bodyOsc.stop(time + 0.12);
  }

  private triggerHiHat(time: number, isOpen = false) {
    if (!this.ctx || !this.masterGain) return;

    const duration = isOpen ? 0.25 : 0.05;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 8500;
    filter.Q.value = 2.5;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(isOpen ? 0.35 : 0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + duration);
  }

  private triggerBass(time: number, freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(260, time);
    filter.frequency.exponentialRampToValueAtTime(90, time + 0.25);

    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.3);
  }

  public play() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.currentStep = 0;

    // 16-step sequencer pattern
    const intervalMs = (60 / this.bpm / 4) * 1000;

    const tick = () => {
      if (!this.isPlaying || !this.ctx) return;
      const time = this.ctx.currentTime + 0.01;
      const step = this.currentStep % 16;

      // Boom-bap pattern definition (16 steps)
      // Kicks on steps 0, 7, 10
      // Snares on steps 4, 12
      // Hi-Hats on every even step + some triplets for trap
      if (this.beatStyle.includes('Trap')) {
        if (step === 0 || step === 6 || step === 10) this.triggerKick(time);
        if (step === 4 || step === 12) this.triggerSnare(time);
        this.triggerHiHat(time, step === 14);
        if (step === 0) this.triggerBass(time, 45);
        if (step === 6) this.triggerBass(time, 55);
      } else if (this.beatStyle.includes('Funk')) {
        if (step === 0 || step === 6 || step === 10 || step === 13) this.triggerKick(time);
        if (step === 4 || step === 12) this.triggerSnare(time);
        if (step % 2 === 0) this.triggerHiHat(time, step === 10);
        if (step === 0) this.triggerBass(time, 65);
        if (step === 8) this.triggerBass(time, 73);
      } else {
        // Classic 90s Boom-Bap
        if (step === 0 || step === 6 || step === 10) this.triggerKick(time);
        if (step === 4 || step === 12) this.triggerSnare(time);
        if (step % 2 === 0) this.triggerHiHat(time, step === 14);
        if (step === 0) this.triggerBass(time, 55);
        if (step === 10) this.triggerBass(time, 49);
      }

      for (const cb of this.stepCallbacks) {
        cb(step);
      }

      this.currentStep++;
      this.timerId = window.setTimeout(tick, intervalMs);
    };

    tick();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const beatEngine = new BeatEngine();

// Text to Speech reciter using browser SpeechSynthesis
export class RapReciter {
  private static synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
  private static isReciting = false;

  public static isSupported(): boolean {
    return !!this.synth;
  }

  public static speakLines(
    lines: string[],
    bpm: number,
    onLineStart: (lineIndex: number) => void,
    onComplete: () => void
  ) {
    if (!this.synth) {
      onComplete();
      return;
    }

    this.stop();
    this.isReciting = true;

    // Pick an energetic English voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Alex'))) || voices.find(v => v.lang.startsWith('en'));

    // Adjust rate relative to BPM: 90 BPM ~ 1.05x, 130 BPM ~ 1.25x
    const rate = Math.max(0.9, Math.min(1.35, bpm / 92));

    let currentIndex = 0;

    const speakNext = () => {
      if (!this.isReciting || currentIndex >= lines.length) {
        this.isReciting = false;
        onComplete();
        return;
      }

      onLineStart(currentIndex);
      const text = lines[currentIndex];
      const utter = new SpeechSynthesisUtterance(text);
      if (preferredVoice) utter.voice = preferredVoice;
      utter.rate = rate;
      utter.pitch = 1.05;

      utter.onend = () => {
        currentIndex++;
        // Short pause between bars
        setTimeout(speakNext, 180);
      };

      utter.onerror = () => {
        currentIndex++;
        speakNext();
      };

      this.synth?.speak(utter);
    };

    speakNext();
  }

  public static stop() {
    this.isReciting = false;
    if (this.synth) {
      this.synth.cancel();
    }
  }

  public static getIsReciting(): boolean {
    return this.isReciting;
  }
}
