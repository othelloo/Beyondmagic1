import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  return (
    <div
      className="fixed bottom-5 right-5 z-40 flex items-center shadow-2xl rounded-full p-1 bg-[#12151c]/90 backdrop-blur-md border border-[#c49750]/30 hover:border-[#c49750]/70 transition-all duration-300 group"
      aria-label="Language Selector"
    >
      <button
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-[#c49750] text-black font-semibold shadow-md'
            : 'text-[#a9a59b] hover:text-[#f2eee9]'
        }`}
        title="Switch to English"
        aria-pressed={language === 'en'}
      >
        <span className="text-sm leading-none" role="img" aria-label="UK Flag">🇬🇧</span>
        <span>EN</span>
      </button>

      <button
        onClick={() => setLanguage('de')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
          language === 'de'
            ? 'bg-[#c49750] text-black font-semibold shadow-md'
            : 'text-[#a9a59b] hover:text-[#f2eee9]'
        }`}
        title="Auf Deutsch umschalten"
        aria-pressed={language === 'de'}
      >
        <span className="text-sm leading-none" role="img" aria-label="German Flag">🇩🇪</span>
        <span>DE</span>
      </button>
    </div>
  );
};
