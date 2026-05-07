import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MascotState } from './MascotBlob';
import { Cloud, Sun, CloudRain, Zap, Waves, Anchor } from 'lucide-react';

interface BoatSceneProps {
  state: MascotState;
  size?: number;
}

const BoatScene = ({ state, size = 200 }: BoatSceneProps) => {
  const weatherConfig = {
    happy: {
      sky: "bg-gradient-to-b from-[#E67E22] to-[#F39C12]", // Tramonto caldo
      icon: <Sun className="text-yellow-200 fill-yellow-200" size={32} />,
      seaColor: "#2D5A63",
      waveHeight: 4,
      rain: false,
    },
    neutral: {
      sky: "bg-gradient-to-b from-[#34495E] to-[#2C3E50]", // Crepuscolo
      icon: <Cloud className="text-slate-400 fill-slate-400" size={32} />,
      seaColor: "#1A3A3A",
      waveHeight: 8,
      rain: false,
    },
    sad: {
      sky: "bg-gradient-to-b from-[#2C3E50] to-[#1A252F]", // Notte piovosa
      icon: <CloudRain className="text-slate-500" size={32} />,
      seaColor: "#0F2A2A",
      waveHeight: 12,
      rain: true,
    },
    concerned: {
      sky: "bg-gradient-to-b from-[#1A252F] to-[#000000]", // Tempesta
      icon: <Zap className="text-yellow-500" size={32} />,
      seaColor: "#0A1F1F",
      waveHeight: 20,
      rain: true,
    },
    shocked: {
      sky: "bg-black", // Tempesta violenta
      icon: <Zap className="text-red-500 animate-pulse" size={32} />,
      seaColor: "#051515",
      waveHeight: 35,
      rain: true,
    }
  };

  const config = weatherConfig[state];

  return (
    <div 
      className={`relative overflow-hidden rounded-[24px] transition-all duration-1000 ${config.sky} border-2 border-[#3E7B85]/20`}
      style={{ width: '100%', height: size }}
    >
      {/* Sole/Luna */}
      <div className="absolute top-6 right-10">
        <motion.div
          animate={{ y: [0, -3, 0], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          {config.icon}
        </motion.div>
      </div>

      {/* Pioggia */}
      {config.rain && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-[1px] h-6 bg-white/20"
              style={{ left: `${Math.random() * 100}%`, top: `-20px` }}
              animate={{ y: [0, size + 40], x: [0, -15] }}
              transition={{ duration: 0.4, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
      )}

      {/* Barca (Peschereccio ispirato all'immagine) */}
      <motion.div
        className="absolute left-1/2 bottom-[45px] -translate-x-1/2 z-20"
        animate={{
          y: [0, -config.waveHeight / 2, 0],
          rotate: state === 'happy' ? [-1, 1, -1] : [-3, 4, -3],
        }}
        transition={{ duration: state === 'happy' ? 4 : 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="100" height="70" viewBox="0 0 100 70" fill="none">
          {/* Scafo Rosso Scuro */}
          <path d="M15 40C15 40 20 60 50 60C80 60 85 40 85 40H15Z" fill="#8B2635" />
          <path d="M15 40H85L80 45H20L15 40Z" fill="#6B1D29" />
          
          {/* Cabina Crema */}
          <rect x="45" y="20" width="25" height="20" fill="#F4EBD0" />
          <rect x="48" y="23" width="8" height="8" fill="#1A2A2D" /> {/* Finestra */}
          <rect x="45" y="18" width="27" height="4" fill="#4A3728" /> {/* Tetto */}
          
          {/* Albero e Dettagli */}
          <rect x="35" y="10" width="3" height="30" fill="#4A3728" />
          <path d="M35 15L20 35H35V15Z" fill="#F4EBD0" opacity="0.6" />
          
          {/* Luci di navigazione */}
          <circle cx="70" cy="25" r="1.5" fill={state === 'happy' ? "#2ECC71" : "#E74C3C"} className="animate-pulse" />
        </svg>
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
            className="opacity-90"
          />
          <motion.path
            animate={{
              d: [
                `M0 45 Q100 ${45 + config.waveHeight} 200 45 T400 45 V70 H0 Z`,
                `M0 45 Q100 ${45 - config.waveHeight} 200 45 T400 45 V70 H0 Z`,
                `M0 45 Q100 ${45 + config.waveHeight} 200 45 T400 45 V70 H0 Z`
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            fill={config.seaColor}
            className="opacity-50"
          />
        </svg>
      </div>
    </div>
  );
};

export default BoatScene;