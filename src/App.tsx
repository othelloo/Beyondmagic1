import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ArrowUp } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturedVideoSpot } from './components/FeaturedVideoSpot';
import { TargetAudiences } from './components/TargetAudiences';
import { MusicTheory } from './components/MusicTheory';
import { FrenchSpecialization } from './components/FrenchSpecialization';
import { ContemporaryVocalCoaching } from './components/ContemporaryVocalCoaching';
import { Biography } from './components/Biography';
import { MediaSection } from './components/MediaSection';
import { Footer } from './components/Footer';
import { LanguageProvider } from './context/LanguageContext';

// On-demand lazy modals and heavy overlays
const InquiryModal = lazy(() => import('./components/InquiryModal').then(m => ({ default: m.InquiryModal })));
const SpiritualityExperience = lazy(() => import('./components/SpiritualityExperience').then(m => ({ default: m.SpiritualityExperience })));
const MediaManagerModal = lazy(() => import('./components/MediaManagerModal').then(m => ({ default: m.MediaManagerModal })));

function MainApp() {
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryTopic, setInquiryTopic] = useState('General Masterclass Consultation');
  const [spiritualityActive, setSpiritualityActive] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    // Dismiss pre-shell overlay smoothly when React mounts
    if (typeof window !== 'undefined') {
      const win = window as unknown as { __dismissShell?: () => void };
      if (typeof win.__dismissShell === 'function') {
        win.__dismissShell();
      }
    }
  }, []);

  useEffect(() => {
    // Check if visiting /admin or #admin
    const checkAdminRoute = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin') {
        setIsAdminOpen(true);
      }
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);

    // Discrete keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
      const header = document.querySelector('header');
      const headerHeight = header ? Math.min(header.offsetHeight, 64) : 52;
      const elementTop = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: Math.max(0, Math.round(elementTop - headerHeight)),
        behavior: 'smooth'
      });
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin') {
        window.history.pushState(null, '', '/');
      }
    }
  };

  const handleOpenAdmin = () => {
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', '/admin');
    }
    setIsAdminOpen(true);
  };

  return (
    <>
      {/* Fixed Navigation - Always present and fixed to viewport at top of screen */}
      <Navbar
        onOpenInquiry={handleOpenInquiry}
        onOpenSpirituality={() => setSpiritualityActive(true)}
      />

      {/* Main Website Container - Smooth 2.5s filter transition during spirituality mode */}
      <div
        className="min-h-screen bg-[#0b0c0e] text-[#e8e6e1] selection:bg-[#c49750] selection:text-black transition-[filter] duration-[2500ms] ease-in-out"
        style={
          spiritualityActive
            ? {
                filter: 'invert(1) hue-rotate(180deg)',
              }
            : {
                filter: 'none',
              }
        }
      >
        <main>
          {/* Hero Section */}
          <Hero
            onOpenInquiry={handleOpenInquiry}
            onScrollToVideo={() => handleScrollToSection('studio-spotlight')}
          />

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
            onOpenAdmin={handleOpenAdmin}
          />
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

      {/* Secret Studio Admin / Media Manager (/admin or #admin) */}
      {isAdminOpen && (
        <Suspense fallback={null}>
          <MediaManagerModal
            isOpen={isAdminOpen}
            onClose={handleCloseAdmin}
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


