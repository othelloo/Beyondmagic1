import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ArrowUp } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LanguageProvider } from './context/LanguageContext';

// Code-split below-the-fold sections for instant mobile initial page rendering
const FeaturedVideoSpot = lazy(() => import('./components/FeaturedVideoSpot').then(m => ({ default: m.FeaturedVideoSpot })));
const TargetAudiences = lazy(() => import('./components/TargetAudiences').then(m => ({ default: m.TargetAudiences })));
const MusicTheory = lazy(() => import('./components/MusicTheory').then(m => ({ default: m.MusicTheory })));
const FrenchSpecialization = lazy(() => import('./components/FrenchSpecialization').then(m => ({ default: m.FrenchSpecialization })));
const ContemporaryVocalCoaching = lazy(() => import('./components/ContemporaryVocalCoaching').then(m => ({ default: m.ContemporaryVocalCoaching })));
const Biography = lazy(() => import('./components/Biography').then(m => ({ default: m.Biography })));
const MediaSection = lazy(() => import('./components/MediaSection').then(m => ({ default: m.MediaSection })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));

// On-demand lazy modals and heavy overlays
const InquiryModal = lazy(() => import('./components/InquiryModal').then(m => ({ default: m.InquiryModal })));
const SpiritualityExperience = lazy(() => import('./components/SpiritualityExperience').then(m => ({ default: m.SpiritualityExperience })));

function MainApp() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryTopic, setInquiryTopic] = useState('General Masterclass Consultation');
  const [spiritualityActive, setSpiritualityActive] = useState(false);



  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenInquiry = (topic?: string) => {
    if (topic) setInquiryTopic(topic);
    setInquiryOpen(true);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Fixed Navigation - Always present and fixed to viewport at top of screen */}
      <Navbar
        onOpenInquiry={handleOpenInquiry}
        onOpenSpirituality={() => setSpiritualityActive(true)}
      />

      {/* Main Website Container - Only apply filter during spirituality mode */}
      <div
        className="min-h-screen bg-[#0b0c0e] text-[#e8e6e1] selection:bg-[#c49750] selection:text-black"
        style={
          spiritualityActive
            ? {
                filter: 'invert(1) hue-rotate(180deg)',
                transition: 'filter 4000ms cubic-bezier(0.4, 0, 0.2, 1)',
              }
            : undefined
        }
      >
        <main>
          {/* Hero Section */}
          <Hero
            onOpenInquiry={handleOpenInquiry}
            onScrollToVideo={() => handleScrollToSection('studio-spotlight')}
          />

          {/* Below-the-fold sections lazy-loaded in background */}
          <Suspense fallback={<div className="min-h-[20vh] bg-[#0b0c0e]" />}>
            {/* Featured Video Spotlight & Randomizer */}
            <FeaturedVideoSpot
              onOpenInquiry={handleOpenInquiry}
              onOpenSpirituality={() => setSpiritualityActive(true)}
            />

            {/* Target Audiences: Students, Producers, Discerning Listeners */}
            <TargetAudiences onOpenInquiry={handleOpenInquiry} />

            {/* Music Theory: Sound, Harmonic Perception & Color */}
            <MusicTheory onOpenInquiry={handleOpenInquiry} />

            {/* French Repertoire Specialization & The One-Time Anatomy/IPA Intensive */}
            <FrenchSpecialization onOpenInquiry={handleOpenInquiry} />

            {/* Contemporary Vocal Coaching: Pop, R&B, Soul, Jazz, Indie & Beyond */}
            <ContemporaryVocalCoaching 
              onOpenInquiry={handleOpenInquiry}
              onScrollToClassical={() => handleScrollToSection('specializations')}
            />

            {/* Biography & The 2-Year Trajectory */}
            <Biography
              onScrollToGallery={() => handleScrollToSection('gallery')}
              onOpenInquiry={handleOpenInquiry}
            />

            {/* Galleries: 2 Photo Collections + Video Archive */}
            <MediaSection onOpenInquiry={handleOpenInquiry} />

            {/* Footer */}
            <Footer
              onOpenInquiry={handleOpenInquiry}
              onOpenSpirituality={() => setSpiritualityActive(true)}
            />
          </Suspense>
        </main>
      </div>

      {/* Floating Back to Top Button in bottom left corner */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-40 px-3.5 py-2.5 bg-[#0e1118]/90 hover:bg-[#c49750] text-[#c49750] hover:text-black border border-[#c49750]/40 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 flex items-center gap-1.5 cursor-pointer text-xs font-mono uppercase tracking-wider group animate-in fade-in slide-in-from-bottom-2"
          aria-label="Back to Top"
          title="Back to Top"
        >
          <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-[11px] font-medium font-sans">Top</span>
        </button>
      )}

      {/* Interactive Inquiries / Audition Modal - Loaded on demand */}
      {inquiryOpen && (
        <Suspense fallback={null}>
          <InquiryModal
            isOpen={inquiryOpen}
            onClose={() => setInquiryOpen(false)}
            defaultTopic={inquiryTopic}
          />
        </Suspense>
      )}

      {/* Spirituality Awakening - Loaded on demand */}
      {spiritualityActive && (
        <Suspense fallback={null}>
          <SpiritualityExperience
            isActive={spiritualityActive}
            onClose={() => setSpiritualityActive(false)}
          />
        </Suspense>
      )}
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}


