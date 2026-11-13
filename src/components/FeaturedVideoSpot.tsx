import React, { useState, useEffect } from 'react';
import { Play, Pause, Shuffle, Sparkles, Youtube, Volume2, ArrowUpRight } from 'lucide-react';
import { getStoredVideos, onMediaChange } from '../data/mediaStore';
import { SINGER_PORTRAIT_IMAGE } from '../data/content';
import { VideoItem } from '../types';
import { getYouTubeId, getYouTubeThumbnail } from '../utils/youtube';
import { useLanguage } from '../context/LanguageContext';
import { resolveAssetUrl } from '../utils/assetPath';

interface FeaturedVideoSpotProps {
  onOpenInquiry: (defaultTopic?: string) => void;
  onOpenSpirituality: () => void;
}

export const FeaturedVideoSpot: React.FC<FeaturedVideoSpotProps> = ({
  onOpenInquiry,
  onOpenSpirituality
}) => {
  const { language, t } = useLanguage();
  const isDe = language === 'de';
  const [videos, setVideos] = useState<VideoItem[]>(getStoredVideos());
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onMediaChange(() => {
      const updated = getStoredVideos();
      setVideos(updated);
      if (currentIndex >= updated.length) {
        setCurrentIndex(0);
      }
    });
    return unsubscribe;
  }, [currentIndex]);

  const activeVideo: VideoItem = videos[currentIndex] || videos[0] || {
    id: 'placeholder',
    title: 'Music Lesson',
    category: 'teaching',
    description: 'Lesson recording'
  };
  const youtubeId = getYouTubeId(activeVideo.youtubeUrl || activeVideo.youtubeId);
  const thumbnailSrc = activeVideo.thumbnail || (youtubeId ? getYouTubeThumbnail(youtubeId) : null) || SINGER_PORTRAIT_IMAGE;

  const handleShuffle = () => {
    if (videos.length <= 1) return;
    let nextIndex = Math.floor(Math.random() * videos.length);
    if (nextIndex === currentIndex) {
      nextIndex = (currentIndex + 1) % videos.length;
    }
    setCurrentIndex(nextIndex);
    setIsPlaying(false);
  };

  const handleSelect = (idx: number) => {
    setCurrentIndex(idx);
    setIsPlaying(false);
  };

  return (
    <section id="studio-spotlight" className="pt-3 sm:pt-6 lg:pt-10 pb-10 sm:pb-14 lg:pb-20 px-4 sm:px-6 bg-[#0e1014] border-y border-[#1e222a]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 sm:mb-6 lg:mb-8 gap-3 lg:gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#c49750] font-medium mb-1">
              <span>{t.featuredVideo.eyebrow}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#f7f5f0] font-normal">
              {t.featuredVideo.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#9f9b8f] mt-0.5 max-w-xl line-clamp-2">
              {t.featuredVideo.subtitle}
            </p>
          </div>

          {/* Randomizer / Shuffle Control */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleShuffle}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-medium uppercase tracking-wider text-[#dcd7cb] bg-[#171a21] hover:bg-[#202530] border border-[#2b303c] rounded transition-colors cursor-pointer"
              title="Pick a random lesson"
            >
              <Shuffle className="w-3.5 h-3.5 text-[#c49750]" />
              <span>{t.featuredVideo.shuffle}</span>
            </button>
            
            <a
              href="#gallery"
              className="text-xs text-[#9f9b8f] hover:text-[#d4af37] transition-colors py-1.5"
            >
              {isDe ? `Alle Videos ansehen (${videos.length}) →` : `See all videos (${videos.length}) →`}
            </a>
          </div>
        </div>

        {/* Video Player & Context Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-8 items-stretch">
          
          {/* Main Video Viewport */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="relative aspect-video lg:aspect-video max-h-[240px] sm:max-h-[340px] lg:max-h-none w-full rounded-xl overflow-hidden bg-black border border-[#272b35] group shadow-2xl">
              
              {/* If playing and has YouTube ID, render actual YouTube player */}
              {isPlaying && youtubeId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  className="w-full h-full border-0 absolute inset-0 z-30"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  {/* Thumbnail */}
                  <img
                    src={resolveAssetUrl(thumbnailSrc)}
                    alt={activeVideo.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

                  {/* Top Bar */}
                  <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex items-center justify-between text-xs text-white/80 z-20">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded">
                      <Youtube className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
                      <span className="font-medium tracking-wide text-[11px] sm:text-xs">
                        {activeVideo.duration ? `Stage Recording · ${activeVideo.duration}` : 'YouTube Video'}
                      </span>
                    </div>
                    {activeVideo.tags && (
                      <div className="hidden sm:flex items-center gap-2">
                        {activeVideo.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded text-[11px] text-[#dedacf]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Center Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <button
                      onClick={() => setIsPlaying(true)}
                      className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-[#c49750] text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group-hover:bg-[#dfb26b]"
                      aria-label="Play video"
                    >
                      <Play className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 fill-black ml-1" />
                    </button>
                  </div>

                  {/* Bottom Info Bar inside player */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-20">
                    <div className="text-base sm:text-lg lg:text-xl font-serif text-white font-medium mb-0.5 drop-shadow-md line-clamp-1">
                      {activeVideo.title}
                    </div>
                    <div className="flex items-center justify-between text-[11px] sm:text-xs text-white/70">
                      <span className="line-clamp-1">{activeVideo.description}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Video List: Compact scrollable pane on Mobile & Tablet (< lg) so it reaches on one screen; full list on Desktop (lg+) */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <div>
              <div className="flex items-center justify-between mb-2 lg:mb-3">
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-[#908c80] font-medium">
                  {isDe ? 'Bühnenaufnahmen:' : 'Stage Performances:'}
                </span>
                <span className="text-[10px] font-mono text-[#c49750]/80 lg:hidden">
                  {currentIndex + 1} / {videos.length} · {isDe ? 'Scrollen' : 'Scroll'}
                </span>
              </div>

              {/* Mobile & Tablet (< lg): Compact internally scrollable list of titles reachable in one viewport */}
              <div className="lg:hidden max-h-[164px] sm:max-h-[192px] overflow-y-auto thin-scrollbar pr-1 space-y-1.5">
                {videos.map((vid, idx) => {
                  const isSelected = idx === currentIndex;
                  return (
                    <button
                      type="button"
                      key={vid.id}
                      onClick={() => handleSelect(idx)}
                      className={`w-full px-3 py-2 rounded-lg border cursor-pointer transition-all duration-150 text-left flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? 'bg-[#1b1f28] border-[#c49750]/70 shadow-sm'
                          : 'bg-[#13151b] border-[#22252e] hover:border-[#333744] hover:bg-[#161921]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`text-[11px] font-mono shrink-0 ${isSelected ? 'text-[#c49750] font-semibold' : 'text-[#8c887d]'}`}>
                          0{idx + 1}
                        </span>
                        <span className={`text-xs sm:text-sm font-medium truncate ${isSelected ? 'text-[#fbf9f5]' : 'text-[#cfc9bc]'}`}>
                          {vid.title}
                        </span>
                      </div>
                      {vid.duration && (
                        <span className="text-[10px] text-[#7d796e] font-mono shrink-0">
                          {vid.duration}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Desktop (lg+): Full descriptive playlist */}
              <div className="hidden lg:block space-y-2.5 max-h-[460px] overflow-y-auto thin-scrollbar pr-1">
                {videos.map((vid, idx) => {
                  const isSelected = idx === currentIndex;
                  return (
                    <div
                      key={vid.id}
                      onClick={() => handleSelect(idx)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all duration-200 text-left ${
                        isSelected
                          ? 'bg-[#1b1f28] border-[#c49750]/60 shadow-md'
                          : 'bg-[#13151b] border-[#22252e] hover:border-[#333744] hover:bg-[#161921]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-mono text-[#c49750]">
                          0{idx + 1}
                        </span>
                        {vid.duration && (
                          <span className="text-[11px] text-[#7d796e] font-mono">{vid.duration}</span>
                        )}
                      </div>
                      <div className="text-sm font-medium text-[#eae6dc] line-clamp-1 mb-1">
                        {vid.title}
                      </div>
                      <div className="text-xs text-[#8f8c81] line-clamp-1">
                        {vid.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
