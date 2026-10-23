import React, { useState } from 'react';
import { 
  Mic, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Flame, 
  CheckCircle2, 
  ArrowRight, 
  Radio, 
  Lock,
  Award,
  Layers,
  Sliders,
  Check,
  X as XIcon,
  Volume2,
  Headphones
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import pianoStudioMicImg from '../assets/images/piano_studio_mic_1792754629403.jpg';

interface ContemporaryVocalCoachingProps {
  onOpenInquiry: (topic: string) => void;
  onScrollToClassical?: () => void;
}

export const ContemporaryVocalCoaching: React.FC<ContemporaryVocalCoachingProps> = ({ 
  onOpenInquiry,
  onScrollToClassical 
}) => {
  const { language, t } = useLanguage();
  const cv = t.contemporaryVocal;
  const isDe = language === 'de';

  const [activeTab, setActiveTab] = useState<'myth' | 'pillars' | 'pathways'>('myth');

  const contrastItems = [
    {
      topic: isDe ? 'Körperhaltung & Bühnengefühl' : 'Posture & Stage Freedom',
      fear: isDe 
        ? 'Starre, unbewegliche Opernhaltung, die den modernen Vibe und die Beweglichkeit auf der Bühne zerstört.' 
        : 'Stiff, rigid operatic stance that kills your natural modern stage presence and relaxed vibe.',
      reality: isDe 
        ? 'Vollkommen entspannter Nacken, lockerer Kiefer und tiefes Zwerchfell-Fundament. Der Körper trägt die Last – die Kehle bleibt federleicht und frei.' 
        : 'Weightless neck, completely loose jaw, and deep pelvic-diaphragmatic support. The body carries the load; your throat is 100% free.',
      highlight: isDe ? 'Null Steifheit · Maximale Beweglichkeit' : 'Zero Stiffness · Pure Natural Movement'
    },
    {
      topic: isDe ? 'Vibrato & Zeitgenössisches Phrasing' : 'Vibrato & Modern Phrasing',
      fear: isDe 
        ? 'Aufgedrücktes, schweres Dauervibrato, das Pop-, R&B- oder Indie-Hooks altbacken klingen lässt.' 
        : 'Heavy, artificial, perpetual wobble/vibrato that ruins contemporary pop, R&B, or indie hooks.',
      reality: isDe 
        ? 'Kristallklarer Straight-Tone für intime Mikrofon-Takes. Vibrato wird zu einer bewussten, emotionalen Klangfarbe, die Sie nur dort einsetzen, wo Sie wollen.' 
        : 'Pristine modern straight-tone for intimate microphone proximity. Vibrato becomes a deliberate artistic color used only when and where you choose.',
      highlight: isDe ? 'Intimer Straight-Tone · Kontrolliertes Timbre' : 'Intimate Straight-Tone · Intentional Color'
    },
    {
      topic: isDe ? 'Akustik & Studio-Kondensatormikrofon' : 'Acoustics & Studio Condenser Mics',
      fear: isDe 
        ? 'Dunkle, klobige Vokale, die für ungeklingelte Säle gedacht sind, aber vor dem Mikrofon dumpf klingen.' 
        : 'Cavernous classical vowels designed to project over 90 instruments without a microphone.',
      reality: isDe 
        ? 'Dynamische Epilarynx-Kompression: Laser-fokussierte Vokale, die sich mühelos gegen schwere Bässe, Synths und Gitarren durchsetzen – ohne zu brüllen.' 
        : 'Epilaryngeal acoustic focus: Laser-sharp resonance tailored for studio mics, slicing effortlessly through 808s and heavy productions without screaming.',
      highlight: isDe ? 'Studioreife Präsenz · Mühelose Durchsetzung' : 'Radio-Ready Presence · Effortless Cut'
    },
    {
      topic: isDe ? 'Ihre Einzigartige Künstler-Identität' : 'Your Authentic Artistic Identity',
      fear: isDe 
        ? 'Verlust des eigenen rauen, persönlichen Sounds durch überkorrekte akademische Glättung.' 
        : 'Losing your raw, idiosyncratic, signature edge to a sterile, academic classical mold.',
      reality: isDe 
        ? 'Ihr individueller Klangcharakter bleibt zu 100 % erhalten. Wir geben ihm lediglich den athletischen Motor, damit Sie 40 Shows ohne Heiserkeit singen.' 
        : 'Your unique tone is sacred and untouched. We simply build the athletic engine beneath it so you can perform 40 shows with zero hoarseness.',
      highlight: isDe ? 'Authentischer Sound · Unzerstörbare Basis' : 'Untouched Identity · Indestructible Engine'
    }
  ];

  const pillars = [
    {
      icon: Activity,
      badge: cv.roleTeacher.badge,
      title: cv.roleTeacher.title,
      desc: cv.roleTeacher.desc,
      feature: isDe 
        ? 'Ein tief kultiviertes Atem- und Muskelsystem trägt die Stimme durch anstrengende Probenwochen und endlose Stunden des Singens.' 
        : 'A deeply cultivated muscular and breathing system cushions the vocal folds through weeks of rehearsals and endless hours of singing.',
      accent: 'border-blue-500/30'
    },
    {
      icon: Flame,
      badge: cv.roleCoach.badge,
      title: cv.roleCoach.title,
      desc: cv.roleCoach.desc,
      feature: isDe 
        ? 'Gefühle ganzheitlich erfassen, ohne dass die Kehle zuschnürt: Wir lernen, Emotionen tief zu spüren und sie frei ans Publikum weiterzuleiten.' 
        : 'Feeling raw emotion deeply without letting it constrict the voice: Connecting with truth and cleanly relaying it to the audience.',
      accent: 'border-rose-500/30'
    },
    {
      icon: ShieldCheck,
      badge: cv.roleSpecialist.badge,
      title: cv.roleSpecialist.title,
      desc: cv.roleSpecialist.desc,
      feature: isDe 
        ? 'Wenn Erschöpfung oder Erkältungen auf Tour eintreten, übernimmt der Körper automatisch die Last. Der Kehlkopf bleibt druckfrei – null Knötchen.' 
        : 'When exhaustion or colds strike on tour, the body automatically absorbs the load. The throat stays pressure-free—zero vocal nodules.',
      accent: 'border-[#c49750]/50'
    }
  ];

  const pathways = [
    {
      badge: isDe ? '1:1 DIAGNOSE' : '1:1 DIAGNOSTIC',
      title: isDe ? '45-Minuten Stimm-Biomechanik-Diagnose' : '45-Minute Biomechanical Diagnostic',
      subtitle: isDe ? 'Erkennung technischer Engpässe in 15 Min.' : '15-min bottleneck audit & vocal roadmap',
      desc: isDe 
        ? 'Präzisions-Analyse Ihrer Kehlkopfspannung, Atem-Entkopplung und akustischen Kompression mit sofortigem Fahrplan.'
        : 'Rapid precision audit of laryngeal tension, subglottic air pressure, and acoustic compression with an immediate custom roadmap.',
      points: isDe ? [
        'Analyse von subglottischem Druck & Registerbrüchen',
        'Prüfung von Epilarynx-Kompression & Belt-Resonanz',
        'Direkter Fahrplan für mühelosen Stimmumfang'
      ] : [
        'Subglottic air pressure & register break diagnosis',
        'Epilaryngeal compression & belt resonance testing',
        'Actionable roadmap for effortless, safe range'
      ],
      topic: '45-Minute Biomechanical Vocal Diagnostic (Pop, R&B, Rock, Modern Styles)',
      cta: isDe ? 'Diagnose buchen' : 'Book Diagnostic',
      highlight: false
    },
    {
      badge: isDe ? 'STUDIO & TOUR RETAINER' : 'STUDIO & TOUR RETAINER',
      title: isDe ? 'On-Call Vocal Producer & Tour Sanctuary' : 'Vocal Producer & Tour Sanctuary',
      subtitle: isDe ? 'Studiowochen-Schutz & Tour-Ausdauer' : 'Studio session preservation & tour stamina',
      desc: isDe 
        ? 'Vertrauliche Begleitung bei albumweiten Gesangsaufnahmen und anspruchsvollen Tourneen. Frische Takes vom ersten bis zum 40. Auftritt.'
        : 'Confidential session preservation for multi-day album tracking and demanding multi-city tours. Fresh, radiant takes from opening night to show 40.',
      points: isDe ? [
        'Pre-Tracking Dekompression & Formanten-Abstimmung',
        'Mikro-Resets zwischen Gesangspässen im Studio',
        '15-Minuten-Backstage-Notfallprotokoll auf Tour'
      ] : [
        'Pre-tracking laryngeal reset & formant tuning',
        'Take-by-take micro resets during studio passes',
        '15-minute backstage emergency tour recovery'
      ],
      topic: 'Studio Tracking Week Retainer (On-Call Vocal Producer & Tracking Alchemist)',
      cta: isDe ? 'Retainer anfragen' : 'Inquire for Retainer',
      highlight: true
    },
    {
      badge: isDe ? '12-WOCHEN INTENSIV' : '12-WEEK INTENSIVE',
      title: isDe ? 'Privates High-Performance Mentoring' : '12-Week Private Vocal Mentorship',
      subtitle: isDe ? '3 Phasen: Physik, Belting & Transzendenz' : '3 phases: Mechanics, belting & transcendence',
      desc: isDe 
        ? 'Tiefgreifende Einzelförderung: Vollkommene Souveränität über das eigene Instrument, von anatomischer Basis bis zu rückhaltloser Bühnenmagie.'
        : 'Transformative one-on-one journey: Complete sovereignty over your instrument, from structural physics to uninhibited artistic fire.',
      points: isDe ? [
        'Phase 1: Italienisches Appoggio & Kehlkopf-Freiheit',
        'Phase 2: Moderner Arena-Belt & gesunde Texturen',
        'Phase 3: Tournee-Konditionierung & „The Zone“'
      ] : [
        'Phase 1: Italian Appoggio & laryngeal freedom',
        'Phase 2: Modern stadium belt & healthy textures',
        'Phase 3: Tour conditioning & entering "The Zone"'
      ],
      topic: '12-Week High-Performance Vocal Mentorship',
      cta: isDe ? 'Mentoring anfragen' : 'Apply for Mentorship',
      highlight: false
    }
  ];

  return (
    <section 
      id="vocal-coaching" 
      className="py-20 px-4 sm:px-6 bg-gradient-to-b from-[#0b0c0e] via-[#0e1118] to-[#0b0c0e] border-t border-[#1e2330] relative overflow-hidden"
    >
      {/* Anchor for alternate #singing links */}
      <div id="singing" className="absolute -top-24 left-0 pointer-events-none" />

      {/* Subtle ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c49750]/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        
        {/* ==================================================================== */}
        {/* HERO SHOWCASE CARD: Modern Atelier Photography + Microphone Concept */}
        {/* ==================================================================== */}
        <div className="mb-14 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#151722] via-[#10121a] to-[#0c0d12] border border-[#c49750]/30 shadow-2xl overflow-hidden relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Visual Column: Grand Piano Keys & Studio Condenser Mic with Creamy Bokeh */}
            <div className="lg:col-span-6 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[500px] overflow-hidden group">
              <img
                src={pianoStudioMicImg}
                alt="Classical grand piano keyboard leading into deep bokeh with a studio condenser microphone on shockmount"
                className="w-full h-full object-cover object-center lg:object-left-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                loading="eager"
                referrerPolicy="no-referrer"
              />

              {/* Gradient Scrims: Seamless edge blending for desktop and mobile */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#10121a] via-transparent to-transparent lg:hidden" />
              <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#10121a]" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0b0c0e]/40 via-transparent to-[#0b0c0e]/40 pointer-events-none" />

              {/* Floating Perspective Badge */}
              <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10 flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-mono text-[#dcd7cb]">
                <Headphones className="w-3.5 h-3.5 text-[#c49750]" />
                <span>
                  {isDe 
                    ? 'Klassische Physik · Modernes Mikrofon' 
                    : 'Classical Physics · Modern Microphone'}
                </span>
              </div>
            </div>

            {/* Content Column: The Antidote to "Opera Stiffness" */}
            <div className="lg:col-span-6 p-6 sm:p-9 lg:p-12 flex flex-col justify-between relative z-10">
              
              <div>
                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181d2c] border border-[#c49750]/40 text-[11px] uppercase tracking-[0.2em] text-[#d8a85c] font-mono mb-4 shadow-sm">
                  <Mic className="w-3.5 h-3.5 text-[#c49750]" />
                  <span>
                    {isDe 
                      ? 'GESANGSCOACHING FÜR MODERNE KÜNSTLER' 
                      : 'CONTEMPORARY VOCAL COACHING'}
                  </span>
                </div>

                {/* Primary Headline */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#fbf9f5] font-normal leading-tight mb-4">
                  {isDe ? (
                    <>
                      Klassisches Fundament.{' '}
                      <span className="text-[#c49750] italic font-light block sm:inline">
                        Null Opern-Steifheit.
                      </span>
                    </>
                  ) : (
                    <>
                      Classical Foundations.{' '}
                      <span className="text-[#c49750] italic font-light block sm:inline">
                        Zero Operatic Stiffness.
                      </span>
                    </>
                  )}
                </h2>

                {/* Subtitle / Positioning */}
                <p className="text-xs sm:text-sm text-[#c7c2b5] leading-relaxed mb-5 font-light">
                  {isDe ? (
                    <>
                      Pop, R&amp;B, Rock, Indie und Jazz leben von roher Wahrhaftigkeit, intimen Atemgeräuschen und natürlicher Direktheit. Viele zeitgenössische Sänger fürchten, dass klassisches Gesangstraining ihre Stimme starr, pathetisch oder künstlich macht. <strong>Das Gegenteil ist der Fall:</strong>
                    </>
                  ) : (
                    <>
                      Pop, R&amp;B, Rock, Indie, and Jazz thrive on raw vulnerability, intimate breath, and conversational grit. Many modern vocalists avoid classical training because they fear it will force them into stiff, rigid postures and unnatural operatic vibrato. <strong>The reality is the exact opposite:</strong>
                    </>
                  )}
                </p>

                {/* Core Philosophy Callout */}
                <div className="p-4 rounded-xl bg-[#0b0e14]/90 border border-white/10 mb-6">
                  <blockquote className="text-xs sm:text-sm font-serif italic text-[#e6e2d8] leading-relaxed mb-2">
                    {isDe ? (
                      <>
                        „Vor dem Mikrofon ist die Lautstärke bereits gelöst. Sie müssen kein 90-köpfiges Orchester übertönen. Klassische Biomechanik ist kein Stil – sie ist der anatomische Schutzschild, der Ihre Kehle vollkommen entlastet, damit Sie intim flüstern oder im Stadion belten können, ohne je Heiserkeit oder Knötchen zu riskieren.“
                      </>
                    ) : (
                      <>
                        “In front of a studio microphone, volume is already solved. You never need to blast over an unamplified 90-piece orchestra. Classical biomechanics is not a stylistic mold—it is the anatomical armor that keeps your throat 100% loose, so you can whisper intimate hooks or belt stadium anthems with zero strain and zero nodules.”
                      </>
                    )}
                  </blockquote>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-[#c49750]">
                    — Abdellah Lasri · CNSMDP Paris · 20+ Jahre internationale Opernbühnen
                  </div>
                </div>

                {/* Bullet Strengths */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#cfcac0] font-mono mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#c49750] shrink-0" />
                    <span>{isDe ? 'Erhalt Ihres eigenen Sounds' : '100% Authentic Vocal Identity'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#c49750] shrink-0" />
                    <span>{isDe ? 'Federleichte Nacken-Freiheit' : 'Weightless Larynx & Neck Freedom'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#c49750] shrink-0" />
                    <span>{isDe ? 'Müheloser moderner Mix & Belt' : 'Effortless Modern Mix & Belt'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#c49750] shrink-0" />
                    <span>{isDe ? 'Tour-Ausdauer & Null Knötchen' : '40-Date Tour Stamina & Zero Nodules'}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => onOpenInquiry('45-Minute Biomechanical Vocal Diagnostic (Pop, R&B, Rock, Modern Styles)')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#c49750] to-[#d8a85c] hover:from-[#d8a85c] hover:to-[#e8ba6e] text-black text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c49750]/20 cursor-pointer"
                >
                  <span>{isDe ? 'Diagnose buchen' : 'Book Diagnostic'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('modern-singing-comparison');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#161a25] hover:bg-[#1e2334] text-white border border-white/10 hover:border-[#c49750]/40 text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#c49750]" />
                  <span>{isDe ? 'Opern-Mythos vs. Realität' : 'The Myth vs. Reality'}</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* ==================================================================== */}
        {/* SECTION 2: BUSTING THE "STIFF OPERA" MYTH VS. MODERN REALITY          */}
        {/* ==================================================================== */}
        <div id="modern-singing-comparison" className="mb-16">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#181d2a] border border-[#c49750]/30 text-[10px] font-mono uppercase tracking-widest text-[#c49750] mb-3">
              <Sliders className="w-3 h-3" />
              <span>{isDe ? 'DAS ANATOMISCHE PRINZIP' : 'THE BIOMECHANICAL CONTRAST'}</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-serif text-[#fcfbfa] font-normal mb-3">
              {isDe 
                ? 'Warum moderne Sänger keine Angst vor Opern-Technik haben müssen' 
                : 'Why Modern Singers Never Need to Fear Classical Technique'}
            </h3>
            <p className="text-xs sm:text-sm text-[#a8a396] font-light leading-relaxed">
              {isDe 
                ? 'Klassische Technik ist kein Stilgefängnis. Sie ist das universelle Gesetz, wie der menschliche Körper Töne erzeugt, ohne sich selbst zu verletzen.' 
                : 'Classical technique is not a stylistic prison. It is the universal law of how the human instrument sustains phonation without self-harm.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {contrastItems.map((item, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-2xl bg-[#10131d] border border-white/10 hover:border-[#c49750]/40 transition-all shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Topic Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                    <span className="text-sm font-serif text-white font-medium">
                      {item.topic}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#c49750]/15 text-[#d8a85c] border border-[#c49750]/20">
                      {item.highlight}
                    </span>
                  </div>

                  {/* The Fear / Myth */}
                  <div className="mb-4 p-3 rounded-xl bg-[#1b1517] border border-rose-500/20 text-xs">
                    <div className="flex items-center gap-2 text-rose-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                      <XIcon className="w-3.5 h-3.5 shrink-0" />
                      <span>{isDe ? 'Die Angst / Das Klischee' : 'The Common Fear / Myth'}</span>
                    </div>
                    <p className="text-[#d8cfcf] leading-relaxed">
                      {item.fear}
                    </p>
                  </div>

                  {/* The Reality */}
                  <div className="p-3 rounded-xl bg-[#101b17] border border-emerald-500/20 text-xs">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono text-[10px] uppercase tracking-wider mb-1">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      <span>{isDe ? 'Die biomechanische Realität' : 'The Biomechanical Reality'}</span>
                    </div>
                    <p className="text-[#d0dfd8] leading-relaxed">
                      {item.reality}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-[#a5a093] flex items-center gap-2">
                  <Volume2 className="w-3.5 h-3.5 text-[#c49750]" />
                  <span>
                    {isDe 
                      ? 'Geeignet für Studio-Takes, Tourneen und Live-Gigs' 
                      : 'Tailored for studio tracking, live sets & world tours'}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ==================================================================== */}
        {/* SECTION 3: THE EMOTIONAL PARADOX & CREDO                            */}
        {/* ==================================================================== */}
        <div className="mb-16 rounded-2xl bg-gradient-to-br from-[#181510]/95 via-[#12151f] to-[#0f121a] border border-[#c49750]/40 p-6 sm:p-9 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#c49750]/15 border border-[#c49750]/30 text-[11px] font-mono uppercase tracking-widest text-[#d8a85c] mb-4">
              <Award className="w-3.5 h-3.5 text-[#c49750]" />
              <span>{cv.credoTagline}</span>
            </div>

            <blockquote className="text-base sm:text-xl font-serif italic text-[#fcfbfa] leading-relaxed mb-6">
              “{cv.credoQuote}”
            </blockquote>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-white/10 text-xs font-mono text-[#a8a396]">
              <span className="flex items-center gap-1.5 text-[#c49750]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isDe ? 'Geprüfte Stimmgesundheit · Null Knötchen' : 'Proven Vocal Health · Zero Nodules'}
              </span>
              <span className="hidden sm:inline text-white/20">·</span>
              <span className="flex items-center gap-1.5 text-[#c49750]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isDe ? 'Muskuläre Basis & Atemsystem' : 'Muscular Foundation & Breathing System'}
              </span>
              <span className="hidden sm:inline text-white/20">·</span>
              <span className="flex items-center gap-1.5 text-[#c49750]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isDe ? 'Gefühle tief spüren & frei übertragen' : 'Deep Emotional Connection & Free Relay'}
              </span>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SECTION 4: THE 3 PILLARS OF MASTERY                                  */}
        {/* ==================================================================== */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#c49750] mb-1 block">
              {cv.roleBadge}
            </span>
            <h3 className="text-xl sm:text-2xl font-serif text-white font-normal">
              {cv.roleTitle}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pillars.map((pillar, idx) => {
              const IconComp = pillar.icon;
              return (
                <div 
                  key={idx}
                  className={`p-6 rounded-xl bg-[#10131d] border ${pillar.accent} hover:border-[#c49750]/60 transition-all flex flex-col justify-between group shadow-lg`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded bg-[#181d2a] text-[#c49750] border border-[#c49750]/20 uppercase">
                        {pillar.badge}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-[#181d2a] border border-white/5 flex items-center justify-center text-[#c49750] group-hover:scale-105 transition-transform">
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>

                    <h4 className="text-base font-serif text-white font-medium mb-2">
                      {pillar.title}
                    </h4>

                    <p className="text-xs text-[#a49f92] leading-relaxed mb-4">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-[#cfcac0]">
                    {pillar.feature}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SECTION 5: THE 3 PATHWAYS TO WORK TOGETHER                          */}
        {/* ==================================================================== */}
        <div className="mb-12">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#c49750] mb-1 block">
              {cv.retainersBadge}
            </span>
            <h3 className="text-xl sm:text-2xl font-serif text-white font-normal mb-2">
              {cv.retainersTitle}
            </h3>
            <p className="text-xs text-[#9c978b]">
              {cv.retainersSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {pathways.map((path, idx) => (
              <div 
                key={idx}
                className={`p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 ${
                  path.highlight
                    ? 'bg-gradient-to-b from-[#181d2c] via-[#121622] to-[#10121a] border-2 border-[#c49750] shadow-2xl relative'
                    : 'bg-[#10131d] border border-[#232736] hover:border-[#c49750]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono tracking-widest px-2.5 py-1 rounded bg-[#181d2a] text-[#c49750] border border-white/5 uppercase">
                      {path.badge}
                    </span>
                    {path.highlight && (
                      <span className="text-[10px] font-mono bg-[#c49750] text-black font-bold px-2 py-0.5 rounded">
                        ★ {isDe ? 'POPULÄR' : 'FEATURED'}
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-serif text-white font-medium mb-1">
                    {path.title}
                  </h4>

                  <p className="text-xs font-mono text-[#c49750] mb-3">
                    {path.subtitle}
                  </p>

                  <p className="text-xs text-[#a09c91] leading-relaxed mb-5">
                    {path.desc}
                  </p>

                  <div className="space-y-2 mb-6">
                    {path.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs text-[#dedacf]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#c49750] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onOpenInquiry(path.topic)}
                  className={`w-full py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    path.highlight
                      ? 'bg-gradient-to-r from-[#c49750] to-[#d8a85c] hover:from-[#d8a85c] hover:to-[#e8ba6e] text-black shadow-lg shadow-[#c49750]/20'
                      : 'bg-[#181c28] hover:bg-[#222838] text-white border border-white/10 hover:border-[#c49750]/50'
                  }`}
                >
                  <span>{path.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ==================================================================== */}
        {/* SECTION 6: CONFIDENTIAL SANCTUARY FOOTER                            */}
        {/* ==================================================================== */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#0b0e14] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9a9689]">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#c49750] shrink-0" />
            <span>
              {isDe 
                ? 'Sämtliche Engagements mit Künstlern und Privatkunden unterliegen strengster Diskretion. Vor Ort in Berlin, NRW, europäischen Studios oder weltweit online.'
                : 'All engagements with artists and private clients are held under strict confidentiality. Available in Berlin, NRW, European studios, or worldwide online.'}
            </span>
          </div>

          {onScrollToClassical && (
            <button
              onClick={onScrollToClassical}
              className="text-[#c49750] hover:text-[#d8a85c] font-mono tracking-wider transition-colors shrink-0 cursor-pointer flex items-center gap-1"
            >
              <span>{cv.ctaExploreClassical}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
