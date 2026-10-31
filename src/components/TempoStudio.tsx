import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, RotateCcw, Trophy, Award, Flame, Play, Square, ChevronRight, CheckCircle2, Clock, X } from 'lucide-react';
import { playRealisticMetronomeClick } from '../utils/metronomeSound';

export type TempoMode = 'GUESS' | 'TAP';
export type TimeSignature = '2/4' | '3/4' | '4/4' | '6/8';

interface TempoChallenge {
  id: string;
  bpm: number;
  timeSignature: TimeSignature;
  italianTerm: string;
  italianTermDe: string;
}

const TEMPO_POOL: TempoChallenge[] = [
  { id: 't-larghissimo', bpm: 52, timeSignature: '4/4', italianTerm: 'Largo', italianTermDe: 'Largo (Breit & Getragen)' },
  { id: 't-adagio-34', bpm: 60, timeSignature: '3/4', italianTerm: 'Adagio', italianTermDe: 'Adagio (Ruhig & Innig)' },
  { id: 't-andante-44', bpm: 74, timeSignature: '4/4', italianTerm: 'Andante', italianTermDe: 'Andante (Gehend)' },
  { id: 't-andante-68', bpm: 68, timeSignature: '6/8', italianTerm: 'Andante cantabile', italianTermDe: 'Andante cantabile (Gesangvoll)' },
  { id: 't-andantino-24', bpm: 82, timeSignature: '2/4', italianTerm: 'Andantino', italianTermDe: 'Andantino (Etwas bewegter)' },
  { id: 't-moderato-44', bpm: 96, timeSignature: '4/4', italianTerm: 'Moderato', italianTermDe: 'Moderato (Mäßig bewegt)' },
  { id: 't-moderato-34', bpm: 104, timeSignature: '3/4', italianTerm: 'Allegretto', italianTermDe: 'Allegretto (Munter)' },
  { id: 't-allegro-24', bpm: 116, timeSignature: '2/4', italianTerm: 'Allegro', italianTermDe: 'Allegro (Lebhaft)' },
  { id: 't-allegro-44', bpm: 124, timeSignature: '4/4', italianTerm: 'Allegro animato', italianTermDe: 'Allegro animato (Beseelt)' },
  { id: 't-allegro-68', bpm: 112, timeSignature: '6/8', italianTerm: 'Allegretto grazioso', italianTermDe: 'Allegretto grazioso (Anmutig)' },
  { id: 't-vivace-44', bpm: 140, timeSignature: '4/4', italianTerm: 'Vivace', italianTermDe: 'Vivace (Sehr lebendig)' },
  { id: 't-presto-24', bpm: 160, timeSignature: '2/4', italianTerm: 'Presto', italianTermDe: 'Presto (Schnell)' },
  { id: 't-presto-34', bpm: 152, timeSignature: '3/4', italianTerm: 'Presto con fuoco', italianTermDe: 'Presto con fuoco (Feurig)' },
  { id: 't-prestissimo', bpm: 172, timeSignature: '4/4', italianTerm: 'Prestissimo', italianTermDe: 'Prestissimo (Äußerst schnell)' },
];

interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  mode: string;
  date: string;
}

interface TempoStudioProps {
  isDe: boolean;
}

export const TempoStudio: React.FC<TempoStudioProps> = ({ isDe }) => {
  // Current mode: alternates automatically between GUESS and TAP
  const [currentMode, setCurrentMode] = useState<TempoMode>('GUESS');
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  // Active Challenge Data
  const [activeChallenge, setActiveChallenge] = useState<TempoChallenge>(TEMPO_POOL[2]);

  // Mode A: Guess State
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [selectedSignature, setSelectedSignature] = useState<TimeSignature | null>(null);
  const [guessedBpm, setGuessedBpm] = useState<number>(100);
  const [guessEvaluated, setGuessEvaluated] = useState<boolean>(false);
  const [guessResult, setGuessResult] = useState<{
    precision: number;
    deltaBpm: number;
    sigCorrect: boolean;
    earnedPoints: number;
    message: string;
  } | null>(null);

  // Mode B: Tap State
  const [tappedTimes, setTappedTimes] = useState<number[]>([]);
  const [currentTappedBpm, setCurrentTappedBpm] = useState<number | null>(null);
  const [tapEvaluated, setTapEvaluated] = useState<boolean>(false);
  const [tapPadPressed, setTapPadPressed] = useState<boolean>(false);
  const [tapResult, setTapResult] = useState<{
    precision: number;
    deltaBpm: number;
    measuredBpm: number;
    earnedPoints: number;
    message: string;
  } | null>(null);

  // Metronome Audio & Visual state
  const [currentBeatIndex, setCurrentBeatIndex] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const metronomeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  // Leaderboard modal
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem('lyric_tempo_leaderboard');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [playerName, setPlayerName] = useState<string>('');

  // Web Audio Context getter
  const getAudioContext = useCallback(() => {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioCtx();
    }
    return audioContextRef.current;
  }, []);

  // Realistic Mechanical Woodblock Metronome Click
  const playMetronomeClick = useCallback((isAccent: boolean) => {
    try {
      const ctx = getAudioContext();
      playRealisticMetronomeClick(ctx, isAccent);
    } catch {}
  }, [getAudioContext]);

  // Tap Wood Drum feedback sound
  const playTapSound = useCallback(() => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.08);

      gain.gain.setValueAtTime(0.85, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }, [getAudioContext]);

  // Start metronome playback for Mode A
  const startMetronome = useCallback((bpm: number, timeSig: TimeSignature) => {
    stopMetronome();
    isPlayingRef.current = true;
    setIsAudioPlaying(true);

    const beatsPerBar = timeSig === '2/4' ? 2 : timeSig === '3/4' ? 3 : timeSig === '4/4' ? 4 : 6;
    const intervalMs = (60 / bpm) * 1000;
    let currentBeat = 0;

    // Immediately play beat 1
    playMetronomeClick(true);
    setCurrentBeatIndex(0);
    currentBeat = 1;

    metronomeTimerRef.current = setInterval(() => {
      if (!isPlayingRef.current) return;
      const isAccent = currentBeat % beatsPerBar === 0;
      playMetronomeClick(isAccent);
      setCurrentBeatIndex(currentBeat % beatsPerBar);
      currentBeat++;
    }, intervalMs);
  }, [playMetronomeClick]);

  const stopMetronome = useCallback(() => {
    isPlayingRef.current = false;
    setIsAudioPlaying(false);
    if (metronomeTimerRef.current) {
      clearInterval(metronomeTimerRef.current);
      metronomeTimerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMetronome();
    };
  }, [stopMetronome]);

  // Pick a fresh challenge
  const pickNewChallenge = useCallback((preferredMode?: TempoMode) => {
    stopMetronome();
    const nextIdx = Math.floor(Math.random() * TEMPO_POOL.length);
    const newChallenge = TEMPO_POOL[nextIdx];
    setActiveChallenge(newChallenge);

    const nextMode = preferredMode || (currentMode === 'GUESS' ? 'TAP' : 'GUESS');
    setCurrentMode(nextMode);

    // Reset mode A
    setSelectedSignature(null);
    setGuessedBpm(100);
    setGuessEvaluated(false);
    setGuessResult(null);

    // Reset mode B
    setTappedTimes([]);
    setCurrentTappedBpm(null);
    setTapEvaluated(false);
    setTapResult(null);

    setRoundNumber(r => r + 1);
  }, [currentMode, stopMetronome]);

  // Evaluate Mode A (Listen & Guess Signature + BPM)
  const evaluateGuess = useCallback(() => {
    stopMetronome();
    if (!selectedSignature) return;

    const deltaBpm = Math.abs(guessedBpm - activeChallenge.bpm);
    const sigCorrect = selectedSignature === activeChallenge.timeSignature;

    // Leeway calculation:
    // ±5 BPM = 100% precision
    // ±10 BPM = 85% precision
    // ±16 BPM = 70% precision
    // ±24 BPM = 50% precision
    let bpmPrecision = 0;
    if (deltaBpm <= 4) {
      bpmPrecision = 100;
    } else if (deltaBpm <= 8) {
      bpmPrecision = 90 - (deltaBpm - 4) * 2.5;
    } else if (deltaBpm <= 16) {
      bpmPrecision = 80 - (deltaBpm - 8) * 2;
    } else if (deltaBpm <= 28) {
      bpmPrecision = 60 - (deltaBpm - 16) * 1.5;
    } else {
      bpmPrecision = Math.max(20, 40 - (deltaBpm - 28));
    }

    const overallPrecision = Math.round(sigCorrect ? bpmPrecision : bpmPrecision * 0.7);

    let earnedPoints = 0;
    let message = '';

    if (sigCorrect && deltaBpm <= 6) {
      earnedPoints = 220 + streak * 25;
      message = isDe 
        ? `Perfektes Gehör! Taktart ${activeChallenge.timeSignature} exakt erkannt, Tempo auf ±${deltaBpm} BPM genau!` 
        : `Virtuoso ear! Flawless ${activeChallenge.timeSignature} meter, tempo within ±${deltaBpm} BPM!`;
      setStreak(s => s + 1);
    } else if (sigCorrect && deltaBpm <= 14) {
      earnedPoints = 150 + streak * 15;
      message = isDe 
        ? `Sehr gut! Richtige Taktart, Tempo nahe am Ziel (Abweichung: ${deltaBpm} BPM).` 
        : `Great listening! Correct meter, tempo near target (Deviation: ${deltaBpm} BPM).`;
      setStreak(s => s + 1);
    } else if (sigCorrect) {
      earnedPoints = 90;
      message = isDe 
        ? `Taktart ${activeChallenge.timeSignature} korrekt erkannt! Beim Tempo noch feiner hinhören.` 
        : `Meter ${activeChallenge.timeSignature} detected! Listen closer for the tempo pulse.`;
      setStreak(0);
    } else {
      earnedPoints = Math.max(30, Math.round(bpmPrecision));
      message = isDe 
        ? `Taktart war ${activeChallenge.timeSignature} (Betonung auf Schlag 1). Tempo-Abweichung: ${deltaBpm} BPM.` 
        : `Meter was actually ${activeChallenge.timeSignature}. Tempo difference: ${deltaBpm} BPM.`;
      setStreak(0);
    }

    setScore(s => s + earnedPoints);
    setGuessResult({
      precision: overallPrecision,
      deltaBpm,
      sigCorrect,
      earnedPoints,
      message,
    });
    setGuessEvaluated(true);
  }, [activeChallenge, guessedBpm, selectedSignature, isDe, streak, stopMetronome]);

  // Mode B: User Taps on Pad
  const handleUserTap = useCallback(() => {
    if (tapEvaluated) return;
    playTapSound();
    setTapPadPressed(true);
    setTimeout(() => setTapPadPressed(false), 90);

    const now = performance.now();
    const updated = [...tappedTimes, now];
    setTappedTimes(updated);

    // Compute live tempo from last intervals
    if (updated.length >= 2) {
      const intervals: number[] = [];
      for (let i = 1; i < updated.length; i++) {
        intervals.push(updated[i] - updated[i - 1]);
      }
      // Use recent intervals
      const recent = intervals.slice(-6);
      const avgIntervalMs = recent.reduce((a, b) => a + b, 0) / recent.length;
      const bpm = Math.round(60000 / avgIntervalMs);
      if (bpm >= 35 && bpm <= 260) {
        setCurrentTappedBpm(bpm);
      }
    }
  }, [playTapSound, tappedTimes, tapEvaluated]);

  // Keyboard Triggers (Spacebar, Enter, K, J): Tapping in Mode B, Play/Stop in Mode A
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
        e.preventDefault();
        if (currentMode === 'TAP') {
          handleUserTap();
        } else if (currentMode === 'GUESS') {
          if (isAudioPlaying) {
            stopMetronome();
          } else {
            startMetronome(activeChallenge.bpm, activeChallenge.timeSignature);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentMode, handleUserTap, isAudioPlaying, activeChallenge, startMetronome, stopMetronome]);

  // Evaluate Mode B (Tap Target BPM)
  const evaluateTap = useCallback(() => {
    if (tappedTimes.length < 4) {
      return;
    }
    const intervals: number[] = [];
    for (let i = 1; i < tappedTimes.length; i++) {
      intervals.push(tappedTimes[i] - tappedTimes[i - 1]);
    }

    // Ignore first outlier interval if person was getting into groove
    const measuredIntervals = intervals.length > 4 ? intervals.slice(1) : intervals;
    const avgIntervalMs = measuredIntervals.reduce((a, b) => a + b, 0) / measuredIntervals.length;
    const measuredBpm = Math.round(60000 / avgIntervalMs);
    const targetBpm = activeChallenge.bpm;
    const deltaBpm = Math.abs(measuredBpm - targetBpm);
    const percentageDelta = (deltaBpm / targetBpm) * 100;

    // Leeway calculation:
    // Within ±5% (e.g. ±5 BPM at 100): 100% precision!
    // Within ±10%: 88% precision
    // Within ±16%: 75% precision
    let precision = 0;
    if (percentageDelta <= 5) {
      precision = 100;
    } else if (percentageDelta <= 10) {
      precision = Math.round(100 - (percentageDelta - 5) * 2.4);
    } else if (percentageDelta <= 18) {
      precision = Math.round(88 - (percentageDelta - 10) * 1.6);
    } else if (percentageDelta <= 28) {
      precision = Math.round(75 - (percentageDelta - 18) * 2);
    } else {
      precision = Math.max(25, Math.round(55 - percentageDelta));
    }

    let earnedPoints = 0;
    let message = '';

    if (percentageDelta <= 6) {
      earnedPoints = 200 + streak * 25;
      message = isDe 
        ? `Exzellenter innerer Puls! Ziel ${targetBpm} BPM, du hast ${measuredBpm} BPM geschlagen (im Spielraum ±${deltaBpm} BPM).` 
        : `Exceptional internal pulse! Target ${targetBpm} BPM, you struck ${measuredBpm} BPM (within ±${deltaBpm} BPM leeway).`;
      setStreak(s => s + 1);
    } else if (percentageDelta <= 14) {
      earnedPoints = 140 + streak * 15;
      message = isDe 
        ? `Sehr solides Zeitgefühl! ${measuredBpm} BPM vs ${targetBpm} BPM (Abweichung: ${deltaBpm} BPM).` 
        : `Very solid timing! ${measuredBpm} BPM vs ${targetBpm} BPM (Deviation: ${deltaBpm} BPM).`;
      setStreak(s => s + 1);
    } else {
      earnedPoints = 60;
      message = isDe 
        ? `Tempo war etwas ${measuredBpm > targetBpm ? 'zu schnell' : 'zu langsam'} (${measuredBpm} vs ${targetBpm} BPM). Bleibe entspannt.` 
        : `Tempo was slightly ${measuredBpm > targetBpm ? 'too fast' : 'too slow'} (${measuredBpm} vs ${targetBpm} BPM). Relax your pulse.`;
      setStreak(0);
    }

    setScore(s => s + earnedPoints);
    setTapResult({
      precision,
      deltaBpm,
      measuredBpm,
      earnedPoints,
      message,
    });
    setTapEvaluated(true);
  }, [tappedTimes, activeChallenge.bpm, isDe, streak]);

  // Save to Leaderboard
  const saveScore = useCallback(() => {
    if (!playerName.trim() || score <= 0) return;
    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name: playerName.trim(),
      score,
      mode: 'Tempo Studio',
      date: new Date().toLocaleDateString(isDe ? 'de-DE' : 'en-US', { month: 'short', day: 'numeric' })
    };
    const updated = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 10);
    setLeaderboard(updated);
    try {
      localStorage.setItem('lyric_tempo_leaderboard', JSON.stringify(updated));
    } catch {}
    setPlayerName('');
  }, [playerName, score, leaderboard, isDe]);

  const beatsPerBar = activeChallenge.timeSignature === '2/4' ? 2 : activeChallenge.timeSignature === '3/4' ? 3 : activeChallenge.timeSignature === '4/4' ? 4 : 6;

  return (
    <div id="tempo-studio-console" className="w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto select-none overflow-x-hidden">
      <div className="relative rounded-2xl bg-[#121520] border border-[#2b3347] shadow-[0_12px_45px_rgba(0,0,0,0.6)] p-3 sm:p-5 overflow-hidden w-full box-border">
        
        {/* Glow */}
        <div 
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-20 transition-colors duration-500"
          style={{ backgroundColor: currentMode === 'GUESS' ? '#c49750' : '#38bdf8' }}
        />

        {/* 1. Header Bar: Mode Alternation Switcher + Top 10 High Scores */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 pb-2.5 mb-2.5 border-b border-white/10 w-full">
          <div className="flex items-center gap-1 sm:gap-2 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => {
                pickNewChallenge('GUESS');
              }}
              className={`flex-1 py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center ${
                currentMode === 'GUESS'
                  ? 'bg-gradient-to-r from-[#c49750] to-[#e6b769] text-black font-extrabold shadow-md shadow-[#c49750]/30 ring-1 ring-white/30'
                  : 'bg-[#0e111a] text-[#a09c91] hover:text-[#fbf9f5] border border-white/5 hover:border-white/10'
              }`}
            >
              <span className="text-xs sm:text-sm">🎧</span>
              <span className="font-bold text-[11px] sm:text-xs whitespace-nowrap">
                <span className="sm:hidden">{isDe ? 'Hören' : 'Guess'}</span>
                <span className="hidden sm:inline">{isDe ? '1. Tempo & Takt hören' : '1. Listen & Guess'}</span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                pickNewChallenge('TAP');
              }}
              className={`flex-1 py-1.5 sm:py-2 px-1.5 sm:px-3 rounded-xl text-xs font-mono transition-all flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center ${
                currentMode === 'TAP'
                  ? 'bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] text-black font-extrabold shadow-md shadow-[#38bdf8]/30 ring-1 ring-white/30'
                  : 'bg-[#0e111a] text-[#a09c91] hover:text-[#fbf9f5] border border-white/5 hover:border-white/10'
              }`}
            >
              <span className="text-xs sm:text-sm">🥁</span>
              <span className="font-bold text-[11px] sm:text-xs whitespace-nowrap">
                <span className="sm:hidden">{isDe ? 'Klopfen' : 'Tap'}</span>
                <span className="hidden sm:inline">{isDe ? '2. Tempo schlagen' : '2. Tap Target BPM'}</span>
              </span>
            </button>
          </div>

          {/* Top 10 Button */}
          <button
            type="button"
            onClick={() => setShowLeaderboard(true)}
            className="shrink-0 ml-1.5 sm:ml-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#181c28] hover:bg-[#222738] border border-[#c49750]/60 text-[#fbf9f5] flex items-center gap-1.5 text-xs font-mono transition-all cursor-pointer shadow-sm group"
            title={isDe ? 'Top 10 Bestenliste' : 'Top 10 High Scores'}
          >
            <Trophy className="w-3.5 h-3.5 text-[#c49750] group-hover:scale-110 transition-transform shrink-0" />
            <span className="font-semibold text-[#f5eedf] text-[11px] sm:text-xs whitespace-nowrap">Top 10</span>
          </button>
        </div>

        {/* 2. HUD Bar: Round, Streak, Points & Reset */}
        <div className="flex items-center justify-between gap-1.5 pb-2.5 mb-2.5 border-b border-white/10 text-xs font-mono w-full">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="px-2 py-1 rounded-lg bg-[#0b0d14] border border-white/10 flex items-center gap-1 text-[11px]">
              <span className="text-[#8c887d]">{isDe ? 'Runde' : 'Round'}</span>
              <span className="font-bold text-[#ffd56b]">#{roundNumber}</span>
            </div>

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

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setScore(0);
                setStreak(0);
                setRoundNumber(1);
                pickNewChallenge();
              }}
              className="p-1.5 rounded-lg text-[#8c887d] hover:text-white bg-[#0b0d14] border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              title={isDe ? 'Neu starten' : 'Restart'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 3. MAIN WORKBENCH: MODE A (GUESS) OR MODE B (TAP) */}
        {currentMode === 'GUESS' ? (
          /* ================================================================ */
          /* MODE A: LISTEN TO CLEAR TEMPO -> CHOOSE TIME SIGNATURE & BPM */
          /* ================================================================ */
          <div className="space-y-3.5 animate-fade-in">
            {/* Metronome Acoustic Pulse Showcase */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-[#090b12] border border-[#c49750]/30 shadow-inner text-center">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#c49750] flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-[#c49750]" />
                  <span>{isDe ? 'Akustischer Metronom-Puls' : 'Acoustic Metronome Pulse'}</span>
                </span>
                <span className="text-[11px] font-mono text-[#8c887d]">
                  {isDe ? 'Betonung auf Schlag 1' : 'Accent on beat 1'}
                </span>
              </div>

              {/* Pulsing Visual Meter Rings */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 my-4">
                {Array.from({ length: beatsPerBar }).map((_, idx) => {
                  const isActive = isAudioPlaying && currentBeatIndex === idx;
                  const isBeatOne = idx === 0;

                  return (
                    <div key={idx} className="flex flex-col items-center gap-1">
                      <div
                        className={`transition-all duration-100 rounded-full flex items-center justify-center ${
                          isBeatOne ? 'w-10 h-10 sm:w-12 sm:h-12' : 'w-8 h-8 sm:w-10 sm:h-10'
                        } ${
                          isActive
                            ? isBeatOne
                              ? 'bg-gradient-to-tr from-[#c49750] to-[#ffd56b] scale-125 shadow-[0_0_25px_rgba(255,213,107,0.9)] ring-2 ring-white/60'
                              : 'bg-emerald-400 scale-110 shadow-[0_0_15px_rgba(52,211,153,0.8)]'
                            : isBeatOne
                            ? 'bg-[#1a1f2e] border-2 border-[#c49750]/50'
                            : 'bg-[#141824] border border-white/10'
                        }`}
                      >
                        <span className={`text-[11px] font-mono font-bold ${isActive ? 'text-black' : 'text-[#8c887d]'}`}>
                          {idx + 1}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-[#6e6a60]">
                        {isBeatOne ? (isDe ? 'Schwer' : 'Accent') : (isDe ? 'Leicht' : 'Pulse')}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Audio Play/Pause Button */}
              <div className="flex items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    if (isAudioPlaying) {
                      stopMetronome();
                    } else {
                      startMetronome(activeChallenge.bpm, activeChallenge.timeSignature);
                    }
                  }}
                  className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all ${
                    isAudioPlaying
                      ? 'bg-rose-500 hover:bg-rose-400 text-black shadow-lg shadow-rose-500/20'
                      : 'bg-gradient-to-r from-[#c49750] to-[#ffd56b] hover:from-[#d4af37] text-black shadow-lg shadow-[#c49750]/20'
                  }`}
                >
                  {isAudioPlaying ? (
                    <>
                      <Square className="w-4 h-4 fill-black" />
                      <span>{isDe ? 'Puls anhalten' : 'Stop Metronome'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-black" />
                      <span>{isDe ? 'Tempo anhören' : 'Listen to Tempo'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Step 1: Choose Time Signature */}
            <div className="p-3 sm:p-4 rounded-xl bg-[#0e111a] border border-white/10">
              <label className="text-xs font-mono uppercase tracking-wider text-[#dedacf] block mb-2">
                1. {isDe ? 'Welche Taktart hörst du?' : 'Which time signature do you hear?'}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['2/4', '3/4', '4/4', '6/8'] as TimeSignature[]).map((sig) => (
                  <button
                    key={sig}
                    type="button"
                    disabled={guessEvaluated}
                    onClick={() => setSelectedSignature(sig)}
                    className={`py-2 px-2 rounded-xl text-center font-mono font-bold text-sm transition-all cursor-pointer ${
                      selectedSignature === sig
                        ? 'bg-[#c49750] text-black ring-2 ring-[#ffd56b] shadow-md'
                        : 'bg-[#151926] text-[#dedacf] hover:bg-[#1d2334] border border-white/10'
                    }`}
                  >
                    {sig}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Guess Tempo BPM with Slider + Fine Tuning */}
            <div className="p-3 sm:p-4 rounded-xl bg-[#0e111a] border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#dedacf]">
                  2. {isDe ? 'Schätze das Tempo (BPM):' : 'Estimate the tempo (BPM):'}
                </label>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#141824] border border-[#c49750]/50 text-base font-black font-mono text-[#ffd56b]">
                  <span>{guessedBpm}</span>
                  <span className="text-[10px] font-normal text-[#8c887d]">BPM</span>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={45}
                max={185}
                step={1}
                value={guessedBpm}
                disabled={guessEvaluated}
                onChange={(e) => setGuessedBpm(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#1b2132] rounded-lg appearance-none cursor-pointer accent-[#c49750] my-2"
              />

              {/* Fine Tuning Buttons */}
              <div className="flex items-center justify-between gap-1.5 pt-1">
                {[-5, -1, 1, 5].map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    disabled={guessEvaluated}
                    onClick={() => setGuessedBpm(b => Math.min(185, Math.max(45, b + delta)))}
                    className="flex-1 py-1 rounded-lg bg-[#141824] hover:bg-[#1f2538] border border-white/10 text-xs font-mono text-[#dedacf] transition-colors cursor-pointer"
                  >
                    {delta > 0 ? `+${delta}` : delta}
                  </button>
                ))}
              </div>
              <p className="text-[10px] font-mono text-[#8c887d] mt-2">
                {isDe ? '✨ Musikalische Toleranz aktiv: Bei ±5 BPM Abweichung erhältst du 100% Präzision!' : '✨ Musical leeway active: Estimates within ±5 BPM earn 100% precision!'}
              </p>
            </div>

            {/* Check / Next Button */}
            {!guessEvaluated ? (
              <button
                type="button"
                disabled={!selectedSignature}
                onClick={evaluateGuess}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 text-black font-mono font-bold text-sm uppercase tracking-wider cursor-pointer shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {isDe ? 'Antwort überprüfen' : 'Check My Guess'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => pickNewChallenge('TAP')}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] hover:from-[#60a5fa] text-black font-mono font-bold text-sm uppercase tracking-wider cursor-pointer shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>{isDe ? 'Nächste Runde: Tempo klopfen 🥁' : 'Next Round: Tap Target Tempo 🥁'}</span>
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </button>
            )}

            {/* Guess Result Feedback Card */}
            {guessResult && (
              <div className="p-3 sm:p-4 rounded-xl bg-[#0b0f18] border border-[#c49750]/50 animate-fade-in text-center space-y-2">
                <div className="flex items-center justify-around gap-2 pb-2 border-b border-white/10">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#8c887d] block">
                      {isDe ? 'Präzision' : 'Precision'}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                      {guessResult.precision}%
                    </span>
                  </div>

                  <div className="w-[1px] h-8 bg-white/10" />

                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#8c887d] block">
                      {isDe ? 'Tatsächlich' : 'Actual Tempo'}
                    </span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-[#ffd56b]">
                      {activeChallenge.bpm} BPM ({activeChallenge.timeSignature})
                    </span>
                  </div>

                  <div className="w-[1px] h-8 bg-white/10" />

                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#8c887d] block">
                      {isDe ? 'Abweichung' : 'Delta'}
                    </span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-[#dedacf]">
                      ±{guessResult.deltaBpm} BPM
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#dedacf] font-serif italic max-w-md mx-auto pt-1">
                  {guessResult.message}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* ================================================================ */
          /* MODE B: TARGET BPM GIVEN -> USER TAPS THE TEMPO WITH LEEWAY      */
          /* ================================================================ */
          <div className="space-y-3.5 animate-fade-in">
            {/* Target Tempo Showcase */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-[#090b12] border border-[#38bdf8]/40 shadow-inner text-center">
              <span className="text-xs font-mono uppercase tracking-wider text-[#38bdf8] block mb-1">
                {isDe ? 'Vorgegebenes Tempo & Charakter' : 'Target Tempo & Character'}
              </span>

              <div className="flex items-baseline justify-center gap-2 my-1">
                <span className="text-4xl sm:text-5xl font-black font-mono text-[#fbf9f5]">
                  {activeChallenge.bpm}
                </span>
                <span className="text-sm font-mono text-[#8c887d]">BPM</span>
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-[#141b2a] border border-[#38bdf8]/40 text-xs font-mono text-[#38bdf8] mb-2">
                🎼 {isDe ? activeChallenge.italianTermDe : activeChallenge.italianTerm}
              </div>

              <p className="text-xs text-[#dedacf] font-serif italic max-w-md mx-auto">
                {isDe 
                  ? 'Finde deinen inneren Puls und klopfe mindestens 6 bis 8 Schläge in diesem Tempo.' 
                  : 'Establish your internal pulse and tap 6 to 8 steady beats at this tempo.'}
              </p>
            </div>

            {/* Interactive Striking Pad */}
            <div className="space-y-2">
              <button
                type="button"
                onPointerDown={(e) => {
                  e.preventDefault();
                  handleUserTap();
                }}
                disabled={tapEvaluated}
                className={`w-full h-24 sm:h-28 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all select-none cursor-pointer ${
                  tapPadPressed
                    ? 'bg-gradient-to-r from-[#38bdf8] to-[#60a5fa] text-black border-[#60a5fa] scale-[0.98] shadow-[0_0_30px_rgba(56,189,248,0.85)]'
                    : 'bg-[#151926] hover:bg-[#1d2334] text-[#fbf9f5] border-white/10 shadow-lg active:scale-[0.98]'
                }`}
              >
                <span className="text-2xl sm:text-3xl">🥁</span>
                <span className="text-base sm:text-lg font-bold font-mono uppercase tracking-wider">
                  {isDe ? 'Hier tippen / klopfen' : 'Tap Tempo Here'}
                </span>
                <span className="text-[11px] font-mono text-[#8c887d]">
                  {isDe ? `Bisherige Schläge: ${tappedTimes.length} (Leertaste oder Klick)` : `Beats tapped: ${tappedTimes.length} (Spacebar or Click)`}
                </span>
              </button>
            </div>

            {/* Live Tapped Tempo Feedback & Evaluate Action */}
            <div className="flex items-center justify-between gap-2 p-2.5 sm:p-3 rounded-xl bg-[#0e111a] border border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#38bdf8]" />
                <span className="text-xs font-mono text-[#dedacf]">
                  {isDe ? 'Gemessenes Tempo:' : 'Live Tapped BPM:'}
                </span>
                <span className="text-base font-bold font-mono text-[#38bdf8]">
                  {currentTappedBpm ? `${currentTappedBpm} BPM` : '—'}
                </span>
              </div>

              {!tapEvaluated ? (
                <button
                  type="button"
                  disabled={tappedTimes.length < 4}
                  onClick={evaluateTap}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 text-black font-mono font-bold text-xs uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {isDe ? 'Auswerten' : 'Evaluate'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => pickNewChallenge('GUESS')}
                  className="px-4 py-2 rounded-xl bg-[#38bdf8] hover:bg-[#60a5fa] text-black font-mono font-bold text-xs uppercase cursor-pointer transition-all flex items-center gap-1"
                >
                  <span>{isDe ? 'Nächste Runde 🎧' : 'Next Round 🎧'}</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              )}
            </div>

            {/* Tap Result Feedback Card */}
            {tapResult && (
              <div className="p-3 sm:p-4 rounded-xl bg-[#0b0f18] border border-[#38bdf8]/50 animate-fade-in text-center space-y-2">
                <div className="flex items-center justify-around gap-2 pb-2 border-b border-white/10">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#8c887d] block">
                      {isDe ? 'Präzision' : 'Precision'}
                    </span>
                    <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
                      {tapResult.precision}%
                    </span>
                  </div>

                  <div className="w-[1px] h-8 bg-white/10" />

                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#8c887d] block">
                      {isDe ? 'Dein Tempo' : 'Your Tempo'}
                    </span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-[#ffd56b]">
                      {tapResult.measuredBpm} BPM
                    </span>
                  </div>

                  <div className="w-[1px] h-8 bg-white/10" />

                  <div>
                    <span className="text-[9px] font-mono uppercase text-[#8c887d] block">
                      {isDe ? 'Ziel-Tempo' : 'Target'}
                    </span>
                    <span className="text-lg sm:text-xl font-bold font-mono text-[#dedacf]">
                      {activeChallenge.bpm} BPM
                    </span>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[11px] font-mono text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {isDe 
                      ? `✨ Musikalische Toleranz angewandt (Abweichung: ±${tapResult.deltaBpm} BPM)` 
                      : `✨ Musical leeway applied (Difference: ±${tapResult.deltaBpm} BPM)`}
                  </span>
                </div>

                <p className="text-xs text-[#dedacf] font-serif italic max-w-md mx-auto">
                  {tapResult.message}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 4. Leaderboard Modal */}
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
                <span>{isDe ? 'Top 10 Tempo-Meister' : 'Top 10 Tempo Scores'}</span>
              </div>

              <div className="mb-4">
                <label className="text-[10px] font-mono text-[#8c887d] block mb-1">
                  {isDe ? 'Dein Name:' : 'Your Name:'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={14}
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#0b0d13] border border-white/20 text-xs text-[#fbf9f5] font-mono focus:border-[#c49750] outline-none"
                    placeholder="Metronome Master"
                  />
                  <button
                    type="button"
                    onClick={saveScore}
                    disabled={score <= 0}
                    className="px-3 py-1.5 rounded-lg bg-[#c49750] text-black font-semibold text-xs uppercase cursor-pointer disabled:opacity-40"
                  >
                    {isDe ? 'Speichern' : 'Save'}
                  </button>
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-1.5 thin-scrollbar pr-1">
                {leaderboard.length === 0 ? (
                  <p className="text-xs font-mono text-[#6e6a60] text-center py-4">
                    {isDe ? 'Noch keine Einträge. Erziele Punkte im Tempo-Atelier!' : 'No entries yet. Score points in Tempo Studio!'}
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
