import React from 'react';
import { PhotoGallery } from './PhotoGallery';
import { VideoGallery } from './VideoGallery';
import { useLanguage } from '../context/LanguageContext';

interface MediaSectionProps {
  onOpenInquiry: (topic?: string) => void;
}

export const MediaSection: React.FC<MediaSectionProps> = ({ onOpenInquiry }) => {
  const { language, t } = useLanguage();
  const isDe = language === 'de';

  return (
    <section id="gallery" className="pt-3 sm:pt-6 lg:pt-10 pb-14 sm:pb-20 px-4 sm:px-6 bg-[#0b0c0e] border-t border-[#1e222a]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#c49750] font-medium mb-2">
              <span>{t.media.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif text-[#fbf9f5] font-normal leading-tight mb-3">
              {t.media.title}
            </h2>

            <p className="text-sm sm:text-base text-[#9e9a8e] font-light leading-relaxed">
              {t.media.subtitle}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => onOpenInquiry('Sending audio/video sample')}
              className="text-xs text-[#a8a497] hover:text-[#c49750] transition-colors py-2"
            >
              {isDe ? 'Sind Sie Sänger? Hörprobe einsenden →' : 'Are you a student? Submit your sample here →'}
            </button>
          </div>
        </div>

        {/* Side-by-Side Media Grid: Videos on the left, Photo Gallery Preview on the right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Video Archive */}
          <div className="lg:col-span-6 xl:col-span-6">
            <VideoGallery onOpenInquiry={onOpenInquiry} />
          </div>

          {/* Right Column: Photo Gallery Preview */}
          <div className="lg:col-span-6 xl:col-span-6">
            <PhotoGallery />
          </div>
        </div>

      </div>
    </section>
  );
};
