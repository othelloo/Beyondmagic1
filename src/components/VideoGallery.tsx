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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalVideo && e.key === 'Escape') {
        closeVideoModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalVideo]);

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

  return (
    <div id="video-vault" className="pt-8">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-[#21242d] pb-6">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#c49750] font-medium mb-1 flex items-center gap-2">
            <Film className="w-3.5 h-3.5" />
            <span>{isDe ? 'Videothek' : 'Video Library'}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif text-[#f4f2ec] font-normal">
            {isDe ? 'Video-Archiv & Repertoire' : 'Video Archive & Repertoire'}
          </h3>
          <p className="text-xs sm:text-sm text-[#8c887d] mt-1">
            {isDe ? 'Aufführungen von europäischen Opernbühnen, französische Liederabende und eigene Kompositionen.' : 'Performances from European opera stages, live French recitals, and my own musical compositions.'}
          </p>
        </div>

        {/* Filter Pills / Buttons (Functional interactive controls) */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#12141a] p-1.5 rounded-lg border border-[#22252e]">
          {[
            { id: 'all', label: isDe ? 'Alle Aufnahmen' : 'All Recordings' },
            { id: 'opera', label: isDe ? 'Operngesang & Liederabende' : 'Singing in Opera & Recitals' },
            { id: 'composition', label: isDe ? 'Eigene Kompositionen' : 'My Own Music' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#1e222b] text-[#f4f2ec] shadow-sm font-semibold border border-[#c49750]/50'
                  : 'text-[#8c887d] hover:text-[#d4af37]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => {
          const ytId = getYouTubeId(video.youtubeUrl || video.youtubeId);
          const thumb = video.thumbnail || (ytId ? getYouTubeThumbnail(ytId) : null) || SINGER_PORTRAIT_IMAGE;
          return (
            <div
              key={video.id}
              onClick={() => openVideoModal(video)}
              className="group rounded-xl overflow-hidden bg-[#12151c] border border-[#222630] cursor-pointer hover:border-[#c49750]/60 transition-all duration-300 flex flex-col justify-between shadow-lg"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Duration Badge */}
                  {video.duration && (
                    <div className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-mono text-[#dcd8cc]">
                      {video.duration}
                    </div>
                  )}

                  {/* Center Play Indicator */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#c49750] text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-black ml-0.5" />
                    </div>
                  </div>

                  {/* Category kicker */}
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] uppercase font-mono text-[#c49750]">
                    {video.category}
                  </div>
                </div>

                {/* Text content */}
                <div className="p-5">
                  <h4 className="text-base font-serif text-[#f2eee9] font-medium line-clamp-1 mb-2 group-hover:text-[#c49750] transition-colors">
                    {video.title}
                  </h4>
                  <p className="text-xs text-[#8c887d] line-clamp-2 leading-relaxed mb-4">
                    {video.description}
                  </p>
                </div>
              </div>

              {/* Bottom tags */}
              <div className="px-5 pb-4 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#736f64]">
                <span className="font-mono">{ytId ? 'YouTube Video' : 'Lesson Video'}</span>
                <span className="text-[#c49750] group-hover:underline">Watch Video →</span>
              </div>
            </div>
          );
        })}
      </div>

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
