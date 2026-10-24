import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Shuffle, 
  Trophy, 
  ArrowRight,
  Flame,
  Timer,
  Sparkles,
  Award,
  Medal,
  X,
  History
} from 'lucide-react';
import { MusicalScoreChord } from './MusicalScoreChord';

export interface EarTrainingChordItem {
  id: string;
  name: string;
  chordType: string;
  chordTypeDe: string;
  voicingLabel: string;
  archetype: string;
  archetypeDe: string;
  frequencies: number[];
  notes: string[];
  color: string;
  tensionPercentage: number;
}

interface EarTrainingStudioProps {
  chords: EarTrainingChordItem[];
  playChordFrequencies: (freqs: number[], soundMode: 'piano' | 'synth', arpeggiate?: boolean) => void;
  stopAudio: (immediate?: boolean) => void;
  isPlaying: boolean;
  soundMode: 'piano' | 'synth';
  isDe?: boolean;
}

export interface LeaderboardEntry {
  id: string;
  rank?: number;
  score: number;
  timeSeconds: number;
  avgReactionTime: number; // in seconds
  mistakes: number;
  accuracy: number;
  date: string;
}

// Transpose semitone names (Always random root)
const SEMITONE_OFFSETS = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
const TARGET_STREAK = 10;

// Note transposition utilities
const MIDI_NOTE_NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

function noteToMidi(noteStr: string): number {
  const match = noteStr.match(/^([A-G])(b|#)?([1-5])$/);
  if (!match) return 60;
  const step = match[1];
  const acc = match[2] || '';
  const oct = parseInt(match[3], 10);
  const base: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  let m = (oct + 1) * 12 + base[step];
  if (acc === 'b') m -= 1;
  if (acc === '#') m += 1;
  return m;
}

function midiToNote(midi: number): string {
  const noteIndex = ((midi % 12) + 12) % 12;
  const oct = Math.floor(midi / 12) - 1;
  return `${MIDI_NOTE_NAMES[noteIndex]}${oct}`;
}

function transposeNotes(notes: string[], shift: number): string[] {
  if (shift === 0) return notes;
  return notes.map(n => midiToNote(noteToMidi(n) + shift));
}

// Format seconds into MM:SS
function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Format seconds into friendly speech like "1m 14s"
function formatTimeFriendly(totalSeconds: number, isDe: boolean): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = (totalSeconds % 60).toFixed(1);
  if (mins === 0) {
    return isDe ? `${secs} Sek.` : `${secs}s`;
  }
  return isDe ? `${mins} Min. ${secs} Sek.` : `${mins}m ${secs}s`;
}

// Benchmark records for new visitors
const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', score: 11420, timeSeconds: 18.2, avgReactionTime: 1.8, mistakes: 0, accuracy: 100, date: 'Oct 24' },
  { id: '2', score: 10650, timeSeconds: 22.4, avgReactionTime: 2.2, mistakes: 0, accuracy: 100, date: 'Oct 24' },
  { id: '3', score: 9840, timeSeconds: 26.5, avgReactionTime: 2.6, mistakes: 0, accuracy: 100, date: 'Oct 23' },
  { id: '4', score: 9150, timeSeconds: 31.0, avgReactionTime: 2.9, mistakes: 1, accuracy: 91, date: 'Oct 23' },
  { id: '5', score: 8640, timeSeconds: 35.8, avgReactionTime: 3.3, mistakes: 1, accuracy: 91, date: 'Oct 22' },
  { id: '6', score: 7920, timeSeconds: 42.1, avgReactionTime: 3.8, mistakes: 2, accuracy: 83, date: 'Oct 21' },
];

export const EarTrainingStudio: React.FC<EarTrainingStudioProps> = ({
  chords,
  playChordFrequencies,
  stopAudio,
  isPlaying,
  soundMode,
  isDe = false
}) => {
  const [currentChordIndex, setCurrentChordIndex] = useState<number>(0);
  const [semitoneShift, setSemitoneShift] = useState<number>(0);
  const [playbackStyle, setPlaybackStyle] = useState<'block' | 'arpeggio'>('block');
  const [options, setOptions] = useState<EarTrainingChordItem[]>([]);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // 10-Streak Session Tracking
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [mistakesInCurrentRun, setMistakesInCurrentRun] = useState<number>(0);
  const [accumulatedStreakTime, setAccumulatedStreakTime] = useState<number>(0);
  const [streakPointsEarned, setStreakPointsEarned] = useState<number[]>([]);
  const [hasCompleted10, setHasCompleted10] = useState<boolean>(false);
  const [lastRunResult, setLastRunResult] = useState<LeaderboardEntry | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState<boolean>(false);

  // Per-Chord Recognition Timer State
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [roundElapsedSec, setRoundElapsedSec] = useState<number>(0);
  const [lastChordReactionTime, setLastChordReactionTime] = useState<number | null>(null);

  // All-time Top 10 Leaderboard State
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem('beyondMagic_top10EarScores');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_LEADERBOARD;
  });
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);

  const roundStartTimeRef = useRef<number>(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentChord = chords[currentChordIndex] || chords[0];
  const transposedNotes = transposeNotes(currentChord.notes, semitoneShift);

  // Live timer interval: Starts when audio begins, stops when answered
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && !hasAnswered) {
      interval = setInterval(() => {
        if (roundStartTimeRef.current > 0) {
          const elapsed = (Date.now() - roundStartTimeRef.current) / 1000;
          setRoundElapsedSec(elapsed);
        }
      }, 50);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, hasAnswered]);

  // Calculate transposed frequencies
  const getTransposedFreqs = useCallback((chord: EarTrainingChordItem, shift: number) => {
    if (shift === 0) return chord.frequencies;
    const ratio = Math.pow(2, shift / 12);
    return chord.frequencies.map(f => Number((f * ratio).toFixed(2)));
  }, []);

  // Set up a new challenge round
  const setupNewRound = useCallback(() => {
    stopAudio(true);
    setSelectedAnswerId(null);
    setHasAnswered(false);
    setIsCorrect(null);
    setLastChordReactionTime(null);
    setRoundElapsedSec(0);
    setIsTimerRunning(false);
    roundStartTimeRef.current = 0;

    // Pick a random chord
    const nextIndex = Math.floor(Math.random() * chords.length);
    setCurrentChordIndex(nextIndex);

    // Pick a random transposition shift (always random root!)
    const nextShift = SEMITONE_OFFSETS[Math.floor(Math.random() * SEMITONE_OFFSETS.length)];
    setSemitoneShift(nextShift);

    const targetChord = chords[nextIndex];

    // Build 4 multiple choice options including the target
    const distractors = chords
      .filter(c => c.id !== targetChord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const roundOptions = [targetChord, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(roundOptions);

    // Auto-play the new chord with a tiny delay and start the timer when sound begins
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    autoPlayTimerRef.current = setTimeout(() => {
      const freqs = targetChord.frequencies.map(f => Number((f * Math.pow(2, nextShift / 12)).toFixed(2)));
      playChordFrequencies(freqs, soundMode, playbackStyle === 'arpeggio');

      // The timer begins the instant the chord is played!
      roundStartTimeRef.current = Date.now();
      setIsTimerRunning(true);
    }, 160);
  }, [chords, playbackStyle, playChordFrequencies, soundMode, stopAudio]);

  // Restart 10-streak challenge
  const handleRestartChallenge = () => {
    setStreak(0);
    setMistakesInCurrentRun(0);
    setAccumulatedStreakTime(0);
    setStreakPointsEarned([]);
    setHasCompleted10(false);
    setIsNewHighScore(false);
    setLastRunResult(null);
    setupNewRound();
  };

  // Initial mount setup
  useEffect(() => {
    if (chords.length > 0 && options.length === 0) {
      setupNewRound();
    }
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [chords.length, options.length, setupNewRound]);

  // Replay current challenge sound
  const handleListen = useCallback((styleOverride?: 'block' | 'arpeggio') => {
    const style = styleOverride || playbackStyle;
    const freqs = getTransposedFreqs(currentChord, semitoneShift);
    playChordFrequencies(freqs, soundMode, style === 'arpeggio');

    // If timer wasn't started yet, ensure it is running
    if (!hasAnswered && roundStartTimeRef.current === 0) {
      roundStartTimeRef.current = Date.now();
      setIsTimerRunning(true);
    }
  }, [currentChord, getTransposedFreqs, hasAnswered, playbackStyle, playChordFrequencies, semitoneShift, soundMode]);

  // Handle user's selection
  const handleSelectAnswer = (option: EarTrainingChordItem) => {
    if (hasAnswered) return;

    // Stop timer immediately at the exact moment of answering
    const now = Date.now();
    const reactionTime = roundStartTimeRef.current > 0 
      ? Math.max(0.1, (now - roundStartTimeRef.current) / 1000)
      : 1.0;

    setIsTimerRunning(false);
    setLastChordReactionTime(reactionTime);
    setRoundElapsedSec(reactionTime);
    setSelectedAnswerId(option.id);
    setHasAnswered(true);

    const correct = option.id === currentChord.id;
    setIsCorrect(correct);

    if (correct) {
      // Speed scoring formula: faster recognition = more points (max 1,200 pts per chord)
      const chordPoints = Math.max(200, Math.round(1250 - reactionTime * 85));
      const nextStreak = streak + 1;
      const nextAccumulatedTime = accumulatedStreakTime + reactionTime;
      const nextPoints = [...streakPointsEarned, chordPoints];

      setStreak(nextStreak);
      setAccumulatedStreakTime(nextAccumulatedTime);
      setStreakPointsEarned(nextPoints);

      if (nextStreak > bestStreak) {
        setBestStreak(nextStreak);
      }

      // Check if user completed the 10-streak challenge!
      if (nextStreak >= TARGET_STREAK && !hasCompleted10) {
        setHasCompleted10(true);

        // System formula: takes into consideration both total recognition time and mistakes count!
        // Points from speed minus mistake penalties
        const totalRawPoints = nextPoints.reduce((acc, p) => acc + p, 0);
        const mistakePenalty = mistakesInCurrentRun * 350;
        const finalCompositeScore = Math.max(500, Math.round(totalRawPoints - mistakePenalty));
        const avgReaction = Number((nextAccumulatedTime / TARGET_STREAK).toFixed(2));
        const totalAttempts = TARGET_STREAK + mistakesInCurrentRun;
        const accuracy = Math.round((TARGET_STREAK / totalAttempts) * 100);

        const newResult: LeaderboardEntry = {
          id: Date.now().toString(),
          score: finalCompositeScore,
          timeSeconds: Number(nextAccumulatedTime.toFixed(1)),
          avgReactionTime: avgReaction,
          mistakes: mistakesInCurrentRun,
          accuracy,
          date: new Date().toLocaleDateString(isDe ? 'de-DE' : 'en-US', { day: 'numeric', month: 'short' })
        };

        setLastRunResult(newResult);

        // Update Leaderboard Top 10
        setLeaderboard((prevBoard) => {
          const updated = [...prevBoard, newResult]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

          try {
            localStorage.setItem('beyondMagic_top10EarScores', JSON.stringify(updated));
          } catch {}

          const isTop3 = updated.slice(0, 3).some(item => item.id === newResult.id);
          setIsNewHighScore(isTop3);
          return updated;
        });
      }
    } else {
      // Mistake penalty: recorded in mistake count
      setMistakesInCurrentRun(prev => prev + 1);
      // Mistake breaks the active streak toward 10
      setStreak(0);
      setAccumulatedStreakTime(0);
      setStreakPointsEarned([]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Rules & Real-Time Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-[#121622] border border-[#232a3b] shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c49750] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isDe ? 'GEHÖRBILDUNG · HARMONISCHE FARBEN' : 'EAR TRAINING · HARMONIC COLORS'}</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-serif text-[#fbf9f5] font-light">
            {isDe ? 'Erkenne die Klangfarbe des Akkords' : 'Identify the Harmonic Chord Color'}
          </h4>
          <p className="text-xs text-[#a09c91] font-light mt-1 max-w-xl leading-relaxed">
            {isDe 
              ? 'Immer zufällige Grundtöne: Trainiere dein Gehör auf Klangfarbe, Intervallspannung und Gravitation. Schnelle Erkennung und null Fehler bringen die höchste Punktzahl.' 
              : 'Always random roots: Train your ear on emotional color, tension, and interval density. Rapid recognition and zero mistakes produce the highest all-time score.'}
          </p>
        </div>

        {/* Live Counters & Top 10 High Scores Button */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
          
          {/* 10-Streak Counter */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0c0e15] border border-white/5 text-center">
            <Flame className={`w-4 h-4 ${streak > 0 ? 'text-[#f59e0b] animate-bounce' : 'text-[#6e6a60]'}`} />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#8c887d] flex items-center justify-between gap-1">
                <span>{isDe ? 'Serie' : 'Streak'}</span>
                <span className="text-[9px] text-[#c49750]">{streak}/{TARGET_STREAK}</span>
              </div>
              <div className="text-sm font-mono font-bold text-[#fbf9f5]">
                {streak} <span className="text-[10px] font-normal text-[#8c887d]">({isDe ? 'Rekord' : 'Best'} {bestStreak})</span>
              </div>
            </div>
          </div>

          {/* Mistakes Counter */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0c0e15] border border-white/5 text-center">
            <XCircle className={`w-4 h-4 ${mistakesInCurrentRun > 0 ? 'text-rose-400' : 'text-[#6e6a60]'}`} />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#8c887d]">
                {isDe ? 'Fehler' : 'Mistakes'}
              </div>
              <div className="text-sm font-mono font-bold text-[#fbf9f5]">
                <span className={mistakesInCurrentRun > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                  {mistakesInCurrentRun}
                </span>
              </div>
            </div>
          </div>

          {/* Leaderboard Button */}
          <button
            type="button"
            onClick={() => setShowLeaderboard(prev => !prev)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#171b26] hover:bg-[#202636] border border-[#c49750]/40 text-[#fbf9f5] transition-all cursor-pointer shadow-md group"
            title={isDe ? 'Allzeit-Bestenliste der Top 10 Scores ansehen' : 'View all-time Top 10 high scores'}
          >
            <Trophy className="w-4 h-4 text-[#c49750] group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#c49750]">
                {isDe ? 'Bestenliste' : 'Leaderboard'}
              </div>
              <div className="text-xs font-mono font-bold text-white flex items-center gap-1">
                <span>Top 10</span>
                <span className="text-[10px] text-[#8c887d]">({leaderboard[0]?.score?.toLocaleString() || '11,420'})</span>
              </div>
            </div>
          </button>

        </div>
      </div>

      {/* Top 10 All-Time Best Scores Drawer / Modal */}
      {showLeaderboard && (
        <div className="p-6 rounded-2xl bg-[#0d1017] border border-[#c49750]/40 shadow-2xl relative overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <Medal className="w-5 h-5 text-[#c49750]" />
              <h5 className="font-serif text-lg sm:text-xl text-[#fbf9f5] font-light">
                {isDe ? 'Allzeit-Bestenliste (Top 10 Scores)' : 'All-Time Best Scores (Top 10)'}
              </h5>
            </div>
            <button
              type="button"
              onClick={() => setShowLeaderboard(false)}
              className="p-1.5 rounded-lg text-[#8c887d] hover:text-white bg-[#141824] border border-[#252c3c] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-[#a09c91] font-mono mb-4">
            {isDe
              ? 'Bewertungssystem: Belohnt rasante Reaktionszeit pro Akkord und zieht Strafpunkte für falsche Antworten ab.'
              : 'Scoring system: Rewards split-second ear recognition speed and deducts penalty points for mistakes.'}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/5 text-[#8c887d] uppercase tracking-wider text-[10px]">
                  <th className="pb-2.5 pl-2">#</th>
                  <th className="pb-2.5">{isDe ? 'Punkte' : 'Score'}</th>
                  <th className="pb-2.5">{isDe ? 'Ø Erkennungszeit' : 'Avg Reaction'}</th>
                  <th className="pb-2.5">{isDe ? 'Gesamtzeit' : 'Total Time'}</th>
                  <th className="pb-2.5">{isDe ? 'Fehler' : 'Mistakes'}</th>
                  <th className="pb-2.5 pr-2">{isDe ? 'Datum' : 'Date'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leaderboard.map((entry, idx) => (
                  <tr key={entry.id || idx} className={`hover:bg-white/[0.02] ${idx < 3 ? 'text-[#fbf9f5]' : 'text-[#b0ac9f]'}`}>
                    <td className="py-2.5 pl-2 font-bold">
                      {idx === 0 ? '🥇 1.' : idx === 1 ? '🥈 2.' : idx === 2 ? '🥉 3.' : `${idx + 1}.`}
                    </td>
                    <td className="py-2.5 font-bold text-[#c49750]">
                      {entry.score.toLocaleString()} <span className="text-[10px] text-[#8c887d] font-normal">pts</span>
                    </td>
                    <td className="py-2.5 text-[#38bdf8]">
                      {entry.avgReactionTime.toFixed(1)}s
                    </td>
                    <td className="py-2.5">
                      {formatTime(entry.timeSeconds)}
                    </td>
                    <td className="py-2.5">
                      <span className={entry.mistakes === 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400'}>
                        {entry.mistakes === 0 ? (isDe ? '0 Fehler (Perfekt)' : '0 (Clean)') : `${entry.mistakes} ${isDe ? 'Fehler' : 'mistakes'}`}
                      </span>
                    </td>
                    <td className="py-2.5 pr-2 text-[#736f65]">
                      {entry.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 10-Streak Milestone Celebration Card */}
      {hasCompleted10 && lastRunResult && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171c14] via-[#141b24] to-[#1c1422] border-2 border-[#d4af37]/60 shadow-[0_0_35px_rgba(212,175,55,0.25)] flex flex-col sm:flex-row items-center justify-between gap-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center shrink-0 shadow-lg">
              <Award className="w-7 h-7 text-[#ffd56b] animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h5 className="font-serif text-xl sm:text-2xl text-[#fdf497] font-medium tracking-tight">
                  {isDe ? '🏆 10er-Serie Meisterhaft Vollendet!' : '🏆 10-Streak Mastered!'}
                </h5>
                {isNewHighScore && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#ffd56b] text-black tracking-wider uppercase animate-pulse">
                    {isDe ? 'Top 3 Score!' : 'Top 3 Score!'}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#dedacf] font-light mt-1">
                {isDe 
                  ? `Endstand: ${lastRunResult.score.toLocaleString()} Punkte · Ø ${lastRunResult.avgReactionTime.toFixed(1)}s pro Akkord · ${lastRunResult.mistakes} Fehler.`
                  : `Final Score: ${lastRunResult.score.toLocaleString()} points · Avg ${lastRunResult.avgReactionTime.toFixed(1)}s per chord · ${lastRunResult.mistakes} mistakes.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setShowLeaderboard(true)}
              className="px-4 py-2.5 rounded-xl border border-[#c49750]/50 bg-[#161a26] text-[#dedacf] hover:text-white text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Trophy className="w-3.5 h-3.5 text-[#c49750]" />
              <span>{isDe ? 'Rangliste' : 'Rankings'}</span>
            </button>

            <button
              type="button"
              onClick={handleRestartChallenge}
              className="px-5 py-2.5 rounded-xl bg-[#c49750] hover:bg-[#d8a85c] text-black text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isDe ? 'Nochmal spielen' : 'Play Again'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Interactive Stage */}
      <div className="p-6 sm:p-9 rounded-2xl bg-[#141824] border border-[#262c3e] shadow-2xl relative overflow-hidden">
        
        {/* Subtle ambient pulse background */}
        <div 
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-20"
          style={{ backgroundColor: hasAnswered ? (isCorrect ? '#10b981' : '#f43f5e') : '#c49750' }}
        />

        {/* Interactive Controls Bar: Always Random Root indicator & Playback Style */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-white/5 text-xs font-mono">
          
          {/* Always Random Root Badge */}
          <div className="px-3 py-1.5 rounded-lg border border-[#c49750]/40 bg-[#121622] text-[#dedacf] flex items-center gap-2 select-none">
            <Shuffle className="w-3.5 h-3.5 text-[#c49750]" />
            <span className="font-semibold text-[#f5eedf]">
              {isDe ? 'Zufälliger Grundton: IMMER AKTIV' : 'Random Root: ALWAYS ACTIVE'}
            </span>
          </div>

          {/* Playback style: Block vs Arpeggio */}
          <div className="inline-flex rounded-lg bg-[#0b0d13] p-1 border border-[#262c3c]">
            <button
              type="button"
              onClick={() => {
                setPlaybackStyle('block');
                handleListen('block');
              }}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                playbackStyle === 'block'
                  ? 'bg-[#c49750] text-black font-semibold'
                  : 'text-[#9e9a8f] hover:text-[#fbf9f5]'
              }`}
            >
              <span>🎹 {isDe ? 'Block-Akkord' : 'Block Chord'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setPlaybackStyle('arpeggio');
                handleListen('arpeggio');
              }}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                playbackStyle === 'arpeggio'
                  ? 'bg-[#c49750] text-black font-semibold'
                  : 'text-[#9e9a8f] hover:text-[#fbf9f5]'
              }`}
            >
              <span>🎶 {isDe ? 'Arpeggio (Gebrochen)' : 'Arpeggiated'}</span>
            </button>
          </div>

        </div>

        {/* Centerpiece: Audio Trigger on Left + Musical Score on Right upon Answer */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 my-6 py-2">
          
          {/* Left: Big Audio Replay Button & Labels */}
          <div className="flex flex-col items-center text-center space-y-3">
            <button
              type="button"
              onClick={() => handleListen()}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#c49750] via-[#ffd56b] to-[#fae082] text-black flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.35)] hover:shadow-[0_0_55px_rgba(212,175,55,0.55)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group shrink-0"
              title={isDe ? 'Akkord noch einmal anhören' : 'Replay challenge chord'}
            >
              <Volume2 className={`w-9 h-9 sm:w-11 sm:h-11 transition-transform ${isPlaying ? 'scale-125 animate-pulse' : 'group-hover:scale-110'}`} />
            </button>

            <div className="space-y-1">
              <div className="text-xs font-mono uppercase tracking-widest text-[#d4af37]">
                {isPlaying 
                  ? (isDe ? '● Klang schwingt...' : '● Chord Ringing...') 
                  : (isDe ? 'Klicke zum Anhören' : 'Click to Replay Chord')}
              </div>
              <div className="text-[11px] text-[#8c887d] font-mono">
                {isDe ? 'Transponiert · Höre auf Klangfarbe & Intervalldichte' : 'Transposed · Focus on color & interval density'}
              </div>

              {/* Live Recognition Stopwatch for this chord */}
              <div className="pt-1.5 flex items-center justify-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#0c0e15] border border-white/10 text-[11px] font-mono text-[#c49750] flex items-center gap-1.5">
                  <Timer className={`w-3 h-3 ${isTimerRunning ? 'animate-spin' : ''}`} />
                  {hasAnswered && lastChordReactionTime !== null
                    ? (isDe ? `Erkannt in ${lastChordReactionTime.toFixed(1)}s` : `Recognized in ${lastChordReactionTime.toFixed(1)}s`)
                    : `${roundElapsedSec.toFixed(1)}s`}
                </span>
              </div>
            </div>
          </div>

          {/* Right of the Replay: Musical Score Staff that appears when answer is chosen */}
          {hasAnswered && (
            <div className="animate-fade-in flex flex-col items-center p-3 sm:p-4 rounded-xl bg-[#0c0e15]/90 border border-[#c49750]/30 shadow-xl shrink-0">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37] mb-1.5 flex items-center gap-1.5">
                <span>🎼</span>
                <span>{isDe ? 'Gespielte Partitur' : 'Actual Transposed Score'}</span>
              </div>
              <MusicalScoreChord
                notes={transposedNotes}
                chordName={currentChord.name}
                color={currentChord.color}
                isDe={isDe}
              />
            </div>
          )}

        </div>

        {/* 4 Multiple Choice Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 my-8">
          {options.map((option) => {
            const isSelected = selectedAnswerId === option.id;
            const isTarget = option.id === currentChord.id;

            let cardStyles = 'bg-[#10141d] border-[#222838] hover:border-[#3d465e] hover:bg-[#141924]';

            if (hasAnswered) {
              if (isTarget) {
                // Correct target card
                cardStyles = 'bg-[#0f241a] border-emerald-500/70 text-emerald-200 ring-1 ring-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]';
              } else if (isSelected && !isCorrect) {
                // User picked wrong card
                cardStyles = 'bg-[#271318] border-rose-500/70 text-rose-200 ring-1 ring-rose-500/50';
              } else {
                cardStyles = 'bg-[#0c0e15]/50 border-white/5 opacity-40';
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                disabled={hasAnswered}
                onClick={() => handleSelectAnswer(option)}
                className={`p-4 sm:p-5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 ${cardStyles} disabled:cursor-default`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: option.color }}
                    />
                    <span className="font-serif text-base sm:text-lg font-medium">
                      {isDe ? option.chordTypeDe : option.chordType}
                    </span>
                  </div>
                  <div className="text-xs text-[#a09c91] font-mono">
                    {option.voicingLabel}
                  </div>
                </div>

                <div className="shrink-0">
                  {hasAnswered && isTarget && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                  {hasAnswered && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400" />
                  )}
                  {!hasAnswered && (
                    <span className="text-[11px] font-mono text-[#8c887d] px-2 py-0.5 rounded bg-white/5">
                      {option.tensionPercentage}% {isDe ? 'Zug' : 'pull'}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Revealed Result Breakdown & Next Chord */}
        {hasAnswered && (
          <div className="pt-6 border-t border-white/10 animate-fade-in space-y-6">
            
            <div className={`p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isCorrect 
                ? 'bg-[#0e2118] border-emerald-500/40' 
                : 'bg-[#231216] border-rose-500/40'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                </div>
                <div>
                  <h5 className="font-serif text-lg text-white font-medium">
                    {isCorrect 
                      ? (isDe ? 'Exzellent! Vollkommen richtig gehört.' : 'Bravo! Perfectly identified.')
                      : (isDe ? `Nicht ganz — Es war: ${currentChord.chordTypeDe}` : `Close, but it was: ${currentChord.chordType}`)}
                  </h5>
                  <p className="text-xs text-[#cfcac0] font-light mt-0.5">
                    “{isDe ? currentChord.archetypeDe : currentChord.archetype}”
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={setupNewRound}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#c49750] hover:bg-[#d8a85c] text-black text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#c49750]/20 shrink-0"
              >
                <span>{isDe ? 'Nächster Akkord' : 'Next Chord'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
