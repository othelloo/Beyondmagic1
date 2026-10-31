import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Award, Flame, Play, Square, RotateCcw, ChevronRight, CheckCircle2, AlertCircle, Clock, Volume2, Music, Waves, Mic, Sparkles, X, ChevronDown } from 'lucide-react';
import { 
  FineMusicNote, 
  BeamedEighthPair, 
  BeamedSixteenthQuartet, 
  BeamedSixteenthDuo,
  BeamedEighthTriplet,
  BeamedEighthAndTwoSixteenths,
  BeamedTwoSixteenthsAndEighth 
} from './RhythmStudio';
import { autoCorrelate, analyzePitch, frequencyToMidi, DetectedPitch } from '../utils/pitchDetector';
import { getPianoNoteInfo, getPianoFrequencyInfo } from '../data/pianoSamples';
import { playRealisticMetronomeClick } from '../utils/metronomeSound';

export type AssessmentCategory = 'chords' | 'rhythm' | 'pitch' | 'tempo';

interface RoundResult {
  category: AssessmentCategory;
  level: 1 | 2 | 3;
  scorePercent: number;
  timeSeconds: number;
  skippedLevel: boolean;
  steppedDown: boolean;
}

interface AssessmentStudioProps {
  isDe: boolean;
  onSwitchTab?: (tab: 'explore' | 'ear-training' | 'pitch-memory' | 'rhythm' | 'tempo' | 'assessment') => void;
}

// 9 Comprehensive Rounds across ALL 4 pillars of musicianship:
// 1. Chords & Inversions
// 2. Rhythmic Sight-Reading on 5-Line Staff
// 3. Melodic Ear Memory (Vocal Singing with Microphone)
// 4. Tempo & Meter Perception (Guessing)
// 5. Advanced 7th Chords & Inversions
// 6. Internal Biological Clock & Tempo Tapping
// 7. Beamed Complex Rhythms on 5-Line Staff
// 8. Expressive Vocal Cantabile Memory (Unique Melody Guaranteed)
// 9. Harmonic Inversions & Cadential Resolution
const ROUND_PLAN: { round: number; category: AssessmentCategory; title: string; titleDe: string }[] = [
  { round: 1, category: 'chords', title: '1. Harmonic Inversions: Triad & Inversion', titleDe: '1. Harmonie-Gehör: Dreiklang & Umkehrung' },
  { round: 2, category: 'rhythm', title: '2. Classical Staff Sight-Reading', titleDe: '2. Notenlesen im klassischen 5-Linien-System' },
  { round: 3, category: 'pitch', title: '3. Melodic Memory: Sing via Microphone', titleDe: '3. Melodie-Gedächtnis: Gesang über Mikrofon' },
  { round: 4, category: 'tempo', title: '4. Pulse Perception: Guess Meter & BPM', titleDe: '4. Puls-Wahrnehmung: Taktart & Tempo' },
  { round: 5, category: 'chords', title: '5. Advanced 7th Chords & Inversions', titleDe: '5. Septakkorde & Charakteristische Umkehrungen' },
  { round: 6, category: 'tempo', title: '6. Internal Pulse: Tap Target BPM', titleDe: '6. Innerer Puls: Vorgegebenes Tempo schlagen' },
  { round: 7, category: 'rhythm', title: '7. Beamed Grooves & Syncopation', titleDe: '7. Balken-Rhythmen & Phrasierung' },
  { round: 8, category: 'pitch', title: '8. Cantabile Vocal Memory: Sing via Mic', titleDe: '8. Kantables Melodie-Gedächtnis: Gesang' },
  { round: 9, category: 'chords', title: '9. Harmonic Cadence & Inversion Mastery', titleDe: '9. Meisterschaft: Harmonische Schlusskadenz' },
];

// Rich Library of Classical Melodies with Durations & Rhythms
interface MelodicChallenge {
  id: string;
  name: string;
  nameDe: string;
  level: 1 | 2 | 3;
  notes: {
    note: string;
    midi: number;
    freq: number;
    durationSec: number;
    rhythmLabel: string;
  }[];
}

const MELODIC_CHALLENGES: MelodicChallenge[] = [
  // LEVEL 1 (Triadic & Stepwise Foundational Arches)
  {
    id: 'mel-l1-mozart-arch',
    name: 'Mozart Triad Arch',
    nameDe: 'Mozart Dreiklangsbogen',
    level: 1,
    notes: [
      { note: 'C4', midi: 60, freq: 261.63, durationSec: 0.55, rhythmLabel: '𝅘𝅥' },
      { note: 'E4', midi: 64, freq: 329.63, durationSec: 0.55, rhythmLabel: '𝅘𝅥' },
      { note: 'G4', midi: 67, freq: 392.00, durationSec: 1.10, rhythmLabel: '𝅗𝅥' },
    ]
  },
  {
    id: 'mel-l1-faure-lullaby',
    name: 'Fauré Gentle Turn',
    nameDe: 'Fauré Sanfte Wendung',
    level: 1,
    notes: [
      { note: 'F4', midi: 65, freq: 349.23, durationSec: 0.55, rhythmLabel: '𝅘𝅥' },
      { note: 'A4', midi: 69, freq: 440.00, durationSec: 0.55, rhythmLabel: '𝅘𝅥' },
      { note: 'G4', midi: 67, freq: 392.00, durationSec: 1.10, rhythmLabel: '𝅗𝅥' },
    ]
  },
  {
    id: 'mel-l1-beethoven-pastoral',
    name: 'Beethoven Pastoral Step',
    nameDe: 'Beethoven Pastorale',
    level: 1,
    notes: [
      { note: 'G3', midi: 55, freq: 196.00, durationSec: 0.50, rhythmLabel: '𝅘𝅥' },
      { note: 'C4', midi: 60, freq: 261.63, durationSec: 0.50, rhythmLabel: '𝅘𝅥' },
      { note: 'E4', midi: 64, freq: 329.63, durationSec: 1.15, rhythmLabel: '𝅗𝅥' },
    ]
  },
  {
    id: 'mel-l1-chopin-nocturne',
    name: 'Chopin Cantabile Third',
    nameDe: 'Chopin Terzenfluss',
    level: 1,
    notes: [
      { note: 'A3', midi: 57, freq: 220.00, durationSec: 0.60, rhythmLabel: '𝅘𝅥' },
      { note: 'C4', midi: 60, freq: 261.63, durationSec: 0.60, rhythmLabel: '𝅘𝅥' },
      { note: 'E4', midi: 64, freq: 329.63, durationSec: 1.20, rhythmLabel: '𝅗𝅥' },
    ]
  },

  // LEVEL 2 (4 to 5 Notes Lyrical Phrasing with Eighth Notes)
  {
    id: 'mel-l2-debussy-arabesque',
    name: 'Debussy Arabesque Swell',
    nameDe: 'Debussy Arabeske',
    level: 2,
    notes: [
      { note: 'C4', midi: 60, freq: 261.63, durationSec: 0.45, rhythmLabel: '𝅘𝅥' },
      { note: 'D4', midi: 62, freq: 293.66, durationSec: 0.30, rhythmLabel: '𝅘𝅥𝅮' },
      { note: 'E4', midi: 64, freq: 329.63, durationSec: 0.30, rhythmLabel: '𝅘𝅥𝅮' },
      { note: 'G4', midi: 67, freq: 392.00, durationSec: 0.50, rhythmLabel: '𝅘𝅥' },
      { note: 'E4', midi: 64, freq: 329.63, durationSec: 1.05, rhythmLabel: '𝅗𝅥' },
    ]
  },
  {
    id: 'mel-l2-schubert-serenade',
    name: 'Schubert Ständchen',
    nameDe: 'Schubert Ständchen-Bogen',
    level: 2,
    notes: [
      { note: 'D4', midi: 62, freq: 293.66, durationSec: 0.45, rhythmLabel: '𝅘𝅥' },
      { note: 'F4', midi: 65, freq: 349.23, durationSec: 0.30, rhythmLabel: '𝅘𝅥𝅮' },
      { note: 'A4', midi: 69, freq: 440.00, durationSec: 0.60, rhythmLabel: '𝅘𝅥' },
      { note: 'G4', midi: 67, freq: 392.00, durationSec: 0.30, rhythmLabel: '𝅘𝅥𝅮' },
      { note: 'F4', midi: 65, freq: 349.23, durationSec: 1.10, rhythmLabel: '𝅗𝅥' },
    ]
  },
  {
    id: 'mel-l2-bellini-belcanto',
    name: 'Bellini Bel Canto Wave',
    nameDe: 'Bellini Belcanto-Welle',
    level: 2,
    notes: [
      { note: 'E4', midi: 64, freq: 329.63, durationSec: 0.50, rhythmLabel: '𝅘𝅥' },
      { note: 'G4', midi: 67, freq: 392.00, durationSec: 0.35, rhythmLabel: '𝅘𝅥𝅮' },
      { note: 'F4', midi: 65, freq: 349.23, durationSec: 0.35, rhythmLabel: '𝅘𝅥𝅮' },
      { note: 'D4', midi: 62, freq: 293.66, durationSec: 0.50, rhythmLabel: '𝅘𝅥' },
      { note: 'C4', midi: 60, freq: 261.63, durationSec: 1.10, rhythmLabel: '𝅗𝅥' },
    ]
  },

  // LEVEL 3 (5 to 6 Notes Modal, Syncopated or Chromatic French Phrasing)
  {
    id: 'mel-l3-ravel-pavane',
    name: 'Ravel Pavane Line',
    nameDe: 'Ravel Pavane-Linie',
    level: 3,
    notes: [
      { note: 'G3', midi: 55, freq: 196.00, durationSec: 0.45, rhythmLabel: '𝅘𝅥' },
      { note: 'C4', midi: 60, freq: 261.63, durationSec: 0.30, rhythmLabel: '𝅘𝅥𝅮' },
      { note: 'E4', midi: 64, freq: 329.63, durationSec: 0.30, rhythmLabel: '𝅘𝅥𝅮' },
      { note: 'G4', midi: 67, freq: 392.00, durationSec: 0.50, rhythmLabel: '𝅘𝅥' },
      { note: 'F#4', midi: 66, freq: 369.99, durationSec: 0.30, rhythmLabel: '𝅘𝅥𝅮' },
      { note: 'G4', midi: 67, freq: 392.00, durationSec: 1.10, rhythmLabel: '𝅗𝅥' },
    ]
  },
  {
    id: 'mel-l3-faure-apres',
    name: 'Fauré Après un rêve',
    nameDe: 'Fauré Après un rêve',
    level: 3,
    notes: [
      { note: 'C4', midi: 60, freq: 261.63, durationSec: 0.50, rhythmLabel: '𝅘𝅥' },
      { note: 'Eb4', midi: 63, freq: 311.13, durationSec: 0.30, rhythmLabel: '𝅘𝅥𝅮' },
      { note: 'G4', midi: 67, freq: 392.00, durationSec: 0.70, rhythmLabel: '𝅘𝅥.' },
      { note: 'F4', midi: 65, freq: 349.23, durationSec: 0.25, rhythmLabel: '𝅘𝅥𝅮' },
      { note: 'D4', midi: 62, freq: 293.66, durationSec: 1.15, rhythmLabel: '𝅗𝅥' },
    ]
  },
  {
    id: 'mel-l3-tristan-ache',
    name: 'Wagner Lyrical Longing',
    nameDe: 'Wagner Sehnsuchtsmotiv',
    level: 3,
    notes: [
      { note: 'A3', midi: 57, freq: 220.00, durationSec: 0.50, rhythmLabel: '𝅘𝅥' },
      { note: 'F4', midi: 65, freq: 349.23, durationSec: 0.70, rhythmLabel: '𝅘𝅥.' },
      { note: 'E4', midi: 64, freq: 329.63, durationSec: 0.30, rhythmLabel: '𝅘𝅥𝅮' },
      { note: 'D#4', midi: 63, freq: 311.13, durationSec: 1.20, rhythmLabel: '𝅗𝅥' },
    ]
  }
];

// Chord Inversion Challenge Definition
interface ChordChallenge {
  id: string;
  name: string;
  nameDe: string;
  inversionLabel: string;
  inversionLabelDe: string;
  frequencies: number[];
  notes: string[];
  options: {
    id: string;
    label: string;
    labelDe: string;
    isCorrect: boolean;
  }[];
}

const CHORD_CHALLENGES: ChordChallenge[] = [
  // Round 1: Major Triad 1st Inversion (Sextakkord)
  {
    id: 'chord-c-maj-first-inv',
    name: 'C Major (1st Inversion / 6-Chord)',
    nameDe: 'C-Dur (1. Umkehrung / Sextakkord)',
    inversionLabel: '1st Inversion (3rd in bass: E3-G3-C4)',
    inversionLabelDe: '1. Umkehrung / Sextakkord (Terz im Bass: E3-G3-C4)',
    frequencies: [164.81, 196.00, 261.63, 329.63], // E3, G3, C4, E4
    notes: ['E3', 'G3', 'C4', 'E4'],
    options: [
      { id: 'c-maj-6', label: 'Major Triad · 1st Inversion (6-Chord)', labelDe: 'Dur-Dreiklang · 1. Umkehrung (Sextakkord)', isCorrect: true },
      { id: 'c-maj-root', label: 'Major Triad · Root Position', labelDe: 'Dur-Dreiklang · Grundstellung', isCorrect: false },
      { id: 'a-min-root', label: 'Minor Triad · Root Position', labelDe: 'Moll-Dreiklang · Grundstellung', isCorrect: false },
      { id: 'c-maj-64', label: 'Major Triad · 2nd Inversion (6/4-Chord)', labelDe: 'Dur-Dreiklang · 2. Umkehrung (Quartsextakkord)', isCorrect: false },
    ]
  },
  // Round 5: Dominant 7th (Quintsextakkord / 1st Inversion)
  {
    id: 'chord-g-dom7-first-inv',
    name: 'Dominant 7th (1st Inversion / 6-5 Chord)',
    nameDe: 'Dominant-Septakkord (1. Umkehrung / Quintsextakkord)',
    inversionLabel: '1st Inversion (3rd in bass: B2-D3-F3-G3)',
    inversionLabelDe: '1. Umkehrung / Quintsextakkord (Leitton im Bass: B2-D3-F3-G3)',
    frequencies: [123.47, 146.83, 174.61, 196.00], // B2, D3, F3, G3
    notes: ['B2', 'D3', 'F3', 'G3'],
    options: [
      { id: 'dom7-65', label: 'Dominant 7th · 1st Inversion (6/5 Chord)', labelDe: 'Dominant-Septakkord · 1. Umkehrung (Quintsextakkord)', isCorrect: true },
      { id: 'dom7-root', label: 'Dominant 7th · Root Position (7)', labelDe: 'Dominant-Septakkord · Grundstellung (7)', isCorrect: false },
      { id: 'half-dim', label: 'Half-Diminished 7th (ø7)', labelDe: 'Halbverminderter Septakkord (ø7)', isCorrect: false },
      { id: 'maj-7', label: 'Major 7th (maj7)', labelDe: 'Großer Septakkord (maj7)', isCorrect: false },
    ]
  },
  // Round 9: Cadence Mastery: Tristan Half-Diminished vs 2nd Inversion (6/4)
  {
    id: 'chord-b-half-dim',
    name: 'Half-Diminished 7th (Tristan Chord ø7)',
    nameDe: 'Halbverminderter Septakkord (Tristan-Akkord ø7)',
    inversionLabel: 'Half-Diminished 7th (B2-D3-F3-A3)',
    inversionLabelDe: 'Halbverminderter Septakkord (B2-D3-F3-A3)',
    frequencies: [123.47, 146.83, 174.61, 220.00], // B2, D3, F3, A3
    notes: ['B2', 'D3', 'F3', 'A3'],
    options: [
      { id: 'half-dim-correct', label: 'Half-Diminished 7th (Tristan Archetype ø7)', labelDe: 'Halbverminderter Septakkord (Tristan-Archetyp ø7)', isCorrect: true },
      { id: 'dim-7', label: 'Diminished 7th (°7)', labelDe: 'Vollverminderter Septakkord (°7)', isCorrect: false },
      { id: 'min-6', label: 'Minor 6th (m6)', labelDe: 'Moll-Sextakkord (m6)', isCorrect: false },
      { id: 'maj-9', label: 'Major 9th (maj9)', labelDe: 'Großer Nonenakkord (maj9)', isCorrect: false },
    ]
  }
];

// 2-Octave Keyboard Definitions (C3 to C5: 15 White Keys, 10 Black Keys)
interface PianoKeyItem {
  note: string;
  label: string;
  octave: number;
  midi: number;
  freq: number;
  isBlack: boolean;
}

const FULL_2_OCTAVE_WHITE_KEYS: PianoKeyItem[] = [
  { note: 'C3', label: 'C', octave: 3, midi: 48, freq: 130.81, isBlack: false },
  { note: 'D3', label: 'D', octave: 3, midi: 50, freq: 146.83, isBlack: false },
  { note: 'E3', label: 'E', octave: 3, midi: 52, freq: 164.81, isBlack: false },
  { note: 'F3', label: 'F', octave: 3, midi: 53, freq: 174.61, isBlack: false },
  { note: 'G3', label: 'G', octave: 3, midi: 55, freq: 196.00, isBlack: false },
  { note: 'A3', label: 'A', octave: 3, midi: 57, freq: 220.00, isBlack: false },
  { note: 'B3', label: 'B', octave: 3, midi: 59, freq: 246.94, isBlack: false },
  { note: 'C4', label: 'C', octave: 4, midi: 60, freq: 261.63, isBlack: false },
  { note: 'D4', label: 'D', octave: 4, midi: 62, freq: 293.66, isBlack: false },
  { note: 'E4', label: 'E', octave: 4, midi: 64, freq: 329.63, isBlack: false },
  { note: 'F4', label: 'F', octave: 4, midi: 65, freq: 349.23, isBlack: false },
  { note: 'G4', label: 'G', octave: 4, midi: 67, freq: 392.00, isBlack: false },
  { note: 'A4', label: 'A', octave: 4, midi: 69, freq: 440.00, isBlack: false },
  { note: 'B4', label: 'B', octave: 4, midi: 71, freq: 493.88, isBlack: false },
  { note: 'C5', label: 'C', octave: 5, midi: 72, freq: 523.25, isBlack: false },
];

interface PianoBlackKeyItem extends PianoKeyItem {
  leftPercent: number;
}

const FULL_2_OCTAVE_BLACK_KEYS: PianoBlackKeyItem[] = [
  { note: 'C#3', label: 'C♯', octave: 3, midi: 49, freq: 138.59, isBlack: true, leftPercent: 6.666 },
  { note: 'D#3', label: 'D♯', octave: 3, midi: 51, freq: 155.56, isBlack: true, leftPercent: 13.333 },
  { note: 'F#3', label: 'F♯', octave: 3, midi: 54, freq: 185.00, isBlack: true, leftPercent: 26.666 },
  { note: 'G#3', label: 'G♯', octave: 3, midi: 56, freq: 207.65, isBlack: true, leftPercent: 33.333 },
  { note: 'A#3', label: 'A♯', octave: 3, midi: 58, freq: 233.08, isBlack: true, leftPercent: 40.000 },
  { note: 'C#4', label: 'C♯', octave: 4, midi: 61, freq: 277.18, isBlack: true, leftPercent: 53.333 },
  { note: 'D#4', label: 'D♯', octave: 4, midi: 63, freq: 311.13, isBlack: true, leftPercent: 60.000 },
  { note: 'F#4', label: 'F♯', octave: 4, midi: 66, freq: 369.99, isBlack: true, leftPercent: 73.333 },
  { note: 'G#4', label: 'G♯', octave: 4, midi: 68, freq: 415.30, isBlack: true, leftPercent: 80.000 },
  { note: 'A#4', label: 'A♯', octave: 4, midi: 70, freq: 466.16, isBlack: true, leftPercent: 86.666 },
];

interface StaffBar {
  timeSignature: string;
  notes: {
    type: 'quarter' | 'half' | 'dotted-half' | 'eighth' | 'sixteenth' | 'rest-quarter';
    durationBeats: number;
  }[];
}

export const AssessmentStudio: React.FC<AssessmentStudioProps> = ({ isDe, onSwitchTab }) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [adaptiveLevel, setAdaptiveLevel] = useState<1 | 2 | 3>(1);
  const [adaptiveNotification, setAdaptiveNotification] = useState<string | null>(null);
  const [history, setHistory] = useState<RoundResult[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Anti-repeat registry: keeps track of all melodies heard during this session
  const alreadyUsedMelodyIdsRef = useRef<Set<string>>(new Set());

  // Round Timer
  const roundStartTimeRef = useRef<number>(performance.now());

  // Audio Context & Active Sources
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activePianoSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const getAudioContext = useCallback(() => {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioCtx();
    }
    return audioCtxRef.current;
  }, []);

  // Realistic wood tap sound for rhythm & tempo pad interactions
  const playTapSound = useCallback((freq = 300, dur = 0.05) => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + dur);
      gain.gain.setValueAtTime(0.75, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + dur + 0.01);
    } catch {}
  }, [getAudioContext]);

  // High-Fidelity Steinway Concert Grand Piano Single Note Playback
  const playPianoNote = useCallback(async (freqOrNote: number | string) => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') await ctx.resume();
      const now = ctx.currentTime;

      let info = null;
      if (typeof freqOrNote === 'string') {
        info = await getPianoNoteInfo(ctx, freqOrNote);
      } else {
        info = await getPianoFrequencyInfo(ctx, freqOrNote);
      }

      if (info) {
        const source = ctx.createBufferSource();
        source.buffer = info.buffer;
        source.playbackRate.setValueAtTime(info.playbackRate, now);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.95, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        source.connect(gain);
        gain.connect(ctx.destination);
        source.start(now);
        source.stop(now + 1.85);
      }
    } catch {}
  }, [getAudioContext]);

  // High-Fidelity Steinway Grand Piano Chord Voicing Playback
  // Staggered arpeggiated roll gives total harmonic separation and makes bass notes crystal clear
  const playChordVoicing = useCallback(async (frequencies: number[], notes?: string[]) => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') await ctx.resume();
      const now = ctx.currentTime;

      // Stop previous active piano chord notes immediately
      activePianoSourcesRef.current.forEach(source => {
        try {
          source.stop(now);
          source.disconnect();
        } catch {}
      });
      activePianoSourcesRef.current = [];

      // Master Steinway acoustic resonance bus
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(1.20, now + 0.015);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.6);

      // Acoustic air presence filter
      const airFilter = ctx.createBiquadFilter();
      airFilter.type = 'lowpass';
      airFilter.frequency.setValueAtTime(12000, now);

      // Dynamic compressor for punchy, undistorted chord clarity
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.setValueAtTime(-2, now);
      compressor.knee.setValueAtTime(6, now);
      compressor.ratio.setValueAtTime(4.0, now);

      masterGain.connect(airFilter);
      airFilter.connect(compressor);
      compressor.connect(ctx.destination);

      const targetItems = notes && notes.length === frequencies.length ? notes : frequencies;
      const infoPromises = targetItems.map(item =>
        typeof item === 'string'
          ? getPianoNoteInfo(ctx, item)
          : getPianoFrequencyInfo(ctx, item)
      );
      const infos = await Promise.all(infoPromises);

      const sources: AudioBufferSourceNode[] = [];
      infos.forEach((info, idx) => {
        if (!info) return;
        const source = ctx.createBufferSource();
        source.buffer = info.buffer;
        source.playbackRate.setValueAtTime(info.playbackRate, now);

        // 14ms human pianist micro-voicing roll: bass speaks first, giving immediate clarity to the inversion
        const rollOffset = idx * 0.014;
        const noteGain = ctx.createGain();
        // Bass is weighted slightly heavier (1.30) so the inversion bass note is unmistakable
        const vol = idx === 0 ? 1.30 : (idx === infos.length - 1 ? 1.15 : 1.05);
        noteGain.gain.setValueAtTime(vol, now + rollOffset);

        source.connect(noteGain);
        noteGain.connect(masterGain);

        source.start(now + rollOffset);
        sources.push(source);
      });

      activePianoSourcesRef.current = sources;
    } catch {}
  }, [getAudioContext]);

  // 1. CHORD ROUND SUB-STATE
  const [activeChordChallenge, setActiveChordChallenge] = useState<ChordChallenge>(CHORD_CHALLENGES[0]);
  const [selectedChordOptionId, setSelectedChordOptionId] = useState<string | null>(null);
  const [isChordPlaying, setIsChordPlaying] = useState<boolean>(false);

  // 2. TEMPO SUB-STATE
  const [tempoTargetBpm, setTempoTargetBpm] = useState<number>(108);
  const [tempoMeter, setTempoMeter] = useState<'3/4' | '4/4' | '6/8'>('4/4');
  const [tempoSelectedMeter, setTempoSelectedMeter] = useState<string | null>(null);
  const [tempoGuessedBpm, setTempoGuessedBpm] = useState<number>(100);
  const [tempoIsPlaying, setTempoIsPlaying] = useState<boolean>(false);
  const tempoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [tempoTappedTimes, setTempoTappedTimes] = useState<number[]>([]);

  // 3. RHYTHM ON A STAFF SUB-STATE
  const [rhythmBars, setRhythmBars] = useState<StaffBar[]>([
    {
      timeSignature: '4/4',
      notes: [
        { type: 'quarter', durationBeats: 1 },
        { type: 'quarter', durationBeats: 1 },
        { type: 'half', durationBeats: 2 },
      ]
    },
    {
      timeSignature: '4/4',
      notes: [
        { type: 'quarter', durationBeats: 1 },
        { type: 'quarter', durationBeats: 1 },
        { type: 'quarter', durationBeats: 1 },
        { type: 'quarter', durationBeats: 1 },
      ]
    }
  ]);
  const [rhythmTapTimes, setRhythmTapTimes] = useState<number[]>([]);
  const [rhythmPadPressed, setRhythmPadPressed] = useState<boolean>(false);
  const totalPlayableRhythmNotes = rhythmBars.reduce((sum, bar) => sum + bar.notes.filter(n => n.type !== 'rest-quarter').length, 0);

  // 4. MELODIC MEMORY (SINGING PRIMARY / PIANO FALLBACK)
  const [currentMelody, setCurrentMelody] = useState<MelodicChallenge>(MELODIC_CHALLENGES[0]);
  const [melodyPlayingIdx, setMelodyPlayingIdx] = useState<number | null>(null);
  const [isMelodyPlaying, setIsMelodyPlaying] = useState<boolean>(false);
  const [hasHeardMelody, setHasHeardMelody] = useState<boolean>(false);
  const [targetSingIdx, setTargetSingIdx] = useState<number>(0);
  const [pitchUserRecall, setPitchUserRecall] = useState<{ note: string; timestamp: number }[]>([]);

  // Vocal Microphone engine
  const [inputMode, setInputMode] = useState<'sing' | 'piano'>('sing');
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [livePitch, setLivePitch] = useState<DetectedPitch | null>(null);
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const holdStartTimeRef = useRef<number | null>(null);
  const transpositionOffsetRef = useRef<number | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // 2-Octave Keyboard view state
  const [lastTappedKey, setLastTappedKey] = useState<string | null>(null);

  // Setup current round
  const setupCurrentRound = useCallback((roundIdx: number, level: 1 | 2 | 3) => {
    roundStartTimeRef.current = performance.now();
    const config = ROUND_PLAN[roundIdx];

    if (config.category === 'chords') {
      const challengeIdx = roundIdx === 0 ? 0 : roundIdx === 4 ? 1 : 2;
      const ch = CHORD_CHALLENGES[challengeIdx];
      setActiveChordChallenge(ch);
      setSelectedChordOptionId(null);
      setIsChordPlaying(false);
      // Auto-preview chord
      setTimeout(() => {
        playChordVoicing(ch.frequencies, ch.notes);
      }, 350);
    } else if (config.category === 'tempo') {
      if (roundIdx === 3) {
        // Round 4: Guess
        const bpms = level === 1 ? [76, 96, 120] : level === 2 ? [68, 88, 112, 132] : [58, 74, 144, 168];
        const chosenBpm = bpms[Math.floor(Math.random() * bpms.length)];
        const chosenMeter = level === 1 ? '4/4' : level === 2 ? (Math.random() > 0.5 ? '3/4' : '4/4') : '6/8';
        setTempoTargetBpm(chosenBpm);
        setTempoMeter(chosenMeter);
        setTempoGuessedBpm(100);
        setTempoSelectedMeter(null);
      } else {
        // Round 6: Tap target
        const bpms = level === 1 ? 100 : level === 2 ? 124 : 76;
        setTempoTargetBpm(bpms);
        setTempoTappedTimes([]);
      }
    } else if (config.category === 'rhythm') {
      if (level === 1) {
        // 2 bars of 4/4
        setRhythmBars([
          {
            timeSignature: '4/4',
            notes: [
              { type: 'quarter', durationBeats: 1 },
              { type: 'quarter', durationBeats: 1 },
              { type: 'half', durationBeats: 2 }
            ]
          },
          {
            timeSignature: '4/4',
            notes: [
              { type: 'quarter', durationBeats: 1 },
              { type: 'quarter', durationBeats: 1 },
              { type: 'quarter', durationBeats: 1 },
              { type: 'quarter', durationBeats: 1 }
            ]
          }
        ]);
      } else if (level === 2) {
        // 2 bars of 3/4
        setRhythmBars([
          {
            timeSignature: '3/4',
            notes: [
              { type: 'quarter', durationBeats: 1 },
              { type: 'eighth', durationBeats: 0.5 },
              { type: 'eighth', durationBeats: 0.5 },
              { type: 'quarter', durationBeats: 1 }
            ]
          },
          {
            timeSignature: '3/4',
            notes: [
              { type: 'half', durationBeats: 2 },
              { type: 'quarter', durationBeats: 1 }
            ]
          }
        ]);
      } else {
        // Level 3: 16th beams & eighths
        setRhythmBars([
          {
            timeSignature: '4/4',
            notes: [
              { type: 'sixteenth', durationBeats: 0.25 },
              { type: 'sixteenth', durationBeats: 0.25 },
              { type: 'sixteenth', durationBeats: 0.25 },
              { type: 'sixteenth', durationBeats: 0.25 },
              { type: 'quarter', durationBeats: 1 },
              { type: 'half', durationBeats: 2 }
            ]
          },
          {
            timeSignature: '4/4',
            notes: [
              { type: 'eighth', durationBeats: 0.5 },
              { type: 'eighth', durationBeats: 0.5 },
              { type: 'quarter', durationBeats: 1 },
              { type: 'half', durationBeats: 2 }
            ]
          }
        ]);
      }
      setRhythmTapTimes([]);
    } else if (config.category === 'pitch') {
      // PICK UNIQUE MELODY THAT HAS NEVER BEEN USED BEFORE!
      const levelCandidates = MELODIC_CHALLENGES.filter(m => m.level === level);
      const unusedCandidates = levelCandidates.filter(m => !alreadyUsedMelodyIdsRef.current.has(m.id));
      const pool = unusedCandidates.length > 0 ? unusedCandidates : MELODIC_CHALLENGES.filter(m => !alreadyUsedMelodyIdsRef.current.has(m.id));
      const chosen = pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : MELODIC_CHALLENGES[0];

      alreadyUsedMelodyIdsRef.current.add(chosen.id);
      setCurrentMelody(chosen);

      setMelodyPlayingIdx(null);
      setIsMelodyPlaying(false);
      setHasHeardMelody(false);
      setTargetSingIdx(0);
      setPitchUserRecall([]);
      setHoldProgress(0);
      transpositionOffsetRef.current = null;
    }
  }, [playChordVoicing]);

  // Initialize
  useEffect(() => {
    setupCurrentRound(0, 1);
  }, [setupCurrentRound]);

  // Clean up audio nodes & microphone on unmount
  useEffect(() => {
    return () => {
      if (tempoTimerRef.current) clearInterval(tempoTimerRef.current);
      if (micStreamRef.current) micStreamRef.current.getTracks().forEach(t => t.stop());
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      activePianoSourcesRef.current.forEach(s => {
        try { s.stop(); s.disconnect(); } catch {}
      });
    };
  }, []);

  // Metronome for tempo (Realistic Mechanical Wittner Metronome Sound)
  const startMetronomeAudio = useCallback(() => {
    if (tempoTimerRef.current) clearInterval(tempoTimerRef.current);
    setTempoIsPlaying(true);
    const intervalMs = (60 / tempoTargetBpm) * 1000;
    const beatsPerBar = tempoMeter === '3/4' ? 3 : tempoMeter === '6/8' ? 6 : 4;
    let b = 0;

    const ctx = getAudioContext();
    playRealisticMetronomeClick(ctx, true);
    b = 1;

    tempoTimerRef.current = setInterval(() => {
      const isAccent = b % beatsPerBar === 0;
      playRealisticMetronomeClick(ctx, isAccent);
      b++;
    }, intervalMs);
  }, [tempoTargetBpm, tempoMeter, getAudioContext]);

  const stopMetronomeAudio = useCallback(() => {
    if (tempoTimerRef.current) {
      clearInterval(tempoTimerRef.current);
      tempoTimerRef.current = null;
    }
    setTempoIsPlaying(false);
  }, []);

  // Play melodic sequence with rhythm on Steinway Concert Grand Piano
  const playMelodySequence = useCallback(() => {
    stopMetronomeAudio();
    setIsMelodyPlaying(true);
    setPitchUserRecall([]);
    setTargetSingIdx(0);
    let idx = 0;

    const playStep = () => {
      if (idx >= currentMelody.notes.length) {
        setMelodyPlayingIdx(null);
        setIsMelodyPlaying(false);
        setHasHeardMelody(true);
        // Automatically request microphone for singing!
        if (inputMode === 'sing' && !isMicActive) {
          enableMicrophone();
        }
        return;
      }

      const item = currentMelody.notes[idx];
      setMelodyPlayingIdx(idx);
      playPianoNote(item.note);
      idx++;

      const noteDurationMs = item.durationSec * 1000;
      setTimeout(playStep, noteDurationMs);
    };

    playStep();
  }, [currentMelody, playPianoNote, stopMetronomeAudio, inputMode, isMicActive]);

  // Play Reference Start Note on Steinway Grand Piano
  const playStartNoteOnly = useCallback(() => {
    if (currentMelody.notes.length > 0) {
      playPianoNote(currentMelody.notes[0].note);
      setLastTappedKey(currentMelody.notes[0].note);
      setTimeout(() => setLastTappedKey(null), 400);
    }
  }, [currentMelody, playPianoNote]);

  // Activate microphone
  const enableMicrophone = async () => {
    setMicError(null);
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') await ctx.resume();

      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false }
        });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      if (!stream) throw new Error('NO_STREAM');
      micStreamRef.current = stream;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsMicActive(true);
      setInputMode('sing');
    } catch (err: unknown) {
      const isIframe = window.self !== window.top;
      const friendly = isDe
        ? (isIframe 
            ? 'Mikrofonzugriff im Vorschau-Frame blockiert. Du kannst nahtlos auf dem Klavier 🎹 spielen!' 
            : 'Mikrofon nicht verfügbar. Spiele die Noten bequem auf dem Klavier 🎹 nach!')
        : 'Microphone unavailable. Seamlessly use the 2-octave piano keyboard 🎹 below!';
      setMicError(friendly);
      setInputMode('piano');
    }
  };

  // Complete round and advance with adaptive logic
  const finishRound = useCallback((scorePercent: number) => {
    stopMetronomeAudio();
    const elapsedSec = (performance.now() - roundStartTimeRef.current) / 1000;
    const currentCat = ROUND_PLAN[currentRoundIdx].category;

    let skipped = false;
    let steppedDown = false;
    let nextLevel: 1 | 2 | 3 = adaptiveLevel;

    // Adaptive Engine
    if (scorePercent >= 85 && (elapsedSec < 8 || adaptiveLevel === 1)) {
      if (adaptiveLevel === 1) {
        nextLevel = 3;
        skipped = true;
        setAdaptiveNotification(
          isDe 
            ? '⚡ Überragend gelöst! Stufe übersprungen: Direkt zu Stufe 3!' 
            : '⚡ Exceptional & Fast! Skipped a level: Jumped straight to Level 3!'
        );
      } else if (adaptiveLevel === 2) {
        nextLevel = 3;
        setAdaptiveNotification(
          isDe ? '🌟 Sehr präzise! Aufstieg zu Stufe 3.' : '🌟 Very precise! Promoted to Level 3.'
        );
      }
    } else if (scorePercent >= 65) {
      if (adaptiveLevel === 1) nextLevel = 2;
      setAdaptiveNotification(null);
    } else {
      if (adaptiveLevel === 3) {
        nextLevel = 2;
        steppedDown = true;
        setAdaptiveNotification(
          isDe ? '🔄 Schwierigkeit angepasst: Einen Schritt zurück zu Stufe 2.' : '🔄 Difficulty adapted: Stepped back to Level 2.'
        );
      } else if (adaptiveLevel === 2) {
        nextLevel = 1;
        steppedDown = true;
        setAdaptiveNotification(
          isDe ? '🔄 Schwierigkeit angepasst: Zurück zu Stufe 1 zur Festigung.' : '🔄 Difficulty adapted: Stepped back to Level 1.'
        );
      }
    }

    const newResult: RoundResult = {
      category: currentCat,
      level: adaptiveLevel,
      scorePercent,
      timeSeconds: elapsedSec,
      skippedLevel: skipped,
      steppedDown
    };

    const updated = [...history, newResult];
    setHistory(updated);

    if (currentRoundIdx + 1 >= ROUND_PLAN.length) {
      setIsCompleted(true);
    } else {
      const nextIdx = currentRoundIdx + 1;
      setCurrentRoundIdx(nextIdx);
      setAdaptiveLevel(nextLevel);
      setupCurrentRound(nextIdx, nextLevel);
    }
  }, [currentRoundIdx, adaptiveLevel, history, isDe, setupCurrentRound, stopMetronomeAudio]);

  // Live real-time singing detection loop
  useEffect(() => {
    if (!isMicActive || ROUND_PLAN[currentRoundIdx].category !== 'pitch' || inputMode !== 'sing' || !hasHeardMelody) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    const analyser = analyserRef.current;
    const ctx = audioCtxRef.current;
    if (!analyser || !ctx) return;

    const buffer = new Float32Array(analyser.fftSize);

    const detect = () => {
      analyser.getFloatTimeDomainData(buffer);
      const res = autoCorrelate(buffer, ctx.sampleRate);

      if (res && res.clarity > 0.45) {
        const pitch = analyzePitch(res.frequency, res.clarity);
        setLivePitch(pitch);

        const detectedMidi = frequencyToMidi(res.frequency);
        const roundedMidi = Math.round(detectedMidi);
        const centsDeviation = Math.abs((detectedMidi - roundedMidi) * 100);

        const activeOffset = transpositionOffsetRef.current ?? 0;
        let isMatch = false;

        if (targetSingIdx === 0) {
          // Starting pitch: any clear pitch sung sets the transposition offset for user's vocal range
          isMatch = centsDeviation <= 45;
        } else {
          // Subsequent note: must match relative interval
          const origInterval = currentMelody.notes[targetSingIdx].midi - currentMelody.notes[0].midi;
          const expectedPitchClass = ((currentMelody.notes[0].midi + activeOffset + origInterval) % 12 + 12) % 12;
          const detectedPitchClass = ((roundedMidi % 12) + 12) % 12;
          isMatch = detectedPitchClass === expectedPitchClass && centsDeviation <= 45;
        }

        if (isMatch) {
          if (!holdStartTimeRef.current) {
            holdStartTimeRef.current = performance.now();
          }
          const elapsed = performance.now() - holdStartTimeRef.current;
          // Scale hold duration by the note's musical rhythm (quarter vs half vs eighth)
          const targetHoldDurationMs = Math.max(160, Math.min(500, Math.round(currentMelody.notes[targetSingIdx].durationSec * 350)));
          const progress = Math.min(100, Math.round((elapsed / targetHoldDurationMs) * 100));
          setHoldProgress(progress);

          if (elapsed >= targetHoldDurationMs) {
            holdStartTimeRef.current = null;
            setHoldProgress(0);

            if (targetSingIdx === 0 && transpositionOffsetRef.current === null) {
              const offset = roundedMidi - currentMelody.notes[0].midi;
              transpositionOffsetRef.current = offset;
            }

            if (targetSingIdx + 1 < currentMelody.notes.length) {
              setTargetSingIdx(prev => prev + 1);
            } else {
              // Vocal melody successfully completed!
              finishRound(100);
            }
          }
        } else {
          holdStartTimeRef.current = null;
          setHoldProgress(0);
        }
      } else {
        setLivePitch(null);
        holdStartTimeRef.current = null;
        setHoldProgress(0);
      }

      animFrameRef.current = requestAnimationFrame(detect);
    };

    animFrameRef.current = requestAnimationFrame(detect);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isMicActive, currentRoundIdx, inputMode, hasHeardMelody, currentMelody, targetSingIdx, finishRound]);

  // 1. Submit Chord Answer (Rounds 1, 5, 9)
  const submitChordAnswer = (optionId: string) => {
    setSelectedChordOptionId(optionId);
    const chosen = activeChordChallenge.options.find(o => o.id === optionId);
    const isCorrect = chosen?.isCorrect ?? false;
    const score = isCorrect ? 100 : 35;
    setTimeout(() => {
      finishRound(score);
    }, 450);
  };

  // 2. Submit Rhythm Tap (Rounds 2, 7)
  const handleRhythmTap = useCallback(() => {
    playTapSound(320, 0.08);
    setRhythmPadPressed(true);
    setTimeout(() => setRhythmPadPressed(false), 90);

    const now = performance.now();
    const updated = [...rhythmTapTimes, now];
    setRhythmTapTimes(updated);

    if (updated.length >= totalPlayableRhythmNotes) {
      setTimeout(() => {
        const flatNotes = rhythmBars.flatMap(b => b.notes).filter(n => n.type !== 'rest-quarter');
        const userIntervals: number[] = [];
        for (let i = 1; i < updated.length; i++) userIntervals.push(updated[i] - updated[i - 1]);
        const expectedBeats = flatNotes.slice(0, -1).map(n => n.durationBeats);

        if (userIntervals.length > 0 && expectedBeats.length > 0) {
          const avgBeatUnit = userIntervals[0] / expectedBeats[0];
          let errorSum = 0;
          for (let i = 0; i < userIntervals.length; i++) {
            const exp = expectedBeats[i] * avgBeatUnit;
            errorSum += Math.abs(userIntervals[i] - exp) / Math.max(exp, 100);
          }
          const avgError = errorSum / userIntervals.length;
          const score = Math.max(35, Math.min(100, Math.round((1 - avgError) * 100)));
          finishRound(score);
        } else {
          finishRound(85);
        }
      }, 200);
    }
  }, [playTapSound, rhythmTapTimes, totalPlayableRhythmNotes, rhythmBars, finishRound]);

  // 3. Fallback Piano Key click for Melodic Memory (Rounds 3, 8) - Steinway Concert Grand
  const handlePianoKeyClick = (key: PianoKeyItem) => {
    playPianoNote(key.note);
    setLastTappedKey(key.note);
    setTimeout(() => setLastTappedKey(null), 300);

    if (!hasHeardMelody || isMelodyPlaying) return;

    const now = performance.now();
    const updated = [...pitchUserRecall, { note: key.note, timestamp: now }];
    setPitchUserRecall(updated);

    if (updated.length >= currentMelody.notes.length) {
      setTimeout(() => {
        // 1. Pitch evaluation (Exact pitch OR relative interval transposition memory)
        let exactPitches = 0;
        for (let i = 0; i < currentMelody.notes.length; i++) {
          if (updated[i].note === currentMelody.notes[i].note) exactPitches++;
        }

        // Relative interval check
        const firstUserMidi = FULL_2_OCTAVE_WHITE_KEYS.find(k => k.note === updated[0].note)?.midi ??
                              FULL_2_OCTAVE_BLACK_KEYS.find(k => k.note === updated[0].note)?.midi ?? 60;
        const firstMelodyMidi = currentMelody.notes[0].midi;
        const semitoneShift = firstUserMidi - firstMelodyMidi;

        let relativeIntervalMatches = 0;
        for (let i = 0; i < currentMelody.notes.length; i++) {
          const userMidi = FULL_2_OCTAVE_WHITE_KEYS.find(k => k.note === updated[i].note)?.midi ??
                           FULL_2_OCTAVE_BLACK_KEYS.find(k => k.note === updated[i].note)?.midi ?? 60;
          const expectedShiftedMidi = currentMelody.notes[i].midi + semitoneShift;
          if (userMidi === expectedShiftedMidi) relativeIntervalMatches++;
        }

        const effectivePitches = Math.max(exactPitches, relativeIntervalMatches);
        const pitchScore = (effectivePitches / currentMelody.notes.length) * 100;

        // 2. Rhythm evaluation (comparing inter-onset intervals to note durationSec)
        let rhythmScore = 100;
        if (updated.length > 1) {
          const userIntervals: number[] = [];
          for (let i = 1; i < updated.length; i++) {
            userIntervals.push(updated[i].timestamp - updated[i - 1].timestamp);
          }
          const expectedDurations = currentMelody.notes.slice(0, -1).map(n => n.durationSec);
          const avgRatio = userIntervals[0] / Math.max(1, expectedDurations[0] * 1000);
          let errorSum = 0;
          for (let i = 0; i < userIntervals.length; i++) {
            const expMs = expectedDurations[i] * 1000 * avgRatio;
            errorSum += Math.abs(userIntervals[i] - expMs) / Math.max(expMs, 100);
          }
          const avgError = errorSum / userIntervals.length;
          rhythmScore = Math.max(35, Math.min(100, Math.round((1 - avgError * 0.75) * 100)));
        }

        // Weighted composite: 65% Pitch Memory + 35% Rhythmic Timing
        const finalScore = Math.round(pitchScore * 0.65 + rhythmScore * 0.35);
        finishRound(finalScore);
      }, 300);
    }
  };

  // 4. Submit Tempo Guess & Tap (Rounds 4, 6)
  const submitTempoGuess = useCallback(() => {
    if (!tempoSelectedMeter) return;
    const delta = Math.abs(tempoGuessedBpm - tempoTargetBpm);
    const meterOk = tempoSelectedMeter === tempoMeter;

    let bpmScore = 0;
    if (delta <= 5) bpmScore = 100;
    else if (delta <= 12) bpmScore = 85;
    else if (delta <= 20) bpmScore = 70;
    else bpmScore = Math.max(30, 50 - delta);

    const totalScore = Math.round(meterOk ? bpmScore : bpmScore * 0.7);
    finishRound(totalScore);
  }, [tempoSelectedMeter, tempoGuessedBpm, tempoTargetBpm, tempoMeter, finishRound]);

  const submitTempoTap = useCallback(() => {
    if (tempoTappedTimes.length < 4) return;
    const intervals: number[] = [];
    for (let i = 1; i < tempoTappedTimes.length; i++) intervals.push(tempoTappedTimes[i] - tempoTappedTimes[i - 1]);
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const measuredBpm = Math.round(60000 / avg);
    const delta = Math.abs(measuredBpm - tempoTargetBpm);
    const percentDelta = (delta / tempoTargetBpm) * 100;

    let score = 0;
    if (percentDelta <= 6) score = 100;
    else if (percentDelta <= 12) score = 88;
    else if (percentDelta <= 20) score = 75;
    else score = Math.max(30, Math.round(60 - percentDelta));

    finishRound(score);
  }, [tempoTappedTimes, tempoTargetBpm, finishRound]);

  // Physical keyboard listeners (Spacebar, Enter, K, J, Arrows)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      const isActionKey = 
        e.code === 'Space' || 
        e.code === 'Enter' || 
        e.key === ' ' || 
        e.key === 'Enter' || 
        e.key === 'k' || 
        e.key === 'K' || 
        e.key === 'j' || 
        e.key === 'J' ||
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code);

      if (isActionKey) {
        const cat = ROUND_PLAN[currentRoundIdx].category;
        if (cat === 'rhythm') {
          e.preventDefault();
          handleRhythmTap();
        } else if (cat === 'tempo') {
          if (currentRoundIdx === 5) {
            e.preventDefault();
            playTapSound(480, 0.05);
            setTempoTappedTimes(prev => [...prev, performance.now()]);
          } else {
            e.preventDefault();
            if (tempoIsPlaying) stopMetronomeAudio();
            else startMetronomeAudio();
          }
        } else if (cat === 'chords') {
          e.preventDefault();
          playChordVoicing(activeChordChallenge.frequencies, activeChordChallenge.notes);
        } else if (cat === 'pitch') {
          e.preventDefault();
          if (!hasHeardMelody) {
            playMelodySequence();
          } else {
            playStartNoteOnly();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRoundIdx, handleRhythmTap, tempoIsPlaying, startMetronomeAudio, stopMetronomeAudio, playTapSound, activeChordChallenge, playChordVoicing, hasHeardMelody, playMelodySequence, playStartNoteOnly]);

  // Compute final dimension metrics for Radar Web Chart
  const computeDimensionScores = () => {
    const chordRounds = history.filter(h => h.category === 'chords');
    const rhythmRounds = history.filter(h => h.category === 'rhythm');
    const pitchRounds = history.filter(h => h.category === 'pitch');
    const tempoRounds = history.filter(h => h.category === 'tempo');

    const chordAvg = chordRounds.length ? Math.round(chordRounds.reduce((a, b) => a + b.scorePercent, 0) / chordRounds.length) : 85;
    const rhythmAvg = rhythmRounds.length ? Math.round(rhythmRounds.reduce((a, b) => a + b.scorePercent, 0) / rhythmRounds.length) : 88;
    const pitchAvg = pitchRounds.length ? Math.round(pitchRounds.reduce((a, b) => a + b.scorePercent, 0) / pitchRounds.length) : 82;
    const tempoAvg = tempoRounds.length ? Math.round(tempoRounds.reduce((a, b) => a + b.scorePercent, 0) / tempoRounds.length) : 86;

    const skipsCount = history.filter(h => h.skippedLevel).length;
    const agilityScore = Math.min(100, Math.round(80 + skipsCount * 10));

    const overallComposite = Math.round((chordAvg + rhythmAvg + pitchAvg + tempoAvg + agilityScore) / 5);

    return {
      chords: chordAvg,
      pitch: pitchAvg,
      rhythm: rhythmAvg,
      tempo: tempoAvg,
      agility: agilityScore,
      overall: overallComposite
    };
  };

  const currentConfig = ROUND_PLAN[currentRoundIdx];
  const stats = computeDimensionScores();

  // Radar Web Chart (5 axes)
  const radarAxes = [
    { label: isDe ? 'Akkorde & Umkehrungen' : 'Chords & Inversions', score: stats.chords },
    { label: isDe ? 'Gesangs-Gehör (Singen)' : 'Vocal Melodic Memory', score: stats.pitch },
    { label: isDe ? 'Notensystem-Rhythmik' : 'Staff Sight-Reading', score: stats.rhythm },
    { label: isDe ? 'Tempo & Innerer Puls' : 'Tempo & Pulse', score: stats.tempo },
    { label: isDe ? 'Musikalische Agilität' : 'Adaptability', score: stats.agility }
  ];

  const centerX = 160;
  const centerY = 160;
  const radius = 105;

  const getPointCoordinates = (index: number, total: number, scorePercent: number, r: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const currentRadius = (scorePercent / 100) * r;
    return {
      x: centerX + currentRadius * Math.cos(angle),
      y: centerY + currentRadius * Math.sin(angle)
    };
  };

  const gridRings = [20, 40, 60, 80, 100];
  const dataPoints = radarAxes.map((axis, i) => getPointCoordinates(i, 5, axis.score, radius));
  const polygonPointsStr = dataPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  const startNoteName = currentMelody.notes.length > 0 ? currentMelody.notes[0].note : 'C4';

  const renderStaffBarNotes = (bar: StaffBar) => {
    const elements: React.ReactNode[] = [];
    const notes = bar.notes;
    const isCompound = bar.timeSignature === '6/8' || bar.timeSignature === '9/8' || bar.timeSignature === '12/8';
    let i = 0;

    while (i < notes.length) {
      // 1. In compound meters (6/8), beam three consecutive eighth notes together as a dotted quarter beat
      if (
        isCompound &&
        i + 2 < notes.length &&
        notes[i].type === 'eighth' &&
        notes[i + 1].type === 'eighth' &&
        notes[i + 2].type === 'eighth'
      ) {
        elements.push(
          <div key={`beam3-${i}`} className="relative flex items-center justify-center shrink-0">
            <BeamedEighthTriplet />
          </div>
        );
        i += 3;
        continue;
      }

      // 2. Beamed mixed: 1 eighth + 2 sixteenths
      if (
        i + 2 < notes.length &&
        notes[i].type === 'eighth' &&
        notes[i + 1].type === 'sixteenth' &&
        notes[i + 2].type === 'sixteenth'
      ) {
        elements.push(
          <div key={`beam-8-16-16-${i}`} className="relative flex items-center justify-center shrink-0">
            <BeamedEighthAndTwoSixteenths />
          </div>
        );
        i += 3;
        continue;
      }

      // 3. Beamed mixed: 2 sixteenths + 1 eighth
      if (
        i + 2 < notes.length &&
        notes[i].type === 'sixteenth' &&
        notes[i + 1].type === 'sixteenth' &&
        notes[i + 2].type === 'eighth'
      ) {
        elements.push(
          <div key={`beam-16-16-8-${i}`} className="relative flex items-center justify-center shrink-0">
            <BeamedTwoSixteenthsAndEighth />
          </div>
        );
        i += 3;
        continue;
      }

      // 4. Four sixteenths quartet
      if (
        i + 3 < notes.length &&
        notes[i].type === 'sixteenth' &&
        notes[i + 1].type === 'sixteenth' &&
        notes[i + 2].type === 'sixteenth' &&
        notes[i + 3].type === 'sixteenth'
      ) {
        elements.push(
          <div key={`beam4-${i}`} className="relative flex items-center justify-center shrink-0">
            <BeamedSixteenthQuartet />
          </div>
        );
        i += 4;
        continue;
      }

      // 5. Two sixteenths duo
      if (
        i + 1 < notes.length &&
        notes[i].type === 'sixteenth' &&
        notes[i + 1].type === 'sixteenth'
      ) {
        elements.push(
          <div key={`beam2-${i}`} className="relative flex items-center justify-center shrink-0">
            <BeamedSixteenthDuo />
          </div>
        );
        i += 2;
        continue;
      }

      // 6. Two eighths pair
      if (
        i + 1 < notes.length &&
        notes[i].type === 'eighth' &&
        notes[i + 1].type === 'eighth'
      ) {
        elements.push(
          <div key={`beameight-${i}`} className="relative flex items-center justify-center shrink-0">
            <BeamedEighthPair />
          </div>
        );
        i += 2;
        continue;
      }

      elements.push(
        <div key={`single-${i}`} className="relative flex items-center justify-center shrink-0">
          <FineMusicNote type={notes[i].type} />
        </div>
      );
      i++;
    }

    return elements;
  };

  const handleRestartTest = () => {
    alreadyUsedMelodyIdsRef.current.clear();
    setCurrentRoundIdx(0);
    setAdaptiveLevel(1);
    setAdaptiveNotification(null);
    setHistory([]);
    setIsCompleted(false);
    setupCurrentRound(0, 1);
    setTimeout(() => {
      const consoleEl = document.getElementById('assessment-studio-console');
      consoleEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  };

  return (
    <div id="assessment-studio-console" className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto select-none overflow-x-hidden">
      <div className="relative rounded-2xl bg-[#121520] border border-[#2b3347] shadow-[0_12px_45px_rgba(0,0,0,0.6)] p-3 sm:p-5 overflow-hidden w-full box-border">
        
        {/* Ambient Glow */}
        <div 
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-20 transition-colors duration-500"
          style={{ backgroundColor: isCompleted ? '#10b981' : '#c49750' }}
        />

        {/* 1. Header Bar: Full Musicianship Assessment & Restart */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 pb-2.5 mb-2.5 border-b border-white/10 w-full">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚖️</span>
            <div>
              <h4 className="text-sm sm:text-base font-serif font-bold text-[#fbf9f5] flex items-center gap-1.5">
                <span>{isDe ? 'Ganzheitlicher Einstufungstest' : 'Comprehensive Diagnostic Assessment'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#c49750]/20 text-[#ffd56b] border border-[#c49750]/40">
                  {isDe ? '9 Disziplinen' : '9 Musical Disciplines'}
                </span>
              </h4>
              <p className="text-[10px] font-mono text-[#8c887d]">
                {isDe 
                  ? 'Prüft Akkorde & Umkehrungen, Notensystem-Rhythmen, Gesangs-Gehör & Tempo' 
                  : 'Tests Chords & Inversions, Staff Rhythms, Vocal Pitch Memory & Tempo'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRestartTest}
            className="p-1.5 rounded-lg text-[#8c887d] hover:text-white bg-[#0b0d14] border border-white/10 transition-colors cursor-pointer"
            title={isDe ? 'Test neu starten' : 'Restart test'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {!isCompleted ? (
          <>
            {/* 2. HUD Bar: Rounds 1 to 9 & Adaptive Level */}
            <div className="flex items-center justify-between gap-1.5 pb-2.5 mb-2.5 border-b border-white/10 text-xs font-mono w-full">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-[#8c887d] text-[11px] mr-1">{isDe ? 'Runde:' : 'Round:'}</span>
                {ROUND_PLAN.map((r, i) => (
                  <div
                    key={i}
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                      i === currentRoundIdx
                        ? 'bg-[#c49750] text-black ring-2 ring-[#ffd56b]'
                        : i < currentRoundIdx
                        ? 'bg-emerald-600/60 text-white'
                        : 'bg-[#141824] text-[#6e6a60] border border-white/5'
                    }`}
                  >
                    {r.round}
                  </div>
                ))}
              </div>

              {/* Adaptive Stufe Pill */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#8c887d] hidden sm:inline">{isDe ? 'Adaptive Stufe:' : 'Adaptive Level:'}</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono border ${
                  adaptiveLevel === 3 
                    ? 'bg-rose-950/60 border-rose-500/50 text-rose-300' 
                    : adaptiveLevel === 2 
                    ? 'bg-amber-950/60 border-amber-500/50 text-amber-300' 
                    : 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                }`}>
                  {adaptiveLevel === 1 ? '🌱 Stufe 1' : adaptiveLevel === 2 ? '🌿 Stufe 2' : '🌳 Stufe 3 (Virtuoso)'}
                </span>
              </div>
            </div>

            {/* Adaptive Jump/Step Alert */}
            {adaptiveNotification && (
              <div className="p-2 sm:p-2.5 mb-2.5 rounded-xl bg-gradient-to-r from-amber-950/50 to-emerald-950/50 border border-[#c49750]/50 text-xs font-mono text-[#ffd56b] flex items-center gap-2 animate-fade-in shadow-md">
                <Sparkles className="w-4 h-4 text-[#ffd56b] shrink-0" />
                <span className="text-[11px] sm:text-xs leading-tight">{adaptiveNotification}</span>
              </div>
            )}

            {/* 3. ACTIVE ROUND CHALLENGE */}
            <div className="my-2 p-3 sm:p-4 rounded-2xl bg-[#090b12] border border-[#c49750]/30 shadow-inner">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-base">
                    {currentConfig.category === 'chords' ? '🎹' : currentConfig.category === 'rhythm' ? '🎼' : currentConfig.category === 'pitch' ? '🎤' : '⏱️'}
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-[#ffd56b]">
                    {isDe ? currentConfig.titleDe : currentConfig.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#8c887d] uppercase tracking-wider">
                  {currentConfig.category === 'chords' ? (isDe ? 'Harmonie' : 'Chords') : currentConfig.category}
                </span>
              </div>

              {/* ========================================================== */}
              {/* CATEGORY 1: CHORDS & INVERSIONS                           */}
              {/* ========================================================== */}
              {currentConfig.category === 'chords' && (
                <div className="space-y-3.5 text-center">
                  <div className="p-4 rounded-xl bg-[#05070e] border border-[#c49750]/40 shadow-inner space-y-2">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#c49750] block">
                      {isDe ? 'Höre den Akkord & erkenne seine Umkehrung:' : 'Listen to the chord & identify its inversion:'}
                    </span>

                    <div className="flex items-center justify-center gap-3 my-2">
                      <button
                        type="button"
                        onClick={() => playChordVoicing(activeChordChallenge.frequencies, activeChordChallenge.notes)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c49750] to-[#ffd56b] text-black font-mono font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>{isDe ? 'Steinway-Akkord anhören 🔊' : 'Play Steinway Chord 🔊'}</span>
                      </button>
                    </div>

                    <p className="text-[11px] font-mono text-[#8c887d]">
                      {isDe ? 'Achte besonders auf den tiefsten Ton (Bassstimme)!' : 'Pay close attention to the lowest note in the bass!'}
                    </p>
                  </div>

                  {/* Chord Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                    {activeChordChallenge.options.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => submitChordAnswer(opt.id)}
                        className={`p-3 rounded-xl border text-xs font-mono font-semibold transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          selectedChordOptionId === opt.id
                            ? opt.isCorrect
                              ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200'
                              : 'bg-rose-950/80 border-rose-400 text-rose-200'
                            : 'bg-[#141824] hover:bg-[#1d2334] text-[#dedacf] border-white/10'
                        }`}
                      >
                        <span>{isDe ? opt.labelDe : opt.label}</span>
                        {selectedChordOptionId === opt.id && (
                          <span>{opt.isCorrect ? '✓' : '✕'}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================== */}
              {/* CATEGORY 2: RHYTHM ON A 5-LINE CLASSICAL MUSICAL STAFF     */}
              {/* ========================================================== */}
              {currentConfig.category === 'rhythm' && (
                <div className="space-y-3">
                  {/* Classical 5-Line Musical Staff Score Container */}
                  <div className="relative w-full flex items-center h-18 sm:h-20 px-2 sm:px-4 bg-[#05070c] rounded-xl border border-white/10 select-none box-border my-2 overflow-hidden">
                    {/* 5 Classical Golden Staff Lines */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 sm:h-9 flex flex-col justify-between pointer-events-none opacity-30 px-2">
                      <div className="w-full h-[1px] bg-[#c49750]" />
                      <div className="w-full h-[1px] bg-[#c49750]" />
                      <div className="w-full h-[1px] bg-[#c49750]" />
                      <div className="w-full h-[1px] bg-[#c49750]" />
                      <div className="w-full h-[1px] bg-[#c49750]" />
                    </div>

                    {/* Percussion Clef */}
                    <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 mr-2 z-10 select-none">
                      <span className="w-1 h-7 sm:h-8 bg-[#c49750]/80 rounded-sm" />
                      <span className="w-1 h-7 sm:h-8 bg-[#c49750]/80 rounded-sm" />
                    </div>

                    {/* Equal-Width Measures */}
                    <div className="relative flex-1 flex items-center h-full z-10">
                      {rhythmBars.map((bar, barIdx) => {
                        const [num, den] = bar.timeSignature.split('/');
                        return (
                          <div 
                            key={barIdx} 
                            className="flex-1 flex items-center justify-between h-full px-2 sm:px-3 relative border-r border-white/20 last:border-r-0"
                          >
                            {/* Time Signature */}
                            {barIdx === 0 && (
                              <div className="flex flex-col items-center justify-center font-serif text-base sm:text-lg font-black text-[#fbf9f5] leading-[0.8] tracking-tight mr-1 sm:mr-2 select-none shrink-0 drop-shadow-md">
                                <span>{num}</span>
                                <span>{den}</span>
                              </div>
                            )}

                            {/* Measure notes */}
                            <div className="flex-1 flex items-center justify-center gap-2 sm:gap-4 px-1">
                              {renderStaffBarNotes(bar)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Striking Pad with Spacebar Support */}
                  <button
                    type="button"
                    onPointerDown={(e) => {
                      e.preventDefault();
                      handleRhythmTap();
                    }}
                    className={`w-full h-22 sm:h-24 rounded-2xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                      rhythmPadPressed
                        ? 'bg-gradient-to-r from-[#c49750] to-[#ffd56b] text-black scale-95 shadow-lg'
                        : 'bg-[#151926] hover:bg-[#1d2334] text-[#fbf9f5] border-white/10'
                    }`}
                  >
                    <span className="text-2xl">🥁</span>
                    <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider">
                      {isDe ? 'Rhythmus schlagen (Leertaste / Klick)' : 'Strike Rhythm (Spacebar / Click)'}
                    </span>
                    <span className="text-[10px] font-mono text-[#8c887d]">
                      {isDe 
                        ? `Note ${rhythmTapTimes.length} von ${totalPlayableRhythmNotes} geschlagen` 
                        : `Note ${rhythmTapTimes.length} of ${totalPlayableRhythmNotes} tapped`}
                    </span>
                  </button>
                </div>
              )}

              {/* ========================================================== */}
              {/* CATEGORY 3: MELODIC MEMORY (SING VIA MICROPHONE PRIMARY)   */}
              {/* ========================================================== */}
              {currentConfig.category === 'pitch' && (
                <div className="space-y-3">
                  
                  {/* Melodic Motif Showcase */}
                  <div className="p-3.5 rounded-xl bg-[#070910] border border-white/10 text-center">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#c49750]">
                        {isDe ? `Klassisches Motiv: ${currentMelody.nameDe}` : `Classical Motif: ${currentMelody.name}`}
                      </span>
                      <span className="text-[10px] font-mono text-[#8c887d]">
                        {isDe ? 'Tonhöhe + Rhythmus einprägen' : 'Memorize pitches & durations'}
                      </span>
                    </div>

                    {/* Note Pearls with Rhythmic Values */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 my-2.5 flex-wrap">
                      {currentMelody.notes.map((item, idx) => {
                        const isPlaying = melodyPlayingIdx === idx;
                        const isSungCompleted = idx < targetSingIdx;
                        const isTargetSing = hasHeardMelody && idx === targetSingIdx;

                        return (
                          <div
                            key={idx}
                            className={`px-3 py-2 rounded-xl flex flex-col items-center justify-center gap-0.5 font-mono text-xs font-bold transition-all relative ${
                              isSungCompleted
                                ? 'bg-emerald-500 text-black shadow-md'
                                : isTargetSing
                                ? 'bg-[#c49750] text-black ring-4 ring-[#ffd56b]/40 scale-105 animate-pulse'
                                : isPlaying
                                ? 'bg-[#ffd56b] text-black scale-110 shadow-lg ring-2 ring-white'
                                : 'bg-[#151926] text-[#dedacf] border border-white/10'
                            }`}
                          >
                            <span className="text-sm">{item.rhythmLabel}</span>
                            <span className="text-[11px]">{item.note}</span>
                            <span className="text-[8px] opacity-75">{item.durationSec}s</span>

                            {/* Vocal Hold Ring */}
                            {isTargetSing && holdProgress > 0 && (
                              <div 
                                className="absolute inset-0 rounded-xl border-2 border-emerald-400 transition-all pointer-events-none"
                                style={{ opacity: holdProgress / 100 }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Play Melody / Reference Start Note */}
                    <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                      <button
                        type="button"
                        onClick={playMelodySequence}
                        disabled={isMelodyPlaying}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#c49750] to-[#ffd56b] text-black font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isDe ? 'Melodie anhören' : 'Listen to Melody'}</span>
                      </button>

                      {hasHeardMelody && (
                        <button
                          type="button"
                          onClick={playStartNoteOnly}
                          className="px-3.5 py-2 rounded-xl bg-[#1a2233] hover:bg-[#232e44] border border-[#38bdf8]/50 text-xs font-mono font-bold text-[#38bdf8] flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <span>🎵</span>
                          <span>{isDe ? `Startnote: ${startNoteName} anhören` : `Hear Start Note: ${startNoteName}`}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Primary Singing View vs Fallback Piano */}
                  {inputMode === 'sing' ? (
                    <div className="p-3.5 rounded-xl bg-[#0b0f18] border border-emerald-500/30 text-center space-y-2.5">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <Mic className="w-4 h-4 text-emerald-400" />
                          <span>{isDe ? `Singe die Töne nach! (Startnote: ${startNoteName})` : `Sing the melody! (Start Note: ${startNoteName})`}</span>
                        </span>

                        <span className="text-[10px] text-[#8c887d]">
                          {isMicActive ? (isDe ? '● Mikrofon aktiv' : '● Mic active') : (isDe ? 'Warte auf Erlaubnis...' : 'Waiting for mic...')}
                        </span>
                      </div>

                      {/* Live Detected Note Pitch Bubble */}
                      <div className="flex items-center justify-center gap-3 py-1">
                        <div className="w-16 h-16 rounded-full bg-[#141824] border-2 border-[#c49750] flex flex-col items-center justify-center shadow-inner">
                          <span className="text-xl font-bold font-mono text-[#fbf9f5]">
                            {livePitch ? livePitch.noteName : '—'}
                          </span>
                          <span className="text-[9px] font-mono text-[#8c887d]">
                            {livePitch ? `${Math.round(livePitch.frequency)} Hz` : (isDe ? 'Singe...' : 'Sing...')}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] font-mono text-[#dedacf]">
                        {isDe 
                          ? `Ziel-Ton: ${currentMelody.notes[targetSingIdx]?.note || ''} · Halte jeden Ton kurz an` 
                          : `Target Note: ${currentMelody.notes[targetSingIdx]?.note || ''} · Hold each pitch briefly`}
                      </p>

                      {/* Fallback Switch to Piano Button */}
                      <div className="pt-2 border-t border-white/5 flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => setInputMode('piano')}
                          className="text-[11px] font-mono text-[#8c887d] hover:text-[#ffd56b] underline cursor-pointer flex items-center gap-1"
                        >
                          <span>🎹</span>
                          <span>{isDe ? 'Mikrofon funktioniert nicht? Auf Klaviertasten spielen' : 'Microphone not working? Play on piano keys'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Fallback 2-Octave Piano Keyboard */
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono px-1 gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[#ffd56b] font-bold">
                            {isDe ? `🎹 Klavier-Modus: Startnote ist ${startNoteName}` : `🎹 Piano Mode: Start note is ${startNoteName}`}
                          </span>
                          <span className="text-[10px] text-[#8c887d] hidden sm:inline">
                            • {isDe ? 'Tasten vorab frei anspielbar' : 'Test keys freely anytime'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setInputMode('sing');
                            enableMicrophone();
                          }}
                          className="text-[10px] text-emerald-400 underline cursor-pointer flex items-center gap-1"
                        >
                          <Mic className="w-3 h-3" />
                          <span>{isDe ? 'Zum Gesang wechseln' : 'Switch to Sing'}</span>
                        </button>
                      </div>

                      {/* Mobile Landscape & Scroll Hint */}
                      <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-[#0e121e] border border-white/5 text-[10px] font-mono text-[#8c887d]">
                        <span>📱 {isDe ? 'Querformat für 2 volle Oktaven empfohlen' : 'Rotate phone to landscape for 2 full octaves'}</span>
                        <span>{isDe ? '← Wischen →' : '← Scroll →'}</span>
                      </div>

                      {/* 2-Octave Keyboard container */}
                      <div className="p-1 rounded-xl bg-[#07090e] border border-white/5 overflow-x-auto no-scrollbar">
                        <div className="relative h-28 sm:h-32 select-none min-w-[540px] sm:min-w-0 w-full px-0.5">
                          <div className="flex w-full h-full">
                            {FULL_2_OCTAVE_WHITE_KEYS.map((key) => {
                              const isStart = hasHeardMelody && key.note === startNoteName;
                              const isTapped = lastTappedKey === key.note;

                              return (
                                <button
                                  key={key.note}
                                  type="button"
                                  onClick={() => handlePianoKeyClick(key)}
                                  className={`flex-1 h-full rounded-b-md border-r border-[#1a1e28] last:border-r-0 flex flex-col justify-end items-center pb-1.5 text-xs font-mono font-bold transition-all relative cursor-pointer ${
                                    isTapped
                                      ? 'bg-[#c49750] text-black translate-y-0.5'
                                      : isStart
                                      ? 'bg-amber-100 ring-2 ring-[#c49750] text-black shadow-md'
                                      : 'bg-[#dedacf] hover:bg-[#fbf9f5] active:bg-[#c49750] text-[#1c1f2b]'
                                  }`}
                                  title={key.note}
                                >
                                  {isStart && (
                                    <span className="absolute top-1 text-[8px] font-bold px-1 py-0.2 bg-[#c49750] text-black rounded">
                                      Start
                                    </span>
                                  )}
                                  <span className="text-[11px] leading-none">{key.label}</span>
                                  <span className="text-[8px] text-[#6e6a60] leading-none mt-0.5">{key.octave}</span>
                                </button>
                              );
                            })}
                          </div>

                          {FULL_2_OCTAVE_BLACK_KEYS.map((key) => {
                            const isTapped = lastTappedKey === key.note;
                            return (
                              <button
                                key={key.note}
                                type="button"
                                onClick={() => handlePianoKeyClick(key)}
                                style={{
                                  left: `calc(${key.leftPercent}% - 2.5%)`,
                                  width: '5%',
                                }}
                                className={`absolute top-0 h-[62%] rounded-b-sm z-10 flex flex-col justify-end items-center pb-1 border border-[#0d0f17] shadow-[0_4px_8px_rgba(0,0,0,0.8)] transition-all cursor-pointer ${
                                  isTapped
                                    ? 'bg-[#c49750] text-black translate-y-0.5'
                                    : 'bg-[#181c28] hover:bg-[#23293a] active:bg-[#c49750] text-[#d6d2c4]'
                                }`}
                                title={key.note}
                              >
                                <span className="text-[8px] font-mono font-semibold leading-none">{key.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* ========================================================== */}
              {/* CATEGORY 4: TEMPO & METER PERCEPTION                       */}
              {/* ========================================================== */}
              {currentConfig.category === 'tempo' && (
                <div className="space-y-3 text-center">
                  {currentRoundIdx === 5 ? (
                    /* Tap Target Tempo */
                    <div className="space-y-3">
                      <div className="inline-block px-3 py-1 rounded-full bg-[#141b2a] border border-[#38bdf8]/40 text-xs font-mono text-[#38bdf8]">
                        {isDe ? `Ziel-Tempo: ${tempoTargetBpm} BPM` : `Target Tempo: ${tempoTargetBpm} BPM`}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          playTapSound(480, 0.05);
                          setTempoTappedTimes(prev => [...prev, performance.now()]);
                        }}
                        className="w-full h-24 rounded-2xl bg-[#151926] hover:bg-[#1d2334] border border-[#38bdf8]/50 text-[#fbf9f5] flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                      >
                        <span className="text-2xl">🥁</span>
                        <span className="text-xs sm:text-sm font-mono font-bold uppercase">
                          {isDe ? 'Tippe 5 Schläge im Tempo (Leertaste / Klick)' : 'Tap 5 beats at tempo (Spacebar / Click)'}
                        </span>
                        <span className="text-[11px] font-mono text-[#8c887d]">
                          {isDe ? `Bisher: ${tempoTappedTimes.length} Schläge` : `Tapped: ${tempoTappedTimes.length} beats`}
                        </span>
                      </button>

                      <button
                        type="button"
                        disabled={tempoTappedTimes.length < 4}
                        onClick={submitTempoTap}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-mono font-bold text-xs uppercase cursor-pointer disabled:opacity-40"
                      >
                        {isDe ? 'Auswerten & Weiter' : 'Evaluate & Continue'}
                      </button>
                    </div>
                  ) : (
                    /* Guess Tempo & Meter */
                    <div className="space-y-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            if (tempoIsPlaying) stopMetronomeAudio();
                            else startMetronomeAudio();
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 cursor-pointer ${
                            tempoIsPlaying ? 'bg-rose-500 text-black' : 'bg-[#c49750] text-black'
                          }`}
                        >
                          {tempoIsPlaying ? <Square className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black" />}
                          <span>{tempoIsPlaying ? (isDe ? 'Stopp' : 'Stop') : (isDe ? 'Puls anhören (Leertaste)' : 'Listen to Pulse (Spacebar)')}</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        {(['2/4', '3/4', '4/4', '6/8']).map((sig) => (
                          <button
                            key={sig}
                            type="button"
                            onClick={() => setTempoSelectedMeter(sig)}
                            className={`py-1.5 px-3 rounded-lg text-xs font-mono font-bold cursor-pointer ${
                              tempoSelectedMeter === sig
                                ? 'bg-[#c49750] text-black ring-2 ring-[#ffd56b]'
                                : 'bg-[#151926] text-[#dedacf] border border-white/10'
                            }`}
                          >
                            {sig}
                          </button>
                        ))}
                      </div>

                      <div className="max-w-xs mx-auto">
                        <div className="flex items-center justify-between text-xs font-mono text-[#dedacf] mb-1">
                          <span>{isDe ? 'Geschätztes Tempo:' : 'Estimated Tempo:'}</span>
                          <span className="font-bold text-[#ffd56b]">{tempoGuessedBpm} BPM</span>
                        </div>
                        <input
                          type="range"
                          min={50}
                          max={170}
                          value={tempoGuessedBpm}
                          onChange={(e) => setTempoGuessedBpm(parseInt(e.target.value, 10))}
                          className="w-full h-2 bg-[#1b2132] rounded-lg appearance-none cursor-pointer accent-[#c49750]"
                        />
                      </div>

                      <button
                        type="button"
                        disabled={!tempoSelectedMeter}
                        onClick={submitTempoGuess}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-mono font-bold text-xs uppercase cursor-pointer disabled:opacity-40"
                      >
                        {isDe ? 'Antwort einreichen' : 'Submit Answer'}
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          </>
        ) : (
          /* ========================================================== */
          /* 4. CONCLUDING RADAR CHART WITH EXPLICIT NUMBERS           */
          /* ========================================================== */
          <div className="space-y-4 animate-fade-in text-center">
            
            {/* Top Score Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#090b12] border border-[#c49750]/60 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#c49750]/15 rounded-full blur-2xl pointer-events-none" />

              <span className="text-[10px] font-mono uppercase tracking-widest text-[#c49750]">
                {isDe ? 'Gesamtergebnis Musik-Einstufung' : 'Comprehensive Diagnostic Rating'}
              </span>

              <div className="flex items-baseline justify-center gap-2 my-1">
                <span className="text-5xl sm:text-6xl font-black font-mono text-[#ffd56b] tracking-tight">
                  {stats.overall}
                </span>
                <span className="text-lg font-mono text-[#8c887d]">/ 100</span>
              </div>

              {/* Conservatoire Rank Tier Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#161a26] border border-[#c49750]/50 text-xs font-mono font-bold text-[#fbf9f5] mt-1 shadow-sm">
                <Award className="w-3.5 h-3.5 text-[#c49750]" />
                <span>
                  {stats.overall >= 88 
                    ? (isDe ? 'Konservatorium Maestro (Virtuose)' : 'Conservatoire Virtuoso (Maestro)') 
                    : stats.overall >= 75 
                    ? (isDe ? 'Fortgeschrittener Lyrischer Künstler' : 'Advanced Lyric Artist') 
                    : stats.overall >= 60 
                    ? (isDe ? 'Solider Ensemblemusiker' : 'Proficient Chamber Musician') 
                    : (isDe ? 'Aufstrebender Gesangsstudent' : 'Emerging Vocalist')}
                </span>
              </div>
            </div>

            {/* SPIDER-WEB RADAR CHART WITH EXPLICIT NUMBERS */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0d101a] border border-white/10 text-center">
              <div className="flex items-center justify-between mb-3 text-left">
                <div>
                  <h5 className="text-sm font-mono font-bold text-[#fbf9f5] uppercase tracking-wider flex items-center gap-1.5">
                    <span>🕸️</span>
                    <span>{isDe ? 'Ganzheitliches Musikerprofil (Web-Diagramm)' : 'Complete Musicianship Web Chart'}</span>
                  </h5>
                  <p className="text-[11px] font-mono text-[#8c887d]">
                    {isDe ? 'Exakte Kennzahlen auf allen 5 Dimensionen (20% – 100%)' : 'Precise metrics across all 5 dimensions (20% – 100%)'}
                  </p>
                </div>
              </div>

              {/* SVG Web Radar Chart */}
              <div className="relative flex items-center justify-center my-3 overflow-visible">
                <svg
                  className="w-72 h-72 sm:w-80 sm:h-80 overflow-visible"
                  viewBox="0 0 320 320"
                >
                  {gridRings.map((ringPercent) => {
                    const points = [0, 1, 2, 3, 4].map(idx => {
                      const pt = getPointCoordinates(idx, 5, ringPercent, radius);
                      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
                    }).join(' ');

                    return (
                      <g key={ringPercent}>
                        <polygon
                          points={points}
                          fill="none"
                          stroke={ringPercent === 100 ? 'rgba(196,151,80,0.5)' : 'rgba(255,255,255,0.08)'}
                          strokeWidth={ringPercent === 100 ? '1.5' : '1'}
                        />
                        <text
                          x={centerX}
                          y={centerY - (ringPercent / 100) * radius + 3}
                          fill="rgba(140,136,125,0.6)"
                          fontSize="8"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {ringPercent}%
                        </text>
                      </g>
                    );
                  })}

                  {[0, 1, 2, 3, 4].map(idx => {
                    const outerPt = getPointCoordinates(idx, 5, 100, radius);
                    return (
                      <line
                        key={idx}
                        x1={centerX}
                        y1={centerY}
                        x2={outerPt.x}
                        y2={outerPt.y}
                        stroke="rgba(255,255,255,0.12)"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                    );
                  })}

                  <polygon
                    points={polygonPointsStr}
                    fill="rgba(196,151,80,0.35)"
                    stroke="#ffd56b"
                    strokeWidth="2.5"
                    className="transition-all duration-700"
                  />

                  {radarAxes.map((axis, i) => {
                    const pt = dataPoints[i];
                    const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                    const labelR = radius + 24;
                    const lx = centerX + labelR * Math.cos(angle);
                    const ly = centerY + labelR * Math.sin(angle);

                    return (
                      <g key={i}>
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="5"
                          fill="#ffd56b"
                          stroke="#121520"
                          strokeWidth="2"
                        />
                        <text
                          x={lx}
                          y={ly}
                          fill="#fbf9f5"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {axis.label}: <tspan fill="#34d399">{axis.score}%</tspan>
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Exact Numerical Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 border-t border-white/10 text-center">
                {radarAxes.map((axis, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-[#080a10] border border-white/5">
                    <span className="text-[10px] font-mono text-[#8c887d] block truncate">{axis.label}</span>
                    <span className="text-base sm:text-lg font-mono font-black text-emerald-400">{axis.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pedagogical Evaluation */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#090b12] border border-[#c49750]/30 text-left space-y-2">
              <h6 className="text-xs font-mono uppercase tracking-wider text-[#ffd56b] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isDe ? 'Pädagogische Gesamteinschätzung' : 'Pedagogical Diagnostic Summary'}</span>
              </h6>
              <p className="text-xs text-[#dedacf] font-serif leading-relaxed">
                {stats.overall >= 85
                  ? (isDe 
                      ? 'Hervorragendes Gehör für Akkordumkehrungen, sicheres Notenlesen im 5-Linien-System und souveräne Gesangsintonation. Du beherrschst die Verbindung aus Gehör, innerem Puls und Stimmführung.' 
                      : 'Exceptional ear for chord inversions, solid staff sight-reading, and confident vocal pitch matching. You demonstrate a unified balance of ear, pulse, and vocal control.')
                  : stats.overall >= 70
                  ? (isDe 
                      ? 'Gutes rhythmisches und harmonisches Gespür. Vertiefe die Erkennung von Sextakkorden (1. Umkehrung) und kantiere die Gesangsmotive noch freier.' 
                      : 'Solid rhythmic and harmonic instincts. Practice distinguishing 1st inversions (6-chords) and lean into your vocal intonation.')
                  : (isDe 
                      ? 'Erfolgversprechende musikalische Grundlagen. Die Ateliers für Harmonien, Rhythmus und Gesangsgedächtnis bieten gezielte Übungen zur Stärkung.' 
                      : 'Promising musical foundation. Daily sessions in the Harmony, Rhythm, and Pitch Memory studios will rapidly develop your inner ear.')}
              </p>
            </div>

            {/* Restart & Links */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleRestartTest}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1a1f2e] hover:bg-[#252c40] border border-[#c49750]/60 text-xs font-mono font-bold text-[#fbf9f5] cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#c49750]" />
                <span>{isDe ? 'Test wiederholen' : 'Retake Assessment'}</span>
              </button>

              {onSwitchTab && (
                <>
                  <button
                    type="button"
                    onClick={() => onSwitchTab('ear-training')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#151a28] hover:bg-[#1e2538] border border-white/20 text-xs font-mono font-bold text-[#fbf9f5] cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>🎹</span>
                    <span>{isDe ? 'Akkord-Studio' : 'Chord Atelier'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSwitchTab('pitch-memory')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c49750] to-[#ffd56b] text-black text-xs font-mono font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span>🎤</span>
                    <span>{isDe ? 'Melodie-Singen' : 'Singing Studio'}</span>
                  </button>
                </>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
