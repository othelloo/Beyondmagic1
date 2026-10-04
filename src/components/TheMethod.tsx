import React from 'react';
import { Sparkles, Ear, BookOpen, Wind, ArrowRight } from 'lucide-react';
import { HarmonicExperienceDemo } from './HarmonicExperienceDemo';
import { useLanguage } from '../context/LanguageContext';

interface TheMethodProps {
  onOpenInquiry: (defaultTopic?: string) => void;
  onOpenSpirituality: () => void;
}

export const TheMethod: React.FC<TheMethodProps> = ({ onOpenInquiry }) => {
  const { language, t } = useLanguage();
  const isDe = language === 'de';

  const pillars = [
    {
      num: '01',
      icon: Ear,
      title: t.method.pillar1Title,
      description: t.method.pillar1Desc
    },
    {
      num: '02',
      icon: BookOpen,
      title: t.method.pillar2Title,
      description: t.method.pillar2Desc
    },
    {
      num: '03',
      icon: Wind,
      title: t.method.pillar3Title,
      description: t.method.pillar3Desc
    }
  ];

  return (
    <section id="the-method" className="py-20 px-6 bg-[#0b0c0e] relative border-t border-[#1e222a]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#c49750] font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#c49750]" />
            <span>{t.method.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif text-[#fbf9f5] font-normal leading-tight mb-4">
            {t.method.title}
          </h2>

          <p className="text-base text-[#b8b5ab] font-light leading-relaxed">
            {t.method.subtitle}
          </p>
        </div>

        {/* 3 Pillars Grid - Clean, sharp, zero bloat */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.num}
                className="bg-[#12141c] border border-[#232733] hover:border-[#c49750]/50 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-medium text-[#c49750]">
                      {pillar.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[#1a1e28] border border-[#292e3c] flex items-center justify-center text-[#c49750] group-hover:bg-[#c49750] group-hover:text-black transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-lg font-serif text-[#f2eee9] font-medium mb-2.5">
                    {pillar.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#9f9b90] font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Experiment: Hear Tension vs. Consonance */}
        <div className="mb-10">
          <div className="mb-3 text-xs text-[#8c887d] font-mono uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-[#c49750]">●</span>
            <span>{t.method.demoHint}</span>
          </div>
          <HarmonicExperienceDemo />
        </div>

        {/* Action Row */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => onOpenInquiry(isDe ? 'Unterricht zur Methode' : 'Lessons about The Method')}
            className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded transition-all cursor-pointer shadow-md inline-flex items-center gap-2"
          >
            <span>{t.method.ctaBookMethod}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
