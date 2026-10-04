import React, { useState, useRef } from 'react';
import { Volume2, VolumeX, Waves } from 'lucide-react';

interface HarmonicExample {
  id: string;
  name: string;
  technicalNote: string;
  frequencies: number[];
  feelingTitle: string;
  simpleExplanation: string;
  songExample: string;
  whyYouFeelIt: string;
}

const HARMONIC_PRESETS: HarmonicExample[] = [
  {
    id: 'minor-sixth',
    name: 'The Sad Pull',
    technicalNote: 'Minor 6th interval',
    frequencies: [261.63, 415.30],
    feelingTitle: 'A sad, bittersweet pull',
    simpleExplanation: 'Notice how this interval immediately pulls downward with a sigh? You feel an emotional ache right away. Opera composers like Verdi use this whenever a character has a broken heart.',
    songExample: 'La Traviata (Addio del passato), Chopin Nocturnes',
    whyYouFeelIt: 'Your ear instinctively feels the sound leaning down toward a resting note, like a heavy sigh.'
  },
  {
    id: 'impressionist-ninth',
    name: 'The Floating Cloud',
    technicalNote: 'Major 9th chord',
    frequencies: [261.63, 329.63, 392.00, 493.88, 587.33],
    feelingTitle: 'Weightless and peaceful',
    simpleExplanation: 'Your shoulders drop. There is no rush to go anywhere. French composers like Debussy and Ravel loved this sound because it floats in the air like perfume instead of following boring rules.',
    songExample: 'Debussy (Clair de lune), Ravel (Pavane), modern Neo-Soul and Lofi beats',
    whyYouFeelIt: 'The frequencies blend together gently without harsh clashes, giving your brain a sense of space and color.'
  },
  {
    id: 'tritone-tension',
    name: 'The Cliffhanger',
    technicalNote: 'Tritone (tension interval)',
    frequencies: [261.63, 369.99],
    feelingTitle: 'Unsettling and alert',
    simpleExplanation: 'Your ear immediately braces. It feels like someone paused a suspenseful movie right before something happens. You don’t need any theory to know this sound needs to resolve somewhere safe.',
    songExample: 'Saint-Saëns (Danse Macabre), West Side Story (Maria opening)',
    whyYouFeelIt: 'The sound waves clash slightly, which naturally triggers alertness in the human brain.'
  },
  {
    id: 'pure-fifth',
    name: 'The Solid Ground',
    technicalNote: 'Clean 5th interval',
    frequencies: [261.63, 392.00],
    feelingTitle: 'Calm and steady',
    simpleExplanation: 'Clear, open, and solid. It doesn’t smile and it doesn’t cry—it just gives you a firm foundation, like standing on solid stone.',
    songExample: 'Ancient chant, acoustic strings ringing open, Star Wars theme opening',
    whyYouFeelIt: 'The mathematical vibration ratio is extremely simple and clean, matching how our vocal cords naturally resonate.'
  }
];

export const HarmonicExperienceDemo: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasListened, setHasListened] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<OscillatorNode[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activePreset = HARMONIC_PRESETS.find((p) => p.id === selectedId) || HARMONIC_PRESETS[0];

  const stopAudio = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    activeNodesRef.current.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Ignore
      }
    });
    activeNodesRef.current = [];
    setIsPlaying(false);
  };

  const playFrequencies = (freqs: number[]) => {
    stopAudio();

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }

      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const duration = 3.2; // automatically stops after ~3.2 seconds
      const startTime = ctx.currentTime;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, startTime);
      masterGain.gain.linearRampToValueAtTime(0.18 / freqs.length, startTime + 0.1);
      masterGain.gain.setValueAtTime(0.18 / freqs.length, startTime + 1.8);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      masterGain.connect(ctx.destination);

      const newOscs: OscillatorNode[] = freqs.map((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = i === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, startTime);
        if (i > 0) {
          osc.detune.setValueAtTime((Math.random() - 0.5) * 6, startTime);
        }

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(1.0, startTime);
        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start(startTime);
        osc.stop(startTime + duration);
        return osc;
      });

      activeNodesRef.current = newOscs;
      setIsPlaying(true);

      timerRef.current = setTimeout(() => {
        setIsPlaying(false);
      }, duration * 1000);
    } catch (err) {
      console.warn('Web Audio error:', err);
      setIsPlaying(false);
    }
  };

  const handleSelect = (preset: HarmonicExample) => {
    setSelectedId(preset.id);
    setHasListened(true);
    playFrequencies(preset.frequencies);
  };

  return (
    <div className="bg-[#12151c] rounded-2xl border border-[#272b35] p-6 sm:p-8 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#21242d] gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#c49750] font-medium mb-1">
            <Waves className="w-3.5 h-3.5" />
            <span>Interactive Hearing Test</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif text-[#f4f2ec] font-normal">
            Try it: Feel the sound before naming the note
          </h3>
        </div>

        <div className="text-xs text-[#8c887d]">
          Click each sound to hear how it feels:
        </div>
      </div>

      {/* Preset Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-6">
        {HARMONIC_PRESETS.map((preset) => {
          const isSelected = preset.id === selectedId;
          return (
            <button
              key={preset.id}
              onClick={() => handleSelect(preset)}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#1e232f] border-[#c49750] text-[#f7f5f0] shadow-md'
                  : 'bg-[#151820] border-[#222630] text-[#a5a195] hover:border-[#383d4c] hover:text-[#dedacf]'
              }`}
            >
              <div className="text-[11px] font-mono text-[#c49750] mb-0.5">
                {preset.technicalNote}
              </div>
              <div className="text-xs font-medium">{preset.name}</div>
            </button>
          );
        })}
      </div>

      {/* Detail Showcase: Hidden until user clicks a sound */}
      {!hasListened ? (
        <div className="bg-[#0b0c0e] rounded-xl p-8 border border-[#1f222a] text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#161a22] text-[#c49750] flex items-center justify-center mx-auto border border-[#2b3040]">
            <Volume2 className="w-5 h-5" />
          </div>
          <h4 className="text-base font-serif text-[#f2eee9]">
            Listen with your ear first
          </h4>
          <p className="text-xs text-[#959184] max-w-md mx-auto leading-relaxed">
            Click any of the 4 sounds above to listen. The emotional and harmonic breakdown will appear here once you feel the sound.
          </p>
        </div>
      ) : (
        <div className="bg-[#0b0c0e] rounded-xl p-5 sm:p-6 border border-[#1f222a] transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-xs text-[#888478]">
                Sound: <span className="text-[#dedacf]">{activePreset.name}</span> ({activePreset.technicalNote})
              </div>
              <div className="text-lg font-serif text-[#f2eee9] mt-0.5 font-medium">
                {activePreset.feelingTitle}
              </div>
            </div>

            <button
              onClick={() => {
                if (isPlaying) {
                  stopAudio();
                } else {
                  playFrequencies(activePreset.frequencies);
                }
              }}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-[#c49750] text-black shadow-lg animate-pulse'
                  : 'bg-[#1c202a] hover:bg-[#252b39] text-[#f2eee9] border border-[#2d323f]'
              }`}
            >
              {isPlaying ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Stop Sound</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#c49750]" />
                  <span>Play Again</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-2.5 text-xs sm:text-sm text-[#b5b1a4] leading-relaxed pt-3 border-t border-white/5 font-light">
            <p>
              <strong className="text-[#e2ded5] font-normal block mb-1">
                What your ear feels:
              </strong>
              {activePreset.simpleExplanation}
            </p>

            <p className="text-xs text-[#9c978b]">
              <strong className="text-[#c49750] font-normal">Where you can hear this: </strong>
              {activePreset.songExample}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 text-center text-xs text-[#787469]">
        Once you recognize the feeling of these sounds with your ears, reading music or producing beats becomes ten times faster.
      </div>
    </div>
  );
};
