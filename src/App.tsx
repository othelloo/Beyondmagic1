import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedVideoSpot } from './components/FeaturedVideoSpot';
import { TheMethod } from './components/TheMethod';
import { TargetAudiences } from './components/TargetAudiences';
import { FrenchSpecialization } from './components/FrenchSpecialization';
import { Biography } from './components/Biography';
import { MediaSection } from './components/MediaSection';
import { SpiritualityExperience } from './components/SpiritualityExperience';
import { InquiryModal } from './components/InquiryModal';
import { Footer } from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';

function MainApp() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryTopic, setInquiryTopic] = useState('General Masterclass Consultation');
  const [spiritualityActive, setSpiritualityActive] = useState(false);

  useEffect(() => {
    try {
      const savedPortrait = localStorage.getItem('verisme_custom_portrait_v2');
      if (savedPortrait && savedPortrait.startsWith('data:image')) {
        fetch('/api/upload-portrait', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: savedPortrait }),
        }).catch(() => {});
      }

      const savedPhotosStr = localStorage.getItem('verisme_custom_photos_v9') || 
                             localStorage.getItem('verisme_custom_photos') ||
                             localStorage.getItem('verisme_custom_photos_v8');
      if (savedPhotosStr) {
        const parsed = JSON.parse(savedPhotosStr);
        if (Array.isArray(parsed) && parsed.length > 0) {
          fetch('/api/sync-gallery-photos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ photos: parsed }),
          }).catch(() => {});
        }
      }
    } catch (e) {
      // Ignore
    }
  }, []);

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
            onScrollToMethod={() => handleScrollToSection('the-method')}
            onScrollToVideo={() => handleScrollToSection('studio-spotlight')}
          />

          {/* Featured Video Spotlight & Randomizer */}
          <FeaturedVideoSpot
            onOpenInquiry={handleOpenInquiry}
            onOpenSpirituality={() => setSpiritualityActive(true)}
          />

          {/* The Method: Ear-First Somatic Education & Notation critique */}
          <TheMethod
            onOpenInquiry={handleOpenInquiry}
            onOpenSpirituality={() => setSpiritualityActive(true)}
          />

          {/* Target Audiences: Students, Producers, Discerning Listeners */}
          <TargetAudiences onOpenInquiry={handleOpenInquiry} />

          {/* French Repertoire Specialization & The One-Time Anatomy/IPA Intensive */}
          <FrenchSpecialization onOpenInquiry={handleOpenInquiry} />

          {/* Biography & The 2-Year Trajectory */}
          <Biography
            onScrollToGallery={() => handleScrollToSection('gallery')}
            onOpenInquiry={handleOpenInquiry}
          />

          {/* Galleries: 2 Photo Collections + Video Archive */}
          <MediaSection onOpenInquiry={handleOpenInquiry} />
        </main>

        {/* Footer */}
        <Footer
          onOpenInquiry={handleOpenInquiry}
          onOpenSpirituality={() => setSpiritualityActive(true)}
        />
      </div>

      {/* Floating Flag Switcher in the bottom right corner */}
      <LanguageSwitcher />

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

      {/* Interactive Inquiries / Audition Modal */}
      <InquiryModal
        isOpen={inquiryOpen}
        onClose={() => setInquiryOpen(false)}
        defaultTopic={inquiryTopic}
      />

      {/* Spirituality Awakening: 2s Negative color transition, rising Yin-Yang, splitting, and "who are you?" reveal */}
      <SpiritualityExperience
        isActive={spiritualityActive}
        onClose={() => setSpiritualityActive(false)}
      />
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


