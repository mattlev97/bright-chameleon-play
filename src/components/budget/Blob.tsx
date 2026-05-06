import React from 'react';
import { motion } from 'framer-motion';
import { BlobType } from '../../types/budget';

interface BlobProps {
  type: BlobType;
  mood: 'happy' | 'neutral' | 'sad';
}

const Blob = ({ type, mood }: BlobProps) => {
  const getColors = () => {
    switch (type) {
      case 'sparky': return { main: '#6C63FF', light: '#A78BFA' };
      case 'gloomy': return { main: '#3B82F6', light: '#93C5FD' };
      case 'bubbly': return { main: '#EC4899', light: '#F9A8D4' };
    }
  };

  const colors = getColors();

  return (
    <motion.div 
      className="relative w-32 h-32 flex items-center justify-center"
      animate={{ 
        scale: mood === 'happy' ? [1, 1.05, 1] : 1,
        y: [0, -10, 0]
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id={`grad-${type}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.main} />
            <stop offset="100%" stopColor={colors.light} />
          </linearGradient>
        </defs>
        
        {/* Corpo Blob */}
        <motion.path
          d="M20,50 Q20,20 50,20 Q80,20 80,50 Q80,80 50,80 Q20,80 20,50"
          fill={`url(#grad-${type})`}
          animate={{
            d: [
              "M20,50 Q20,20 50,20 Q80,20 80,50 Q80,80 50,80 Q20,80 20,50",
              "M22,48 Q25,25 52,22 Q78,25 78,48 Q75,75 48,78 Q25,75 22,48",
              "M20,50 Q20,20 50,20 Q80,20 80,50 Q80,80 50,80 Q20,80 20,50"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Occhi */}
        <g className="eyes">
          {type === 'sparky' && (
            <>
              <circle cx="40" cy="45" r="5" fill="white" />
              <circle cx="60" cy="45" r="5" fill="white" />
              <circle cx="40" cy="45" r="2" fill="black" />
              <circle cx="60" cy="45" r="2" fill="black" />
            </>
          )}
          {type === 'gloomy' && (
            <>
              <rect x="35" y="42" width="10" height="3" rx="1.5" fill="white" />
              <rect x="55" y="42" width="10" height="3" rx="1.5" fill="white" />
            </>
          )}
          {type === 'bubbly' && (
            <>
              <path d="M35 45 Q40 40 45 45" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M55 45 Q60 40 65 45" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
            </>
          )}
        </g>

        {/* Bocca */}
        <g className="mouth">
          {mood === 'happy' ? (
            <path d="M40 60 Q50 70 60 60" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          ) : mood === 'sad' ? (
            <path d="M40 65 Q50 55 60 65" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
          ) : (
            <line x1="42" y1="62" x2="58" y2="62" stroke="white" strokeWidth="2" strokeLinecap="round" />
          )}
        </g>
      </svg>
    </motion.div>
  );
};

export default Blob;