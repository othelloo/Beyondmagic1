import React, { useState, useEffect } from 'react';
import { Award, Music2, Globe, Quote, ArrowDown } from 'lucide-react';
import { getStoredPortrait, onMediaChange } from '../data/mediaStore';

interface BiographyProps {
  onScrollToGallery: () => void;
  onOpenInquiry: (topic?: string) => void;
}

export const Biography: React.FC<BiographyProps> = ({ onScrollToGallery, onOpenInquiry }) => {
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
            <span>About Me</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>My Background</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif text-[#fbf9f5] font-normal leading-tight mb-4">
            How I Started at 20 and Learned Fast
          </h2>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-14">
          
          {/* Left Column: Portrait & Highlights */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            <div className="rounded-xl overflow-hidden border border-[#272b35] bg-[#12141a] shadow-2xl">
              <div className="relative overflow-hidden bg-[#0c0e12]">
                <img
                  src={portraitSrc}
                  alt="Portrait of the singer and teacher"
                  className="w-full h-auto block object-cover filter contrast-[1.02]"
                  style={{ aspectRatio: '630 / 454' }}
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-4 bg-[#111318] border-t border-[#222630]">
                <div className="text-xs uppercase tracking-widest text-[#c49750] mb-1 font-mono">
                  OPERA SINGER & TEACHER
                </div>
                <div className="text-base font-serif text-white">
                  Sharing a direct, practical way to learn music
                </div>
              </div>
            </div>

            {/* Quick summary points */}
            <div className="p-5 bg-[#12151d] rounded-xl border border-[#21242d] space-y-3.5">
              <div className="flex items-start gap-3">
                <Award className="w-4 h-4 text-[#c49750] shrink-0 mt-0.5" />
                <div className="text-xs text-[#b8b5ab]">
                  <strong className="text-[#eeeae0] block mb-0.5">Scholarship to France in 2 Years</strong>
                  Started learning music at 20; two years later won a scholarship to study singing in France.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-[#c49750] shrink-0 mt-0.5" />
                <div className="text-xs text-[#b8b5ab]">
                  <strong className="text-[#eeeae0] block mb-0.5">Career on European Opera Stages</strong>
                  Years of performing leading French, Italian, and classical roles in major theatres.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Music2 className="w-4 h-4 text-[#c49750] shrink-0 mt-0.5" />
                <div className="text-xs text-[#b8b5ab]">
                  <strong className="text-[#eeeae0] block mb-0.5">Teaching & Composing</strong>
                  Now focused on helping students, producers, and singers learn with their ears and feel confident.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Story */}
          <div className="lg:col-span-7 space-y-5 text-[#b5b1a4] font-light leading-relaxed text-sm sm:text-base">
            
            <p>
              I am an opera singer who has had a long career performing on stage. But my path started very differently from most classical musicians. I didn&apos;t grow up playing piano from age five. I actually started learning music when I was 20.
            </p>

            <p>
              Just two years later—which is quite a short amount of time—I was awarded a scholarship to go study music and singing in France.
            </p>

            <p>
              I want people to know this detail, but not to brag. In fact, quite the opposite: I say it because I want anyone who feels &ldquo;it&apos;s too late&rdquo; or &ldquo;music is too complicated&rdquo; to know that it is completely possible to learn fast. I learned fast because I used a specific method that prioritized educating my ear and feeling the sound, rather than spending years lost in abstract theory.
            </p>

            {/* Quote */}
            <div className="my-6 p-5 bg-[#13161f] border-l-2 border-[#c49750] rounded-r-xl">
              <Quote className="w-5 h-5 text-[#c49750]/50 mb-1.5" />
              <p className="font-serif italic text-base text-[#dedacf] leading-relaxed">
                &ldquo;On stage, with an orchestra playing around you, you don&apos;t think about textbook rules. You listen, you feel the emotion of the sound, and you speak your truth. That is what I want to teach you.&rdquo;
              </p>
            </div>

            <p>
              Throughout my years singing across France and Europe, I kept seeing the same problems. I saw young musicians who had spent years memorizing theory but felt insecure making sound. I met beatmakers and producers who had great musical taste, but got stuck clicking randomly in FL Studio because nobody ever showed them how chords really work. And I saw international singers struggle with French pronunciation because nobody explained how French vowels physically work in the mouth.
            </p>

            <p>
              That is why I created these lessons. Whether you are learning music from scratch, producing modern beats, or preparing French opera—my goal is to give you simple, practical tools so you can make honest music with confidence.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onScrollToGallery}
                className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#eeeae0] hover:text-white border border-[#2b303d] hover:border-[#c49750] rounded transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>See Photos & Videos</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#c49750]" />
              </button>

              <button
                onClick={() => onOpenInquiry('General inquiry with the teacher')}
                className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded transition-all cursor-pointer shadow-md"
              >
                Contact Me / Ask a Question
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
