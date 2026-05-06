import React from 'react';
import { motion } from 'framer-motion';
import { MascotId, MascotState } from '../../types/budget';

interface MascotBlobProps {
  state: MascotState;
  type: MascotId;
  size?: number;
}

const MascotBlob = ({ state, type, size = 100 }: MascotBlobProps) => {
  const shapes = {
    classic: "M50,10 C25,10 10,25 10,50 C10,75 25,90 50,90 C75,90 90,75 90,50 C90,25 75,10 50,10 Z",
    tall: "M50,5 C30,5 20,25 20,50 C20,75 30,95 50,95 C70,95 80,75 80,50 C80,25 70,5 50,5 Z",
    wide: "M50,20 C20,20 5,35 5,60 C5,85 20,95 50,95 C80,95 95,85 95,60 C95,35 80,20 50,20 Z"
  };

  const animations = {
    happy: {
      scale: [1, 1.08, 1],
      y: [0, -15, 0],
      transition: { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
    },
    neutral: {
      rotate: [0, -3, 3, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    },
    concerned: {
      scaleY: [1, 0.85, 1],
      scaleX: [1, 1.05, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    },
    shocked: {
      x: [0, -5, 5, -5, 5, 0],
      scale: [1, 1.2, 1],
      transition: { duration: 0.2, repeat: 5 }
    }
  };

  const colors = {
    happy: "fill-[#A78BFA] dark:fill-[#8B5CF6]",
    neutral: "fill-[#C4B5FD] dark:fill-[#7C3AED]",
    concerned: "fill-[#DDD6FE] dark:fill-[#6D28D9]",
    shocked: "fill-[#F87171] dark:fill-[#EF4444]"
  };

  return (
    <motion.div 
      animate={animations[state]}
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
        <motion.path
          d={shapes[type]}
          className={`${colors[state]} transition-colors duration-300`}
        />
        
        {/* Occhi */}
        <g className="fill-[#1E1B3A] dark:fill-white">
          {state === 'happy' ? (
            <>
              <path d="M30,45 Q40,35 50,45" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M55,45 Q65,35 75,45" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </>
          ) : state === 'shocked' ? (
            <>
              <circle cx="35" cy="45" r="6" />
              <circle cx="65" cy="45" r="6" />
            </>
          ) : state === 'concerned' ? (
            <>
              <path d="M30,48 L45,42" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M55,42 L70,48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <circle cx="37" cy="52" r="2" />
              <circle cx="63" cy="52" r="2" />
            </>
          ) : (
            <>
              <rect x="32" y="48" width="12" height="3" rx="1.5" />
              <rect x="56" y="48" width="12" height="3" rx="1.5" />
            </>
          )}
        </g>

        {/* Bocca */}
        <g className="stroke-[#1E1B3A] dark:stroke-white">
          {state === 'happy' ? (
            <path d="M35,65 Q50,80 65,65" fill="none" strokeWidth="4" strokeLinecap="round" />
          ) : state === 'shocked' ? (
            <circle cx="50" cy="70" r="8" fill="none" strokeWidth="3" />
          ) : state === 'concerned' ? (
            <path d="M40,70 Q50,65 60,70" fill="none" strokeWidth="3" strokeLinecap="round" />
          ) : (
            <line x1="42" y1="68" x2="58" y2="68" strokeWidth="3" strokeLinecap="round" />
          )}
        </g>
      </svg>
    </motion.div>
  );
};

export default MascotBlob;