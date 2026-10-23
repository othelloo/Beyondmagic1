import React from 'react';
import { 
  Mic, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Lock,
  Headphones,
  Gauge,
  AlertTriangle,
  Flame,
  Layers,
  Wind
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { resolveAssetUrl } from '../utils/assetPath';
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

  const pathways = [
    {
      badge: isDe ? '1:1 DIAGNOSE' : '1:1 DIAGNOSTIC',
      title: isDe ? '45-Minuten Stimm-Biomechanik-Diagnose' : '45-Minute Biomechanical Diagnostic',
      subtitle: isDe ? 'Erkennung technischer Engpässe in 15 Min.' : '15-min bottleneck audit & vocal roadmap',
      desc: isDe 
        ? 'Präzisions-Analyse von subglottischem Druck, Atem-Entkopplung und akustischer Impedanz mit sofortigem individuellem Fahrplan.'
        : 'Rapid precision audit of subglottic pressure, airflow decoupling, and acoustic impedance with an immediate custom roadmap.',
      points: isDe ? [
        'Analyse von Luftdurchsatz & Registerbrüchen',
        'Prüfung von Kehlkopfbalance & Resonanz-Tuning',
        'Fahrplan zur Erweiterung Ihres Stimmumfangs'
      ] : [
        'Transglottic airflow & register transition analysis',
        'Laryngeal equilibrium & vocal tract tuning audit',
        'Concrete roadmap to safely expand your upper range'
      ],
      topic: '45-Minute Biomechanical Vocal Diagnostic',
      cta: isDe ? 'Diagnose buchen' : 'Book Diagnostic',
      highlight: false
    },
    {
      badge: isDe ? 'STUDIO & TOUR RETAINER' : 'STUDIO & TOUR RETAINER',
      title: isDe ? 'On-Call Vocal Producer & Tour Sanctuary' : 'Vocal Producer & Tour Sanctuary',
      subtitle: isDe ? 'Studiowochen-Schutz & Tour-Ausdauer' : 'Studio session preservation & tour stamina',
      desc: isDe 
        ? 'Vertrauliche Begleitung bei albumweiten Gesangsaufnahmen und fordernden Tourneen. Frische, leuchtende Takes vom ersten bis zum 40. Auftritt.'
        : 'Confidential physiological preservation for multi-day album tracking and demanding tours. Radiant, fatigue-free takes from opening night to show 40.',
      points: isDe ? [
        'Pre-Tracking Dekompression & Formanten-Abstimmung',
        'Take-by-Take Micro-Resets gegen vorzeitige Ermüdung',
        '15-Minuten-Backstage-Notfallprotokoll auf Tour'
      ] : [
        'Pre-tracking laryngeal decompression & formant tuning',
        'Take-by-take micro resets to prevent vocal fatigue',
        '15-minute backstage emergency tour recovery'
      ],
      topic: 'Studio Tracking Week Retainer (On-Call Vocal Producer & Tracking Alchemist)',
      cta: isDe ? 'Retainer anfragen' : 'Inquire for Retainer',
      highlight: true
    },
    {
      badge: isDe ? '12-WOCHEN INTENSIV' : '12-WEEK INTENSIVE',
      title: isDe ? 'Privates High-Performance Mentoring' : '12-Week Private Vocal Mentorship',
      subtitle: isDe ? 'Fundament, Farbspektrum & Transzendenz' : 'Foundation, color toolkit & transcendence',
      desc: isDe 
        ? 'Tiefgreifende Einzelförderung: Vollkommene Souveränität über das eigene Instrument – vom Verständnis physikalischer Gesetze bis zur puren Bühnenmagie.'
        : 'Transformative one-on-one journey: Complete sovereignty over your instrument—from anatomical laws to uninhibited artistic fire.',
      points: isDe ? [
        'Phase 1: Aerodynamisches Gleichgewicht & Atembasis',
        'Phase 2: Register-Erweiterung & variables Farbspektrum',
        'Phase 3: Automatisierung, Tour-Stamina & „The Zone“'
      ] : [
        'Phase 1: Aerodynamic balance & solid breath support',
        'Phase 2: Register expansion & full color palette',
        'Phase 3: Motor automaticity, tour resilience & flow'
      ],
      topic: '12-Week High-Performance Vocal Mentorship',
      cta: isDe ? 'Mentoring anfragen' : 'Apply for Mentorship',
      highlight: false
    }
  ];

  const vocalPillars = [
    {
      title: isDe ? 'Die natürliche Stimme entfalten' : 'Developing the Natural Voice',
      desc: isDe 
        ? 'Keine künstliche Maske, kein fremdes Timbre. Wir befreien Ihren unverwechselbaren Naturklang von unbewussten Muskelblockaden.'
        : 'No artificial posture, no borrowed timbre. We liberate your signature natural sound by releasing unconscious muscular compensations.'
    },
    {
      title: isDe ? 'Grenzen erkennen & gezielt verschieben' : 'Mapping & Expanding Limits',
      desc: isDe 
        ? 'Exaktes Verstehen der aktuellen physiologischen Grenzen, um Umfang, Resonanzraum und Tragfähigkeit gesund und systematisch auszubauen.'
        : 'Precisely diagnosing your current physical boundaries to build stamina, widen pitch range, and extend limits with zero strain.'
    },
    {
      title: isDe ? 'Registergewinn & Nahtloser Übergang' : 'Register Expansion & Smooth Mix',
      desc: isDe 
        ? 'Beseitigung von Registerbrüchen. Vollkommene Verbindung von Brustresonanz, Mix Voice und Kopfstimme mit federleichter Intonation.'
        : 'Eliminating audible registration cracks. Unifying chest resonance, balanced mix, and upper head voice into one seamless continuum.'
    },
    {
      title: isDe ? 'Ein vollständiger Werkzeugkasten an Farben' : 'A Complete Toolkit of Colors',
      desc: isDe 
        ? 'Von intimer mikrofonnaher Zartheit bis zum durchdringenden Belt: Bewusstes Beherrschen von Texturen, Straight-Tone und Resonanzfarben.'
        : 'From intimate whisper-close mic nuance to soaring belts: deliberate command over acoustic colors, straight-tone, and expressive textures.'
    }
  ];

  return (
    <section 
      id="vocal-coaching" 
      className="py-20 px-4 sm:px-6 bg-gradient-to-b from-[#0b0c0e] via-[#0e1118] to-[#0b0c0e] border-t border-[#1e2330] relative overflow-hidden"
    >
      {/* Anchor for alternate #singing navigation */}
      <div id="singing" className="absolute -top-24 left-0 pointer-events-none" />

      {/* Subtle ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#c49750]/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        
        {/* ==================================================================== */}
        {/* 1. HERO SHOWCASE CARD: High-End Studio Photo & Core Vocal Philosophy  */}
        {/* ==================================================================== */}
        <div className="mb-14 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#151722] via-[#10121a] to-[#0c0d12] border border-[#c49750]/30 shadow-2xl overflow-hidden relative">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Visual Column: Grand Piano Keys leading into deep Bokeh with Studio Condenser Mic */}
            <div className="lg:col-span-6 relative w-full overflow-hidden group bg-[#0e111a] flex flex-col justify-center">
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[520px]">
                <img
                  src={resolveAssetUrl('/images/piano_studio_mic.jpg')}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== pianoStudioMicImg) {
                      target.src = pianoStudioMicImg;
                    }
                  }}
                  alt="Grand piano keys leading into soft bokeh with a studio condenser microphone on shockmount"
                  width={1280}
                  height={720}
                  decoding="async"
                  fetchPriority="high"
                  className="w-full h-full object-cover object-center lg:object-left-center block filter contrast-[1.03] transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />

                {/* Seamless atmospheric scrims */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#10121a] via-transparent to-transparent lg:hidden pointer-events-none" />
                <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#10121a] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0b0c0e]/30 via-transparent to-[#0b0c0e]/40 pointer-events-none" />

                {/* Lens caption badge */}
                <div className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 z-10 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-[11px] font-mono text-[#dcd7cb]">
                  <Headphones className="w-3.5 h-3.5 text-[#c49750]" />
                  <span>
                    {isDe 
                      ? 'Aerodynamische Stabilität · Volle Vokalfreiheit' 
                      : 'Aerodynamic Stability · Full Vocal Freedom'}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Column: The Essence of Vocal Mastery */}
            <div className="lg:col-span-6 p-6 sm:p-9 lg:p-12 flex flex-col justify-between relative z-10">
              
              <div>
                {/* Section Eyebrow */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181d2c] border border-[#c49750]/40 text-[11px] uppercase tracking-[0.2em] text-[#d8a85c] font-mono mb-4 shadow-sm">
                  <Mic className="w-3.5 h-3.5 text-[#c49750]" />
                  <span>
                    {isDe 
                      ? 'VOKALE ENTFALTUNG & BIOMECHANIK' 
                      : 'VOCAL FREEDOM & BIOMECHANICS'}
                  </span>
                </div>

                {/* Primary Headline */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#fbf9f5] font-normal leading-tight mb-4">
                  {isDe ? (
                    <>
                      Ein solides Fundament für{' '}
                      <span className="text-[#c49750] italic font-light">
                        außergewöhnliche Stimmen.
                      </span>
                    </>
                  ) : (
                    <>
                      A Solid Frame for{' '}
                      <span className="text-[#c49750] italic font-light">
                        Extraordinary Voices.
                      </span>
                    </>
                  )}
                </h2>

                {/* Core Mission Statement */}
                <p className="text-xs sm:text-sm text-[#cfcac0] leading-relaxed mb-5 font-light">
                  {isDe ? (
                    <>
                      Das Ziel ist, Ihre <strong>natürliche Stimme</strong> zu entfalten, ihre physiologischen Grenzen genau zu verstehen, um sie gezielt und risikofrei zu erweitern. Sie gewinnen mehr Registerumfang, erlernen neue Farben und Ausdrucksformen – verankert auf einer unerschütterlichen <strong>aerodynamischen Atembasis</strong>.
                    </>
                  ) : (
                    <>
                      The goal is to develop your <strong>natural voice</strong>, map its physical limits, and systematically push them further. You expand your register, unlock a versatile toolkit of vocal colors and textures—all anchored in an unshakeable <strong>aerodynamic breath foundation</strong>.
                    </>
                  )}
                </p>

                {/* Transcendent Quotation */}
                <div className="p-4 sm:p-5 rounded-xl bg-[#0b0e14]/90 border border-[#c49750]/30 mb-6">
                  <blockquote className="text-sm sm:text-base font-serif italic text-[#fcfbfa] leading-relaxed mb-2">
                    {isDe ? (
                      <>
                        „Technik existiert nicht, um gehört zu werden – sie dient dazu, vollkommen zu verschwinden. Wenn Sie exakt verstehen, was im Körper geschieht, wird die Mechanik zur automatischen Gewohnheit. Im Moment der Performance existiert nur noch die Musik. Wenn die Stimme frei ist, dann <span className="text-[#c49750] not-italic font-medium">SIND</span> wir die Musik.“
                      </>
                    ) : (
                      <>
                        “Technique does not exist to be heard—it exists to vanish completely. When you know precisely what your instrument is doing, mechanics become effortless and automatic. On stage, only the music exists. When the voice is truly free, we <span className="text-[#c49750] not-italic font-medium">ARE</span> the music.”
                      </>
                    )}
                  </blockquote>
                  <div className="text-[11px] font-mono text-[#c49750] uppercase tracking-wider">
                    — Abdellah Lasri
                  </div>
                </div>

                {/* 4 Core Pillars at a Glance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {vocalPillars.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#141724]/70 border border-white/5">
                      <div className="flex items-center gap-2 text-xs font-serif text-white font-medium mb-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#c49750] shrink-0" />
                        <span>{p.title}</span>
                      </div>
                      <p className="text-[11px] text-[#a49f92] leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  ))}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => onOpenInquiry('45-Minute Biomechanical Vocal Diagnostic')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#c49750] to-[#d8a85c] hover:from-[#d8a85c] hover:to-[#e8ba6e] text-black text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c49750]/20 cursor-pointer"
                >
                  <span>{isDe ? 'Diagnose buchen' : 'Book Diagnostic'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('aerodynamic-balance');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#161a25] hover:bg-[#1e2334] text-white border border-white/10 hover:border-[#c49750]/40 text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Wind className="w-3.5 h-3.5 text-[#c49750]" />
                  <span>{isDe ? 'Die Physik des Atems' : 'Aerodynamic Balance'}</span>
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* ==================================================================== */}
        {/* 2. AERODYNAMIC BALANCE: THE PHYSICS OF AIRFLOW & VOCAL FOLD SAFETY   */}
        {/* ==================================================================== */}
        <div id="aerodynamic-balance" className="mb-16">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#181d2a] border border-[#c49750]/30 text-[10px] font-mono uppercase tracking-widest text-[#c49750] mb-3">
              <Gauge className="w-3 h-3" />
              <span>{isDe ? 'AERODYNAMISCHE PRÄZISION & STIMMGESUNDHEIT' : 'AERODYNAMIC PRECISION & VOCAL SAFETY'}</span>
            </div>

            <h3 className="text-xl sm:text-3xl font-serif text-[#fcfbfa] font-normal mb-3">
              {isDe 
                ? 'Luftdurchsatz & Subglottischer Druck: Die Kunst des Gleichgewichts' 
                : 'Airflow Velocity & Subglottic Pressure: The Art of Equilibrium'}
            </h3>

            <p className="text-xs sm:text-sm text-[#b8b3a5] font-light leading-relaxed">
              {isDe 
                ? 'Wir wollen nicht in eine Situation geraten, in der eine Stimme rehabilitiert werden muss. Wahre Meisterschaft bedeutet, eine Karriere über Jahrzehnte und fordernde Phasen hinweg vorausschauend, gesund und souverän zu steuern.' 
                : 'We never want to find ourselves in a position where a voice requires clinical rehabilitation. True mastery means proactively steering a multi-decade career with foresight, technique, and physiological sovereignty.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Condition 1: Insufficient Airflow */}
            <div className="p-6 rounded-2xl bg-[#12141c] border border-amber-500/20 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {isDe ? 'Zu geringer Luftdurchsatz' : 'Insufficient Airflow'}
                  </span>
                  <Wind className="w-4 h-4 text-amber-400" />
                </div>

                <h4 className="text-base font-serif text-white font-medium mb-2">
                  {isDe ? 'Weiche Ansätze & Kollabierende Phrasen' : 'Sluggish Onset & Collapsing Phrases'}
                </h4>

                <p className="text-xs text-[#a49f92] leading-relaxed mb-4">
                  {isDe 
                    ? 'Wenn der transglottische Luftdurchsatz oder der subglottische Druck unzureichend unterstützt sind, wird der Stimmeinsatz schwammig und kraftlos. Komplizierte, dynamische Phrasen verlieren ihre akustische Mitte und lassen sich am Phrasenende kaum mehr sauber auflösen.' 
                    : 'When transglottic airflow or subglottic pressure lacks dynamic support, phonation onset becomes sluggish and diffuse. Demanding melodic phrases lose acoustic core, making complex line endings difficult to sustain and resolve.'}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-amber-400/90 flex items-center gap-1.5">
                <span>⚠</span>
                <span>{isDe ? 'Verlust von Intonation & Projektion' : 'Loss of Pitch Center & Line Control'}</span>
              </div>
            </div>

            {/* Condition 2: Calibrated Equilibrium (The Goal) */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#181d2c] via-[#121624] to-[#0e111a] border-2 border-[#c49750] shadow-2xl relative flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#c49750] text-black font-semibold">
                    {isDe ? 'Das Perfekte Gleichgewicht' : 'Calibrated Equilibrium'}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-[#c49750]" />
                </div>

                <h4 className="text-base font-serif text-white font-medium mb-2">
                  {isDe ? 'Aerodynamisch-Myoelastische Balance' : 'Aerodynamic-Myoelastic Balance'}
                </h4>

                <p className="text-xs text-[#cfcac0] leading-relaxed mb-4">
                  {isDe 
                    ? 'Der subglottische Druck und der Luftstrom harmonieren perfekt mit dem Stimmlippenverschluss (akustische Impedanz). Die Stimme spricht blitzschnell und reibungsfrei an. Sie können jede Nuance abrufen – vom intimen Hauch bis zum Arena-Belt – ohne jegliche Kehlkopfanspannung.' 
                    : 'Subglottic pressure and transglottic airflow sit in perfect acoustic impedance with vocal fold closure. Phonation initiates instantaneously with zero friction. You command every color—from breathy intimacy to stadium belts—with total laryngeal freedom.'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#c49750]/30 text-[11px] font-mono text-[#d8a85c] flex items-center gap-1.5">
                <span>✦</span>
                <span>{isDe ? 'Dauerhafte Gesundheit & Unendliche Farben' : 'Lifelong Resilience & Boundless Colors'}</span>
              </div>
            </div>

            {/* Condition 3: Excessive Pressure */}
            <div className="p-6 rounded-2xl bg-[#171215] border border-rose-500/30 flex flex-col justify-between shadow-lg">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                    {isDe ? 'Überdruck & Stoßbelastung' : 'Excessive Air Pressure'}
                  </span>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>

                <h4 className="text-base font-serif text-white font-medium mb-2">
                  {isDe ? 'Gewaltsamer Glottisschlag & Knötchengefahr' : 'Violent Glottal Stops & Nodule Risk'}
                </h4>

                <p className="text-xs text-[#a49f92] leading-relaxed mb-4">
                  {isDe 
                    ? 'Wird zu viel unkontrollierte Atemluft gegen verkrampfte Stimmbänder gepresst, schlagen die Ränder mit harter Wucht zusammen (Hyperadduktion). Dies schädigt das Muskelgewebe, erschöpft die Stimme rapide und führt im schlimmsten Fall zu Stimmbandknötchen – dem gefürchteten Karriere-Aus.' 
                    : 'When excessive, uncontrolled air pressure slams against constricted cords, violent glottic collision occurs (hyperadduction). This tears into the vocal fold mucosa, triggers rapid vocal exhaustion, and in the worst case causes vocal fold nodules—a catastrophic threat to a career.'}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 text-[11px] font-mono text-rose-400/90 flex items-center gap-1.5">
                <span>✕</span>
                <span>{isDe ? 'Hohes Phonotrauma- & Knötchenrisiko' : 'Severe Phonotrauma & Career Threat'}</span>
              </div>
            </div>

          </div>

        </div>

        {/* ==================================================================== */}
        {/* 3. THE 3 WORKING PATHWAYS ("A Solid Frame for Extraordinary Voices")  */}
        {/* ==================================================================== */}
        <div className="mb-12">
          
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#c49750] mb-1 block">
              {cv.retainersBadge}
            </span>
            <h3 className="text-xl sm:text-2xl font-serif text-white font-normal mb-2">
              {isDe ? 'Ein solider Rahmen für Ihre stimmliche Zukunft' : 'A Solid Frame for Extraordinary Voices'}
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
                        ★ {isDe ? 'EMPFOHLEN' : 'FEATURED'}
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
        {/* 4. SANCTUARY & CONFIDENTIALITY FOOTER                               */}
        {/* ==================================================================== */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#0b0e14] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9a9689]">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-[#c49750] shrink-0" />
            <span>
              {isDe 
                ? 'Sämtliche Coachings und Retainer unterliegen strengster Diskretion. Vor Ort in Berlin, NRW, europäischen Studios oder weltweit online.'
                : 'All vocal engagements and retainers are held under strict confidentiality. Available in Berlin, NRW, European studios, or worldwide online.'}
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
