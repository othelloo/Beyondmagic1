import React, { useState } from 'react';
import { X, Sparkles, Youtube, Check, Bell, Flame, Compass, Feather } from 'lucide-react';

interface SpiritualityPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpiritualityPreview: React.FC<SpiritualityPreviewProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full bg-[#111319] border border-[#362b21] rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#c49750]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0f14]">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-[#c49750]/20 text-[#d4af37] border border-[#c49750]/40">
              <Sparkles className="w-3 h-3" />
              <span>In Progress · Forthcoming Series</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#9c978b] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close spirituality modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6 relative z-10">
          <div>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#fbf9f5] font-normal mb-2">
              Spirituality Through Music: The Inner Acoustic
            </h3>
            <p className="text-xs uppercase tracking-widest text-[#c49750] font-mono">
              The Question Behind the Question
            </p>
          </div>

          <div className="p-4 bg-[#171a22] rounded-xl border border-white/5 space-y-2 text-xs text-[#cfccc3] leading-relaxed">
            <div className="font-serif italic text-sm text-[#f2eee9]">
              &ldquo;In my music lessons, we train to ask: <span className="text-[#c49750]">How does this sound affect me?</span> But in this upcoming series, we ask the deeper, inescapable question: <span className="text-[#c49750]">Why does this affect me that way?</span>&rdquo;
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#b5b1a4] font-light leading-relaxed">
            <p>
              This upcoming corner of the atelier is dedicated to my forthcoming YouTube channel and long-form video essay project.
            </p>
            <p>
              It begins with an unflinchingly honest introductory video: <strong className="text-[#e8e4db] font-normal">&ldquo;Who am I personally?&rdquo;</strong>—stripping away stage makeup, conservatory accolades, and operatic personas to reveal the real human and teacher underneath.
            </p>
            <p>
              From there, we dive into the fundamental questions modern culture has largely abandoned:
            </p>

            <ul className="space-y-2.5 pl-2 text-xs text-[#dedacf]">
              <li className="flex items-start gap-2">
                <span className="text-[#c49750] font-mono">·</span>
                <span><strong>What is music really?</strong> Is it mere entertainment, or an ancient biological navigation system of human consciousness?</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c49750] font-mono">·</span>
                <span><strong>What is &ldquo;good&rdquo; and &ldquo;bad&rdquo; music?</strong> Moving beyond snobbish elitism into objective vibrational coherence, harmonic integrity, and emotional honesty.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#c49750] font-mono">·</span>
                <span><strong>How I fell into the spiritual rabbit hole:</strong> How singing at full acoustic resonance over European orchestras gradually dissolved my materialist assumptions about sound, mind, and the sacred.</span>
              </li>
            </ul>
          </div>

          {/* YouTube Series Launch Waitlist */}
          <div className="pt-4 border-t border-white/10">
            {submitted ? (
              <div className="p-4 bg-[#14231b] border border-[#2d5a3c] rounded-xl flex items-center gap-3 text-xs text-[#98e2b0]">
                <Check className="w-5 h-5 text-[#22c55e] shrink-0" />
                <div>
                  <strong className="block font-medium">You are on the private premiere list.</strong>
                  You will receive an email notification when Episode 1 and the accompanying manifesto are published.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <label className="block text-xs uppercase tracking-wider text-[#8e8b80] font-mono">
                  Notify me when the YouTube series & essays launch:
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="flex-1 px-4 py-2.5 bg-[#0b0d12] border border-[#272b36] rounded text-xs text-[#eeeae0] focus:outline-none focus:border-[#c49750]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded transition-all cursor-pointer whitespace-nowrap"
                  >
                    Join Premiere List
                  </button>
                </div>
                <div className="text-[11px] text-[#736f64]">
                  Zero spam. Only notified when the series launches.
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0c0e14] border-t border-white/5 flex items-center justify-between text-xs text-[#7d796e]">
          <span>Vérisme Atelier · Forthcoming Chapter</span>
          <button
            onClick={onClose}
            className="text-[#c49750] hover:underline cursor-pointer"
          >
            Return to Studio Site
          </button>
        </div>

      </div>
    </div>
  );
};
