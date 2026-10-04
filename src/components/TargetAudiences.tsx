import React from 'react';
import { GraduationCap, Sliders, Headphones, Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TargetAudiencesProps {
  onOpenInquiry: (topic: string) => void;
}

export const TargetAudiences: React.FC<TargetAudiencesProps> = ({ onOpenInquiry }) => {
  const { t } = useLanguage();

  const audienceCards = [
    {
      id: 'singers',
      icon: GraduationCap,
      category: t.audiences.card1Badge,
      title: t.audiences.card1Title,
      subtitle: t.audiences.card1Subtitle,
      description: t.audiences.card1Desc,
      points: t.audiences.card1Points,
      cta: t.audiences.card1Cta
    },
    {
      id: 'producers',
      icon: Sliders,
      category: t.audiences.card2Badge,
      title: t.audiences.card2Title,
      subtitle: t.audiences.card2Subtitle,
      description: t.audiences.card2Desc,
      points: t.audiences.card2Points,
      cta: t.audiences.card2Cta
    },
    {
      id: 'listeners',
      icon: Headphones,
      category: t.audiences.card3Badge,
      title: t.audiences.card3Title,
      subtitle: t.audiences.card3Subtitle,
      description: t.audiences.card3Desc,
      points: t.audiences.card3Points,
      cta: t.audiences.card3Cta
    }
  ];

  return (
    <section id="audiences" className="py-20 px-6 bg-[#0e1015] border-t border-[#1e222a]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-[#c49750] font-medium mb-3">
            <span>{t.audiences.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif text-[#fbf9f5] font-normal mb-3">
            {t.audiences.title}
          </h2>
          
          <p className="text-sm sm:text-base text-[#9e9a8e] font-light leading-relaxed">
            {t.audiences.subtitle}
          </p>
        </div>

        {/* 3 Audience Cards - Streamlined & Balanced */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {audienceCards.map((aud) => {
            const IconComponent = aud.icon;
            return (
              <div
                key={aud.id}
                className="bg-[#12151d] border border-[#232733] rounded-2xl p-7 flex flex-col justify-between hover:border-[#c49750]/50 transition-all duration-300 group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#c49750]">
                      {aud.category}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-[#1a1e28] border border-[#2b303e] flex items-center justify-center text-[#c49750] group-hover:bg-[#c49750] group-hover:text-black transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif text-[#f2eee9] mb-1.5 font-normal">
                    {aud.title}
                  </h3>

                  <p className="text-xs text-[#c49750] font-medium mb-3 italic">
                    {aud.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-[#9f9b8f] leading-relaxed mb-6 font-light">
                    {aud.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-[#1e222b]">
                    {aud.points.map((pt, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#cfccc3]">
                        <Check className="w-3.5 h-3.5 text-[#c49750] shrink-0 mt-0.5" />
                        <span className="font-light">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-[#1e222b]">
                  <button
                    onClick={() => onOpenInquiry(`Track: ${aud.title}`)}
                    className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>{aud.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
