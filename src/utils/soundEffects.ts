// Synthesizes soothing harp/celesta ambient musical chords using Web Audio API

let audioCtx: AudioContext | null = null;
let isPlayingAmbient = false;
let ambientIntervalId: number | null = null;

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

// Pentatonic scale frequencies for gentle, peaceful Asian/luxury garden mood
const HARP_NOTES = [
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
];

export function playPluckChime(freq = 523.25, duration = 1.8, gainLevel = 0.08) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Warm sine wave with subtle triangle overtone
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Envelope
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(gainLevel, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.debug('Audio play skipped', err);
  }
}

export function playAffirmationSound() {
  // Two delicate ascending notes
  playPluckChime(523.25, 1.2, 0.06);
  setTimeout(() => {
    playPluckChime(659.25, 1.6, 0.07);
  }, 120);
}

export function toggleAmbientSoundtrack(
  onStateChange: (isPlaying: boolean) => void
): boolean {
  const ctx = getAudioContext();
  if (!ctx) return false;

  if (isPlayingAmbient) {
    // Stop
    if (ambientIntervalId) {
      clearInterval(ambientIntervalId);
      ambientIntervalId = null;
    }
    isPlayingAmbient = false;
    onStateChange(false);
    return false;
  } else {
    // Start ambient melody loop
    isPlayingAmbient = true;
    onStateChange(true);

    let step = 0;
    const playNextNote = () => {
      if (!isPlayingAmbient) return;
      const noteIndex = (step * 2 + Math.floor(Math.random() * 3)) % HARP_NOTES.length;
      playPluckChime(HARP_NOTES[noteIndex], 2.8, 0.04);

      if (step % 3 === 0) {
        // Soft bass accompaniment
        setTimeout(() => {
          if (isPlayingAmbient) {
            playPluckChime(HARP_NOTES[0] / 2, 3.2, 0.03);
          }
        }, 300);
      }
      step++;
    };

    // Initial note
    playNextNote();
    ambientIntervalId = window.setInterval(playNextNote, 2400);
    return true;
  }
}
