import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
      const sections = ['the-method', 'audiences', 'specializations', 'biography', 'gallery'];
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

  const navLinks = [
    { name: t.nav.method, href: '#the-method' },
    { name: t.nav.audiences, href: '#audiences' },
    { name: t.nav.french, href: '#specializations' },
    { name: t.nav.about, href: '#biography' },
    { name: t.nav.media, href: '#gallery' },
  ];

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (href === '#' || !href) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 bg-[#0b0c0e]/95 backdrop-blur-md border-b border-[#23262d] py-3.5 shadow-2xl transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Zone 1: Single text wordmark that scrolls to top */}
        <a
          href="#"
          onClick={(e) => handleNavClick(e, '#')}
          className="text-xl md:text-2xl font-serif tracking-[0.18em] text-[#f2eee9] uppercase hover:text-[#d4af37] transition-colors cursor-pointer"
          title="Back to Top"
        >
          Vérisme Atelier
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium tracking-wide text-[#b3b0a6]">
          {navLinks.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`transition-colors relative py-1 hover:text-[#f2eee9] ${
                  isActive
                    ? 'text-[#c49750] border-b-2 border-[#c49750] font-semibold'
                    : 'text-[#b3b0a6] hover:border-b hover:border-[#c49750]/50'
                }`}
              >
                {link.name}
              </a>
            );
          })}
          {/* Spirituality link - indicated as in-progress / coming soon */}
          <button
            onClick={onOpenSpirituality}
            className="flex items-center gap-1.5 text-xs text-[#d4af37]/80 hover:text-[#d4af37] transition-colors py-1 cursor-pointer"
            title="Spirituality through Music"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="font-normal italic">{t.nav.spirituality}</span>
          </button>
        </nav>

        {/* Zone 3: Language switcher & Primary action & mobile trigger */}
        <div className="flex items-center gap-3 md:gap-4">
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
          <div className="flex flex-col gap-4 text-base">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, link.href);
                }}
                className="text-[#cfccc3] hover:text-[#d4af37] py-2 border-b border-white/5 transition-colors cursor-pointer"
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSpirituality();
              }}
              className="flex items-center gap-2 text-[#d4af37] py-2 text-left text-sm italic"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.nav.spirituality}</span>
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
