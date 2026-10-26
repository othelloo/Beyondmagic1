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
  name: string; // Player name (max 12 characters)
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

// Canonical theoretical enharmonic spellings for every chord and semitone transposition
interface TransposedChordInfo {
  chordName: string;
  notes: string[];
}

const CHORD_TRANSPOSED_SPELLINGS: Record<string, Record<number, TransposedChordInfo>> = {
  // 1. Half-Diminished 7th (Tristan Chord) Bø7: 1 - ♭3 - ♭5 - ♭7
  'b-dim-min7': {
    [-5]: { chordName: 'F♯ø7', notes: ['F#2', 'A2', 'C3', 'E3'] },
    [-4]: { chordName: 'Gø7', notes: ['G2', 'Bb2', 'Db3', 'F3'] },
    [-3]: { chordName: 'G♯ø7', notes: ['G#2', 'B2', 'D3', 'F#3'] },
    [-2]: { chordName: 'Aø7', notes: ['A2', 'C3', 'Eb3', 'G3'] },
    [-1]: { chordName: 'B♭ø7', notes: ['Bb2', 'Db3', 'Fb3', 'Ab3'] }, // Exact theoretical spelling: B♭, D♭, F♭, A♭
    [0]: { chordName: 'Bø7', notes: ['B2', 'D3', 'F3', 'A3'] },
    [1]: { chordName: 'Cø7', notes: ['C3', 'Eb3', 'Gb3', 'Bb3'] },
    [2]: { chordName: 'C♯ø7', notes: ['C#3', 'E3', 'G3', 'B3'] },
    [3]: { chordName: 'Dø7', notes: ['D3', 'F3', 'Ab3', 'C4'] },
    [4]: { chordName: 'D♯ø7', notes: ['D#3', 'F#3', 'A3', 'C#4'] },
    [5]: { chordName: 'Eø7', notes: ['E3', 'G3', 'Bb3', 'D4'] },
    [6]: { chordName: 'Fø7', notes: ['F3', 'Ab3', 'Cb4', 'Eb4'] },
  },

  // 2. C Major Triad: 1 - 3 - 5 - 8
  'c-major': {
    [-5]: { chordName: 'G Major', notes: ['G2', 'B2', 'D3', 'G3'] },
    [-4]: { chordName: 'A♭ Major', notes: ['Ab2', 'C3', 'Eb3', 'Ab3'] },
    [-3]: { chordName: 'A Major', notes: ['A2', 'C#3', 'E3', 'A3'] },
    [-2]: { chordName: 'B♭ Major', notes: ['Bb2', 'D3', 'F3', 'Bb3'] },
    [-1]: { chordName: 'B Major', notes: ['B2', 'D#3', 'F#3', 'B3'] },
    [0]: { chordName: 'C Major', notes: ['C3', 'E3', 'G3', 'C4'] },
    [1]: { chordName: 'D♭ Major', notes: ['Db3', 'F3', 'Ab3', 'Db4'] },
    [2]: { chordName: 'D Major', notes: ['D3', 'F#3', 'A3', 'D4'] },
    [3]: { chordName: 'E♭ Major', notes: ['Eb3', 'G3', 'Bb3', 'Eb4'] },
    [4]: { chordName: 'E Major', notes: ['E3', 'G#3', 'B3', 'E4'] },
    [5]: { chordName: 'F Major', notes: ['F3', 'A3', 'C4', 'F4'] },
    [6]: { chordName: 'F♯ Major', notes: ['F#3', 'A#3', 'C#4', 'F#4'] },
  },

  // 3. E♭maj7: 1 - 3 - 5 - 7
  'eb-maj7': {
    [-5]: { chordName: 'B♭maj7', notes: ['Bb2', 'D3', 'F3', 'A3'] },
    [-4]: { chordName: 'Bmaj7', notes: ['B2', 'D#3', 'F#3', 'A#3'] },
    [-3]: { chordName: 'Cmaj7', notes: ['C3', 'E3', 'G3', 'B3'] },
    [-2]: { chordName: 'D♭maj7', notes: ['Db3', 'F3', 'Ab3', 'C4'] },
    [-1]: { chordName: 'Dmaj7', notes: ['D3', 'F#3', 'A3', 'C#4'] },
    [0]: { chordName: 'E♭maj7', notes: ['Eb3', 'G3', 'Bb3', 'D4'] },
    [1]: { chordName: 'Emaj7', notes: ['E3', 'G#3', 'B3', 'D#4'] },
    [2]: { chordName: 'Fmaj7', notes: ['F3', 'A3', 'C4', 'E4'] },
    [3]: { chordName: 'G♭maj7', notes: ['Gb3', 'Bb3', 'Db4', 'F4'] },
    [4]: { chordName: 'Gmaj7', notes: ['G3', 'B3', 'D4', 'F#4'] },
    [5]: { chordName: 'A♭maj7', notes: ['Ab3', 'C4', 'Eb4', 'G4'] },
    [6]: { chordName: 'Amaj7', notes: ['A3', 'C#4', 'E4', 'G#4'] },
  },

  // 4. Minor 9th Am9: 1 - ♭3 - 5 - ♭7 - 9
  'a-min9': {
    [-5]: { chordName: 'Em9', notes: ['E2', 'G2', 'B2', 'D3', 'F#3'] },
    [-4]: { chordName: 'Fm9', notes: ['F2', 'Ab2', 'C3', 'Eb3', 'G3'] },
    [-3]: { chordName: 'F♯m9', notes: ['F#2', 'A2', 'C#3', 'E3', 'G#3'] },
    [-2]: { chordName: 'Gm9', notes: ['G2', 'Bb2', 'D3', 'F3', 'A3'] },
    [-1]: { chordName: 'G♯m9', notes: ['G#2', 'B2', 'D#3', 'F#3', 'A#3'] },
    [0]: { chordName: 'Am9', notes: ['A2', 'C3', 'E3', 'G3', 'B3'] },
    [1]: { chordName: 'B♭m9', notes: ['Bb2', 'Db3', 'F3', 'Ab3', 'C4'] },
    [2]: { chordName: 'Bm9', notes: ['B2', 'D3', 'F#3', 'A3', 'C#4'] },
    [3]: { chordName: 'Cm9', notes: ['C3', 'Eb3', 'G3', 'Bb3', 'D4'] },
    [4]: { chordName: 'C♯m9', notes: ['C#3', 'E3', 'G#3', 'B3', 'D#4'] },
    [5]: { chordName: 'Dm9', notes: ['D3', 'F3', 'A3', 'C4', 'E4'] },
    [6]: { chordName: 'E♭m9', notes: ['Eb3', 'Gb3', 'Bb3', 'Db4', 'F4'] },
  },

  // 5. Dominant 7th G7: 1 - 3 - 5 - ♭7
  'g-dom7': {
    [-5]: { chordName: 'D7', notes: ['D2', 'F#2', 'A2', 'C3'] },
    [-4]: { chordName: 'E♭7', notes: ['Eb2', 'G2', 'Bb2', 'Db3'] },
    [-3]: { chordName: 'E7', notes: ['E2', 'G#2', 'B2', 'D3'] },
    [-2]: { chordName: 'F7', notes: ['F2', 'A2', 'C3', 'Eb3'] },
    [-1]: { chordName: 'F♯7', notes: ['F#2', 'A#2', 'C#3', 'E3'] },
    [0]: { chordName: 'G7', notes: ['G2', 'B2', 'D3', 'F3'] },
    [1]: { chordName: 'A♭7', notes: ['Ab2', 'C3', 'Eb3', 'Gb3'] }, // G♭, not F♯!
    [2]: { chordName: 'A7', notes: ['A2', 'C#3', 'E3', 'G3'] },
    [3]: { chordName: 'B♭7', notes: ['Bb2', 'D3', 'F3', 'Ab3'] },
    [4]: { chordName: 'B7', notes: ['B2', 'D#3', 'F#3', 'A3'] },
    [5]: { chordName: 'C7', notes: ['C3', 'E3', 'G3', 'Bb3'] },
    [6]: { chordName: 'D♭7', notes: ['Db3', 'F3', 'Ab3', 'Cb4'] },
  },

  // 6. Minor 7th Fm7: 1 - ♭3 - 5 - ♭7
  'f-min7': {
    [-5]: { chordName: 'Cm7', notes: ['C3', 'Eb3', 'G3', 'Bb3'] },
    [-4]: { chordName: 'C♯m7', notes: ['C#3', 'E3', 'G#3', 'B3'] },
    [-3]: { chordName: 'Dm7', notes: ['D3', 'F3', 'A3', 'C4'] },
    [-2]: { chordName: 'E♭m7', notes: ['Eb3', 'Gb3', 'Bb3', 'Db4'] }, // E♭, G♭, B♭, D♭
    [-1]: { chordName: 'Em7', notes: ['E3', 'G3', 'B3', 'D4'] },
    [0]: { chordName: 'Fm7', notes: ['F3', 'Ab3', 'C4', 'Eb4'] },
    [1]: { chordName: 'F♯m7', notes: ['F#3', 'A3', 'C#4', 'E4'] },
    [2]: { chordName: 'Gm7', notes: ['G3', 'Bb3', 'D4', 'F4'] },
    [3]: { chordName: 'G♯m7', notes: ['G#3', 'B3', 'D#4', 'F#4'] },
    [4]: { chordName: 'Am7', notes: ['A3', 'C4', 'E4', 'G4'] },
    [5]: { chordName: 'B♭m7', notes: ['Bb3', 'Db4', 'F4', 'Ab4'] },
    [6]: { chordName: 'Bm7', notes: ['B3', 'D4', 'F#4', 'A4'] },
  },

  // 7. Minor 6th Dm6: 1 - ♭3 - 5 - 6
  'd-min6': {
    [-5]: { chordName: 'Am6', notes: ['A2', 'C3', 'E3', 'F#3'] },
    [-4]: { chordName: 'B♭m6', notes: ['Bb2', 'Db3', 'F3', 'G3'] }, // D♭, not C♯!
    [-3]: { chordName: 'Bm6', notes: ['B2', 'D3', 'F#3', 'G#3'] },
    [-2]: { chordName: 'Cm6', notes: ['C3', 'Eb3', 'G3', 'A3'] },
    [-1]: { chordName: 'C♯m6', notes: ['C#3', 'E3', 'G#3', 'A#3'] },
    [0]: { chordName: 'Dm6', notes: ['D3', 'F3', 'A3', 'B3'] },
    [1]: { chordName: 'E♭m6', notes: ['Eb3', 'Gb3', 'Bb3', 'C4'] }, // G♭, not F♯!
    [2]: { chordName: 'Em6', notes: ['E3', 'G3', 'B3', 'C#4'] },
    [3]: { chordName: 'Fm6', notes: ['F3', 'Ab3', 'C4', 'D4'] },
    [4]: { chordName: 'F♯m6', notes: ['F#3', 'A3', 'C#4', 'D#4'] },
    [5]: { chordName: 'Gm6', notes: ['G3', 'Bb3', 'D4', 'E4'] },
    [6]: { chordName: 'A♭m6', notes: ['Ab3', 'Cb4', 'Eb4', 'F4'] },
  },

  // 8. Augmented Triad Eaug: 1 - 3 - ♯5
  'e-aug': {
    [-5]: { chordName: 'Baug', notes: ['B2', 'D#3', 'G3'] },
    [-4]: { chordName: 'Caug', notes: ['C3', 'E3', 'G#3'] },
    [-3]: { chordName: 'D♭aug', notes: ['Db3', 'F3', 'A3'] },
    [-2]: { chordName: 'Daug', notes: ['D3', 'F#3', 'A#3'] },
    [-1]: { chordName: 'E♭aug', notes: ['Eb3', 'G3', 'B3'] },
    [0]: { chordName: 'Eaug', notes: ['E3', 'G#3', 'C4'] },
    [1]: { chordName: 'Faug', notes: ['F3', 'A3', 'C#4'] },
    [2]: { chordName: 'F♯aug', notes: ['F#3', 'A#3', 'D4'] },
    [3]: { chordName: 'Gaug', notes: ['G3', 'B3', 'D#4'] },
    [4]: { chordName: 'A♭aug', notes: ['Ab3', 'C4', 'E4'] },
    [5]: { chordName: 'Aaug', notes: ['A3', 'C#4', 'F4'] },
    [6]: { chordName: 'B♭aug', notes: ['Bb3', 'D4', 'F#4'] },
  },

  // 9. Diminished 7th C#°7: 1 - ♭3 - ♭5 - 𝄫7
  'cs-dim7': {
    [-5]: { chordName: 'G♯°7', notes: ['G#2', 'B2', 'D3', 'F3'] },
    [-4]: { chordName: 'A°7', notes: ['A2', 'C3', 'Eb3', 'Gb3'] },
    [-3]: { chordName: 'B♭°7', notes: ['Bb2', 'Db3', 'Fb3', 'G3'] }, // D♭ and F♭!
    [-2]: { chordName: 'B°7', notes: ['B2', 'D3', 'F3', 'Ab3'] },
    [-1]: { chordName: 'C°7', notes: ['C3', 'Eb3', 'Gb3', 'A3'] },
    [0]: { chordName: 'C♯°7', notes: ['C#3', 'E3', 'G3', 'Bb3'] },
    [1]: { chordName: 'D°7', notes: ['D3', 'F3', 'Ab3', 'Cb4'] },
    [2]: { chordName: 'D♯°7', notes: ['D#3', 'F#3', 'A3', 'C4'] },
    [3]: { chordName: 'E°7', notes: ['E3', 'G3', 'Bb3', 'Db4'] },
    [4]: { chordName: 'F°7', notes: ['F3', 'Ab3', 'Cb4', 'D4'] },
    [5]: { chordName: 'F♯°7', notes: ['F#3', 'A3', 'C4', 'Eb4'] },
    [6]: { chordName: 'G°7', notes: ['G3', 'Bb3', 'Db4', 'E4'] },
  },

  // 10. Major 9th maj9: 1 - 3 - 5 - 7 - 9
  'maj-9': {
    [-5]: { chordName: 'Cmaj9', notes: ['C3', 'E3', 'G3', 'B3', 'D4'] },
    [-4]: { chordName: 'D♭maj9', notes: ['Db3', 'F3', 'Ab3', 'C4', 'Eb4'] },
    [-3]: { chordName: 'Dmaj9', notes: ['D3', 'F#3', 'A3', 'C#4', 'E4'] },
    [-2]: { chordName: 'E♭maj9', notes: ['Eb3', 'G3', 'Bb3', 'D4', 'F4'] },
    [-1]: { chordName: 'Emaj9', notes: ['E3', 'G#3', 'B3', 'D#4', 'F#4'] },
    [0]: { chordName: 'Fmaj9', notes: ['F3', 'A3', 'C4', 'E4', 'G4'] },
    [1]: { chordName: 'G♭maj9', notes: ['Gb3', 'Bb3', 'Db4', 'F4', 'Ab4'] },
    [2]: { chordName: 'Gmaj9', notes: ['G3', 'B3', 'D4', 'F#4', 'A4'] },
    [3]: { chordName: 'A♭maj9', notes: ['Ab3', 'C4', 'Eb4', 'G4', 'Bb4'] },
    [4]: { chordName: 'Amaj9', notes: ['A3', 'C#4', 'E4', 'G#4', 'B4'] },
    [5]: { chordName: 'B♭maj9', notes: ['Bb3', 'D4', 'F4', 'A4', 'C5'] },
    [6]: { chordName: 'Bmaj9', notes: ['B3', 'D#4', 'F#4', 'A#4', 'C#5'] },
  },

  // 11. Minor-Major 7th m(maj7): 1 - ♭3 - 5 - 7
  'min-maj7': {
    [-5]: { chordName: 'Am(maj7)', notes: ['A2', 'C3', 'E3', 'G#3'] },
    [-4]: { chordName: 'B♭m(maj7)', notes: ['Bb2', 'Db3', 'F3', 'A3'] },
    [-3]: { chordName: 'Bm(maj7)', notes: ['B2', 'D3', 'F#3', 'A#3'] },
    [-2]: { chordName: 'Cm(maj7)', notes: ['C3', 'Eb3', 'G3', 'B3'] },
    [-1]: { chordName: 'C♯m(maj7)', notes: ['C#3', 'E3', 'G#3', 'C4'] },
    [0]: { chordName: 'Dm(maj7)', notes: ['D3', 'F3', 'A3', 'C#4'] },
    [1]: { chordName: 'E♭m(maj7)', notes: ['Eb3', 'Gb3', 'Bb3', 'D4'] },
    [2]: { chordName: 'Em(maj7)', notes: ['E3', 'G3', 'B3', 'D#4'] },
    [3]: { chordName: 'Fm(maj7)', notes: ['F3', 'Ab3', 'C4', 'E4'] },
    [4]: { chordName: 'F♯m(maj7)', notes: ['F#3', 'A3', 'C#4', 'F4'] },
    [5]: { chordName: 'Gm(maj7)', notes: ['G3', 'Bb3', 'D4', 'F#4'] },
    [6]: { chordName: 'A♭m(maj7)', notes: ['Ab3', 'Cb4', 'Eb4', 'G4'] },
  },

  // 12. Dominant 7th Sus4 (7sus4): 1 - 4 - 5 - ♭7
  'dom7-sus4': {
    [-5]: { chordName: 'D7sus4', notes: ['D2', 'G2', 'A2', 'C3'] },
    [-4]: { chordName: 'E♭7sus4', notes: ['Eb2', 'Ab2', 'Bb2', 'Db3'] },
    [-3]: { chordName: 'E7sus4', notes: ['E2', 'A2', 'B2', 'D3'] },
    [-2]: { chordName: 'F7sus4', notes: ['F2', 'Bb2', 'C3', 'Eb3'] },
    [-1]: { chordName: 'F♯7sus4', notes: ['F#2', 'B2', 'C#3', 'E3'] },
    [0]: { chordName: 'G7sus4', notes: ['G2', 'C3', 'D3', 'F3'] },
    [1]: { chordName: 'A♭7sus4', notes: ['Ab2', 'Db3', 'Eb3', 'Gb3'] },
    [2]: { chordName: 'A7sus4', notes: ['A2', 'D3', 'E3', 'G3'] },
    [3]: { chordName: 'B♭7sus4', notes: ['Bb2', 'Eb3', 'F3', 'Ab3'] },
    [4]: { chordName: 'B7sus4', notes: ['B2', 'E3', 'F#3', 'A3'] },
    [5]: { chordName: 'C7sus4', notes: ['C3', 'F3', 'G3', 'Bb3'] },
    [6]: { chordName: 'D♭7sus4', notes: ['Db3', 'Gb3', 'Ab3', 'Cb4'] },
  },
};

function getTransposedChordData(
  chordId: string,
  shift: number,
  defaultNotes: string[],
  defaultName: string
): TransposedChordInfo {
  if (shift === 0) {
    return { chordName: defaultName, notes: defaultNotes };
  }
  const chordMap = CHORD_TRANSPOSED_SPELLINGS[chordId];
  if (chordMap && chordMap[shift]) {
    return chordMap[shift];
  }
  return { chordName: defaultName, notes: defaultNotes };
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

// Benchmark records for new visitors (Chord Colors)
const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', name: 'Abdellah L.', score: 11420, timeSeconds: 18.2, avgReactionTime: 1.8, mistakes: 0, accuracy: 100, date: 'Oct 24' },
  { id: '2', name: 'Maestro K.', score: 10650, timeSeconds: 22.4, avgReactionTime: 2.2, mistakes: 0, accuracy: 100, date: 'Oct 24' },
  { id: '3', name: 'Vocaliste', score: 9840, timeSeconds: 26.5, avgReactionTime: 2.6, mistakes: 0, accuracy: 100, date: 'Oct 23' },
  { id: '4', name: 'Parisian Ten', score: 9150, timeSeconds: 31.0, avgReactionTime: 2.9, mistakes: 1, accuracy: 91, date: 'Oct 23' },
  { id: '5', name: 'Soprano B.', score: 8640, timeSeconds: 35.8, avgReactionTime: 3.3, mistakes: 1, accuracy: 91, date: 'Oct 22' },
  { id: '6', name: 'Opera Fan', score: 7920, timeSeconds: 42.1, avgReactionTime: 3.8, mistakes: 2, accuracy: 83, date: 'Oct 21' },
];

// Benchmark records for new visitors (Inversions Game)
export const DEFAULT_INVERSIONS_LEADERBOARD: LeaderboardEntry[] = [
  { id: 'inv-1', name: 'Abdellah L.', score: 11280, timeSeconds: 19.4, avgReactionTime: 1.9, mistakes: 0, accuracy: 100, date: 'Oct 24' },
  { id: 'inv-2', name: 'Maestro K.', score: 10450, timeSeconds: 23.8, avgReactionTime: 2.3, mistakes: 0, accuracy: 100, date: 'Oct 24' },
  { id: 'inv-3', name: 'Ear Master', score: 9650, timeSeconds: 27.2, avgReactionTime: 2.7, mistakes: 0, accuracy: 100, date: 'Oct 23' },
  { id: 'inv-4', name: 'Harmony Prof', score: 8980, timeSeconds: 32.5, avgReactionTime: 3.1, mistakes: 1, accuracy: 91, date: 'Oct 23' },
  { id: 'inv-5', name: 'Basso Continuo', score: 8420, timeSeconds: 37.1, avgReactionTime: 3.5, mistakes: 1, accuracy: 91, date: 'Oct 22' },
  { id: 'inv-6', name: 'Counterpoint', score: 7750, timeSeconds: 44.0, avgReactionTime: 4.1, mistakes: 2, accuracy: 83, date: 'Oct 21' },
];

export type GameMode = 'chord-colors' | 'inversions';
export type InversionDifficulty = 3 | 4 | 5;

export interface InversionOptionConfig {
  index: number;
  titleEn: string;
  titleDe: string;
  badge: string;
  subEn: string;
  subDe: string;
}

export const INVERSION_CONFIGS_BY_DIFF: Record<InversionDifficulty, InversionOptionConfig[]> = {
  3: [
    { index: 0, titleEn: 'Root Position', titleDe: 'Grundstellung', badge: '5/3', subEn: 'Root in bass', subDe: 'Grundton im Bass' },
    { index: 1, titleEn: '1st Inversion (6)', titleDe: '1. Umkehrung (Sextakkord)', badge: '6', subEn: 'Third in bass', subDe: 'Terz im Bass' },
    { index: 2, titleEn: '2nd Inversion (6/4)', titleDe: '2. Umkehrung (Quartsextakkord)', badge: '6/4', subEn: 'Fifth in bass', subDe: 'Quinte im Bass' },
  ],
  4: [
    { index: 0, titleEn: 'Root Position', titleDe: 'Grundstellung', badge: '7', subEn: 'Root in bass', subDe: 'Grundton im Bass' },
    { index: 1, titleEn: '1st Inversion (6/5)', titleDe: '1. Umkehrung (Quintsextakkord)', badge: '6/5', subEn: 'Third in bass', subDe: 'Terz im Bass' },
    { index: 2, titleEn: '2nd Inversion (4/3)', titleDe: '2. Umkehrung (Terzquartakkord)', badge: '4/3', subEn: 'Fifth in bass', subDe: 'Quinte im Bass' },
    { index: 3, titleEn: '3rd Inversion (4/2)', titleDe: '3. Umkehrung (Sekundakkord)', badge: '4/2', subEn: 'Seventh in bass', subDe: 'Septime im Bass' },
  ],
  5: [
    { index: 0, titleEn: 'Root Position', titleDe: 'Grundstellung', badge: '9', subEn: 'Root in bass', subDe: 'Grundton im Bass' },
    { index: 1, titleEn: '1st Inversion', titleDe: '1. Umkehrung', badge: '1st Inv', subEn: 'Third in bass', subDe: 'Terz im Bass' },
    { index: 2, titleEn: '2nd Inversion', titleDe: '2. Umkehrung', badge: '2nd Inv', subEn: 'Fifth in bass', subDe: 'Quinte im Bass' },
    { index: 3, titleEn: '3rd Inversion', titleDe: '3. Umkehrung', badge: '3rd Inv', subEn: 'Seventh in bass', subDe: 'Septime im Bass' },
    { index: 4, titleEn: '4th Inversion', titleDe: '4. Umkehrung', badge: '4th Inv', subEn: 'Ninth in bass', subDe: 'None im Bass' },
  ],
};

export interface InversionRoundData {
  targetInversionIndex: number;
  baseChordName: string;
  baseChordNameDe: string;
  fullDisplayName: string;
  bassNoteName: string;
  notes: string[];
  frequencies: number[];
  color: string;
  figuredBass: string;
  explanationEn: string;
  explanationDe: string;
}

// Strictly curated, non-aliasing chords for Inversions training
// (No augmented or diminished 7th chords to avoid acoustic symmetry ambiguity;
// no added-6th chords to avoid min7 aliasing).
interface InversionBaseChordSeed {
  name: string;
  nameDe: string;
  notes: string[];
  color: string;
}

const INVERSION_SEEDS_3: InversionBaseChordSeed[] = [
  { name: 'C Major', nameDe: 'C-Dur', notes: ['C3', 'E3', 'G3'], color: '#38bdf8' },
  { name: 'D Major', nameDe: 'D-Dur', notes: ['D3', 'F#3', 'A3'], color: '#60a5fa' },
  { name: 'E Major', nameDe: 'E-Dur', notes: ['E3', 'G#3', 'B3'], color: '#818cf8' },
  { name: 'F Major', nameDe: 'F-Dur', notes: ['F2', 'A2', 'C3'], color: '#38bdf8' },
  { name: 'G Major', nameDe: 'G-Dur', notes: ['G2', 'B2', 'D3'], color: '#60a5fa' },
  { name: 'A Major', nameDe: 'A-Dur', notes: ['A2', 'C#3', 'E3'], color: '#818cf8' },
  { name: 'B♭ Major', nameDe: 'B-Dur', notes: ['Bb2', 'D3', 'F3'], color: '#38bdf8' },
  { name: 'E♭ Major', nameDe: 'Es-Dur', notes: ['Eb3', 'G3', 'Bb3'], color: '#60a5fa' },
  { name: 'A♭ Major', nameDe: 'As-Dur', notes: ['Ab2', 'C3', 'Eb3'], color: '#818cf8' },
  { name: 'A Minor', nameDe: 'a-Moll', notes: ['A2', 'C3', 'E3'], color: '#c084fc' },
  { name: 'D Minor', nameDe: 'd-Moll', notes: ['D3', 'F3', 'A3'], color: '#e879f9' },
  { name: 'E Minor', nameDe: 'e-Moll', notes: ['E2', 'G2', 'B2'], color: '#f472b6' },
  { name: 'C Minor', nameDe: 'c-Moll', notes: ['C3', 'Eb3', 'G3'], color: '#c084fc' },
  { name: 'G Minor', nameDe: 'g-Moll', notes: ['G2', 'Bb2', 'D3'], color: '#e879f9' },
  { name: 'F Minor', nameDe: 'f-Moll', notes: ['F2', 'Ab2', 'C3'], color: '#f472b6' },
  { name: 'B Minor', nameDe: 'h-Moll', notes: ['B2', 'D3', 'F#3'], color: '#c084fc' },
];

const INVERSION_SEEDS_4: InversionBaseChordSeed[] = [
  { name: 'G7', nameDe: 'G7', notes: ['G2', 'B2', 'D3', 'F3'], color: '#f59e0b' },
  { name: 'C7', nameDe: 'C7', notes: ['C3', 'E3', 'G3', 'Bb3'], color: '#d97706' },
  { name: 'D7', nameDe: 'D7', notes: ['D3', 'F#3', 'A3', 'C4'], color: '#b45309' },
  { name: 'A7', nameDe: 'A7', notes: ['A2', 'C#3', 'E3', 'G3'], color: '#f59e0b' },
  { name: 'E7', nameDe: 'E7', notes: ['E2', 'G#2', 'B2', 'D3'], color: '#d97706' },
  { name: 'F7', nameDe: 'F7', notes: ['F2', 'A2', 'C3', 'Eb3'], color: '#b45309' },
  { name: 'B♭7', nameDe: 'B7', notes: ['Bb2', 'D3', 'F3', 'Ab3'], color: '#f59e0b' },
  { name: 'Cmaj7', nameDe: 'Cmaj7', notes: ['C3', 'E3', 'G3', 'B3'], color: '#38bdf8' },
  { name: 'Fmaj7', nameDe: 'Fmaj7', notes: ['F2', 'A2', 'C3', 'E3'], color: '#60a5fa' },
  { name: 'Gmaj7', nameDe: 'Gmaj7', notes: ['G2', 'B2', 'D3', 'F#3'], color: '#818cf8' },
  { name: 'E♭maj7', nameDe: 'Esmaj7', notes: ['Eb3', 'G3', 'Bb3', 'D4'], color: '#38bdf8' },
  { name: 'A♭maj7', nameDe: 'Asmaj7', notes: ['Ab2', 'C3', 'Eb3', 'G3'], color: '#60a5fa' },
  { name: 'Am7', nameDe: 'Am7', notes: ['A2', 'C3', 'E3', 'G3'], color: '#a855f7' },
  { name: 'Dm7', nameDe: 'Dm7', notes: ['D3', 'F3', 'A3', 'C4'], color: '#9333ea' },
  { name: 'Em7', nameDe: 'Em7', notes: ['E2', 'G2', 'B2', 'D3'], color: '#7e22ce' },
  { name: 'Cm7', nameDe: 'Cm7', notes: ['C3', 'Eb3', 'G3', 'Bb3'], color: '#a855f7' },
  { name: 'Gm7', nameDe: 'Gm7', notes: ['G2', 'Bb2', 'D3', 'F3'], color: '#9333ea' },
  { name: 'Dm(maj7)', nameDe: 'Dm(maj7)', notes: ['D3', 'F3', 'A3', 'C#4'], color: '#ec4899' },
  { name: 'Am(maj7)', nameDe: 'Am(maj7)', notes: ['A2', 'C3', 'E3', 'G#3'], color: '#db2777' },
];

const INVERSION_SEEDS_5: InversionBaseChordSeed[] = [
  { name: 'Cmaj9', nameDe: 'Cmaj9', notes: ['C3', 'E3', 'G3', 'B3', 'D4'], color: '#38bdf8' },
  { name: 'Fmaj9', nameDe: 'Fmaj9', notes: ['F2', 'A2', 'C3', 'E3', 'G3'], color: '#60a5fa' },
  { name: 'Gmaj9', nameDe: 'Gmaj9', notes: ['G2', 'B2', 'D3', 'F#3', 'A3'], color: '#818cf8' },
  { name: 'E♭maj9', nameDe: 'Esmaj9', notes: ['Eb3', 'G3', 'Bb3', 'D4', 'F4'], color: '#38bdf8' },
  { name: 'G9', nameDe: 'G9', notes: ['G2', 'B2', 'D3', 'F3', 'A3'], color: '#f59e0b' },
  { name: 'C9', nameDe: 'C9', notes: ['C3', 'E3', 'G3', 'Bb3', 'D4'], color: '#d97706' },
  { name: 'D9', nameDe: 'D9', notes: ['D3', 'F#3', 'A3', 'C4', 'E4'], color: '#b45309' },
  { name: 'B♭9', nameDe: 'B9', notes: ['Bb2', 'D3', 'F3', 'Ab3', 'C4'], color: '#f59e0b' },
  { name: 'Am9', nameDe: 'Am9', notes: ['A2', 'C3', 'E3', 'G3', 'B3'], color: '#a855f7' },
  { name: 'Dm9', nameDe: 'Dm9', notes: ['D3', 'F3', 'A3', 'C4', 'E4'], color: '#9333ea' },
  { name: 'Em9', nameDe: 'Em9', notes: ['E2', 'G2', 'B2', 'D3', 'F#3'], color: '#7e22ce' },
];

function noteStrToMidi(note: string): number {
  const match = note.match(/^([A-G])(b|#)?([1-5])$/);
  if (!match) return 60;
  const step = match[1];
  const acc = match[2] || '';
  const oct = parseInt(match[3], 10);
  const stepMap: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  let midi = (oct + 1) * 12 + stepMap[step];
  if (acc === 'b') midi -= 1;
  if (acc === '#') midi += 1;
  return midi;
}

function midiToFrequency(midi: number): number {
  return Number((440 * Math.pow(2, (midi - 69) / 12)).toFixed(2));
}

function shiftNoteOctave(note: string, deltaOctave: number): string {
  const match = note.match(/^([A-G][b#]?)([1-5])$/);
  if (!match) return note;
  const newOctave = Math.max(1, Math.min(6, parseInt(match[2], 10) + deltaOctave));
  return `${match[1]}${newOctave}`;
}

function buildInversionVoicing(
  baseChord: InversionBaseChordSeed,
  inversionIndex: number,
  difficulty: InversionDifficulty,
  isDe: boolean
): InversionRoundData {
  const N = baseChord.notes.length;
  let invertedNotes: string[] = [];
  for (let i = inversionIndex; i < N; i++) {
    invertedNotes.push(baseChord.notes[i]);
  }
  for (let i = 0; i < inversionIndex; i++) {
    invertedNotes.push(shiftNoteOctave(baseChord.notes[i], 1));
  }

  let midis = invertedNotes.map(n => noteStrToMidi(n));
  const bassMidi = midis[0];

  // Keep chord in rich acoustic piano foundation (E2 - F3 bass register)
  if (bassMidi >= 53 || midis[midis.length - 1] > 72) {
    invertedNotes = invertedNotes.map(n => shiftNoteOctave(n, -1));
    midis = invertedNotes.map(n => noteStrToMidi(n));
  }

  const freqs = midis.map(m => midiToFrequency(m));
  const bassNoteClean = invertedNotes[0].replace(/[0-9]/g, '').replace('b', '♭').replace('#', '♯');

  const config = INVERSION_CONFIGS_BY_DIFF[difficulty].find(c => c.index === inversionIndex) || INVERSION_CONFIGS_BY_DIFF[difficulty][0];
  const invTitle = isDe ? config.titleDe : config.titleEn;
  const figuredBass = config.badge;

  const slashNotation = inversionIndex === 0
    ? (isDe ? baseChord.nameDe : baseChord.name)
    : `${isDe ? baseChord.nameDe : baseChord.name} / ${bassNoteClean}`;

  const fullDisplayName = `${slashNotation} (${invTitle})`;

  const explanationEn = inversionIndex === 0
    ? `Root position with ${bassNoteClean} in the bass`
    : `${config.titleEn} with ${bassNoteClean} (${config.subEn.toLowerCase()})`;

  const explanationDe = inversionIndex === 0
    ? `Grundstellung mit ${bassNoteClean} im Bass`
    : `${config.titleDe} mit ${bassNoteClean} (${config.subDe.toLowerCase()})`;

  return {
    targetInversionIndex: inversionIndex,
    baseChordName: isDe ? baseChord.nameDe : baseChord.name,
    baseChordNameDe: baseChord.nameDe,
    fullDisplayName,
    bassNoteName: bassNoteClean,
    notes: invertedNotes,
    frequencies: freqs,
    color: baseChord.color,
    figuredBass,
    explanationEn,
    explanationDe
  };
}

// Crystal-clear chord titles and harmonic shorthand badges for ear training buttons
export interface ChordDisplayDetails {
  title: string;
  badge: string;
}

export function getChordDisplay(chord: EarTrainingChordItem, isDe: boolean): ChordDisplayDetails {
  switch (chord.id) {
    case 'c-major':
      return {
        title: isDe ? 'Dur' : 'Major',
        badge: 'Maj',
      };
    case 'maj-9':
      return {
        title: isDe ? 'Großer Nonenakkord' : 'Major 9th',
        badge: 'maj9',
      };
    case 'eb-maj7':
      return {
        title: isDe ? 'Großer Septakkord' : 'Major 7th',
        badge: 'maj7',
      };
    case 'f-min7':
      return {
        title: isDe ? 'Moll-Septakkord' : 'Minor 7th',
        badge: 'm7',
      };
    case 'dom7-sus4':
      return {
        title: isDe ? 'Dominant 7. sus4' : '7sus4',
        badge: '7sus4',
      };
    case 'a-min9':
      return {
        title: isDe ? 'Moll-Nonakkord' : 'Minor 9th',
        badge: 'm9',
      };
    case 'd-min6':
      return {
        title: isDe ? 'Moll-Sextakkord' : 'Minor 6th',
        badge: 'm6',
      };
    case 'e-aug':
      return {
        title: isDe ? 'Übermäßig' : 'Augmented',
        badge: 'aug',
      };
    case 'min-maj7':
      return {
        title: isDe ? 'Moll-Major-7' : 'Minor-Major 7th',
        badge: 'm(maj7)',
      };
    case 'b-dim-min7':
      return {
        title: isDe ? 'Halbverminderter 7.' : 'Half-Diminished 7th',
        badge: 'ø7',
      };
    case 'g-dom7':
      return {
        title: isDe ? 'Dominant-Septakkord' : 'Dominant 7th',
        badge: '7',
      };
    case 'cs-dim7':
      return {
        title: isDe ? 'Vollverminderter 7.' : 'Diminished 7th',
        badge: '°7',
      };
    default:
      return {
        title: isDe ? (chord.chordTypeDe || chord.chordType) : chord.chordType,
        badge: chord.name,
      };
  }
}

export const EarTrainingStudio: React.FC<EarTrainingStudioProps> = ({
  chords,
  playChordFrequencies,
  stopAudio,
  isPlaying,
  soundMode,
  isDe = false
}) => {
  // Game Mode: 'chord-colors' (Akkord-Farben) or 'inversions' (Umkehrungen)
  const [gameMode, setGameMode] = useState<GameMode>('chord-colors');
  const [inversionDifficulty, setInversionDifficulty] = useState<InversionDifficulty>(3);
  const [inversionRound, setInversionRound] = useState<InversionRoundData | null>(null);
  const [selectedInversionIndex, setSelectedInversionIndex] = useState<number | null>(null);

  // Chord Colors mode state
  const [currentChordIndex, setCurrentChordIndex] = useState<number>(0);
  const [semitoneShift, setSemitoneShift] = useState<number>(0);
  const [playbackStyle, setPlaybackStyle] = useState<'block' | 'arpeggio'>('block');
  const [options, setOptions] = useState<EarTrainingChordItem[]>([]);
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);

  // Common round state
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

  // Leaderboard State (Chord Colors)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem('beyondMagic_top10EarScores');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: LeaderboardEntry, idx: number) => ({
            ...item,
            name: (item.name || DEFAULT_LEADERBOARD[idx]?.name || 'Player').slice(0, 12)
          }));
        }
      }
    } catch {}
    return DEFAULT_LEADERBOARD;
  });

  // Dedicated Inversions Leaderboard State
  const [leaderboardInversions, setLeaderboardInversions] = useState<LeaderboardEntry[]>(() => {
    try {
      const saved = localStorage.getItem('beyondMagic_top10InversionsScores');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: LeaderboardEntry, idx: number) => ({
            ...item,
            name: (item.name || DEFAULT_INVERSIONS_LEADERBOARD[idx]?.name || 'Player').slice(0, 12)
          }));
        }
      }
    } catch {}
    return DEFAULT_INVERSIONS_LEADERBOARD;
  });

  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [activeLeaderboardTab, setActiveLeaderboardTab] = useState<GameMode>('chord-colors');

  // Player Name for High Score (12 letters max)
  const [playerName, setPlayerName] = useState<string>(() => {
    try {
      return (localStorage.getItem('beyondMagic_playerName') || '').slice(0, 12);
    } catch {}
    return '';
  });
  const [nameSaved, setNameSaved] = useState<boolean>(false);

  const roundStartTimeRef = useRef<number>(0);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentChord = chords[currentChordIndex] || chords[0];
  const transposedChordData = getTransposedChordData(currentChord.id, semitoneShift, currentChord.notes, currentChord.name);
  const transposedNotes = transposedChordData.notes;
  const transposedChordName = transposedChordData.chordName;

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

  // Calculate transposed frequencies for Chord Colors mode
  const getTransposedFreqs = useCallback((chord: EarTrainingChordItem, shift: number) => {
    if (shift === 0) return chord.frequencies;
    const ratio = Math.pow(2, shift / 12);
    return chord.frequencies.map(f => Number((f * ratio).toFixed(2)));
  }, []);

  // Set up a new challenge round (works for both modes)
  const setupNewRound = useCallback((modeOverride?: GameMode, diffOverride?: InversionDifficulty) => {
    stopAudio(true);
    setSelectedAnswerId(null);
    setSelectedInversionIndex(null);
    setHasAnswered(false);
    setIsCorrect(null);
    setLastChordReactionTime(null);
    setRoundElapsedSec(0);
    setIsTimerRunning(false);
    roundStartTimeRef.current = 0;

    const activeMode = modeOverride || gameMode;
    const activeDiff = diffOverride || inversionDifficulty;

    if (activeMode === 'inversions') {
      // Pick random base chord seed for the selected difficulty
      const seeds = activeDiff === 3 ? INVERSION_SEEDS_3 : activeDiff === 4 ? INVERSION_SEEDS_4 : INVERSION_SEEDS_5;
      const baseSeed = seeds[Math.floor(Math.random() * seeds.length)];
      // Pick random target inversion index (0 to diff - 1)
      const targetInvIndex = Math.floor(Math.random() * activeDiff);

      const roundData = buildInversionVoicing(baseSeed, targetInvIndex, activeDiff, isDe);
      setInversionRound(roundData);

      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = setTimeout(() => {
        playChordFrequencies(roundData.frequencies, soundMode, playbackStyle === 'arpeggio');
        roundStartTimeRef.current = Date.now();
        setIsTimerRunning(true);
      }, 160);
    } else {
      // Chord Colors mode
      const nextIndex = Math.floor(Math.random() * chords.length);
      setCurrentChordIndex(nextIndex);

      const nextShift = SEMITONE_OFFSETS[Math.floor(Math.random() * SEMITONE_OFFSETS.length)];
      setSemitoneShift(nextShift);

      const targetChord = chords[nextIndex];
      const distractors = chords
        .filter(c => c.id !== targetChord.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const roundOptions = [targetChord, ...distractors].sort(() => 0.5 - Math.random());
      setOptions(roundOptions);

      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = setTimeout(() => {
        const freqs = targetChord.frequencies.map(f => Number((f * Math.pow(2, nextShift / 12)).toFixed(2)));
        playChordFrequencies(freqs, soundMode, playbackStyle === 'arpeggio');
        roundStartTimeRef.current = Date.now();
        setIsTimerRunning(true);
      }, 160);
    }
  }, [chords, gameMode, inversionDifficulty, isDe, playbackStyle, playChordFrequencies, soundMode, stopAudio]);

  // Switch Game Mode
  const handleSwitchGameMode = (newMode: GameMode) => {
    if (newMode === gameMode) return;
    setGameMode(newMode);
    setStreak(0);
    setMistakesInCurrentRun(0);
    setAccumulatedStreakTime(0);
    setStreakPointsEarned([]);
    setHasCompleted10(false);
    setIsNewHighScore(false);
    setLastRunResult(null);
    setNameSaved(false);
    setupNewRound(newMode, inversionDifficulty);
  };

  // Switch Inversion Difficulty
  const handleSwitchInversionDifficulty = (diff: InversionDifficulty) => {
    if (diff === inversionDifficulty) return;
    setInversionDifficulty(diff);
    setStreak(0);
    setMistakesInCurrentRun(0);
    setAccumulatedStreakTime(0);
    setStreakPointsEarned([]);
    setHasCompleted10(false);
    setIsNewHighScore(false);
    setLastRunResult(null);
    setNameSaved(false);
    setupNewRound('inversions', diff);
  };

  // Restart 10-streak challenge
  const handleRestartChallenge = () => {
    setStreak(0);
    setMistakesInCurrentRun(0);
    setAccumulatedStreakTime(0);
    setStreakPointsEarned([]);
    setHasCompleted10(false);
    setIsNewHighScore(false);
    setLastRunResult(null);
    setNameSaved(false);
    setupNewRound();
  };

  // Initial mount setup
  useEffect(() => {
    if (gameMode === 'chord-colors') {
      if (chords.length > 0 && options.length === 0) {
        setupNewRound();
      }
    } else {
      if (!inversionRound) {
        setupNewRound();
      }
    }
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [chords.length, gameMode, inversionRound, options.length, setupNewRound]);

  // Replay current challenge sound
  const handleListen = useCallback((styleOverride?: 'block' | 'arpeggio') => {
    const style = styleOverride || playbackStyle;
    if (gameMode === 'inversions') {
      if (inversionRound) {
        playChordFrequencies(inversionRound.frequencies, soundMode, style === 'arpeggio');
      }
    } else {
      const freqs = getTransposedFreqs(currentChord, semitoneShift);
      playChordFrequencies(freqs, soundMode, style === 'arpeggio');
    }

    if (!hasAnswered && roundStartTimeRef.current === 0) {
      roundStartTimeRef.current = Date.now();
      setIsTimerRunning(true);
    }
  }, [currentChord, gameMode, getTransposedFreqs, hasAnswered, inversionRound, playbackStyle, playChordFrequencies, semitoneShift, soundMode]);

  // Common scoring & 10-streak milestone logic
  const handleScoreEvaluation = (correct: boolean, reactionTime: number) => {
    if (correct) {
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

      if (nextStreak >= TARGET_STREAK && !hasCompleted10) {
        setHasCompleted10(true);

        const totalRawPoints = nextPoints.reduce((acc, p) => acc + p, 0);
        const mistakePenalty = mistakesInCurrentRun * 350;
        const finalCompositeScore = Math.max(500, Math.round(totalRawPoints - mistakePenalty));
        const avgReaction = Number((nextAccumulatedTime / TARGET_STREAK).toFixed(2));
        const totalAttempts = TARGET_STREAK + mistakesInCurrentRun;
        const accuracy = Math.round((TARGET_STREAK / totalAttempts) * 100);

        const initialName = (playerName.trim() || (isDe ? 'Mein Name' : 'My Name')).slice(0, 12);
        const newResult: LeaderboardEntry = {
          id: Date.now().toString(),
          name: initialName,
          score: finalCompositeScore,
          timeSeconds: Number(nextAccumulatedTime.toFixed(1)),
          avgReactionTime: avgReaction,
          mistakes: mistakesInCurrentRun,
          accuracy,
          date: new Date().toLocaleDateString(isDe ? 'de-DE' : 'en-US', { day: 'numeric', month: 'short' })
        };

        setLastRunResult(newResult);

        // Update active game mode leaderboard
        if (gameMode === 'inversions') {
          setLeaderboardInversions((prevBoard) => {
            const updated = [...prevBoard, newResult]
              .sort((a, b) => b.score - a.score)
              .slice(0, 10);
            try {
              localStorage.setItem('beyondMagic_top10InversionsScores', JSON.stringify(updated));
            } catch {}
            const isTop3 = updated.slice(0, 3).some(item => item.id === newResult.id);
            setIsNewHighScore(isTop3);
            return updated;
          });
        } else {
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
      }
    } else {
      setMistakesInCurrentRun(prev => prev + 1);
      setStreak(0);
      setAccumulatedStreakTime(0);
      setStreakPointsEarned([]);
    }
  };

  // Handle Chord Colors answer selection
  const handleSelectAnswer = (option: EarTrainingChordItem) => {
    if (hasAnswered) return;

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

    handleScoreEvaluation(correct, reactionTime);
  };

  // Handle Inversion answer selection
  const handleSelectInversion = (invIndex: number) => {
    if (hasAnswered || !inversionRound) return;

    const now = Date.now();
    const reactionTime = roundStartTimeRef.current > 0 
      ? Math.max(0.1, (now - roundStartTimeRef.current) / 1000)
      : 1.0;

    setIsTimerRunning(false);
    setLastChordReactionTime(reactionTime);
    setRoundElapsedSec(reactionTime);
    setSelectedInversionIndex(invIndex);
    setHasAnswered(true);

    const correct = invIndex === inversionRound.targetInversionIndex;
    setIsCorrect(correct);

    handleScoreEvaluation(correct, reactionTime);
  };

  // Save custom player name for high score entry (max 12 characters)
  const handleSavePlayerName = (nameToSave: string) => {
    const clean = (nameToSave.trim() || (isDe ? 'Gast' : 'Guest')).slice(0, 12);
    setPlayerName(clean);
    setNameSaved(true);
    try {
      localStorage.setItem('beyondMagic_playerName', clean);
    } catch {}

    if (lastRunResult) {
      const updatedRun: LeaderboardEntry = { ...lastRunResult, name: clean };
      setLastRunResult(updatedRun);

      if (gameMode === 'inversions') {
        setLeaderboardInversions((prevBoard) => {
          const updated = prevBoard
            .map(entry => entry.id === updatedRun.id ? updatedRun : entry)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
          try {
            localStorage.setItem('beyondMagic_top10InversionsScores', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      } else {
        setLeaderboard((prevBoard) => {
          const updated = prevBoard
            .map(entry => entry.id === updatedRun.id ? updatedRun : entry)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
          try {
            localStorage.setItem('beyondMagic_top10EarScores', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    }
  };

  // Keyboard shortcut: Space / Enter to advance to next chord or replay sound
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (hasAnswered) {
          setupNewRound();
        } else {
          handleListen();
        }
      } else if (e.code === 'Enter' && hasAnswered) {
        e.preventDefault();
        setupNewRound();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasAnswered, handleListen, setupNewRound]);

  return (
    <div id="ear-training-console" className="w-full max-w-xl mx-auto select-none scroll-mt-20 sm:scroll-mt-28">
      {/* The ONE Centered Interactive Console Frame */}
      <div className="relative rounded-2xl bg-[#121520] border border-[#2b3347] shadow-[0_12px_45px_rgba(0,0,0,0.6)] p-3 sm:p-5 overflow-hidden">
        
        {/* Subtle ambient mood glow */}
        <div 
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-[100px] pointer-events-none opacity-25 transition-colors duration-500"
          style={{ backgroundColor: hasAnswered ? (isCorrect ? '#10b981' : '#f43f5e') : '#c49750' }}
        />

        {/* 1. Game Mode Selector Tabs: Chord Colors vs. Inversions */}
        <div className="flex items-center justify-center gap-2 pb-2.5 mb-2.5 border-b border-white/10">
          <button
            type="button"
            onClick={() => handleSwitchGameMode('chord-colors')}
            className={`flex-1 max-w-[210px] py-1.5 px-3 rounded-xl text-xs font-serif transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              gameMode === 'chord-colors'
                ? 'bg-gradient-to-r from-[#c49750] to-[#e6b769] text-black font-semibold shadow-md shadow-[#c49750]/20'
                : 'bg-[#0e111a] text-[#8c887d] hover:text-[#fbf9f5] border border-white/5 hover:border-white/10'
            }`}
          >
            <span>🎨</span>
            <span>{isDe ? 'Akkord-Farben' : 'Chord Colors'}</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchGameMode('inversions')}
            className={`flex-1 max-w-[210px] py-1.5 px-3 rounded-xl text-xs font-serif transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              gameMode === 'inversions'
                ? 'bg-gradient-to-r from-[#c49750] to-[#e6b769] text-black font-semibold shadow-md shadow-[#c49750]/20'
                : 'bg-[#0e111a] text-[#8c887d] hover:text-[#fbf9f5] border border-white/5 hover:border-white/10'
            }`}
          >
            <span>🔄</span>
            <span>{isDe ? 'Umkehrungen' : 'Inversions'}</span>
          </button>
        </div>

        {/* 2. Inversion Difficulty Selector (Only in Inversions Mode) */}
        {gameMode === 'inversions' && (
          <div className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 mb-2.5 rounded-xl bg-[#0b0d14]/90 border border-white/10 text-xs font-mono animate-fade-in">
            <span className="text-[#c49750] text-[11px] font-semibold flex items-center gap-1">
              <span>🎯</span>
              <span>{isDe ? 'Schwierigkeit:' : 'Difficulty:'}</span>
            </span>
            <div className="inline-flex rounded-lg bg-[#141824] p-0.5 border border-[#262c3c]">
              {([3, 4, 5] as InversionDifficulty[]).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => handleSwitchInversionDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                    inversionDifficulty === diff
                      ? 'bg-[#c49750] text-black font-bold shadow-sm'
                      : 'text-[#9e9a8f] hover:text-[#fbf9f5]'
                  }`}
                  title={diff === 3 ? '3 Notes (Triads)' : diff === 4 ? '4 Notes (7th Chords)' : '5 Notes (9th Chords)'}
                >
                  {diff} {isDe ? 'Töne' : 'Notes'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 3. Integrated HUD Bar: Stats, Mode, Leaderboard & Reset */}
        <div className="flex items-center justify-between gap-1.5 pb-2.5 mb-2 border-b border-white/10 text-xs font-mono">
          {/* Left: Streak & Mistakes */}
          <div className="flex items-center gap-1.5">
            <div className="px-2 py-1 rounded-lg bg-[#0b0d14] border border-white/10 flex items-center gap-1 text-[11px]">
              <Flame className={`w-3.5 h-3.5 ${streak > 0 ? 'text-[#f59e0b] animate-bounce' : 'text-[#6e6a60]'}`} />
              <span className="text-[#8c887d]">{isDe ? 'Serie' : 'Streak'}</span>
              <span className="font-bold text-[#fbf9f5]">{streak}/10</span>
              {bestStreak > 0 && (
                <span className="text-[9px] text-[#8c887d] hidden sm:inline">({bestStreak})</span>
              )}
            </div>

            <div className="px-2 py-1 rounded-lg bg-[#0b0d14] border border-white/10 flex items-center gap-1 text-[11px]">
              <span className="text-[#8c887d]">{isDe ? 'Fehler' : 'Mistakes'}</span>
              <span className={`font-bold ${mistakesInCurrentRun > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {mistakesInCurrentRun}
              </span>
            </div>
          </div>

          {/* Right: Sound Mode, Top 10 Button, Reset */}
          <div className="flex items-center gap-1.5">
            {/* Block / Arp toggle */}
            <div className="inline-flex rounded-lg bg-[#0b0d13] p-0.5 border border-[#262c3c]">
              <button
                type="button"
                onClick={() => {
                  setPlaybackStyle('block');
                  handleListen('block');
                }}
                className={`px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer ${
                  playbackStyle === 'block'
                    ? 'bg-[#c49750] text-black font-semibold'
                    : 'text-[#9e9a8f] hover:text-[#fbf9f5]'
                }`}
                title="Block chord"
              >
                Block
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlaybackStyle('arpeggio');
                  handleListen('arpeggio');
                }}
                className={`px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer ${
                  playbackStyle === 'arpeggio'
                    ? 'bg-[#c49750] text-black font-semibold'
                    : 'text-[#9e9a8f] hover:text-[#fbf9f5]'
                }`}
                title="Arpeggio"
              >
                Arp
              </button>
            </div>

            {/* Top 10 High Scores Button */}
            <button
              type="button"
              onClick={() => {
                setActiveLeaderboardTab(gameMode);
                setShowLeaderboard(true);
              }}
              className="px-2 py-1 rounded-lg bg-[#181c28] hover:bg-[#222738] border border-[#c49750]/50 text-[#fbf9f5] flex items-center gap-1 text-[11px] transition-all cursor-pointer shadow-sm group"
              title={isDe ? 'Top 10 Bestenliste' : 'Top 10 High Scores'}
            >
              <Trophy className="w-3 h-3 text-[#c49750] group-hover:scale-110 transition-transform" />
              <span className="font-semibold text-[#f5eedf]">Top 10</span>
            </button>

            {/* Reset / New Run */}
            <button
              type="button"
              onClick={handleRestartChallenge}
              className="p-1 rounded-lg text-[#8c887d] hover:text-white bg-[#0b0d14] border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
              title={isDe ? 'Neu starten' : 'Restart Run'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Sub-header: Random Root status + Live Reaction Timer */}
        <div className="flex items-center justify-between text-[10px] font-mono text-[#8c887d] px-1 mb-1.5">
          <div className="flex items-center gap-1 text-[#c49750]">
            <Shuffle className="w-3 h-3" />
            <span>
              {gameMode === 'inversions'
                ? (isDe ? `Zufallston aktiv (${inversionDifficulty} Töne)` : `Random Root (${inversionDifficulty} Notes)`)
                : (isDe ? 'Zufallston aktiv' : 'Random Root Active')}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[#d4af37]">
            <Timer className={`w-3 h-3 ${isTimerRunning ? 'animate-spin' : ''}`} />
            <span>
              {hasAnswered && lastChordReactionTime !== null
                ? `${lastChordReactionTime.toFixed(1)}s`
                : `${roundElapsedSec.toFixed(1)}s`}
            </span>
          </div>
        </div>

        {/* 4. Side-by-Side Twin Deck (Audio Trigger + Score Staff Box) */}
        <div className="h-[126px] sm:h-[150px] flex items-center justify-center gap-4 sm:gap-8 my-1">
          {/* Audio Replay Trigger */}
          <div className="flex flex-col items-center text-center space-y-1 shrink-0">
            <button
              type="button"
              onClick={() => handleListen()}
              className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-[#c49750] via-[#ffd56b] to-[#fae082] text-black flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.35)] hover:shadow-[0_0_45px_rgba(212,175,55,0.55)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group shrink-0"
              title={isDe ? 'Akkord noch einmal anhören' : 'Replay challenge chord'}
            >
              <Volume2 className={`w-7 h-7 sm:w-9 sm:h-9 transition-transform ${isPlaying ? 'scale-125 animate-pulse' : 'group-hover:scale-110'}`} />
            </button>
            <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#d4af37]">
              {isPlaying 
                ? (isDe ? '● Klingt...' : '● Ringing...') 
                : (isDe ? 'Anhören' : 'Replay Chord')}
            </div>
          </div>

          {/* Fixed Score Staff Box */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 aspect-square rounded-xl bg-[#0c0e15]/95 border border-[#c49750]/35 shadow-xl flex items-center justify-center p-1.5 sm:p-2 relative shrink-0 overflow-hidden">
            {hasAnswered ? (
              <div className="animate-fade-in flex flex-col items-center justify-center w-full h-full">
                <MusicalScoreChord
                  notes={gameMode === 'inversions' && inversionRound ? inversionRound.notes : transposedNotes}
                  chordName={gameMode === 'inversions' && inversionRound ? inversionRound.fullDisplayName : transposedChordName}
                  color={gameMode === 'inversions' && inversionRound ? inversionRound.color : currentChord.color}
                  isDe={isDe}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-2 text-[#8c887d] select-none">
                <span className="text-2xl sm:text-3xl mb-1 opacity-25">🎼</span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#d4af37]/75 font-medium">
                  {isDe ? 'Gehör-Fokus' : 'Ear Focus'}
                </span>
                <span className="text-[8px] sm:text-[9px] text-[#6e6a60] font-mono mt-0.5 leading-tight">
                  {isDe ? 'Noten nach Antwort' : 'Reveals on answer'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 5. Multiple Choice Option Cards */}
        {gameMode === 'inversions' ? (
          /* INVERSIONS MULTIPLE CHOICE DECK */
          <div className={`grid gap-2 my-2 sm:my-2.5 ${inversionDifficulty === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {INVERSION_CONFIGS_BY_DIFF[inversionDifficulty].map((config) => {
              const isSelected = selectedInversionIndex === config.index;
              const isTarget = inversionRound ? config.index === inversionRound.targetInversionIndex : false;

              let cardStyles = 'bg-[#10141d] border-[#222838] hover:border-[#c49750]/60 hover:bg-[#141924]';

              if (hasAnswered) {
                if (isTarget) {
                  cardStyles = 'bg-[#0f241a] border-emerald-500/80 text-emerald-200 ring-1 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]';
                } else if (isSelected && !isCorrect) {
                  cardStyles = 'bg-[#271318] border-rose-500/80 text-rose-200 ring-1 ring-rose-500/50';
                } else {
                  cardStyles = 'bg-[#0c0e15]/40 border-white/5 opacity-35';
                }
              }

              return (
                <button
                  key={config.index}
                  type="button"
                  disabled={hasAnswered}
                  onClick={() => handleSelectInversion(config.index)}
                  className={`px-3 py-2 sm:py-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-2 ${cardStyles} disabled:cursor-default active:scale-[0.99]`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-serif text-xs sm:text-sm font-medium text-white leading-tight">
                      {isDe ? config.titleDe : config.titleEn}
                    </div>
                    <div className="text-[10px] text-[#8c887d] font-mono leading-tight mt-0.5">
                      {isDe ? config.subDe : config.subEn}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    <span className="text-[11px] font-mono font-bold text-[#ffd56b] px-2 py-0.5 rounded bg-[#161a26] border border-[#2d3548]">
                      {config.badge}
                    </span>
                    {hasAnswered && isTarget && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* CHORD COLORS MULTIPLE CHOICE DECK */
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2 sm:my-2.5">
            {options.map((option) => {
              const isSelected = selectedAnswerId === option.id;
              const isTarget = option.id === currentChord.id;
              const display = getChordDisplay(option, isDe);

              let cardStyles = 'bg-[#10141d] border-[#222838] hover:border-[#c49750]/60 hover:bg-[#141924]';

              if (hasAnswered) {
                if (isTarget) {
                  cardStyles = 'bg-[#0f241a] border-emerald-500/80 text-emerald-200 ring-1 ring-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]';
                } else if (isSelected && !isCorrect) {
                  cardStyles = 'bg-[#271318] border-rose-500/80 text-rose-200 ring-1 ring-rose-500/50';
                } else {
                  cardStyles = 'bg-[#0c0e15]/40 border-white/5 opacity-35';
                }
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={hasAnswered}
                  onClick={() => handleSelectAnswer(option)}
                  className={`px-3 py-2 sm:py-2.5 rounded-xl border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-2.5 ${cardStyles} disabled:cursor-default active:scale-[0.99]`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" 
                      style={{ backgroundColor: option.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-serif text-xs sm:text-sm font-medium text-white leading-tight break-words">
                        {display.title}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    <span className="text-[10px] sm:text-[11px] font-mono font-medium text-[#ffd56b] px-1.5 py-0.5 rounded bg-[#161a26] border border-[#2d3548]">
                      {display.badge}
                    </span>
                    {hasAnswered && isTarget && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* 6. Persistent Bottom Action & Feedback Bar */}
        <div className="mt-2">
          {hasAnswered ? (
            <div className={`min-h-[50px] sm:min-h-[54px] p-2 sm:p-2.5 rounded-xl border flex items-center justify-between gap-2 animate-fade-in ${
              isCorrect 
                ? 'bg-[#0e2118] border-emerald-500/50 text-emerald-200' 
                : 'bg-[#231216] border-rose-500/50 text-rose-200'
            }`}>
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="font-serif text-xs sm:text-sm text-white font-medium truncate">
                    {gameMode === 'inversions' && inversionRound ? (
                      isCorrect
                        ? (isDe ? `Richtig! ${inversionRound.fullDisplayName}` : `Correct! ${inversionRound.fullDisplayName}`)
                        : (isDe ? `Es war: ${inversionRound.fullDisplayName}` : `It was: ${inversionRound.fullDisplayName}`)
                    ) : (
                      isCorrect 
                        ? (isDe ? `Richtig gehört! (${transposedChordName})` : `Bravo! Correct! (${transposedChordName})`)
                        : (isDe 
                            ? `Es war: ${transposedChordName} · ${getChordDisplay(currentChord, true).title} (${getChordDisplay(currentChord, true).badge})` 
                            : `It was: ${transposedChordName} · ${getChordDisplay(currentChord, false).title} (${getChordDisplay(currentChord, false).badge})`)
                    )}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-[#cfcac0] font-light truncate flex items-center gap-1.5">
                    {gameMode === 'inversions' && inversionRound ? (
                      <>
                        <span className="font-mono text-[#ffd56b] font-medium shrink-0">
                          {inversionRound.notes.map(n => n.replace(/[0-9]/g, '').replace('b', '♭').replace('#', '♯')).join(' · ')}
                        </span>
                        <span className="text-white/30 hidden xs:inline shrink-0">•</span>
                        <span className="truncate">{isDe ? inversionRound.explanationDe : inversionRound.explanationEn}</span>
                      </>
                    ) : (
                      <>
                        <span className="font-mono text-[#ffd56b] font-medium shrink-0">
                          {transposedNotes.map(n => n.replace(/[0-9]/g, '').replace('b', '♭').replace('#', '♯')).join(' · ')}
                        </span>
                        <span className="text-white/30 hidden xs:inline shrink-0">•</span>
                        <span className="truncate">“{isDe ? currentChord.archetypeDe : currentChord.archetype}”</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="button"
                autoFocus
                onClick={() => setupNewRound()}
                className="px-3.5 sm:px-5 py-2 rounded-lg bg-[#c49750] hover:bg-[#d8a85c] text-black text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer shadow-lg shadow-[#c49750]/30 shrink-0 hover:scale-105 active:scale-95"
              >
                <span>{isDe ? 'Weiter' : 'Next Chord'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="min-h-[50px] sm:min-h-[54px] p-2 sm:p-2.5 rounded-xl bg-[#0c0e15]/70 border border-white/5 flex items-center justify-between gap-2 text-xs font-mono text-[#8c887d]">
              <div className="flex items-center gap-1.5 truncate">
                <Sparkles className="w-3.5 h-3.5 text-[#c49750] animate-pulse shrink-0" />
                <span className="truncate text-[10px] sm:text-xs">
                  {gameMode === 'inversions'
                    ? (isDe ? 'In welcher Umkehrung erklingt der Akkord?' : 'Which inversion is this chord in?')
                    : (isDe ? 'Welche Klangfarbe hörst du?' : 'Which chord color do you hear?')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleListen()}
                className="px-2.5 py-1 rounded-lg bg-[#181c28] hover:bg-[#222738] border border-white/10 text-[#d4af37] text-[10px] sm:text-[11px] font-mono transition-all flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Volume2 className="w-3 h-3" />
                <span>{isDe ? 'Wiederholen' : 'Replay'}</span>
              </button>
            </div>
          )}
        </div>

        {/* 7. 10-Streak Milestone Celebration & Name Registration */}
        {hasCompleted10 && lastRunResult && (
          <div className="absolute inset-0 z-40 bg-black/92 backdrop-blur-md p-4 sm:p-6 flex flex-col items-center justify-center text-center animate-fade-in overflow-y-auto">
            <div className="w-12 h-12 rounded-full bg-[#d4af37]/20 border border-[#d4af37] flex items-center justify-center shrink-0 shadow-lg mb-2">
              <Award className="w-6 h-6 text-[#ffd56b] animate-bounce" />
            </div>

            <h5 className="font-serif text-lg sm:text-xl text-[#fdf497] font-medium tracking-tight mb-0.5">
              {isDe ? '🏆 10er-Serie Vollendet!' : '🏆 10-Streak Mastered!'}
            </h5>
            
            <p className="text-xs text-[#dedacf] font-mono mb-1">
              <span className="text-[#ffd56b] font-semibold">
                {gameMode === 'inversions' 
                  ? (isDe ? `Umkehrungen (${inversionDifficulty} Töne)` : `Inversions (${inversionDifficulty} Notes)`)
                  : (isDe ? 'Akkord-Farben' : 'Chord Colors')}
              </span>
            </p>

            <p className="text-xs text-[#dedacf] font-mono mb-3">
              {isDe 
                ? `${lastRunResult.score.toLocaleString()} Punkte · Ø ${lastRunResult.avgReactionTime.toFixed(1)}s · ${lastRunResult.mistakes} Fehler`
                : `${lastRunResult.score.toLocaleString()} pts · Avg ${lastRunResult.avgReactionTime.toFixed(1)}s · ${lastRunResult.mistakes} mistakes`}
            </p>

            {/* Name Input Card (Max 12 letters) */}
            <div className="w-full max-w-sm bg-[#121622] border border-[#c49750]/40 rounded-xl p-3 sm:p-4 mb-3 text-left">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#d4af37] mb-1.5 flex items-center justify-between">
                <span>{isDe ? 'Name für die Bestenliste:' : 'Leaderboard Name:'}</span>
                <span className="text-[10px] text-[#8c887d]">{playerName.length}/12</span>
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={12}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value.slice(0, 12))}
                  placeholder={isDe ? 'Dein Name (max 12)' : 'Your Name (max 12)'}
                  className="flex-1 px-3 py-1.5 bg-[#0b0d13] border border-white/20 rounded-lg text-xs text-white font-mono placeholder:text-white/30 focus:outline-none focus:border-[#c49750]"
                />
                <button
                  type="button"
                  onClick={() => handleSavePlayerName(playerName)}
                  className="px-3 py-1.5 rounded-lg bg-[#c49750] hover:bg-[#d8a85c] text-black font-semibold text-xs uppercase tracking-wider cursor-pointer transition-all shrink-0"
                >
                  {nameSaved ? (isDe ? '✓ Gespeichert' : '✓ Saved') : (isDe ? 'Speichern' : 'Save')}
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setActiveLeaderboardTab(gameMode);
                  setShowLeaderboard(true);
                }}
                className="px-3 py-2 rounded-xl border border-[#c49750]/50 bg-[#161a26] text-[#dedacf] hover:text-white text-xs font-mono uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5 text-[#c49750]" />
                <span>{isDe ? 'Bestenliste' : 'Top 10'}</span>
              </button>

              <button
                type="button"
                onClick={handleRestartChallenge}
                className="px-4 py-2 rounded-xl bg-[#c49750] hover:bg-[#d8a85c] text-black text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isDe ? 'Nochmal spielen' : 'Play Again'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 8. Top 10 Leaderboard Modal (Dual-Tab: Chord Colors vs. Inversions) */}
        {showLeaderboard && (
          <div className="absolute inset-0 z-50 bg-[#0d1017]/97 backdrop-blur-md p-3 sm:p-5 flex flex-col justify-between animate-fade-in overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <Medal className="w-4 h-4 text-[#c49750]" />
                  <h5 className="font-serif text-base sm:text-lg text-[#fbf9f5] font-light">
                    {isDe ? 'Allzeit-Bestenliste (Top 10)' : 'All-Time Best Scores (Top 10)'}
                  </h5>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLeaderboard(false)}
                  className="p-1 rounded-lg text-[#8c887d] hover:text-white bg-[#141824] border border-[#252c3c] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 2-Tab Switcher between Chord Colors and Inversions */}
              <div className="flex gap-1.5 mb-2.5 p-1 bg-[#10141f] rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveLeaderboardTab('chord-colors')}
                  className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    activeLeaderboardTab === 'chord-colors'
                      ? 'bg-[#c49750] text-black font-bold shadow-sm'
                      : 'text-[#8c887d] hover:text-white'
                  }`}
                >
                  <span>🎨</span>
                  <span>{isDe ? 'Akkord-Farben' : 'Chord Colors'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLeaderboardTab('inversions')}
                  className={`flex-1 py-1 px-2.5 rounded-lg text-xs font-mono transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    activeLeaderboardTab === 'inversions'
                      ? 'bg-[#c49750] text-black font-bold shadow-sm'
                      : 'text-[#8c887d] hover:text-white'
                  }`}
                >
                  <span>🔄</span>
                  <span>{isDe ? 'Umkehrungen' : 'Inversions'}</span>
                </button>
              </div>

              {/* Leaderboard Table with Name column (max 12 letters) */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-[#8c887d] uppercase tracking-wider text-[9px]">
                      <th className="pb-1.5 pl-1">#</th>
                      <th className="pb-1.5">{isDe ? 'Name (12)' : 'Name'}</th>
                      <th className="pb-1.5">{isDe ? 'Punkte' : 'Score'}</th>
                      <th className="pb-1.5">{isDe ? 'Ø Zeit' : 'Avg'}</th>
                      <th className="pb-1.5 pr-1">{isDe ? 'Fehler' : 'Mistakes'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(activeLeaderboardTab === 'inversions' ? leaderboardInversions : leaderboard).map((entry, idx) => {
                      const isCurrentUser = lastRunResult && entry.id === lastRunResult.id;
                      return (
                        <tr 
                          key={entry.id || idx} 
                          className={`hover:bg-white/[0.03] ${
                            isCurrentUser 
                              ? 'bg-[#c49750]/15 font-semibold text-[#ffd56b]' 
                              : idx < 3 ? 'text-[#fbf9f5]' : 'text-[#b0ac9f]'
                          }`}
                        >
                          <td className="py-1.5 pl-1 font-bold">
                            {idx === 0 ? '🥇 1.' : idx === 1 ? '🥈 2.' : idx === 2 ? '🥉 3.' : `${idx + 1}.`}
                          </td>
                          <td className="py-1.5 font-medium truncate max-w-[90px] sm:max-w-[120px]">
                            {entry.name || 'Player'}
                          </td>
                          <td className="py-1.5 font-bold text-[#c49750]">
                            {entry.score.toLocaleString()}
                          </td>
                          <td className="py-1.5 text-[#38bdf8]">
                            {entry.avgReactionTime.toFixed(1)}s
                          </td>
                          <td className="py-1.5 pr-1">
                            <span className={entry.mistakes === 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400'}>
                              {entry.mistakes === 0 ? '0' : entry.mistakes}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-between items-center text-[10px] text-[#8c887d] font-mono">
              <span>
                {activeLeaderboardTab === 'inversions' 
                  ? (isDe ? 'Umkehrungs-Training · 10 Akkorde' : 'Inversions Training · 10 Chords')
                  : (isDe ? '10 Akkorde · Schnelligkeit & Präzision' : '10 Chords · Speed & Precision')}
              </span>
              <button
                type="button"
                onClick={() => setShowLeaderboard(false)}
                className="px-3 py-1 rounded bg-[#181c28] text-white hover:bg-[#222738] border border-white/10 cursor-pointer"
              >
                {isDe ? 'Schließen' : 'Close'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

