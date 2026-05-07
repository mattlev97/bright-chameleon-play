import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, Sun, CloudRain, CloudLightning, Waves } from 'lucide-react';

export type MascotState = 'happy' | 'neutral' | 'sad' | 'concerned' | 'shocked';

interface BoatSceneProps {
  state: MascotState;
  size?: number;
}

const BoatScene = ({ state, size = 200 }: BoatSceneProps) => {
  const [showWave, setShowWave] = useState(false);

  // Effetto per scatenare l'onda quando lo stato cambia in uno "reattivo"
  useEffect(() => {
    if (state !== 'happy') {
      setShowWave(true);
      const timer = setTimeout(() => setShowWave(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  // Mappatura del meteo in base allo stato del budget
  const weatherConfig = {
    happy: {
      bg: "bg-sky-300 dark:bg-sky-900/40",
      icon: <Sun className="text-yellow-400 fill-yellow-400" size={32} />,
      seaColor: "#3B82F6",
      waveHeight: 5,
      rain: false,
      storm: false
    },
    neutral: {
      bg: "bg-slate-300 dark:bg-slate-800/60",
      icon: <Cloud className="text-slate-400 fill-slate-400" size={32} />,
      seaColor: "#60A5FA",
      waveHeight: 10,
      rain: false,
      storm: false
    },
    sad: {
      bg: "bg-slate-400 dark:bg-slate-900/80",
      icon: <CloudRain className="text-slate-500" size={32} />,
      seaColor: "#2563EB",
      waveHeight: 15,
      rain: true,
      storm: false
    },
    concerned: {
      bg: "bg-slate-500 dark:bg-slate-950",
      icon: <CloudRain className="text-slate-600" size={32} />,
      seaColor: "#1E40AF",
      waveHeight: 25,
      rain: true,
      storm: false
    },
    shocked: {
      bg: "bg-slate-700 dark:bg-black",
      icon: <CloudLightning className="text-yellow-500" size={32} />,
      seaColor: "#172554",
      waveHeight: 40,
      rain: true,
      storm: true
    }
  };

  const config = weatherConfig[state];

  return (
    <div 
      className={`relative overflow-hidden rounded-[32px] transition-colors duration-1000 ${config.bg}`}
      style={{ width: size * 1.5, height: size }}
    >
      {/* Cielo e Meteo */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          animate={{ 
            y: [0, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          {config.icon}
        </motion.div>
      </div>

      {/* Pioggia */}
      {config.rain && (
        <div className="absolute inset-0 z-20 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-4 bg-white/30 rounded-full"
              style={{ 
                left: `${Math.random() * 100}%`,
                top: `-20px`
              }}
              animate={{ 
                y: [0, size],
                x: [0, -20]
              }}
              transition={{ 
                duration: 0.5 + Math.random() * 0.5, 
                repeat: Infinity, 
                delay: Math.random() * 2,
                ease: "linear"
              }}
            />
          ))}
        </div>
      )}

      {/* Fulmini */}
      {config.storm && (
        <motion.div
          className="absolute inset-0 bg-white/20 z-30 pointer-events-none"
          animate={{ opacity: [0, 0.8, 0, 0.5, 0] }}
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
        />
      )}

      {/* Mare */}
      <svg 
        viewBox="0 0 200 100" 
        className="absolute bottom-0 w-full h-1/2 z-10"
        preserveAspectRatio="none"
      >
        <motion.path
          animate={{
            d: [
              `M0,50 Q50,${50 - config.waveHeight} 100,50 T200,50 L200,100 L0,100 Z`,
              `M0,50 Q50,${50 + config.waveHeight} 100,50 T200,50 L200,100 L0,100 Z`,
              `M0,50 Q50,${50 - config.waveHeight} 100,50 T200,50 L200,100 L0,100 Z`
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          fill={config.seaColor}
          className="transition-colors duration-1000"
        />
      </svg>

      {/* Barca */}
      <motion.div
        className="absolute bottom-[20%] left-1/2 -translate-x-1/2 z-20"
        animate={{ 
          y: [0, -config.waveHeight / 2, 0],
          rotate: [-2, 2, -2]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="60" height="40" viewBox="0 0 60 40">
          {/* Scafo */}
          <path d="M10,25 L50,25 L45,35 L15,35 Z" fill="#78350F" />
          {/* Vela */}
          <path d="M30,5 L30,25 L15,25 Z" fill="#F1F5F9" />
          <path d="M32,8 L32,25 L45,25 Z" fill="#E2E8F0" />
          {/* Albero */}
          <rect x="29" y="5" width="2" height="20" fill="#451A03" />
        </svg>
      </motion.div>

      {/* Onda di Reazione (Spesa) */}
      <AnimatePresence>
        {showWave && (
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: -200, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute bottom-0 right-0 z-40 pointer-events-none"
          >
            <svg width="100" height="80" viewBox="0 0 100 80">
              <path 
                d={state === 'shocked' 
                  ? "M100,80 Q70,0 40,40 Q20,60 0,80 Z" 
                  : state === 'concerned'
                  ? "M100,80 Q80,20 60,50 Q40,70 0,80 Z"
                  : "M100,80 Q90,50 80,60 Q70,70 0,80 Z"
                } 
                fill="rgba(255,255,255,0.6)" 
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BoatScene;