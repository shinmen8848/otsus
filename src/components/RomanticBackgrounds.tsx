import React from 'react';
import { motion } from 'framer-motion';

interface RomanticBackgroundProps {
  variant?: 'hearts' | 'flowers' | 'sparkles' | 'geometric' | 'watercolor';
  intensity?: 'subtle' | 'medium' | 'vibrant';
  animated?: boolean;
  className?: string;
}

export const RomanticBackground: React.FC<RomanticBackgroundProps> = ({
  variant = 'hearts',
  intensity = 'medium',
  animated = true,
  className = ''
}) => {
  const getOpacity = () => {
    switch (intensity) {
      case 'subtle': return 'opacity-20';
      case 'vibrant': return 'opacity-60';
      default: return 'opacity-40';
    }
  };

  const renderHeartPattern = () => (
    <div className={`absolute inset-0 ${getOpacity()} ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="hearts" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <motion.path
              d="M10 15l-1.45-1.32C5.4 10.36 3 8.28 3 5.5 3 3.42 4.42 2 6.5 2c1.04 0 2.04.48 2.5 1.09C9.46 2.48 10.46 2 11.5 2 13.58 2 15 3.42 15 5.5c0 2.78-2.4 4.86-5.55 7.18L10 15z"
              fill="hsl(340 85% 68%)"
              animate={animated ? { scale: [1, 1.1, 1] } : {}}
              transition={animated ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hearts)" />
      </svg>
    </div>
  );

  const renderFlowerPattern = () => (
    <div className={`absolute inset-0 ${getOpacity()} ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="flowers" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse">
            <motion.g
              animate={animated ? { rotate: 360 } : {}}
              transition={animated ? { duration: 20, repeat: Infinity, ease: 'linear' } : {}}
            >
              <circle cx="12.5" cy="12.5" r="3" fill="hsl(345 80% 72%)" opacity="0.6" />
              <circle cx="12.5" cy="8" r="2" fill="hsl(350 85% 75%)" opacity="0.7" />
              <circle cx="12.5" cy="17" r="2" fill="hsl(350 85% 75%)" opacity="0.7" />
              <circle cx="8" cy="12.5" r="2" fill="hsl(350 85% 75%)" opacity="0.7" />
              <circle cx="17" cy="12.5" r="2" fill="hsl(350 85% 75%)" opacity="0.7" />
              <circle cx="12.5" cy="12.5" r="1" fill="hsl(45 95% 75%)" />
            </motion.g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#flowers)" />
      </svg>
    </div>
  );

  const renderSparklePattern = () => (
    <div className={`absolute inset-0 ${getOpacity()} ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="sparkles" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse">
            <motion.path
              d="M7.5 0L8.5 6.5L15 7.5L8.5 8.5L7.5 15L6.5 8.5L0 7.5L6.5 6.5L7.5 0Z"
              fill="hsl(45 95% 75%)"
              animate={animated ? { 
                rotate: [0, 180, 360],
                scale: [0.8, 1.2, 0.8],
                opacity: [0.5, 1, 0.5]
              } : {}}
              transition={animated ? { 
                duration: 4, 
                repeat: Infinity, 
                ease: 'easeInOut' 
              } : {}}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sparkles)" />
      </svg>
    </div>
  );

  const renderGeometricPattern = () => (
    <div className={`absolute inset-0 ${getOpacity()} ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="geometric" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <motion.g
              animate={animated ? { rotate: [0, 360] } : {}}
              transition={animated ? { duration: 15, repeat: Infinity, ease: 'linear' } : {}}
            >
              <circle cx="15" cy="15" r="8" fill="none" stroke="hsl(340 85% 68%)" strokeWidth="0.5" opacity="0.6" />
              <circle cx="15" cy="15" r="4" fill="hsl(285 55% 78%)" opacity="0.4" />
              <path d="M15 7L19 15L15 23L11 15Z" fill="hsl(25 80% 78%)" opacity="0.5" />
            </motion.g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geometric)" />
      </svg>
    </div>
  );

  const renderWatercolorPattern = () => (
    <div className={`absolute inset-0 ${getOpacity()} ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="watercolor1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(340 85% 68%)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(340 85% 68%)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="watercolor2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(285 55% 78%)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="hsl(285 55% 78%)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="watercolor3" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(25 80% 78%)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(25 80% 78%)" stopOpacity="0" />
          </radialGradient>
        </defs>
        
        <motion.circle
          cx="20" cy="30" r="15"
          fill="url(#watercolor1)"
          animate={animated ? { scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] } : {}}
          transition={animated ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : {}}
        />
        <motion.circle
          cx="70" cy="20" r="12"
          fill="url(#watercolor2)"
          animate={animated ? { scale: [1, 1.15, 1], opacity: [0.25, 0.5, 0.25] } : {}}
          transition={animated ? { duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 } : {}}
        />
        <motion.circle
          cx="50" cy="70" r="18"
          fill="url(#watercolor3)"
          animate={animated ? { scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] } : {}}
          transition={animated ? { duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 4 } : {}}
        />
        <motion.circle
          cx="80" cy="80" r="10"
          fill="url(#watercolor1)"
          animate={animated ? { scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] } : {}}
          transition={animated ? { duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 } : {}}
        />
      </svg>
    </div>
  );

  const renderPattern = () => {
    switch (variant) {
      case 'flowers': return renderFlowerPattern();
      case 'sparkles': return renderSparklePattern();
      case 'geometric': return renderGeometricPattern();
      case 'watercolor': return renderWatercolorPattern();
      default: return renderHeartPattern();
    }
  };

  return renderPattern();
};

// Preset background components
export const SubtleHeartsBackground: React.FC<{ className?: string }> = ({ className }) => (
  <RomanticBackground variant="hearts" intensity="subtle" className={className} />
);

export const VibrantFlowersBackground: React.FC<{ className?: string }> = ({ className }) => (
  <RomanticBackground variant="flowers" intensity="vibrant" className={className} />
);

export const SparklingBackground: React.FC<{ className?: string }> = ({ className }) => (
  <RomanticBackground variant="sparkles" intensity="medium" className={className} />
);

export const WatercolorDreamBackground: React.FC<{ className?: string }> = ({ className }) => (
  <RomanticBackground variant="watercolor" intensity="medium" className={className} />
);

// Layered romantic background
export const LayeredRomanticBackground: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute inset-0 ${className}`}>
    <RomanticBackground variant="watercolor" intensity="subtle" />
    <RomanticBackground variant="hearts" intensity="subtle" />
    <RomanticBackground variant="sparkles" intensity="subtle" />
  </div>
);

// Animated gradient background
export const AnimatedGradientBackground: React.FC<{ className?: string }> = ({ className = '' }) => (
  <motion.div
    className={`absolute inset-0 ${className}`}
    style={{
      background: 'linear-gradient(45deg, hsl(340 85% 68%), hsl(285 55% 78%), hsl(25 80% 78%), hsl(340 85% 68%))',
      backgroundSize: '400% 400%'
    }}
    animate={{
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: 'easeInOut'
    }}
  />
);
