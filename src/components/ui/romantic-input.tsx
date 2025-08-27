import React, { useState, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RomanticInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'elegant' | 'dreamy' | 'glass' | 'aurora' | 'sunset' | 'pearl' | 'blush' | 'garden';
  label?: string;
  error?: string;
  success?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  floating?: boolean;
  romantic?: boolean;
  shimmer?: boolean;
  glow?: boolean;
}

export const RomanticInput = forwardRef<HTMLInputElement, RomanticInputProps>(
  ({
    variant = 'default',
    label,
    error,
    success,
    icon,
    iconPosition = 'left',
    floating = false,
    romantic = false,
    shimmer = false,
    glow = false,
    className,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const getVariantClasses = () => {
      const baseClasses = 'w-full px-4 py-3 rounded-2xl border transition-all duration-300 font-elegant min-h-[48px]';

      switch (variant) {
        case 'elegant':
          return `${baseClasses} input-romantic bg-white/60 backdrop-blur-sm border-romantic-pearl/30 focus:border-primary focus:bg-white/80`;
        case 'dreamy':
          return `${baseClasses} input-romantic bg-gradient-to-r from-white/40 to-white/60 backdrop-blur-md border-romantic-lavender/30 focus:border-accent focus:from-white/60 focus:to-white/80`;
        case 'glass':
          return `${baseClasses} input-romantic bg-white/30 backdrop-blur-lg border-white/40 focus:border-white/60 focus:bg-white/40`;
        case 'aurora':
          return `${baseClasses} input-romantic bg-gradient-to-r from-white/35 to-white/55 backdrop-blur-md border-purple-300/30 focus:border-purple-400 focus:from-white/55 focus:to-white/75`;
        case 'sunset':
          return `${baseClasses} input-romantic bg-gradient-to-r from-white/40 to-white/60 backdrop-blur-md border-orange-300/30 focus:border-orange-400 focus:from-white/60 focus:to-white/80`;
        case 'pearl':
          return `${baseClasses} input-romantic bg-white/70 backdrop-blur-sm border-gray-200/40 focus:border-gray-300 focus:bg-white/85`;
        case 'blush':
          return `${baseClasses} input-romantic bg-gradient-to-r from-white/45 to-white/65 backdrop-blur-md border-pink-300/30 focus:border-pink-400 focus:from-white/65 focus:to-white/85`;
        case 'garden':
          return `${baseClasses} input-romantic bg-gradient-to-r from-white/35 to-white/55 backdrop-blur-md border-green-300/30 focus:border-green-400 focus:from-white/55 focus:to-white/75`;
        default:
          return `${baseClasses} input-romantic bg-white/50 backdrop-blur-sm border-muted focus:border-primary focus:bg-white/70`;
      }
    };

    const getLabelClasses = () => {
      if (floating) {
        return cn(
          'absolute left-4 transition-all duration-300 pointer-events-none font-elegant',
          (isFocused || hasValue)
            ? 'top-2 text-xs text-primary font-medium'
            : 'top-3 text-base text-muted-foreground'
        );
      }
      return 'block text-sm font-medium text-elegant mb-2 font-elegant';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    return (
      <div className="relative">
        {/* Label */}
        {label && !floating && (
          <motion.label
            className={getLabelClasses()}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {label}
          </motion.label>
        )}

        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {icon && iconPosition === 'left' && (
            <motion.div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              animate={{ 
                scale: isFocused ? 1.1 : 1,
                color: isFocused ? 'hsl(340 85% 68%)' : 'hsl(340 15% 25%)'
              }}
              transition={{ duration: 0.3 }}
            >
              {icon}
            </motion.div>
          )}

          {/* Input field */}
          <motion.input
            ref={ref}
            className={cn(
              getVariantClasses(),
              icon && iconPosition === 'left' && 'pl-12',
              icon && iconPosition === 'right' && 'pr-12',
              floating && 'pt-6 pb-2',
              error && 'border-red-400 focus:border-red-500',
              success && 'border-green-400 focus:border-green-500',
              className
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            {...props}
          />

          {/* Floating label */}
          {label && floating && (
            <motion.label
              className={getLabelClasses()}
              animate={{
                y: (isFocused || hasValue) ? 0 : 0,
                scale: (isFocused || hasValue) ? 0.85 : 1,
                color: isFocused ? 'hsl(340 85% 68%)' : 'hsl(340 15% 25%)'
              }}
              transition={{ duration: 0.3 }}
            >
              {label}
            </motion.label>
          )}

          {/* Right icon */}
          {icon && iconPosition === 'right' && (
            <motion.div
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              animate={{ 
                scale: isFocused ? 1.1 : 1,
                color: isFocused ? 'hsl(340 85% 68%)' : 'hsl(340 15% 25%)'
              }}
              transition={{ duration: 0.3 }}
            >
              {icon}
            </motion.div>
          )}

          {/* Focus ring */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-primary/50 pointer-events-none"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </AnimatePresence>

          {/* Romantic sparkles */}
          {romantic && isFocused && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-primary/60"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: `${20 + (i % 2) * 60}%`
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    rotate: 360
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: 'easeInOut'
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.p
              className="mt-2 text-sm text-red-600 font-elegant"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Success message */}
        <AnimatePresence>
          {success && (
            <motion.p
              className="mt-2 text-sm text-green-600 font-elegant"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {success}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

RomanticInput.displayName = 'RomanticInput';

// Preset input variants
export const ElegantInput = forwardRef<HTMLInputElement, Omit<RomanticInputProps, 'variant'>>(
  (props, ref) => <RomanticInput ref={ref} variant="elegant" floating romantic {...props} />
);

export const DreamyInput = forwardRef<HTMLInputElement, Omit<RomanticInputProps, 'variant'>>(
  (props, ref) => <RomanticInput ref={ref} variant="dreamy" floating romantic {...props} />
);

export const GlassInput = forwardRef<HTMLInputElement, Omit<RomanticInputProps, 'variant'>>(
  (props, ref) => <RomanticInput ref={ref} variant="glass" floating {...props} />
);

ElegantInput.displayName = 'ElegantInput';
DreamyInput.displayName = 'DreamyInput';
GlassInput.displayName = 'GlassInput';
