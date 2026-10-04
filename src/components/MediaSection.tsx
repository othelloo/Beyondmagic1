import React, { useState } from 'react';
import { PhotoGallery } from './PhotoGallery';
import { VideoGallery } from './VideoGallery';
import { MediaManagerModal } from './MediaManagerModal';
import { useLanguage } from '../context/LanguageContext';

interface MediaSectionProps {
  onOpenInquiry: (topic?: string) => void;
}

export const MediaSection: React.FC<MediaSectionProps> = ({ onOpenInquiry }) => {
  const [managerOpen, setManagerOpen] = useState(false);
  const { language, t } = useLanguage();
  const isDe = language === 'de';

  return (
    <section id="gallery" className="py-24 px-6 bg-[#0b0c0e] border-t border-[#1e222a]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
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

          {/* Discreet Studio Owner Media Manager */}
          <div className="shrink-0 flex items-center gap-3">
            <button
              onClick={() => onOpenInquiry('Sending audio/video sample')}
              className="text-xs text-[#a8a497] hover:text-[#c49750] transition-colors py-2"
            >
              {isDe ? 'Sind Sie Sänger? Hörprobe einsenden →' : 'Are you a student? Submit your sample here →'}
            </button>

            <button
              onClick={() => setManagerOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono tracking-wider text-[#d4af37] bg-[#1a1e28] hover:bg-[#222838] border border-[#c49750]/30 transition-all cursor-pointer shadow-sm"
              title="Studio Owner: Add or manage official gallery photos & videos"
            >
              <span>{isDe ? '⚙ Inhaber: Galerie verwalten' : '⚙ Owner: Manage Gallery'}</span>
            </button>
          </div>
        </div>

        {/* Video Gallery (Opera singing, live stage, repertoire) */}
        <VideoGallery onOpenInquiry={onOpenInquiry} />

        {/* Photo Galleries (Singing in Productions & Behind the Scenes) */}
        <PhotoGallery />

      </div>

      {/* Media Manager Modal */}
      <MediaManagerModal
        isOpen={managerOpen}
        onClose={() => setManagerOpen(false)}
      />
    </section>
  );
};
