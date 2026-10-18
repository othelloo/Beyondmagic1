import React from 'react';
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
  Layers
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
      badge: isDe ? 'STUDIO & TOUR RETANER' : 'STUDIO & TOUR RETAINER',
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
      className="py-20 px-6 bg-gradient-to-b from-[#0b0c0e] via-[#0e1118] to-[#0b0c0e] border-t border-[#1e2330] relative overflow-hidden"
    >
      {/* Subtle ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#c49750]/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#161a25] border border-[#c49750]/40 text-xs uppercase tracking-[0.2em] text-[#c49750] font-mono mb-4 shadow-sm">
            <Mic className="w-3.5 h-3.5 text-[#c49750]" />
            <span>{cv.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#fbf9f5] font-normal leading-tight mb-4">
            {cv.title}
          </h2>

          <p className="text-sm sm:text-base text-[#b8b4a8] font-light leading-relaxed">
            {cv.subtitle}
          </p>
        </div>

        {/* Unified Credo Card */}
        <div className="mb-14 rounded-2xl bg-gradient-to-br from-[#181510]/95 via-[#12151f] to-[#0f121a] border border-[#c49750]/40 p-6 sm:p-9 shadow-xl relative overflow-hidden">
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

        {/* The Emotional Connection & Relay Principle */}
        <div className="mb-14 p-5 sm:p-6 rounded-xl bg-[#0f121a] border border-[#c49750]/30 flex flex-col sm:flex-row items-center gap-4 text-xs sm:text-sm shadow-md">
          <div className="w-10 h-10 rounded-xl bg-[#181d2b] border border-[#c49750]/40 flex items-center justify-center text-[#c49750] shrink-0">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <span className="font-serif italic text-[#fcfbfa] block text-sm sm:text-base mb-1">
              “{cv.hookQuote}”
            </span>
            <span className="text-xs text-[#a09c91] font-mono leading-relaxed block">
              {cv.hookSubquote}
            </span>
          </div>
        </div>

        {/* The 3 Pillars of Mastery: Science (50%) · Passion (30%) · Mystery (20%) */}
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

        {/* The 3 Pathways to Work Together */}
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

        {/* Sanctuary & Confidentiality Footer */}
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
