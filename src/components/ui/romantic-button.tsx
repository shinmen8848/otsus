import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RomanticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'sunset' | 'dreamy' | 'pearl' | 'mauve' | 'champagne' | 'script' | 'aurora' | 'garden' | 'blush' | 'mist';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  shimmer?: boolean;
  romantic?: boolean;
  glow?: boolean;
  sparkles?: boolean;
  floatingHearts?: boolean;
}

export const RomanticButton: React.FC<RomanticButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'left',
  loading = false,
  shimmer = false,
  romantic = false,
  glow = false,
  sparkles = false,
  floatingHearts = false,
  className,
  disabled,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'sunset':
        return 'btn-romantic-sunset';
      case 'dreamy':
        return 'btn-romantic-dreamy';
      case 'pearl':
        return 'btn-elegant-pearl';
      case 'mauve':
        return 'btn-romantic-mauve';
      case 'champagne':
        return 'btn-script-elegant';
      case 'script':
        return 'btn-script-elegant font-script';
      case 'aurora':
        return 'btn-aurora-dreams';
      case 'garden':
        return 'btn-garden-whispers';
      case 'blush':
        return 'btn-romantic-blush';
      case 'mist':
        return 'btn-dreamy-mist';
      default:
        return 'btn-romantic-3d';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'px-3 py-1.5 text-xs min-h-[32px]';
      case 'sm':
        return 'px-4 py-2 text-sm min-h-[40px]';
      case 'lg':
        return 'px-8 py-4 text-lg min-h-[56px]';
      case 'xl':
        return 'px-10 py-5 text-xl min-h-[64px]';
      default:
        return 'px-6 py-3 text-base min-h-[48px]';
    }
  };

  const getAnimationClasses = () => {
    if (romantic) return 'romantic-breathe';
    if (shimmer) return 'romantic-shimmer';
    return '';
  };

  return (
    <motion.button
      className={cn(
        'relative inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed',
        getVariantClasses(),
        getSizeClasses(),
        getAnimationClasses(),
        className
      )}
      disabled={disabled || loading}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTapStart={() => setIsPressed(true)}
      onTap={() => setIsPressed(false)}
      onTapCancel={() => setIsPressed(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {/* Background glow effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-full bg-white/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Shimmer effect */}
      {shimmer && (
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: 'easeInOut'
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative flex items-center justify-center space-x-2">
        {loading ? (
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <motion.span
                className="flex-shrink-0"
                animate={{ rotate: isHovered ? 10 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {icon}
              </motion.span>
            )}
            
            <span className="relative">
              {children}
            </span>
            
            {icon && iconPosition === 'right' && (
              <motion.span
                className="flex-shrink-0"
                animate={{ rotate: isHovered ? -10 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {icon}
              </motion.span>
            )}
          </>
        )}
      </div>

      {/* Floating hearts on press */}
      <AnimatePresence>
        {isPressed && romantic && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-pink-300 pointer-events-none"
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 100}%`,
                  y: `${50 + (Math.random() - 0.5) * 100}%`,
                  scale: 1,
                  opacity: 0
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.1,
                  ease: 'easeOut'
                }}
              >
                💕
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// Preset button variants for common use cases
export const PrimaryRomanticButton: React.FC<Omit<RomanticButtonProps, 'variant'>> = (props) => (
  <RomanticButton variant="primary" romantic shimmer {...props} />
);

export const SunsetRomanticButton: React.FC<Omit<RomanticButtonProps, 'variant'>> = (props) => (
  <RomanticButton variant="sunset" romantic {...props} />
);

export const DreamyRomanticButton: React.FC<Omit<RomanticButtonProps, 'variant'>> = (props) => (
  <RomanticButton variant="dreamy" romantic {...props} />
);

export const ElegantPearlButton: React.FC<Omit<RomanticButtonProps, 'variant'>> = (props) => (
  <RomanticButton variant="pearl" shimmer {...props} />
);

export const ScriptRomanticButton: React.FC<Omit<RomanticButtonProps, 'variant'>> = (props) => (
  <RomanticButton variant="script" romantic {...props} />
);
