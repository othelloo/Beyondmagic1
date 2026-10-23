import React, { useRef, useEffect } from 'react';

interface SomaticResonanceCanvasProps {
  enabled: boolean;
  isPlaying: boolean;
  chordColor: string;
  chordTension: number; // 0 - 100
  chordName?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  phase: number;
  pulseSpeed: number;
  layer: number;
}

interface AcousticWave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
  color: string;
}

export const SomaticResonanceCanvas: React.FC<SomaticResonanceCanvasProps> = ({
  enabled,
  isPlaying,
  chordColor,
  chordTension,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Keep latest props in refs to avoid restarting the animation loop on prop change
  const propsRef = useRef({ enabled, isPlaying, chordColor, chordTension });
  useEffect(() => {
    propsRef.current = { enabled, isPlaying, chordColor, chordTension };
  }, [enabled, isPlaying, chordColor, chordTension]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number | null = null;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Smooth transition alpha for turning on/off
    let masterAlpha = enabled ? 1 : 0;
    const targetAlpha = () => (propsRef.current.enabled ? 1 : 0);

    // Particle pool
    const particles: Particle[] = [];
    const PARTICLE_COUNT = 52;

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * (width || window.innerWidth),
          y: Math.random() * (height || window.innerHeight),
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: 1.2 + Math.random() * 2.2,
          baseAlpha: 0.15 + Math.random() * 0.35,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.025,
          layer: 0.5 + Math.random() * 0.5,
        });
      }
    };

    // Expanding acoustic resonance waves
    const waves: AcousticWave[] = [];
    let lastWaveSpawn = 0;

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      if (particles.length === 0) {
        initParticles();
      }
    };

    handleResize();

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(canvas);

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let time = 0;

    const render = () => {
      const { enabled: isEnabled, isPlaying: sounding, chordColor: curColor, chordTension: tension } = propsRef.current;

      // Ease master alpha
      const tAlpha = isEnabled ? 1 : 0;
      masterAlpha += (tAlpha - masterAlpha) * 0.08;

      if (masterAlpha < 0.005 && !isEnabled) {
        // Paused when completely muted
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animId = requestAnimationFrame(render);
        return;
      }

      time += 0.02;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = masterAlpha;

      const tensionFactor = tension / 100;
      const soundActivity = sounding ? 1 : 0.2;

      // 1. Spawn expanding acoustic ripples when sound is ringing
      if (sounding && Date.now() - lastWaveSpawn > 1100) {
        lastWaveSpawn = Date.now();
        waves.push({
          x: width * 0.5 + (Math.random() - 0.5) * (width * 0.2),
          y: height * 0.5 + (Math.random() - 0.5) * (height * 0.2),
          radius: 10,
          maxRadius: Math.max(width, height) * 0.75,
          alpha: 0.18 + tensionFactor * 0.1,
          speed: 1.2 + tensionFactor * 0.8,
          color: curColor,
        });
      }

      // 2. Render and update acoustic wavefronts
      for (let i = waves.length - 1; i >= 0; i--) {
        const wave = waves[i];
        wave.radius += wave.speed;
        const progress = wave.radius / wave.maxRadius;
        const currentAlpha = Math.max(0, wave.alpha * (1 - progress));

        if (progress >= 1 || currentAlpha <= 0.001) {
          waves.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = currentAlpha * masterAlpha * 0.8;
        ctx.stroke();

        // Soft secondary internal acoustic echo ring
        if (wave.radius > 30) {
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.radius * 0.85, 0, Math.PI * 2);
          ctx.lineWidth = 0.6;
          ctx.globalAlpha = currentAlpha * masterAlpha * 0.4;
          ctx.stroke();
        }
        ctx.restore();
      }

      // 3. Connect nearby resonance particles with soft nodal filaments
      const maxDist = 80;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const proximity = 1 - dist / maxDist;
            const filamentAlpha = proximity * 0.12 * soundActivity * masterAlpha;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = curColor;
            ctx.globalAlpha = filamentAlpha;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      // 4. Update and render particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // Acoustic vibration jitter when chord sounds
          const vibrationX = sounding ? Math.sin(time * 8 + p.phase) * (0.8 + tensionFactor * 1.2) : 0;
          const vibrationY = sounding ? Math.cos(time * 7 + p.phase) * (0.8 + tensionFactor * 1.2) : 0;

          p.x += (p.vx * (sounding ? 1.5 : 1)) + vibrationX;
          p.y += (p.vy * (sounding ? 1.5 : 1)) + vibrationY;

          // Wrap edges smoothly
          if (p.x < -20) p.x = width + 20;
          if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          if (p.y > height + 20) p.y = -20;
        }

        // Resonant breath pulsing
        const pulse = Math.sin(time * 2 + p.phase) * 0.5 + 0.5;
        const currentRadius = p.radius * (1 + (sounding ? pulse * 0.6 : pulse * 0.2));
        const alpha = Math.min(1, (p.baseAlpha + (sounding ? pulse * 0.35 : 0)) * masterAlpha);

        // Core particle glow
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = curColor;
        ctx.globalAlpha = alpha * 0.85;
        ctx.fill();

        // Ethereal outer halo
        if (sounding || p.layer > 0.8) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = curColor;
          ctx.globalAlpha = alpha * 0.22;
          ctx.fill();
        }
        ctx.restore();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-700 z-0 ${
        enabled ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    />
  );
};
