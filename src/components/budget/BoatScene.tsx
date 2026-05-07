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

  // Configurazione meteo e fisica
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
      
      // Disegno onde (3 strati per profondità)
      const drawWave = (layerOffset: number, opacity: number, ampMult: number) => {
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        const centerX = width / 2;
        let boatY = 0;
        let boatSlope = 0;

        for (let x = 0; x <= width; x++) {
          const angle = (x * 0.01) + offset + layerOffset;
          const y = Math.sin(angle) * config.amplitude * ampMult + (height * 0.7);
          ctx.lineTo(x, y);

          // Calcolo posizione e pendenza per la barca (solo sullo strato principale)
          if (layerOffset === 0 && Math.abs(x - centerX) < 1) {
            boatY = y;
            // Derivata per l'inclinazione
            boatSlope = Math.cos(angle) * config.amplitude * 0.01 * ampMult;
          }
        }

        ctx.lineTo(width, height);
        ctx.fillStyle = config.color;
        ctx.globalAlpha = opacity;
        ctx.fill();
        
        return { boatY, boatSlope };
      };

      // Strato posteriore
      drawWave(Math.PI, 0.3, 0.6);
      // Strato centrale (quello su cui galleggia la barca)
      const physics = drawWave(0, 1, 1);
      // Strato anteriore
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
      {/* Sfondo Atmosferico */}
      <div className="absolute inset-0 opacity-40 bg-gradient-to-b from-white/20 to-transparent" />
      
      {/* UI Overlay */}
      <div className="absolute top-8 left-8 z-50 pointer-events-none">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Meteo</p>
        <h2 className="text-2xl font-bold text-white tracking-tight drop-shadow-lg">{config.label}</h2>
      </div>

      <div className="absolute top-8 right-8 z-50 text-right pointer-events-none">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Oggi Puoi</p>
        <h2 className="text-3xl font-bold text-white tracking-tighter drop-shadow-lg">€ {dailyBudget.toFixed(0)}</h2>
      </div>

      {/* La Barca con "Fisica" */}
      <motion.div
        style={{ 
          left: '50%',
          top: waveData.y,
          x: '-50%',
          y: '-85%',
          rotate: waveData.angle
        }}
        className="absolute w-56 h-56 z-20 pointer-events-none"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
          <defs>
            <linearGradient id="hullGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4A3728" />
              <stop offset="100%" stopColor="#1A1108" />
            </linearGradient>
            <linearGradient id="cabinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#333" />
              <stop offset="100%" stopColor="#111" />
            </linearGradient>
          </defs>

          {/* Scafo Dettagliato */}
          <path 
            d="M20,120 C20,120 30,155 100,155 C170,155 180,120 180,120 L165,105 L35,105 Z" 
            fill="url(#hullGrad)" 
            stroke="#000" 
            strokeWidth="1"
          />
          {/* Linea di galleggiamento e ruggine */}
          <path d="M30,115 L170,115" stroke="#8B2635" strokeWidth="2" opacity="0.6" />
          <path d="M25,130 L175,130" stroke="#000" strokeWidth="0.5" opacity="0.3" />
          
          {/* Cabina con texture */}
          <rect x="75" y="65" width="50" height="40" fill="url(#cabinGrad)" rx="2" />
          <rect x="80" y="70" width="15" height="15" fill="#F1C40F" className="animate-pulse" />
          <rect x="105" y="70" width="15" height="15" fill="#F1C40F" opacity="0.8" />
          
          {/* Albero e Cavi */}
          <line x1="100" y1="65" x2="100" y2="25" stroke="#111" strokeWidth="4" />
          <path d="M100,35 L150,105" stroke="#111" strokeWidth="1" opacity="0.4" />
          <path d="M100,45 L50,105" stroke="#111" strokeWidth="1" opacity="0.4" />
          
          {/* Luci di navigazione */}
          <circle cx="35" cy="110" r="3" fill="#FF0000">
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="165" cy="110" r="3" fill="#00FF00">
            <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Schiuma alla base della barca */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-4 bg-white/20 blur-md rounded-full animate-pulse" />
      </motion.div>

      {/* Canvas per le onde */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />

      {/* Effetti particellari (Pioggia/Nebbia) */}
      <AnimatePresence>
        {(state === 'sad' || state === 'concerned' || state === 'shocked') && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 pointer-events-none"
          >
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px]" />
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, x: Math.random() * 100 + '%' }}
                animate={{ y: size + 20 }}
                transition={{ duration: 0.5, repeat: Infinity, delay: Math.random() }}
                className="absolute w-[1px] h-8 bg-white/30 rotate-12"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BoatScene;