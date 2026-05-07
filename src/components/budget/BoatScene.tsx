import React from 'react';
import { motion } from 'framer-motion';
import { MascotState } from './MascotBlob';
import { Sun, CloudRain, Zap } from 'lucide-react';

interface BoatSceneProps {
  state: MascotState;
  dailyBudget: number;
  size?: number;
}

const BoatScene = ({ state, dailyBudget, size = 280 }: BoatSceneProps) => {
  const weatherLabels: Record<MascotState, string> = {
    happy: "Bonaccia",
    neutral: "Vento Leggero",
    sad: "Mare Mosso",
    concerned: "Tempesta",
    shocked: "Uragano"
  };

  const weatherConfig = {
    happy: {
      sky: "bg-gradient-to-b from-[#4A2C1B] to-[#E67E22]",
      seaColor: "#1A4A54",
      waveHeight: 4,
      rain: false,
      mistOpacity: 0.1
    },
    neutral: {
      sky: "bg-gradient-to-b from-[#2C3E50] to-[#34495E]",
      seaColor: "#16353A",
      waveHeight: 8,
      rain: false,
      mistOpacity: 0.3
    },
    sad: {
      sky: "bg-gradient-to-b from-[#1A252F] to-[#2C3E50]",
      seaColor: "#0F2A2A",
      waveHeight: 12,
      rain: true,
      mistOpacity: 0.5
    },
    concerned: {
      sky: "bg-gradient-to-b from-[#000000] to-[#1A252F]",
      seaColor: "#0A1F1F",
      waveHeight: 20,
      rain: true,
      mistOpacity: 0.7
    },
    shocked: {
      sky: "bg-black",
      seaColor: "#051515",
      waveHeight: 35,
      rain: true,
      mistOpacity: 0.9
    }
  };

  const config = weatherConfig[state];

  return (
    <div 
      className={`relative overflow-hidden rounded-[32px] transition-all duration-1000 ${config.sky} shadow-2xl`}
      style={{ width: '100%', height: size }}
    >
      {/* Overlay Testuali (Meteo e Budget) */}
      <div className="absolute top-6 left-6 z-50">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Meteo</p>
        <h2 className="text-xl font-bold text-[#F4EBD0] tracking-tight">{weatherLabels[state]}</h2>
      </div>

      <div className="absolute top-6 right-6 z-50 text-right">
        <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Oggi Puoi</p>
        <h2 className="text-2xl font-bold text-[#F4EBD0] tracking-tighter">€ {dailyBudget.toFixed(0)}</h2>
      </div>

      {/* Nuvole Low-Poly */}
      <div className="absolute top-10 left-0 w-full h-20 opacity-20 pointer-events-none">
        <motion.div 
          animate={{ x: [-20, 20, -20] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute left-1/4 top-2"
        >
          <svg width="80" height="30" viewBox="0 0 80 30">
            <path d="M10 15L25 5H55L70 15L60 25H20L10 15Z" fill="#F4EBD0" />
          </svg>
        </motion.div>
        <motion.div 
          animate={{ x: [20, -20, 20] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute right-1/4 top-8"
        >
          <svg width="100" height="40" viewBox="0 0 100 40">
            <path d="M15 20L35 5H75L90 20L80 35H25L15 20Z" fill="#F4EBD0" />
          </svg>
        </motion.div>
      </div>

      {/* Isola Low-Poly */}
      <div className="absolute right-[-20px] bottom-[60px] z-10">
        <svg width="180" height="100" viewBox="0 0 180 100">
          <path d="M20 80L80 20L160 80H20Z" fill="#2C1E14" />
          {/* Alberi (Triangoli) */}
          <path d="M70 30L80 15L90 30H70Z" fill="#1A2A1A" />
          <path d="M90 40L100 25L110 40H90Z" fill="#1A2A1A" />
          <path d="M50 50L60 35L70 50H50Z" fill="#1A2A1A" />
        </svg>
      </div>

      {/* Faro */}
      <div className="absolute left-10 bottom-[65px] z-10">
        <svg width="40" height="100" viewBox="0 0 40 100">
          <rect x="15" y="30" width="10" height="50" fill="#F4EBD0" />
          <rect x="15" y="45" width="10" height="8" fill="#8B2635" />
          <rect x="15" y="65" width="10" height="8" fill="#8B2635" />
          <rect x="12" y="25" width="16" height="5" fill="#2C3E50" />
          {/* Luce del faro */}
          <motion.circle 
            cx="20" cy="20" r="6" 
            fill="#F1C40F" 
            animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-[15px] left-[15px] w-[100px] h-[10px] bg-yellow-200/20 blur-md origin-left"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

      {/* Sole/Luna */}
      <div className="absolute top-24 right-16">
        <motion.div
          animate={{ y: [0, -5, 0], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="w-16 h-16 rounded-full bg-[#F4EBD0]/80 blur-sm shadow-[0_0_40px_rgba(244,235,208,0.4)]"
        />
      </div>

      {/* Barca */}
      <motion.div
        className="absolute left-1/3 bottom-[25px] -translate-x-1/2 z-20"
        animate={{
          y: [0, -config.waveHeight / 3, 0],
          rotate: state === 'happy' ? [-1, 1, -1] : [-3, 4, -3],
        }}
        transition={{ duration: state === 'happy' ? 4 : 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative">
          <svg width="100" height="70" viewBox="0 0 120 80" fill="none">
            <path d="M10 45L22 68H88L105 45H10Z" fill="#1A1A1A" />
            <path d="M10 45H105L100 52H15L10 45Z" fill="#8B2635" />
            <path d="M55 25H85V45H55V25Z" fill="#F4EBD0" />
            <rect x="60" y="28" width="12" height="10" fill="#1A2A2D" />
            <motion.rect 
              x="61" y="29" width="10" height="8" 
              fill="#F1C40F" 
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <path d="M90 45L110 20" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </motion.div>

      {/* Mare */}
      <div className="absolute bottom-0 left-0 right-0 h-[70px] z-30">
        <svg viewBox="0 0 400 70" preserveAspectRatio="none" className="w-full h-full">
          <motion.path
            animate={{
              d: [
                `M0 35 Q100 ${35 - config.waveHeight} 200 35 T400 35 V70 H0 Z`,
                `M0 35 Q100 ${35 + config.waveHeight} 200 35 T400 35 V70 H0 Z`,
                `M0 35 Q100 ${35 - config.waveHeight} 200 35 T400 35 V70 H0 Z`
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            fill={config.seaColor}
          />
        </svg>
      </div>

      {/* Bollicine/Particelle sulla destra */}
      <div className="absolute right-10 bottom-0 h-32 w-10 z-40 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white/10 rounded-full"
            style={{ left: `${Math.random() * 100}%`, bottom: '0px' }}
            animate={{ 
              y: [0, -100], 
              opacity: [0, 0.5, 0],
              x: [0, (Math.random() - 0.5) * 20]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2, 
              repeat: Infinity, 
              delay: i * 0.8 
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BoatScene;