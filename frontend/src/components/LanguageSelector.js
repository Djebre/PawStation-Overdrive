import { useLanguage } from '@/i18n/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-deep-purple/80 backdrop-blur-xl border border-white/20 rounded-lg p-2">
        <Globe className="w-4 h-4 text-cyan-pop" />
        <button
          onClick={() => changeLanguage('fr')}
          className={`px-3 py-1 rounded font-rajdhani font-bold text-sm transition-all ${
            language === 'fr'
              ? 'bg-neon-pink text-black'
              : 'text-gray-400 hover:text-white'
          }`}
          data-testid="lang-fr"
        >
          FR
        </button>
        <button
          onClick={() => changeLanguage('en')}
          className={`px-3 py-1 rounded font-rajdhani font-bold text-sm transition-all ${
            language === 'en'
              ? 'bg-neon-pink text-black'
              : 'text-gray-400 hover:text-white'
          }`}
          data-testid="lang-en"
        >
          EN
        </button>
      </div>
    </div>
  );
}
