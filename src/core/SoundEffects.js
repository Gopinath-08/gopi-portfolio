export class SoundEffects {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.engineOsc = null;
    this.engineGain = null;
    this.windSource = null;
    this.windFilter = null;
    this.windGain = null;
    this.isInitialized = false;
    this.muted = false;
    
    // Pentatonic scale frequencies
    this.scale = [
      261.63, // C4
      293.66, // D4
      329.63, // E4
      392.00, // G4
      440.00, // A4
      523.25, // C5
      587.33, // D5
      659.25, // E5
      783.99, // G5
      880.00, // A5
      1046.50, // C6
      1174.66, // D6
      1318.51, // E6
      1567.98, // G6
      1760.00  // A6
    ];
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.muted ? 0 : 0.6, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
      
      this.setupEngine();
      this.setupWind();
      
      this.isInitialized = true;
      console.log('[SoundEffects] Audio context initialized');
    } catch (e) {
      console.error('[SoundEffects] Failed to initialize AudioContext:', e);
    }
  }

  setupEngine() {
    this.engineOsc = this.ctx.createOscillator();
    this.engineOsc.type = 'triangle';
    this.engineOsc.frequency.setValueAtTime(60, this.ctx.currentTime);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, this.ctx.currentTime);
    
    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    
    this.engineOsc.connect(filter);
    filter.connect(this.engineGain);
    this.engineGain.connect(this.masterGain);
    
    this.engineOsc.start();
  }

  setupWind() {
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    this.windSource = this.ctx.createBufferSource();
    this.windSource.buffer = noiseBuffer;
    this.windSource.loop = true;
    
    this.windFilter = this.ctx.createBiquadFilter();
    this.windFilter.type = 'bandpass';
    this.windFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);
    this.windFilter.frequency.setValueAtTime(400, this.ctx.currentTime);
    
    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    
    this.windSource.connect(this.windFilter);
    this.windFilter.connect(this.windGain);
    this.windGain.connect(this.masterGain);
    
    this.windSource.start();
  }

  update(speedFraction, isBoostActive) {
    if (!this.isInitialized || this.ctx.state === 'suspended') return;
    
    const now = this.ctx.currentTime;
    
    const engineFreq = 55 + speedFraction * 75;
    this.engineOsc.frequency.setTargetAtTime(engineFreq, now, 0.1);
    
    const engineVol = 0.05 + speedFraction * 0.07;
    this.engineGain.gain.setTargetAtTime(engineVol, now, 0.1);
    
    const windFreq = 250 + speedFraction * 600;
    this.windFilter.frequency.setTargetAtTime(windFreq, now, 0.2);
    
    const windVol = 0.01 + speedFraction * 0.14;
    this.windGain.gain.setTargetAtTime(windVol, now, 0.15);
  }

  playRingChime(streak) {
    if (!this.isInitialized || this.ctx.state === 'suspended') return;
    
    const now = this.ctx.currentTime;
    const noteIndex = Math.min(streak - 1, this.scale.length - 1);
    const frequency = this.scale[noteIndex];
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);
    
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(frequency * 1.5, now);
    
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.08, now + 0.01);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc2.connect(gain2);
    gain2.connect(this.masterGain);
    
    osc.start(now);
    osc2.start(now);
    
    osc.stop(now + 0.85);
    osc2.stop(now + 0.45);
    
    // Echo
    const echoOsc = this.ctx.createOscillator();
    const echoGain = this.ctx.createGain();
    echoOsc.type = 'sine';
    echoOsc.frequency.setValueAtTime(frequency, now + 0.15);
    
    echoGain.gain.setValueAtTime(0, now + 0.15);
    echoGain.gain.linearRampToValueAtTime(0.1, now + 0.16);
    echoGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    
    echoOsc.connect(echoGain);
    echoGain.connect(this.masterGain);
    echoOsc.start(now + 0.15);
    echoOsc.stop(now + 0.75);
  }

  playStreakBreak() {
    if (!this.isInitialized || this.ctx.state === 'suspended') return;
    
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.4);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(now);
    osc.stop(now + 0.55);
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.masterGain) {
      const now = this.ctx ? this.ctx.currentTime : 0;
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : 0.6, now, 0.1);
    }
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  suspend() {
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend();
    }
  }
}
