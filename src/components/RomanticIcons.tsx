import React from 'react';
import { motion } from 'framer-motion';

interface RomanticIconProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  animate?: boolean;
  className?: string;
}

const getIconSize = (size: string) => {
  switch (size) {
    case 'sm': return 'w-4 h-4';
    case 'lg': return 'w-8 h-8';
    case 'xl': return 'w-12 h-12';
    default: return 'w-6 h-6';
  }
};

// Heart Icons
export const RomanticHeart: React.FC<RomanticIconProps> = ({ 
  size = 'md', 
  color = 'currentColor', 
  animate = false, 
  className = '' 
}) => (
  <motion.svg
    className={`${getIconSize(size)} ${className}`}
    fill={color}
    viewBox="0 0 24 24"
    animate={animate ? { scale: [1, 1.2, 1] } : {}}
    transition={animate ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </motion.svg>
);

export const FloatingHeart: React.FC<RomanticIconProps> = ({ 
  size = 'md', 
  color = 'hsl(340 85% 68%)', 
  className = '' 
}) => (
  <motion.svg
    className={`${getIconSize(size)} ${className}`}
    fill={color}
    viewBox="0 0 24 24"
    animate={{
      y: [0, -10, 0],
      rotate: [0, 5, -5, 0],
      scale: [1, 1.1, 1]
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    }}
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </motion.svg>
);

// Flower Icons
export const CherryBlossom: React.FC<RomanticIconProps> = ({ 
  size = 'md', 
  color = 'hsl(345 80% 72%)', 
  animate = false, 
  className = '' 
}) => (
  <motion.svg
    className={`${getIconSize(size)} ${className}`}
    fill={color}
    viewBox="0 0 24 24"
    animate={animate ? { rotate: 360 } : {}}
    transition={animate ? { duration: 20, repeat: Infinity, ease: 'linear' } : {}}
  >
    <path d="M12 2C12 2 8 6 8 10C8 12 10 14 12 14C14 14 16 12 16 10C16 6 12 2 12 2Z"/>
    <path d="M12 22C12 22 8 18 8 14C8 12 10 10 12 10C14 10 16 12 16 14C16 18 12 22 12 22Z"/>
    <path d="M2 12C2 12 6 8 10 8C12 8 14 10 14 12C14 14 12 16 10 16C6 16 2 12 2 12Z"/>
    <path d="M22 12C22 12 18 8 14 8C12 8 10 10 10 12C10 14 12 16 14 16C18 16 22 12 22 12Z"/>
    <circle cx="12" cy="12" r="2"/>
  </motion.svg>
);

export const RomanticRose: React.FC<RomanticIconProps> = ({ 
  size = 'md', 
  color = 'hsl(350 85% 75%)', 
  animate = false, 
  className = '' 
}) => (
  <motion.svg
    className={`${getIconSize(size)} ${className}`}
    fill={color}
    viewBox="0 0 24 24"
    animate={animate ? { scale: [1, 1.05, 1] } : {}}
    transition={animate ? { duration: 4, repeat: Infinity, ease: 'easeInOut' } : {}}
  >
    <path d="M12 2C8 2 5 5 5 9C5 13 8 16 12 16C16 16 19 13 19 9C19 5 16 2 12 2Z"/>
    <path d="M12 16L12 22"/>
    <path d="M8 18L12 16L16 18"/>
    <circle cx="12" cy="9" r="3" fillOpacity="0.7"/>
    <circle cx="12" cy="9" r="1.5" fillOpacity="0.9"/>
  </motion.svg>
);

// Sparkle and Magic Icons
export const RomanticSparkle: React.FC<RomanticIconProps> = ({ 
  size = 'md', 
  color = 'hsl(45 95% 75%)', 
  animate = true, 
  className = '' 
}) => (
  <motion.svg
    className={`${getIconSize(size)} ${className}`}
    fill={color}
    viewBox="0 0 24 24"
    animate={animate ? {
      rotate: [0, 180, 360],
      scale: [1, 1.2, 1],
      opacity: [0.7, 1, 0.7]
    } : {}}
    transition={animate ? {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut'
    } : {}}
  >
    <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"/>
    <circle cx="12" cy="12" r="2" fillOpacity="0.8"/>
  </motion.svg>
);

export const MagicWand: React.FC<RomanticIconProps> = ({ 
  size = 'md', 
  color = 'hsl(285 55% 78%)', 
  animate = false, 
  className = '' 
}) => (
  <motion.svg
    className={`${getIconSize(size)} ${className}`}
    fill={color}
    viewBox="0 0 24 24"
    animate={animate ? { rotate: [0, 10, -10, 0] } : {}}
    transition={animate ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
  >
    <path d="M3 21L21 3"/>
    <path d="M18 6L20 4L22 6L20 8L18 6Z"/>
    <path d="M2 18L4 16L6 18L4 20L2 18Z"/>
    <circle cx="8" cy="16" r="1"/>
    <circle cx="12" cy="12" r="1"/>
    <circle cx="16" cy="8" r="1"/>
  </motion.svg>
);

// Love and Romance Icons
export const LoveLetterIcon: React.FC<RomanticIconProps> = ({ 
  size = 'md', 
  color = 'hsl(25 80% 78%)', 
  animate = false, 
  className = '' 
}) => (
  <motion.svg
    className={`${getIconSize(size)} ${className}`}
    fill={color}
    viewBox="0 0 24 24"
    animate={animate ? { y: [0, -2, 0] } : {}}
    transition={animate ? { duration: 2, repeat: Infinity, ease: 'easeInOut' } : {}}
  >
    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"/>
    <path d="M22 6L12 13L2 6"/>
    <path d="M8 10L12 13L16 10" stroke="white" strokeWidth="1" fill="none"/>
    <circle cx="12" cy="12" r="2" fill="hsl(340 85% 68%)"/>
  </motion.svg>
);

export const CoupleIcon: React.FC<RomanticIconProps> = ({ 
  size = 'md', 
  color = 'hsl(320 45% 78%)', 
  animate = false, 
  className = '' 
}) => (
  <motion.svg
    className={`${getIconSize(size)} ${className}`}
    fill={color}
    viewBox="0 0 24 24"
    animate={animate ? { scale: [1, 1.05, 1] } : {}}
    transition={animate ? { duration: 3, repeat: Infinity, ease: 'easeInOut' } : {}}
  >
    <circle cx="9" cy="7" r="4"/>
    <circle cx="15" cy="7" r="4"/>
    <path d="M9 14C6 14 2 15.5 2 18V22H16V18C16 15.5 12 14 9 14Z"/>
    <path d="M15 14C18 14 22 15.5 22 18V22H8V18C8 15.5 12 14 15 14Z" fillOpacity="0.7"/>
    <path d="M10 20L14 20" stroke="hsl(340 85% 68%)" strokeWidth="2"/>
  </motion.svg>
);

// Decorative Icons
export const RomanticBorder: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center space-x-2 ${className}`}>
    <RomanticSparkle size="sm" />
    <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-romantic-rose to-transparent"></div>
    <RomanticHeart size="sm" color="hsl(340 85% 68%)" />
    <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-romantic-rose to-transparent"></div>
    <RomanticSparkle size="sm" />
  </div>
);

export const FloatingDecorations: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
    <motion.div
      className="absolute top-10 left-10"
      animate={{ rotate: 360, y: [0, -10, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
    >
      <CherryBlossom size="sm" animate />
    </motion.div>
    
    <motion.div
      className="absolute top-20 right-20"
      animate={{ rotate: -360, y: [0, -15, 0] }}
      transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
    >
      <RomanticSparkle size="sm" />
    </motion.div>
    
    <motion.div
      className="absolute bottom-20 left-20"
      animate={{ rotate: 360, y: [0, -8, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
    >
      <FloatingHeart size="sm" />
    </motion.div>
    
    <motion.div
      className="absolute bottom-10 right-10"
      animate={{ rotate: -360, y: [0, -12, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
    >
      <RomanticRose size="sm" animate />
    </motion.div>
  </div>
);
