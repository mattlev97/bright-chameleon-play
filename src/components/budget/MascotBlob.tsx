import React from 'react';
import { motion } from 'framer-motion';
import { MascotId } from '../../types/budget';

export type MascotState = 'happy' | 'neutral' | 'sad' | 'concerned' | 'shocked';

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
      scale: [1, 1.05, 1],
      y: [0, -10, 0],
      transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    },
    neutral: {
      rotate: [0, -2, 2, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    },
    sad: {
      scaleY: [1, 0.92, 1],
      opacity: [1, 0.8, 1],
      transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
    },
    concerned: {
      scaleY: 0.85,
      scaleX: 1.1,
      transition: { duration: 0.3, type: "spring" }
    },
    shocked: {
      scale: [1, 1.2, 0.9, 1],
      x: [-2, 2, -2, 2, 0],
      transition: { duration: 0.4 }
    }
  };

  const colors = {
    happy: "fill-[#A78BFA] dark:fill-[#8B5CF6]",
    neutral: "fill-[#C4B5FD] dark:fill-[#7C3AED]",
    sad: "fill-[#DDD6FE] dark:fill-[#6D28D9]",
    concerned: "fill-[#F59E0B] dark:fill-[#D97706]",
    shocked: "fill-[#EF4444] dark:fill-[#B91C1C]"
  };

  return (
    <motion.div 
      animate={animations[state]}
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center"
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
        <motion.path
          d={shapes[type]}
          className={`${colors[state]} transition-colors duration-500`}
        />
        
        {/* Occhi */}
        <g className="fill-[#1E1B3A] dark:fill-white opacity-80">
          {state === 'happy' ? (
            <>
              <path d="M35,45 Q40,40 45,45" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <path d="M55,45 Q60,40 65,45" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : state === 'shocked' ? (
            <>
              <circle cx="35" cy="45" r="6" fill="white" />
              <circle cx="65" cy="45" r="6" fill="white" />
              <circle cx="35" cy="45" r="2" fill="black" />
              <circle cx="65" cy="45" r="2" fill="black" />
            </>
          ) : state === 'concerned' ? (
            <>
              <path d="M32,42 L42,48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M68,42 L58,48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : state === 'sad' ? (
            <>
              <circle cx="40" cy="50" r="2.5" />
              <circle cx="60" cy="50" r="2.5" />
            </>
          ) : (
            <>
              <rect x="35" y="48" width="10" height="2.5" rx="1" />
              <rect x="55" y="48" width="10" height="2.5" rx="1" />
            </>
          )}
        </g>

        {/* Bocca */}
        <g className="stroke-[#1E1B3A] dark:stroke-white opacity-60">
          {state === 'happy' ? (
            <path d="M42,60 Q50,68 58,60" fill="none" strokeWidth="3" strokeLinecap="round" />
          ) : state === 'shocked' ? (
            <circle cx="50" cy="65" r="5" fill="none" strokeWidth="2.5" />
          ) : state === 'concerned' ? (
            <path d="M45,65 Q50,62 55,65" fill="none" strokeWidth="2.5" strokeLinecap="round" />
          ) : state === 'sad' ? (
            <path d="M45,68 Q50,64 55,68" fill="none" strokeWidth="2" strokeLinecap="round" />
          ) : (
            <line x1="45" y1="62" x2="55" y2="62" strokeWidth="2" strokeLinecap="round" />
          )}
        </g>
      </svg>
    </motion.div>
  );
};

export default MascotBlob;