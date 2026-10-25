import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getStoredVideos, onMediaChange } from '../data/mediaStore';
import { SINGER_PORTRAIT_IMAGE } from '../data/content';
import { VideoItem } from '../types';
import { Play, Film, X, Volume2, Youtube } from 'lucide-react';
import { getYouTubeId, getYouTubeThumbnail } from '../utils/youtube';
import { useLanguage } from '../context/LanguageContext';
import { resolveAssetUrl } from '../utils/assetPath';

interface VideoGalleryProps {
  onOpenInquiry: (topic?: string) => void;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({ onOpenInquiry }) => {
  const { language } = useLanguage();
  const isDe = language === 'de';

  const [videos, setVideos] = useState<VideoItem[]>(getStoredVideos());
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'opera' | 'composition' | 'teaching'>('all');
  const [activeModalVideo, setActiveModalVideo] = useState<VideoItem | null>(null);
  const [isFullVideoModalOpen, setIsFullVideoModalOpen] = useState(false);
  const savedScrollY = React.useRef<number>(0);

  const openVideoModal = (video: VideoItem) => {
    savedScrollY.current = window.scrollY;
    setActiveModalVideo(video);
    document.body.style.overflow = 'hidden';
  };

  const closeVideoModal = () => {
    setActiveModalVideo(null);
    document.body.style.overflow = '';
    window.scrollTo({ top: savedScrollY.current, behavior: 'instant' });
  };

  const openFullVideoModal = () => {
    savedScrollY.current = window.scrollY;
    setIsFullVideoModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullVideoModal = () => {
    setIsFullVideoModalOpen(false);
    document.body.style.overflow = '';
    window.scrollTo({ top: savedScrollY.current, behavior: 'instant' });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalVideo && e.key === 'Escape') {
        closeVideoModal();
      } else if (isFullVideoModalOpen && e.key === 'Escape') {
        closeFullVideoModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalVideo, isFullVideoModalOpen]);

  useEffect(() => {
    const unsubscribe = onMediaChange(() => {
      setVideos(getStoredVideos());
    });
    return unsubscribe;
  }, []);

  const filteredVideos = videos.filter((v) => {
    if (selectedCategory === 'all') return true;
    return v.category === selectedCategory;
  });

  const activeYoutubeId = activeModalVideo ? getYouTubeId(activeModalVideo.youtubeUrl || activeModalVideo.youtubeId) : null;

  const renderVideoCard = (video: VideoItem, isLarge = false) => {
    const ytId = getYouTubeId(video.youtubeUrl || video.youtubeId);
    const thumb = video.thumbnail || (ytId ? getYouTubeThumbnail(ytId) : null) || SINGER_PORTRAIT_IMAGE;
    return (
      <div
        key={video.id}
        onClick={() => openVideoModal(video)}
        className="group rounded-xl overflow-hidden bg-[#11141b] border border-[#222530] cursor-pointer hover:border-[#c49750]/60 transition-all duration-300 flex flex-col justify-between shadow-md"
      >
        <div>
          {/* Thumbnail Container */}
          <div className="relative aspect-video overflow-hidden bg-black">
            <img
              src={resolveAssetUrl(thumb)}
              alt={video.title}
              className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

            {/* Duration Badge */}
            {video.duration && (
              <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[10px] font-mono text-[#dcd8cc]">
                {video.duration}
              </div>
            )}

            {/* Center Play Indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-[#c49750] text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-4 h-4 fill-black ml-0.5" />
              </div>
            </div>

            {/* Category kicker */}
            <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] uppercase font-mono text-[#c49750]">
              {video.category}
            </div>
          </div>

          {/* Text content - Compact */}
          <div className="p-3">
            <h4 className="text-xs sm:text-sm font-serif text-[#f2eee9] font-medium truncate mb-1 group-hover:text-[#c49750] transition-colors">
              {video.title}
            </h4>
            <p className="text-[11px] text-[#8c887d] line-clamp-1 leading-snug">
              {video.description}
            </p>
          </div>
        </div>

        {/* Bottom tags */}
        <div className="px-3 pb-2.5 pt-1.5 border-t border-white/5 flex items-center justify-between text-[10px] text-[#736f64]">
          <span className="font-mono truncate mr-2">{ytId ? 'Stage Live' : 'Studio'}</span>
          <span className="text-[#c49750] shrink-0 group-hover:underline">Play Video →</span>
        </div>
      </div>
    );
  };

  return (
    <div id="video-vault" className="bg-[#0e1118]/90 border border-[#212532] rounded-2xl p-4 sm:p-5 flex flex-col h-[520px] sm:h-[550px] shadow-xl">
      
      {/* Compact Fixed Header */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#21242d]">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#c49750] font-medium mb-0.5 flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5" />
            <span>{isDe ? 'Videothek' : 'Video Library'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif text-[#f4f2ec] font-normal">
            {isDe ? 'Video-Archiv & Repertoire' : 'Video Archive & Repertoire'}
          </h3>
        </div>

        {/* Filter Buttons & Full Modal Trigger */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#12141a] p-1 rounded-lg border border-[#22252e]">
            {[
              { id: 'all', label: isDe ? `Alle (${videos.length})` : `All (${videos.length})` },
              { id: 'opera', label: isDe ? 'Oper' : 'Opera' },
              { id: 'composition', label: isDe ? 'Eigenes' : 'Music' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-2 py-0.5 text-[11px] font-medium rounded transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#1e222b] text-[#f4f2ec] font-semibold border border-[#c49750]/50 shadow-sm'
                    : 'text-[#8c887d] hover:text-[#d4af37]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <button
            onClick={openFullVideoModal}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider text-[#dedacf] bg-[#171b26] hover:bg-[#202635] border border-[#2d3345] rounded-lg transition-all cursor-pointer"
            title={isDe ? 'Ganzes Archiv öffnen' : 'Open Full Archive'}
          >
            <Film className="w-3 h-3 text-[#c49750]" />
            <span>{isDe ? `Alle (${videos.length})` : `All (${videos.length})`}</span>
          </button>
        </div>
      </div>

      {/* Scrollable 2-Column Grid of Videos: Perfect size, scrolls smoothly when new videos added */}
      <div className="flex-1 overflow-y-auto pr-1 sm:pr-1.5 pt-3 pb-2 min-h-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredVideos.map((video) => renderVideoCard(video))}
        </div>
      </div>

      {/* Fixed Footer Bar */}
      <div className="shrink-0 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
        <span className="font-mono text-[#8c887d]">
          {isDe
            ? `${filteredVideos.length} Aufnahmen · Scrollen oder Anklicken`
            : `${filteredVideos.length} Recordings · Scroll or click to play`}
        </span>
        <button
          onClick={openFullVideoModal}
          className="inline-flex items-center gap-1.5 font-mono uppercase tracking-wider text-[#c49750] hover:text-[#d8a85c] transition-colors cursor-pointer"
        >
          <Film className="w-3.5 h-3.5" />
          <span>{isDe ? 'Ganzes Video-Archiv öffnen →' : 'Open Full Video Archive →'}</span>
        </button>
      </div>

      {/* FULL-SCREEN VIDEO VAULT MODAL */}
      {isFullVideoModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200"
          onClick={closeFullVideoModal}
        >
          <div
            className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 sm:p-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div>
                <h3 className="text-2xl font-serif text-white font-normal">
                  {isDe ? `Video-Archiv & Repertoire (${videos.length})` : `Video Archive & Repertoire (${videos.length})`}
                </h3>
              </div>
              <button
                onClick={closeFullVideoModal}
                className="p-2 rounded-lg bg-[#1a1e28] text-[#a09c91] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close Archive"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
                {filteredVideos.map((video) => renderVideoCard(video, true))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Video Player Modal: Centered with Scroll Lock */}
      {activeModalVideo && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 overflow-hidden"
          onClick={closeVideoModal}
        >
          <div
            className="relative max-w-4xl w-full bg-[#11141b] rounded-2xl overflow-hidden border border-[#272b36] shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#0c0e13] border-b border-white/10">
              <div className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-500" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#dedacf] truncate max-w-[280px] sm:max-w-md">
                  {activeModalVideo.title}
                </span>
              </div>
              <button
                onClick={closeVideoModal}
                className="p-1 rounded text-[#9c978b] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close screening modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Playback: Real YouTube Player if ID exists, or simulated preview */}
            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {activeYoutubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeYoutubeId}?autoplay=1&rel=0`}
                  title={activeModalVideo.title}
                  className="w-full h-full border-0 absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <img
                    src={activeModalVideo.thumbnail || SINGER_PORTRAIT_IMAGE}
                    alt={activeModalVideo.title}
                    className="w-full h-full object-cover filter brightness-[0.5]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 rounded-full bg-[#c49750] text-black flex items-center justify-center mb-3 animate-pulse">
                      <Volume2 className="w-8 h-8" />
                    </div>
                    <div className="text-xl font-serif text-white font-medium max-w-lg mb-2">
                      {activeModalVideo.title}
                    </div>
                    <div className="text-xs text-[#dcd7cb] max-w-md bg-black/60 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                      Sample lesson preview · Paste your YouTube link in content.ts to watch here
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer / Detailed Notes */}
            <div className="p-6 bg-[#0e1016] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase font-mono text-[#c49750] mb-1">
                  About this recording
                </div>
                <p className="text-xs text-[#a39f93] max-w-xl leading-relaxed">
                  {activeModalVideo.description}
                </p>
              </div>

              <button
                onClick={() => {
                  const topic = `Question about video: ${activeModalVideo.title}`;
                  closeVideoModal();
                  onOpenInquiry(topic);
                }}
                className="shrink-0 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded transition-all cursor-pointer"
              >
                Ask a Question About This
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
