import React, { useState, useEffect } from 'react';
import { ArrowDown, Play, Eye, AlignLeft, Camera, Check } from 'lucide-react';
import { getStoredPortrait, savePortrait, onMediaChange } from '../data/mediaStore';

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
  const [heroVisualMode, setHeroVisualMode] = useState<'portrait' | 'textOnly'>('portrait');
  const [portraitSrc, setPortraitSrc] = useState<string>(getStoredPortrait());
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [justUploaded, setJustUploaded] = useState<boolean>(false);

  useEffect(() => {
    const unsub = onMediaChange(() => {
      setPortraitSrc(getStoredPortrait());
    });
    return unsub;
  }, []);

  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        setPortraitSrc(dataUrl);
        await savePortrait(dataUrl);
        setIsUploading(false);
        setJustUploaded(true);
        setTimeout(() => setJustUploaded(false), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-28 pb-16 px-6 overflow-hidden">
      {/* Gentle ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#c49750]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        
        {/* Left Column: Clear, humble, direct message */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          
          <div className="flex items-center gap-2 text-xs md:text-sm tracking-[0.2em] uppercase text-[#c49750] font-medium mb-4">
            <span>Specialized Music Lessons</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>Opera & Diction Coaching</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>Ear Education</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal leading-[1.18] text-[#fbf9f5] tracking-tight mb-6 text-balance">
            Music is a natural language everyone understands.
            <br />
            <span className="italic font-light text-[#c49750]">
              Notes on paper are only a representation.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#b8b5ab] font-light leading-relaxed max-w-2xl mb-6">
            I started learning music at 20. Just two years later, I received a scholarship to study in France. It happened fast not through magic talent, but through a <strong className="text-white font-normal">feel-first method</strong>: training auditory memory and feeling the harmonic resonance before getting lost in dry rules.
          </p>

          {/* Simple Premise Box */}
          <div className="border-l-2 border-[#c49750]/60 pl-5 py-2 mb-8 max-w-xl bg-white/[0.02] rounded-r-lg">
            <p className="text-sm italic text-[#dedacf] leading-relaxed">
              &ldquo;Written notes are just a drawing of sound. When you start by asking &lsquo;How does this music affect me?&rsquo; and recognize the feeling, you learn to read faster, hear deeper, and make honest music—writing what you truly feel rather than what merely seems aesthetically &lsquo;beautiful&rsquo;.&rdquo;
            </p>
            <div className="text-xs text-[#9c988c] mt-2 font-sans not-italic">
              Available in NRW, Germany, Berlin, or online worldwide.
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onOpenInquiry('General Lesson Consultation')}
              className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded transition-all shadow-lg cursor-pointer"
            >
              Get in Touch / Book a Lesson
            </button>

            <button
              onClick={onScrollToMethod}
              className="px-5 py-3.5 text-xs font-medium uppercase tracking-wider text-[#e6e2d8] hover:text-white border border-[#2f333c] hover:border-[#c49750]/60 rounded transition-all cursor-pointer flex items-center gap-2"
            >
              <span>How The Method Works</span>
              <ArrowDown className="w-3.5 h-3.5 text-[#c49750]" />
            </button>

            <button
              onClick={onScrollToVideo}
              className="text-xs text-[#b8b5ab] hover:text-[#d4af37] transition-colors flex items-center gap-1.5 px-3 py-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
              <span>Watch Video Intro</span>
            </button>
          </div>
        </div>

          {/* Right Column: Visual Frame (Picture Only) */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-end">
          <div className="w-full max-w-lg lg:max-w-xl">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="relative group rounded-2xl overflow-hidden border border-[#272b35] bg-[#121419] shadow-2xl transition-all duration-300"
            >
              {/* Photo Upload Overlay Button */}
              <label className="absolute top-3.5 right-3.5 z-30 cursor-pointer bg-black/85 hover:bg-black text-[11px] font-medium text-[#c49750] hover:text-white px-3.5 py-1.5 rounded-full border border-[#c49750]/60 backdrop-blur-md flex items-center gap-1.5 transition-all shadow-xl hover:scale-105 active:scale-95">
                {justUploaded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-300">Photo Updated!</span>
                  </>
                ) : isUploading ? (
                  <span className="text-[#e2ded5]">Processing...</span>
                ) : (
                  <>
                    <Camera className="w-3.5 h-3.5 text-[#c49750]" />
                    <span>Upload My Real Photo</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileInputChange}
                />
              </label>

              {/* Uncropped Photo: Exact 630 / 454 Proportion */}
              <div className="relative overflow-hidden bg-[#0c0e12]">
                <img
                  src={portraitSrc}
                  alt="Abdellah Lasri - Opera Singer and Vocal Mentor"
                  className="w-full h-auto block object-cover filter contrast-[1.02] group-hover:scale-[1.01] transition-transform duration-700"
                  style={{ aspectRatio: '630 / 454' }}
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-5 bg-[#111318] border-t border-[#222630]">
                <div className="flex items-center justify-between text-xs text-[#c49750] uppercase font-mono tracking-wider mb-1.5">
                  <span>Tenor & Music Mentor</span>
                  <span className="text-[#8c887d] text-[11px]">NRW · Berlin · European Stage</span>
                </div>
                <p className="text-sm font-serif text-[#f2eee9] italic leading-relaxed">
                  &ldquo;When you connect with what sound actually feels like, everything clicks.&rdquo;
                </p>
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#959185]">
                  <span>Opéra National de Paris · Berlin</span>
                  <span aria-hidden="true">·</span>
                  <span>Feel-First Pedagogy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
