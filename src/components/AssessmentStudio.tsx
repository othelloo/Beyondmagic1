import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Award, Flame, Play, Square, RotateCcw, ChevronRight, CheckCircle2, AlertCircle, Clock, Volume2, Music, Waves, Mic, Sparkles } from 'lucide-react';
import { FineMusicNote, BeamedEighthPair, BeamedSixteenthQuartet, BeamedSixteenthDuo } from './RhythmStudio';

export type AssessmentCategory = 'tempo' | 'rhythm' | 'pitch';

interface RoundResult {
  category: AssessmentCategory;
  level: 1 | 2 | 3;
  scorePercent: number;
  pitchScore?: number;
  rhythmScore?: number;
  timeSeconds: number;
  skippedLevel: boolean;
  steppedDown: boolean;
}

interface AssessmentStudioProps {
  isDe: boolean;
  onSwitchTab?: (tab: 'explore' | 'ear-training' | 'pitch-memory' | 'rhythm' | 'tempo' | 'assessment') => void;
}

// 9 Total Rounds: 3 Tempo, 3 Rhythm, 3 Pitch Memory
const ROUND_PLAN: { round: number; category: AssessmentCategory; title: string; titleDe: string }[] = [
  { round: 1, category: 'tempo', title: '1. Pulse Perception: Guess Meter & BPM', titleDe: '1. Puls-Wahrnehmung: Taktart & Tempo' },
  { round: 2, category: 'rhythm', title: '2. Rhythmic Sight-Reading on Staff', titleDe: '2. Rhythmisches Notenlesen im Notensystem' },
  { round: 3, category: 'pitch', title: '3. Melodic & Rhythmic Ear Memory', titleDe: '3. Melodisch-rhythmisches Gehör' },
  { round: 4, category: 'tempo', title: '4. Internal Clock: Tap Target BPM', titleDe: '4. Innerer Puls: Tempo schlagen' },
  { round: 5, category: 'rhythm', title: '5. Beamed Grooves on Staff', titleDe: '5. Balken-Rhythmen im Notensystem' },
  { round: 6, category: 'pitch', title: '6. Expressive Interval & Rhythm Memory', titleDe: '6. Expressives Intervall- & Zeitgedächtnis' },
  { round: 7, category: 'tempo', title: '7. Meter & Pulse Discrimination', titleDe: '7. Taktart- & Pulserkennung' },
  { round: 8, category: 'rhythm', title: '8. Symphonic Phrasing on Staff', titleDe: '8. Symphonische Partitur im System' },
  { round: 9, category: 'pitch', title: '9. Cantabile Motif Recall with Rhythm', titleDe: '9. Kantable Melodie- & Rhythmus-Erinnerung' },
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
  leftPercent: number; // Percentage offset across 15 white keys
}

// 15 white keys => each key is 6.6666% wide
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

// Musical Rhythm Bar definition for staff rendering
interface StaffBar {
  timeSignature: string;
  notes: {
    type: 'quarter' | 'half' | 'dotted-half' | 'eighth' | 'sixteenth' | 'rest-quarter';
    durationBeats: number;
  }[];
}

interface MelodicMemoryNote {
  note: string;
  midi: number;
  freq: number;
  durationSec: number;
  rhythmType: 'quarter' | 'half' | 'dotted-half' | 'eighth';
  rhythmLabel: string;
}

export const AssessmentStudio: React.FC<AssessmentStudioProps> = ({ isDe, onSwitchTab }) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState<number>(0);
  const [adaptiveLevel, setAdaptiveLevel] = useState<1 | 2 | 3>(1);
  const [adaptiveNotification, setAdaptiveNotification] = useState<string | null>(null);
  const [history, setHistory] = useState<RoundResult[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Round Timer
  const roundStartTimeRef = useRef<number>(performance.now());

  // Web Audio Context
  const audioCtxRef = useRef<AudioContext | null>(null);
  const getAudioContext = useCallback(() => {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioCtx();
    }
    return audioCtxRef.current;
  }, []);

  // Audio synths
  const playClickSound = useCallback((freq: number, dur = 0.05) => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + dur);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + dur + 0.01);
    } catch {}
  }, [getAudioContext]);

  const playPianoNote = useCallback((freq: number) => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 1.25);
    } catch {}
  }, [getAudioContext]);

  // Round sub-states
  // 1. TEMPO SUB-STATE
  const [tempoTargetBpm, setTempoTargetBpm] = useState<number>(108);
  const [tempoMeter, setTempoMeter] = useState<'3/4' | '4/4' | '6/8'>('4/4');
  const [tempoSelectedMeter, setTempoSelectedMeter] = useState<string | null>(null);
  const [tempoGuessedBpm, setTempoGuessedBpm] = useState<number>(100);
  const [tempoIsPlaying, setTempoIsPlaying] = useState<boolean>(false);
  const tempoTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [tempoTappedTimes, setTempoTappedTimes] = useState<number[]>([]);

  // 2. RHYTHM ON A STAFF SUB-STATE
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

  // 3. PITCH & RHYTHMIC MEMORY SUB-STATE
  const [melodicPrompt, setMelodicPrompt] = useState<MelodicMemoryNote[]>([
    { note: 'C4', midi: 60, freq: 261.63, durationSec: 0.5, rhythmType: 'quarter', rhythmLabel: '𝅘𝅥' },
    { note: 'E4', midi: 64, freq: 329.63, durationSec: 0.5, rhythmType: 'quarter', rhythmLabel: '𝅘𝅥' },
    { note: 'G4', midi: 67, freq: 392.00, durationSec: 1.0, rhythmType: 'half', rhythmLabel: '𝅗𝅥' },
  ]);
  const [melodyPlayingIdx, setMelodyPlayingIdx] = useState<number | null>(null);
  const [isMelodyPlaying, setIsMelodyPlaying] = useState<boolean>(false);
  const [hasHeardMelody, setHasHeardMelody] = useState<boolean>(false);
  const [pitchUserRecall, setPitchUserRecall] = useState<{ note: string; timestamp: number }[]>([]);
  const [keyboardOctaveView, setKeyboardOctaveView] = useState<'all' | 'oct3' | 'oct4'>('all');
  const [lastTappedKey, setLastTappedKey] = useState<string | null>(null);

  // Total playable notes in rhythm bars
  const totalPlayableRhythmNotes = rhythmBars.reduce((sum, bar) => sum + bar.notes.filter(n => n.type !== 'rest-quarter').length, 0);

  // Setup current round challenge
  const setupCurrentRound = useCallback((roundIdx: number, level: 1 | 2 | 3) => {
    roundStartTimeRef.current = performance.now();
    const config = ROUND_PLAN[roundIdx];

    if (config.category === 'tempo') {
      if (roundIdx === 0) {
        // Round 1: Guess
        const bpms = level === 1 ? [76, 96, 120] : level === 2 ? [68, 88, 112, 132] : [58, 74, 144, 168];
        const chosenBpm = bpms[Math.floor(Math.random() * bpms.length)];
        const chosenMeter = level === 1 ? '4/4' : level === 2 ? (Math.random() > 0.5 ? '3/4' : '4/4') : '6/8';
        setTempoTargetBpm(chosenBpm);
        setTempoMeter(chosenMeter);
        setTempoGuessedBpm(100);
        setTempoSelectedMeter(null);
      } else if (roundIdx === 3) {
        // Round 4: Tap
        const bpms = level === 1 ? 100 : level === 2 ? 128 : 76;
        setTempoTargetBpm(bpms);
        setTempoTappedTimes([]);
      } else {
        // Round 7: Advanced Guess
        const bpms = level === 1 ? 84 : level === 2 ? 140 : 160;
        setTempoTargetBpm(bpms);
        setTempoMeter(level === 3 ? '6/8' : '3/4');
        setTempoGuessedBpm(100);
        setTempoSelectedMeter(null);
      }
    } else if (config.category === 'rhythm') {
      // RHYTHM ON A STAFF: Construct authentic classical measures
      if (level === 1) {
        // Level 1: 2 bars of 4/4 (quarters & halves)
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
        // Level 2: 2 bars of 3/4 or 4/4 with eighth note pairs
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
        // Level 3: 2 bars of 4/4 with beamed sixteenth quartet & eighths
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
      // MELODY WITH DISTINCT RHYTHM AND DURATIONS
      if (level === 1) {
        // Level 1: 3-note major motif with quarter & half note rhythm
        setMelodicPrompt([
          { note: 'C4', midi: 60, freq: 261.63, durationSec: 0.6, rhythmType: 'quarter', rhythmLabel: '𝅘𝅥' },
          { note: 'E4', midi: 64, freq: 329.63, durationSec: 0.6, rhythmType: 'quarter', rhythmLabel: '𝅘𝅥' },
          { note: 'G4', midi: 67, freq: 392.00, durationSec: 1.2, rhythmType: 'half', rhythmLabel: '𝅗𝅥' },
        ]);
      } else if (level === 2) {
        // Level 2: 4-note lyrical phrase with varied rhythm
        setMelodicPrompt([
          { note: 'C4', midi: 60, freq: 261.63, durationSec: 0.5, rhythmType: 'quarter', rhythmLabel: '𝅘𝅥' },
          { note: 'D4', midi: 62, freq: 293.66, durationSec: 0.35, rhythmType: 'eighth', rhythmLabel: '𝅘𝅥𝅮' },
          { note: 'E4', midi: 64, freq: 329.63, durationSec: 0.35, rhythmType: 'eighth', rhythmLabel: '𝅘𝅥𝅮' },
          { note: 'G4', midi: 67, freq: 392.00, durationSec: 0.5, rhythmType: 'quarter', rhythmLabel: '𝅘𝅥' },
          { note: 'E4', midi: 64, freq: 329.63, durationSec: 1.1, rhythmType: 'half', rhythmLabel: '𝅗𝅥' },
        ]);
      } else {
        // Level 3: 5-note expressive phrase with Dorian/modal flavor
        setMelodicPrompt([
          { note: 'D4', midi: 62, freq: 293.66, durationSec: 0.5, rhythmType: 'quarter', rhythmLabel: '𝅘𝅥' },
          { note: 'F4', midi: 65, freq: 349.23, durationSec: 0.5, rhythmType: 'quarter', rhythmLabel: '𝅘𝅥' },
          { note: 'A4', midi: 69, freq: 440.00, durationSec: 0.35, rhythmType: 'eighth', rhythmLabel: '𝅘𝅥𝅮' },
          { note: 'G4', midi: 67, freq: 392.00, durationSec: 0.35, rhythmType: 'eighth', rhythmLabel: '𝅘𝅥𝅮' },
          { note: 'D4', midi: 62, freq: 293.66, durationSec: 1.2, rhythmType: 'half', rhythmLabel: '𝅗𝅥' },
        ]);
      }
      setPitchUserRecall([]);
      setMelodyPlayingIdx(null);
      setIsMelodyPlaying(false);
      setHasHeardMelody(false);
    }
  }, []);

  // Initialize round 0
  useEffect(() => {
    setupCurrentRound(0, 1);
  }, [setupCurrentRound]);

  // Metronome for tempo guessing
  const startMetronomeAudio = useCallback(() => {
    if (tempoTimerRef.current) clearInterval(tempoTimerRef.current);
    setTempoIsPlaying(true);
    const intervalMs = (60 / tempoTargetBpm) * 1000;
    const beatsPerBar = tempoMeter === '3/4' ? 3 : tempoMeter === '6/8' ? 6 : 4;
    let b = 0;

    playClickSound(1200, 0.04);
    b = 1;

    tempoTimerRef.current = setInterval(() => {
      const isAccent = b % beatsPerBar === 0;
      playClickSound(isAccent ? 1200 : 750, isAccent ? 0.04 : 0.025);
      b++;
    }, intervalMs);
  }, [tempoTargetBpm, tempoMeter, playClickSound]);

  const stopMetronomeAudio = useCallback(() => {
    if (tempoTimerRef.current) {
      clearInterval(tempoTimerRef.current);
      tempoTimerRef.current = null;
    }
    setTempoIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      stopMetronomeAudio();
    };
  }, [stopMetronomeAudio]);

  // Melodic prompt playback using authentic note duration rhythm
  const playMelodySequence = useCallback(() => {
    stopMetronomeAudio();
    setIsMelodyPlaying(true);
    setPitchUserRecall([]);
    let idx = 0;

    const playStep = () => {
      if (idx >= melodicPrompt.length) {
        setMelodyPlayingIdx(null);
        setIsMelodyPlaying(false);
        setHasHeardMelody(true);
        return;
      }

      const item = melodicPrompt[idx];
      setMelodyPlayingIdx(idx);
      playPianoNote(item.freq);
      idx++;

      const noteDurationMs = item.durationSec * 1000;
      setTimeout(playStep, noteDurationMs);
    };

    playStep();
  }, [melodicPrompt, playPianoNote, stopMetronomeAudio]);

  // Play reference starting note only
  const playStartNoteOnly = useCallback(() => {
    if (melodicPrompt.length > 0) {
      playPianoNote(melodicPrompt[0].freq);
      setLastTappedKey(melodicPrompt[0].note);
      setTimeout(() => setLastTappedKey(null), 400);
    }
  }, [melodicPrompt, playPianoNote]);

  // Process & Advance Round with Adaptive Logic
  const finishRound = useCallback((scorePercent: number, subDetails?: { pitchScore?: number; rhythmScore?: number }) => {
    stopMetronomeAudio();
    const elapsedSec = (performance.now() - roundStartTimeRef.current) / 1000;
    const currentCat = ROUND_PLAN[currentRoundIdx].category;

    let skipped = false;
    let steppedDown = false;
    let nextLevel: 1 | 2 | 3 = adaptiveLevel;

    // ADAPTIVE ENGINE:
    if (scorePercent >= 85 && (elapsedSec < 7 || adaptiveLevel === 1)) {
      if (adaptiveLevel === 1) {
        nextLevel = 3; // Skips Level 2!
        skipped = true;
        setAdaptiveNotification(
          isDe 
            ? '⚡ Blitzschnell & Präzise! Eine Stufe übersprungen: Direkt zu Stufe 3!' 
            : '⚡ Lightning-fast & Accurate! Skipped a level: Jumped straight to Level 3!'
        );
      } else if (adaptiveLevel === 2) {
        nextLevel = 3;
        setAdaptiveNotification(
          isDe ? '🌟 Hervorragend! Aufstieg zu Stufe 3.' : '🌟 Flawless! Promoted to Level 3.'
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
          isDe 
            ? '🔄 Stufe angepasst: Einen Schritt zurück zu Stufe 2 zur Festigung.' 
            : '🔄 Adapting difficulty: Stepped back to Level 2 to reinforce stability.'
        );
      } else if (adaptiveLevel === 2) {
        nextLevel = 1;
        steppedDown = true;
        setAdaptiveNotification(
          isDe 
            ? '🔄 Stufe angepasst: Zurück zu Stufe 1 zur Festigung.' 
            : '🔄 Adapting difficulty: Stepped back to Level 1 to reinforce stability.'
        );
      }
    }

    const newResult: RoundResult = {
      category: currentCat,
      level: adaptiveLevel,
      scorePercent,
      pitchScore: subDetails?.pitchScore,
      rhythmScore: subDetails?.rhythmScore,
      timeSeconds: elapsedSec,
      skippedLevel: skipped,
      steppedDown
    };

    const updatedHistory = [...history, newResult];
    setHistory(updatedHistory);

    if (currentRoundIdx + 1 >= ROUND_PLAN.length) {
      setIsCompleted(true);
    } else {
      const nextIdx = currentRoundIdx + 1;
      setCurrentRoundIdx(nextIdx);
      setAdaptiveLevel(nextLevel);
      setupCurrentRound(nextIdx, nextLevel);
    }
  }, [currentRoundIdx, adaptiveLevel, history, isDe, setupCurrentRound, stopMetronomeAudio]);

  // 1. Submit Tempo Guess (Round 1 & 7)
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

  // 2. Submit Tempo Tap (Round 4)
  const submitTempoTap = useCallback(() => {
    if (tempoTappedTimes.length < 4) return;
    const intervals: number[] = [];
    for (let i = 1; i < tempoTappedTimes.length; i++) {
      intervals.push(tempoTappedTimes[i] - tempoTappedTimes[i - 1]);
    }
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

  // 3. Rhythm User Tap (Rounds 2, 5, 8)
  const handleRhythmTap = useCallback(() => {
    playClickSound(300, 0.08);
    setRhythmPadPressed(true);
    setTimeout(() => setRhythmPadPressed(false), 90);

    const now = performance.now();
    const updated = [...rhythmTapTimes, now];
    setRhythmTapTimes(updated);

    if (updated.length >= totalPlayableRhythmNotes) {
      setTimeout(() => {
        // Evaluate inter-tap timings against relative expected durations
        const flatNotes = rhythmBars.flatMap(b => b.notes).filter(n => n.type !== 'rest-quarter');
        const userIntervals: number[] = [];
        for (let i = 1; i < updated.length; i++) {
          userIntervals.push(updated[i] - updated[i - 1]);
        }
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
  }, [playClickSound, rhythmTapTimes, totalPlayableRhythmNotes, rhythmBars, finishRound]);

  // 4. Melodic Note Tap on Piano Keyboard (Rounds 3, 6, 9)
  // Evaluates BOTH Pitch Recall AND Rhythmic Duration Timing!
  const handlePianoKeyClick = (key: PianoKeyItem) => {
    // ALWAYS play the sound so the user can test the keyboard freely before starting!
    playPianoNote(key.freq);
    setLastTappedKey(key.note);
    setTimeout(() => setLastTappedKey(null), 300);

    // If user hasn't heard the melody yet or is actively listening, it's free trial mode!
    if (!hasHeardMelody || isMelodyPlaying) {
      return;
    }

    const now = performance.now();
    const updated = [...pitchUserRecall, { note: key.note, timestamp: now }];
    setPitchUserRecall(updated);

    if (updated.length >= melodicPrompt.length) {
      setTimeout(() => {
        // 1. Pitch Accuracy
        let correctPitches = 0;
        for (let i = 0; i < melodicPrompt.length; i++) {
          if (updated[i].note === melodicPrompt[i].note) correctPitches++;
        }
        const pitchScore = Math.round((correctPitches / melodicPrompt.length) * 100);

        // 2. Rhythmic Timing Accuracy
        let rhythmScore = 100;
        if (updated.length > 1) {
          const userDurations: number[] = [];
          for (let i = 1; i < updated.length; i++) {
            userDurations.push(updated[i].timestamp - updated[i - 1].timestamp);
          }
          const expectedDurations = melodicPrompt.slice(0, -1).map(n => n.durationSec * 1000);
          const avgUnit = userDurations[0] / expectedDurations[0];

          let error = 0;
          for (let i = 0; i < userDurations.length; i++) {
            const exp = expectedDurations[i] * avgUnit;
            error += Math.abs(userDurations[i] - exp) / Math.max(exp, 100);
          }
          const avgErr = error / userDurations.length;
          rhythmScore = Math.max(40, Math.min(100, Math.round((1 - avgErr) * 100)));
        }

        // Composite: 65% Pitch Memory + 35% Rhythmic Timing
        const combinedScore = Math.round(pitchScore * 0.65 + rhythmScore * 0.35);
        finishRound(combinedScore, { pitchScore, rhythmScore });
      }, 350);
    }
  };

  // Keyboard Spacebar / Enter triggers for rhythm and tempo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        const cat = ROUND_PLAN[currentRoundIdx].category;
        if (cat === 'rhythm') {
          e.preventDefault();
          handleRhythmTap();
        } else if (cat === 'tempo') {
          if (currentRoundIdx === 3) {
            e.preventDefault();
            playClickSound(500, 0.05);
            setTempoTappedTimes(prev => [...prev, performance.now()]);
          } else {
            e.preventDefault();
            if (tempoIsPlaying) stopMetronomeAudio();
            else startMetronomeAudio();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentRoundIdx, handleRhythmTap, tempoIsPlaying, startMetronomeAudio, stopMetronomeAudio, playClickSound]);

  // Compute stats for Radar Web Chart
  const computeDimensionScores = () => {
    const tempoRounds = history.filter(h => h.category === 'tempo');
    const rhythmRounds = history.filter(h => h.category === 'rhythm');
    const pitchRounds = history.filter(h => h.category === 'pitch');

    const tempoAvg = tempoRounds.length ? Math.round(tempoRounds.reduce((a, b) => a + b.scorePercent, 0) / tempoRounds.length) : 85;
    const rhythmAvg = rhythmRounds.length ? Math.round(rhythmRounds.reduce((a, b) => a + b.scorePercent, 0) / rhythmRounds.length) : 88;
    const pitchAvg = pitchRounds.length ? Math.round(pitchRounds.reduce((a, b) => a + b.scorePercent, 0) / pitchRounds.length) : 82;

    const pulseScore = Math.round((tempoAvg * 0.6) + (rhythmAvg * 0.4));
    const skipsCount = history.filter(h => h.skippedLevel).length;
    const agilityScore = Math.min(100, Math.round(80 + skipsCount * 10));

    const overallComposite = Math.round((rhythmAvg + pitchAvg + tempoAvg + pulseScore + agilityScore) / 5);

    return {
      rhythm: rhythmAvg,
      pitch: pitchAvg,
      tempo: tempoAvg,
      pulse: pulseScore,
      agility: agilityScore,
      overall: overallComposite,
      skipsCount
    };
  };

  const handleRestart = () => {
    setCurrentRoundIdx(0);
    setAdaptiveLevel(1);
    setAdaptiveNotification(null);
    setHistory([]);
    setIsCompleted(false);
    setupCurrentRound(0, 1);
  };

  const currentConfig = ROUND_PLAN[currentRoundIdx];
  const stats = computeDimensionScores();

  // Radar Web Chart (5 axes)
  const radarAxes = [
    { label: isDe ? 'Rhythmus' : 'Rhythm', score: stats.rhythm },
    { label: isDe ? 'Ton-Gedächtnis' : 'Melodic Ear', score: stats.pitch },
    { label: isDe ? 'Innerer Puls' : 'Pulse Stability', score: stats.pulse },
    { label: isDe ? 'Tempo-Präzision' : 'Tempo Accuracy', score: stats.tempo },
    { label: isDe ? 'Agilität' : 'Adaptability', score: stats.agility }
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

  // Filter keys according to octave view selector
  const activeWhiteKeys = keyboardOctaveView === 'oct3'
    ? FULL_2_OCTAVE_WHITE_KEYS.filter(k => k.octave === 3)
    : keyboardOctaveView === 'oct4'
    ? FULL_2_OCTAVE_WHITE_KEYS.filter(k => k.octave >= 4)
    : FULL_2_OCTAVE_WHITE_KEYS;

  const startNoteName = melodicPrompt.length > 0 ? melodicPrompt[0].note : 'C4';

  // Smart note grouping for rhythm bar on staff
  const renderStaffBarNotes = (bar: StaffBar) => {
    const elements: React.ReactNode[] = [];
    const notes = bar.notes;
    let i = 0;

    while (i < notes.length) {
      // Check 4 sixteenths
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

      // Check 2 sixteenths
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

      // Check 2 eighths
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

  return (
    <div id="assessment-studio-console" className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto select-none overflow-x-hidden">
      <div className="relative rounded-2xl bg-[#121520] border border-[#2b3347] shadow-[0_12px_45px_rgba(0,0,0,0.6)] p-3 sm:p-5 overflow-hidden w-full box-border">
        
        {/* Glow */}
        <div 
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-20 transition-colors duration-500"
          style={{ backgroundColor: isCompleted ? '#10b981' : '#c49750' }}
        />

        {/* 1. Header Bar: Diagnostic Title & Restart */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 pb-2.5 mb-2.5 border-b border-white/10 w-full">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚖️</span>
            <div>
              <h4 className="text-sm sm:text-base font-serif font-bold text-[#fbf9f5] flex items-center gap-1.5">
                <span>{isDe ? 'Adaptiver Einstufungstest' : 'Adaptive Diagnostic Assessment'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#c49750]/20 text-[#ffd56b] border border-[#c49750]/40">
                  {isDe ? '9 Schnelltests' : '9 Swift Rounds'}
                </span>
              </h4>
              <p className="text-[10px] font-mono text-[#8c887d]">
                {isDe 
                  ? 'Kombiniert Notensystem-Rhythmik, Melodie-Zeitgedächtnis & Tempo' 
                  : 'Combines Staff Sight-Reading, Melodic-Rhythmic Memory & Tempo Pulse'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRestart}
            className="p-1.5 rounded-lg text-[#8c887d] hover:text-white bg-[#0b0d14] border border-white/10 transition-colors cursor-pointer"
            title={isDe ? 'Test neu starten' : 'Restart test'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {!isCompleted ? (
          <>
            {/* 2. HUD Bar: Progress (1..9) & Adaptive Level */}
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

              {/* Live Adaptive Stufe Pill */}
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
                  <span className="text-base">{currentConfig.category === 'tempo' ? '⏱️' : currentConfig.category === 'rhythm' ? '🎼' : '🎵'}</span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-[#ffd56b]">
                    {isDe ? currentConfig.titleDe : currentConfig.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#8c887d] uppercase tracking-wider">
                  {currentConfig.category}
                </span>
              </div>

              {/* ========================================================== */}
              {/* CATEGORY A: TEMPO ROUND                                   */}
              {/* ========================================================== */}
              {currentConfig.category === 'tempo' && (
                <div className="space-y-3">
                  {currentRoundIdx === 3 ? (
                    /* Tap Target Tempo */
                    <div className="text-center space-y-3">
                      <div className="inline-block px-3 py-1 rounded-full bg-[#141b2a] border border-[#38bdf8]/40 text-xs font-mono text-[#38bdf8]">
                        {isDe ? `Ziel-Tempo: ${tempoTargetBpm} BPM` : `Target Tempo: ${tempoTargetBpm} BPM`}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          playClickSound(500, 0.05);
                          const now = performance.now();
                          setTempoTappedTimes(prev => [...prev, now]);
                        }}
                        className="w-full h-24 rounded-2xl bg-[#151926] hover:bg-[#1d2334] border border-[#38bdf8]/50 text-[#fbf9f5] flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                      >
                        <span className="text-2xl">🥁</span>
                        <span className="text-xs sm:text-sm font-mono font-bold uppercase">
                          {isDe ? 'Tippe mindestens 5 Schläge (Leertaste / Klick)' : 'Tap at least 5 beats (Spacebar / Click)'}
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
                    /* Guess Tempo & Signature */
                    <div className="text-center space-y-3">
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

                      {/* Signature Selection */}
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

                      {/* BPM Guess */}
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

              {/* ========================================================== */}
              {/* CATEGORY B: RHYTHM ON A CLASSICAL MUSICAL STAFF            */}
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

                    {/* Percussion Clef at start */}
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
                            <div className="flex-1 flex items-center justify-around gap-1 px-1">
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
              {/* CATEGORY C: MELODIC & RHYTHMIC MEMORY (WITH 2-OCTAVE PIANO) */}
              {/* ========================================================== */}
              {currentConfig.category === 'pitch' && (
                <div className="space-y-3">
                  
                  {/* Melodic Notation & Rhythmic Values on Score */}
                  <div className="p-3 rounded-xl bg-[#070910] border border-white/10 text-center">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#c49750]">
                        {isDe ? 'Melodisches Motiv & Rhythmus:' : 'Melodic Motif & Rhythm:'}
                      </span>
                      <span className="text-[10px] font-mono text-[#8c887d]">
                        {isDe ? 'Tonhöhe + Rhythmus einprägen' : 'Memorize pitches + duration rhythm'}
                      </span>
                    </div>

                    {/* Motif Note Pearls with Durations */}
                    <div className="flex items-center justify-center gap-2 sm:gap-3 my-2 flex-wrap">
                      {melodicPrompt.map((item, idx) => {
                        const isPlaying = melodyPlayingIdx === idx;
                        const isUserAnswered = idx < pitchUserRecall.length;

                        return (
                          <div
                            key={idx}
                            className={`px-3 py-2 rounded-xl flex flex-col items-center justify-center gap-0.5 font-mono text-xs font-bold transition-all ${
                              isUserAnswered
                                ? 'bg-emerald-500 text-black shadow-md'
                                : isPlaying
                                ? 'bg-[#ffd56b] text-black scale-110 shadow-lg ring-2 ring-white'
                                : 'bg-[#151926] text-[#dedacf] border border-white/10'
                            }`}
                          >
                            <span className="text-sm">{item.rhythmLabel}</span>
                            <span className="text-[11px]">{item.note}</span>
                            <span className="text-[8px] opacity-75">{item.durationSec}s</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Action: Play melody prompt OR Start Note helper */}
                    <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                      <button
                        type="button"
                        onClick={playMelodySequence}
                        disabled={isMelodyPlaying}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#c49750] to-[#ffd56b] text-black font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md disabled:opacity-50"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isDe ? 'Melodie mit Rhythmus anhören' : 'Listen to Melody & Rhythm'}</span>
                      </button>

                      {/* Start Note Indicator & Playback */}
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

                  {/* Instruction banner for user turn */}
                  <div className="flex items-center justify-between text-xs font-mono px-1">
                    <span className="text-[#ffd56b] font-bold">
                      {hasHeardMelody 
                        ? (isDe ? `👉 Dein Zug: Beginne bei Startnote ${startNoteName}!` : `👉 Your Turn: Start on ${startNoteName}!`) 
                        : (isDe ? '🎹 Du kannst die Tasten vorab frei ausprobieren!' : '🎹 Feel free to try the keyboard below anytime!')}
                    </span>

                    {/* Octave Range Selector */}
                    <div className="flex items-center gap-1 text-[10px] font-mono">
                      <button
                        type="button"
                        onClick={() => setKeyboardOctaveView('all')}
                        className={`px-2 py-0.5 rounded ${keyboardOctaveView === 'all' ? 'bg-[#c49750] text-black font-bold' : 'bg-[#181c28] text-[#8c887d]'}`}
                      >
                        {isDe ? '2 Oktaven (C3–C5)' : '2 Octaves (C3–C5)'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setKeyboardOctaveView('oct4')}
                        className={`px-2 py-0.5 rounded ${keyboardOctaveView === 'oct4' ? 'bg-[#c49750] text-black font-bold' : 'bg-[#181c28] text-[#8c887d]'}`}
                      >
                        {isDe ? 'Diskant (C4–C5)' : 'Treble (C4–C5)'}
                      </button>
                    </div>
                  </div>

                  {/* Phone orientation hint */}
                  <p className="text-[10px] font-mono text-[#8c887d] italic sm:hidden text-center">
                    {isDe 
                      ? '📱 Tipp: Drehe das Smartphone ins Querformat für das volle 2-Oktaven-Panorama!' 
                      : '📱 Tip: Rotate phone to landscape for the full 2-octave panoramic keyboard!'}
                  </p>

                  {/* Full 2-Octave Piano Keyboard */}
                  <div className="p-2 rounded-xl bg-[#0b0d14] border border-white/5 overflow-x-auto no-scrollbar">
                    <div className="relative h-28 sm:h-32 select-none min-w-[540px] sm:min-w-0 w-full">
                      
                      {/* White Keys */}
                      <div className="flex w-full h-full">
                        {activeWhiteKeys.map((key) => {
                          const isStartKey = hasHeardMelody && key.note === startNoteName;
                          const isTapped = lastTappedKey === key.note;

                          return (
                            <button
                              key={key.note}
                              type="button"
                              onClick={() => handlePianoKeyClick(key)}
                              className={`flex-1 h-full rounded-b-md border-r border-[#1a1e28] last:border-r-0 flex flex-col justify-end items-center pb-1.5 text-xs font-mono font-bold transition-all relative cursor-pointer ${
                                isTapped
                                  ? 'bg-[#c49750] text-black translate-y-0.5'
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
                              <span className="text-[11px] leading-none">{key.label}</span>
                              <span className="text-[8px] text-[#6e6a60] leading-none mt-0.5">{key.octave}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Black Keys */}
                      {keyboardOctaveView === 'all' && (
                        FULL_2_OCTAVE_BLACK_KEYS.map((key) => {
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
                        })
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          </>
        ) : (
          /* ========================================================== */
          /* 4. CONCLUDING RESULTS SCREEN & SPIDER-WEB RADAR CHART      */
          /* ========================================================== */
          <div className="space-y-4 animate-fade-in text-center">
            
            {/* Top Score Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#090b12] border border-[#c49750]/60 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#c49750]/15 rounded-full blur-2xl pointer-events-none" />

              <span className="text-[10px] font-mono uppercase tracking-widest text-[#c49750]">
                {isDe ? 'Gesamtergebnis Einstufung' : 'Overall Diagnostic Rating'}
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

            {/* THE SPIDER-WEB / RADAR CHART WITH EXPLICIT NUMBERS & METRICS */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0d101a] border border-white/10 text-center">
              <div className="flex items-center justify-between mb-3 text-left">
                <div>
                  <h5 className="text-sm font-mono font-bold text-[#fbf9f5] uppercase tracking-wider flex items-center gap-1.5">
                    <span>🕸️</span>
                    <span>{isDe ? 'Musikalisches Kompetenzprofil (Web-Diagramm)' : 'Musicianship Competence Web Chart'}</span>
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
                  {/* Concentric Polygon Grid Rings */}
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

                  {/* 5 Spoke Axis Lines */}
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

                  {/* Filled Web Polygon Area */}
                  <polygon
                    points={polygonPointsStr}
                    fill="rgba(196,151,80,0.35)"
                    stroke="#ffd56b"
                    strokeWidth="2.5"
                    className="transition-all duration-700"
                  />

                  {/* Axis Vertices Dots & Explicit Numbers */}
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
                          fontSize="10"
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

              {/* Explicit Numerical Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-3 border-t border-white/10 text-center">
                {radarAxes.map((axis, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-[#080a10] border border-white/5">
                    <span className="text-[10px] font-mono text-[#8c887d] block truncate">{axis.label}</span>
                    <span className="text-base sm:text-lg font-mono font-black text-emerald-400">{axis.score}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnostic Details & Actionable Recommendations */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#090b12] border border-[#c49750]/30 text-left space-y-2">
              <h6 className="text-xs font-mono uppercase tracking-wider text-[#ffd56b] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isDe ? 'Pädagogische Einschätzung & Empfehlung' : 'Pedagogical Evaluation & Path'}</span>
              </h6>
              <p className="text-xs text-[#dedacf] font-serif leading-relaxed">
                {stats.overall >= 85
                  ? (isDe 
                      ? 'Außergewöhnlich ausgeprägtes relatives Gehör und stabiles Taktgefühl. Du kannst direkt komplexe 6-Takt-Stücke in Stufe 3 und anspruchsvolle Gesangspassagen erarbeiten.' 
                      : 'Exceptional relative pitch and rock-solid inner groove. You can immediately tackle 6-bar Level 3 symphonic phrasing and virtuoso vocal repertoire.')
                  : stats.overall >= 70
                  ? (isDe 
                      ? 'Gutes rhythmisches Fundament mit feinem Gespür für Phrasierung. Vertiefe das Tempo-Studio und 16tel-Bindungen im Rhythmus-Atelier zur Perfektionierung.' 
                      : 'Solid rhythmic foundation with sensitive phrasing. Practice with the Tempo Studio and beamed 16ths in the Rhythm Atelier to solidify internal subdivision.')
                  : (isDe 
                      ? 'Gute Ansätze im Hörgedächtnis. Regelmäßiges Üben mit den Akkord- und Melodie-Tools wird deinen inneren Pulsschlag rasch festigen.' 
                      : 'Promising musical instincts. Regular daily practice with chord tension and melodic recall will rapidly develop your inner pulse.')}
              </p>
            </div>

            {/* Quick Action Navigation Buttons to individual studios */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleRestart}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1a1f2e] hover:bg-[#252c40] border border-[#c49750]/60 text-xs font-mono font-bold text-[#fbf9f5] cursor-pointer transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#c49750]" />
                <span>{isDe ? 'Test wiederholen' : 'Retake Assessment'}</span>
              </button>

              {onSwitchTab && (
                <>
                  <button
                    type="button"
                    onClick={() => onSwitchTab('rhythm')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#c49750] to-[#ffd56b] text-black text-xs font-mono font-bold cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span>🥁</span>
                    <span>{isDe ? 'Zum Rhythmus-Studio' : 'Go to Rhythm Studio'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSwitchTab('tempo')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#141b2a] hover:bg-[#1d273a] border border-[#38bdf8]/50 text-xs font-mono font-bold text-[#38bdf8] cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>⏱️</span>
                    <span>{isDe ? 'Zum Tempo-Studio' : 'Go to Tempo Studio'}</span>
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
