import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Hook pour analyser les fréquences audio en temps réel
 * Utilise le Web Audio API pour créer un visualiseur
 */
export const useAudioAnalyzer = (audioElement, { fftSize = 256, smoothing = 0.8 } = {}) => {
  const audioContextRef = useRef(null);
  const analyzerRef = useRef(null);
  const sourceRef = useRef(null);
  const dataArrayRef = useRef(null);
  const animationRef = useRef(null);
  const isConnectedRef = useRef(false);
  
  const [frequencyData, setFrequencyData] = useState([]);
  const [bassLevel, setBassLevel] = useState(0);
  const [midLevel, setMidLevel] = useState(0);
  const [highLevel, setHighLevel] = useState(0);
  const [averageLevel, setAverageLevel] = useState(0);

  const connect = useCallback(() => {
    if (!audioElement || isConnectedRef.current) return;

    try {
      // Créer ou réutiliser le contexte audio
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;

      // Créer l'analyseur
      if (!analyzerRef.current) {
        analyzerRef.current = audioContext.createAnalyser();
        analyzerRef.current.fftSize = fftSize;
        analyzerRef.current.smoothingTimeConstant = smoothing;
      }

      // Connecter la source audio
      if (!sourceRef.current) {
        sourceRef.current = audioContext.createMediaElementSource(audioElement);
        sourceRef.current.connect(analyzerRef.current);
        analyzerRef.current.connect(audioContext.destination);
      }

      // Créer le buffer pour les données
      const bufferLength = analyzerRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      isConnectedRef.current = true;

      // Démarrer l'analyse
      const analyze = () => {
        if (!analyzerRef.current || !dataArrayRef.current) return;

        analyzerRef.current.getByteFrequencyData(dataArrayRef.current);
        
        const data = Array.from(dataArrayRef.current);
        setFrequencyData(data);

        // Calculer les niveaux par bande de fréquence
        const third = Math.floor(data.length / 3);
        
        // Basses (0-33%)
        const bassData = data.slice(0, third);
        const bass = bassData.reduce((a, b) => a + b, 0) / bassData.length / 255;
        setBassLevel(bass);

        // Médiums (33-66%)
        const midData = data.slice(third, third * 2);
        const mid = midData.reduce((a, b) => a + b, 0) / midData.length / 255;
        setMidLevel(mid);

        // Aigus (66-100%)
        const highData = data.slice(third * 2);
        const high = highData.reduce((a, b) => a + b, 0) / highData.length / 255;
        setHighLevel(high);

        // Moyenne générale
        const avg = data.reduce((a, b) => a + b, 0) / data.length / 255;
        setAverageLevel(avg);

        animationRef.current = requestAnimationFrame(analyze);
      };

      analyze();
    } catch (error) {
      console.error('Error connecting audio analyzer:', error);
    }
  }, [audioElement, fftSize, smoothing]);

  const disconnect = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        // Ne pas fermer le contexte pour éviter les problèmes de reconnexion
      }
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    frequencyData,
    bassLevel,
    midLevel,
    highLevel,
    averageLevel,
    isConnected: isConnectedRef.current,
  };
};
