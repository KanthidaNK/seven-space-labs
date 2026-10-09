import React, { useEffect, useRef } from 'react';
import { ThemeMode } from '../types';

interface StarlightBackgroundProps {
  theme: ThemeMode;
}

export const StarlightBackground: React.FC<StarlightBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle pool
    const count = theme === 'white' ? 50 : 90;
    const stars: Array<{
      x: number;
      y: number;
      radius: number;
      alpha: number;
      speed: number;
      twinkleSpeed: number;
      twinklePhase: number;
      color: string;
    }> = [];

    const colorsWhite = [
      'rgba(99, 102, 241, ', // Indigo
      'rgba(14, 165, 233, ', // Sky
      'rgba(168, 85, 247, ', // Purple
      'rgba(79, 70, 229, ',  // Deep indigo
    ];

    const colorsCosmic = [
      'rgba(255, 255, 255, ',
      'rgba(192, 132, 252, ',
      'rgba(56, 189, 248, ',
      'rgba(129, 140, 248, ',
    ];

    const palette = theme === 'white' ? colorsWhite : colorsCosmic;

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.7 + 0.2,
        speed: (Math.random() - 0.5) * 0.15,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        color: palette[Math.floor(Math.random() * palette.length)],
      });
    }

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Render subtle orbital arcs
      ctx.lineWidth = 0.5;
      const orbitalColor = theme === 'white' ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255, 255, 255, 0.04)';
      ctx.strokeStyle = orbitalColor;

      ctx.beginPath();
      ctx.ellipse(width * 0.85, height * 0.25, 420, 220, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(width * 0.15, height * 0.75, 500, 260, -Math.PI / 8, 0, Math.PI * 2);
      ctx.stroke();

      // Render constellation connections for nearby stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.y += s.speed;
        s.twinklePhase += s.twinkleSpeed;
        const currentAlpha = Math.max(0.1, s.alpha + Math.sin(s.twinklePhase) * 0.3);

        if (s.y > height) s.y = 0;
        if (s.y < 0) s.y = height;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color}${currentAlpha})`;
        ctx.fill();

        // Connect nearby points
        for (let j = i + 1; j < stars.length; j++) {
          const s2 = stars[j];
          const dist = Math.hypot(s.x - s2.x, s.y - s2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(s.x, s.y);
            ctx.lineTo(s2.x, s2.y);
            const lineAlpha = (1 - dist / 100) * (theme === 'white' ? 0.06 : 0.08);
            ctx.strokeStyle = `rgba(99, 102, 241, ${lineAlpha})`;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background Gradient Mesh */}
      {theme === 'white' ? (
        <div className="absolute inset-0 bg-[#ffffff]">
          {/* Subtle pearlescent sci-fi radial aurora glow */}
          <div className="absolute -top-[15%] left-[20%] w-[60vw] h-[50vh] rounded-full bg-gradient-to-br from-indigo-100/50 via-purple-50/40 to-transparent blur-3xl opacity-70" />
          <div className="absolute top-[35%] -right-[10%] w-[50vw] h-[55vh] rounded-full bg-gradient-to-bl from-sky-100/50 via-blue-50/30 to-transparent blur-3xl opacity-60" />
          <div className="absolute top-[70%] left-[5%] w-[45vw] h-[45vh] rounded-full bg-gradient-to-tr from-violet-100/40 via-indigo-50/30 to-transparent blur-3xl opacity-60" />
          {/* Subtle tech grid texture */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #4f46e5 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#070913]">
          {/* Deep Space Cosmic nebula */}
          <div className="absolute -top-[10%] left-[10%] w-[65vw] h-[60vh] rounded-full bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-transparent blur-3xl opacity-80" />
          <div className="absolute top-[40%] right-[0%] w-[55vw] h-[60vh] rounded-full bg-gradient-to-bl from-cyan-900/30 via-sky-950/40 to-transparent blur-3xl opacity-70" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>
      )}

      {/* HTML5 Canvas for animated starlight & orbits */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
