import { useEffect, useRef, useState } from 'react';

/**
 * Hook pour gérer la musique de fond
 * @param {string} musicPath - Chemin vers le fichier audio (ex: '/music/home.mp3')
 * @param {boolean} autoplay - Démarrer automatiquement
 * @param {boolean} loop - Boucler la musique
 * @param {number} volume - Volume initial (0-1)
 */
export const useMusic = (musicPath, { autoplay = true, loop = true, volume = 0.5 } = {}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!musicPath) return;

    // Créer l'élément audio
    const audio = new Audio(musicPath);
    audio.loop = loop;
    audio.volume = currentVolume;
    audioRef.current = audio;

    // Event listeners
    const handleCanPlay = () => {
      setIsLoaded(true);
      if (autoplay) {
        // Essayer de jouer automatiquement
        audio.play().catch(() => {
          // Autoplay bloqué par le navigateur, on attend l'interaction utilisateur
          console.log('Autoplay blocked, waiting for user interaction');
        });
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    // Cleanup
    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [musicPath, loop, autoplay]);

  // Mettre à jour le volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : currentVolume;
    }
  }, [currentVolume, isMuted]);

  const play = () => {
    if (audioRef.current && isLoaded) {
      audioRef.current.play().catch(console.error);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const setVolume = (newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setCurrentVolume(clampedVolume);
  };

  return {
    isPlaying,
    isMuted,
    volume: currentVolume,
    isLoaded,
    play,
    pause,
    stop,
    toggleMute,
    setVolume,
    audioElement: audioRef.current,
  };
};
