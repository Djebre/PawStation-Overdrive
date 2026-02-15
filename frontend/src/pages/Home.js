import { useNavigate } from 'react-router-dom';
import { Rocket, Waves, Zap, Trophy, Info } from 'lucide-react';
import { useLanguage } from '@/i18n/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';

export default function Home() {
  const navigate = useNavigate();

  // Configuration des jeux depuis les variables d'environnement
  const gameAEnabled = process.env.REACT_APP_GAME_A_ENABLED !== 'false';
  const gameBEnabled = process.env.REACT_APP_GAME_B_ENABLED === 'true';
  const gameCEnabled = process.env.REACT_APP_GAME_C_ENABLED === 'true';
  const maintenanceMode = process.env.REACT_APP_MAINTENANCE_MODE === 'true';

  const games = [
    {
      id: 'groove-orbit-runner',
      title: 'Groove Orbit Runner',
      subtitle: 'Arcade Skill-Based',
      description: 'Change orbits, dodge obstacles, survive the disco cosmos',
      icon: Rocket,
      available: gameAEnabled && !maintenanceMode,
      gradient: 'from-neon-pink to-cyan-pop',
      enabled: gameAEnabled
    },
    {
      id: 'space-groove-drift',
      title: 'Space Groove Drift',
      subtitle: 'Chill Aesthetic',
      description: 'Surf cosmic waves in a vaporwave paradise',
      icon: Waves,
      available: gameBEnabled && !maintenanceMode,
      gradient: 'from-cyan-pop to-retro-gold',
      enabled: gameBEnabled
    },
    {
      id: 'groove-arena-overdrive',
      title: 'Groove Arena Overdrive',
      subtitle: 'Competitive Hardcore',
      description: 'Dash to the beat, survive the overdrive',
      icon: Zap,
      available: gameCEnabled && !maintenanceMode,
      gradient: 'from-retro-gold to-acid-green',
      enabled: gameCEnabled
    }
  ].filter(game => game.enabled); // Filtrer les jeux désactivés

  return (
    <div className="min-h-screen bg-space-black relative overflow-hidden">
      <div className="starfield"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto p-6">
        <header className="text-center py-12">
          <h1 
            className="text-5xl font-orbitron font-black tracking-widest uppercase mb-4"
            style={{
              background: 'linear-gradient(90deg, #ff71ce 0%, #01cdfe 50%, #ff71ce 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'text-shimmer 3s ease-in-out infinite'
            }}
            data-testid="main-title"
          >
            Space Groove
          </h1>
          <p className="text-cyan-pop font-rajdhani text-lg tracking-wider" data-testid="subtitle">
            Arcade Collection
          </p>
        </header>

        {maintenanceMode && (
          <div className="bg-retro-gold/20 border-2 border-retro-gold rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-retro-gold rounded-full animate-pulse"></div>
              <h3 className="text-xl font-orbitron font-black text-retro-gold">Mode Maintenance</h3>
            </div>
            <p className="text-white font-rajdhani">
              Les jeux sont temporairement indisponibles. Merci de votre patience !
            </p>
          </div>
        )}

        {games.length === 0 && !maintenanceMode && (
          <div className="bg-deep-purple/30 backdrop-blur-xl border border-white/10 rounded-xl p-8 mb-6 text-center">
            <p className="text-gray-400 font-rajdhani text-lg">
              Aucun jeu n'est actuellement disponible.
            </p>
          </div>
        )}

        <div className="flex-1 space-y-6 mb-8">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <button
                key={game.id}
                onClick={() => game.available ? navigate(`/game/${game.id}`) : null}
                disabled={!game.available}
                className={`w-full group relative overflow-hidden rounded-xl border transition-all duration-300 ${
                  game.available
                    ? 'border-white/20 hover:border-cyan-pop/50 hover:shadow-[0_0_30px_rgba(1,205,254,0.2)] active:scale-[0.98] cursor-pointer'
                    : 'border-white/10 opacity-60 cursor-not-allowed'
                }`}
                data-testid={`game-card-${game.id}`}
              >
                <div className="relative bg-deep-purple/50 backdrop-blur-sm p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${game.gradient} ${!game.available && 'grayscale'}`}>
                      <Icon className="w-8 h-8 text-space-black" />
                    </div>
                    
                    <div className="flex-1 text-left">
                      <h3 className="text-xl font-orbitron font-bold text-white mb-1">
                        {game.title}
                      </h3>
                      <p className="text-sm font-accent text-cyan-pop uppercase tracking-widest mb-2">
                        {game.subtitle}
                      </p>
                      <p className="text-sm font-rajdhani text-gray-400">
                        {game.description}
                      </p>
                      {!game.available && (
                        <span className="inline-block mt-2 text-xs font-accent text-retro-gold uppercase">
                          Coming Soon
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {game.available && (
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-acid-green animate-pulse"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => navigate('/leaderboard')}
          className="w-full py-4 px-6 bg-neon-pink hover:bg-white text-black font-orbitron font-black uppercase tracking-widest rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(255,113,206,0.5)] active:scale-95 flex items-center justify-center gap-3"
          data-testid="leaderboard-button"
        >
          <Trophy className="w-6 h-6" />
          Leaderboard
        </button>

        <button
          onClick={() => navigate('/about')}
          className="w-full py-3 px-6 bg-deep-purple border-2 border-cyan-pop text-cyan-pop font-orbitron font-bold uppercase tracking-wider rounded-lg hover:bg-cyan-pop/10 transition-all flex items-center justify-center gap-3"
          data-testid="about-button"
        >
          <Info className="w-5 h-5" />
          À Propos
        </button>
      </div>
    </div>
  );
}