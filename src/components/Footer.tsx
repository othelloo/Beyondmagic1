import React from 'react';
import { Sparkles, ArrowUp, Mail } from 'lucide-react';

interface FooterProps {
  onOpenInquiry: (topic?: string) => void;
  onOpenSpirituality: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenInquiry, onOpenSpirituality }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#08090b] border-t border-[#1a1d24] py-14 px-6 text-[#8a867b]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-10 border-b border-white/5">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <a
              href="#"
              className="text-xl font-serif tracking-[0.16em] text-[#f2eee9] uppercase hover:text-[#d4af37] transition-colors"
            >
              Vérisme Atelier
            </a>
            <p className="text-xs text-[#8c887d] max-w-sm leading-relaxed">
              Specialized music lessons, ear training, French opera coaching, and speech anatomy. Teaching with the ear first so learning music feels natural, fast, and real.
            </p>
            <div className="text-[11px] text-[#6d6a60]">
              Available in Paris or online worldwide
            </div>
          </div>

          {/* Quick Nav */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase text-[#c49750] tracking-widest">
              Pages
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#the-method" className="hover:text-white transition-colors">
                  The Method: Ear First
                </a>
              </li>
              <li>
                <a href="#audiences" className="hover:text-white transition-colors">
                  Who It&apos;s For (Students, Producers, Listeners)
                </a>
              </li>
              <li>
                <a href="#specializations" className="hover:text-white transition-colors">
                  French Coaching & Speech Rules
                </a>
              </li>
              <li>
                <a href="#biography" className="hover:text-white transition-colors">
                  About Me & Story
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors">
                  Photos & Videos
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenSpirituality}
                  className="hover:text-[#d4af37] transition-colors text-left text-xs cursor-pointer italic flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-[#c49750]" />
                  <span>Spirituality Through Music (Coming Soon)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-mono uppercase text-[#c49750] tracking-widest">
              Have Questions?
            </div>
            <p className="text-xs text-[#8c887d] leading-relaxed">
              Feel free to send a message about lessons, coaching, or masterclasses:
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                onClick={() => onOpenInquiry()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#14161f] hover:bg-[#1e222d] border border-[#2b303e] rounded text-xs text-[#dcd7cb] transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-[#c49750]" />
                <span>Send a Message</span>
              </button>
              <a
                href="mailto:beeyondmagic@protonmail.com"
                className="text-[11px] text-[#8c887d] hover:text-[#c49750] transition-colors"
              >
                beeyondmagic@protonmail.com
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#676358] gap-4">
          <div>
            © {new Date().getFullYear()} Vérisme Atelier. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span>Netlify ready</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#c49750]" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
