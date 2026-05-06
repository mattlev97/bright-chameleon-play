import React from 'react';
import { motion } from 'framer-motion';
import { PetType } from '../../types/budget';

interface PetProps {
  type: PetType;
  mood: 'happy' | 'neutral' | 'sad';
}

const Rhino = ({ mood }: { mood: string }) => (
  <svg viewBox="0 0 160 100" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="rhinoSkin" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#8E9196" />
        <stop offset="50%" stopColor="#71767C" />
        <stop offset="100%" stopColor="#5A5F66" />
      </linearGradient>
      <filter id="skinTexture" x="0" y="0">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
      </filter>
    </defs>

    {/* Gambe Posteriori (più scure per profondità) */}
    <rect x="35" y="65" width="18" height="25" rx="4" fill="#4A4E54" />
    <rect x="55" y="68" width="18" height="25" rx="4" fill="#4A4E54" />

    {/* Coda con ciuffo */}
    <motion.g
      animate={{ rotate: [-5, 15, -5] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      style={{ originX: "30px", originY: "50px" }}
    >
      <path d="M30 55 Q15 50 18 70" stroke="#5A5F66" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="18" cy="72" r="3" fill="#3A3E44" />
    </motion.g>

    {/* Corpo Massiccio */}
    <path 
      d="M30 60 C30 35, 50 25, 90 32 L110 40 L110 75 C110 82, 30 82, 30 60" 
      fill="url(#rhinoSkin)" 
    />
    
    {/* Pieghe della pelle sul corpo */}
    <path d="M45 35 Q50 50 48 75" stroke="#4A4E54" strokeWidth="1.5" fill="none" opacity="0.4" />
    <path d="M65 32 Q70 50 68 78" stroke="#4A4E54" strokeWidth="1.5" fill="none" opacity="0.4" />
    <path d="M85 34 Q90 55 88 78" stroke="#4A4E54" strokeWidth="1.5" fill="none" opacity="0.4" />

    {/* Gambe Anteriori */}
    <rect x="85" y="68" width="18" height="25" rx="4" fill="#5A5F66" />
    <rect x="105" y="65" width="18" height="25" rx="4" fill="#5A5F66" />

    {/* Testa Allungata */}
    <path 
      d="M105 40 L140 45 C145 48, 145 65, 140 70 L105 65 Z" 
      fill="#71767C" 
    />

    {/* Orecchie mobili */}
    <motion.path 
      d="M108 40 L102 30 L114 35 Z" 
      fill="#5A5F66"
      animate={{ rotate: [-8, 8, -8] }}
      transition={{ duration: 2.5, repeat: Infinity }}
    />

    {/* Corni (color avorio/corno naturale) */}
    <path d="M135 46 L152 25 L142 52 Z" fill="#E5E1D8" /> {/* Corno Principale */}
    <path d="M125 45 L132 35 L130 48 Z" fill="#D6D1C5" /> {/* Corno Secondario */}

    {/* Occhio piccolo e realistico */}
    <circle cx="122" cy="52" r="2" fill="#1A1A1A" />
    <circle cx="122.5" cy="51.5" r="0.5" fill="white" opacity="0.6" />
    
    {/* Narice */}
    <ellipse cx="142" cy="60" rx="2" ry="3" fill="#3A3E44" opacity="0.6" />

    {/* Espressione basata sul mood */}
    {mood === 'happy' && (
      <path d="M128 62 Q135 65 142 62" stroke="#1A1A1A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    )}
    {mood === 'sad' && (
      <path d="M128 65 Q135 62 142 65" stroke="#1A1A1A" strokeWidth="1" fill="none" opacity="0.5" />
    )}
  </svg>
);

const Elephant = ({ mood }: { mood: string }) => (
  <svg viewBox="0 0 160 100" className="w-full h-full drop-shadow-2xl">
    <defs>
      <linearGradient id="eleSkin" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#A5AAB0" />
        <stop offset="100%" stopColor="#7A7F85" />
      </linearGradient>
    </defs>
    <rect x="40" y="65" width="20" height="25" rx="5" fill="#5A5F66" />
    <rect x="90" y="65" width="20" height="25" rx="5" fill="#5A5F66" />
    <path d="M30 60 C30 30, 120 30, 120 60 L120 75 C120 82, 30 82, 30 60" fill="url(#eleSkin)" />
    <motion.path 
      d="M115 50 C145 50, 155 85, 135 95" 
      stroke="#7A7F85" strokeWidth="10" fill="none" strokeLinecap="round"
      animate={{ rotate: [-5, 5, -5] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.path 
      d="M100 40 C80 35, 75 65, 100 70 Z" 
      fill="#6A6F75"
      animate={{ rotate: [-10, 10, -10] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <circle cx="110" cy="55" r="2.5" fill="black" />
  </svg>
);

const Pet = ({ type, mood }: PetProps) => {
  const walkDuration = mood === 'happy' ? 15 : 25;

  return (
    <motion.div 
      className="relative w-40 h-28 cursor-pointer"
      animate={{ x: [-20, 160, -20], scaleX: [1, 1, -1, -1, 1] }}
      transition={{ duration: walkDuration, repeat: Infinity, ease: "linear" }}
    >
      <motion.div 
        animate={{ y: mood === 'happy' ? [0, -5, 0] : [0, -1, 0] }} 
        transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      >
        {type === 'rhino' ? <Rhino mood={mood} /> : <Elephant mood={mood} />}
        
        {mood === 'sad' && (
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} 
            className="absolute -top-12 right-0 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl text-[11px] font-bold shadow-xl border-2 border-red-100 text-red-500 whitespace-nowrap"
          >
            L'oasi sta seccando... 🌱
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Pet;