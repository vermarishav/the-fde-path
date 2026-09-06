// Audio synthesizer for UI feedback and deep focus sound generation using Web Audio API

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playTick(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.03);
    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  } catch {
    // Ignore audio failures
  }
}

export function playChime(): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.07);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + index * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.07 + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + index * 0.07);
      osc.stop(ctx.currentTime + index * 0.07 + 0.36);
    });
  } catch {
    // Ignore audio failures
  }
}

// Focus Noise Generator (Binaural Alpha Waves & Brown Noise)
let activeNoiseNode: AudioNode | null = null;
let activeNoiseGain: GainNode | null = null;

export function startFocusSound(type: 'brown' | 'alpha40hz' = 'brown', volume = 0.06): boolean {
  try {
    stopFocusSound();
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (type === 'alpha40hz') {
      // 40Hz binaural/isochronic carrier tone: 200Hz base + 240Hz tone
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.setValueAtTime(200, ctx.currentTime);
      osc2.frequency.setValueAtTime(240, ctx.currentTime);

      gain.gain.setValueAtTime(volume * 0.6, ctx.currentTime);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      activeNoiseNode = gain;
      activeNoiseGain = gain;
      return true;
    }

    // Brown Noise Generator (deep, warm focus roar)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Gain boost
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    whiteNoise.start();
    activeNoiseNode = whiteNoise;
    activeNoiseGain = gain;
    return true;
  } catch {
    return false;
  }
}

export function stopFocusSound(): void {
  try {
    if (activeNoiseNode) {
      if ('stop' in activeNoiseNode && typeof (activeNoiseNode as AudioScheduledSourceNode).stop === 'function') {
        (activeNoiseNode as AudioScheduledSourceNode).stop();
      }
      activeNoiseNode.disconnect();
      activeNoiseNode = null;
    }
    if (activeNoiseGain) {
      activeNoiseGain.disconnect();
      activeNoiseGain = null;
    }
  } catch {
    // Ignore error
  }
}
