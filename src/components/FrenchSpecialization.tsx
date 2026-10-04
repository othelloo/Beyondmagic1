import React, { useState } from 'react';
import { SPECIALIZED_COURSES } from '../data/content';
import { Check, ShieldCheck, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FrenchSpecializationProps {
  onOpenInquiry: (topic: string) => void;
}

export const FrenchSpecialization: React.FC<FrenchSpecializationProps> = ({ onOpenInquiry }) => {
  const { language, t } = useLanguage();
  const isDe = language === 'de';
  const [activeCourseId, setActiveCourseId] = useState<string>('anatomy-ipa-intensive');

  const activeCourse = SPECIALIZED_COURSES.find((c) => c.id === activeCourseId) || SPECIALIZED_COURSES[2];

  return (
    <section id="specializations" className="py-20 px-6 bg-[#0b0c0e]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#c49750] font-medium mb-3">
            <span>{t.french.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif text-[#fbf9f5] font-normal leading-tight mb-4">
            {t.french.title}
          </h2>

          <p className="text-base text-[#b8b5ab] font-light leading-relaxed">
            {t.french.subtitle}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 border-b border-[#21242d] pb-4">
          {SPECIALIZED_COURSES.map((course) => {
            const isSelected = course.id === activeCourseId;
            const isOneTime = course.id === 'anatomy-ipa-intensive';
            return (
              <button
                key={course.id}
                onClick={() => setActiveCourseId(course.id)}
                className={`py-3 px-4 rounded-lg text-left transition-all cursor-pointer flex-1 border ${
                  isSelected
                    ? 'bg-[#181c25] border-[#c49750] text-white shadow-md'
                    : 'bg-[#111319] border-[#22252e] text-[#8e8b80] hover:text-[#d4af37] hover:border-[#383d4c]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#c49750]">
                    {isOneTime
                      ? (isDe ? '★ EINMALIGER WORKSHOP' : '★ ONE-TIME WORKSHOP')
                      : (isDe ? 'FORTLAUFENDES COACHING' : 'ONGOING COACHING')}
                  </span>
                </div>
                <div className="text-sm font-serif font-medium line-clamp-1">{course.title}</div>
              </button>
            );
          })}
        </div>

        {/* Active Course Box */}
        <div className="bg-[#12151d] rounded-2xl border border-[#272b36] p-7 sm:p-9 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="text-xs font-mono text-[#c49750] uppercase tracking-wider mb-1">
                  {activeCourse.format}
                </div>

                <h3 className="text-2xl font-serif text-[#f4f2ec] font-normal mb-1">
                  {activeCourse.title}
                </h3>

                <p className="text-sm text-[#c49750] italic mb-4">
                  {activeCourse.subtitle}
                </p>

                <p className="text-sm text-[#b5b1a4] leading-relaxed mb-6 font-light">
                  {activeCourse.description}
                </p>

                {/* Who it is for */}
                <div className="p-4 bg-[#181b24] rounded-xl border border-[#252936] mb-6">
                  <div className="text-xs uppercase tracking-wider text-[#8e8b80] mb-1 font-mono">
                    {isDe ? 'Für wen dieser Kurs gedacht ist:' : 'Who this is for:'}
                  </div>
                  <div className="text-xs sm:text-sm text-[#dedacf]">
                    {activeCourse.audience}
                  </div>
                </div>

                {/* Practical takeaways */}
                <div>
                  <div className="text-xs uppercase tracking-wider text-[#8e8b80] mb-2.5 font-semibold">
                    {isDe ? 'Ihre konkreten Ergebnisse:' : 'What you will take away:'}
                  </div>
                  <div className="space-y-2">
                    {activeCourse.takeaways.map((takeaway, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#cfccc2]">
                        <Check className="w-3.5 h-3.5 text-[#c49750] shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 bg-[#0b0d12] rounded-xl p-6 border border-[#21242e] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                  <span className="text-xs font-mono text-[#c49750] uppercase tracking-wider">
                    {isDe ? 'Behandelte Themen' : 'Topics covered'}
                  </span>
                  <BookOpen className="w-4 h-4 text-[#c49750]" />
                </div>

                <div className="space-y-3 mb-6">
                  {activeCourse.syllabus.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#bbb6a9]">
                      <span className="font-mono text-[#c49750] text-[11px] shrink-0 pt-0.5">
                        0{idx + 1}.
                      </span>
                      <span className="leading-relaxed font-light">{item}</span>
                    </div>
                  ))}
                </div>

                {/* The Autonomy Note for the Intensive */}
                {activeCourse.id === 'anatomy-ipa-intensive' && (
                  <div className="p-4 bg-[#1a1714] border border-[#c49750]/30 rounded-lg mb-6">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#c49750] uppercase tracking-wider mb-1">
                      <ShieldCheck className="w-4 h-4 text-[#c49750]" />
                      <span>{isDe ? 'Vollständige Selbstständigkeit' : 'Become completely independent'}</span>
                    </div>
                    <p className="text-xs text-[#c2bcb0] leading-relaxed">
                      {isDe
                        ? 'Ziel dieses Intensivkurses ist es, Sie unabhängig zu machen, sodass Sie in Zukunft weder auf ständige Coaches noch auf Lautschrift-Wörterbücher angewiesen sind.'
                        : 'The goal of this one-time intensive is to prepare singers to be autonomous, so you rely less on coaches or pronunciation dictionaries in the future.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Inquiry Action */}
              <div className="pt-3 border-t border-white/5">
                <button
                  onClick={() => onOpenInquiry(`Course: ${activeCourse.title}`)}
                  className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded transition-all shadow-md cursor-pointer"
                >
                  {isDe ? 'Zu diesem Kurs anfragen / Buchen' : 'Ask About This Course / Apply'}
                </button>
                <div className="text-center text-[11px] text-[#7d796e] mt-2">
                  {t.hero.locationAvailability}
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
