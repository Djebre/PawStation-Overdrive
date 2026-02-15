import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Phaser from 'phaser';
import axios from 'axios';
import { X, Trophy, Send } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function GrooveOrbitRunner() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const gameRef = useRef(null);
  const phaserGameRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!gameRef.current || phaserGameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      width: 390,
      height: 844,
      parent: gameRef.current,
      backgroundColor: '#050612',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: {
        create: createGame,
        update: updateGame
      }
    };

    const game = new Phaser.Game(config);
    phaserGameRef.current = game;

    let player;
    let planet;
    let obstacles = [];
    let score = 0;
    let scoreText;
    let tapHint;
    let currentOrbit = 0;
    let orbits = [150, 220, 290];
    let gameRunning = true;
    let obstacleTimer = 0;
    let spawnInterval = 2000;
    let speed = 2;
    let stars = [];

    function createGame() {
      const scene = this;

      // Create starfield
      for (let i = 0; i < 100; i++) {
        const x = Phaser.Math.Between(0, 390);
        const y = Phaser.Math.Between(0, 844);
        const star = scene.add.circle(x, y, Phaser.Math.Between(1, 2), 0xffffff, Phaser.Math.FloatBetween(0.3, 0.8));
        stars.push(star);
      }

      // Create planet (center disco ball)
      planet = scene.add.circle(195, 422, 60, 0xff71ce);
      scene.add.circle(195, 422, 50, 0x01cdfe, 0.5);
      scene.add.circle(195, 422, 40, 0xfffb96, 0.3);

      // Draw orbit lines
      const graphics = scene.add.graphics();
      graphics.lineStyle(2, 0xffffff, 0.2);
      orbits.forEach(radius => {
        graphics.strokeCircle(195, 422, radius);
      });

      // Create player
      player = scene.add.circle(195, 422 - orbits[currentOrbit], 12, 0xff71ce);
      scene.physics.add.existing(player);

      // Score text
      scoreText = scene.add.text(20, 40, '0', {
        fontFamily: '"Press Start 2P"',
        fontSize: '24px',
        color: '#fffb96',
        stroke: '#000000',
        strokeThickness: 4
      });

      // Tap hint
      tapHint = scene.add.text(195, 700, t('game.tapToChange'), {
        fontFamily: 'Rajdhani',
        fontSize: '14px',
        color: '#ffffff',
        alpha: 0.5
      }).setOrigin(0.5);

      scene.tweens.add({
        targets: tapHint,
        alpha: 0.2,
        duration: 1000,
        yoyo: true,
        repeat: -1
      });

      // Input handling
      scene.input.on('pointerdown', () => {
        if (!gameRunning) return;
        
        currentOrbit = (currentOrbit + 1) % orbits.length;
        
        scene.tweens.add({
          targets: player,
          x: 195 + Math.cos(player.angle) * orbits[currentOrbit],
          y: 422 + Math.sin(player.angle) * orbits[currentOrbit],
          duration: 200,
          ease: 'Power2'
        });
      });

      // Rotate player around planet
      player.angle = -Math.PI / 2;
    }

    function updateGame(time, delta) {
      const scene = this;
      
      if (!gameRunning) return;

      // Animate stars (subtle twinkle)
      stars.forEach(star => {
        star.alpha = Math.sin(time * 0.001 + star.x * 0.01) * 0.3 + 0.5;
      });

      // Rotate player
      player.angle += (0.02 + speed * 0.005);
      const radius = orbits[currentOrbit];
      player.x = 195 + Math.cos(player.angle) * radius;
      player.y = 422 + Math.sin(player.angle) * radius;

      // Spawn obstacles
      obstacleTimer += delta;
      if (obstacleTimer > spawnInterval) {
        obstacleTimer = 0;
        spawnObstacle(scene);
      }

      // Update obstacles
      obstacles = obstacles.filter(obstacle => {
        obstacle.angle += (0.02 + speed * 0.005);
        const obstacleRadius = orbits[obstacle.orbitIndex];
        obstacle.x = 195 + Math.cos(obstacle.angle) * obstacleRadius;
        obstacle.y = 422 + Math.sin(obstacle.angle) * obstacleRadius;

        // Check collision
        const dist = Phaser.Math.Distance.Between(player.x, player.y, obstacle.x, obstacle.y);
        if (dist < 20) {
          endGame(scene);
          return false;
        }

        // Check if passed
        if (!obstacle.passed) {
          const angleDiff = player.angle - obstacle.angle;
          if (angleDiff > 0.3 && angleDiff < Math.PI) {
            obstacle.passed = true;
            score += 10;
            scoreText.setText(score.toString());
            
            // Increase difficulty
            if (score % 100 === 0) {
              speed += 0.3;
              spawnInterval = Math.max(1000, spawnInterval - 100);
            }
          }
        }

        // Remove if too far behind
        if (obstacle.angle < player.angle - Math.PI) {
          obstacle.destroy();
          return false;
        }

        return true;
      });
    }

    function spawnObstacle(scene) {
      const orbitIndex = Phaser.Math.Between(0, orbits.length - 1);
      const radius = orbits[orbitIndex];
      const spawnAngle = player.angle + Math.PI;
      
      const obstacle = scene.add.circle(
        195 + Math.cos(spawnAngle) * radius,
        422 + Math.sin(spawnAngle) * radius,
        10,
        0x05ffa1
      );
      
      obstacle.angle = spawnAngle;
      obstacle.orbitIndex = orbitIndex;
      obstacle.passed = false;
      
      obstacles.push(obstacle);
    }

    function endGame(scene) {
      gameRunning = false;
      scene.input.enabled = false;
      
      // Flash effect
      scene.cameras.main.flash(500, 255, 0, 85);
      
      setFinalScore(score);
      setGameOver(true);
    }

    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  const handleSubmitScore = async (e) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    try {
      setSubmitting(true);
      await axios.post(`${API}/score`, {
        name: playerName.trim(),
        score: finalScore,
        game_type: 'groove-orbit-runner',
        telegram: telegramUsername.trim() || null
      });
      navigate('/leaderboard');
    } catch (error) {
      console.error('Error submitting score:', error);
      alert(t('game.submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="game-container bg-space-black">
      <div className="game-canvas-wrapper" ref={gameRef}></div>

      {gameOver && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          style={{ backgroundColor: 'rgba(5, 6, 18, 0.9)' }}
        >
          <div 
            className="w-full max-w-sm bg-deep-purple/90 backdrop-blur-xl border border-white/20 rounded-xl p-8 relative"
            data-testid="game-over-modal"
          >
            <button
              onClick={() => navigate('/')}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              data-testid="close-modal-button"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-3xl font-orbitron font-black text-white mb-2">
                {t('game.gameOver')}
              </h2>
              <p className="text-5xl font-orbitron font-black text-neon-pink mb-2" data-testid="final-score">
                {finalScore}
              </p>
              <p className="text-sm font-rajdhani text-cyan-pop uppercase tracking-wider">
                {t('game.points')}
              </p>
            </div>

            <form onSubmit={handleSubmitScore} className="space-y-4">
              <div>
                <label className="block text-sm font-rajdhani text-gray-400 mb-2">
                  {t('game.yourName')}
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder={t('game.enterName')}
                  maxLength={20}
                  className="w-full bg-black/50 border border-white/20 rounded-lg p-4 text-white placeholder-gray-500 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-all outline-none font-rajdhani"
                  required
                  data-testid="player-name-input"
                />
              </div>

              <div>
                <label className="block text-sm font-rajdhani text-gray-400 mb-2">
                  <Send className="w-4 h-4 inline mr-2" />
                  {t('game.telegram')}
                </label>
                <input
                  type="text"
                  value={telegramUsername}
                  onChange={(e) => setTelegramUsername(e.target.value.replace(/^@/, ''))}
                  placeholder={t('game.telegramPlaceholder')}
                  maxLength={32}
                  className="w-full bg-black/50 border border-white/20 rounded-lg p-4 text-white placeholder-gray-500 focus:border-cyan-pop focus:ring-1 focus:ring-cyan-pop transition-all outline-none font-rajdhani"
                  data-testid="telegram-input"
                />
                <p className="text-xs text-gray-500 mt-1 font-rajdhani">
                  {t('game.telegramHint')}
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting || !playerName.trim()}
                className="w-full py-4 px-6 bg-neon-pink hover:bg-white text-black font-orbitron font-black uppercase tracking-widest rounded-lg transition-all duration-200 shadow-[0_0_20px_rgba(255,113,206,0.5)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                data-testid="submit-score-button"
              >
                <Trophy className="w-5 h-5" />
                {submitting ? t('game.submitting') : t('game.submitScore')}
              </button>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="w-full py-3 px-6 bg-deep-purple border-2 border-cyan-pop text-cyan-pop font-orbitron font-bold uppercase tracking-wider rounded-lg hover:bg-cyan-pop/10 transition-all"
                data-testid="play-again-button"
              >
                {t('game.playAgain')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
