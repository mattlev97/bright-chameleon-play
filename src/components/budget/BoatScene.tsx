import React from 'react';
import { motion } from 'framer-motion';
import { MascotState } from './MascotBlob';

interface BoatSceneProps {
  state: MascotState;
  dailyBudget: number;
  size?: number;
}

const BoatScene = ({ state, dailyBudget, size = 300 }: BoatSceneProps) => {
  const weatherLabels: Record<MascotState, string> = {
    happy: "Bonaccia",
    neutral: "Vento Leggero",
    sad: "Mare Mosso",
    concerned: "Tempesta",
    shocked: "Uragano"
  };

  const weatherConfig = {
    happy: {
      sky: "bg-gradient-to-b from-[#2C1E14] via-[#4A2C1B] to-[#E67E22]",
      seaColor: "#1A4A54",
      waveHeight: 4,
      mistOpacity: 0.1,
      glowColor: "rgba(244, 235, 208, 0.3)"
    },
    neutral: {
      sky: "bg-gradient-to-b from-[#1A252F] via-[#2C3E50] to-[#34495E]",
      seaColor: "#16353A",
      waveHeight: 8,
      mistOpacity: 0.3,
      glowColor: "rgba(200, 200, 255, 0.1)"
    },
    sad: {
      sky: "bg-gradient-to-b from-[#0F172A] via-[#1E293B] to-[#334155]",
      seaColor: "#0F2A2A",
      waveHeight: 15,
      mistOpacity: 0.5,
      glowColor: "rgba(100, 100, 150, 0.1)"
    },
    concerned: {
      sky: "bg-gradient-to-b from-[#020617] via-[#0F172A] to-[#1E293B]",
      seaColor: "#0A1F1F",
      waveHeight: 25,
      mistOpacity: 0.7,
      glowColor: "rgba(255, 100, 0, 0.05)"
    },
    shocked: {
      sky: "bg-black",
      seaColor: "#051515",
      waveHeight: 40,
      mistOpacity: 0.9,
      glowColor: "rgba(255, 0, 0, 0.05)"
    }
  };

  const config = weatherConfig[state];

  return (
    <div 
      className={`relative overflow-hidden rounded-[32px] transition-all duration-1000 ${config.sky} shadow-2xl border-b-4 border-black/20`}
      style={{ width: '100%', height: size }}
    >
      {/* Overlay Testuali */}
      <div className="absolute top-8 left-8 z-50">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Meteo</p>
        <h2 className="text-2xl font-bold text-[#F4EBD0] tracking-tight drop-shadow-md">{weatherLabels[state]}</h2>
      </div>

      <div className="absolute top-8 right-8 z-50 text-right">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.3em]">Oggi Puoi</p>
        <h2 className="text-3xl font-bold text-[#F4EBD0] tracking-tighter drop-shadow-md">€ {dailyBudget.toFixed(0)}</h2>
      </div>

      {/* Luna/Sole con alone */}
      <div className="absolute top-20 right-20">
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.6, 0.8, 0.6] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="w-24 h-24 rounded-full bg-[#F4EBD0]/20 blur-2xl"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#F4EBD0]/80 blur-[2px]" />
        </div>
      </div>

      {/* Isola Lontana */}
      <div className="absolute right-[-40px] bottom-[80px] z-10 opacity-40">
        <svg width="240" height="120" viewBox="0 0 240 120">
          <path d="M0 120L60 40L120 80L180 20L240 120H0Z" fill="#1A1A1A" />
        </svg>
      </div>

      {/* Faro Dettagliato */}
      <div className="absolute left-12 bottom-[85px] z-10">
        <svg width="30" height="120" viewBox="0 0 30 120">
          <path d="M5 120L8 30H22L25 120H5Z" fill="#1A1A1A" />
          <rect x="8" y="40" width="14" height="6" fill="#8B2635" />
          <rect x="8" y="65" width="14" height="6" fill="#8B2635" />
          <rect x="8" y="90" width="14" height="6" fill="#8B2635" />
          <path d="M5 30H25V35H5V30Z" fill="#333" />
          <circle cx="15" cy="22" r="5" fill="#F1C40F" className="blur-[1px]" />
        </svg>
        {/* Fascio di luce */}
        <motion.div
          className="absolute top-[18px] left-[15px] w-[250px] h-[40px] bg-yellow-200/10 blur-xl origin-left"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 60%)' }}
        />
      </div>

      {/* Barca "Dredge Style" */}
      <motion.div
        className="absolute left-1/2 bottom-[35px] -translate-x-1/2 z-20"
        animate={{
          y: [0, -config.waveHeight / 4, 0],
          rotate: state === 'happy' ? [-1, 1, -1] : [-2, 3, -2],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative">
          <svg width="140" height="100" viewBox="0 0 140 100" fill="none">
            {/* Scafo */}
            <path d="M10 50C10 50 15 85 30 85H110C125 85 130 50 130 50H10Z" fill="#121212" />
            <path d="M10 50H130L125 58H15L10 50Z" fill="#451A03" /> {/* Linea di ruggine */}
            
            {/* Cabina */}
            <path d="M75 25H110V50H75V25Z" fill="#1A1A1A" />
            <path d="M75 25L110 20V25H75Z" fill="#2C2C2C" /> {/* Tetto */}
            
            {/* Finestre Cabina */}
            <rect x="80" y="30" width="10" height="12" fill="#1A2A2D" />
            <motion.rect 
              x="81" y="31" width="8" height="10" 
              fill="#F1C40F" 
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <rect x="95" y="30" width="10" height="12" fill="#1A2A2D" />
            
            {/* Albero e Sartiame */}
            <rect x="45" y="10" width="3" height="45" fill="#1A1A1A" />
            <path d="M45 15L20 50" stroke="#1A1A1A" strokeWidth="1" opacity="0.5" />
            <path d="M45 15L75 35" stroke="#1A1A1A" strokeWidth="1" opacity="0.5" />
            
            {/* Gru/Attrezzatura poppa */}
            <path d="M115 50L135 25" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" />
            <circle cx="135" cy="25" r="2" fill="#333" />
          </svg>
          
          {/* Luce di posizione */}
          <motion.div 
            className="absolute top-[22px] right-[25px] w-2 h-2 bg-red-500 rounded-full blur-[1px]"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>

      {/* Mare Multistrato */}
      <div className="absolute bottom-0 left-0 right-0 h-[100px] z-30">
        {/* Riflesso Luce */}
        <motion.div 
          className="absolute left-1/2 top-10 -translate-x-1/2 w-40 h-20 bg-yellow-200/5 blur-3xl"
          animate={{ opacity: [0.1, 0.2, 0.1], scaleX: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        
        <svg viewBox="0 0 400 100" preserveAspectRatio="none" className="w-full h-full">
          {/* Onda Posteriore */}
          <motion.path
            animate={{
              d: [
                `M0 50 Q100 ${50 - config.waveHeight} 200 50 T400 50 V100 H0 Z`,
                `M0 50 Q100 ${50 + config.waveHeight} 200 50 T400 50 V100 H0 Z`,
                `M0 50 Q100 ${50 - config.waveHeight} 200 50 T400 50 V100 H0 Z`
              ]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            fill={config.seaColor}
            opacity="0.6"
          />
          {/* Onda Principale */}
          <motion.path
            animate={{
              d: [
                `M0 60 Q100 ${60 + config.waveHeight} 200 60 T400 60 V100 H0 Z`,
                `M0 60 Q100 ${60 - config.waveHeight} 200 60 T400 60 V100 H0 Z`,
                `M0 60 Q100 ${60 + config.waveHeight} 200 60 T400 60 V100 H0 Z`
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            fill={config.seaColor}
          />
        </svg>
      </div>

      {/* Particelle Atmosferiche (Embers/Mist) */}
      <div className="absolute inset-0 pointer-events-none z-40">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#F4EBD0]/20 rounded-full"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%` 
            }}
            animate={{ 
              y: [0, -40], 
              x: [0, (Math.random() - 0.5) * 30],
              opacity: [0, 0.4, 0] 
            }}
            transition={{ 
              duration: 4 + Math.random() * 4, 
              repeat: Infinity, 
              delay: Math.random() * 5 
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default BoatScene;