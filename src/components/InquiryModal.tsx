import React, { useState, useEffect } from 'react';
import { X, Check, Send, Mail, ExternalLink } from 'lucide-react';
import { saveInquiry } from '../data/inquiryStore';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopic?: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  defaultTopic = 'General Lesson Inquiry'
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [discipline, setDiscipline] = useState<'singer' | 'producer' | 'student' | 'listener'>('singer');
  const [selectedTopic, setSelectedTopic] = useState(defaultTopic);
  const [message, setMessage] = useState('');
  const [audioLink, setAudioLink] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (defaultTopic) {
      setSelectedTopic(defaultTopic);
    }
  }, [defaultTopic]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      // 1. Save to local studio inbox
      saveInquiry({
        name,
        email,
        discipline,
        topic: selectedTopic,
        message,
        audioLink: audioLink.trim() || undefined
      });

      // 2. Also submit via Netlify Forms format if hosted on Netlify
      try {
        const formData = new URLSearchParams();
        formData.append('form-name', 'inquiries');
        formData.append('name', name);
        formData.append('email', email);
        formData.append('discipline', discipline);
        formData.append('topic', selectedTopic);
        formData.append('message', message);
        if (audioLink) formData.append('audioLink', audioLink);

        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        }).catch(() => {});
      } catch (err) {
        // quiet fallback
      }

      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setMessage('');
    setAudioLink('');
    setSubmitted(false);
    onClose();
  };

  const mailtoHref = `mailto:beeyondmagic@protonmail.com?subject=${encodeURIComponent(
    `[Lesson/Inquiry] ${selectedTopic} - ${name}`
  )}&body=${encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nRole: ${discipline}\nTopic: ${selectedTopic}\nAudio Link: ${audioLink}\n\nMessage:\n${message}`
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-xl w-full bg-[#12151c] border border-[#2b303d] rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0f14]">
          <span className="text-xs uppercase font-mono tracking-widest text-[#c49750]">
            Get in Touch / Lesson Inquiry
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#9c978b] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-[#14291e] border border-[#2d5a3c] rounded-full mx-auto flex items-center justify-center text-[#22c55e]">
              <Check className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-serif text-white mb-2">
                Thank you, {name}!
              </h3>
              <p className="text-xs text-[#a09c91] leading-relaxed max-w-md mx-auto">
                Your message regarding <span className="text-[#c49750]">{selectedTopic}</span> has been logged and sent. I will review it and reply directly to your email within 48 hours.
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-[#181c26] border border-[#2b303f] max-w-sm mx-auto text-left flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#c49750] shrink-0 mt-0.5" />
              <div className="text-[11px] text-[#9a968a]">
                <span>Want to follow up directly? You can also email </span>
                <a href={mailtoHref} className="text-[#c49750] underline hover:text-white">
                  beeyondmagic@protonmail.com
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            name="inquiries"
            method="POST"
            data-netlify="true"
            className="p-6 sm:p-8 space-y-4"
          >
            <input type="hidden" name="form-name" value="inquiries" />
            <div>
              <h3 className="text-2xl font-serif text-[#f2eee9] font-normal mb-1">
                Book a Lesson or Ask a Question
              </h3>
              <p className="text-xs text-[#8c887d]">
                Lessons available in Paris or online.
              </p>
            </div>

            {/* Discipline Selector */}
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-[#a09c91] mb-1.5">
                I am a:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'singer', label: 'Singer' },
                  { id: 'producer', label: 'Producer' },
                  { id: 'student', label: 'Music Student' },
                  { id: 'listener', label: 'Music Lover' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDiscipline(item.id as any)}
                    className={`py-2 px-2 text-center text-xs rounded transition-all cursor-pointer border ${
                      discipline === item.id
                        ? 'bg-[#1e232e] border-[#c49750] text-white font-medium shadow-sm'
                        : 'bg-[#0d0f14] border-[#22252e] text-[#807c72] hover:text-[#dedacf]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#a09c91] mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2.5 bg-[#0b0c10] border border-[#272a34] rounded text-xs text-[#f2eee9] focus:outline-none focus:border-[#c49750]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#a09c91] mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#0b0c10] border border-[#272a34] rounded text-xs text-[#f2eee9] focus:outline-none focus:border-[#c49750]"
                />
              </div>
            </div>

            {/* Topic Selection */}
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-[#a09c91] mb-1">
                What are you interested in?
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0b0c10] border border-[#272a34] rounded text-xs text-[#dedacf] focus:outline-none focus:border-[#c49750]"
              >
                <option value="The Method: Ear Education & Learning Fast">The Method: Ear Education & Learning Fast</option>
                <option value="The Anatomy of Speech & French Rules (One-Time Intensive)">The Anatomy of Speech & French Rules (One-Time Intensive)</option>
                <option value="French Coaching for Opera Singers">French Coaching for Opera Singers</option>
                <option value="French Songs (Mélodie) for Singers & Pianists">French Songs (Mélodie) for Singers & Pianists</option>
                <option value="Producer Lessons: Chords & Harmony (FL Studio / Ableton)">Producer Lessons: Chords & Harmony (FL Studio / Ableton)</option>
                <option value="Listening Sessions for Music Lovers">Listening Sessions for Music Lovers</option>
                <option value="General Question / Other">General Question / Other</option>
              </select>
            </div>

            {/* Optional link */}
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-[#a09c91] mb-1">
                Optional: Link to your music or singing (SoundCloud, YouTube, Drive...)
              </label>
              <input
                type="url"
                value={audioLink}
                onChange={(e) => setAudioLink(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-[#0b0c10] border border-[#272a34] rounded text-xs text-[#f2eee9] focus:outline-none focus:border-[#c49750]"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-[#a09c91] mb-1">
                Your Message
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me a bit about your current level and what you want to achieve..."
                className="w-full px-3.5 py-2.5 bg-[#0b0c10] border border-[#272a34] rounded text-xs text-[#f2eee9] focus:outline-none focus:border-[#c49750] resize-none"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
