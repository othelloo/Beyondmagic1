import React from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { HarmonicExperienceDemo } from './HarmonicExperienceDemo';

interface TheMethodProps {
  onOpenInquiry: (defaultTopic?: string) => void;
  onOpenSpirituality: () => void;
}

export const TheMethod: React.FC<TheMethodProps> = ({ onOpenInquiry, onOpenSpirituality }) => {
  return (
    <section id="the-method" className="py-20 px-6 bg-[#0b0c0e] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#c49750] font-medium mb-3">
            <span>The Core Approach</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>How I Teach</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif text-[#fbf9f5] font-normal leading-tight mb-5">
            The Method: Educate the Ear First
          </h2>

          <p className="text-base text-[#b8b5ab] font-light leading-relaxed">
            The usual way of studying music consists of learning to read notes and memorizing a lot of theory. That is good, but it makes us lose precious time. We often forget something fundamental: written notes are just a representation—and a quite poor one—of real music.
          </p>
        </div>

        {/* The Two Sides: Comparing the common way vs. the ear method */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-stretch">
          
          {/* Card 1: What happens normally */}
          <div className="lg:col-span-6 bg-[#111319] border border-[#20242e] rounded-xl p-7 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono uppercase text-[#e11d48] tracking-wider mb-2">
                The common way
              </div>
              <h3 className="text-xl font-serif text-[#f2eee9] mb-3 font-normal">
                Spending years decoding paper
              </h3>
              <p className="text-sm text-[#a8a497] leading-relaxed mb-4 font-light">
                Music is a natural language that everyone already understands. When you hear a sad song or an energetic rhythm, you feel it immediately without needing to read anything.
              </p>
              <p className="text-sm text-[#a8a497] leading-relaxed font-light">
                When schools force students to start with written notes and dry rules, people spend years translating symbols into sounds instead of just playing or singing. It takes forever, and people often lose their love for music along the way.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-xs text-[#807c70]">
              The result: students get stuck thinking about rules instead of feeling the music.
            </div>
          </div>

          {/* Card 2: The Ear-First Approach */}
          <div className="lg:col-span-6 bg-[#141720] border border-[#c49750]/30 rounded-xl p-7 flex flex-col justify-between shadow-xl">
            <div>
              <div className="text-xs font-mono uppercase text-[#c49750] tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>My approach</span>
              </div>
              <h3 className="text-xl font-serif text-[#f2eee9] mb-3 font-normal">
                Focus on: &ldquo;How does this sound affect me?&rdquo;
              </h3>
              <p className="text-sm text-[#cfccc2] leading-relaxed mb-4 font-light">
                Instead of learning a notation code and trying to translate it, I start by educating your ear. We concentrate on one simple question: <strong className="text-white font-normal">how does this chord or melody affect me, and how can I recognize that feeling?</strong>
              </p>
              <p className="text-sm text-[#cfccc2] leading-relaxed font-light">
                This is how I learned. I started at 20, and two years later I had a scholarship to study in France. When your ear knows what a sound feels like, reading notes becomes easy, and making music feels natural.
              </p>
            </div>

            {/* Spirituality tie-in in simple terms */}
            <div className="mt-6 pt-4 border-t border-[#c49750]/20 bg-[#0e1015]/60 -mx-3 -mb-3 p-4 rounded-b-lg">
              <div className="text-xs text-[#c49750] font-medium uppercase tracking-wider mb-1">
                Music vs. Spirituality
              </div>
              <p className="text-xs text-[#b0aba0] leading-relaxed">
                In my music lessons, the question is: <span className="text-white italic">&ldquo;How does this music affect me?&rdquo;</span>
                <br />
                In my spirituality talks, the question becomes: <span className="text-[#c49750] italic">&ldquo;Why does it affect me that way?&rdquo;</span>
              </p>
            </div>
          </div>

        </div>

        {/* The 3 Simple Results */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-2xl font-serif text-[#f4f2ec] font-normal mb-2">
              Three things happen when you train your ear
            </h3>
            <p className="text-xs text-[#8c887d]">
              Simple, practical benefits you notice right away
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-[#101217] border border-[#20232c] p-6 rounded-xl">
              <div className="text-xs font-mono text-[#c49750] mb-2">01 / FASTER READING</div>
              <h4 className="text-base font-serif text-[#f2eee9] mb-2 font-medium">
                You read notes much faster
              </h4>
              <p className="text-xs text-[#9f9b8f] leading-relaxed font-light">
                Because your ear already knows what the next note or chord will feel like, the sheet music is just a quick reminder. You don't have to calculate every note one by one.
              </p>
            </div>

            <div className="bg-[#101217] border border-[#20232c] p-6 rounded-xl">
              <div className="text-xs font-mono text-[#c49750] mb-2">02 / DEEPER LISTENING</div>
              <h4 className="text-base font-serif text-[#f2eee9] mb-2 font-medium">
                Music feels richer when you listen
              </h4>
              <p className="text-xs text-[#9f9b8f] leading-relaxed font-light">
                When you recognize how chords resolve and create tension, the music sounds completely different. You hear layers and emotions you never noticed before.
              </p>
            </div>

            <div className="bg-[#101217] border border-[#20232c] p-6 rounded-xl">
              <div className="text-xs font-mono text-[#c49750] mb-2">03 / HONEST CREATION</div>
              <h4 className="text-base font-serif text-[#f2eee9] mb-2 font-medium">
                You make music that actually means something
              </h4>
              <p className="text-xs text-[#9f9b8f] leading-relaxed font-light">
                Whether you produce beats or compose, you stop copying formulas or making things that sound pretty but empty. You know how to put what you actually feel into sound.
              </p>
            </div>

          </div>
        </div>

        {/* Interactive Experiment Embedded */}
        <div className="mb-12">
          <HarmonicExperienceDemo />
        </div>

        {/* Simple Bottom Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-[#13151c] rounded-xl border border-[#22252e] gap-4">
          <div>
            <div className="text-sm font-serif text-[#f4f2ec] font-medium">
              Want to see how this works for you?
            </div>
            <div className="text-xs text-[#8c887d]">
              Lessons for students, music producers, and singers — online or in Paris.
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenInquiry('Lessons about The Method')}
              className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded transition-all cursor-pointer"
            >
              Ask a Question / Book
            </button>
            <button
              onClick={onOpenSpirituality}
              className="text-xs text-[#c49750] hover:underline px-3 py-2 cursor-pointer"
            >
              The Spirituality Question →
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
