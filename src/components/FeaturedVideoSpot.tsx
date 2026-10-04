import React, { useState, useEffect } from 'react';
import { Play, Pause, Shuffle, Sparkles, Youtube, Volume2, ArrowUpRight } from 'lucide-react';
import { getStoredVideos, onMediaChange } from '../data/mediaStore';
import { SINGER_PORTRAIT_IMAGE } from '../data/content';
import { VideoItem } from '../types';
import { getYouTubeId, getYouTubeThumbnail } from '../utils/youtube';
import { useLanguage } from '../context/LanguageContext';

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
    <section id="studio-spotlight" className="py-20 px-6 bg-[#0e1014] border-y border-[#1e222a]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#c49750] font-medium mb-1.5">
              <span>{t.featuredVideo.eyebrow}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#f7f5f0] font-normal">
              {t.featuredVideo.title}
            </h2>
            <p className="text-sm text-[#9f9b8f] mt-1 max-w-xl">
              {t.featuredVideo.subtitle}
            </p>
          </div>

          {/* Randomizer / Shuffle Control */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleShuffle}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium uppercase tracking-wider text-[#dcd7cb] bg-[#171a21] hover:bg-[#202530] border border-[#2b303c] rounded transition-colors cursor-pointer"
              title="Pick a random lesson"
            >
              <Shuffle className="w-3.5 h-3.5 text-[#c49750]" />
              <span>{t.featuredVideo.shuffle}</span>
            </button>
            
            <a
              href="#gallery"
              className="text-xs text-[#9f9b8f] hover:text-[#d4af37] transition-colors py-2"
            >
              {isDe ? `Alle Videos ansehen (${videos.length}) →` : `See all videos (${videos.length}) →`}
            </a>
          </div>
        </div>

        {/* Video Player & Context Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Video Viewport */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#272b35] group shadow-2xl">
              
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
                    src={thumbnailSrc}
                    alt={activeVideo.title}
                    className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

                  {/* Top Bar */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-white/80 z-20">
                    <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded">
                      <Youtube className="w-4 h-4 text-red-500" />
                      <span className="font-medium tracking-wide">
                        {activeVideo.duration ? `Stage Recording · ${activeVideo.duration}` : 'YouTube Video'}
                      </span>
                    </div>
                    {activeVideo.tags && (
                      <div className="flex items-center gap-2">
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
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#c49750] text-black flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group-hover:bg-[#dfb26b]"
                      aria-label="Play video"
                    >
                      <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-black ml-1" />
                    </button>
                  </div>

                  {/* Bottom Info Bar inside player */}
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <div className="text-lg sm:text-xl font-serif text-white font-medium mb-1 drop-shadow-md">
                      {activeVideo.title}
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/70">
                      <span className="line-clamp-1">{activeVideo.description}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Video List */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <div>
              <div className="text-xs uppercase tracking-wider text-[#908c80] mb-3 font-medium">
                Stage Performances:
              </div>

              <div className="space-y-2.5">
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
