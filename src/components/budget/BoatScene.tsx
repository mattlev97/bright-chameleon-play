import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MascotState } from './MascotBlob';

interface BoatSceneProps {
  state: MascotState;
  dailyBudget: number;
  size?: number;
}

const BoatScene = ({ state, dailyBudget, size = 300 }: BoatSceneProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveData, setWaveData] = useState({ y: 0, angle: 0 });

  const config = {
    happy: { color: '#3E7B85', amplitude: 10, speed: 0.02, bg: 'bg-sky-400', label: 'Bonaccia' },
    neutral: { color: '#2D5A63', amplitude: 20, speed: 0.04, bg: 'bg-blue-500', label: 'Vento Leggero' },
    sad: { color: '#1A3A3A', amplitude: 40, speed: 0.08, bg: 'bg-slate-700', label: 'Mare Mosso' },
    concerned: { color: '#0F2525', amplitude: 60, speed: 0.12, bg: 'bg-indigo-900', label: 'Tempesta' },
    shocked: { color: '#051515', amplitude: 80, speed: 0.18, bg: 'bg-black', label: 'Uragano' }
  }[state] || { color: '#2D5A63', amplitude: 20, speed: 0.04, bg: 'bg-blue-500', label: 'Vento Leggero' };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const render = () => {
      const width = canvas.width = canvas.offsetWidth;
      const height = canvas.height = canvas.offsetHeight;
      
      ctx.clearRect(0, 0, width, height);
      
      const drawWave = (layerOffset: number, opacity: number, ampMult: number) => {
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        const centerX = width / 2;
        let boatY = 0;
        let boatSlope = 0;

        for (let x = 0; x <= width; x++) {
          const angle = (x * 0.01) + offset + layerOffset;
          const y = Math.sin(angle) * config.amplitude * ampMult + (height * 0.75);
          ctx.lineTo(x, y);

          if (layerOffset === 0 && Math.abs(x - centerX) < 1) {
            boatY = y;
            boatSlope = Math.cos(angle) * config.amplitude * 0.01 * ampMult;
          }
        }

        ctx.lineTo(width, height);
        ctx.fillStyle = config.color;
        ctx.globalAlpha = opacity;
        ctx.fill();
        
        return { boatY, boatSlope };
      };

      drawWave(Math.PI, 0.3, 0.6);
      const physics = drawWave(0, 1, 1);
      drawWave(Math.PI / 2, 0.5, 1.2);

      setWaveData({ 
        y: physics.boatY, 
        angle: Math.atan(physics.boatSlope) * (180 / Math.PI) 
      });

      offset += config.speed;
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [state, config]);

  return (
    <div className={`relative w-full rounded-[40px] overflow-hidden shadow-2xl transition-colors duration-1000 ${config.bg}`} style={{ height: size }}>
      <div className="absolute inset-0 opacity-40 bg-gradient-to-b from-white/20 to-transparent" />
      
      <div className="absolute top-8 left-8 z-50 pointer-events-none">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Meteo</p>
        <h2 className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">{config.label}</h2>
      </div>

      <div className="absolute top-8 right-8 z-50 text-right pointer-events-none">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Oggi Puoi</p>
        <h2 className="text-3xl font-bold text-white tracking-tighter drop-shadow-lg">€ {dailyBudget.toFixed(0)}</h2>
      </div>

      <motion.div
        style={{ 
          left: '50%',
          top: waveData.y,
          x: '-50%',
          y: '-90%',
          rotate: waveData.angle
        }}
        className="absolute w-64 h-64 z-20 pointer-events-none"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
          <defs>
            <linearGradient id="hullMain" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2A2A2A" />
              <stop offset="100%" stopColor="#121212" />
            </linearGradient>
            <linearGradient id="hullBottom" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B2635" />
              <stop offset="100%" stopColor="#5A1822" />
            </linearGradient>
            <linearGradient id="cabinWhite" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#F4F4F4" />
              <stop offset="100%" stopColor="#D1D1D1" />
            </linearGradient>
          </defs>

          {/* Scafo (Hull) - Silhouette Trawler */}
          {/* Parte Rossa (Bottom) */}
          <path 
            d="M25,135 Q25,155 100,155 Q175,155 175,135 L170,125 L30,125 Z" 
            fill="url(#hullBottom)" 
          />
          {/* Parte Nera (Main) */}
          <path 
            d="M20,110 C20,110 25,135 100,135 C175,135 180,110 180,110 L170,100 L30,100 Z" 
            fill="url(#hullMain)" 
          />
          
          {/* Cabina (Cabin) */}
          <path 
            d="M70,100 L70,70 Q70,65 75,65 L125,65 Q130,65 130,70 L130,100 Z" 
            fill="url(#cabinWhite)" 
          />
          {/* Tetto Cabina */}
          <path d="M65,65 L135,65 L130,60 L70,60 Z" fill="#333" />
          
          {/* Finestre */}
          <rect x="78" y="72" width="18" height="15" fill="#1A2A2D" rx="1" />
          <rect x="104" y="72" width="18" height="15" fill="#1A2A2D" rx="1" />
          {/* Luce interna */}
          <rect x="80" y="74" width="14" height="11" fill="#F1C40F" opacity="0.3" className="animate-pulse" />

          {/* Albero Maestro (Mast) */}
          <rect x="98" y="25" width="4" height="40" fill="#222" />
          <line x1="100" y1="35" x2="150" y2="100" stroke="#111" strokeWidth="0.5" opacity="0.6" />
          <line x1="100" y1="45" x2="50" y2="100" stroke="#111" strokeWidth="0.5" opacity="0.6" />
          
          {/* Dettagli (Antenne/Luci) */}
          <circle cx="100" cy="25" r="1.5" fill="#FF0000" className="animate-pulse" />
          <rect x="135" y="90" width="10" height="10" fill="#8B2635" rx="5" /> {/* Salvagente */}
          <circle cx="140" cy="95" r="3" fill="#F4F4F4" />

          {/* Luci di navigazione sullo scafo */}
          <circle cx="35" cy="105" r="2" fill="#FF0000" />
          <circle cx="165" cy="105" r="2" fill="#00FF00" />
        </svg>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-40 h-6 bg-white/10 blur-lg rounded-full animate-pulse" />
      </motion.div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />

      <AnimatePresence>
        {(state === 'sad' || state === 'concerned' || state === 'shocked') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 pointer-events-none"
          >
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px]" />
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, x: Math.random() * 100 + '%' }}
                animate={{ y: size + 20 }}
                transition={{ duration: 0.4, repeat: Infinity, delay: Math.random() }}
                className="absolute w-[1px] h-10 bg-white/20 rotate-12"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BoatScene;