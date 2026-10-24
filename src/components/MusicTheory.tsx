import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Volume2, VolumeX, Waves, ArrowRight, Music, Disc, Mic, Headphones, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { SomaticResonanceCanvas } from './SomaticResonanceCanvas';
import { MusicalScoreChord } from './MusicalScoreChord';
import { EarTrainingStudio } from './EarTrainingStudio';

// Dynamic module loader for acoustic piano samples (decouples 503KB base64 audio from initial bundle)
let pianoSamplesModule: typeof import('../data/pianoSamples') | null = null;
async function getPianoSamplesModule() {
  if (!pianoSamplesModule) {
    pianoSamplesModule = await import('../data/pianoSamples');
  }
  return pianoSamplesModule;
}

interface MusicTheoryProps {
  onOpenInquiry: (defaultTopic?: string) => void;
}

interface ChordPaletteItem {
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
  bgGlow: string;
  tensionPercentage: number; // 0 = complete rest, 100 = maximum urgency
  tensionLabel: string;
  tensionLabelDe: string;
  emotionalFeeling: string;
  emotionalFeelingDe: string;
  acousticPhenomenon: string;
  acousticPhenomenonDe: string;
  musicalReferences: string;
}

const CHORD_PALETTE: ChordPaletteItem[] = [
  {
    id: 'c-major',
    name: 'C Major',
    chordType: 'Major Triad',
    chordTypeDe: 'Dur-Dreiklang',
    voicingLabel: 'Root · Major 3rd · Perfect 5th · Octave',
    archetype: 'Pure Light & Grounded Certainty',
    archetypeDe: 'Reines Licht & Geerdete Gewissheit',
    frequencies: [130.81, 164.81, 196.00, 261.63], // C3, E3, G3, C4
    notes: ['C3', 'E3', 'G3', 'C4'],
    color: '#d4af37',
    bgGlow: 'rgba(212, 175, 55, 0.15)',
    tensionPercentage: 5,
    tensionLabel: 'Absolute Rest (0% Tension)',
    tensionLabelDe: 'Absolute Ruhe (0% Spannung)',
    emotionalFeeling: 'Solid stone beneath your feet. No urge to move, no unresolved questions. Pure daylight and homecoming.',
    emotionalFeelingDe: 'Fester Stein unter den Füßen. Kein Drang weiterzugehen, keine offenen Fragen. Reines Tageslicht und Ankommen.',
    acousticPhenomenon: 'Simple integer frequency ratios (4:5:6) lock together with minimal acoustic phase beating, settling the ear completely in deep bass resonance.',
    acousticPhenomenonDe: 'Einfache ganzzahlige Schwingungsverhältnisse (4:5:6) verschmelzen ohne Schwebungen, sodass das Ohr vollkommen zur Ruhe kommt.',
    musicalReferences: 'Opening of Beethoven Symphony No. 5 finale, traditional hymn resolutions, clean acoustic anthems.',
  },
  {
    id: 'eb-maj7',
    name: 'E♭maj7',
    chordType: 'Major 7th (maj7)',
    chordTypeDe: 'Großer Septakkord (maj7)',
    voicingLabel: 'Root · Major 3rd · 5th · Leading Major 7th',
    archetype: 'Luminescent Nostalgia & Bittersweet Longing',
    archetypeDe: 'Luminiszierende Sehnsucht & Nostalgie',
    frequencies: [155.56, 196.00, 233.08, 293.66], // Eb3, G3, Bb3, D4
    notes: ['Eb3', 'G3', 'Bb3', 'D4'],
    color: '#a78bfa',
    bgGlow: 'rgba(167, 139, 250, 0.18)',
    tensionPercentage: 35,
    tensionLabel: 'Tender Floating (35% Tension)',
    tensionLabelDe: 'Zartes Schweben (35% Spannung)',
    emotionalFeeling: 'Looking at an old photograph with a warm, wistful smile. The high major 7th (D) hovers a semitone below the E♭ octave, smiling through tears.',
    emotionalFeelingDe: 'Der Blick auf ein altes Foto mit einem wehmütigen Lächeln. Die große Septime (D) schwebt zart unter der Es-Oktave und lächelt durch Tränen.',
    acousticPhenomenon: 'The velvet clash between deep bass E♭ and ethereal leading tone D generates a luminous harmonic shimmer without harshness.',
    acousticPhenomenonDe: 'Die feine Reibung zwischen Grundton Es und der großen Septime D erzeugt ein silbriges Flirren ohne jede Härte.',
    musicalReferences: 'Debussy (Clair de lune), Ravel (Daphnis), Bill Evans, Brazilian Bossa Nova (Jobim), modern dream-pop.',
  },
  {
    id: 'a-min9',
    name: 'Am9',
    chordType: 'Minor 9th (m9)',
    chordTypeDe: 'Moll-Nonakkord (m9)',
    voicingLabel: 'Minor 3rd · 5th · Minor 7th · Natural 9th',
    archetype: 'Midnight Introspection & Deep Vulnerability',
    archetypeDe: 'Mitternächtliche Tiefe & Verwundbarkeit',
    frequencies: [110.00, 130.81, 164.81, 196.00, 246.94], // A2, C3, E3, G3, B3
    notes: ['A2', 'C3', 'E3', 'G3', 'B3'],
    color: '#38bdf8',
    bgGlow: 'rgba(56, 189, 248, 0.18)',
    tensionPercentage: 50,
    tensionLabel: 'Reflective Gravitas (50% Tension)',
    tensionLabelDe: 'Nachdenkliche Tiefe (50% Spannung)',
    emotionalFeeling: 'A late-night rain on window glass. The 9th (B) hangs above the dark minor triad like a lantern in fog, turning sadness into luxury.',
    emotionalFeelingDe: 'Nächtlicher Regen an einer Fensterscheibe. Die None schwebt wie eine Laterne im Nebel über dem Moll-Dreiklang.',
    acousticPhenomenon: 'Stacking thirds up to the 9th provides rich harmonic density that breathes with warm low-frequency chest resonance.',
    acousticPhenomenonDe: 'Die Terzenschichtung bis zur None verleiht dem Akkord eine seidige Dichte, die atmet, ohne den Grundton zu ersticken.',
    musicalReferences: 'Neo-Soul, Robert Glasper, Chopin Ballades, modern French electronic music, cinematic scoring.',
  },
  {
    id: 'g-dom7',
    name: 'G7 (V7)',
    chordType: 'Dominant 7th (V7)',
    chordTypeDe: 'Dominant-Septakkord (V7)',
    voicingLabel: 'Root · Major 3rd · 5th · Minor 7th (Tritone Core)',
    archetype: 'Kinetic Urgency & Gravitational Cliffhanger',
    archetypeDe: 'Kinetische Dringlichkeit & Gravitationssog',
    frequencies: [98.00, 123.47, 146.83, 174.61], // G2, B2, D3, F3
    notes: ['G2', 'B2', 'D3', 'F3'],
    color: '#f97316',
    bgGlow: 'rgba(249, 115, 22, 0.2)',
    tensionPercentage: 88,
    tensionLabel: 'High Gravitational Pull (88% Tension)',
    tensionLabelDe: 'Hohe Schwerkraft (88% Spannung)',
    emotionalFeeling: 'Your chest tightens. The music is leaning forward over a cliff, demanding release into C Major. You cannot stay here forever.',
    emotionalFeelingDe: 'Die Brust spannt sich an. Die Musik lehnt sich über einen Abgrund und verlangt Erlösung in C-Dur. Hier kann man nicht verharren.',
    acousticPhenomenon: 'The internal tritone between B and F (3 whole tones) creates acoustic friction that pulls magnetically toward C and E.',
    acousticPhenomenonDe: 'Der interne Tritonus zwischen H und F erzeugt eine magnetische Reibung, die unweigerlich nach C und E strebt.',
    musicalReferences: 'Verdi & Puccini cadences, Motown gospel turnarounds, classical symphonic climaxes, blues turnarounds.',
  },
  {
    id: 'f-min7',
    name: 'Fm7',
    chordType: 'Minor 7th (m7)',
    chordTypeDe: 'Moll-Septakkord (m7)',
    voicingLabel: 'Root · Minor 3rd · Perfect 5th · Minor 7th',
    archetype: 'Velvet Melancholy & Sophisticated Warmth',
    archetypeDe: 'Samtene Melancholie & Warme Eleganz',
    frequencies: [174.61, 207.65, 261.63, 311.13], // F3, Ab3, C4, Eb4
    notes: ['F3', 'Ab3', 'C4', 'Eb4'],
    color: '#60a5fa',
    bgGlow: 'rgba(96, 165, 250, 0.18)',
    tensionPercentage: 40,
    tensionLabel: 'Soft Lyrical Float (40% Tension)',
    tensionLabelDe: 'Sanftes Lyrisches Schweben (40% Spannung)',
    emotionalFeeling: 'Warm espresso on a rainy morning. The minor 7th (E♭) softens the dark F-minor triad into luxurious, conversational introspection.',
    emotionalFeelingDe: 'Warmer Kaffee an einem verregneten Morgen. Die kleine Septime (Es) nimmt dem f-Moll-Dreiklang die Schwere und verwandelt Trauer in intime Eleganz.',
    acousticPhenomenon: 'Four-part balance: the rich minor third (F-A♭) combined with the open seventh (F-E♭) provides spacious, non-aggressive acoustic warmth.',
    acousticPhenomenonDe: 'Ausgewogene Vierstimmigkeit: Die Mollterz verbindet sich mit der weichen kleinen Septime zu einem samtigen, resonanten Raumklang.',
    musicalReferences: 'Kind of Blue (Miles Davis), Bill Evans, modern R&B ballads, French chanson, Chopin Ballade No. 4.',
  },
  {
    id: 'd-min6',
    name: 'Dm6',
    chordType: 'Minor 6th (m6)',
    chordTypeDe: 'Moll-Sextakkord (m6)',
    voicingLabel: 'Root · Minor 3rd · Perfect 5th · Major 6th',
    archetype: 'Noble Tragic Pathos & Autumnal Elegance',
    archetypeDe: 'Edles Pathos & Herbstliche Melancholie',
    frequencies: [146.83, 174.61, 220.00, 246.94], // D3, F3, A3, B3
    notes: ['D3', 'F3', 'A3', 'B3'],
    color: '#ec4899',
    bgGlow: 'rgba(236, 72, 153, 0.18)',
    tensionPercentage: 65,
    tensionLabel: 'Bittersweet Descent (65% Tension)',
    tensionLabelDe: 'Herbe Melancholie (65% Spannung)',
    emotionalFeeling: 'A profound operatic sigh in classic D-minor pathos. The natural 6th (B) against the minor 3rd (F) creates the bittersweet nobility of classic European tragedy.',
    emotionalFeelingDe: 'Ein tiefer Seufzer in edlem d-Moll-Opernpathos. Die große Sexte (H) gegen die Mollterz (F) erzeugt jenen herben, vornehmen Schmerz europäischer Tragödien.',
    acousticPhenomenon: 'The acoustic collision of minor third and Dorian major sixth echoes the ancient modal vocal color in sacred and theatrical tradition.',
    acousticPhenomenonDe: 'Der akustische Kontrast aus Mollterz und dorischer großer Sexte spiegelt die ausdrucksvolle Stimmfarbe alter Moden wider.',
    musicalReferences: 'Fauré (Élégie) & Duparc mélodies, Ennio Morricone film themes, Puccini (La Bohème act IV), Django Reinhardt jazz.',
  },
  {
    id: 'e-aug',
    name: 'Eaug',
    chordType: 'Augmented Triad (aug)',
    chordTypeDe: 'Übermäßiger Dreiklang (aug)',
    voicingLabel: 'Root · Major 3rd · Augmented 5th (Symmetrical)',
    archetype: 'Zero Gravity & Dreamlike Dissolution',
    archetypeDe: 'Schwerelosigkeit & Traumhafte Auflösung',
    frequencies: [164.81, 207.65, 261.63], // E3, Ab3, C4
    notes: ['E3', 'Ab3', 'C4'],
    color: '#10b981',
    bgGlow: 'rgba(16, 185, 129, 0.18)',
    tensionPercentage: 75,
    tensionLabel: 'Suspended Levitation (75% Tension)',
    tensionLabelDe: 'Schwebende Levitation (75% Spannung)',
    emotionalFeeling: 'Disorientation, vertigo, waking up inside a dream. The boundaries of tonality blur because there is no natural anchor.',
    emotionalFeelingDe: 'Orientierungslosigkeit, Schwindel, Aufwachen in einem Traum. Die tonalen Grenzen lösen sich auf, weil kein Gravitationsanker existiert.',
    acousticPhenomenon: 'Symmetrical major thirds (whole-tone structure) eliminate gravitational polarity, depriving the ear of any single tonal center.',
    acousticPhenomenonDe: 'Symmetrische große Terzen heben die tonale Polarität auf; das Ohr verliert jeden festen Boden.',
    musicalReferences: 'Debussy (Voiles), Stevie Wonder, film transitions depicting hypnotism or altered states of consciousness.',
  },
  {
    id: 'b-dim-min7',
    name: 'Bø7',
    chordType: 'Half-Diminished 7th (Tristan Chord)',
    chordTypeDe: 'Halbverminderter Septakkord (Tristan)',
    voicingLabel: 'Root · Minor 3rd · Diminished 5th · Minor 7th',
    archetype: 'The Tristan Ache & Tragic Yearning',
    archetypeDe: 'Tristan-Sehnsucht & Tragische Tiefe',
    frequencies: [123.47, 146.83, 174.61, 220.00], // B2, D3, F3, A3
    notes: ['B2', 'D3', 'F3', 'A3'],
    color: '#818cf8',
    bgGlow: 'rgba(129, 140, 248, 0.20)',
    tensionPercentage: 84,
    tensionLabel: 'Urgent Yearning (84% Tension)',
    tensionLabelDe: 'Dringliche Sehnsucht (84% Spannung)',
    emotionalFeeling: 'The authentic archetype of Wagner\'s Tristan und Isolde. Suspended between dark tritone friction (B–F) and aching minor 7th vulnerability, it pulls with visceral, unresolved longing.',
    emotionalFeelingDe: 'Der authentische Archetyp aus Wagners Tristan und Isolde. Schwebend zwischen dunkler Tritonus-Reibung (H–F) und zerbrechlicher Mollseptimen-Sehnsucht berührt er das Herz unmittelbar.',
    acousticPhenomenon: 'A half-diminished seventh chord: the internal tritone (B–F) and minor intervals create deep, asymmetric gravitational pull toward resolution.',
    acousticPhenomenonDe: 'Ein halbverminderter Septakkord: Der interne Tritonus (H–F) und die Moll-Intervalle erzeugen einen asymmetrischen, sehnsuchtsvollen Gravitationssog.',
    musicalReferences: 'Wagner (Tristan und Isolde Prelude - the Tristan Chord), Chopin (Ballades & Nocturnes), Ravel (Pavane), Wayne Shorter, classic jazz iiø–V minor cadences.',
  },
  {
    id: 'cs-dim7',
    name: 'C♯°7',
    chordType: 'Diminished 7th (4-Note Symmetrical)',
    chordTypeDe: 'Vollverminderter Septakkord (4 Töne)',
    voicingLabel: 'Root · Minor 3rd · Diminished 5th · Diminished 7th',
    archetype: 'Symmetrical Lightning & Visceral Suspense',
    archetypeDe: 'Symmetrischer Blitz & Atemlose Spannung',
    frequencies: [138.59, 164.81, 196.00, 233.08], // C#3, E3, G3, Bb3
    notes: ['C#3', 'E3', 'G3', 'Bb3'],
    color: '#f43f5e',
    bgGlow: 'rgba(244, 63, 94, 0.22)',
    tensionPercentage: 94,
    tensionLabel: 'Extreme Crisis & Suspense (94% Tension)',
    tensionLabelDe: 'Höchste Spannung & Krise (94% Spannung)',
    emotionalFeeling: 'A dagger in the dark. Total vertigo and imminent drama. Four notes spaced by exact minor thirds—it can resolve in four directions and holds your breath hostage.',
    emotionalFeelingDe: 'Ein Dolchstoß im Dunkeln. Vollkommener Schwindel und dramatische Zuspitzung. Exakt drei Halbtöne zwischen jedem Ton – er kann sich in vier Richtungen auflösen und raubt den Atem.',
    acousticPhenomenon: 'Two interlocking tritones (C#-G and E-Bb) create maximum dissonant interference. Perfectly symmetrical, it lacks an acoustic root and floats on a razor edge.',
    acousticPhenomenonDe: 'Zwei ineinandergreifende Tritoni (Cis-G und E-B) erzeugen maximale akustische Reibung. Ohne tonales Zentrum balanciert der Klang auf Messers Schneide.',
    musicalReferences: 'Mozart (Don Giovanni Commendatore scene), Verdi (Rigoletto storm), Beethoven (Appassionata), gothic horror scoring, silent film suspense.',
  }
];

export const MusicTheory: React.FC<MusicTheoryProps> = ({ onOpenInquiry }) => {
  const { language, t } = useLanguage();
  const isDe = language === 'de';

  const [activeChordId, setActiveChordId] = useState<string>('eb-maj7');
  const [heldChordId, setHeldChordId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const soundMode = 'piano';
  const [studioTab, setStudioTab] = useState<'explore' | 'ear-training'>('explore');
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);
  const damperGainRef = useRef<GainNode | null>(null);
  const pedalTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pressStartTimeRef = useRef<number>(0);
  const heldChordIdRef = useRef<string | null>(null);

  const selectedChord = CHORD_PALETTE.find((c) => c.id === activeChordId) || CHORD_PALETTE[1];

  // Helper to get or lazily initialize AudioContext
  const getAudioContext = useCallback(() => {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioCtx();
    }
    return audioContextRef.current;
  }, []);

  // Pre-decode acoustic piano samples on-demand ONLY when the user opens the interactive studio
  useEffect(() => {
    if (!isStudioOpen) return;
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      getPianoSamplesModule()
        .then(({ preloadAllPianoSamples }) => {
          preloadAllPianoSamples(ctx);
        })
        .catch(() => {});
    } catch (_) {}
  }, [isStudioOpen, getAudioContext]);

  // Clean up all active audio nodes safely
  const cleanupNodes = useCallback(() => {
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch (_) {}
    });
    activeSourcesRef.current = [];

    activeOscillatorsRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (_) {}
    });
    activeOscillatorsRef.current = [];

    if (damperGainRef.current) {
      try {
        damperGainRef.current.disconnect();
      } catch (_) {}
      damperGainRef.current = null;
    }
    if (masterGainRef.current) {
      try {
        masterGainRef.current.disconnect();
      } catch (_) {}
      masterGainRef.current = null;
    }

    setIsPlaying(false);
  }, []);

  // Pianist Physical Model:
  // When a chord is released, the keys are released, but the right sustain pedal remains pushed.
  // The pedal stops being pushed in 3 cases:
  // 1. User stops the sound using the website key to stop
  // 2. Another chord is played
  // 3. Exactly 6 seconds after release
  const releaseChord = useCallback((chordId?: string) => {
    if (chordId && heldChordIdRef.current && heldChordIdRef.current !== chordId) {
      return;
    }
    if (!heldChordIdRef.current) {
      return;
    }
    heldChordIdRef.current = null;
    setHeldChordId(null);

    // Cancel any previous pedal release timer
    if (pedalTimerRef.current) {
      clearTimeout(pedalTimerRef.current);
      pedalTimerRef.current = null;
    }

    // After release, the right pedal continues holding the open strings for exactly 6 seconds
    pedalTimerRef.current = setTimeout(() => {
      pedalTimerRef.current = null;
      const ctx = audioContextRef.current;
      const damperGain = damperGainRef.current;

      if (!ctx || !damperGain) {
        cleanupNodes();
        return;
      }

      try {
        const now = ctx.currentTime;
        // 6 seconds after release: pedal is released, dampers drop onto strings,
        // fading the lingering resonance smoothly to silence over 1.8s
        damperGain.gain.cancelScheduledValues(now);
        damperGain.gain.setValueAtTime(1.0, now);
        damperGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
      } catch (_) {}

      fadeTimeoutRef.current = setTimeout(() => {
        cleanupNodes();
        fadeTimeoutRef.current = null;
      }, 1850);
    }, 6000);
  }, [cleanupNodes]);

  // Case 1: Stop sound immediately or with a subtle 120ms anti-pop curve
  const stopAudio = useCallback((immediate = false) => {
    if (pedalTimerRef.current) {
      clearTimeout(pedalTimerRef.current);
      pedalTimerRef.current = null;
    }
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    heldChordIdRef.current = null;
    setHeldChordId(null);

    const ctx = audioContextRef.current;
    const damperGain = damperGainRef.current;

    if (immediate || !ctx || !damperGain) {
      cleanupNodes();
      return;
    }

    try {
      const now = ctx.currentTime;
      damperGain.gain.cancelScheduledValues(now);
      damperGain.gain.setValueAtTime(1.0, now);
      damperGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    } catch (_) {}

    fadeTimeoutRef.current = setTimeout(() => {
      cleanupNodes();
      fadeTimeoutRef.current = null;
    }, 140);
  }, [cleanupNodes]);

  // Case 2: When another chord in the website is played, previous chord & pedal stop and new chord begins
  const playChord = useCallback(async (chord: ChordPaletteItem, mode = soundMode) => {
    // If a previous pedal release or fadeout was scheduled, cancel it immediately
    if (pedalTimerRef.current) {
      clearTimeout(pedalTimerRef.current);
      pedalTimerRef.current = null;
    }
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }

    // Immediately stop running audio nodes before starting the new chord
    cleanupNodes();

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (mode === 'piano') {
        // High-Fidelity Steinway Grand Piano Sample Playback
        let noteInfos: ({ buffer: AudioBuffer; playbackRate: number } | null)[] = [];
        try {
          const { getPianoNoteInfo } = await getPianoSamplesModule();
          noteInfos = await Promise.all(
            chord.notes.map((note) => getPianoNoteInfo(ctx, note))
          );
        } catch (sampleErr) {
          console.warn('Piano sample loading error, falling back to harmonic synthesis:', sampleErr);
        }

        const validInfos = noteInfos.filter((info): info is { buffer: AudioBuffer; playbackRate: number } => info !== null);

        if (validInfos.length > 0) {
          const startTime = ctx.currentTime + 0.015;

          const masterGain = ctx.createGain();
          masterGainRef.current = masterGain;

          const damperGain = ctx.createGain();
          damperGainRef.current = damperGain;

          // Acoustic piano string resonance envelope: crisp hammer strike, and smooth natural 20s decay
          masterGain.gain.setValueAtTime(0.001, startTime);
          masterGain.gain.linearRampToValueAtTime(1.30, startTime + 0.015);
          masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 20.0);

          // Right pedal is pushed down: dampers are fully lifted (gain = 1.0)
          damperGain.gain.setValueAtTime(1.0, startTime);

          // Acoustic air presence filter
          const airFilter = ctx.createBiquadFilter();
          airFilter.type = 'lowpass';
          airFilter.frequency.setValueAtTime(12000, startTime);

          // Dynamics compressor to guarantee punchy loud output without digital clipping
          const compressor = ctx.createDynamicsCompressor();
          compressor.threshold.setValueAtTime(-2, startTime);
          compressor.knee.setValueAtTime(6, startTime);
          compressor.ratio.setValueAtTime(4.0, startTime);
          compressor.attack.setValueAtTime(0.003, startTime);
          compressor.release.setValueAtTime(0.25, startTime);

          masterGain.connect(damperGain);
          damperGain.connect(airFilter);
          airFilter.connect(compressor);
          compressor.connect(ctx.destination);

          const sources: AudioBufferSourceNode[] = [];
          validInfos.forEach((info, idx) => {
            const source = ctx.createBufferSource();
            source.buffer = info.buffer;
            source.playbackRate.setValueAtTime(info.playbackRate, startTime);

            // Micro-voicing roll (14ms stagger from bass root to top note, human pianist touch)
            const noteOffset = idx * 0.014;
            const noteGain = ctx.createGain();
            const voiceVolume = idx === 0 ? 1.25 : (idx === validInfos.length - 1 ? 1.15 : 1.05);
            noteGain.gain.setValueAtTime(voiceVolume, startTime + noteOffset);

            source.connect(noteGain);
            noteGain.connect(masterGain);

            source.start(startTime + noteOffset);
            sources.push(source);
          });

          activeSourcesRef.current = sources;
          setIsPlaying(true);

          stopTimeoutRef.current = setTimeout(() => {
            cleanupNodes();
            stopTimeoutRef.current = null;
          }, 20500);
          return;
        }
      }

      // Harmonic Synthesis Mode / Warm Pure Color Waves (Fallback or Selected)
      const startTime = ctx.currentTime + 0.015;
      const masterGain = ctx.createGain();
      masterGainRef.current = masterGain;

      const damperGain = ctx.createGain();
      damperGainRef.current = damperGain;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1450, startTime);
      filter.Q.setValueAtTime(1.1, startTime);

      masterGain.connect(damperGain);
      damperGain.connect(filter);
      filter.connect(ctx.destination);

      masterGain.gain.setValueAtTime(0.0001, startTime);
      masterGain.gain.linearRampToValueAtTime(0.32, startTime + 0.04);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 20.0);

      damperGain.gain.setValueAtTime(1.0, startTime);

      const oscs: OscillatorNode[] = [];
      chord.frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        if (idx === 1) osc.detune.setValueAtTime(2.5, startTime);
        if (idx === 3) osc.detune.setValueAtTime(-2.5, startTime);

        osc.connect(masterGain);
        osc.start(startTime);
        oscs.push(osc);
      });

      activeOscillatorsRef.current = oscs;
      setIsPlaying(true);

      stopTimeoutRef.current = setTimeout(() => {
        cleanupNodes();
        stopTimeoutRef.current = null;
      }, 20500);
    } catch (e) {
      console.warn('Web Audio playback unavailable:', e);
      cleanupNodes();
    }
  }, [cleanupNodes, getAudioContext, soundMode]);

  // Support playback of arbitrary or transposed chord frequencies for ear training
  const playCustomFrequencies = useCallback(async (
    freqs: number[],
    mode = soundMode,
    arpeggiate = false
  ) => {
    if (pedalTimerRef.current) {
      clearTimeout(pedalTimerRef.current);
      pedalTimerRef.current = null;
    }
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }

    cleanupNodes();

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      if (mode === 'piano') {
        let noteInfos: ({ buffer: AudioBuffer; playbackRate: number } | null)[] = [];
        try {
          const { getPianoFrequencyInfo } = await getPianoSamplesModule();
          noteInfos = await Promise.all(
            freqs.map(f => getPianoFrequencyInfo(ctx, f))
          );
        } catch (sampleErr) {
          console.warn('Piano sample load error:', sampleErr);
        }

        const validInfos = noteInfos.filter((info): info is { buffer: AudioBuffer; playbackRate: number } => info !== null);

        if (validInfos.length > 0) {
          const startTime = ctx.currentTime + 0.015;
          const masterGain = ctx.createGain();
          masterGainRef.current = masterGain;

          const damperGain = ctx.createGain();
          damperGainRef.current = damperGain;

          masterGain.gain.setValueAtTime(0.001, startTime);
          masterGain.gain.linearRampToValueAtTime(1.30, startTime + 0.015);
          masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 20.0);

          damperGain.gain.setValueAtTime(1.0, startTime);

          const airFilter = ctx.createBiquadFilter();
          airFilter.type = 'lowpass';
          airFilter.frequency.setValueAtTime(12000, startTime);

          const compressor = ctx.createDynamicsCompressor();
          compressor.threshold.setValueAtTime(-2, startTime);
          compressor.knee.setValueAtTime(6, startTime);
          compressor.ratio.setValueAtTime(4.0, startTime);
          compressor.attack.setValueAtTime(0.003, startTime);
          compressor.release.setValueAtTime(0.25, startTime);

          masterGain.connect(damperGain);
          damperGain.connect(airFilter);
          airFilter.connect(compressor);
          compressor.connect(ctx.destination);

          const sources: AudioBufferSourceNode[] = [];
          const stagger = arpeggiate ? 0.12 : 0.014;

          validInfos.forEach((info, idx) => {
            const source = ctx.createBufferSource();
            source.buffer = info.buffer;
            source.playbackRate.setValueAtTime(info.playbackRate, startTime);

            const noteOffset = idx * stagger;
            const noteGain = ctx.createGain();
            const voiceVolume = idx === 0 ? 1.25 : (idx === validInfos.length - 1 ? 1.15 : 1.05);
            noteGain.gain.setValueAtTime(voiceVolume, startTime + noteOffset);

            source.connect(noteGain);
            noteGain.connect(masterGain);

            source.start(startTime + noteOffset);
            sources.push(source);
          });

          activeSourcesRef.current = sources;
          setIsPlaying(true);

          pedalTimerRef.current = setTimeout(() => {
            pedalTimerRef.current = null;
            try {
              const now = ctx.currentTime;
              damperGain.gain.cancelScheduledValues(now);
              damperGain.gain.setValueAtTime(1.0, now);
              damperGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
            } catch (_) {}
            fadeTimeoutRef.current = setTimeout(() => {
              cleanupNodes();
              fadeTimeoutRef.current = null;
            }, 1850);
          }, 6000);

          return;
        }
      }

      // Synth Mode / Fallback
      const startTime = ctx.currentTime + 0.015;
      const masterGain = ctx.createGain();
      masterGainRef.current = masterGain;

      const damperGain = ctx.createGain();
      damperGainRef.current = damperGain;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1450, startTime);
      filter.Q.setValueAtTime(1.1, startTime);

      masterGain.connect(damperGain);
      damperGain.connect(filter);
      filter.connect(ctx.destination);

      masterGain.gain.setValueAtTime(0.0001, startTime);
      masterGain.gain.linearRampToValueAtTime(0.32, startTime + 0.04);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 20.0);
      damperGain.gain.setValueAtTime(1.0, startTime);

      const oscs: OscillatorNode[] = [];
      const stagger = arpeggiate ? 0.12 : 0;

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        if (idx === 1) osc.detune.setValueAtTime(2.5, startTime);
        if (idx === 3) osc.detune.setValueAtTime(-2.5, startTime);

        const noteOffset = idx * stagger;
        osc.connect(masterGain);
        osc.start(startTime + noteOffset);
        oscs.push(osc);
      });

      activeOscillatorsRef.current = oscs;
      setIsPlaying(true);

      pedalTimerRef.current = setTimeout(() => {
        pedalTimerRef.current = null;
        try {
          const now = ctx.currentTime;
          damperGain.gain.cancelScheduledValues(now);
          damperGain.gain.setValueAtTime(1.0, now);
          damperGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
        } catch (_) {}
        fadeTimeoutRef.current = setTimeout(() => {
          cleanupNodes();
          fadeTimeoutRef.current = null;
        }, 1850);
      }, 6000);

    } catch (e) {
      console.warn('Audio playback error:', e);
      cleanupNodes();
    }
  }, [cleanupNodes, getAudioContext, soundMode]);

  const handleChordPress = useCallback((chord: ChordPaletteItem) => {
    pressStartTimeRef.current = Date.now();
    if (pedalTimerRef.current) {
      clearTimeout(pedalTimerRef.current);
      pedalTimerRef.current = null;
    }
    heldChordIdRef.current = chord.id;
    setHeldChordId(chord.id);
    setActiveChordId(chord.id);
    playChord(chord);
  }, [playChord]);

  const handleChordRelease = useCallback((chordId?: string) => {
    releaseChord(chordId);
  }, [releaseChord]);

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      stopAudio(false);
    } else {
      handleChordPress(selectedChord);
    }
  }, [handleChordPress, isPlaying, selectedChord, stopAudio]);

  // Global window pointerup/cancel to ensure damper is released even if pointer drifts outside element
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (heldChordIdRef.current) {
        releaseChord(heldChordIdRef.current);
      }
    };
    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('pointercancel', handleGlobalPointerUp);
    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [releaseChord]);


  return (
    <section id="music-theory" className="py-24 px-6 bg-[#090b0f] relative border-t border-[#1e222a] overflow-hidden">
      {/* Somatic Resonance Particle Field (Physical resonance of acoustic sound - active when studio is opened) */}
      {isStudioOpen && (
        <>
          <SomaticResonanceCanvas
            enabled={true}
            isPlaying={isPlaying}
            chordColor={selectedChord.color}
            chordTension={selectedChord.tensionPercentage}
            chordName={selectedChord.name}
          />

          {/* Background ambient lighting & somatic acoustic resonance field aura */}
          <div 
            className={`absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-all duration-700 ${
              isPlaying ? 'opacity-35 scale-110' : 'opacity-20 scale-100'
            }`}
            style={{ background: selectedChord.color }}
          />
          <div 
            className={`absolute bottom-1/4 left-1/4 w-[420px] h-[420px] rounded-full blur-[150px] pointer-events-none transition-all duration-1000 ${
              isPlaying ? 'opacity-20 scale-125' : 'opacity-8 scale-90'
            }`}
            style={{ background: selectedChord.color }}
          />
        </>
      )}
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#c49750] font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#c49750]" />
            <span>{t.musicTheory.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#fbf9f5] font-light leading-tight mb-4">
            {t.musicTheory.title}
          </h2>

          {t.musicTheory.subtitle ? (
            <p className="text-base sm:text-lg text-[#b8b5ab] font-light leading-relaxed">
              {t.musicTheory.subtitle}
            </p>
          ) : null}
        </div>

        {/* Featured Philosophy Block */}
        <div className="mb-16 bg-[#10131b] border border-[#232733] rounded-2xl p-6 sm:p-9 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-[#c49750] via-[#d4af37] to-[#8a7bb8]" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <p className="text-xs uppercase tracking-widest text-[#c49750] font-mono">
                {isDe ? 'Die Atelier-Philosophie' : 'The Atelier Pedagogy'}
              </p>
              <p className="font-serif text-base sm:text-lg lg:text-xl text-[#dedacf] leading-relaxed font-light">
                {t.musicTheory.quoteText}
              </p>
              {t.musicTheory.quoteAuthor ? (
                <p className="text-xs sm:text-sm text-[#9c988e] font-sans">
                  {t.musicTheory.quoteAuthor}
                </p>
              ) : null}
            </div>

            <button
              onClick={() => onOpenInquiry(isDe ? 'Musiktheorie & Harmonielehre' : 'Music Theory & Harmony Lessons')}
              className="self-start lg:self-center shrink-0 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded-lg transition-all duration-200 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>{isDe ? 'Harmonie-Coaching anfragen' : 'Book Theory Coaching'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2 Core Pillars: 1. The Secret Garden & 2. The Music Theory */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Section 1: The Secret Garden */}
          <div className="bg-[#12151e] border border-[#212633] rounded-2xl p-7 sm:p-9 hover:border-[#c49750]/50 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#c49750] via-[#e5c17d] to-[#8a7bb8] opacity-80" />
            
            <div className="flex-1 flex flex-col justify-start">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl sm:text-3xl font-serif text-[#c49750] font-medium">
                  {t.musicTheory.secretGardenTitle}
                </h3>
                <div className="w-8 h-8 rounded-lg bg-[#1a1f2c] border border-[#2b3244] flex items-center justify-center text-[#c49750] group-hover:bg-[#c49750] group-hover:text-black transition-colors shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#b8b4a8] font-light leading-relaxed mb-6">
                {t.musicTheory.secretGardenIntro}
              </p>

              <div className="mb-6">
                <p className="text-xs uppercase tracking-wider text-[#c49750] font-mono font-medium mb-3">
                  {t.musicTheory.secretGardenWaysTitle}
                </p>
                <ul className="space-y-3">
                  {t.musicTheory.secretGardenItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#dedacf] leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c49750] mt-2 shrink-0" />
                      <span>
                        <strong className="text-[#f5eedf] font-medium">{item.label}:</strong> {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Quote Box: Aligned and sized identically to the right card's launchpad */}
            <div className="mt-auto border-t border-[#232838] bg-[#0c0e14]/80 -mx-7 -mb-7 sm:-mx-9 sm:-mb-9 px-6 sm:px-8 py-5 sm:py-6 rounded-b-2xl flex flex-col justify-center min-h-[135px] lg:h-[145px]">
              <p className="text-base sm:text-lg lg:text-xl font-serif italic text-[#f3cf8a] font-light leading-relaxed">
                “{t.musicTheory.secretGardenClosing}”
              </p>
            </div>
          </div>

          {/* Section 2: The Music Theory */}
          <div className="bg-[#12151e] border border-[#212633] rounded-2xl p-7 sm:p-9 hover:border-[#38bdf8]/50 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group shadow-xl h-full">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c49750] opacity-80" />
            
            <div className="flex-1 flex flex-col justify-start">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl sm:text-3xl font-serif text-[#38bdf8] font-medium">
                  {t.musicTheory.theoryTitle}
                </h3>
                <div className="w-8 h-8 rounded-lg bg-[#1a1f2c] border border-[#2b3244] flex items-center justify-center text-[#38bdf8] group-hover:bg-[#38bdf8] group-hover:text-black transition-colors shrink-0">
                  <Music className="w-4 h-4" />
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#b8b4a8] font-light leading-relaxed mb-6">
                {t.musicTheory.theoryIntro}
              </p>

              <div>
                <ul className="space-y-3.5">
                  {t.musicTheory.theoryItems.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#dedacf] leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] mt-2 shrink-0" />
                      <span>
                        <strong className="text-[#f5eedf] font-medium">{item.label}:</strong> {item.desc}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Interactive Keys Launchpad - Identical height and alignment to the left card */}
            <div className="mt-auto border-t border-[#232838] bg-[#0c0e14]/80 -mx-7 -mb-7 sm:-mx-9 sm:-mb-9 px-6 sm:px-8 py-5 sm:py-6 rounded-b-2xl flex flex-col justify-center min-h-[135px] lg:h-[145px]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => {
                    setStudioTab('explore');
                    setIsStudioOpen(true);
                    setTimeout(() => {
                      document.getElementById('harmonic-studio')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="w-full py-3.5 px-4 rounded-xl border border-[#2b3246] bg-[#131724] hover:bg-[#1a2032] hover:border-[#c49750]/60 text-[#dedacf] hover:text-white text-xs sm:text-sm font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 select-none shadow-md group/btn active:scale-98"
                >
                  <Waves className="w-4 h-4 text-[#c49750] group-hover/btn:scale-110 transition-transform shrink-0" />
                  <span>{isDe ? 'Akkorde & Farben' : 'Explore Colors'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStudioTab('ear-training');
                    setIsStudioOpen(true);
                    setTimeout(() => {
                      document.getElementById('harmonic-studio')?.scrollIntoView({ behavior: 'smooth' });
                    }, 50);
                  }}
                  className="w-full py-3.5 px-4 rounded-xl border border-[#2b3246] bg-[#131724] hover:bg-[#1a2032] hover:border-[#c49750]/60 text-[#dedacf] hover:text-white text-xs sm:text-sm font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 select-none shadow-md group/btn active:scale-98"
                >
                  <Headphones className="w-4 h-4 text-[#c49750] group-hover/btn:scale-110 transition-transform shrink-0" />
                  <span>{isDe ? 'Gehör testen' : 'Test Your Ear'}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Interactive Harmonic Color & Weight Studio */}
        {isStudioOpen && (
          <div id="harmonic-studio" className="mb-20 bg-[#0e1118] border border-[#242938] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-300">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c49750] mb-1.5">
                  <Waves className="w-3.5 h-3.5 text-[#c49750]" />
                  <span>{t.musicTheory.interactiveTitle}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#fbf9f5] font-light">
                  {t.musicTheory.interactiveSubtitle}
                </h3>
              </div>

              <div className="flex items-center gap-3 self-start sm:self-center">
                <div className="text-[11px] text-[#858175] font-mono max-w-xs text-left sm:text-right hidden md:block">
                  {t.musicTheory.interactiveHint}
                </div>
                
                <button
                  type="button"
                  onClick={() => {
                    stopAudio(true);
                    setIsStudioOpen(false);
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-[#a29e92] hover:text-white bg-[#141722] hover:bg-[#1d2232] border border-[#282f40] transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  title={isDe ? 'Studio schließen' : 'Close Studio'}
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>{isDe ? 'Studio schließen' : 'Close Studio'}</span>
                </button>
              </div>
            </div>

            {/* Studio Tab Switcher: Explore vs Test Your Ear */}
            <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
              <button
                type="button"
                onClick={() => {
                  setStudioTab('explore');
                  stopAudio(true);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  studioTab === 'explore'
                    ? 'bg-[#c49750] text-black font-semibold shadow-lg shadow-[#c49750]/20'
                    : 'bg-[#12151f] text-[#a09c91] hover:text-white border border-[#232938]'
                }`}
              >
                <Waves className="w-4 h-4" />
                <span>{isDe ? '1. Harmonien Erforschen' : '1. Harmonic Explorer'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStudioTab('ear-training');
                  stopAudio(true);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-mono uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                  studioTab === 'ear-training'
                    ? 'bg-[#c49750] text-black font-semibold shadow-lg shadow-[#c49750]/20'
                    : 'bg-[#12151f] text-[#a09c91] hover:text-white border border-[#232938]'
                }`}
              >
                <Music className="w-4 h-4" />
                <span>{isDe ? '2. Gehör Testen' : '2. Test Your Ear'}</span>
              </button>
            </div>

            {studioTab === 'ear-training' ? (
              <EarTrainingStudio
                chords={CHORD_PALETTE}
                playChordFrequencies={playCustomFrequencies}
                stopAudio={stopAudio}
                isPlaying={isPlaying}
                soundMode={soundMode}
                isDe={isDe}
              />
            ) : (
              <>

                {/* Compact Chord Selector Ribbon without descriptions */}
                <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2 mb-8">
                  {CHORD_PALETTE.map((chord) => {
                    const isSelected = chord.id === activeChordId;
                    const isCurrentlyPlayingThis = isSelected && isPlaying;
                    return (
                      <button
                        key={chord.id}
                        type="button"
                        onPointerDown={(e) => {
                          if (e.pointerType === 'touch' || e.button === 0) {
                            handleChordPress(chord);
                          }
                        }}
                        onPointerUp={() => handleChordRelease(chord.id)}
                        onPointerCancel={() => handleChordRelease(chord.id)}
                        onPointerLeave={() => handleChordRelease(chord.id)}
                        onKeyDown={(e) => {
                          if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
                            e.preventDefault();
                            handleChordPress(chord);
                          }
                        }}
                        onKeyUp={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleChordRelease(chord.id);
                          }
                        }}
                        className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[62px] sm:min-h-[68px] select-none touch-manipulation ${
                          isSelected
                            ? 'border-[#c49750] bg-[#161a24] shadow-[0_0_20px_rgba(196,151,80,0.2)] ring-1 ring-[#c49750]/50 scale-[1.02]'
                            : 'border-[#222634] bg-[#12141c] hover:border-[#383f52] hover:bg-[#151822]'
                        } ${heldChordId === chord.id ? 'ring-2 ring-[#c49750]' : ''}`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span 
                            className={`w-2.5 h-2.5 rounded-full shrink-0 transition-transform ${
                              isCurrentlyPlayingThis ? 'scale-125 ring-2 ring-white/50' : ''
                            }`} 
                            style={{ backgroundColor: chord.color }}
                          />
                          <span className="text-[10px] font-mono text-[#8c887d]">
                            {chord.tensionPercentage}%
                          </span>
                        </div>
                        <div className="font-serif text-xs sm:text-sm font-medium text-[#eeeae0] leading-snug flex items-center justify-between">
                          <span className="truncate">{chord.name}</span>
                          {isCurrentlyPlayingThis && (
                            <span className="text-[10px] text-[#c49750] font-mono animate-pulse ml-1">●</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Chord Showcase & Acoustic Deep Dive */}
                <div className="bg-[#141822] border border-[#282e3f] rounded-xl p-5 sm:p-7">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-center">
                    
                    {/* Left Column: Chord Identity & Playback + Compact Score on the Right */}
                    <div className="lg:col-span-6 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        
                        {/* Chord Title & Playback Button */}
                        <div className="space-y-2.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span 
                              className="px-2.5 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider"
                              style={{ backgroundColor: `${selectedChord.color}25`, color: selectedChord.color }}
                            >
                              {isDe ? selectedChord.archetypeDe : selectedChord.archetype}
                            </span>
                          </div>

                          <div className="flex items-center gap-3.5">
                            <h4 className="text-3xl sm:text-4xl font-serif text-[#fbf9f5] font-normal tracking-tight">
                              {selectedChord.name}
                            </h4>

                            {/* Audio Play/Stop Button with instant strike & hold */}
                            <button
                              type="button"
                              onPointerDown={(e) => {
                                if (e.pointerType === 'touch' || e.button === 0) {
                                  if (isPlaying) {
                                    stopAudio(false);
                                  } else {
                                    handleChordPress(selectedChord);
                                  }
                                }
                              }}
                              onPointerUp={() => {
                                if (heldChordIdRef.current) {
                                  handleChordRelease(selectedChord.id);
                                }
                              }}
                              onPointerCancel={() => {
                                if (heldChordIdRef.current) {
                                  handleChordRelease(selectedChord.id);
                                }
                              }}
                              onPointerLeave={() => {
                                if (heldChordIdRef.current) {
                                  handleChordRelease(selectedChord.id);
                                }
                              }}
                              onKeyDown={(e) => {
                                if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
                                  e.preventDefault();
                                  if (isPlaying) {
                                    stopAudio(false);
                                  } else {
                                    handleChordPress(selectedChord);
                                  }
                                }
                              }}
                              onKeyUp={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  if (heldChordIdRef.current) {
                                    handleChordRelease(selectedChord.id);
                                  }
                                }
                              }}
                              className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer group shrink-0 select-none active:scale-95 touch-manipulation"
                              style={{
                                backgroundColor: selectedChord.color,
                                boxShadow: isPlaying ? `0 0 28px ${selectedChord.color}` : undefined
                              }}
                              title={
                                isPlaying
                                  ? (isDe ? 'Klang anhalten' : 'Stop sound')
                                  : (isDe ? 'Akkord anspielen' : 'Play chord')
                              }
                            >
                              {isPlaying ? (
                                <VolumeX className="w-5 h-5 text-black animate-pulse" />
                              ) : (
                                <Volume2 className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
                              )}
                            </button>
                          </div>

                          <p className="text-xs text-[#a09c91] font-mono leading-relaxed">
                            {selectedChord.voicingLabel}
                          </p>
                        </div>

                        {/* Compact Square Musical Score (Positioned on the right of the chord) */}
                        <div className="shrink-0 flex items-center justify-center sm:justify-end">
                          <MusicalScoreChord
                            notes={selectedChord.notes}
                            chordName={selectedChord.name}
                            color={selectedChord.color}
                            isDe={isDe}
                          />
                        </div>

                      </div>

                      {/* Gravitational Tension Gauge */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-[#8c887d]">
                            {isDe ? 'Harmonische Gravitation / Spannung:' : 'Harmonic Tension / Gravitational Pull:'}
                          </span>
                          <span className="font-semibold" style={{ color: selectedChord.color }}>
                            {isDe ? selectedChord.tensionLabelDe : selectedChord.tensionLabel}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#1e2330] overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500"
                            style={{ 
                              width: `${selectedChord.tensionPercentage}%`,
                              backgroundColor: selectedChord.color 
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Sensation & Pedagogical Breakdown */}
                    <div className="lg:col-span-6 space-y-4 border-t lg:border-t-0 lg:border-l border-white/5 pt-5 lg:pt-0 lg:pl-7">
                      
                      <div>
                        <h5 className="text-xs uppercase tracking-wider font-mono text-[#c49750] mb-1.5">
                          {isDe ? 'Wie es sich anfühlt (Sinnliche Wahrnehmung):' : 'How It Feels in the Body (Somatic Sensation):'}
                        </h5>
                        <p className="text-base sm:text-lg text-[#dedacf] font-serif italic leading-relaxed">
                          “{isDe ? selectedChord.emotionalFeelingDe : selectedChord.emotionalFeeling}”
                        </p>
                      </div>

                      <div>
                        <h5 className="text-xs uppercase tracking-wider font-mono text-[#a78bfa] mb-1.5">
                          {isDe ? 'Akustisches Phänomen:' : 'Acoustic Phenomenon:'}
                        </h5>
                        <p className="text-xs sm:text-sm text-[#a8a499] font-light leading-relaxed">
                          {isDe ? selectedChord.acousticPhenomenonDe : selectedChord.acousticPhenomenon}
                        </p>
                      </div>

                    </div>

                  </div>
                </div>
              </>
            )}

            {/* Bottom Collapse Button */}
            <div className="mt-8 pt-4 border-t border-white/5 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  stopAudio(true);
                  setIsStudioOpen(false);
                }}
                className="text-xs font-mono text-[#8c887d] hover:text-[#c49750] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span>{isDe ? 'Studio verbergen' : 'Collapse Studio'}</span>
              </button>
            </div>

          </div>
        )}

        {/* 3 Learner Profiles Grid */}
        <div className="mb-14">
          <h3 className="text-xs uppercase tracking-widest text-[#c49750] font-mono mb-6 text-center">
            {t.musicTheory.audiencesTitle}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Profile 1: Producers */}
            <div className="bg-[#11141c] border border-[#212633] rounded-2xl p-6 flex flex-col justify-between hover:border-[#c49750]/40 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Disc className="w-4 h-4 text-[#c49750]" />
                  <span className="text-xs uppercase tracking-wider font-mono text-[#c49750]">
                    {t.musicTheory.producerBadge}
                  </span>
                </div>
                <h4 className="text-lg font-serif text-[#f2eee9] font-medium mb-2.5">
                  {t.musicTheory.producerTitle}
                </h4>
                <p className="text-xs sm:text-sm text-[#9c988e] font-light leading-relaxed">
                  {t.musicTheory.producerDesc}
                </p>
              </div>
            </div>

            {/* Profile 2: Singers */}
            <div className="bg-[#11141c] border border-[#212633] rounded-2xl p-6 flex flex-col justify-between hover:border-[#a78bfa]/40 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Mic className="w-4 h-4 text-[#a78bfa]" />
                  <span className="text-xs uppercase tracking-wider font-mono text-[#a78bfa]">
                    {t.musicTheory.singerBadge}
                  </span>
                </div>
                <h4 className="text-lg font-serif text-[#f2eee9] font-medium mb-2.5">
                  {t.musicTheory.singerTitle}
                </h4>
                <p className="text-xs sm:text-sm text-[#9c988e] font-light leading-relaxed">
                  {t.musicTheory.singerDesc}
                </p>
              </div>
            </div>

            {/* Profile 3: Classical & Listeners */}
            <div className="bg-[#11141c] border border-[#212633] rounded-2xl p-6 flex flex-col justify-between hover:border-[#38bdf8]/40 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Music className="w-4 h-4 text-[#38bdf8]" />
                  <span className="text-xs uppercase tracking-wider font-mono text-[#38bdf8]">
                    {t.musicTheory.classicalBadge}
                  </span>
                </div>
                <h4 className="text-lg font-serif text-[#f2eee9] font-medium mb-2.5">
                  {t.musicTheory.classicalTitle}
                </h4>
                <p className="text-xs sm:text-sm text-[#9c988e] font-light leading-relaxed">
                  {t.musicTheory.classicalDesc}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Action Row */}
        <div className="bg-gradient-to-r from-[#141822] to-[#11131a] border border-[#252b39] rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl font-serif text-[#f2eee9] font-medium">
              {isDe ? 'Bereit, Musik jenseits trockener Formeln zu verstehen?' : 'Ready to Experience Harmony Beyond Dry Formulas?'}
            </h4>
            <p className="text-xs text-[#9f9b90] font-light">
              {t.musicTheory.ctaNote}
            </p>
          </div>

          <button
            onClick={() => onOpenInquiry(isDe ? 'Musiktheorie & Harmonielehre' : 'Music Theory & Ear-First Harmony')}
            className="shrink-0 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded-lg transition-all duration-200 shadow-md cursor-pointer flex items-center gap-2"
          >
            <span>{t.musicTheory.ctaButton}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
