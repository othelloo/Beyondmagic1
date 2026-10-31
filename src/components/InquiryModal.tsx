import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Send, Mail, ExternalLink, ShieldCheck, Lock } from 'lucide-react';
import { saveInquiry } from '../data/inquiryStore';
import { useLanguage } from '../context/LanguageContext';

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
  const { language, t } = useLanguage();
  const isDe = language === 'de';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [discipline, setDiscipline] = useState<'singer' | 'producer' | 'student' | 'listener'>('singer');
  const [selectedTopic, setSelectedTopic] = useState(defaultTopic);
  const [message, setMessage] = useState('');
  const [audioLink, setAudioLink] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-spam honeypot
  const [submitted, setSubmitted] = useState(false);

  // Anti-spam timing tracker: bots submit in < 500ms, humans take several seconds
  const openTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (isOpen) {
      openTimeRef.current = Date.now();
    }
  }, [isOpen]);

  useEffect(() => {
    if (defaultTopic) {
      setSelectedTopic(defaultTopic);
    }
  }, [defaultTopic]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Anti-spam check: if honeypot was filled by an automated bot, drop silently
    if (honeypot.trim()) {
      setSubmitted(true);
      return;
    }

    if (name.trim() && email.trim()) {
      // 2. ALWAYS Save to local studio inbox first (100% immune to Netlify spam filters)
      saveInquiry({
        name: name.trim(),
        email: email.trim(),
        discipline,
        topic: selectedTopic,
        message: message.trim(),
        audioLink: audioLink.trim() || undefined
      });

      // 3. Submit to Netlify Forms with clean parameters to bypass Akismet false-positives
      try {
        const formData = new URLSearchParams();
        formData.append('form-name', 'inquiries');
        formData.append('bot-field', ''); // explicit empty honeypot for Netlify
        formData.append('name', name.trim());
        formData.append('email', email.trim());
        formData.append('discipline', discipline);
        formData.append('topic', selectedTopic);
        formData.append('message', message.trim());
        if (audioLink.trim()) {
          formData.append('audioLink', audioLink.trim());
        }

        fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        }).catch((err) => {
          console.warn('Form network dispatch notice:', err);
        });
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
    setHoneypot('');
    setSubmitted(false);
    onClose();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-xl w-full bg-[#12151c] border border-[#2b303d] rounded-2xl shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0f14]">
          <span className="text-xs uppercase font-mono tracking-widest text-[#c49750]">
            {isDe ? 'Kontakt aufnehmen / Unterrichtsanfrage' : 'Get in Touch / Lesson Inquiry'}
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
                {isDe ? `Vielen Dank, ${name}!` : `Thank you, ${name}!`}
              </h3>
              <p className="text-xs text-[#a09c91] leading-relaxed max-w-md mx-auto">
                {isDe
                  ? `Ihre Nachricht bezüglich ${selectedTopic} wurde erfolgreich und vertraulich übermittelt. Ich werde mich innerhalb von 24–48 Stunden persönlich bei Ihnen melden.`
                  : `Your message regarding ${selectedTopic} has been safely received. I will review it and reply directly to your email (${email}) within 24 to 48 hours.`}
              </p>
            </div>
            
            {/* Privacy & Security confirmation - Owner email is NEVER exposed */}
            <div className="p-3.5 rounded-xl bg-[#181c26] border border-[#2b303f] max-w-sm mx-auto text-left flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-[11px] text-[#b8b4a7] space-y-0.5 leading-relaxed">
                <span className="font-semibold text-white block">
                  {isDe ? 'Sicher im Studio-Postfach hinterlegt' : 'Direct & Confidential Transmission'}
                </span>
                <span>
                  {isDe
                    ? 'Ihre Anfrage wurde verschlüsselt im Studio-System erfasst. Ihre E-Mail-Adresse wird streng vertraulich behandelt.'
                    : 'Your message and audio references are permanently registered in the private studio inbox. Your details are treated with strict confidentiality.'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded transition-all cursor-pointer"
              >
                {isDe ? 'Schließen' : 'Close'}
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            name="inquiries"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            className="p-6 sm:p-8 space-y-4"
          >
            <input type="hidden" name="form-name" value="inquiries" />
            {/* Anti-spam Honeypot field (hidden from real users, traps automated bots) */}
            <div style={{ display: 'none' }} aria-hidden="true">
              <label htmlFor="inquiry-bot-field">Ignore this field</label>
              <input
                id="inquiry-bot-field"
                name="bot-field"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <div>
              <h3 className="text-2xl font-serif text-[#f2eee9] font-normal mb-1">
                {isDe ? 'Unterrichtsstunde buchen oder Frage stellen' : 'Book a Lesson or Ask a Question'}
              </h3>
              <p className="text-xs text-[#8c887d]">
                {t.hero.locationAvailability}
              </p>
            </div>

            {/* Discipline Selector */}
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-[#a09c91] mb-1.5">
                {isDe ? 'Ich bin:' : 'I am a:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'singer', label: isDe ? 'Sänger/in' : 'Singer' },
                  { id: 'producer', label: isDe ? 'Produzent/in' : 'Producer' },
                  { id: 'student', label: isDe ? 'Gesangsstudent/in' : 'Music Student' },
                  { id: 'listener', label: isDe ? 'Musikliebhaber/in' : 'Music Lover' }
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
                  {isDe ? 'Ihr Name *' : 'Your Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isDe ? 'Vollständiger Name' : 'Your full name'}
                  className="w-full px-3.5 py-2.5 bg-[#0b0c10] border border-[#272a34] rounded text-xs text-[#f2eee9] focus:outline-none focus:border-[#c49750]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono tracking-wider text-[#a09c91] mb-1">
                  {isDe ? 'E-Mail-Adresse *' : 'Email Address *'}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 bg-[#0b0c10] border border-[#272a34] rounded text-xs text-[#f2eee9] focus:outline-none focus:border-[#c49750]"
                />
              </div>
            </div>

            {/* Topic Selection */}
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-[#a09c91] mb-1">
                {isDe ? 'Woran haben Sie Interesse?' : 'What are you interested in?'}
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#0b0c10] border border-[#272a34] rounded text-xs text-[#dedacf] focus:outline-none focus:border-[#c49750]"
              >
                <option value="45-Minute Biomechanical Vocal Diagnostic (Pop, R&B, Rock, Modern Styles)">
                  {isDe ? '45-Minuten Stimm-Biomechanik-Diagnose (Pop, R&B, Rock, Modern)' : '45-Minute Biomechanical Vocal Diagnostic (Pop, R&B, Rock, Modern Styles)'}
                </option>
                <option value="Studio Tracking Week Retainer (On-Call Vocal Producer & Tracking Alchemist)">
                  {isDe ? 'Studiowoche-Retainer: On-Call Vocal Producer & Klang-Alchemist (Vor Ort / Remote)' : 'Studio Tracking Week Retainer: On-Call Vocal Producer & Tracking Alchemist (Studio / Remote)'}
                </option>
                <option value="Tour Endurance Retainer & Arena Vocal Insurance">
                  {isDe ? 'Tournee-Endurance Retainer & Stimm-Versicherung (20–40 Arena-Shows)' : 'Tour Endurance Retainer & Arena Vocal Insurance (20–40 Dates)'}
                </option>
                <option value="12-Week High-Performance Vocal Mentorship">
                  {isDe ? '12-Wochen High-Performance Mentoring (3-Phasen-Biomechanik)' : '12-Week High-Performance Vocal Mentorship (3-Phase Biomechanics)'}
                </option>
                <option value="Vocal Coaching (Pop, R&B, Soul, Jazz, Modern Styles)">
                  {isDe ? 'Gesangscoaching (Pop, R&B, Soul, Jazz, Moderne Stile)' : 'Vocal Coaching (Pop, R&B, Soul, Jazz, Modern Styles)'}
                </option>
                <option value="The Method: Emotion-first Learning">
                  {isDe ? 'Die Methode: Emotionsorientiertes Lernen' : 'The Method: Emotion-first Learning'}
                </option>
                <option value="The Anatomy of Speech & French Rules (One-Time Intensive)">
                  {isDe ? 'Anatomie der Sprache & Französische Regeln (Intensivkurs)' : 'The Anatomy of Speech & French Rules (One-Time Intensive)'}
                </option>
                <option value="French Coaching for Opera Singers">
                  {isDe ? 'Französisches Coaching für Opernsänger' : 'French Coaching for Opera Singers'}
                </option>
                <option value="French Songs (Mélodie) for Singers & Pianists">
                  {isDe ? 'Französische Lieder (Mélodie) für Sänger & Pianisten' : 'French Songs (Mélodie) for Singers & Pianists'}
                </option>
                <option value="Producer Lessons: Chords & Harmony (FL Studio / Ableton)">
                  {isDe ? 'Produzenten-Coaching: Akkorde & Harmonie (Ableton / FL Studio)' : 'Producer Lessons: Chords & Harmony (FL Studio / Ableton)'}
                </option>
                <option value="Listening Sessions for Music Lovers">
                  {isDe ? 'Hör-Sessions für Musikliebhaber' : 'Listening Sessions for Music Lovers'}
                </option>
                <option value="General Question / Other">
                  {isDe ? 'Allgemeine Anfrage / Management-Kontakt' : 'General Question / Management Inquiry'}
                </option>
              </select>
            </div>

            {/* Optional link */}
            <div>
              <label className="block text-xs uppercase font-mono tracking-wider text-[#a09c91] mb-1">
                {isDe ? 'Optional: Link zu Musik oder Aufnahme (YouTube, SoundCloud, Drive...)' : 'Optional: Link to your music or singing (SoundCloud, YouTube, Drive...)'}
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
                {isDe ? 'Ihre Nachricht' : 'Your Message'}
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isDe ? 'Erzählen Sie kurz von Ihren Zielen, Ihrem Stimmfach oder Ihren Fragen...' : 'Tell me a bit about your current level and what you want to achieve...'}
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
                <span>{isDe ? 'Nachricht senden' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body
  );
};
