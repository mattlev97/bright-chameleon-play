import React from 'react';
import { motion } from 'framer-motion';
import { MascotState } from './MascotBlob';
import { Cloud, Sun, CloudRain, Zap } from 'lucide-react';

interface BoatSceneProps {
  state: MascotState;
  size?: number;
}

const BoatScene = ({ state, size = 200 }: BoatSceneProps) => {
  const weatherConfig = {
    happy: {
      sky: "bg-gradient-to-b from-[#E67E22] to-[#F39C12]",
      icon: <Sun className="text-yellow-200 fill-yellow-200" size={32} />,
      seaColor: "#2D5A63",
      waveHeight: 4,
      rain: false,
      foamColor: "rgba(255,255,255,0.4)"
    },
    neutral: {
      sky: "bg-gradient-to-b from-[#34495E] to-[#2C3E50]",
      icon: <Cloud className="text-slate-400 fill-slate-400" size={32} />,
      seaColor: "#1A3A3A",
      waveHeight: 8,
      rain: false,
      foamColor: "rgba(255,255,255,0.2)"
    },
    sad: {
      sky: "bg-gradient-to-b from-[#2C3E50] to-[#1A252F]",
      icon: <CloudRain className="text-slate-500" size={32} />,
      seaColor: "#0F2A2A",
      waveHeight: 12,
      rain: true,
      foamColor: "rgba(255,255,255,0.1)"
    },
    concerned: {
      sky: "bg-gradient-to-b from-[#1A252F] to-[#000000]",
      icon: <Zap className="text-yellow-500" size={32} />,
      seaColor: "#0A1F1F",
      waveHeight: 20,
      rain: true,
      foamColor: "rgba(255,255,255,0.05)"
    },
    shocked: {
      sky: "bg-black",
      icon: <Zap className="text-red-500 animate-pulse" size={32} />,
      seaColor: "#051515",
      waveHeight: 35,
      rain: true,
      foamColor: "rgba(255,255,255,0.02)"
    }
  };

  const config = weatherConfig[state];

  return (
    <div 
      className={`relative overflow-hidden rounded-[24px] transition-all duration-1000 ${config.sky} border-2 border-[#3E7B85]/20 shadow-inner`}
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

      {/* Barca */}
      <motion.div
        className="absolute left-1/2 bottom-[45px] -translate-x-1/2 z-20"
        animate={{
          y: [0, -config.waveHeight / 2, 0],
          rotate: state === 'happy' ? [-1, 1, -1] : [-3, 4, -3],
        }}
        transition={{ duration: state === 'happy' ? 4 : 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative">
          {/* Sistema di Fumo dal comignolo */}
          <div className="absolute top-0 left-[42px]">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-slate-400/40 rounded-full blur-sm"
                animate={{ 
                  y: [0, -40], 
                  x: [0, 20], 
                  opacity: [0, 0.6, 0], 
                  scale: [0.5, 2] 
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  delay: i * 0.6,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
            {/* Scafo Low-Poly (Sfaccettato) */}
            <path d="M10 45L22 68H88L105 45H10Z" fill="#5D1924" /> {/* Ombra scafo */}
            <path d="M10 45H105L100 52H15L10 45Z" fill="#8B2635" /> {/* Bordo superiore */}
            
            {/* Parabordi (Ruote nere sul fianco) */}
            <rect x="32" y="50" width="6" height="10" rx="3" fill="#1A2A2D" />
            <rect x="52" y="50" width="6" height="10" rx="3" fill="#1A2A2D" />
            <rect x="72" y="50" width="6" height="10" rx="3" fill="#1A2A2D" />

            {/* Cabina (Crema con illuminazione interna) */}
            <path d="M55 25H85V45H55V25Z" fill="#F4EBD0" />
            <rect x="55" y="22" width="32" height="4" fill="#4A3728" /> {/* Tetto */}
            
            {/* Finestra con Luce Gialla Pulsante */}
            <rect x="60" y="28" width="12" height="10" fill="#1A2A2D" />
            <motion.rect 
              x="61" y="29" width="10" height="8" 
              fill="#F1C40F" 
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Gruetta di Poppa (Struttura metallica) */}
            <path d="M90 45L110 20" stroke="#2C3E50" strokeWidth="3" strokeLinecap="round" />
            <path d="M110 20L110 35" stroke="#2C3E50" strokeWidth="1.5" />
            <rect x="107" y="35" width="6" height="4" fill="#1A2A2D" />

            {/* Casse di Carico sul ponte anteriore */}
            <rect x="25" y="35" width="14" height="10" fill="#78350F" />
            <rect x="30" y="30" width="10" height="8" fill="#92400E" />
            <path d="M25 35H39V37H25V35Z" fill="#451A03" opacity="0.3" />

            {/* Albero anteriore */}
            <rect x="45" y="10" width="2" height="35" fill="#4A3728" />
            <path d="M45 15L32 32H45V15Z" fill="#F4EBD0" opacity="0.4" />
          </svg>

          {/* Scia Dinamica (Foam) */}
          <motion.div 
            className="absolute -bottom-3 left-0 right-0 h-6 z-10"
            animate={{ 
              opacity: [0.2, 0.6, 0.2], 
              scaleX: [0.8, 1.2, 0.8],
              x: [-5, 5, -5]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div 
              className="w-full h-full rounded-full" 
              style={{ 
                backgroundColor: config.foamColor, 
                filter: 'blur(6px)' 
              }} 
            />
          </motion.div>
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