import React, { useState, useEffect } from 'react';
import { Award, Music2, Globe, Quote, ArrowDown } from 'lucide-react';
import { getStoredPortrait, onMediaChange } from '../data/mediaStore';
import { useLanguage } from '../context/LanguageContext';

interface BiographyProps {
  onScrollToGallery: () => void;
  onOpenInquiry: (topic?: string) => void;
}

export const Biography: React.FC<BiographyProps> = ({ onScrollToGallery, onOpenInquiry }) => {
  const { t } = useLanguage();
  const [portraitSrc, setPortraitSrc] = useState<string>(getStoredPortrait());

  useEffect(() => {
    const unsub = onMediaChange(() => {
      setPortraitSrc(getStoredPortrait());
    });
    return unsub;
  }, []);

  return (
    <section id="biography" className="py-20 px-6 bg-[#0e1015] border-t border-[#1e222a]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#c49750] font-medium mb-3">
            <span>{t.biography.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif text-[#fbf9f5] font-normal leading-tight mb-4">
            {t.biography.title}
          </h2>
          <p className="text-base sm:text-lg text-[#b8b5ab] font-light">
            {t.biography.subtitle}
          </p>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-14">
          
          {/* Left Column: Stage Picture & Highlights */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="rounded-xl overflow-hidden border border-[#272b35] bg-[#12141a] shadow-2xl">
              <div className="relative overflow-hidden bg-[#0c0e12]">
                <img
                  src="/images/biography.jpg"
                  alt="Abdellah Lasri"
                  className="w-full h-auto block object-cover filter contrast-[1.02]"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/images/onstage/17175992_10208450693811600_463692066_o.jpg')) {
                      target.src = '/images/onstage/17175992_10208450693811600_463692066_o.jpg';
                    }
                  }}
                />
              </div>
            </div>

            {/* Quick summary points */}
            <div className="p-5 bg-[#12151d] rounded-xl border border-[#21242d] space-y-3.5">
              <div className="flex items-start gap-3">
                <Award className="w-4 h-4 text-[#c49750] shrink-0 mt-0.5" />
                <div className="text-xs text-[#b8b5ab]">
                  <strong className="text-[#eeeae0] block mb-0.5">{t.biography.point1Title}</strong>
                  {t.biography.point1Desc}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-[#c49750] shrink-0 mt-0.5" />
                <div className="text-xs text-[#b8b5ab]">
                  <strong className="text-[#eeeae0] block mb-0.5">{t.biography.point2Title}</strong>
                  {t.biography.point2Desc}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Music2 className="w-4 h-4 text-[#c49750] shrink-0 mt-0.5" />
                <div className="text-xs text-[#b8b5ab]">
                  <strong className="text-[#eeeae0] block mb-0.5">{t.biography.point3Title}</strong>
                  {t.biography.point3Desc}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Story */}
          <div className="lg:col-span-7 space-y-5 text-[#b5b1a4] font-light leading-relaxed text-sm sm:text-base">
            
            <p>
              {t.biography.p1}
            </p>

            <p>
              {t.biography.p2}
            </p>

            <p>
              {t.biography.p3}
            </p>

            {/* Quote */}
            <div className="my-6 p-5 bg-[#13161f] border-l-2 border-[#c49750] rounded-r-xl">
              <Quote className="w-5 h-5 text-[#c49750]/50 mb-1.5" />
              <p className="font-serif italic text-base text-[#dedacf] leading-relaxed">
                {t.biography.highlightQuote}
              </p>
            </div>

            <p>
              {t.biography.p4}
            </p>

            <div className="text-xs text-[#c49750] font-mono tracking-wide pt-1">
              {t.hero.locationAvailability}
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onScrollToGallery}
                className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#eeeae0] hover:text-white border border-[#2b303d] hover:border-[#c49750] rounded transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{t.biography.viewGalleryBtn}</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#c49750]" />
              </button>

              <button
                onClick={() => onOpenInquiry('General inquiry with the teacher')}
                className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded transition-all cursor-pointer shadow-md"
              >
                {t.biography.inquireBtn}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
