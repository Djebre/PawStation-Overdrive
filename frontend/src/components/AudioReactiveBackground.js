import { useEffect, useRef, useMemo } from 'react';

/**
 * Composant de fond réactif à la musique avec particules flottantes
 * Utilise Canvas pour des performances optimales
 */
export default function AudioReactiveBackground({ 
  bassLevel = 0, 
  midLevel = 0, 
  highLevel = 0, 
  averageLevel = 0,
  particleCount = 50 
}) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Couleurs du thème Cosmic Disco
  const colors = useMemo(() => ({
    neonPink: '#ff71ce',
    cyanPop: '#01cdfe',
    retroGold: '#fffb96',
    acidGreen: '#05ffa1',
    deepPurple: '#1a0a2e',
  }), []);

  // Initialiser les particules
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initParticles = () => {
      const particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(createParticle(canvas.width, canvas.height));
      }
      particlesRef.current = particles;
    };

    const createParticle = (width, height) => {
      const colorArray = [colors.neonPink, colors.cyanPop, colors.retroGold, colors.acidGreen];
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        baseSize: Math.random() * 3 + 1,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colorArray[Math.floor(Math.random() * colorArray.length)],
        alpha: Math.random() * 0.5 + 0.2,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        type: Math.random() > 0.7 ? 'star' : 'circle',
      };
    };

    // Resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    // Mouse move handler
    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [particleCount, colors]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dessiner les cercles de fond réactifs à la musique
      drawMusicReactiveBackground(ctx, canvas.width, canvas.height);

      // Dessiner et mettre à jour les particules
      particlesRef.current.forEach((particle, index) => {
        updateParticle(particle, canvas.width, canvas.height, index);
        drawParticle(ctx, particle);
      });

      // Dessiner les connexions entre particules proches
      drawConnections(ctx);

      animationRef.current = requestAnimationFrame(animate);
    };

    const drawMusicReactiveBackground = (ctx, width, height) => {
      const centerX = width / 2;
      const centerY = height / 2;

      // Cercle de basses (grand, au centre)
      if (bassLevel > 0.1) {
        const bassRadius = 100 + bassLevel * 200;
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, bassRadius);
        gradient.addColorStop(0, `rgba(255, 113, 206, ${bassLevel * 0.3})`);
        gradient.addColorStop(0.5, `rgba(255, 113, 206, ${bassLevel * 0.1})`);
        gradient.addColorStop(1, 'rgba(255, 113, 206, 0)');
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, bassRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Cercle des médiums (moyen)
      if (midLevel > 0.1) {
        const midRadius = 80 + midLevel * 150;
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, midRadius);
        gradient.addColorStop(0, `rgba(1, 205, 254, ${midLevel * 0.25})`);
        gradient.addColorStop(0.5, `rgba(1, 205, 254, ${midLevel * 0.1})`);
        gradient.addColorStop(1, 'rgba(1, 205, 254, 0)');
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, midRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Cercle des aigus (petit, pulsant)
      if (highLevel > 0.1) {
        const highRadius = 50 + highLevel * 100;
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, highRadius);
        gradient.addColorStop(0, `rgba(255, 251, 150, ${highLevel * 0.4})`);
        gradient.addColorStop(0.5, `rgba(255, 251, 150, ${highLevel * 0.15})`);
        gradient.addColorStop(1, 'rgba(255, 251, 150, 0)');
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, highRadius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Barres de fréquence en arrière-plan (optionnel, subtil)
      if (averageLevel > 0.05) {
        const barCount = 20;
        const barWidth = width / barCount;
        
        for (let i = 0; i < barCount; i++) {
          const barHeight = (Math.sin(i * 0.5 + Date.now() * 0.002) * 0.5 + 0.5) * averageLevel * 100;
          const alpha = averageLevel * 0.1;
          
          ctx.fillStyle = i % 2 === 0 
            ? `rgba(1, 205, 254, ${alpha})` 
            : `rgba(255, 113, 206, ${alpha})`;
          
          ctx.fillRect(
            i * barWidth, 
            height - barHeight, 
            barWidth - 2, 
            barHeight
          );
        }
      }
    };

    const updateParticle = (particle, width, height, index) => {
      // Mise à jour de la position
      particle.x += particle.speedX + (bassLevel * (Math.random() - 0.5) * 2);
      particle.y += particle.speedY + (midLevel * (Math.random() - 0.5) * 2);

      // Effet de pulsation basé sur la musique
      particle.pulse += particle.pulseSpeed;
      const pulseFactor = 1 + Math.sin(particle.pulse) * 0.3 + averageLevel * 0.5;
      particle.size = particle.baseSize * pulseFactor;

      // Alpha réactif à la musique
      particle.alpha = Math.min(0.8, 0.2 + averageLevel * 0.4 + Math.sin(particle.pulse) * 0.1);

      // Wrap around edges
      if (particle.x < -10) particle.x = width + 10;
      if (particle.x > width + 10) particle.x = -10;
      if (particle.y < -10) particle.y = height + 10;
      if (particle.y > height + 10) particle.y = -10;

      // Légère attraction vers la souris
      const dx = mouseRef.current.x - particle.x;
      const dy = mouseRef.current.y - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150) {
        particle.x += dx * 0.002;
        particle.y += dy * 0.002;
      }
    };

    const drawParticle = (ctx, particle) => {
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      
      if (particle.type === 'star') {
        drawStar(ctx, particle.x, particle.y, 5, particle.size * 2, particle.size, particle.color);
      } else {
        // Cercle avec glow
        ctx.shadowBlur = 10 + averageLevel * 20;
        ctx.shadowColor = particle.color;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      }
      
      ctx.restore();
    };

    const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius, color) => {
      let rot = Math.PI / 2 * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };

    const drawConnections = (ctx) => {
      const particles = particlesRef.current;
      const connectionDistance = 100 + averageLevel * 50;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.15 * (1 + averageLevel);
            ctx.strokeStyle = `rgba(1, 205, 254, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [bassLevel, midLevel, highLevel, averageLevel, colors]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
}
