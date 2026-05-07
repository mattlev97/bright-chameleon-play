import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MascotState } from './MascotBlob';
import { Cloud, Sun, CloudRain, Zap, Waves } from 'lucide-react';

interface BoatSceneProps {
  state: MascotState;
  size?: number;
}

const BoatScene = ({ state, size = 200 }: BoatSceneProps) => {
  // Mappatura stati -> Meteo
  const weatherConfig = {
    happy: {
      sky: "bg-sky-300 dark:bg-sky-900/40",
      icon: <Sun className="text-yellow-400 fill-yellow-400" size={32} />,
      seaColor: "#3B82F6",
      waveHeight: 5,
      rain: false,
      storm: false
    },
    neutral: {
      sky: "bg-slate-200 dark:bg-slate-800/40",
      icon: <Cloud className="text-slate-400 fill-slate-400" size={32} />,
      seaColor: "#2563EB",
      waveHeight: 10,
      rain: false,
      storm: false
    },
    sad: {
      sky: "bg-slate-400 dark:bg-slate-900/60",
      icon: <CloudRain className="text-slate-500" size={32} />,
      seaColor: "#1E40AF",
      waveHeight: 15,
      rain: true,
      storm: false
    },
    concerned: {
      sky: "bg-slate-600 dark:bg-slate-950/80",
      icon: <Zap className="text-yellow-500" size={32} />,
      seaColor: "#1E3A8A",
      waveHeight: 25,
      rain: true,
      storm: true
    },
    shocked: {
      sky: "bg-slate-800 dark:bg-black/90",
      icon: <Zap className="text-yellow-600 animate-pulse" size={32} />,
      seaColor: "#172554",
      waveHeight: 40,
      rain: true,
      storm: true
    }
  };

  const config = weatherConfig[state];

  return (
    <div 
      className={`relative overflow-hidden rounded-[32px] transition-colors duration-1000 ${config.sky}`}
      style={{ width: '100%', height: size }}
    >
      {/* Cielo e Meteo */}
      <div className="absolute top-4 right-8">
        <motion.div
          animate={{ 
            y: [0, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {config.icon}
        </motion.div>
      </div>

      {/* Pioggia */}
      {config.rain && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-4 bg-blue-200/40 rounded-full"
              style={{ 
                left: `${Math.random() * 100}%`,
                top: `-20px`
              }}
              animate={{ 
                y: [0, size + 40],
                x: [0, -20]
              }}
              transition={{ 
                duration: 0.5 + Math.random() * 0.5, 
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      )}

      {/* Barca */}
      <motion.div
        className="absolute left-1/2 bottom-[40px] -translate-x-1/2 z-20"
        animate={{
          y: [0, -config.waveHeight / 2, 0],
          rotate: state === 'happy' ? [0, 1, -1, 0] : [-2, 5, -5, 2],
        }}
        transition={{
          duration: state === 'happy' ? 3 : 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg width="80" height="60" viewBox="0 0 80 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Scafo */}
          <path d="M10 35C10 35 15 55 40 55C65 55 70 35 70 35H10Z" fill="#78350F" />
          <path d="M10 35H70L65 40H15L10 35Z" fill="#92400E" />
          {/* Vela */}
          <path d="M40 5L40 35L15 35C15 35 15 5 40 5Z" fill="white" className="opacity-90" />
          <rect x="38" y="5" width="4" height="30" fill="#451A03" />
        </svg>
      </motion.div>

      {/* Mare (Onde) */}
      <div className="absolute bottom-0 left-0 right-0 h-[60px] z-30">
        <svg viewBox="0 0 400 60" preserveAspectRatio="none" className="w-full h-full">
          <motion.path
            animate={{
              d: [
                `M0 30 Q100 ${30 - config.waveHeight} 200 30 T400 30 V60 H0 Z`,
                `M0 30 Q100 ${30 + config.waveHeight} 200 30 T400 30 V60 H0 Z`,
                `M0 30 Q100 ${30 - config.waveHeight} 200 30 T400 30 V60 H0 Z`
              ]
            }}
            transition={{ duration: state === 'happy' ? 4 : 2, repeat: Infinity, ease: "easeInOut" }}
            fill={config.seaColor}
            className="opacity-80"
          />
          <motion.path
            animate={{
              d: [
                `M0 40 Q100 ${40 + config.waveHeight} 200 40 T400 40 V60 H0 Z`,
                `M0 40 Q100 ${40 - config.waveHeight} 200 40 T400 40 V60 H0 Z`,
                `M0 40 Q100 ${40 + config.waveHeight} 200 40 T400 40 V60 H0 Z`
              ]
            }}
            transition={{ duration: state === 'happy' ? 5 : 2.5, repeat: Infinity, ease: "easeInOut" }}
            fill={config.seaColor}
            className="opacity-60"
          />
        </svg>
      </div>

      {/* Reazione Onda d'urto (se lo stato è shocked o concerned) */}
      <AnimatePresence>
        {(state === 'shocked' || state === 'concerned') && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 400, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            className="absolute bottom-4 left-0 z-40 pointer-events-none"
          >
            <Waves size={48} className="text-white/40" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BoatScene;