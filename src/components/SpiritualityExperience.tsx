import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Check, RotateCcw, Volume2, VolumeX, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface SpiritualityExperienceProps {
  isActive: boolean;
  onClose: () => void;
}

type Phase = 'negative' | 'rising' | 'splitting' | 'revealed';

export const SpiritualityExperience: React.FC<SpiritualityExperienceProps> = ({
  isActive,
  onClose
}) => {
  const { language } = useLanguage();
  const isDe = language === 'de';

  const [phase, setPhase] = useState<Phase>('negative');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play gentle Tibetan acoustic overtone
  const playSacredBell = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.22, now + 0.15);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 6.0);
      masterGain.connect(ctx.destination);

      [216, 432, 648, 864].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 1.5, now);

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(idx === 0 ? 0.8 : 0.25 / (idx + 1), now);
        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start(now);
        osc.stop(now + 6.0);
      });
    } catch (e) {
      console.warn('Audio unavailable', e);
    }
  };

  useEffect(() => {
    if (!isActive) {
      setPhase('negative');
      return;
    }

    // Doubled timing sequence:
    // 0ms - 4000ms: Negative color inversion across the site (4 full seconds)
    setPhase('negative');

    // 4000ms: Negative inversion settles -> Yin-Yang rises, turning (pure black & white)
    const timerRising = setTimeout(() => {
      setPhase('rising');
    }, 4000);

    // 7600ms (4000 + 3600): Reaches center -> splits along the S-curve line & colors bloom in!
    const timerSplitting = setTimeout(() => {
      setPhase('splitting');
      playSacredBell();
    }, 7600);

    // 10000ms (7600 + 2400): Text "who are you?" & manifesto fully unveiled with rich colors
    const timerRevealed = setTimeout(() => {
      setPhase('revealed');
    }, 10000);

    return () => {
      clearTimeout(timerRising);
      clearTimeout(timerSplitting);
      clearTimeout(timerRevealed);
    };
  }, [isActive]);

  const handleReplay = () => {
    setPhase('rising');
    setTimeout(() => {
      setPhase('splitting');
      playSacredBell();
    }, 3600);
    setTimeout(() => {
      setPhase('revealed');
    }, 6000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  if (!isActive) return null;

  const isPureBlackAndWhite = phase === 'rising';
  const isColorBloomed = phase === 'splitting' || phase === 'revealed';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] overflow-x-hidden overflow-y-auto"
      style={{
        // Transparent during the 4-second website inversion so the user watches the page colors turn negative!
        backgroundColor:
          phase === 'negative' ? 'transparent' : isPureBlackAndWhite ? '#000000' : 'rgba(5, 6, 9, 0.94)',
        transition: 'background-color 1500ms ease-in-out',
        backdropFilter: phase === 'negative' ? 'none' : 'blur(16px)'
      }}
    >
      {/* 4-Second Negative Inversion Indicator */}
      {phase === 'negative' && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-pulse">
          <div className="bg-black/90 text-white border border-[#c49750] px-6 py-3 rounded-full text-xs font-mono tracking-widest uppercase shadow-2xl flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c49750] animate-ping" />
            <span>Entering Inverted Consciousness (4s)...</span>
          </div>
        </div>
      )}

      {/* Top Floating Control Bar */}
      <div
        className={`fixed top-6 left-6 right-6 flex items-center justify-between z-50 transition-all duration-1000 ${
          phase === 'negative' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-mono uppercase tracking-[0.25em] px-3.5 py-1.5 rounded border transition-colors duration-1000 ${
              isPureBlackAndWhite
                ? 'bg-black text-white border-white/40 shadow-lg'
                : 'bg-black/80 text-[#d4af37] border-[#d4af37]/40 shadow-lg'
            }`}
          >
            Spirituality & Vibration
          </span>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded bg-black/70 border border-white/20 text-white/80 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5 shadow-md"
            title={soundEnabled ? 'Mute tone' : 'Enable tone'}
          >
            {soundEnabled ? (
              <Volume2 className={`w-3.5 h-3.5 ${isColorBloomed ? 'text-[#d4af37]' : 'text-white'}`} />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-white/40" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {isColorBloomed && (
            <button
              onClick={handleReplay}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono tracking-wider bg-white/10 hover:bg-white/20 border border-white/25 text-[#f5d58c] transition-colors cursor-pointer shadow-md"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Replay Awakening</span>
            </button>
          )}

          <button
            onClick={onClose}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all shadow-xl cursor-pointer ${
              isColorBloomed
                ? 'bg-white text-black hover:bg-[#d4af37]'
                : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Atelier (4s)</span>
          </button>
        </div>
      </div>

      {/* Central Awakening Viewport */}
      <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-16">
        
        {/* Yin & Yang Animation Core Container */}
        {phase !== 'negative' && (
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center my-6">
            
            {/* Ambient Aura Ring:
                STRICTLY INVISIBLE during the turning phase (pure black & white),
                then blooms into warm golden light when the animation completes/splits! */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/25 via-[#d4af37]/20 to-amber-500/25 blur-3xl pointer-events-none transition-all duration-1000"
              style={{
                opacity: isColorBloomed ? 1 : 0,
                transform: isColorBloomed ? 'scale(1.3)' : 'scale(0.8)'
              }}
            />

            {/* The Yin & Yang Symbol */}
            <div
              className="relative w-72 h-72 sm:w-80 sm:h-80"
              style={{
                animation: phase === 'rising' ? 'yinyangRiseAndTurn 3.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards' : 'none'
              }}
            >
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full overflow-visible transition-all duration-1000"
                style={{
                  // Pure white monochrome drop shadow while turning, blooms into golden radiance when split!
                  filter: isColorBloomed
                    ? 'drop-shadow(0 0 45px rgba(212, 175, 55, 0.55))'
                    : 'drop-shadow(0 0 30px rgba(255, 255, 255, 0.5))'
                }}
              >
                {/* Half 1: Yin (Left Half, Pure Black with Pure White Dot) */}
                <g
                  style={{
                    transformOrigin: '100px 100px',
                    animation:
                      isColorBloomed
                        ? 'splitYinLeft 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                        : 'none',
                    opacity: phase === 'revealed' ? 0.3 : 1,
                    transition: 'opacity 1.2s ease'
                  }}
                >
                  <path
                    d="M 100 10 A 90 90 0 0 0 100 190 A 45 45 0 0 1 100 100 A 45 45 0 0 0 100 10 Z"
                    fill="#000000"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  {/* Pure White Opposite Eye Dot */}
                  <circle cx="100" cy="55" r="13" fill="#ffffff" />
                </g>

                {/* Half 2: Yang (Right Half, Pure White with Pure Black Dot) */}
                <g
                  style={{
                    transformOrigin: '100px 100px',
                    animation:
                      isColorBloomed
                        ? 'splitYangRight 2.4s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                        : 'none',
                    opacity: phase === 'revealed' ? 0.3 : 1,
                    transition: 'opacity 1.2s ease'
                  }}
                >
                  <path
                    d="M 100 10 A 90 90 0 0 1 100 190 A 45 45 0 0 1 100 100 A 45 45 0 0 0 100 10 Z"
                    fill="#ffffff"
                    stroke="#000000"
                    strokeWidth="2"
                  />
                  {/* Pure Black Opposite Eye Dot */}
                  <circle cx="100" cy="145" r="13" fill="#000000" />
                </g>
              </svg>
            </div>

            {/* The Text Left Behind After Splitting: "who are you?" */}
            {isColorBloomed && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pointer-events-none z-30"
                style={{
                  animation: 'textRevealWhoAreYou 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                }}
              >
                <span className="text-xs font-mono uppercase tracking-[0.35em] text-[#d4af37] mb-2 drop-shadow">
                  {isDe ? 'Die Einfache Frage' : 'The Simple Question'}
                </span>
                <h1 className="text-5xl sm:text-7xl font-serif font-light text-white tracking-tight drop-shadow-[0_4px_30px_rgba(255,255,255,0.7)]">
                  {isDe ? 'wer bist du?' : 'who are you?'}
                </h1>
                <div className="w-20 h-[1.5px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent my-3.5" />
                <p className="text-xs sm:text-sm font-serif italic text-[#dedacf] max-w-xs font-light drop-shadow">
                  {isDe ? 'Jenseits der Noten, der Technik und der Persona.' : 'Beyond the notes, the technique, and the persona.'}
                </p>
              </div>
            )}

          </div>
        )}

        {/* Revealed Philosophical Manifesto & YouTube Series Preview */}
        {phase === 'revealed' && (
          <div className="w-full max-w-2xl bg-[#0f1118]/95 border border-[#382d23] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-4 text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span className="text-xs uppercase font-mono tracking-widest text-[#d4af37]">
                  {isDe ? 'Spiritualität durch Musik (Demnächst)' : 'Spirituality Through Music (Coming Soon)'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-white/50">{isDe ? 'In Arbeit' : 'In Progress'}</span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#c8c4b7] font-light leading-relaxed">
              <div className="p-4 bg-white/[0.04] border-l-2 border-[#d4af37] rounded-r-lg">
                <p className="text-sm font-serif italic text-white">
                  {isDe ? (
                    <>
                      &ldquo;Im Musikunterricht lautet die Frage: <span className="text-[#d4af37]">Wie berührt mich diese Musik?</span>
                      <br />
                      Hier stellen wir die tiefere Frage: <span className="text-[#d4af37]">Warum berührt sie mich genau so?</span>&rdquo;
                    </>
                  ) : (
                    <>
                      &ldquo;In my music lessons, we ask: <span className="text-[#d4af37]">How does this music affect me?</span>
                      <br />
                      Here, we ask the deeper question: <span className="text-[#d4af37]">Why does it affect me that way?</span>&rdquo;
                    </>
                  )}
                </p>
              </div>

              <p>
                {isDe
                  ? 'Ich habe Jahrzehnte auf den großen Opernbühnen Europas gesungen, mit achtzig Musikern im Graben, und miterlebt, wie tausende Menschen beim exakt selben Akkord gleichzeitig zu Tränen gerührt waren.'
                  : 'I spent decades singing in European opera houses with eighty musicians playing in the pit, watching thousands of people cry together to the exact same chord.'}
              </p>

              <p>
                {isDe
                  ? 'Zunächst denkt man, es sei bloß Stimmtechnik oder Biologie. Doch je aufmerksamer man dem Klang lauscht, desto klarer wird: Musik ist weder bloße Unterhaltung noch Dekoration. Sie berührt etwas in unserem Innersten, das Worte niemals erreichen können.'
                  : 'At first, you think it is just technique or biology. But the more you pay attention to sound, the more you realize: music is not just entertainment or decoration. It touches something deep inside all of us that words cannot reach.'}
              </p>

              {/* YouTube Episodes Roadmap */}
              <div className="pt-2">
                <div className="text-xs font-mono uppercase text-[#d4af37] tracking-wider mb-2 font-medium">
                  {isDe ? 'Die kommende YouTube-Serie:' : 'The Upcoming YouTube Series:'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-black/50 border border-white/10 rounded-lg">
                    <div className="font-mono text-[#d4af37] text-[10px] mb-1">{isDe ? 'TEIL 01' : 'PART 01'}</div>
                    <strong className="text-white block mb-1">{isDe ? 'Wer bin ich wirklich?' : 'Who Am I Really?'}</strong>
                    <span className="text-[11px] text-[#9c978b] leading-tight block">
                      {isDe
                        ? 'Das wahre Selbst hinter dem Sänger und Pädagogen – ganz ohne Maske oder Attitüde.'
                        : 'The real me behind the singer and teacher, without costumes or pretension.'}
                    </span>
                  </div>

                  <div className="p-3 bg-black/50 border border-white/10 rounded-lg">
                    <div className="font-mono text-[#d4af37] text-[10px] mb-1">{isDe ? 'TEIL 02' : 'PART 02'}</div>
                    <strong className="text-white block mb-1">{isDe ? 'Gute & schlechte Musik?' : 'What is Good & Bad Music?'}</strong>
                    <span className="text-[11px] text-[#9c978b] leading-tight block">
                      {isDe
                        ? 'Jenseits von Snobismus: Was macht Musik wahrhaft ehrlich gegenüber leeren Klischees?'
                        : 'Beyond snobbery: what makes music honest versus empty clichés.'}
                    </span>
                  </div>

                  <div className="p-3 bg-black/50 border border-white/10 rounded-lg">
                    <div className="font-mono text-[#d4af37] text-[10px] mb-1">{isDe ? 'TEIL 03' : 'PART 03'}</div>
                    <strong className="text-white block mb-1">{isDe ? 'Der spirituelle Resonanzraum' : 'The Spiritual Rabbit Hole'}</strong>
                    <span className="text-[11px] text-[#9c978b] leading-tight block">
                      {isDe
                        ? 'Wie Singen und das tiefe Lauschen auf Frequenzen meine Sicht auf die Wirklichkeit verändert haben.'
                        : 'How singing and listening to sound made me question everything about reality.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Premiere Waitlist */}
            <div className="mt-8 pt-6 border-t border-white/10">
              {subscribed ? (
                <div className="p-4 bg-[#14231b] border border-[#2d5a3c] rounded-xl flex items-center gap-3 text-xs text-[#98e2b0]">
                  <Check className="w-5 h-5 text-[#22c55e] shrink-0" />
                  <div>
                    <strong className="block font-medium">{isDe ? 'Sie stehen auf der exklusiven Premierenliste.' : 'You are on the private premiere list.'}</strong>
                    {isDe ? 'Sie erhalten eine Einladung, sobald das Einführungsvideo auf YouTube erscheint.' : 'You will receive an invitation when the introductory video drops on YouTube.'}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <label className="block text-xs uppercase tracking-wider text-[#8e8b80] font-mono">
                    {isDe ? 'Benachrichtigen, sobald die YouTube-Serie & der Essay erscheinen:' : 'Notify me when the YouTube series & introductory essay release:'}
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={isDe ? 'Ihre E-Mail-Adresse...' : 'Enter your email address...'}
                      className="flex-1 px-4 py-2.5 bg-black/70 border border-white/15 rounded text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#d4af37]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#d4af37] hover:bg-[#e8c35d] rounded transition-all cursor-pointer whitespace-nowrap shadow-lg"
                    >
                      {isDe ? 'Auf Premierenliste eintragen' : 'Join Premiere Waitlist'}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#8c887d]">
              <span>Vérisme Atelier · Sacred Acoustics</span>
              <button
                onClick={onClose}
                className="text-[#d4af37] hover:underline flex items-center gap-1 cursor-pointer font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isDe ? 'Zurück zum Atelier (4s Übergang)' : 'Return to Atelier (4s Transition)'}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
