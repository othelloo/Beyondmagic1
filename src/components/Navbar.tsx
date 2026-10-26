import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BeyondMagicNavbarLogo } from './BeyondMagicNavbarLogo';

interface NavbarProps {
  onOpenInquiry: (defaultTopic?: string) => void;
  onOpenSpirituality: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInquiry, onOpenSpirituality }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Simple active section detection
      const sections = ['audiences', 'music-theory', 'specializations', 'vocal-coaching', 'biography', 'gallery'];
      const scrollPos = window.scrollY + 140;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection('#' + id);
            return;
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveSection('');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isDe = language === 'de';

  const navLinks = [
    {
      name: isDe ? 'Für wen' : 'Who It’s For',
      href: '#audiences'
    },
    {
      name: isDe ? 'Musiktheorie' : 'Music Theory',
      href: '#music-theory'
    },
    {
      name: isDe ? 'Französisch-Coaching' : 'French Coaching',
      href: '#specializations'
    },
    {
      name: isDe ? 'Vocal Coaching' : 'Vocal Coaching',
      href: '#vocal-coaching'
    },
    {
      name: isDe ? 'Über mich' : 'About Me',
      href: '#biography'
    },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string, fromMobile = false) => {
    e.preventDefault();
    if (fromMobile) {
      setMobileMenuOpen(false);
    }

    if (href === '#' || !href) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const scrollToTarget = () => {
      const el = document.querySelector(href);
      if (!el) return;

      const header = document.querySelector('header');
      // Fixed navbar height is ~50-54px on mobile, ~60px on desktop
      const headerHeight = header ? Math.min(header.offsetHeight, 64) : 52;
      const elementTop = el.getBoundingClientRect().top + window.pageYOffset;
      const targetY = Math.max(0, Math.round(elementTop - headerHeight));

      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    };

    if (fromMobile) {
      requestAnimationFrame(() => {
        setTimeout(scrollToTarget, 30);
      });
    } else {
      scrollToTarget();
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 bg-[#0b0c0e]/95 backdrop-blur-md border-b border-[#23262d] py-2 sm:py-2.5 shadow-2xl transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 lg:gap-6">
        {/* Left Side: Logo */}
        <a
          href="#"
          onClick={(e) => handleNavClick(e, '#')}
          className="flex items-center group py-0.5 cursor-pointer text-left shrink-0"
          title="Beyond Magic — Back to Top"
        >
          <BeyondMagicNavbarLogo />
        </a>

        {/* Center: Navigation menu — Option 1: Clean Single-Line Classical Typography */}
        <nav className="hidden lg:flex items-center justify-center gap-4 xl:gap-7 flex-1 mx-2 sm:mx-4 xl:mx-6 text-sm xl:text-[15px] font-medium tracking-wide text-[#b3b0a6]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`transition-all duration-200 relative py-1 whitespace-nowrap ${
                  isActive
                    ? 'text-[#c49750] font-semibold border-b-2 border-[#c49750]'
                    : 'text-[#b3b0a6] hover:text-[#fbf9f5] hover:border-b hover:border-[#c49750]/50'
                }`}
              >
                {link.name}
              </a>
            );
          })}

          {/* Spirituality link — Single-line with Sparkles and (Soon) indicator */}
          <button
            onClick={onOpenSpirituality}
            className="inline-flex items-center gap-1.5 py-1 px-3 rounded-full bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/35 text-[#d4af37] hover:text-[#f5d58c] transition-all cursor-pointer shrink-0 text-xs xl:text-sm font-serif italic"
            title="Spirituality through Music"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>{isDe ? 'Spiritualität' : 'Spirituality'}</span>
            <span className="text-[10px] xl:text-[11px] font-mono not-italic text-[#d4af37]/80 font-normal ml-0.5">
              {isDe ? '(In Kürze)' : '(Soon)'}
            </span>
          </button>
        </nav>

        {/* Right Side: Action cluster: Language switcher & Primary action & mobile trigger */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          {/* Flag Switcher in Navbar */}
          <div className="flex items-center bg-[#151821] border border-[#272b35] rounded-full p-0.5 text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-[#c49750] text-black font-semibold shadow-sm'
                  : 'text-[#9c988e] hover:text-white'
              }`}
              title="English"
            >
              <span>🇬🇧</span>
              <span className="hidden sm:inline text-[11px]">EN</span>
            </button>
            <button
              onClick={() => setLanguage('de')}
              className={`px-2 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer ${
                language === 'de'
                  ? 'bg-[#c49750] text-black font-semibold shadow-sm'
                  : 'text-[#9c988e] hover:text-white'
              }`}
              title="Deutsch"
            >
              <span>🇩🇪</span>
              <span className="hidden sm:inline text-[11px]">DE</span>
            </button>
          </div>

          <button
            onClick={() => onOpenInquiry()}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded transition-all duration-200 shadow-sm cursor-pointer whitespace-nowrap"
          >
            {t.nav.contact}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#b3b0a6] hover:text-white focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#111317] border-b border-[#23262d] px-6 py-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-2 text-base">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  handleNavClick(e, link.href, true);
                }}
                className="text-[#cfccc3] hover:text-[#d4af37] py-2.5 border-b border-white/5 transition-colors cursor-pointer text-left flex items-center justify-between"
              >
                <span className="font-medium text-[15px]">{link.name}</span>
              </a>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSpirituality();
              }}
              className="flex items-center justify-between text-[#d4af37] py-2.5 border-b border-white/5 text-left text-sm italic cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>{isDe ? 'Spiritualität' : 'Spirituality'}</span>
              </span>
              <span className="text-xs text-[#d4af37]/75 font-mono not-italic">{isDe ? '(In Kürze)' : '(Soon)'}</span>
            </button>
            <div className="pt-3 flex flex-col gap-3">
              <div className="flex items-center justify-between px-1 text-sm text-[#a09c91]">
                <span>Language / Sprache:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded text-xs ${language === 'en' ? 'bg-[#c49750] text-black font-semibold' : 'bg-[#1b1e26] text-[#b8b5ab]'}`}
                  >
                    🇬🇧 English
                  </button>
                  <button
                    onClick={() => setLanguage('de')}
                    className={`px-3 py-1 rounded text-xs ${language === 'de' ? 'bg-[#c49750] text-black font-semibold' : 'bg-[#1b1e26] text-[#b8b5ab]'}`}
                  >
                    🇩🇪 Deutsch
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInquiry();
                }}
                className="w-full text-center py-3 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] rounded"
              >
                {t.nav.contact}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
