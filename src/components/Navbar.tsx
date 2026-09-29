import React, { useState, useEffect } from 'react';
import { Menu, X, Music, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenInquiry: (defaultTopic?: string) => void;
  onOpenSpirituality: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInquiry, onOpenSpirituality }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'The Method', href: '#the-method' },
    { name: 'Who It’s For', href: '#audiences' },
    { name: 'French Coaching', href: '#specializations' },
    { name: 'About Me', href: '#biography' },
    { name: 'Photos & Videos', href: '#gallery' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0b0c0e]/95 backdrop-blur-md border-b border-[#23262d] py-3.5 shadow-2xl'
          : 'bg-transparent py-5 border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <a
          href="#"
          className="text-xl md:text-2xl font-serif tracking-[0.18em] text-[#f2eee9] uppercase hover:text-[#d4af37] transition-colors"
        >
          Vérisme Atelier
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium tracking-wide text-[#b3b0a6]">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-[#f2eee9] transition-colors relative py-1 hover:border-b hover:border-[#c49750]"
            >
              {link.name}
            </a>
          ))}
          {/* Spirituality link - indicated as in-progress / coming soon */}
          <button
            onClick={onOpenSpirituality}
            className="flex items-center gap-1.5 text-xs text-[#d4af37]/80 hover:text-[#d4af37] transition-colors py-1 cursor-pointer"
            title="Spirituality through Music — In Progress / Coming Soon"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="font-normal italic">Spirituality (Soon)</span>
          </button>
        </nav>

        {/* Zone 3: Primary action & mobile trigger */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => onOpenInquiry()}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded transition-all duration-200 shadow-sm cursor-pointer whitespace-nowrap"
          >
            Contact / Book
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
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#cfccc3] hover:text-[#d4af37] py-2 border-b border-white/5 transition-colors"
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
              <span>Spirituality Through Music (Coming Soon)</span>
            </button>
            <div className="pt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInquiry();
                }}
                className="w-full text-center py-3 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] rounded"
              >
                Contact / Book
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
