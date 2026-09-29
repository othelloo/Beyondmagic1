import React from 'react';
import { GraduationCap, Sliders, Headphones, Check, ArrowRight } from 'lucide-react';

interface TargetAudiencesProps {
  onOpenInquiry: (topic: string) => void;
}

export const TargetAudiences: React.FC<TargetAudiencesProps> = ({ onOpenInquiry }) => {
  const audiences = [
    {
      id: 'students',
      icon: GraduationCap,
      category: 'LEARN FAST',
      title: 'Students & Beginners',
      subtitle: 'For people who need to learn music, or who want to learn fast',
      description: 'You don’t have to spend five years doing boring drills before you can make real music. By training your ear first, you learn to read notes much faster and build true confidence singing or playing your instrument.',
      features: [
        'Learn to read sheet music faster by hearing the notes in your head first',
        'Recognize intervals and chords easily without overthinking',
        'Build natural pitch and singing confidence',
        'Prepare for music school exams or choir auditions without stress'
      ],
      cta: 'Start as a Student'
    },
    {
      id: 'producers',
      icon: Sliders,
      category: 'BEATS & HARMONY',
      title: 'Music Producers & Beatmakers',
      subtitle: 'For producers who want to finally understand how music works instead of just clicking around in FL Studio',
      description: 'If you produce in FL Studio or Ableton, you probably know your software well, but sometimes feel stuck choosing chords or repeating the same patterns. I help you understand how chords work, educate your ear, and borrow ideas from classical music (like Debussy or Ravel) to make your tracks richer and more expressive.',
      features: [
        'Ear education tailored to how producers make beats and tracks',
        'Learn why certain chords sound beautiful, dark, or tense',
        'Bring elements from classical music to enrich your beats',
        'Stop relying on random chord packs and build your own unique sound'
      ],
      cta: 'Explore Producer Lessons'
    },
    {
      id: 'listeners',
      icon: Headphones,
      category: 'ACTIVE LISTENING',
      title: 'Music Lovers & Curious Listeners',
      subtitle: 'For people who want to listen to music differently',
      description: 'You don’t need to play an instrument to enjoy music on a deeper level. When you learn to recognize what chords and melodies are actually doing, the music sounds—and feels—completely different. You begin to notice colors and emotions you never caught before.',
      features: [
        'Learn how to feel the tension and release inside any song',
        'Discover classical music, opera, and film scores with a guide',
        'Understand what makes great melodies touch people so deeply',
        'A fun, relaxed way to train your ear without any exams'
      ],
      cta: 'Join Listening Sessions'
    }
  ];

  return (
    <section id="audiences" className="py-20 px-6 bg-[#0e1015] border-t border-[#1e222a]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-[#c49750] font-medium mb-3">
            <span>Tailored Lessons</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>Choose Your Goal</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif text-[#fbf9f5] font-normal mb-3">
            Who These Lessons Are For
          </h2>
          
          <p className="text-sm sm:text-base text-[#9e9a8e] font-light leading-relaxed">
            I teach people at different stages of their musical journey. The ear-first method adapts directly to what you want to achieve.
          </p>
        </div>

        {/* 3 Audience Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {audiences.map((aud) => {
            const IconComponent = aud.icon;
            return (
              <div
                key={aud.id}
                className="bg-[#12151d] border border-[#232733] rounded-2xl p-7 flex flex-col justify-between hover:border-[#c49750]/50 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#c49750]">
                      {aud.category}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-[#1a1e28] border border-[#2b303e] flex items-center justify-center text-[#c49750] group-hover:bg-[#c49750] group-hover:text-black transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif text-[#f2eee9] mb-2 font-normal">
                    {aud.title}
                  </h3>

                  <p className="text-xs text-[#c49750] font-medium mb-3 italic">
                    {aud.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-[#9f9b8f] leading-relaxed mb-6 font-light">
                    {aud.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-[#1e222b]">
                    {aud.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#cfccc3]">
                        <Check className="w-3.5 h-3.5 text-[#c49750] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-[#1e222b]">
                  <button
                    onClick={() => onOpenInquiry(`Track: ${aud.title}`)}
                    className="w-full py-3 px-4 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>{aud.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
