import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Volume2, VolumeX, Waves, ArrowRight, Music, Disc, Mic } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
    id: 'c-maj7',
    name: 'Cmaj7',
    voicingLabel: 'Root · Major 3rd · 5th · Leading Major 7th',
    archetype: 'Luminescent Nostalgia & Bittersweet Longing',
    archetypeDe: 'Luminiszierende Sehnsucht & Nostalgie',
    frequencies: [130.81, 164.81, 196.00, 246.94], // C3, E3, G3, B3
    notes: ['C3', 'E3', 'G3', 'B3'],
    color: '#a78bfa',
    bgGlow: 'rgba(167, 139, 250, 0.18)',
    tensionPercentage: 35,
    tensionLabel: 'Tender Floating (35% Tension)',
    tensionLabelDe: 'Zartes Schweben (35% Spannung)',
    emotionalFeeling: 'The B-natural hovers a semitone below the octave, like looking at an old photograph with a warm, wistful smile. It smiles with a tear.',
    emotionalFeelingDe: 'Das H schwebt einen Halbton unter der Oktave – wie der Blick auf ein altes Foto mit einem wehmütigen, warmen Lächeln.',
    acousticPhenomenon: 'The gentle clash between the deep root C and the major 7th B creates a luminous harmonic shimmer without harshness.',
    acousticPhenomenonDe: 'Die feine Reibung zwischen Grundton C und der großen Septime H erzeugt ein silbriges Flirren ohne jede Härte.',
    musicalReferences: 'Debussy (Clair de lune), Ravel, Bill Evans, Brazilian Bossa Nova (Jobim), modern dream-pop.',
  },
  {
    id: 'a-min9',
    name: 'Am9',
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
    id: 'c-min6',
    name: 'Cm6 / Minor 6th',
    voicingLabel: 'Minor 3rd · Perfect 5th · Major 6th',
    archetype: 'Noble Tragic Pathos & Autumnal Elegance',
    archetypeDe: 'Edles Pathos & Herbstliche Melancholie',
    frequencies: [130.81, 155.56, 196.00, 220.00], // C3, Eb3, G3, A3
    notes: ['C3', 'Eb3', 'G3', 'A3'],
    color: '#ec4899',
    bgGlow: 'rgba(236, 72, 153, 0.18)',
    tensionPercentage: 65,
    tensionLabel: 'Bittersweet Descent (65% Tension)',
    tensionLabelDe: 'Herbe Melancholie (65% Spannung)',
    emotionalFeeling: 'A heavy sigh. The major 6th against the minor third creates the bittersweet nobility of classic European tragedy.',
    emotionalFeelingDe: 'Ein tiefer Seufzer. Die große Sexte gegen die kleine Terz erzeugt jenen herben, vornehmen Schmerz europäischer Tragödien.',
    acousticPhenomenon: 'The acoustic collision of minor third and major sixth echoes the Dorian vocal color, familiar in ancient modal chant.',
    acousticPhenomenonDe: 'Der akustische Kontrast aus Mollterz und großer Sexte spiegelt die dorische Stimmfarbe wider.',
    musicalReferences: 'Fauré & Duparc mélodies, Ennio Morricone film themes, Puccini (La Bohème act IV), Django Reinhardt jazz.',
  },
  {
    id: 'c-aug',
    name: 'Caug (Augmented)',
    voicingLabel: 'Root · Major 3rd · Augmented 5th (Symmetrical)',
    archetype: 'Zero Gravity & Dreamlike Dissolution',
    archetypeDe: 'Schwerelosigkeit & Traumhafte Auflösung',
    frequencies: [130.81, 164.81, 207.65], // C3, E3, Ab3
    notes: ['C3', 'E3', 'Ab3'],
    color: '#10b981',
    bgGlow: 'rgba(16, 185, 129, 0.18)',
    tensionPercentage: 75,
    tensionLabel: 'Suspended Levitation (75% Tension)',
    tensionLabelDe: 'Schwebende Levitation (75% Spannung)',
    emotionalFeeling: 'Disorientation, vertigo, waking up inside a dream. The boundaries of tonality blur because there is no natural anchor.',
    emotionalFeelingDe: 'Orientierungslosigkeit, Schwindel, Aufwachen in einem Traum. Die tonalen Grenzen lösen sich auf.',
    acousticPhenomenon: 'Symmetrical major thirds (whole-tone structure) eliminate gravitational polarity, depriving the ear of any single tonal center.',
    acousticPhenomenonDe: 'Symmetrische große Terzen heben die tonale Polarität auf; das Ohr verliert jeden festen Boden.',
    musicalReferences: 'Debussy (Voiles), Stevie Wonder, film transitions depicting hypnotism or altered states of consciousness.',
  },
  {
    id: 'c-dim-min7',
    name: 'Cø7 (Dim. + m7)',
    voicingLabel: 'Root · Minor 3rd · Diminished 5th · Minor 7th',
    archetype: 'The Tristan Ache & Tragic Yearning',
    archetypeDe: 'Tristan-Sehnsucht & Tragische Tiefe',
    frequencies: [130.81, 155.56, 185.00, 233.08], // C3, Eb3, Gb3, Bb3
    notes: ['C3', 'Eb3', 'Gb3', 'Bb3'],
    color: '#818cf8',
    bgGlow: 'rgba(129, 140, 248, 0.20)',
    tensionPercentage: 84,
    tensionLabel: 'Urgent Yearning (84% Tension)',
    tensionLabelDe: 'Dringliche Sehnsucht (84% Spannung)',
    emotionalFeeling: 'A bittersweet ache suspended between dark friction and aching vulnerability. The tritone and minor 7th pull together with visceral, unresolved longing.',
    emotionalFeelingDe: 'Ein bittersüßer Schmerz zwischen tritonischer Reibung und zerbrechlicher Verwundbarkeit. Der Klang schwebt unaufgelöst und berührt das Herz unmittelbar.',
    acousticPhenomenon: 'A diminished triad paired with a minor seventh (half-diminished): the internal tritone (C-Gb) and minor intervals create deep, asymmetric gravitational pull.',
    acousticPhenomenonDe: 'Ein verminderter Dreiklang mit kleiner Septime: Der interne Tritonus (C-Ges) und die Moll-Intervalle erzeugen einen asymmetrischen, sehnsuchtsvollen Gravitationssog.',
    musicalReferences: 'Wagner (Tristan und Isolde Prelude - the Tristan Chord), Chopin (Ballades & Nocturnes), Ravel (Pavane), Wayne Shorter, classic jazz ii-V minor cadences.',
  }
];

export const MusicTheory: React.FC<MusicTheoryProps> = ({ onOpenInquiry }) => {
  const { language, t } = useLanguage();
  const isDe = language === 'de';

  const [activeChordId, setActiveChordId] = useState<string>('c-maj7');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [soundMode, setSoundMode] = useState<'piano' | 'synth'>('piano');

  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const activeOscillatorsRef = useRef<OscillatorNode[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTriggerTimeRef = useRef<number>(0);

  const selectedChord = CHORD_PALETTE.find((c) => c.id === activeChordId) || CHORD_PALETTE[1];

  // Helper to get or lazily initialize AudioContext
  const getAudioContext = useCallback(() => {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioCtx();
    }
    return audioContextRef.current;
  }, []);

  // Pre-decode all acoustic piano samples on earliest interaction so first chord strikes with 0ms latency
  useEffect(() => {
    const handleInitialUserGesture = () => {
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
      window.removeEventListener('pointerdown', handleInitialUserGesture);
      window.removeEventListener('keydown', handleInitialUserGesture);
    };

    window.addEventListener('pointerdown', handleInitialUserGesture, { once: true });
    window.addEventListener('keydown', handleInitialUserGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleInitialUserGesture);
      window.removeEventListener('keydown', handleInitialUserGesture);
    };
  }, [getAudioContext]);

  const stopAudio = useCallback((immediate = false) => {
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }

    const ctx = audioContextRef.current;
    const masterGain = masterGainRef.current;

    const cleanupNodes = () => {
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
      setIsPlaying(false);
    };

    if (immediate || !ctx || !masterGain) {
      cleanupNodes();
      return;
    }

    try {
      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setValueAtTime(masterGain.gain.value, now);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
    } catch (_) {}

    fadeTimeoutRef.current = setTimeout(() => {
      cleanupNodes();
      fadeTimeoutRef.current = null;
    }, 130);
  }, []);

  const playChord = useCallback(async (chord: ChordPaletteItem, mode = soundMode) => {
    // If a previous fadeout was scheduled, cancel it immediately so it doesn't kill the new note!
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }

    // Immediately stop running audio nodes before starting the new chord
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

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGainRef.current = masterGain;

      if (mode === 'piano') {
        // High-Fidelity Steinway Grand Piano Sample Playback
        // Immediate hammer impact, sustained acoustic resonance over 4.5s
        masterGain.gain.setValueAtTime(0.001, now);
        masterGain.gain.linearRampToValueAtTime(0.75, now + 0.012);
        masterGain.gain.exponentialRampToValueAtTime(0.40, now + 1.2);
        masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        // Acoustic air presence filter
        const airFilter = ctx.createBiquadFilter();
        airFilter.type = 'lowpass';
        airFilter.frequency.setValueAtTime(11500, now);

        masterGain.connect(airFilter);
        airFilter.connect(ctx.destination);

        const { getPianoNoteBuffer } = await getPianoSamplesModule();
        const buffers = await Promise.all(
          chord.notes.map((note) => getPianoNoteBuffer(ctx, note))
        );

        const hasValidBuffers = buffers.some((b) => b !== null);
        if (hasValidBuffers) {
          const sources: AudioBufferSourceNode[] = [];
          buffers.forEach((buffer, idx) => {
            if (!buffer) return;
            const source = ctx.createBufferSource();
            source.buffer = buffer;

            // Micro-voicing roll (12ms stagger from root to top note, human pianist touch)
            const noteOffset = idx * 0.012;
            const noteGain = ctx.createGain();
            const voiceVolume = idx === 0 ? 1.0 : (idx === chord.notes.length - 1 ? 0.95 : 0.85);
            noteGain.gain.setValueAtTime(voiceVolume, now + noteOffset);

            source.connect(noteGain);
            noteGain.connect(masterGain);

            source.start(now + noteOffset);
            sources.push(source);
          });

          activeSourcesRef.current = sources;
          setIsPlaying(true);

          stopTimeoutRef.current = setTimeout(() => {
            setIsPlaying(false);
          }, 4600);
          return;
        }
      }

      // Harmonic Synthesis Mode / Warm Pure Color Waves
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1450, now);
      filter.Q.setValueAtTime(1.1, now);

      masterGain.connect(filter);
      filter.connect(ctx.destination);

      masterGain.gain.setValueAtTime(0.0001, now);
      masterGain.gain.linearRampToValueAtTime(0.22, now + 0.04);
      masterGain.gain.exponentialRampToValueAtTime(0.12, now + 0.9);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);

      const oscs: OscillatorNode[] = [];
      chord.frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        if (idx === 1) osc.detune.setValueAtTime(2.5, now);
        if (idx === 3) osc.detune.setValueAtTime(-2.5, now);

        osc.connect(masterGain);
        osc.start(now);
        oscs.push(osc);
      });

      activeOscillatorsRef.current = oscs;
      setIsPlaying(true);

      stopTimeoutRef.current = setTimeout(() => {
        setIsPlaying(false);
      }, 3900);
    } catch (e) {
      console.warn('Web Audio playback unavailable:', e);
      setIsPlaying(false);
    }
  }, [getAudioContext, soundMode]);

  const handleTriggerChord = useCallback((chord: ChordPaletteItem) => {
    lastTriggerTimeRef.current = Date.now();
    setActiveChordId(chord.id);
    playChord(chord);
  }, [playChord]);

  const handleTogglePlay = useCallback(() => {
    lastTriggerTimeRef.current = Date.now();
    if (isPlaying) {
      stopAudio();
    } else {
      playChord(selectedChord);
    }
  }, [isPlaying, playChord, selectedChord, stopAudio]);

  return (
    <section id="music-theory" className="py-24 px-6 bg-[#090b0f] relative border-t border-[#1e222a]">
      {/* Background ambient lighting */}
      <div 
        className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-20"
        style={{ background: selectedChord.color }}
      />
      
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
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-[#c49750] uppercase tracking-wider">
                  01 · {t.musicTheory.secretGardenTag}
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#1a1f2c] border border-[#2b3244] flex items-center justify-center text-[#c49750] group-hover:bg-[#c49750] group-hover:text-black transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif text-[#f2eee9] font-medium mb-4">
                {t.musicTheory.secretGardenTitle}
              </h3>

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

            <div className="mt-8 pt-6 border-t border-[#232838] bg-[#0c0e14]/80 -mx-7 -mb-7 sm:-mx-9 sm:-mb-9 p-6 sm:p-8 rounded-b-2xl">
              <p className="text-lg sm:text-xl lg:text-2xl font-serif italic text-[#f3cf8a] font-light leading-relaxed">
                “{t.musicTheory.secretGardenClosing}”
              </p>
            </div>
          </div>

          {/* Section 2: The Music Theory */}
          <div className="bg-[#12151e] border border-[#212633] rounded-2xl p-7 sm:p-9 hover:border-[#38bdf8]/50 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group shadow-xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#38bdf8] via-[#818cf8] to-[#c49750] opacity-80" />
            
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-[#38bdf8] uppercase tracking-wider">
                  02 · {t.musicTheory.theoryTag}
                </span>
                <div className="w-8 h-8 rounded-lg bg-[#1a1f2c] border border-[#2b3244] flex items-center justify-center text-[#38bdf8] group-hover:bg-[#38bdf8] group-hover:text-black transition-colors">
                  <Music className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif text-[#f2eee9] font-medium mb-4">
                {t.musicTheory.theoryTitle}
              </h3>

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
          </div>

        </div>

        {/* Interactive Harmonic Color & Weight Studio */}
        <div className="mb-20 bg-[#0e1118] border border-[#242938] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
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
            <div className="text-[11px] text-[#858175] font-mono max-w-xs text-left sm:text-right">
              {t.musicTheory.interactiveHint}
            </div>
          </div>

          {/* Sound Timbre Selector & Real-Time Sustain Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 bg-[#12151e] border border-[#202534] rounded-xl p-3 px-4">
            <div className="flex items-center gap-2.5 text-xs font-mono text-[#a39f94]">
              <span className="text-[#c49750] font-medium">{t.musicTheory.instrumentLabel}:</span>
              <div className="inline-flex rounded-lg bg-[#0b0d13] p-1 border border-[#262c3c]">
                <button
                  type="button"
                  onClick={() => {
                    setSoundMode('piano');
                    playChord(selectedChord, 'piano');
                  }}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    soundMode === 'piano'
                      ? 'bg-[#c49750] text-black font-semibold shadow-sm'
                      : 'text-[#9e9a8f] hover:text-[#fbf9f5]'
                  }`}
                >
                  <span>🎹 {t.musicTheory.pianoInstrument}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSoundMode('synth');
                    playChord(selectedChord, 'synth');
                  }}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    soundMode === 'synth'
                      ? 'bg-[#c49750] text-black font-semibold shadow-sm'
                      : 'text-[#9e9a8f] hover:text-[#fbf9f5]'
                  }`}
                >
                  <span>〰️ {t.musicTheory.synthInstrument}</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] font-mono text-[#8c887d] flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isPlaying ? 'bg-emerald-400 ring-4 ring-emerald-400/20 animate-pulse' : 'bg-[#32394c]'
                }`}
              />
              <span>
                {isPlaying
                  ? (isDe ? 'Akkord schwingt voll nach (Anschlag aktiv)' : 'Resonating sustained chord…')
                  : (isDe ? 'Drücken für sofortigen Tastenanschlag' : 'Press any chord for instant acoustic strike')}
              </span>
            </div>
          </div>

          {/* Chord Selector Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 mb-8">
            {CHORD_PALETTE.map((chord) => {
              const isSelected = chord.id === activeChordId;
              const isCurrentlyPlayingThis = isSelected && isPlaying;
              return (
                <button
                  key={chord.id}
                  type="button"
                  onPointerDown={(e) => {
                    if (e.button === 0) {
                      e.preventDefault();
                      handleTriggerChord(chord);
                    }
                  }}
                  onClick={() => {
                    if (Date.now() - lastTriggerTimeRef.current < 350) return;
                    handleTriggerChord(chord);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleTriggerChord(chord);
                    }
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[96px] select-none ${
                    isSelected
                      ? 'border-[#c49750] bg-[#161a24] shadow-[0_0_20px_rgba(196,151,80,0.2)] ring-1 ring-[#c49750]/50 scale-[1.02]'
                      : 'border-[#222634] bg-[#12141c] hover:border-[#383f52] hover:bg-[#151822]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-2">
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
                  <div>
                    <div className="font-serif text-sm sm:text-base font-medium text-[#eeeae0] leading-snug flex items-center justify-between">
                      <span>{chord.name}</span>
                      {isCurrentlyPlayingThis && (
                        <span className="text-[10px] text-[#c49750] font-mono animate-pulse">●</span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#9b968a] truncate font-light mt-0.5">
                      {isDe ? chord.archetypeDe : chord.archetype}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Chord Showcase & Acoustic Deep Dive */}
          <div className="bg-[#141822] border border-[#282e3f] rounded-xl p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Playback & Color Swatch */}
              <div className="lg:col-span-5 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="px-2.5 py-0.5 rounded text-[10px] font-mono font-medium uppercase tracking-wider"
                        style={{ backgroundColor: `${selectedChord.color}25`, color: selectedChord.color }}
                      >
                        {isDe ? selectedChord.archetypeDe : selectedChord.archetype}
                      </span>
                    </div>
                    <h4 className="text-3xl sm:text-4xl font-serif text-[#fbf9f5] font-normal">
                      {selectedChord.name}
                    </h4>
                    <p className="text-xs text-[#a09c91] font-mono mt-0.5">
                      {selectedChord.voicingLabel} · <span className="text-[#dedacf] font-semibold">{selectedChord.notes.join(' · ')}</span>
                    </p>
                  </div>

                  {/* Audio Play/Stop Button with instant strike */}
                  <button
                    type="button"
                    onPointerDown={(e) => {
                      if (e.button === 0) {
                        e.preventDefault();
                        handleTogglePlay();
                      }
                    }}
                    onClick={() => {
                      if (Date.now() - lastTriggerTimeRef.current < 350) return;
                      handleTogglePlay();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleTogglePlay();
                      }
                    }}
                    className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer group shrink-0 select-none active:scale-95"
                    style={{
                      backgroundColor: selectedChord.color,
                      boxShadow: isPlaying ? `0 0 28px ${selectedChord.color}` : undefined
                    }}
                    title={isPlaying ? 'Stop Sustain' : 'Play Acoustic Chord Strike'}
                  >
                    {isPlaying ? (
                      <VolumeX className="w-6 h-6 text-black animate-pulse" />
                    ) : (
                      <Volume2 className="w-6 h-6 text-black group-hover:scale-110 transition-transform" />
                    )}
                  </button>
                </div>

                {/* Gravitational Tension Gauge */}
                <div className="space-y-1.5 pt-2">
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

                <div className="flex flex-col gap-1 text-[11px] text-[#736f64] font-mono">
                  <div>
                    <span className="text-[#969183]">{isDe ? 'Flügel-Stimmen: ' : 'Piano Voicing Notes: '}</span>
                    <span className="text-[#dedacf]">{selectedChord.notes.join('  ·  ')}</span>
                  </div>
                  <div>
                    <span className="text-[#969183]">{isDe ? 'Grundfrequenzen: ' : 'Frequencies: '}</span>
                    {selectedChord.frequencies.map((f) => Math.round(f) + ' Hz').join(' · ')}
                  </div>
                </div>
              </div>

              {/* Right Column: Sensation & Pedagogical Breakdown */}
              <div className="lg:col-span-7 space-y-4 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-8">
                
                <div>
                  <h5 className="text-xs uppercase tracking-wider font-mono text-[#c49750] mb-1.5">
                    {isDe ? 'Wie es sich anfühlt (Sinnliche Wahrnehmung):' : 'How It Feels in the Body (Somatic Sensation):'}
                  </h5>
                  <p className="text-base text-[#dedacf] font-serif italic leading-relaxed">
                    “{isDe ? selectedChord.emotionalFeelingDe : selectedChord.emotionalFeeling}”
                  </p>
                </div>

                <div>
                  <h5 className="text-xs uppercase tracking-wider font-mono text-[#a78bfa] mb-1">
                    {isDe ? 'Akustisches Phänomen:' : 'Acoustic Phenomenon:'}
                  </h5>
                  <p className="text-xs sm:text-sm text-[#a8a499] font-light leading-relaxed">
                    {isDe ? selectedChord.acousticPhenomenonDe : selectedChord.acousticPhenomenon}
                  </p>
                </div>

                <div>
                  <h5 className="text-xs uppercase tracking-wider font-mono text-[#38bdf8] mb-1">
                    {isDe ? 'Musikalische Referenzen & Meisterwerke:' : 'Musical Context & Masterwork References:'}
                  </h5>
                  <p className="text-xs text-[#908c81] font-mono leading-relaxed">
                    {selectedChord.musicalReferences}
                  </p>
                </div>

              </div>

            </div>
          </div>

        </div>

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
