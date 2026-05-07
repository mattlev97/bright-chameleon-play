import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MascotState } from './MascotBlob';

interface BoatSceneProps {
  state: MascotState;
  dailyBudget: number;
  size?: number;
}

const BoatScene = ({ state, dailyBudget, size = 300 }: BoatSceneProps) => {
  const weatherConfig = {
    happy: {
      label: "Bonaccia",
      bg: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&q=80&w=800",
      overlay: "bg-orange-500/10",
      boatY: [0, -10, 0],
      rotation: [0, 2, 0],
      showRain: false,
      fog: "opacity-0"
    },
    neutral: {
      label: "Vento Leggero",
      bg: "https://images.unsplash.com/photo-1439405326854-014607f694d7?auto=format&fit=crop&q=80&w=800",
      overlay: "bg-blue-500/5",
      boatY: [0, -15, 0],
      rotation: [-1, 3, -1],
      showRain: false,
      fog: "opacity-20"
    },
    sad: {
      label: "Mare Mosso",
      bg: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=800",
      overlay: "bg-slate-900/40",
      boatY: [0, -25, 0],
      rotation: [-3, 5, -3],
      showRain: true,
      fog: "opacity-40"
    },
    concerned: {
      label: "Tempesta",
      bg: "https://images.unsplash.com/photo-1475116127127-e3ce09ee84e1?auto=format&fit=crop&q=80&w=800",
      overlay: "bg-indigo-950/60",
      boatY: [0, -35, 0],
      rotation: [-5, 8, -5],
      showRain: true,
      fog: "opacity-60"
    },
    shocked: {
      label: "Uragano",
      bg: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=800",
      overlay: "bg-black/80",
      boatY: [0, -45, 0],
      rotation: [-8, 12, -8],
      showRain: true,
      fog: "opacity-80"
    }
  };

  const config = weatherConfig[state] || weatherConfig.neutral;

  return (
    <div className="relative w-full rounded-[40px] overflow-hidden shadow-2xl bg-slate-950" style={{ height: size }}>
      {/* Sfondo Dinamico */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src={config.bg} 
            className="w-full h-full object-cover brightness-75 contrast-125"
            alt="Sea background"
          />
          <div className={`absolute inset-0 ${config.overlay} mix-blend-multiply transition-colors duration-1000`} />
        </motion.div>
      </AnimatePresence>

      {/* Effetto Nebbia */}
      <div className={`absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent ${config.fog} transition-opacity duration-1000`} />

      {/* Pioggia */}
      {config.showRain && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100, x: Math.random() * 400 }}
              animate={{ y: 500, x: (Math.random() * 400) - 50 }}
              transition={{ 
                duration: 0.5 + Math.random() * 0.5, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 2
              }}
              className="absolute w-[1px] h-10 bg-white/20 rotate-[15deg]"
            />
          ))}
        </div>
      )}

      {/* La Barca (Illustrazione Dettagliata) */}
      <motion.div
        animate={{ 
          y: config.boatY,
          rotate: config.rotation
        }}
        transition={{ 
          duration: state === 'happy' ? 4 : 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-48 z-20 drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Scafo con texture legno */}
          <path 
            d="M20,120 Q20,150 100,150 Q180,150 180,120 L160,100 L40,100 Z" 
            fill="#2C1E12" 
            stroke="#1A1108" 
            strokeWidth="2"
          />
          <path d="M30,110 L170,110" stroke="#3D2B1D" strokeWidth="1" opacity="0.5" />
          <path d="M35,120 L165,120" stroke="#3D2B1D" strokeWidth="1" opacity="0.5" />
          
          {/* Cabina */}
          <rect x="70" y="60" width="50" height="45" fill="#1A1A1A" rx="2" />
          <rect x="75" y="65" width="15" height="15" fill={state === 'shocked' ? '#333' : '#F1C40F'} className="animate-pulse" />
          
          {/* Albero e Dettagli */}
          <line x1="100" y1="60" x2="100" y2="20" stroke="#1A1A1A" strokeWidth="4" />
          <path d="M100,30 L140,80" stroke="#1A1A1A" strokeWidth="1" opacity="0.4" />
          
          {/* Luci di navigazione */}
          <circle cx="35" cy="105" r="3" fill="#FF0000" className="animate-pulse" />
          <circle cx="165" cy="105" r="3" fill="#00FF00" className="animate-pulse" />
        </svg>
      </motion.div>

      {/* UI Overlay */}
      <div className="absolute top-8 left-8 z-50 pointer-events-none">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Meteo</p>
        <h2 className="text-2xl font-bold text-[#F4EBD0] tracking-tight drop-shadow-lg">{config.label}</h2>
      </div>

      <div className="absolute top-8 right-8 z-50 text-right pointer-events-none">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Oggi Puoi</p>
        <h2 className="text-3xl font-bold text-[#F4EBD0] tracking-tighter drop-shadow-lg">€ {dailyBudget.toFixed(0)}</h2>
      </div>

      {/* Onde in primo piano per profondità */}
      <motion.div 
        animate={{ x: [-20, 20, -20] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-[-10%] w-[120%] h-24 bg-gradient-to-t from-slate-950 to-transparent opacity-80 z-30" 
      />
    </div>
  );
};

export default BoatScene;