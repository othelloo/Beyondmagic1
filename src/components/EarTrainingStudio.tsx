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
  Award
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

// Transpose semitone names
const SEMITONE_OFFSETS = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
const TARGET_STREAK = 10;

// Format seconds into MM:SS
function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Format seconds into friendly speech like "1m 14s"
function formatTimeFriendly(totalSeconds: number, isDe: boolean): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins === 0) {
    return isDe ? `${secs} Sek.` : `${secs}s`;
  }
  return isDe ? `${mins} Min. ${secs} Sek.` : `${mins}m ${secs}s`;
}

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
  const [allowTransposition, setAllowTransposition] = useState<boolean>(true);
  const [playbackStyle, setPlaybackStyle] = useState<'block' | 'arpeggio'>('block');
  const [options, setOptions] = useState<EarTrainingChordItem[]>([]);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [totalCorrect, setTotalCorrect] = useState<number>(0);

  // 10-Streak Challenge Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [hasCompleted10, setHasCompleted10] = useState<boolean>(false);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [lastCompletionTime, setLastCompletionTime] = useState<number | null>(null);
  const [best10Time, setBest10Time] = useState<number | null>(() => {
    try {
      const saved = localStorage.getItem('beyondMagic_best10StreakTime');
      return saved ? parseInt(saved, 10) : null;
    } catch {
      return null;
    }
  });

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentChord = chords[currentChordIndex] || chords[0];

  // Live timer interval for active 10-streak attempt
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && !hasCompleted10) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, hasCompleted10]);

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

    // Pick a random chord
    const nextIndex = Math.floor(Math.random() * chords.length);
    setCurrentChordIndex(nextIndex);

    // Pick a random transposition shift if enabled
    const nextShift = allowTransposition 
      ? SEMITONE_OFFSETS[Math.floor(Math.random() * SEMITONE_OFFSETS.length)]
      : 0;
    setSemitoneShift(nextShift);

    const targetChord = chords[nextIndex];

    // Build 4 multiple choice options including the target
    const distractors = chords
      .filter(c => c.id !== targetChord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const roundOptions = [targetChord, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(roundOptions);

    // Auto-play the new chord with a tiny delay
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    autoPlayTimerRef.current = setTimeout(() => {
      const freqs = allowTransposition
        ? targetChord.frequencies.map(f => Number((f * Math.pow(2, nextShift / 12)).toFixed(2)))
        : targetChord.frequencies;
      playChordFrequencies(freqs, soundMode, playbackStyle === 'arpeggio');
    }, 150);
  }, [allowTransposition, chords, playbackStyle, playChordFrequencies, soundMode, stopAudio]);

  // Restart 10-streak challenge
  const handleRestartChallenge = () => {
    setStreak(0);
    setTimerSeconds(0);
    setIsTimerRunning(false);
    setHasCompleted10(false);
    setIsNewRecord(false);
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

  // Play current challenge sound
  const handleListen = useCallback((styleOverride?: 'block' | 'arpeggio') => {
    const style = styleOverride || playbackStyle;
    const freqs = getTransposedFreqs(currentChord, allowTransposition ? semitoneShift : 0);
    playChordFrequencies(freqs, soundMode, style === 'arpeggio');
  }, [allowTransposition, currentChord, getTransposedFreqs, playbackStyle, playChordFrequencies, semitoneShift, soundMode]);

  // Handle user's selection
  const handleSelectAnswer = (option: EarTrainingChordItem) => {
    if (hasAnswered) return;

    // Start timer on first question if not running
    if (!isTimerRunning && !hasCompleted10) {
      setIsTimerRunning(true);
    }

    setSelectedAnswerId(option.id);
    setHasAnswered(true);
    setTotalAttempts(prev => prev + 1);

    const correct = option.id === currentChord.id;
    setIsCorrect(correct);

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setTotalCorrect(prev => prev + 1);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      // Check if user reached the 10-streak milestone!
      if (newStreak >= TARGET_STREAK && !hasCompleted10) {
        setIsTimerRunning(false);
        setHasCompleted10(true);
        const finalTime = timerSeconds;
        setLastCompletionTime(finalTime);

        // Check if new personal best record
        if (best10Time === null || finalTime < best10Time) {
          setIsNewRecord(true);
          setBest10Time(finalTime);
          try {
            localStorage.setItem('beyondMagic_best10StreakTime', finalTime.toString());
          } catch {}
        } else {
          setIsNewRecord(false);
        }
      }
    } else {
      // Mistake breaks the streak - reset streak & timer for the next run toward 10
      setStreak(0);
      setTimerSeconds(0);
      setIsTimerRunning(false);
      setHasCompleted10(false);
      setIsNewRecord(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner: Rules & Stats */}
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
              ? 'Höre genau hin: Dur, Moll, Septimen, Vermindert oder Übermäßig? Trainiere dein Gehör auf die emotionale Gravitation statt auf auswendig gelernte Töne.' 
              : 'Listen closely: Major, Minor, Seventh, Diminished, or Augmented? Train your ear on harmonic weight and tension rather than memorized absolute pitch.'}
          </p>
        </div>

        {/* Score & Streak & 10-Streak Timer Counters */}
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

          {/* 10-Streak Timer */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0c0e15] border border-white/5 text-center">
            <Timer className={`w-4 h-4 ${isTimerRunning ? 'text-[#c49750] animate-pulse' : 'text-[#8c887d]'}`} />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#8c887d]">
                {isDe ? '10er-Timer' : '10-Streak Timer'}
              </div>
              <div className="text-sm font-mono font-bold text-[#fbf9f5] flex items-center gap-1.5">
                <span className={isTimerRunning ? 'text-[#ffd56b]' : 'text-[#dedacf]'}>
                  {formatTime(timerSeconds)}
                </span>
                {best10Time !== null && (
                  <span className="text-[10px] font-normal text-[#8c887d]" title={isDe ? 'Beste 10er-Zeit' : 'Best 10-Streak Time'}>
                    ⚡ {formatTime(best10Time)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Score Counter */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0c0e15] border border-white/5 text-center">
            <Trophy className="w-4 h-4 text-[#c49750]" />
            <div className="text-left">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#8c887d]">
                {isDe ? 'Treffer' : 'Score'}
              </div>
              <div className="text-sm font-mono font-bold text-[#c49750]">
                {totalAttempts > 0 ? `${Math.round((totalCorrect / totalAttempts) * 100)}%` : '—'}
                <span className="text-[10px] font-normal text-[#8c887d] ml-1">({totalCorrect}/{totalAttempts})</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 10-Streak Milestone Celebration Card */}
      {hasCompleted10 && (
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#191e13] via-[#141b24] to-[#1d1622] border-2 border-[#d4af37]/60 shadow-[0_0_35px_rgba(212,175,55,0.25)] flex flex-col sm:flex-row items-center justify-between gap-5 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center shrink-0 shadow-lg">
              <Award className="w-6 h-6 text-[#ffd56b] animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h5 className="font-serif text-xl sm:text-2xl text-[#fdf497] font-medium tracking-tight">
                  {isDe ? '🏆 10er-Serie Vollendet!' : '🏆 10-Streak Mastered!'}
                </h5>
                {isNewRecord && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#ffd56b] text-black tracking-wider uppercase animate-pulse">
                    {isDe ? 'Neuer Rekord!' : 'New Record!'}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#dedacf] font-light mt-1">
                {isDe 
                  ? `Du hast 10 Akkorde in Folge in ${formatTimeFriendly(lastCompletionTime ?? timerSeconds, true)} fehlerfrei identifiziert!`
                  : `You accurately identified 10 consecutive chord colors in ${formatTimeFriendly(lastCompletionTime ?? timerSeconds, false)}!`}
                {best10Time !== null && (
                  <span className="text-[#ffd56b] font-mono ml-2">
                    ({isDe ? 'Beste Zeit:' : 'Personal Best:'} {formatTime(best10Time)})
                  </span>
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRestartChallenge}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#c49750] hover:bg-[#d8a85c] text-black text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isDe ? 'Neue 10er-Serie starten' : 'Play Again / Beat Record'}</span>
          </button>
        </div>
      )}

      {/* Main Interactive Stage */}
      <div className="p-6 sm:p-9 rounded-2xl bg-[#141824] border border-[#262c3e] shadow-2xl relative overflow-hidden">
        
        {/* Subtle ambient pulse background */}
        <div 
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full blur-[120px] pointer-events-none opacity-20"
          style={{ backgroundColor: hasAnswered ? (isCorrect ? '#10b981' : '#f43f5e') : '#c49750' }}
        />

        {/* Interactive Controls Bar: Sound mode, Arpeggio, Transposition */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-6 border-b border-white/5 text-xs font-mono">
          
          {/* Transposition Toggle */}
          <button
            type="button"
            onClick={() => {
              setAllowTransposition(prev => !prev);
              setupNewRound();
            }}
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-2 cursor-pointer ${
              allowTransposition
                ? 'bg-[#181f2f] border-[#c49750]/50 text-[#fbf9f5]'
                : 'bg-[#0f121a] border-[#222736] text-[#8c887d]'
            }`}
            title={isDe ? 'Transponiert den Grundton zufällig, damit das Ohr die Klangfarbe und nicht die Tonhöhe lernt' : 'Transposes the root randomly so the ear trains on chord color, not fixed pitch'}
          >
            <Shuffle className={`w-3.5 h-3.5 ${allowTransposition ? 'text-[#c49750]' : 'text-[#6e6a60]'}`} />
            <span>
              {isDe 
                ? (allowTransposition ? 'Zufällige Tonhöhe: AKTIV' : 'Feste Tonhöhe (Referenz)') 
                : (allowTransposition ? 'Random Root: ON' : 'Fixed Pitch: OFF')}
            </span>
            <span className={`w-1.5 h-1.5 rounded-full ${allowTransposition ? 'bg-[#c49750]' : 'bg-[#3b4356]'}`} />
          </button>

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

          {/* Sound Instrument Indicator */}
          <div className="text-[11px] text-[#8c887d] flex items-center gap-1.5">
            <span>{isDe ? 'Klang:' : 'Sound:'}</span>
            <span className="text-[#c49750] uppercase font-bold">{soundMode === 'piano' ? 'Piano 88' : 'Harmonic Synth'}</span>
          </div>

        </div>

        {/* Centerpiece: Big Listen & Replay Trigger */}
        <div className="flex flex-col items-center justify-center my-6 space-y-4 text-center">
          
          <button
            type="button"
            onClick={() => handleListen()}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#c49750] via-[#ffd56b] to-[#fae082] text-black flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.35)] hover:shadow-[0_0_55px_rgba(212,175,55,0.55)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
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
              {allowTransposition 
                ? (isDe ? 'Transponiert · Höre auf Terzen & Septimen' : 'Transposed · Focus on color & interval density')
                : (isDe ? 'Originaltonhöhe' : 'Concert Pitch Reference')}
            </div>
          </div>

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

            {/* Frameless Golden Score of the Answer */}
            <div className="p-4 rounded-xl bg-[#0d1017]/80 border border-white/5 flex flex-col items-center">
              <div className="text-[11px] font-mono uppercase tracking-wider text-[#d4af37] text-center mb-2">
                {isDe ? 'Partitur-Auflösung' : 'Score Analysis'}
              </div>
              <MusicalScoreChord
                notes={currentChord.notes}
                chordName={currentChord.name}
                color={currentChord.color}
                isDe={isDe}
              />
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
