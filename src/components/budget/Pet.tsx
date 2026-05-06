import React from 'react';
import { motion } from 'framer-motion';
import { PetType } from '../../types/budget';

interface PetProps {
  type: PetType;
  mood: 'happy' | 'neutral' | 'sad';
}

const Rhino = ({ mood }: { mood: string }) => (
  <svg viewBox="0 0 120 80" className="w-full h-full drop-shadow-lg">
    <defs>
      <linearGradient id="rhinoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#9BA481" />
        <stop offset="100%" stopColor="#6B7353" />
      </linearGradient>
    </defs>
    <rect x="30" y="55" width="10" height="15" rx="3" fill="#555D42" />
    <rect x="45" y="58" width="10" height="15" rx="3" fill="#555D42" />
    <motion.path d="M25 45 Q15 40 18 55" stroke="#555D42" strokeWidth="3" fill="none" strokeLinecap="round" animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 1, repeat: Infinity }} />
    <path d="M25 50 C25 30, 45 25, 75 30 L85 35 L85 60 C85 65, 25 65, 25 50" fill="url(#rhinoGrad)" />
    <rect x="65" y="58" width="10" height="15" rx="3" fill="#555D42" />
    <rect x="78" y="55" width="10" height="15" rx="3" fill="#555D42" />
    <path d="M80 35 L105 38 C110 40, 110 55, 105 58 L80 55 Z" fill="#8E9775" />
    <motion.path d="M82 35 L78 28 L86 32 Z" fill="#6B7353" animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }} />
    <path d="M102 38 L112 22 L106 42 Z" fill="#E2C2B9" />
    <path d="M94 38 L98 30 L96 40 Z" fill="#D1B1A8" />
    <circle cx="92" cy="45" r="1.5" fill="black" />
    {mood === 'happy' && <path d="M95 52 Q98 54 101 52" stroke="black" strokeWidth="1" fill="none" />}
  </svg>
);

const Elephant = ({ mood }: { mood: string }) => (
  <svg viewBox="0 0 120 80" className="w-full h-full drop-shadow-lg">
    <defs>
      <linearGradient id="eleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#A5A5A5" />
        <stop offset="100%" stopColor="#7A7A7A" />
      </linearGradient>
    </defs>
    <rect x="30" y="55" width="12" height="15" rx="4" fill="#5A5A5A" />
    <rect x="70" y="55" width="12" height="15" rx="4" fill="#5A5A5A" />
    <path d="M20 50 C20 25, 90 25, 90 50 L90 60 C90 65, 20 65, 20 50" fill="url(#eleGrad)" />
    <motion.path d="M85 40 C105 40, 110 70, 100 75" stroke="#7A7A7A" strokeWidth="8" fill="none" strokeLinecap="round" animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 2, repeat: Infinity }} />
    <motion.path d="M75 30 C60 25, 55 50, 75 55 Z" fill="#6A6A6A" animate={{ rotate: [-10, 10, -10] }} transition={{ duration: 3, repeat: Infinity }} />
    <circle cx="82" cy="42" r="2" fill="black" />
    {mood === 'happy' && <path d="M85 48 Q88 50 91 48" stroke="black" strokeWidth="1" fill="none" />}
  </svg>
);

const Pet = ({ type, mood }: PetProps) => {
  const walkDuration = mood === 'happy' ? 12 : 20;

  return (
    <motion.div 
      className="relative w-28 h-20 cursor-pointer"
      animate={{ x: [0, 180, 0], scaleX: [1, 1, -1, -1, 1] }}
      transition={{ duration: walkDuration, repeat: Infinity, ease: "linear" }}
    >
      <motion.div animate={{ y: mood === 'happy' ? [0, -4, 0] : [0, -1, 0] }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}>
        {type === 'rhino' ? <Rhino mood={mood} /> : <Elephant mood={mood} />}
        {mood === 'sad' && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-10 right-0 bg-white dark:bg-slate-800 px-3 py-1 rounded-full text-[10px] font-bold shadow-md border border-red-100">
            Ho fame... 🌱
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Pet;