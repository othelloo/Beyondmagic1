import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { getStoredPortrait, onMediaChange } from '../data/mediaStore';
import { useLanguage } from '../context/LanguageContext';
import { resolveAssetUrl } from '../utils/assetPath';
import { BeyondMagicItem } from './BeyondMagicItem';

interface HeroProps {
  onOpenInquiry: (defaultTopic?: string) => void;
  onScrollToMethod?: () => void;
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
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center relative z-10">
        
        {/* Left Column: Picture on the Left (Clean uncropped photo without frame) */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center lg:items-start order-1">
          <div className="w-full max-w-lg lg:max-w-none">
            {/* Uncropped Photo: Exact 630 / 454 Proportion without frame */}
            <div className="relative rounded-xl overflow-hidden bg-[#0c0e12] shadow-2xl">
              <img
                src={resolveAssetUrl(portraitSrc || '/images/portrait.jpg')}
                alt="Abdellah Lasri"
                className="w-full h-auto block object-cover filter contrast-[1.02] hover:scale-[1.01] transition-transform duration-700"
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

        {/* Right Column: Text content (Centered Logo & Artist Pedagogy) */}
        <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-center text-left order-2">
          
          {/* Golden Letters Above Logo & Name */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs md:text-sm tracking-[0.22em] uppercase text-[#c49750] font-medium mb-4 text-left">
            <span>{t.hero.badge[0]}</span>
            <span aria-hidden="true" className="opacity-40">-</span>
            <span>{t.hero.badge[1]}</span>
            <span aria-hidden="true" className="opacity-40">-</span>
            <span>{t.hero.badge[2]}</span>
          </div>

          {/* Main Title Area: Centered Separator with Logo & Name Centered in Their Own Zones */}
          <div className="mb-7 select-none max-w-2xl lg:max-w-3xl w-full">
            <div className="flex flex-col sm:grid sm:grid-cols-[1fr_auto_1fr] items-center gap-5 sm:gap-6 lg:gap-8">
              
              {/* Zone 1 (Left): Logo Centered in its own zone */}
              <div className="w-full flex items-center justify-center">
                <div className="w-full max-w-[240px] sm:max-w-[230px] lg:max-w-[260px] transform hover:scale-[1.02] transition-transform duration-300">
                  <BeyondMagicItem
                    withCircle={false}
                    useMetallic3D={false}
                    showMagic={true}
                    showName={false}
                    centered={true}
                    className="w-full h-auto drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
                    style={{ aspectRatio: '560 / 240' }}
                  />
                </div>
              </div>

              {/* Centered Separator */}
              <div 
                className="hidden sm:block w-[1.5px] self-center h-20 sm:h-24 lg:h-28 bg-gradient-to-b from-transparent via-[#c49750]/60 to-transparent shrink-0 shadow-[0_0_8px_rgba(196,151,80,0.25)]" 
                aria-hidden="true" 
              />
              <div 
                className="block sm:hidden w-28 h-[1px] bg-gradient-to-r from-transparent via-[#c49750]/60 to-transparent my-1 mx-auto" 
                aria-hidden="true" 
              />

              {/* Zone 2 (Right): Artist Name Centered in its own zone */}
              <div className="w-full flex items-center justify-center text-center">
                <h1 className="font-serif text-[20px] sm:text-[26px] lg:text-[34px] xl:text-[41px] uppercase tracking-wider text-[#fbf9f5] font-light leading-[1.12] text-center">
                  <span className="block">Abdellah</span>
                  <span className="block">Lasri</span>
                </h1>
              </div>

            </div>
          </div>

          <div className="mb-5 text-left max-w-2xl">
            <p className="text-xl sm:text-2xl lg:text-[1.7rem] text-[#dedacf] font-serif italic leading-[1.35] font-light">
              “Music is a natural and universal language.. But nobody knows what it’s about.”
            </p>
            <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#c49750] font-sans font-medium mt-2">
              — Gustav Holst
            </p>
          </div>

          <div className="text-base sm:text-lg text-[#b8b5ab] font-light leading-relaxed max-w-2xl mb-7 text-left space-y-3.5">
            {t.hero.summary.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

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

            {onScrollToMethod && (
              <button
                onClick={onScrollToMethod}
                className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-[#e6e2d8] hover:text-white border border-[#2f333c] hover:border-[#c49750]/60 rounded transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{t.hero.ctaMethod}</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#c49750]" />
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
