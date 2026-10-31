import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, RotateCcw, Trophy, Music, Flame, Award, ChevronRight, X, Clock, CheckCircle2 } from 'lucide-react';

export {
  type RhythmDifficulty,
  type RhythmNoteType,
  type RhythmNote,
  type RhythmBar,
  type RhythmExercise,
  RHYTHMS_LEVEL_1,
  RHYTHMS_LEVEL_2,
  RHYTHMS_LEVEL_3,
  validateRhythmExercise,
  validateAllRhythms,
} from '../data/rhythmExercises';

import {
  RhythmDifficulty,
  RhythmNoteType,
  RhythmNote,
  RhythmBar,
  RhythmExercise,
  RHYTHMS_LEVEL_1,
  RHYTHMS_LEVEL_2,
  RHYTHMS_LEVEL_3,
  validateAllRhythms,
} from '../data/rhythmExercises';

// Run validation immediately on load
if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'production') {
  validateAllRhythms();
}

// ============================================================================
// High-Fidelity Classical Music Notation Components (Henle / Durand Classical Engraving)
// ============================================================================

// Beamed Group of 4 Sixteenth Notes (~48px, compact and tight)
export const BeamedSixteenthQuartet: React.FC = () => (
  <svg viewBox="0 0 54 36" className="w-12 h-8 sm:w-13 sm:h-9 overflow-visible select-none shrink-0">
    <line x1="14" y1="5" x2="50" y2="5" stroke="#fbf9f5" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="14" y1="9.5" x2="50" y2="9.5" stroke="#fbf9f5" strokeWidth="2.8" strokeLinecap="round" />

    <ellipse cx="9" cy="27" rx="5" ry="3.2" transform="rotate(-25 9 27)" fill="#fbf9f5" />
    <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />

    <ellipse cx="21" cy="27" rx="5" ry="3.2" transform="rotate(-25 21 27)" fill="#fbf9f5" />
    <line x1="26" y1="25" x2="26" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />

    <ellipse cx="33" cy="27" rx="5" ry="3.2" transform="rotate(-25 33 27)" fill="#fbf9f5" />
    <line x1="38" y1="25" x2="38" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />

    <ellipse cx="45" cy="27" rx="5" ry="3.2" transform="rotate(-25 45 27)" fill="#fbf9f5" />
    <line x1="50" y1="25" x2="50" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />
  </svg>
);

// Beamed Duo of 2 Sixteenth Notes (~28px)
export const BeamedSixteenthDuo: React.FC = () => (
  <svg viewBox="0 0 32 36" className="w-7 h-8 sm:w-8 sm:h-9 overflow-visible select-none shrink-0">
    <line x1="14" y1="5" x2="26" y2="5" stroke="#fbf9f5" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="14" y1="9.5" x2="26" y2="9.5" stroke="#fbf9f5" strokeWidth="2.8" strokeLinecap="round" />

    <ellipse cx="9" cy="27" rx="5" ry="3.2" transform="rotate(-25 9 27)" fill="#fbf9f5" />
    <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />

    <ellipse cx="21" cy="27" rx="5" ry="3.2" transform="rotate(-25 21 27)" fill="#fbf9f5" />
    <line x1="26" y1="25" x2="26" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />
  </svg>
);

// Beamed Pair of 2 Eighth Notes (~34px)
export const BeamedEighthPair: React.FC = () => (
  <svg viewBox="0 0 38 36" className="w-8 h-8 sm:w-9 sm:h-9 overflow-visible select-none shrink-0">
    <line x1="14" y1="5" x2="32" y2="5" stroke="#fbf9f5" strokeWidth="2.8" strokeLinecap="round" />

    <ellipse cx="9" cy="27" rx="5" ry="3.2" transform="rotate(-25 9 27)" fill="#fbf9f5" />
    <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />

    <ellipse cx="27" cy="27" rx="5" ry="3.2" transform="rotate(-25 27 27)" fill="#fbf9f5" />
    <line x1="32" y1="25" x2="32" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />
  </svg>
);

// Beamed Mixed Figure: 1 Eighth + 2 Sixteenths (1 beat in 4/4 / 3/4)
export const BeamedEighthAndTwoSixteenths: React.FC = () => (
  <svg viewBox="0 0 46 36" className="w-10 h-8 sm:w-11 sm:h-9 overflow-visible select-none shrink-0">
    <line x1="14" y1="5" x2="38" y2="5" stroke="#fbf9f5" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="26" y1="9.5" x2="38" y2="9.5" stroke="#fbf9f5" strokeWidth="2.8" strokeLinecap="round" />

    <ellipse cx="9" cy="27" rx="5" ry="3.2" transform="rotate(-25 9 27)" fill="#fbf9f5" />
    <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />

    <ellipse cx="21" cy="27" rx="5" ry="3.2" transform="rotate(-25 21 27)" fill="#fbf9f5" />
    <line x1="26" y1="25" x2="26" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />

    <ellipse cx="33" cy="27" rx="5" ry="3.2" transform="rotate(-25 33 27)" fill="#fbf9f5" />
    <line x1="38" y1="25" x2="38" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />
  </svg>
);

// Beamed Mixed Figure: 2 Sixteenths + 1 Eighth (1 beat in 4/4 / 3/4)
export const BeamedTwoSixteenthsAndEighth: React.FC = () => (
  <svg viewBox="0 0 46 36" className="w-10 h-8 sm:w-11 sm:h-9 overflow-visible select-none shrink-0">
    <line x1="14" y1="5" x2="38" y2="5" stroke="#fbf9f5" strokeWidth="2.8" strokeLinecap="round" />
    <line x1="14" y1="9.5" x2="26" y2="9.5" stroke="#fbf9f5" strokeWidth="2.8" strokeLinecap="round" />

    <ellipse cx="9" cy="27" rx="5" ry="3.2" transform="rotate(-25 9 27)" fill="#fbf9f5" />
    <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />

    <ellipse cx="21" cy="27" rx="5" ry="3.2" transform="rotate(-25 21 27)" fill="#fbf9f5" />
    <line x1="26" y1="25" x2="26" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />

    <ellipse cx="33" cy="27" rx="5" ry="3.2" transform="rotate(-25 33 27)" fill="#fbf9f5" />
    <line x1="38" y1="25" x2="38" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />
  </svg>
);

// Beamed Triplet Group of 3 Eighth Notes (Essential for 6/8 compound meter!)
export const BeamedEighthTriplet: React.FC = () => (
  <svg viewBox="0 0 48 36" className="w-11 h-8 sm:w-12 sm:h-9 overflow-visible select-none shrink-0">
    <line x1="14" y1="5" x2="42" y2="5" stroke="#fbf9f5" strokeWidth="2.8" strokeLinecap="round" />

    <ellipse cx="9" cy="27" rx="5" ry="3.2" transform="rotate(-25 9 27)" fill="#fbf9f5" />
    <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />

    <ellipse cx="23" cy="27" rx="5" ry="3.2" transform="rotate(-25 23 27)" fill="#fbf9f5" />
    <line x1="28" y1="25" x2="28" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />

    <ellipse cx="37" cy="27" rx="5" ry="3.2" transform="rotate(-25 37 27)" fill="#fbf9f5" />
    <line x1="42" y1="25" x2="42" y2="5" stroke="#fbf9f5" strokeWidth="1.3" />
  </svg>
);

// Individual Fine Musical Note Glyphs
export const FineMusicNote: React.FC<{ type: RhythmNoteType }> = ({ type }) => {
  switch (type) {
    case 'half':
      return (
        <svg viewBox="0 0 26 36" className="w-5 h-7 sm:w-6 sm:h-8 overflow-visible select-none shrink-0">
          <ellipse
            cx="9"
            cy="27"
            rx="5.4"
            ry="3.3"
            transform="rotate(-25 9 27)"
            fill="none"
            stroke="#fbf9f5"
            strokeWidth="1.5"
          />
          <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'dotted-half':
      return (
        <svg viewBox="0 0 30 36" className="w-6 h-7 sm:w-7 sm:h-8 overflow-visible select-none shrink-0">
          <ellipse
            cx="9"
            cy="27"
            rx="5.4"
            ry="3.3"
            transform="rotate(-25 9 27)"
            fill="none"
            stroke="#fbf9f5"
            strokeWidth="1.5"
          />
          <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="20" cy="27" r="1.8" fill="#fbf9f5" />
        </svg>
      );
    case 'quarter':
      return (
        <svg viewBox="0 0 26 36" className="w-5 h-7 sm:w-6 sm:h-8 overflow-visible select-none shrink-0">
          <ellipse
            cx="9"
            cy="27"
            rx="5.4"
            ry="3.3"
            transform="rotate(-25 9 27)"
            fill="#fbf9f5"
          />
          <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    case 'dotted-quarter':
      return (
        <svg viewBox="0 0 30 36" className="w-6 h-7 sm:w-7 sm:h-8 overflow-visible select-none shrink-0">
          <ellipse
            cx="9"
            cy="27"
            rx="5.4"
            ry="3.3"
            transform="rotate(-25 9 27)"
            fill="#fbf9f5"
          />
          <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="20" cy="27" r="1.8" fill="#fbf9f5" />
        </svg>
      );
    case 'eighth':
      return (
        <svg viewBox="0 0 26 36" className="w-5 h-7 sm:w-6 sm:h-8 overflow-visible select-none shrink-0">
          <ellipse
            cx="9"
            cy="27"
            rx="5.4"
            ry="3.3"
            transform="rotate(-25 9 27)"
            fill="#fbf9f5"
          />
          <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="14" y1="5" x2="20" y2="15" stroke="#fbf9f5" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'sixteenth':
      return (
        <svg viewBox="0 0 26 36" className="w-5 h-7 sm:w-6 sm:h-8 overflow-visible select-none shrink-0">
          <ellipse
            cx="9"
            cy="27"
            rx="5.4"
            ry="3.3"
            transform="rotate(-25 9 27)"
            fill="#fbf9f5"
          />
          <line x1="14" y1="25" x2="14" y2="5" stroke="#fbf9f5" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="14" y1="5" x2="20" y2="14" stroke="#fbf9f5" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="14" y1="10" x2="20" y2="19" stroke="#fbf9f5" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'rest-quarter':
      return (
        <svg viewBox="0 0 18 36" className="w-4 h-7 sm:w-5 sm:h-8 overflow-visible select-none shrink-0">
          <path
            d="M6 7 L11 13 L5 18 L9 22 C6 25, 6 28, 9 30"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'rest-eighth':
      return (
        <svg viewBox="0 0 18 36" className="w-4 h-7 sm:w-5 sm:h-8 overflow-visible select-none shrink-0">
          <circle cx="7" cy="14" r="1.5" fill="#f59e0b" />
          <line x1="8" y1="14" x2="12" y2="9" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="12" y1="9" x2="7" y2="22" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
};

// ============================================================================
// Types & Main Component
// ============================================================================
export interface RhythmLeaderboardEntry {
  id: string;
  name: string;
  score: number;
  streak: number;
  accuracy: number;
  bpm: number;
  difficulty: RhythmDifficulty;
  date: string;
}

interface RhythmStudioProps {
  isDe?: boolean;
}

type RhythmState = 'READY' | 'TAPPING' | 'SUMMARY';

export const RhythmStudio: React.FC<RhythmStudioProps> = ({ isDe = false }) => {
  const [difficulty, setDifficulty] = useState<RhythmDifficulty>(1);
  const [state, setState] = useState<RhythmState>('READY');
  const [currentExercise, setCurrentExercise] = useState<RhythmExercise>(RHYTHMS_LEVEL_1[0]);

  // Anti-repeat history buffer: keeps track of recently seen rhythm IDs
  const recentHistoryRef = useRef<string[]>([RHYTHMS_LEVEL_1[0].id]);

  // Repeat / Practice attempt tracking: repeating does not inflate score/streak
  const [isRepeatAttempt, setIsRepeatAttempt] = useState<boolean>(false);
  const [hasScoredThisExercise, setHasScoredThisExercise] = useState<boolean>(false);

  // 2-second cooldown on Next Rhythm button after exercise completes
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const cooldownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Audio Context
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Tap tracking
  const tapTimesRef = useRef<number[]>([]);
  const [tapsCount, setTapsCount] = useState<number>(0);
  const [padPressed, setPadPressed] = useState<boolean>(false);
  const [leftPadPressed, setLeftPadPressed] = useState<boolean>(false);
  const [rightPadPressed, setRightPadPressed] = useState<boolean>(false);

  // Performance Results
  const [detectedBpm, setDetectedBpm] = useState<number | null>(null);
  const [precisionScore, setPrecisionScore] = useState<number | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [holeToleratedMessage, setHoleToleratedMessage] = useState<string | null>(null);

  // Demo audio playing state
  const [isPlayingDemo, setIsPlayingDemo] = useState<boolean>(false);
  const demoTimersRef = useRef<NodeJS.Timeout[]>([]);

  // Scoring & Leaderboard
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<RhythmLeaderboardEntry[]>([]);
  const [userName, setUserName] = useState<string>('Drummer');

  // Load Leaderboard on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('beyondMagic_rhythmScores');
      if (stored) {
        setLeaderboard(JSON.parse(stored));
      }
    } catch {}
  }, []);

  // Clean up cooldown timer
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    return audioCtxRef.current;
  }, []);

  // Rich, resonant Japanese drum sound synthesis
  const playTaikoSound = useCallback((isLow = true) => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;

      // Membrane slap transient
      const slapOsc = ctx.createOscillator();
      const slapGain = ctx.createGain();
      slapOsc.type = 'triangle';
      slapOsc.frequency.setValueAtTime(isLow ? 340 : 440, now);
      slapOsc.frequency.exponentialRampToValueAtTime(110, now + 0.035);
      slapGain.gain.setValueAtTime(0.75, now);
      slapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      slapOsc.connect(slapGain);

      // Deep wooden body resonance
      const bodyOsc = ctx.createOscillator();
      const bodyGain = ctx.createGain();
      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(isLow ? 145 : 185, now);
      bodyOsc.frequency.exponentialRampToValueAtTime(isLow ? 60 : 82, now + 0.075);

      bodyGain.gain.setValueAtTime(0.90, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + (isLow ? 0.45 : 0.32));
      bodyOsc.connect(bodyGain);

      // Tone Sculptor
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1500, now);
      filter.frequency.exponentialRampToValueAtTime(280, now + 0.25);

      slapGain.connect(filter);
      bodyGain.connect(filter);
      filter.connect(ctx.destination);

      slapOsc.start(now);
      slapOsc.stop(now + 0.045);
      bodyOsc.start(now);
      bodyOsc.stop(now + 0.5);
    } catch {}
  }, [getAudioContext]);

  // Pick random rhythm with anti-repeat queue
  const pickRhythm = useCallback((diff: RhythmDifficulty): RhythmExercise => {
    const pool = diff === 1 ? RHYTHMS_LEVEL_1 : diff === 2 ? RHYTHMS_LEVEL_2 : RHYTHMS_LEVEL_3;
    const history = recentHistoryRef.current;

    const candidates = pool.filter(ex => !history.slice(-4).includes(ex.id));
    const selectionPool = candidates.length > 0 ? candidates : pool;

    const rIdx = Math.floor(Math.random() * selectionPool.length);
    const chosen = selectionPool[rIdx];

    recentHistoryRef.current = [...history.slice(-8), chosen.id];
    return chosen;
  }, []);

  // Reset to Ready
  const resetToReady = useCallback(() => {
    demoTimersRef.current.forEach(clearTimeout);
    demoTimersRef.current = [];
    setIsPlayingDemo(false);
    tapTimesRef.current = [];
    setTapsCount(0);
    setDetectedBpm(null);
    setPrecisionScore(null);
    setFeedbackMessage(null);
    setHoleToleratedMessage(null);
    setCooldownRemaining(0);
    if (cooldownTimerRef.current) {
      clearInterval(cooldownTimerRef.current);
      cooldownTimerRef.current = null;
    }
    setState('READY');
  }, []);

  // Switch difficulty
  const handleSwitchDifficulty = (newDiff: RhythmDifficulty) => {
    setDifficulty(newDiff);
    setIsRepeatAttempt(false);
    setHasScoredThisExercise(false);
    const newEx = pickRhythm(newDiff);
    setCurrentExercise(newEx);
    resetToReady();
  };

  // Play audio demo preview
  const playDemoPreview = () => {
    if (isPlayingDemo) {
      demoTimersRef.current.forEach(clearTimeout);
      demoTimersRef.current = [];
      setIsPlayingDemo(false);
      return;
    }

    resetToReady();
    setIsPlayingDemo(true);

    const demoTempoBpm = difficulty === 1 ? 84 : difficulty === 2 ? 96 : 108;
    const quarterMs = (60 / demoTempoBpm) * 1000;

    let cumulativeMs = 250; // brief initial delay
    const timers: NodeJS.Timeout[] = [];

    currentExercise.bars.forEach((bar) => {
      bar.notes.forEach((note) => {
        const beatDuration = bar.unit === 'quarter' ? note.duration : note.duration * 0.5;
        const noteDurationMs = beatDuration * quarterMs;

        if (!note.isRest && !note.isTiedFromPrev) {
          const t = setTimeout(() => {
            playTaikoSound(note.duration >= 1.5);
          }, cumulativeMs);
          timers.push(t);
        }

        cumulativeMs += noteDurationMs;
      });
    });

    const endTimer = setTimeout(() => {
      setIsPlayingDemo(false);
    }, cumulativeMs + 300);
    timers.push(endTimer);

    demoTimersRef.current = timers;
  };

  // Flat list of playable notes (rests and tied-over notes don't require re-striking)
  const playableNotes = currentExercise.bars
    .flatMap((b) => b.notes)
    .filter((n) => !n.isRest && !n.isTiedFromPrev);

  const totalPlayableCount = playableNotes.length;

  // Evaluate rhythm performance
  const evaluatePerformance = useCallback(() => {
    const taps = tapTimesRef.current;
    if (taps.length < 2) {
      setPrecisionScore(70);
      setDetectedBpm(90);
      setFeedbackMessage(isDe ? 'Guter Versuch! Schlage alle Noten im Takt.' : 'Good attempt! Keep a steady beat.');
      setState('SUMMARY');
      return;
    }

    const flatNotes = currentExercise.bars.flatMap((b) =>
      b.notes.map((n) => ({
        ...n,
        normalizedBeats: b.unit === 'quarter' ? n.duration : n.duration * 0.5,
      }))
    );

    const noteStrikeIntervals: number[] = [];
    let currentInterval = 0;

    for (let i = 0; i < flatNotes.length - 1; i++) {
      currentInterval += flatNotes[i].normalizedBeats;
      const nextNote = flatNotes[i + 1];
      if (!nextNote.isRest && !nextNote.isTiedFromPrev) {
        noteStrikeIntervals.push(currentInterval);
        currentInterval = 0;
      }
    }

    const expectedBeats = noteStrikeIntervals;
    const userIntervals: number[] = [];
    for (let i = 1; i < taps.length; i++) {
      userIntervals.push(taps[i] - taps[i - 1]);
    }

    let detectedHole = false;
    let effectiveUserIntervals = userIntervals;

    if (userIntervals.length < expectedBeats.length) {
      detectedHole = true;
      setHoleToleratedMessage(
        isDe 
          ? '🛡️ Klick-Lücke erkannt & toleriert! Die nachfolgenden Noten wurden nahtlos analysiert.' 
          : '🛡️ Missed tap detected & tolerated! Subsequent notes were aligned accurately.'
      );
    }

    if (effectiveUserIntervals.length === 0 || expectedBeats.length === 0) {
      setPrecisionScore(75);
      setDetectedBpm(100);
      setState('SUMMARY');
      return;
    }

    const pairsCount = Math.min(effectiveUserIntervals.length, expectedBeats.length);
    let totalUserMs = 0;
    let totalExpBeats = 0;

    for (let i = 0; i < pairsCount; i++) {
      totalUserMs += effectiveUserIntervals[i];
      totalExpBeats += expectedBeats[i];
    }

    const avgMsPerBeat = totalUserMs / Math.max(0.1, totalExpBeats);
    const measuredBpm = Math.max(40, Math.min(220, Math.round(60000 / avgMsPerBeat)));
    setDetectedBpm(measuredBpm);

    let errorAccumulator = 0;
    for (let i = 0; i < pairsCount; i++) {
      const idealMs = expectedBeats[i] * avgMsPerBeat;
      const actualMs = effectiveUserIntervals[i];
      const errorRatio = Math.abs(actualMs - idealMs) / Math.max(idealMs, 100);
      errorAccumulator += Math.min(1.0, errorRatio);
    }

    const avgErrorRatio = errorAccumulator / pairsCount;
    let calculatedPrecision = Math.round(Math.max(25, (1 - avgErrorRatio * 1.1) * 100));

    if (detectedHole) {
      calculatedPrecision = Math.max(calculatedPrecision, 72);
    }

    setPrecisionScore(calculatedPrecision);

    let earnedPoints = 0;
    let msg = '';

    if (calculatedPrecision >= 90) {
      earnedPoints = difficulty === 1 ? 150 : difficulty === 2 ? 220 : 320;
      msg = isDe 
        ? `Meisterhaft! Beeindruckende rhythmische Präzision bei ${measuredBpm} BPM.` 
        : `Virtuoso groove! Immaculate timing precision at ${measuredBpm} BPM.`;
      if (!isRepeatAttempt && !hasScoredThisExercise) {
        setStreak((s) => {
          const nextS = s + 1;
          setBestStreak((b) => Math.max(b, nextS));
          return nextS;
        });
        setScore((sc) => sc + earnedPoints);
        setHasScoredThisExercise(true);
      }
    } else if (calculatedPrecision >= 75) {
      earnedPoints = difficulty === 1 ? 100 : difficulty === 2 ? 150 : 220;
      msg = isDe 
        ? `Sehr solider Puls! Präzise Notenwerte bei ${measuredBpm} BPM.` 
        : `Great steady groove! Clean note durations at ${measuredBpm} BPM.`;
      if (!isRepeatAttempt && !hasScoredThisExercise) {
        setStreak((s) => {
          const nextS = s + 1;
          setBestStreak((b) => Math.max(b, nextS));
          return nextS;
        });
        setScore((sc) => sc + earnedPoints);
        setHasScoredThisExercise(true);
      }
    } else {
      msg = isDe 
        ? `Tempo war ${measuredBpm} BPM. Höre dir die Demo an und wiederhole die Übung!` 
        : `Pulse was ${measuredBpm} BPM. Listen to the demo and try repeating the exercise!`;
      if (!isRepeatAttempt && !hasScoredThisExercise) {
        setStreak(0);
      }
    }

    setFeedbackMessage(msg);
    setState('SUMMARY');

    // 2-second cooldown on Next Rhythm button to prevent accidental skip
    setCooldownRemaining(2.0);
    const startCooldownTime = performance.now();
    cooldownTimerRef.current = setInterval(() => {
      const elapsed = (performance.now() - startCooldownTime) / 1000;
      const remaining = Math.max(0, 2.0 - elapsed);
      setCooldownRemaining(remaining);
      if (remaining <= 0) {
        if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
      }
    }, 100);
  }, [currentExercise, difficulty, isDe, isRepeatAttempt, hasScoredThisExercise]);

  // Handle user striking the pad
  const handleUserTap = useCallback((side: 'left' | 'right' | 'key' = 'key') => {
    if (state === 'SUMMARY') {
      if (cooldownRemaining <= 0.05) {
        setIsRepeatAttempt(false);
        setHasScoredThisExercise(false);
        const newEx = pickRhythm(difficulty);
        setCurrentExercise(newEx);
        resetToReady();
      }
      return;
    }

    const now = performance.now();
    playTaikoSound(side === 'left');

    setPadPressed(true);
    if (side === 'left') setLeftPadPressed(true);
    if (side === 'right') setRightPadPressed(true);

    setTimeout(() => {
      setPadPressed(false);
      setLeftPadPressed(false);
      setRightPadPressed(false);
    }, 85);

    if (state === 'READY') {
      setState('TAPPING');
      tapTimesRef.current = [now];
      setTapsCount(1);
      return;
    }

    tapTimesRef.current.push(now);
    const newCount = tapsCount + 1;
    setTapsCount(newCount);

    if (newCount >= totalPlayableCount) {
      setTimeout(() => {
        evaluatePerformance();
      }, 250);
    }
  }, [state, cooldownRemaining, totalPlayableCount, difficulty, pickRhythm, playTaikoSound, evaluatePerformance, currentExercise, resetToReady, tapsCount]);

  // Keyboard shortcut listener: Spacebar, Enter, K, J, and Arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
        e.preventDefault();
        handleUserTap('key');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUserTap]);

  // Repeat Exercise
  const handleBeatAgain = () => {
    setIsRepeatAttempt(true);
    resetToReady();
  };

  // Next Rhythm Challenge
  const handleNextChallenge = () => {
    if (cooldownRemaining > 0.05) return;
    setIsRepeatAttempt(false);
    setHasScoredThisExercise(false);
    const newEx = pickRhythm(difficulty);
    setCurrentExercise(newEx);
    resetToReady();
  };

  // Save score to leaderboard
  const saveScoreToLeaderboard = () => {
    if (score <= 0) return;
    const entry: RhythmLeaderboardEntry = {
      id: Date.now().toString(),
      name: userName.trim() || (isDe ? 'Trommler' : 'Drummer'),
      score,
      streak: bestStreak,
      accuracy: precisionScore || 90,
      bpm: detectedBpm || 80,
      difficulty,
      date: new Date().toLocaleDateString(isDe ? 'de-DE' : 'en-US', { month: 'short', day: 'numeric' })
    };
    const updated = [entry, ...leaderboard].sort((a, b) => b.score - a.score).slice(0, 10);
    setLeaderboard(updated);
    try {
      localStorage.setItem('beyondMagic_rhythmScores', JSON.stringify(updated));
    } catch {}
  };

  // Responsive layout: 4 bars per line on desktop (>=768px), 2 bars per line on mobile/tablet (<768px)
  const [barsPerSystem, setBarsPerSystem] = useState<number>(() => {
    return typeof window !== 'undefined' && window.innerWidth >= 768 ? 4 : 2;
  });

  useEffect(() => {
    const handleResize = () => {
      setBarsPerSystem(window.innerWidth >= 768 ? 4 : 2);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const systems: {
    systemIdx: number;
    bars: {
      bar: RhythmBar;
      globalBarIdx: number;
      localBarIdx: number;
    }[];
  }[] = [];

  for (let i = 0; i < currentExercise.bars.length; i += barsPerSystem) {
    const slice = currentExercise.bars.slice(i, i + barsPerSystem);
    systems.push({
      systemIdx: Math.floor(i / barsPerSystem),
      bars: slice.map((bar, localIdx) => ({
        bar,
        globalBarIdx: i + localIdx,
        localBarIdx: localIdx,
      })),
    });
  }

  // Smart classical engraving note grouping
  const renderBarNotes = (bar: RhythmBar, globalBarIdx: number, systemIdx: number) => {
    const elements: React.ReactNode[] = [];
    const notes = bar.notes;
    const isCompoundMeter = bar.timeSignature === '6/8' || bar.timeSignature === '9/8' || bar.timeSignature === '12/8';
    let i = 0;

    while (i < notes.length) {
      const note = notes[i];

      // 1. In compound meter (6/8): group 3 consecutive eighth notes into BeamedEighthTriplet!
      if (
        isCompoundMeter &&
        i + 2 < notes.length &&
        notes[i].type === 'eighth' &&
        notes[i + 1].type === 'eighth' &&
        notes[i + 2].type === 'eighth' &&
        !notes[i].tiedToNext &&
        !notes[i + 1].tiedToNext
      ) {
        elements.push(
          <div key={`triplet-${i}`} className="relative flex items-center justify-center shrink-0">
            <BeamedEighthTriplet />
          </div>
        );
        i += 3;
        continue;
      }

      // 2. Mixed figure: 1 Eighth + 2 Sixteenths (1 beat in 4/4 / 3/4)
      if (
        i + 2 < notes.length &&
        notes[i].type === 'eighth' &&
        notes[i + 1].type === 'sixteenth' &&
        notes[i + 2].type === 'sixteenth' &&
        !notes[i].tiedToNext &&
        !notes[i + 1].tiedToNext
      ) {
        elements.push(
          <div key={`e-16-16-${i}`} className="relative flex items-center justify-center shrink-0">
            <BeamedEighthAndTwoSixteenths />
          </div>
        );
        i += 3;
        continue;
      }

      // 3. Mixed figure: 2 Sixteenths + 1 Eighth (1 beat in 4/4 / 3/4)
      if (
        i + 2 < notes.length &&
        notes[i].type === 'sixteenth' &&
        notes[i + 1].type === 'sixteenth' &&
        notes[i + 2].type === 'eighth' &&
        !notes[i].tiedToNext &&
        !notes[i + 1].tiedToNext
      ) {
        elements.push(
          <div key={`16-16-e-${i}`} className="relative flex items-center justify-center shrink-0">
            <BeamedTwoSixteenthsAndEighth />
          </div>
        );
        i += 3;
        continue;
      }

      // 4. Quartet of 4 sixteenths
      if (
        i + 3 < notes.length &&
        notes[i].type === 'sixteenth' &&
        notes[i + 1].type === 'sixteenth' &&
        notes[i + 2].type === 'sixteenth' &&
        notes[i + 3].type === 'sixteenth' &&
        !notes[i].tiedToNext &&
        !notes[i + 1].tiedToNext &&
        !notes[i + 2].tiedToNext
      ) {
        elements.push(
          <div key={`beam4-${i}`} className="relative flex items-center justify-center shrink-0">
            <BeamedSixteenthQuartet />
          </div>
        );
        i += 4;
        continue;
      }

      // 5. Duo of 2 sixteenths
      if (
        i + 1 < notes.length &&
        notes[i].type === 'sixteenth' &&
        notes[i + 1].type === 'sixteenth' &&
        !notes[i].tiedToNext
      ) {
        elements.push(
          <div key={`beam2-${i}`} className="relative flex items-center justify-center shrink-0">
            <BeamedSixteenthDuo />
          </div>
        );
        i += 2;
        continue;
      }

      // 6. Pair of 2 eighth notes
      if (
        i + 1 < notes.length &&
        notes[i].type === 'eighth' &&
        notes[i + 1].type === 'eighth' &&
        !notes[i].tiedToNext
      ) {
        elements.push(
          <div key={`beameight-${i}`} className="relative flex items-center justify-center shrink-0">
            <BeamedEighthPair />
          </div>
        );
        i += 2;
        continue;
      }

      // 7. Standalone note with SINGLE continuous liaison arch
      elements.push(
        <div key={`single-${i}`} className={`relative flex items-center justify-center shrink-0 ${note.isTiedFromPrev ? 'opacity-80' : ''}`}>
          <FineMusicNote type={note.type} />

          {/* SINGLE continuous tie arc connecting forward across to next note */}
          {note.tiedToNext && (
            <div className="absolute -bottom-2.5 left-2 pointer-events-none z-30">
              <svg className="w-12 sm:w-16 h-3.5 overflow-visible" viewBox="0 0 48 14">
                <path
                  d="M 2 2 Q 24 13 46 2"
                  fill="none"
                  stroke="#c49750"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </div>
      );
      i++;
    }

    return elements;
  };

  return (
    <div id="rhythm-studio-console" className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto select-none overflow-x-hidden">
      {/* Console Frame */}
      <div className="relative rounded-2xl bg-[#121520] border border-[#2b3347] shadow-[0_12px_45px_rgba(0,0,0,0.6)] p-3 sm:p-5 overflow-hidden w-full box-border">
        
        {/* Mood Ambient Glow */}
        <div 
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-20 transition-colors duration-500"
          style={{ backgroundColor: state === 'SUMMARY' ? '#10b981' : state === 'TAPPING' ? '#ffd56b' : '#c49750' }}
        />

        {/* 1. Header Bar: Level Tabs + Top 10 High Scores */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 pb-2.5 mb-2.5 border-b border-white/10 w-full">
          <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
            {([1, 2, 3] as RhythmDifficulty[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => handleSwitchDifficulty(lvl)}
                className={`flex-1 py-1 sm:py-1.5 px-1.5 sm:px-2 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0 ${
                  difficulty === lvl
                    ? 'bg-gradient-to-r from-[#c49750] to-[#ffd56b] text-black font-extrabold shadow-md shadow-[#c49750]/20'
                    : 'bg-[#0e111a] text-[#8c887d] hover:text-[#fbf9f5] border border-white/5 hover:border-white/10'
                }`}
                title={lvl === 1 ? 'Level 1: 4 Takte' : lvl === 2 ? 'Level 2: 8 Takte' : 'Level 3: 12 Takte'}
              >
                <span className="text-xs shrink-0">{lvl === 1 ? '🌱' : lvl === 2 ? '🌿' : '🌳'}</span>
                <span className="font-bold text-[11px] sm:text-xs whitespace-nowrap">
                  {lvl === 1 
                    ? (isDe ? 'Stufe 1 (4 Takte)' : 'Level 1 (4 Bars)')
                    : lvl === 2 
                    ? (isDe ? 'Stufe 2 (8 Takte)' : 'Level 2 (8 Bars)')
                    : (isDe ? 'Stufe 3 (12 Takte)' : 'Level 3 (12 Bars)')}
                </span>
              </button>
            ))}
          </div>

          {/* Top 10 High Scores */}
          <button
            type="button"
            onClick={() => setShowLeaderboard(true)}
            className="shrink-0 ml-1.5 sm:ml-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#181c28] hover:bg-[#222738] border border-[#c49750]/60 text-[#fbf9f5] flex items-center gap-1.5 text-xs font-mono transition-all cursor-pointer shadow-sm group"
            title={isDe ? 'Top 10 Bestenliste' : 'Top 10 High Scores'}
          >
            <Trophy className="w-3.5 h-3.5 text-[#c49750] group-hover/scale-110 transition-transform shrink-0" />
            <span className="font-semibold text-[#f5eedf] text-[11px] sm:text-xs whitespace-nowrap">Top 10</span>
          </button>
        </div>

        {/* 2. HUD Bar: Streak, Points, Practice Notice & Demo */}
        <div className="flex items-center justify-between gap-1.5 pb-2.5 mb-2 border-b border-white/10 text-xs font-mono w-full">
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

          {/* Right: Demo preview & Restart */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isRepeatAttempt && (
              <span className="hidden md:inline-flex px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/40 text-[10px] text-amber-300">
                {isDe ? 'Übungswiederholung' : 'Practice Mode'}
              </span>
            )}

            <button
              type="button"
              onClick={playDemoPreview}
              className={`px-2.5 py-1 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlayingDemo 
                  ? 'bg-amber-950/70 border-amber-500/50 text-amber-300' 
                  : 'bg-[#181c28] border-white/10 text-[#dedacf] hover:text-white'
              }`}
              title={isDe ? 'Klangbeispiel anhören' : 'Listen to demo'}
            >
              <Volume2 className="w-3.5 h-3.5 text-[#c49750]" />
              <span className="text-[11px]">{isPlayingDemo ? (isDe ? 'Spielt...' : 'Playing...') : 'Demo'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setScore(0);
                setStreak(0);
                setIsRepeatAttempt(false);
                setHasScoredThisExercise(false);
                resetToReady();
              }}
              className="p-1 rounded-lg text-[#8c887d] hover:text-white bg-[#0b0d14] border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              title={isDe ? 'Neu starten' : 'Restart'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. PURE CLASSICAL SHEET MUSIC CONTAINER: Stacked Systems In One Unified Frame */}
        <div className="my-2 p-3 sm:p-4 rounded-2xl bg-[#080a10] border border-[#c49750]/30 shadow-[inset_0_2px_20px_rgba(0,0,0,0.85)] text-center w-full box-border">
          
          <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-[#8c887d]">
            <span className="text-[#c49750] font-semibold flex items-center gap-1.5 truncate max-w-[65%] sm:max-w-none text-left">
              <Music className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{isDe ? currentExercise.nameDe : currentExercise.name}</span>
            </span>

            <span className="shrink-0">
              {state === 'READY' ? (
                <span className="text-[#a78bfa]">
                  {isDe ? 'Startbereit: Beginne in deinem Tempo!' : 'Ready: Start at your own tempo!'}
                </span>
              ) : state === 'TAPPING' ? (
                <span className="text-[#ffd56b] font-bold">
                  {isDe ? `● Schlag ${tapsCount} von ${totalPlayableCount}` : `● Note ${tapsCount} of ${totalPlayableCount}`}
                </span>
              ) : (
                <span className="text-emerald-400 font-bold">
                  {isDe ? 'Abgeschlossen' : 'Completed'}
                </span>
              )}
            </span>
          </div>

          {/* Unified Score Manuscript Plate: Stacked systems with 100% equal width and continuous 5 staff lines */}
          <div className="flex flex-col gap-3.5 sm:gap-4 w-full py-1">
            {systems.map((system) => {
              const isLastSystem = system.systemIdx === systems.length - 1;

              return (
                <div 
                  key={system.systemIdx} 
                  className="relative w-full flex items-center h-16 sm:h-18 px-2 sm:px-4 bg-[#05070c] rounded-xl border border-white/5 select-none box-border"
                >
                  {/* 5 Classical Golden Staff Lines spanning 100% full width */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 sm:h-9 flex flex-col justify-between pointer-events-none opacity-25 px-2">
                    <div className="w-full h-[1px] bg-[#c49750]" />
                    <div className="w-full h-[1px] bg-[#c49750]" />
                    <div className="w-full h-[1px] bg-[#c49750]" />
                    <div className="w-full h-[1px] bg-[#c49750]" />
                    <div className="w-full h-[1px] bg-[#c49750]" />
                  </div>

                  {/* Percussion Clef at start of staff line */}
                  <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 mr-1.5 sm:mr-3 z-10 select-none">
                    <span className="w-0.5 sm:w-1 h-7 sm:h-8 bg-[#c49750]/80 rounded-sm" />
                    <span className="w-0.5 sm:w-1 h-7 sm:h-8 bg-[#c49750]/80 rounded-sm" />
                  </div>

                  {/* Equal-Width Measures in this System (Partitioned Equally) */}
                  <div className="relative flex-1 flex items-center h-full z-10">
                    {system.bars.map((barInfo) => {
                      const prevBar = barInfo.globalBarIdx > 0 ? currentExercise.bars[barInfo.globalBarIdx - 1] : null;
                      const showTimeSig = barInfo.globalBarIdx === 0 || (prevBar && prevBar.timeSignature !== barInfo.bar.timeSignature);
                      const [numerator, denominator] = barInfo.bar.timeSignature.split('/');

                      return (
                        <div 
                          key={barInfo.globalBarIdx} 
                          className="flex-1 flex items-center justify-between h-full px-1 sm:px-2 relative"
                        >
                          {/* Time Signature - Scaled inside staff lines */}
                          {showTimeSig && (
                            <div className="flex flex-col items-center justify-center font-serif text-sm sm:text-base font-black text-[#fbf9f5] leading-[0.8] tracking-tight mr-1 select-none shrink-0 drop-shadow-md">
                              <span>{numerator}</span>
                              <span>{denominator}</span>
                            </div>
                          )}

                          {/* Notes inside this measure (tight and clustered, no huge empty gaps) */}
                          <div className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2.5 px-0.5 overflow-visible">
                            {renderBarNotes(barInfo.bar, barInfo.globalBarIdx, system.systemIdx)}
                          </div>

                          {/* Barline between bars in this system */}
                          {barInfo.localBarIdx < system.bars.length - 1 && (
                            <div className="w-[1px] h-7 sm:h-8 bg-white/30 shrink-0 ml-1 select-none" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* End of System Barline */}
                  <div className="flex items-center gap-0.5 shrink-0 ml-1 sm:ml-2 z-10 select-none">
                    {isLastSystem ? (
                      <>
                        <div className="w-[1.5px] h-7 sm:h-8 bg-white/40" />
                        <div className="w-1 h-7 sm:h-8 bg-[#c49750]/90 rounded-sm" />
                      </>
                    ) : (
                      <div className="w-[1.5px] h-7 sm:h-8 bg-white/35" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] font-serif italic text-[#dedacf]/80 max-w-sm mx-auto text-center mt-2">
            “{isDe ? currentExercise.descriptionDe : currentExercise.description}”
          </p>
        </div>

        {/* 4. PRIMARY ACTION DECK: Tapping Deck DURING exercise -> Morphing into "Next Rhythm" AFTER */}
        <div className="my-2 space-y-1.5">
          {state === 'SUMMARY' ? (
            /* Summary Phase: The Primary Striking Button Morphing into NEXT RHYTHM with 2-Second Cooldown */
            <div className="w-full">
              <button
                type="button"
                disabled={cooldownRemaining > 0.05}
                onClick={handleNextChallenge}
                className={`w-full h-12 sm:h-14 rounded-xl sm:rounded-2xl border flex items-center justify-center gap-2 sm:gap-3 transition-all duration-200 select-none cursor-pointer ${
                  cooldownRemaining > 0.05
                    ? 'bg-[#151822] text-[#8c887d] border-white/10 opacity-70 cursor-not-allowed shadow-inner'
                    : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-extrabold border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-[0.99] animate-pulse'
                }`}
              >
                {cooldownRemaining > 0.05 ? (
                  <>
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                    <span className="text-xs sm:text-sm font-mono font-bold">
                      {isDe 
                        ? `Nächster Rhythmus (in ${Math.ceil(cooldownRemaining)}s...)` 
                        : `Next Rhythm (in ${Math.ceil(cooldownRemaining)}s...)`}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-base sm:text-xl">✨</span>
                    <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-wider text-black">
                      {isDe ? 'Nächster Rhythmus' : 'Next Rhythm'}
                    </span>
                    <ChevronRight className="w-4 h-4 text-black" />
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Tapping Phase: Striking Pad */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleUserTap('left');
                }}
                className={`h-24 sm:h-28 rounded-2xl border flex flex-col items-center justify-center gap-1 select-none cursor-pointer transition-all ${
                  leftPadPressed
                    ? 'bg-gradient-to-r from-[#c49750] to-[#ffd56b] text-black scale-95 shadow-lg shadow-[#c49750]/30'
                    : 'bg-[#151926] hover:bg-[#1d2334] text-[#dedacf] border-white/10 active:border-[#c49750]'
                }`}
              >
                <span className="text-3xl">🥁</span>
                <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider">
                  {isDe ? 'Linke Hand (Bass)' : 'Left Hand (Bass)'}
                </span>
                <span className="text-[10px] font-mono text-[#8c887d]">
                  {isDe ? 'Klick oder Leertaste / J' : 'Click or Space / J'}
                </span>
              </button>

              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleUserTap('right');
                }}
                className={`h-24 sm:h-28 rounded-2xl border flex flex-col items-center justify-center gap-1 select-none cursor-pointer transition-all ${
                  rightPadPressed
                    ? 'bg-gradient-to-r from-[#ffd56b] to-[#c49750] text-black scale-95 shadow-lg shadow-[#ffd56b]/30'
                    : 'bg-[#151926] hover:bg-[#1d2334] text-[#dedacf] border-white/10 active:border-[#ffd56b]'
                }`}
              >
                <span className="text-3xl">🥁</span>
                <span className="text-xs sm:text-sm font-mono font-bold uppercase tracking-wider">
                  {isDe ? 'Rechte Hand (Snare)' : 'Right Hand (Snare)'}
                </span>
                <span className="text-[10px] font-mono text-[#8c887d]">
                  {isDe ? 'Klick oder Enter / K' : 'Click or Enter / K'}
                </span>
              </button>
            </div>
          )}

          {/* Practice Repeat Exercise Link */}
          {state === 'SUMMARY' && (
            <div className="flex items-center justify-center pt-1.5">
              <button
                type="button"
                onClick={handleBeatAgain}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#1c2233] hover:bg-[#252e46] border border-[#c49750]/50 text-xs sm:text-sm font-mono font-bold text-[#fbf9f5] hover:text-[#ffd56b] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <RotateCcw className="w-4 h-4 text-[#c49750]" />
                <span>{isDe ? 'Übung wiederholen' : 'Repeat exercise'}</span>
              </button>
            </div>
          )}
        </div>

        {/* 5. Performance Summary Dashboard */}
        {state === 'SUMMARY' && (
          <div className="mt-2.5 p-3.5 sm:p-4 rounded-xl bg-[#0b0e17] border border-white/10 space-y-2.5 text-left animate-fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-mono">
              <span className="text-[#ffd56b] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isDe ? 'Rhythmische Analyse' : 'Rhythmic Precision Analysis'}</span>
              </span>
              <span className="text-[11px] text-[#8c887d]">
                {detectedBpm ? `${detectedBpm} BPM` : ''}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded-lg bg-[#141926] border border-white/5">
                <span className="text-[10px] font-mono text-[#8c887d] block uppercase tracking-wider">
                  {isDe ? 'Präzision' : 'Accuracy'}
                </span>
                <span className={`text-xl sm:text-2xl font-mono font-extrabold ${
                  (precisionScore || 0) >= 85 ? 'text-emerald-400' : (precisionScore || 0) >= 70 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {precisionScore}%
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-[#141926] border border-white/5">
                <span className="text-[10px] font-mono text-[#8c887d] block uppercase tracking-wider">
                  {isDe ? 'Tempo' : 'Tempo'}
                </span>
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-[#38bdf8]">
                  {detectedBpm} <span className="text-xs text-[#8c887d]">BPM</span>
                </span>
              </div>
            </div>

            {holeToleratedMessage && (
              <p className="text-[11px] font-mono text-amber-300/90 leading-tight bg-amber-950/30 p-2 rounded-lg border border-amber-500/20">
                {holeToleratedMessage}
              </p>
            )}

            {feedbackMessage && (
              <p className="text-xs font-serif text-[#dedacf] leading-relaxed">
                {feedbackMessage}
              </p>
            )}
          </div>
        )}

        {/* 6. Top 10 High Scores Modal */}
        {showLeaderboard && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowLeaderboard(false);
            }}
          >
            <div className="relative w-full max-w-md rounded-2xl bg-[#121622] border border-[#c49750]/50 p-5 shadow-2xl text-left">
              <button
                type="button"
                onClick={() => setShowLeaderboard(false)}
                className="absolute top-3.5 right-3.5 p-1 rounded-lg text-[#8c887d] hover:text-white bg-[#181c28] border border-white/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c49750] mb-2">
                <Trophy className="w-4 h-4 text-[#c49750]" />
                <span>{isDe ? 'Top 10 Rhythmus-Rangliste' : 'Top 10 Rhythm Leaderboard'}</span>
              </div>

              {/* Save current score form */}
              {score > 0 && (
                <div className="my-3 p-3 rounded-xl bg-[#0a0d14] border border-white/5 space-y-2">
                  <span className="text-[11px] font-mono text-[#8c887d] block">
                    {isDe ? `Dein Punktestand: ${score} Punkte (${bestStreak} Serie)` : `Your Score: ${score} pts (${bestStreak} streak)`}
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder={isDe ? 'Dein Name' : 'Your Name'}
                      maxLength={18}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#141926] border border-white/10 text-xs font-mono text-white focus:outline-none focus:border-[#c49750]"
                    />
                    <button
                      type="button"
                      onClick={saveScoreToLeaderboard}
                      className="px-3 py-1.5 rounded-lg bg-[#c49750] hover:bg-[#ffd56b] text-black font-mono font-bold text-xs cursor-pointer transition-colors"
                    >
                      {isDe ? 'Speichern' : 'Save'}
                    </button>
                  </div>
                </div>
              )}

              {/* Scores List */}
              <div className="space-y-1.5 max-h-60 overflow-y-auto no-scrollbar pt-1">
                {leaderboard.length === 0 ? (
                  <p className="text-xs font-mono text-[#8c887d] text-center py-4">
                    {isDe ? 'Noch keine Einträge. Trommle deinen ersten Rhythmus!' : 'No entries yet. Strike your first rhythm!'}
                  </p>
                ) : (
                  leaderboard.map((entry, idx) => (
                    <div 
                      key={entry.id} 
                      className={`flex items-center justify-between p-2 rounded-lg text-xs font-mono ${
                        idx === 0 
                          ? 'bg-[#c49750]/15 border border-[#c49750]/40 text-[#ffd56b]' 
                          : 'bg-[#141926] border border-white/5 text-[#dedacf]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 font-bold text-center">{idx + 1}.</span>
                        <span className="font-semibold">{entry.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#38bdf8]">{entry.bpm} BPM</span>
                        <span className="font-bold text-emerald-400">{entry.score} pts</span>
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
