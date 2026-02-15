import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trophy, Medal, Download } from 'lucide-react';
import axios from 'axios';
import { useLanguage } from '../i18n/LanguageContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Leaderboard() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? { game_type: filter } : {};
      const response = await axios.get(`${API}/leaderboard`, { params });
      setScores(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = filter !== 'all' ? `?game_type=${filter}` : '';
      window.open(`${API}/leaderboard/export${params}`, '_blank');
    } catch (error) {
      console.error('Error exporting leaderboard:', error);
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-retro-gold';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-amber-600';
    return 'text-gray-500';
  };

  const getRankIcon = (rank) => {
    if (rank <= 3) {
      return <Trophy className={`w-6 h-6 ${getRankColor(rank)}`} />;
    }
    return <span className="text-gray-500 font-orbitron font-bold">{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-space-black relative overflow-hidden">
      <div className="starfield"></div>
      
      <div className="relative z-10 min-h-screen max-w-md mx-auto p-6 flex flex-col">
        <header className="py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-cyan-pop hover:text-white transition-colors mb-6"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-rajdhani font-bold">{t('leaderboard.back')}</span>
          </button>
          
          <h1 className="text-4xl font-orbitron font-black text-white mb-4" data-testid="leaderboard-title">
            {t('leaderboard.title')}
          </h1>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-rajdhani font-bold text-sm transition-all ${
                filter === 'all'
                  ? 'bg-neon-pink text-black'
                  : 'bg-deep-purple/50 text-gray-400 border border-white/10 hover:border-cyan-pop/50'
              }`}
              data-testid="filter-all"
            >
              {t('leaderboard.allGames')}
            </button>
            <button
              onClick={() => setFilter('groove-orbit-runner')}
              className={`px-4 py-2 rounded-lg font-rajdhani font-bold text-sm transition-all ${
                filter === 'groove-orbit-runner'
                  ? 'bg-neon-pink text-black'
                  : 'bg-deep-purple/50 text-gray-400 border border-white/10 hover:border-cyan-pop/50'
              }`}
              data-testid="filter-groove-orbit"
            >
              {t('leaderboard.orbitRunner')}
            </button>
          </div>
        </header>

        <div className="flex-1 bg-deep-purple/30 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-cyan-pop font-rajdhani text-lg animate-pulse">{t('leaderboard.loading')}</div>
            </div>
          ) : scores.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <Medal className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-gray-400 font-rajdhani text-lg">{t('leaderboard.noScores')}</p>
              <p className="text-gray-500 font-rajdhani text-sm mt-2">{t('leaderboard.beFirst')}</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {scores.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                  data-testid={`leaderboard-entry-${index}`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 flex items-center justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <div className="flex-1">
                      <p className={`font-orbitron font-bold ${
                        entry.rank <= 3 ? getRankColor(entry.rank) : 'text-white'
                      }`}>
                        {entry.name}
                      </p>
                      <p className="text-xs text-gray-500 font-rajdhani">
                        {new Date(entry.timestamp).toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-orbitron font-black ${
                      entry.rank <= 3 ? getRankColor(entry.rank) : 'text-cyan-pop'
                    }`}>
                      {entry.score.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}