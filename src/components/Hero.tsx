import React, { useState, useEffect } from 'react';
import { ArrowDown, Play } from 'lucide-react';
import { getStoredPortrait, onMediaChange } from '../data/mediaStore';
import { useLanguage } from '../context/LanguageContext';
import { resolveAssetUrl } from '../utils/assetPath';

interface HeroProps {
  onOpenInquiry: (defaultTopic?: string) => void;
  onScrollToMethod: () => void;
  onScrollToVideo: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenInquiry,
  onScrollToMethod,
  onScrollToVideo,
}) => {
  const { t } = useLanguage();
  const [portraitSrc, setPortraitSrc] = useState<string>(getStoredPortrait());

  useEffect(() => {
    const unsub = onMediaChange(() => {
      setPortraitSrc(getStoredPortrait());
    });
    return unsub;
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center pt-28 pb-16 px-6 overflow-hidden">
      {/* Gentle ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#c49750]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
        
        {/* Left Column: Visual Frame (Picture on the Left) */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center lg:items-start order-1">
          <div className="w-full max-w-lg lg:max-w-none">
            <div className="relative group rounded-2xl overflow-hidden border border-[#272b35] bg-[#121419] shadow-2xl transition-all duration-300">
              {/* Uncropped Photo: Exact 630 / 454 Proportion */}
              <div className="relative overflow-hidden bg-[#0c0e12]">
                <img
                  src={resolveAssetUrl(portraitSrc || '/images/portrait.jpg')}
                  alt="Abdellah Lasri"
                  className="w-full h-auto block object-cover filter contrast-[1.02] group-hover:scale-[1.01] transition-transform duration-700"
                  style={{ aspectRatio: '630 / 454' }}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.endsWith('/portrait.jpg')) {
                      target.src = resolveAssetUrl('/images/portrait.jpg');
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Text content (Left-aligned & Streamlined) */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center text-left order-2">
          
          <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm tracking-[0.2em] uppercase text-[#c49750] font-medium mb-4 text-left">
            <span>{t.hero.badge[0]}</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>{t.hero.badge[1]}</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>{t.hero.badge[2]}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal leading-[1.18] text-[#fbf9f5] tracking-tight mb-5 text-left text-balance">
            {t.hero.titleMain}
            <br />
            <span className="italic font-light text-[#c49750]">
              {t.hero.titleSub}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#b8b5ab] font-light leading-relaxed max-w-2xl mb-7 text-left">
            {t.hero.summary}
          </p>

          {/* Quick Credential Highlights */}
          <div className="space-y-2 mb-8 max-w-xl text-xs sm:text-sm text-[#dedacf] border-l-2 border-[#c49750]/60 pl-4 py-1">
            <div className="flex items-center gap-2">
              <span className="text-[#c49750]">📍</span>
              <span className="font-light">{t.hero.highlights.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#c49750]">🎓</span>
              <span className="font-light">{t.hero.highlights.credentials}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#c49750]">🎭</span>
              <span className="font-light">{t.hero.highlights.stages}</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onOpenInquiry('General Lesson Consultation')}
              className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded transition-all shadow-lg cursor-pointer"
            >
              {t.hero.ctaPrimary}
            </button>

            <button
              onClick={onScrollToMethod}
              className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-[#e6e2d8] hover:text-white border border-[#2f333c] hover:border-[#c49750]/60 rounded transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{t.hero.ctaMethod}</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#c49750]" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
