import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function ComingSoon({ gameName }) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-space-black relative overflow-hidden flex items-center justify-center">
      <div className="starfield"></div>
      
      <div className="relative z-10 max-w-md mx-auto p-6 text-center">
        <div className="mb-8">
          <Sparkles className="w-24 h-24 text-retro-gold mx-auto mb-6 animate-pulse" />
          <h1 className="text-4xl font-orbitron font-black text-white mb-4">
            {gameName}
          </h1>
          <p className="text-lg font-rajdhani text-cyan-pop mb-2">
            {t('comingSoon.title')}
          </p>
          <p className="text-gray-400 font-rajdhani">
            {t('comingSoon.message')}
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 py-3 px-6 bg-deep-purple border-2 border-cyan-pop text-cyan-pop font-orbitron font-bold uppercase tracking-wider rounded-lg hover:bg-cyan-pop/10 transition-all"
          data-testid="back-home-button"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('comingSoon.backHome')}
        </button>
      </div>
    </div>
  );
}