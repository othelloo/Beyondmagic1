/**
 * Lightweight Real-Time Pitch Detection & Musical Note Utilities
 * Uses Normalized Square Difference Autocorrelation (sub-1% CPU client-side).
 */

export interface DetectedPitch {
  frequency: number;       // in Hz (e.g. 440.0)
  noteName: string;        // e.g. "A"
  octave: number;          // e.g. 4
  fullNote: string;        // e.g. "A4"
  cents: number;           // -50 to +50 deviation from nearest semitone
  clarity: number;         // 0 to 1 confidence
  midi: number;            // fractional MIDI note
}

const NOTE_STRINGS = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const NOTE_STRINGS_FLAT = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];

/**
 * Converts frequency in Hz to fractional MIDI note number.
 */
export function frequencyToMidi(frequency: number): number {
  return 69 + 12 * Math.log2(Math.max(20, frequency) / 440);
}

/**
 * Converts MIDI note number to frequency in Hz.
 */
export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Analyzes frequency and returns detailed pitch info (note name, octave, cent deviation).
 */
export function analyzePitch(frequency: number, clarity = 1.0): DetectedPitch {
  const midi = frequencyToMidi(frequency);
  const roundedMidi = Math.round(midi);
  const cents = Math.round((midi - roundedMidi) * 100);

  const noteIndex = ((roundedMidi % 12) + 12) % 12;
  const noteName = NOTE_STRINGS[noteIndex];
  const octave = Math.floor(roundedMidi / 12) - 1;

  return {
    frequency,
    noteName,
    octave,
    fullNote: `${noteName}${octave}`,
    cents,
    clarity,
    midi
  };
}

/**
 * Checks whether detected frequency matches target pitch class (octave-independent).
 * Allows custom intonation tolerance in cents (default: +/- 45 cents).
 */
export function isPitchMatch(
  detectedFreq: number,
  targetNoteNameOrMidi: string | number,
  centTolerance = 45
): boolean {
  if (detectedFreq < 50 || detectedFreq > 1800) return false;

  const detectedMidi = frequencyToMidi(detectedFreq);
  const detectedPitchClass = ((Math.round(detectedMidi) % 12) + 12) % 12;
  const centsDeviation = Math.abs((detectedMidi - Math.round(detectedMidi)) * 100);

  let targetPitchClass = 0;
  if (typeof targetNoteNameOrMidi === 'number') {
    targetPitchClass = ((Math.round(targetNoteNameOrMidi) % 12) + 12) % 12;
  } else {
    // Parse note name like "C4", "F#3", "Eb4"
    const cleaned = targetNoteNameOrMidi.replace(/[0-9]/g, '').trim();
    const sharpIndex = NOTE_STRINGS.indexOf(cleaned);
    const flatIndex = NOTE_STRINGS_FLAT.indexOf(cleaned);
    if (sharpIndex !== -1) {
      targetPitchClass = sharpIndex;
    } else if (flatIndex !== -1) {
      targetPitchClass = flatIndex;
    } else {
      // standard sharps/flats fallback
      const norm = cleaned.replace('♯', '#').replace('♭', 'b');
      if (norm === 'C#' || norm === 'Db') targetPitchClass = 1;
      else if (norm === 'D#' || norm === 'Eb') targetPitchClass = 3;
      else if (norm === 'F#' || norm === 'Gb') targetPitchClass = 6;
      else if (norm === 'G#' || norm === 'Ab') targetPitchClass = 8;
      else if (norm === 'A#' || norm === 'Bb') targetPitchClass = 10;
      else targetPitchClass = 0;
    }
  }

  // Exact pitch class match with cent tolerance
  return detectedPitchClass === targetPitchClass && centsDeviation <= centTolerance;
}

/**
 * Autocorrelation algorithm to extract fundamental frequency ($f_0$) from audio buffer.
 * Highly robust against voice harmonics and room acoustics.
 */
export function autoCorrelate(buffer: Float32Array, sampleRate: number): { frequency: number; clarity: number } | null {
  const SIZE = buffer.length;

  // 1. Root Mean Square (RMS) energy threshold
  let sumSquares = 0;
  for (let i = 0; i < SIZE; i++) {
    const val = buffer[i];
    sumSquares += val * val;
  }
  const rms = Math.sqrt(sumSquares / SIZE);
  if (rms < 0.015) {
    // Too quiet / background noise floor
    return null;
  }

  // 2. Trim window edges to remove near-zero boundary artifacts
  let r1 = 0;
  let r2 = SIZE - 1;
  const thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buffer[i]) < thres) {
      r1 = i;
      break;
    }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buffer[SIZE - i]) < thres) {
      r2 = SIZE - i;
      break;
    }
  }

  const trimmed = buffer.subarray(r1, r2);
  const c = new Float32Array(trimmed.length);

  // 3. Autocorrelation sum
  for (let i = 0; i < trimmed.length; i++) {
    let sum = 0;
    for (let j = 0; j < trimmed.length - i; j++) {
      sum += trimmed[j] * trimmed[j + i];
    }
    c[i] = sum;
  }

  // 4. Find the first dip
  let d = 0;
  while (d < c.length - 1 && c[d] > c[d + 1]) {
    d++;
  }

  // 5. Find the maximum peak after the first dip
  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i < c.length; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }

  if (maxpos === -1 || maxval <= 0 || c[0] <= 0) return null;

  // Confidence / Clarity check
  const clarity = maxval / c[0];
  if (clarity < 0.40) return null;

  // 6. Parabolic interpolation for sub-sample frequency precision
  let T0 = maxpos;
  const x1 = c[T0 - 1] || 0;
  const x2 = c[T0];
  const x3 = c[T0 + 1] || 0;
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) {
    T0 = T0 - b / (2 * a);
  }

  const frequency = sampleRate / T0;
  // Human vocal range filter: 65 Hz (C2) to 1200 Hz (D6)
  if (frequency < 65 || frequency > 1200) return null;

  return { frequency, clarity };
}
