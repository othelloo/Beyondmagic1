import React from 'react';
import { Music, Mic, Headphones, Check } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMobileSlider } from '../hooks/useMobileSlider';
import { SlidingCardTrack } from './SlidingCardTrack';
import { Interactive3DCard } from './Interactive3DCard';

interface TargetAudiencesProps {
  onOpenInquiry?: (topic: string) => void;
}

export const TargetAudiences: React.FC<TargetAudiencesProps> = () => {
  const { t } = useLanguage();

  const audienceCards = [
    {
      id: 'french-classical',
      icon: Music,
      category: t.audiences.card1Badge,
      title: t.audiences.card1Title,
      subtitle: t.audiences.card1Subtitle,
      description: t.audiences.card1Desc,
      points: t.audiences.card1Points,
      cta: t.audiences.card1Cta
    },
    {
      id: 'contemporary-vocal',
      icon: Mic,
      category: t.audiences.card2Badge,
      title: t.audiences.card2Title,
      subtitle: t.audiences.card2Subtitle,
      description: t.audiences.card2Desc,
      points: t.audiences.card2Points,
      cta: t.audiences.card2Cta
    },
    {
      id: 'producers-and-listeners',
      icon: Headphones,
      category: t.audiences.card3Badge,
      title: t.audiences.card3Title,
      subtitle: t.audiences.card3Subtitle,
      description: t.audiences.card3Desc,
      points: t.audiences.card3Points,
      cta: t.audiences.card3Cta
    }
  ];

  const {
    currentIndex,
    next,
    prev,
    goTo,
    touchHandlers
  } = useMobileSlider(audienceCards.length);

  const renderAudienceCard = (aud: typeof audienceCards[number]) => {
    const IconComponent = aud.icon;
    return (
      <Interactive3DCard key={aud.id} className="h-full">
        <div className="p-6 sm:p-7 flex flex-col justify-between relative h-full select-none">
          <div className="absolute top-0 inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-[#c49750]/80 to-transparent rounded-full" />

          <div>
            <div className="layer-z-36 flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#c49750]">
                {aud.category}
              </span>
              <div className="w-10 h-10 rounded-lg bg-[#1a1e28]/90 border border-[#2b303e] flex items-center justify-center text-[#c49750] shadow-inner">
                <IconComponent className="w-4 h-4" />
              </div>
            </div>

            <h3 className="layer-z-26 text-xl sm:text-2xl font-serif text-[#f2eee9] mb-1.5 font-normal">
              {aud.title}
            </h3>

            <p className="layer-z-26 text-xs text-[#c49750] font-medium mb-3 italic">
              {aud.subtitle}
            </p>

            <p className="layer-z-18 text-xs sm:text-sm text-[#9f9b8f] leading-relaxed mb-6 font-light">
              {aud.description}
            </p>

            <div className="layer-z-10 space-y-2.5 pt-4 border-t border-white/10">
              {aud.points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-[#cfccc3]">
                  <Check className="w-3.5 h-3.5 text-[#c49750] shrink-0 mt-0.5" />
                  <span className="font-light">{pt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Interactive3DCard>
    );
  };

  return (
    <section id="audiences" className="pt-3 sm:pt-6 lg:pt-10 pb-14 sm:pb-20 px-4 sm:px-6 bg-[#0e1015] border-t border-[#1e222a]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-[#c49750] font-medium mb-2.5">
            <span>{t.audiences.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif text-[#fbf9f5] font-normal">
            {t.audiences.title}
          </h2>
        </div>

        {/* Mobile & Tablet View: Smooth hardware-accelerated card sliding (< lg) */}
        <div className="block lg:hidden">
          <SlidingCardTrack
            currentIndex={currentIndex}
            totalItems={audienceCards.length}
            onPrev={prev}
            onNext={next}
            onSelect={goTo}
            touchHandlers={touchHandlers}
          >
            {audienceCards.map((aud) => renderAudienceCard(aud))}
          </SlidingCardTrack>
        </div>

        {/* Desktop View: Full 3-Card Grid without booking buttons (lg:grid) */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {audienceCards.map((aud) => renderAudienceCard(aud))}
        </div>

      </div>
    </section>
  );
};
