import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, RotateCcw, Trophy, CheckCircle2, Music, Flame, Award, ChevronRight, X, AlertCircle } from 'lucide-react';
import { autoCorrelate, analyzePitch, isPitchMatch, frequencyToMidi, DetectedPitch } from '../utils/pitchDetector';

export type PitchDifficulty = 1 | 2 | 3;
export type PitchInputMode = 'sing' | 'piano';

interface MelodyNote {
  note: string;       // e.g. "C4", "E4", "G4"
  midi: number;       // e.g. 60, 64, 67
  frequency: number;  // in Hz
  durationSec: number;// Rhythmic duration in seconds
}

interface MelodyChallenge {
  id: string;
  name: string;
  nameDe: string;
  meter: string;      // e.g. "3/4 Waltz", "6/8 Sicilienne", "7/8 Asymmetric", "5/4 Flow"
  level: PitchDifficulty;
  notes: MelodyNote[];
  description: string;
  descriptionDe: string;
}

// Authentic musical melodies with varied rhythmic meters (3/4, 6/8, 5/4, 7/8, changing meter)
const MELODIES_LEVEL_1: MelodyChallenge[] = [
  {
    id: 'l1-waltz-arch',
    name: 'Waltz Arch',
    nameDe: 'Walzer-Bogen',
    meter: '3/4',
    level: 1,
    notes: [
      { note: 'C4', midi: 60, frequency: 261.63, durationSec: 0.50 }, // Quarter
      { note: 'E4', midi: 64, frequency: 329.63, durationSec: 0.50 }, // Quarter
      { note: 'G4', midi: 67, frequency: 392.00, durationSec: 0.95 }, // Half note
      { note: 'E4', midi: 64, frequency: 329.63, durationSec: 0.50 }, // Quarter
      { note: 'C4', midi: 60, frequency: 261.63, durationSec: 1.15 }, // Dotted Half
    ],
    description: '3/4 lyrical waltz pulse rising to fifth and resting.',
    descriptionDe: '3/4 Walzer-Melodie, die zur Quinte aufsteigt und sanft zur Ruhe kommt.'
  },
  {
    id: 'l1-sicilienne-lilt',
    name: 'Sicilienne Lilt',
    nameDe: 'Sizilianische Wiege',
    meter: '6/8',
    level: 1,
    notes: [
      { note: 'A3', midi: 57, frequency: 220.00, durationSec: 0.75 }, // Dotted quarter
      { note: 'C4', midi: 60, frequency: 261.63, durationSec: 0.50 }, // Quarter
      { note: 'D4', midi: 62, frequency: 293.66, durationSec: 0.25 }, // Eighth
      { note: 'E4', midi: 64, frequency: 329.63, durationSec: 0.75 }, // Dotted quarter
      { note: 'A3', midi: 57, frequency: 220.00, durationSec: 1.10 }, // Dotted half
    ],
    description: '6/8 lilting Italian barcarolle rhythm.',
    descriptionDe: '6/8 wiegender sizilianischer Barcarole-Rhythmus.'
  },
  {
    id: 'l1-pastoral-call',
    name: 'Pastoral Turn',
    nameDe: 'Pastorale Wendung',
    meter: '3/4',
    level: 1,
    notes: [
      { note: 'F4', midi: 65, frequency: 349.23, durationSec: 0.50 },
      { note: 'G4', midi: 67, frequency: 392.00, durationSec: 0.50 },
      { note: 'A4', midi: 69, frequency: 440.00, durationSec: 0.95 },
      { note: 'G4', midi: 67, frequency: 392.00, durationSec: 0.50 },
      { note: 'F4', midi: 65, frequency: 349.23, durationSec: 1.15 },
    ],
    description: '3/4 French pastoral phrase in warm singing register.',
    descriptionDe: '3/4 französische pastorale Phrase im warmen Gesangsregister.'
  }
];

const MELODIES_LEVEL_2: MelodyChallenge[] = [
  {
    id: 'l2-quint-flow',
    name: 'Five-Beat Horizon',
    nameDe: 'Fünf-Schlag-Horizont',
    meter: '5/4 (3+2)',
    level: 2,
    notes: [
      { note: 'C4', midi: 60, frequency: 261.63, durationSec: 0.48 }, // 1 (quarter)
      { note: 'D4', midi: 62, frequency: 293.66, durationSec: 0.48 }, // 2 (quarter)
      { note: 'E4', midi: 64, frequency: 329.63, durationSec: 0.48 }, // 3 (quarter)
      { note: 'G4', midi: 67, frequency: 392.00, durationSec: 0.90 }, // 4-5 (half)
      { note: 'E4', midi: 64, frequency: 329.63, durationSec: 0.48 }, // 1 (quarter)
      { note: 'D4', midi: 62, frequency: 293.66, durationSec: 0.48 }, // 2 (quarter)
      { note: 'C4', midi: 60, frequency: 261.63, durationSec: 1.20 }, // 3-4-5 (dotted half)
    ],
    description: '5/4 asymmetric meter with 3+2 natural vocal flow.',
    descriptionDe: '5/4 asymmetrisches Metrum mit fließender 3+2 Gesangsführung.'
  },
  {
    id: 'l2-barcarolle-wave',
    name: 'Barcarolle Swell',
    nameDe: 'Gondellied-Woge',
    meter: '6/8',
    level: 2,
    notes: [
      { note: 'G3', midi: 55, frequency: 196.00, durationSec: 0.70 }, // dotted quarter
      { note: 'C4', midi: 60, frequency: 261.63, durationSec: 0.45 }, // quarter
      { note: 'E4', midi: 64, frequency: 329.63, durationSec: 0.25 }, // eighth
      { note: 'G4', midi: 67, frequency: 392.00, durationSec: 0.70 }, // dotted quarter
      { note: 'F4', midi: 65, frequency: 349.23, durationSec: 0.45 }, // quarter
      { note: 'D4', midi: 62, frequency: 293.66, durationSec: 0.25 }, // eighth
      { note: 'C4', midi: 60, frequency: 261.63, durationSec: 1.10 }, // dotted half
    ],
    description: '6/8 rolling cadence with expressive dotted rhythm.',
    descriptionDe: '6/8 wiegende Kadenz mit ausdrucksstarkem punktiertem Rhythmus.'
  },
  {
    id: 'l2-minuet-turn',
    name: 'Classical Minuet',
    nameDe: 'Klassisches Menuett',
    meter: '3/4',
    level: 2,
    notes: [
      { note: 'E4', midi: 64, frequency: 329.63, durationSec: 0.65 }, // dotted quarter
      { note: 'F4', midi: 65, frequency: 349.23, durationSec: 0.25 }, // eighth
      { note: 'G4', midi: 67, frequency: 392.00, durationSec: 0.45 }, // quarter
      { note: 'A4', midi: 69, frequency: 440.00, durationSec: 0.90 }, // half note
      { note: 'G4', midi: 67, frequency: 392.00, durationSec: 0.45 }, // quarter
      { note: 'F4', midi: 65, frequency: 349.23, durationSec: 0.45 }, // quarter
      { note: 'E4', midi: 64, frequency: 329.63, durationSec: 1.10 }, // dotted half
    ],
    description: '3/4 dotted courtly dance rhythm.',
    descriptionDe: '3/4 punktierter höfischer Tanzrhythmus.'
  }
];

const MELODIES_LEVEL_3: MelodyChallenge[] = [
  {
    id: 'l3-balkan-dance',
    name: 'Balkan 7/8 Dance',
    nameDe: 'Balkan 7/8 Tanz',
    meter: '7/8 (3+2+2)',
    level: 3,
    notes: [
      { note: 'A3', midi: 57, frequency: 220.00, durationSec: 0.60 }, // 3 eighths (dotted quarter)
      { note: 'C4', midi: 60, frequency: 261.63, durationSec: 0.40 }, // 2 eighths (quarter)
      { note: 'E4', midi: 64, frequency: 329.63, durationSec: 0.40 }, // 2 eighths (quarter)
      { note: 'G4', midi: 67, frequency: 392.00, durationSec: 0.60 }, // 3 eighths (dotted quarter)
      { note: 'F4', midi: 65, frequency: 349.23, durationSec: 0.40 }, // 2 eighths (quarter)
      { note: 'D4', midi: 62, frequency: 293.66, durationSec: 0.40 }, // 2 eighths (quarter)
      { note: 'E4', midi: 64, frequency: 329.63, durationSec: 0.40 }, // quarter
      { note: 'C4', midi: 60, frequency: 261.63, durationSec: 0.85 }, // long resolution
    ],
    description: '7/8 rhythmic asymmetry (3+2+2) with rich modal resonance.',
    descriptionDe: '7/8 rhythmische Asymmetrie (3+2+2) mit reicher modaler Klangfarbe.'
  },
  {
    id: 'l3-changing-meter',
    name: 'Ravel Arabesque (3/4 → 4/4)',
    nameDe: 'Ravel Arabeske (3/4 → 4/4)',
    meter: '3/4 → 4/4',
    level: 3,
    notes: [
      { note: 'C4', midi: 60, frequency: 261.63, durationSec: 0.45 },
      { note: 'Eb4', midi: 63, frequency: 311.13, durationSec: 0.45 },
      { note: 'G4', midi: 67, frequency: 392.00, durationSec: 0.90 },
      { note: 'Ab4', midi: 68, frequency: 415.30, durationSec: 0.35 },
      { note: 'G4', midi: 67, frequency: 392.00, durationSec: 0.35 },
      { note: 'F4', midi: 65, frequency: 349.23, durationSec: 0.35 },
      { note: 'Eb4', midi: 63, frequency: 311.13, durationSec: 0.35 },
      { note: 'D4', midi: 62, frequency: 293.66, durationSec: 0.50 },
      { note: 'C4', midi: 60, frequency: 261.63, durationSec: 1.15 },
    ],
    description: 'Metric modulation from 3/4 lilt into expanding 4/4 cantabile.',
    descriptionDe: 'Metrischer Wechsel vom 3/4 Wiegen in ein weitgespanntes 4/4 Kantabile.'
  },
  {
    id: 'l3-tresillo-nocturne',
    name: 'Tresillo Impression (3+3+2)',
    nameDe: 'Tresillo-Impression (3+3+2)',
    meter: '8/8 (3+3+2)',
    level: 3,
    notes: [
      { note: 'F#4', midi: 66, frequency: 369.99, durationSec: 0.55 }, // dotted quarter (3)
      { note: 'G4', midi: 67, frequency: 392.00, durationSec: 0.55 },  // dotted quarter (3)
      { note: 'A4', midi: 69, frequency: 440.00, durationSec: 0.38 },  // quarter (2)
      { note: 'F#4', midi: 66, frequency: 369.99, durationSec: 0.38 },
      { note: 'D4', midi: 62, frequency: 293.66, durationSec: 0.38 },
      { note: 'E4', midi: 64, frequency: 329.63, durationSec: 0.38 },
      { note: 'F#4', midi: 66, frequency: 369.99, durationSec: 0.55 },
      { note: 'G4', midi: 67, frequency: 392.00, durationSec: 0.38 },
      { note: 'E4', midi: 64, frequency: 329.63, durationSec: 0.38 },
      { note: 'D4', midi: 62, frequency: 293.66, durationSec: 0.95 },
    ],
    description: '10-tone Fauré-inspired phrase over syncopated cross-rhythm.',
    descriptionDe: '10-tönige Fauré-Melodie über einem synkopierten Rhythmus.'
  }
];

// Piano Keyboard definitions covering the full range (G3 to C5)
interface PianoKeyDef {
  note: string;       // e.g. "C4"
  label: string;      // e.g. "C"
  octave: number;
  midi: number;
  freq: number;
  isBlack: boolean;
  sharpLabel?: string;
}

const PIANO_WHITE_KEYS: PianoKeyDef[] = [
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

interface PianoBlackKeyDef extends PianoKeyDef {
  leftPercent: number;
}

// 15 white keys => each key is 6.666% wide
const PIANO_BLACK_KEYS: PianoBlackKeyDef[] = [
  { note: 'C#3', label: 'C♯', sharpLabel: 'C♯/D♭', octave: 3, midi: 49, freq: 138.59, isBlack: true, leftPercent: 6.666 },
  { note: 'D#3', label: 'D♯', sharpLabel: 'D♯/E♭', octave: 3, midi: 51, freq: 155.56, isBlack: true, leftPercent: 13.333 },
  { note: 'F#3', label: 'F♯', sharpLabel: 'F♯/G♭', octave: 3, midi: 54, freq: 185.00, isBlack: true, leftPercent: 26.666 },
  { note: 'G#3', label: 'G♯', sharpLabel: 'G♯/A♭', octave: 3, midi: 56, freq: 207.65, isBlack: true, leftPercent: 33.333 },
  { note: 'A#3', label: 'A♯', sharpLabel: 'A♯/B♭', octave: 3, midi: 58, freq: 233.08, isBlack: true, leftPercent: 40.000 },
  { note: 'C#4', label: 'C♯', sharpLabel: 'C♯/D♭', octave: 4, midi: 61, freq: 277.18, isBlack: true, leftPercent: 53.333 },
  { note: 'D#4', label: 'D♯', sharpLabel: 'D♯/E♭', octave: 4, midi: 63, freq: 311.13, isBlack: true, leftPercent: 60.000 },
  { note: 'F#4', label: 'F♯', sharpLabel: 'F♯/G♭', octave: 4, midi: 66, freq: 369.99, isBlack: true, leftPercent: 73.333 },
  { note: 'G#4', label: 'G♯', sharpLabel: 'G♯/A♭', octave: 4, midi: 68, freq: 415.30, isBlack: true, leftPercent: 80.000 },
  { note: 'A#4', label: 'A♯', sharpLabel: 'A♯/B♭', octave: 4, midi: 70, freq: 466.16, isBlack: true, leftPercent: 86.666 },
];

export interface PitchLeaderboardEntry {
  id: string;
  name: string;
  score: number;
  streak: number;
  difficulty: PitchDifficulty;
  date: string;
}

interface PitchMemoryStudioProps {
  playFrequencies: (freqs: number[], soundMode: 'piano' | 'synth', arpeggiate?: boolean) => void;
  stopAudio: (immediate?: boolean) => void;
  isDe?: boolean;
}

type ExercisePhase = 'IDLE' | 'PLAYING_PROMPT' | 'LISTENING_SING' | 'SUCCESS_ROUND';

export const PitchMemoryStudio: React.FC<PitchMemoryStudioProps> = ({
  playFrequencies,
  stopAudio,
  isDe = false,
}) => {
  const [difficulty, setDifficulty] = useState<PitchDifficulty>(1);
  const [phase, setPhase] = useState<ExercisePhase>('IDLE');
  const [currentMelody, setCurrentMelody] = useState<MelodyChallenge>(MELODIES_LEVEL_1[0]);
  const [activeNoteIdx, setActiveNoteIdx] = useState<number>(-1);
  const [targetSingIdx, setTargetSingIdx] = useState<number>(0);

  // Input Mode: 'sing' (microphone) or 'piano' (interactive virtual grand piano)
  const [inputMode, setInputMode] = useState<PitchInputMode>('sing');

  // Transposition Offset (in semitones): supports comfortable singing in ANY key/vocal range!
  const [transpositionOffset, setTranspositionOffset] = useState<number | null>(null);
  const transpositionOffsetRef = useRef<number | null>(null);

  // Live pitch state for Sing Mode
  const [livePitch, setLivePitch] = useState<DetectedPitch | null>(null);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [micError, setMicError] = useState<string | null>(null);
  const [holdProgress, setHoldProgress] = useState<number>(0);

  // Piano feedback state for Piano Mode
  const [pianoFeedback, setPianoFeedback] = useState<{ isCorrect: boolean } | null>(null);
  const [lastTappedKey, setLastTappedKey] = useState<string | null>(null);

  // Scoring
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<PitchLeaderboardEntry[]>([]);
  const [userName, setUserName] = useState<string>('Memory');

  // Audio Context & Mic Stream refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const melodyPlayTimerRef = useRef<NodeJS.Timeout[]>([]);
  const holdStartTimeRef = useRef<number | null>(null);

  // Load Leaderboard on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('beyondMagic_pitchMemoryScores');
      if (stored) {
        setLeaderboard(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // Pick random melody matching difficulty
  const pickMelody = useCallback((diff: PitchDifficulty): MelodyChallenge => {
    const pool = diff === 1 ? MELODIES_LEVEL_1 : diff === 2 ? MELODIES_LEVEL_2 : MELODIES_LEVEL_3;
    const randomIdx = Math.floor(Math.random() * pool.length);
    return pool[randomIdx];
  }, []);

  // Set new round with rhythmic note scheduling
  const startNewChallenge = useCallback((diff: PitchDifficulty = difficulty) => {
    melodyPlayTimerRef.current.forEach(clearTimeout);
    melodyPlayTimerRef.current = [];
    stopAudio(true);

    const mel = pickMelody(diff);
    setCurrentMelody(mel);
    setActiveNoteIdx(-1);
    setTargetSingIdx(0);
    transpositionOffsetRef.current = null;
    setTranspositionOffset(null);
    setHoldProgress(0);
    setPianoFeedback(null);
    setPhase('PLAYING_PROMPT');

    // Sequential note playback strictly respecting each note's rhythmic duration
    let accumulatedMs = 150;
    mel.notes.forEach((item, idx) => {
      const tId = setTimeout(() => {
        setActiveNoteIdx(idx);
        playFrequencies([item.frequency], 'piano', false);
      }, accumulatedMs);
      melodyPlayTimerRef.current.push(tId);
      accumulatedMs += item.durationSec * 1000 + 70;
    });

    // When prompt playback finishes, transition to Sing/Play response phase
    const endTId = setTimeout(() => {
      setActiveNoteIdx(-1);
      setPhase('LISTENING_SING');
    }, accumulatedMs + 200);
    melodyPlayTimerRef.current.push(endTId);
  }, [difficulty, pickMelody, playFrequencies, stopAudio]);

  // Handle Switch Difficulty
  const handleSwitchDifficulty = (diff: PitchDifficulty) => {
    setDifficulty(diff);
    startNewChallenge(diff);
  };

  // Resilient Microphone stream start with multi-stage fallback
  const enableMicrophone = async () => {
    setMicError(null);
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('DEVICE_UNSUPPORTED');
      }

      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: false,
            autoGainControl: false,
          }
        });
      } catch (firstErr) {
        console.warn('Initial getUserMedia constraints failed, retrying plain { audio: true }', firstErr);
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      if (!stream) throw new Error('NO_STREAM');
      micStreamRef.current = stream;

      const source = audioCtxRef.current.createMediaStreamSource(stream);
      const analyser = audioCtxRef.current.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsMicActive(true);
      setInputMode('sing');
    } catch (err: unknown) {
      console.warn('Microphone permission error:', err);
      const isIframe = window.self !== window.top;
      const errName = (err as Error)?.name || '';

      let friendlyMsg = isDe 
        ? 'Mikrofonzugriff nicht möglich.' 
        : 'Microphone access is unavailable.';

      if (errName === 'NotAllowedError' || errName === 'SecurityError') {
        if (isIframe) {
          friendlyMsg = isDe
            ? 'Firefox blockiert Mikrofone in eingebetteten Vorschau-Frames. Nutze direkt den Klaviermodus 🎹 oder öffne den Tab separat.'
            : 'Firefox security restricts microphone access inside embedded iframes. Seamlessly use Piano Mode 🎹 below, or open the app in a new tab!';
        } else {
          friendlyMsg = isDe
            ? 'Mikrofonberechtigung abgelehnt. Wechsle einfach zum Klaviermodus 🎹, um ohne Mikrofon zu spielen.'
            : 'Microphone permission was denied. You can play flawlessly using Piano Mode 🎹 below!';
        }
      } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        friendlyMsg = isDe
          ? 'Kein Audio-Eingabegerät gefunden. Nutze den Klaviermodus 🎹.'
          : 'No microphone hardware found. Use Piano Mode 🎹 below.';
      }

      setMicError(friendlyMsg);
      setInputMode('piano');
    }
  };

  // Close Microphone
  const disableMicrophone = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(t => t.stop());
      micStreamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsMicActive(false);
    setLivePitch(null);
  };

  // Complete a successful note match (shared by vocal and piano keyboard)
  const handleNoteSuccess = useCallback(() => {
    if (targetSingIdx + 1 < currentMelody.notes.length) {
      setTargetSingIdx(prev => prev + 1);
    } else {
      // Entire melody completed successfully!
      setPhase('SUCCESS_ROUND');
      const addedScore = 180 * difficulty + (streak + 1) * 30;
      setScore(prev => prev + addedScore);
      setStreak(prev => {
        const next = prev + 1;
        setBestStreak(b => Math.max(b, next));
        return next;
      });
    }
  }, [currentMelody, difficulty, streak, targetSingIdx]);

  // Handle Piano Key Tap / Click
  const handlePianoKeyPress = (key: PianoKeyDef) => {
    // Play grand piano tone for the tapped key unconditionally so users can freely explore the keyboard beforehand!
    playFrequencies([key.freq], 'piano', false);
    setLastTappedKey(key.note);
    setTimeout(() => setLastTappedKey(null), 300);

    if (phase !== 'LISTENING_SING') return;

    const target = currentMelody.notes[targetSingIdx];
    if (!target) return;

    // Relative Melodic Memory with transposition support:
    // If first note (targetSingIdx === 0): ANY key tapped by user is accepted and sets the transposition!
    if (targetSingIdx === 0) {
      const offset = key.midi - currentMelody.notes[0].midi;
      transpositionOffsetRef.current = offset;
      setTranspositionOffset(offset);
      setPianoFeedback({ isCorrect: true });
      setTimeout(() => setPianoFeedback(null), 600);
      handleNoteSuccess();
    } else {
      // Subsequent notes: must match the melodic interval from note 0 (transposed into user's key)
      const activeOffset = transpositionOffsetRef.current ?? transpositionOffset ?? 0;
      const originalInterval = currentMelody.notes[targetSingIdx].midi - currentMelody.notes[0].midi;
      const expectedPitchClass = ((currentMelody.notes[0].midi + activeOffset + originalInterval) % 12 + 12) % 12;
      const keyPitchClass = ((key.midi % 12) + 12) % 12;

      if (keyPitchClass === expectedPitchClass) {
        setPianoFeedback({ isCorrect: true });
        setTimeout(() => setPianoFeedback(null), 600);
        handleNoteSuccess();
      } else {
        setPianoFeedback({ isCorrect: false });
        setTimeout(() => setPianoFeedback(null), 800);
      }
    }
  };

  // Live real-time pitch detection loop (when in Sing mode)
  useEffect(() => {
    if (!isMicActive || phase !== 'LISTENING_SING' || inputMode !== 'sing') {
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

        const activeOffset = transpositionOffsetRef.current ?? transpositionOffset ?? 0;
        let isMatch = false;
        if (targetSingIdx === 0) {
          // Note 0: ANY stable, clearly sung pitch is accepted as the starting tone!
          // This sets the transposition for the user's vocal range!
          isMatch = centsDeviation <= 45;
        } else {
          // Note i > 0: Relative melodic memory — matches the melody interval transposed by user's key!
          const originalInterval = currentMelody.notes[targetSingIdx].midi - currentMelody.notes[0].midi;
          const expectedPitchClass = ((currentMelody.notes[0].midi + activeOffset + originalInterval) % 12 + 12) % 12;
          const detectedPitchClass = ((roundedMidi % 12) + 12) % 12;
          isMatch = detectedPitchClass === expectedPitchClass && centsDeviation <= 45;
        }

        if (isMatch) {
          if (!holdStartTimeRef.current) {
            holdStartTimeRef.current = performance.now();
          }
          const elapsed = performance.now() - holdStartTimeRef.current;
          const progress = Math.min(100, Math.round((elapsed / 220) * 100));
          setHoldProgress(progress);

          if (elapsed >= 220) {
            holdStartTimeRef.current = null;
            setHoldProgress(0);
            if (targetSingIdx === 0 && transpositionOffsetRef.current === null) {
              const offset = roundedMidi - currentMelody.notes[0].midi;
              transpositionOffsetRef.current = offset;
              setTranspositionOffset(offset);
            }
            handleNoteSuccess();
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
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isMicActive, phase, inputMode, currentMelody, targetSingIdx, transpositionOffset, handleNoteSuccess]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      melodyPlayTimerRef.current.forEach(clearTimeout);
      disableMicrophone();
    };
  }, []);

  // Save score to leaderboard
  const saveScoreToLeaderboard = () => {
    if (score <= 0) return;
    const entry: PitchLeaderboardEntry = {
      id: Date.now().toString(),
      name: userName.trim() || (isDe ? 'Gedächtnis' : 'Memory'),
      score,
      streak: bestStreak,
      difficulty,
      date: new Date().toLocaleDateString(isDe ? 'de-DE' : 'en-US', { month: 'short', day: 'numeric' })
    };
    const updated = [entry, ...leaderboard].sort((a, b) => b.score - a.score).slice(0, 10);
    setLeaderboard(updated);
    try {
      localStorage.setItem('beyondMagic_pitchMemoryScores', JSON.stringify(updated));
    } catch {}
  };

  const handleNextRound = () => {
    startNewChallenge(difficulty);
  };

  const handleReplayPrompt = () => {
    startNewChallenge(difficulty);
  };

  // Keyboard shortcut: Spacebar to replay or advance
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (phase === 'SUCCESS_ROUND') {
          handleNextRound();
        } else if (phase === 'LISTENING_SING') {
          handleReplayPrompt();
        } else if (phase === 'IDLE') {
          startNewChallenge();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  return (
    <div id="pitch-memory-console" className="w-full max-w-xl mx-auto select-none">
      {/* Console Frame */}
      <div className="relative rounded-2xl bg-[#121520] border border-[#2b3347] shadow-[0_12px_45px_rgba(0,0,0,0.6)] p-3 sm:p-5 overflow-hidden">
        
        {/* Mood Ambient Glow */}
        <div 
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-20 transition-colors duration-500"
          style={{ backgroundColor: phase === 'SUCCESS_ROUND' ? '#10b981' : phase === 'LISTENING_SING' ? '#a78bfa' : '#c49750' }}
        />

        {/* 1. Header Bar: Level Tabs + Top 10 High Scores */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 pb-2.5 mb-2.5 border-b border-white/10 w-full">
          <div className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-0">
            {([1, 2, 3] as PitchDifficulty[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => handleSwitchDifficulty(lvl)}
                className={`flex-1 py-1.5 px-1.5 sm:px-2 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  difficulty === lvl
                    ? 'bg-gradient-to-r from-[#c49750] to-[#e6b769] text-black font-bold shadow-md shadow-[#c49750]/20'
                    : 'bg-[#0e111a] text-[#8c887d] hover:text-[#fbf9f5] border border-white/5 hover:border-white/10'
                }`}
                title={lvl === 1 ? 'Level 1' : lvl === 2 ? 'Level 2' : 'Level 3'}
              >
                <span className="text-xs shrink-0">{lvl === 1 ? '🌱' : lvl === 2 ? '🌿' : '🌳'}</span>
                <span className="font-bold text-[11px] sm:text-xs whitespace-nowrap">
                  <span className="sm:hidden">{isDe ? `St.${lvl}` : `L${lvl}`}</span>
                  <span className="hidden sm:inline">{lvl === 1 ? (isDe ? 'Stufe 1' : 'Level 1') : lvl === 2 ? (isDe ? 'Stufe 2' : 'Level 2') : (isDe ? 'Stufe 3' : 'Level 3')}</span>
                </span>
              </button>
            ))}
          </div>

          {/* Top 10 Button */}
          <button
            type="button"
            onClick={() => setShowLeaderboard(true)}
            className="shrink-0 ml-1.5 sm:ml-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#181c28] hover:bg-[#222738] border border-[#c49750]/60 text-[#fbf9f5] flex items-center gap-1.5 text-xs font-mono transition-all cursor-pointer shadow-sm group"
            title={isDe ? 'Top 10 Bestenliste' : 'Top 10 High Scores'}
          >
            <Trophy className="w-3.5 h-3.5 text-[#c49750] group-hover:scale-110 transition-transform shrink-0" />
            <span className="font-semibold text-[#f5eedf] text-[11px] sm:text-xs whitespace-nowrap">Top 10</span>
          </button>
        </div>

        {/* 2. HUD Bar: Stats & Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2 border-b border-white/10 text-xs font-mono">
          {/* Left: Streak & Points */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="px-2 py-1 rounded-lg bg-[#0b0d14] border border-white/10 flex items-center gap-1 text-[11px]">
              <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'text-[#f59e0b] animate-bounce' : 'text-[#6e6a60]'}`} />
              <span className="text-[#8c887d]">{isDe ? 'Serie' : 'Streak'}</span>
              <span className="font-bold text-[#fbf9f5]">{streak}</span>
            </div>

            <div className="px-2 py-1 rounded-lg bg-[#0b0d14] border border-white/10 flex items-center gap-1 text-[11px]">
              <Award className="w-3.5 h-3.5 text-[#c49750]" />
              <span className="text-[#8c887d]">{isDe ? 'Punkte' : 'Score'}</span>
              <span className="font-bold text-[#fbf9f5]">{score}</span>
            </div>
          </div>

          {/* Right: Dual Mode Switcher (Sing 🎤 vs Piano 🎹) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex items-center p-0.5 rounded-xl bg-[#0a0c12] border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setInputMode('sing');
                  if (!isMicActive) enableMicrophone();
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                  inputMode === 'sing'
                    ? 'bg-gradient-to-r from-[#c49750] to-[#e6b769] text-black font-bold shadow-sm'
                    : 'text-[#8c887d] hover:text-white'
                }`}
                title={isDe ? 'Über Mikrofon singen' : 'Sing with microphone'}
              >
                <Mic className="w-3 h-3" />
                <span className="text-[11px]">{isDe ? 'Singen 🎤' : 'Sing 🎤'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setInputMode('piano');
                  setMicError(null);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                  inputMode === 'piano'
                    ? 'bg-gradient-to-r from-[#c49750] to-[#e6b769] text-black font-bold shadow-sm'
                    : 'text-[#8c887d] hover:text-white'
                }`}
                title={isDe ? 'Auf Klaviertasten spielen' : 'Play on piano keys'}
              >
                <span className="text-xs">🎹</span>
                <span className="text-[11px]">{isDe ? 'Klavier 🎹' : 'Piano 🎹'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setScore(0);
                setStreak(0);
                startNewChallenge(difficulty);
              }}
              className="p-1 rounded-lg text-[#8c887d] hover:text-white bg-[#0b0d14] border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              title={isDe ? 'Neu starten' : 'Restart'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Resilient Error & Browser Fallback Notice */}
        {micError && (
          <div className="p-2.5 mb-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 animate-fade-in">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="leading-tight">
                <span className="font-semibold text-amber-300">
                  {isDe ? 'Mikrofon-Hinweis:' : 'Microphone Notice:'}
                </span>{' '}
                <span>{micError}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => {
                  setInputMode('piano');
                  setMicError(null);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#c49750] text-black font-bold text-[11px] hover:bg-[#ffd56b] transition-colors cursor-pointer"
              >
                {isDe ? 'Zu Klavier wechseln 🎹' : 'Switch to Piano 🎹'}
              </button>
              <button
                type="button"
                onClick={() => setMicError(null)}
                className="text-amber-400 hover:text-white p-1 text-sm leading-none"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* 3. Pure Auditory Memory Track: Acoustic Resonance Pearls (No numbers, no written notes!) */}
        <div className="my-2.5 p-3.5 sm:p-5 rounded-xl bg-[#0c0e15] border border-white/10 text-center">
          
          <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-[#8c887d]">
            <span className="text-[#c49750] font-semibold flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" />
              <span>{isDe ? currentMelody.nameDe : currentMelody.name}</span>
              <span className="px-1.5 py-0.5 rounded bg-[#181c28] border border-white/10 text-[10px] text-[#dedacf]">
                {currentMelody.meter}
              </span>
            </span>

            <span className="text-[11px]">
              {phase === 'PLAYING_PROMPT' ? (isDe ? '● Höre dem Rhythmus und Klang zu...' : '● Listening to the phrase...') :
               phase === 'LISTENING_SING' ? (
                 inputMode === 'sing' 
                   ? (isDe ? '🎤 Singe jetzt aus dem Gedächtnis nach!' : '🎤 Sing it back from memory!') 
                   : (isDe ? '🎹 Spiele die Töne aus dem Gedächtnis!' : '🎹 Play it back from memory!')
               ) :
               phase === 'SUCCESS_ROUND' ? (isDe ? '✨ Perfekt gemeistert!' : '✨ Recalled flawlessly!') :
               (isDe ? 'Bereit zum Anhören' : 'Ready to listen')}
            </span>
          </div>

          {/* Minimalist Acoustic Resonance Pearls (No numbers, no letters!) */}
          <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 my-3.5 flex-wrap">
            {currentMelody.notes.map((_, idx) => {
              const isPromptPlaying = activeNoteIdx === idx;
              const isSingTarget = phase === 'LISTENING_SING' && targetSingIdx === idx;
              const isSingCompleted = phase === 'SUCCESS_ROUND' || (phase === 'LISTENING_SING' && idx < targetSingIdx);

              return (
                <div key={idx} className="relative flex items-center justify-center">
                  <div
                    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-200 relative ${
                      isSingCompleted
                        ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.6)] scale-105'
                        : isSingTarget
                        ? 'bg-gradient-to-tr from-[#c49750] to-[#ffd56b] ring-4 ring-[#c49750]/40 scale-110 animate-pulse'
                        : isPromptPlaying
                        ? 'bg-amber-400 text-black scale-125 shadow-[0_0_25px_rgba(251,191,36,0.85)]'
                        : 'bg-[#181c28] border border-white/10 shadow-inner'
                    }`}
                  >
                    {isSingCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-black" />
                    ) : isPromptPlaying ? (
                      <div className="w-2.5 h-2.5 rounded-full bg-black/70 animate-ping" />
                    ) : (
                      <div className={`w-1.5 h-1.5 rounded-full ${isSingTarget ? 'bg-black/60' : 'bg-white/20'}`} />
                    )}

                    {/* Hold Progress Ring on Active Singing Note */}
                    {isSingTarget && inputMode === 'sing' && holdProgress > 0 && (
                      <div 
                        className="absolute inset-0 rounded-full border-2 border-emerald-400 transition-all pointer-events-none"
                        style={{ opacity: holdProgress / 100 }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Transposition & Relative Recall Indicator */}
          {transpositionOffset !== null && (
            <div className="flex items-center justify-center mb-2 animate-fade-in">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181c28] border border-[#c49750]/50 text-[11px] font-mono text-[#ffd56b] shadow-sm">
                <span>🎵</span>
                <span>
                  {((transpositionOffset % 12) + 12) % 12 === 0
                    ? (isDe ? 'In Originaltonhöhe' : 'Original Key Pitch')
                    : (isDe 
                        ? `Transponiert (${transpositionOffset > 0 ? '+' : ''}${transpositionOffset} Halbtöne)` 
                        : `Transposed (${transpositionOffset > 0 ? '+' : ''}${transpositionOffset} st)`)}
                </span>
                <span className="text-[#8c887d] text-[10px]">
                  • {isDe ? 'Gedächtnis aktiv' : 'Memory active'}
                </span>
              </span>
            </div>
          )}

          <p className="text-[11px] font-serif italic text-[#dedacf]/80 max-w-sm mx-auto">
            “{isDe ? currentMelody.descriptionDe : currentMelody.description}”
          </p>
        </div>

        {/* 4. Active Input Area: Voice Tuner OR Interactive Grand Piano */}
        {inputMode === 'sing' ? (
          /* Mic Sing Mode View */
          <div className="p-3 rounded-xl bg-[#0b0d14] border border-white/5 text-center mb-3">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#8c887d] mb-1.5">
              <span>{isDe ? 'Echtzeit-Stimmerkennung:' : 'Real-Time Voice Tuner:'}</span>
              <span className="text-[#a78bfa]">
                {isMicActive ? (
                  livePitch 
                    ? (isDe ? 'Ton erkannt (oktavenunabhängig)' : 'Pitch detected (octave-free)') 
                    : (isDe ? 'Warte auf Gesang...' : 'Listening for vocal sound...')
                ) : (
                  isDe ? 'Mikrofon noch inaktiv' : 'Microphone inactive'
                )}
              </span>
            </div>

            {/* Visual Pitch Display */}
            <div className="flex items-center justify-center gap-3 py-1.5">
              <div className="w-14 h-14 rounded-full bg-[#141824] border border-[#c49750]/40 flex flex-col items-center justify-center">
                <span className="text-lg font-bold font-mono text-[#fbf9f5]">
                  {livePitch ? livePitch.noteName : '—'}
                </span>
                <span className="text-[9px] font-mono text-[#8c887d]">
                  {livePitch ? `${Math.round(livePitch.frequency)} Hz` : ''}
                </span>
              </div>

              {/* Intonation Needle Bar (-50 cents to +50 cents) */}
              <div className="flex-1 max-w-xs">
                <div className="flex items-center justify-between text-[9px] font-mono text-[#6e6a60] mb-0.5">
                  <span>♭ Flat (-50¢)</span>
                  <span className="text-emerald-400 font-bold">In Tune</span>
                  <span>Sharp (+50¢) ♯</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#181c28] relative overflow-hidden">
                  <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-emerald-500/80 -translate-x-1/2" />
                  {livePitch && (
                    <div
                      className="absolute top-0 bottom-0 w-3 rounded-full transition-all duration-75"
                      style={{
                        left: `calc(50% + ${(livePitch.cents / 50) * 45}%)`,
                        transform: 'translateX(-50%)',
                        backgroundColor: Math.abs(livePitch.cents) <= 20 ? '#10b981' : Math.abs(livePitch.cents) <= 40 ? '#f59e0b' : '#f43f5e',
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Quick Helper Button to switch to Piano Mode */}
            {!isMicActive && (
              <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={enableMicrophone}
                  className="px-3 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isDe ? 'Mikrofon aktivieren' : 'Activate Microphone'}</span>
                </button>
                <span className="text-xs text-[#6e6a60]">{isDe ? 'oder' : 'or'}</span>
                <button
                  type="button"
                  onClick={() => setInputMode('piano')}
                  className="px-3 py-1.5 rounded-lg bg-[#181c28] hover:bg-[#222738] border border-white/10 text-[#dedacf] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>🎹</span>
                  <span>{isDe ? 'Auf Klaviertasten spielen' : 'Play on Piano Keys'}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Piano Keyboard Mode View (2-Octave Panoramic Keyboard C3 to C5) */
          <div className="p-2 sm:p-3 rounded-xl bg-[#0b0d14] border border-white/5 mb-3">
            {phase === 'LISTENING_SING' ? (
              <div className="flex items-center justify-between text-[11px] font-mono mb-2 px-1">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span>🎵</span>
                    <span>{isDe ? `Startnote: ${currentMelody.notes[0].note}` : `Start Note: ${currentMelody.notes[0].note}`}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => playFrequencies([currentMelody.notes[0].frequency], 'piano', false)}
                    className="px-2 py-0.5 rounded-lg bg-[#181c28] hover:bg-[#23293a] border border-[#c49750]/50 text-[#ffd56b] text-[10px] cursor-pointer transition-colors"
                    title={isDe ? 'Startnote nochmals anhören' : 'Hear start note again'}
                  >
                    <span>{isDe ? 'Anhören 🔊' : 'Hear Note 🔊'}</span>
                  </button>
                </div>
                <span className="text-[#a09c91] text-[10px]">
                  {isDe ? 'Töne & Rhythmus nachspielen' : 'Recall notes & rhythm'}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between text-[10px] font-mono text-[#8c887d] mb-1.5 px-1">
                <span>{isDe ? 'Interaktives 2-Oktaven-Konzertklavier (C3–C5):' : 'Interactive 2-Octave Grand Piano (C3–C5):'}</span>
                <span className="text-[#ffd56b]">
                  {isDe ? '🎹 Tasten vorab frei ausprobieren!' : '🎹 Feel free to try keys anytime!'}
                </span>
              </div>
            )}

            {/* Mobile landscape tip */}
            <p className="text-[10px] font-mono text-[#8c887d] italic sm:hidden text-center mb-1">
              {isDe 
                ? '📱 Tipp: Drehe das Smartphone ins Querformat für das 2-Oktaven-Panorama!' 
                : '📱 Tip: Rotate phone to landscape for the full 2-octave panoramic keyboard!'}
            </p>

            {/* Piano Keyboard Container with Horizontal Scroll on Narrow Screens */}
            <div className="p-1 rounded-xl bg-[#07090e] border border-white/5 overflow-x-auto no-scrollbar">
              <div className="relative h-28 sm:h-32 select-none min-w-[540px] sm:min-w-0 w-full px-0.5">
                
                {/* White Keys Row */}
                <div className="flex w-full h-full">
                  {PIANO_WHITE_KEYS.map((key) => {
                    const isLastTapped = lastTappedKey === key.note;
                    const isStartKey = phase === 'LISTENING_SING' && key.note === currentMelody.notes[0].note;

                    return (
                      <button
                        key={key.note}
                        type="button"
                        onClick={() => handlePianoKeyPress(key)}
                        className={`flex-1 h-full rounded-b-md border-r border-[#1a1e28] last:border-r-0 flex flex-col justify-end items-center pb-1.5 text-xs font-mono font-bold transition-all duration-75 relative cursor-pointer ${
                          isLastTapped
                            ? 'bg-[#c49750] text-black shadow-inner translate-y-0.5'
                            : isStartKey
                            ? 'bg-amber-100 ring-2 ring-[#c49750] text-black shadow-md'
                            : 'bg-[#dedacf] hover:bg-[#fbf9f5] active:bg-[#c49750] text-[#1c1f2b]'
                        }`}
                        title={key.note}
                      >
                        {isStartKey && (
                          <span className="absolute top-1 text-[8px] font-bold px-1 py-0.2 bg-[#c49750] text-black rounded">
                            Start
                          </span>
                        )}
                        <span className="text-[11px] sm:text-xs leading-none">{key.label}</span>
                        <span className="text-[8px] text-[#6e6a60] leading-none mt-0.5">{key.octave}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Black Keys Layer */}
                {PIANO_BLACK_KEYS.map((key) => {
                  const isLastTapped = lastTappedKey === key.note;

                  return (
                    <button
                      key={key.note}
                      type="button"
                      onClick={() => handlePianoKeyPress(key)}
                      style={{
                        left: `calc(${key.leftPercent}% - 2.5%)`,
                        width: '5%',
                      }}
                      className={`absolute top-0 h-[62%] rounded-b-sm z-10 flex flex-col justify-end items-center pb-1 border border-[#0d0f17] shadow-[0_4px_8px_rgba(0,0,0,0.8)] transition-all duration-75 cursor-pointer ${
                        isLastTapped
                          ? 'bg-[#c49750] text-black translate-y-0.5'
                          : 'bg-[#181c28] hover:bg-[#23293a] active:bg-[#c49750] text-[#d6d2c4]'
                      }`}
                      title={key.sharpLabel || key.note}
                    >
                      <span className="text-[8px] sm:text-[9px] font-mono font-semibold leading-none">{key.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ear Feedback Toast */}
            {pianoFeedback && (
              <div 
                className={`mt-2 py-1 px-2.5 rounded-lg text-[11px] font-mono flex items-center justify-center gap-1.5 animate-fade-in ${
                  pianoFeedback.isCorrect 
                    ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300' 
                    : 'bg-rose-950/70 border border-rose-500/40 text-rose-300'
                }`}
              >
                {pianoFeedback.isCorrect ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isDe ? 'Ton getroffen!' : 'Note matched!'}</span>
                  </>
                ) : (
                  <>
                    <span>✕</span>
                    <span>
                      {isDe 
                        ? 'Melodisches Intervall weicht ab – versuche es noch einmal nach Gehör!' 
                        : 'Melodic interval differs – listen again and try another key!'}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* 5. Main Action Deck: Play / Replay / Next Round */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {phase === 'IDLE' && (
            <button
              type="button"
              onClick={() => {
                if (inputMode === 'sing' && !isMicActive) {
                  enableMicrophone();
                }
                startNewChallenge(difficulty);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c49750] via-[#ffd56b] to-[#c49750] text-black font-semibold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-[#c49750]/25 flex items-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>{isDe ? 'Melodie Anhören & Starten' : 'Listen & Start'}</span>
            </button>
          )}

          {phase === 'PLAYING_PROMPT' && (
            <div className="flex items-center gap-2 text-xs font-mono text-[#c49750] animate-pulse py-2">
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span>{isDe ? 'Präge dir die Melodie genau ein...' : 'Memorize the melody carefully...'}</span>
            </div>
          )}

          {phase === 'LISTENING_SING' && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReplayPrompt}
                className="px-4 py-2 rounded-xl bg-[#181c28] hover:bg-[#222738] border border-white/10 text-[#dedacf] hover:text-white text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#c49750]" />
                <span>{isDe ? 'Nochmal anhören' : 'Listen Again'}</span>
              </button>

              {inputMode === 'sing' && !isMicActive && (
                <button
                  type="button"
                  onClick={enableMicrophone}
                  className="px-4 py-2 rounded-xl bg-[#c49750] text-black text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{isDe ? 'Mikro aktivieren' : 'Enable Mic to Sing'}</span>
                </button>
              )}
            </div>
          )}

          {phase === 'SUCCESS_ROUND' && (
            <div className="flex items-center gap-2.5 animate-fade-in">
              <button
                type="button"
                onClick={handleNextRound}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/30 flex items-center gap-2 cursor-pointer"
              >
                <span>{isDe ? 'Nächste Melodie' : 'Next Melody'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* 6. Top 10 Leaderboard Modal */}
        {showLeaderboard && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowLeaderboard(false);
            }}
          >
            <div className="relative w-full max-w-sm rounded-2xl bg-[#121622] border border-[#c49750]/60 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] text-left">
              <button
                type="button"
                onClick={() => setShowLeaderboard(false)}
                className="absolute top-3.5 right-3.5 p-1 rounded-lg text-[#8c887d] hover:text-white bg-[#181c28] border border-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c49750] mb-3">
                <Trophy className="w-4 h-4 text-[#c49750]" />
                <span>{isDe ? 'Top 10 Melodie-Bestenliste' : 'Top 10 Pitch Memory Scores'}</span>
              </div>

              {/* Player Name Input */}
              <div className="mb-4">
                <label className="text-[10px] font-mono text-[#8c887d] block mb-1">
                  {isDe ? 'Dein Name:' : 'Your Name:'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={14}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#0b0d13] border border-white/20 text-xs text-[#fbf9f5] font-mono focus:border-[#c49750] outline-none"
                    placeholder="Memory"
                  />
                  <button
                    type="button"
                    onClick={saveScoreToLeaderboard}
                    disabled={score <= 0}
                    className="px-3 py-1.5 rounded-lg bg-[#c49750] text-black font-semibold text-xs uppercase cursor-pointer disabled:opacity-40"
                  >
                    {isDe ? 'Speichern' : 'Save'}
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="max-h-60 overflow-y-auto space-y-1.5 thin-scrollbar pr-1">
                {leaderboard.length === 0 ? (
                  <p className="text-xs font-mono text-[#6e6a60] text-center py-4">
                    {isDe ? 'Noch keine Einträge. Erinnere eine Melodie!' : 'No entries yet. Recall a melody!'}
                  </p>
                ) : (
                  leaderboard.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#0d1017] border border-white/5 text-xs font-mono"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#c49750] font-bold w-4">#{idx + 1}</span>
                        <span className="text-[#fbf9f5]">{item.name}</span>
                        <span className="text-[10px] text-[#8c887d]">
                          {item.difficulty === 1 ? 'L1' : item.difficulty === 2 ? 'L2' : 'L3'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-400 font-bold">{item.score} pts</span>
                        <span className="text-[10px] text-[#6e6a60]">{item.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
