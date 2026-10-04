import React, { useState } from 'react';
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

  const handleOpenInquiry = (topic?: string) => {
    if (topic) setInquiryTopic(topic);
    setInquiryOpen(true);
  };

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Main Website Container - Inverts smoothly into negative colors over 4 seconds */}
      <div
        className="min-h-screen bg-[#0b0c0e] text-[#e8e6e1] selection:bg-[#c49750] selection:text-black"
        style={{
          filter: spiritualityActive ? 'invert(1) hue-rotate(180deg)' : 'invert(0) hue-rotate(0deg)',
          transition: 'filter 4000ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Fixed Navigation */}
        <Navbar
          onOpenInquiry={handleOpenInquiry}
          onOpenSpirituality={() => setSpiritualityActive(true)}
        />

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

      {/* Floating Flag Switcher in the bottom corner */}
      <LanguageSwitcher />

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


