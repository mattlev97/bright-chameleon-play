import React from 'react';
import { motion } from 'framer-motion';

interface PetProps {
  mood: 'happy' | 'neutral' | 'sad';
}

const Pet = ({ mood }: PetProps) => {
  // Animazione di camminata (avanti e indietro)
  const walkVariants = {
    animate: {
      x: [0, 150, 0],
      scaleX: [1, 1, -1, -1, 1], // Gira il rinoceronte quando cambia direzione
      transition: {
        duration: mood === 'happy' ? 8 : 15,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  // Animazione di "respiro" o saltello
  const bounceVariants = {
    animate: {
      y: mood === 'happy' ? [0, -5, 0] : [0, -2, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="relative w-20 h-16 cursor-pointer"
      variants={walkVariants}
      animate="animate"
    >
      <motion.div variants={bounceVariants} animate="animate">
        {/* SVG Rinoceronte Indie Style */}
        <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-md">
          {/* Corpo */}
          <rect x="20" y="30" width="50" height="35" rx="10" fill="#8E9775" />
          {/* Testa */}
          <rect x="60" y="25" width="25" height="25" rx="8" fill="#8E9775" />
          {/* Corno */}
          <path d="M85 25 L95 15 L85 35 Z" fill="#E2C2B9" />
          {/* Occhio */}
          <circle cx="75" cy="35" r="2" fill={mood === 'sad' ? '#444' : 'black'} />
          {/* Gambe */}
          <rect x="25" y="60" width="8" height="12" rx="2" fill="#6B7353" />
          <rect x="55" y="60" width="8" height="12" rx="2" fill="#6B7353" />
          {/* Coda */}
          <path d="M20 45 Q10 45 15 55" stroke="#6B7353" strokeWidth="3" fill="none" />
          
          {/* Espressione */}
          {mood === 'happy' && (
            <path d="M72 42 Q75 45 78 42" stroke="black" strokeWidth="1.5" fill="none" />
          )}
        </svg>
        
        {/* Fumetto se triste */}
        {mood === 'sad' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-lg text-[8px] font-bold shadow-sm border border-slate-100"
          >
            Ho fame... 💸
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Pet;