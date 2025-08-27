import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RomanticCardProps {
  variant?: 'default' | 'sunset' | 'dreamy' | 'pearl' | 'mauve' | 'champagne' | 'glass' | 'aurora' | 'garden' | 'blush' | 'mist';
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  shimmer?: boolean;
  floating?: boolean;
  sparkles?: boolean;
  breathe?: boolean;
  onClick?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const RomanticCard: React.FC<RomanticCardProps> = ({
  variant = 'default',
  children,
  className,
  hover = true,
  glow = false,
  shimmer = false,
  floating = false,
  sparkles = false,
  breathe = false,
  onClick,
  header,
  footer
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'sunset':
        return 'card-romantic-sunset';
      case 'dreamy':
        return 'card-romantic-dreamy';
      case 'pearl':
        return 'card-elegant-pearl';
      case 'mauve':
        return 'card-romantic-mauve';
      case 'champagne':
        return 'card-champagne-elegant';
      case 'glass':
        return 'card-glass-romantic';
      case 'aurora':
        return 'card-aurora-dreams';
      case 'garden':
        return 'card-garden-whispers';
      case 'blush':
        return 'card-romantic-blush';
      case 'mist':
        return 'card-dreamy-mist';
      default:
        return 'card-romantic-3d';
    }
  };

  const getAnimationClasses = () => {
    const classes = [];
    if (glow) classes.push('romantic-glow');
    if (floating) classes.push('dreamy-float');
    if (sparkles) classes.push('sparkle-effect');
    if (breathe) classes.push('breathing-glow');
    return classes.join(' ');
  };

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden',
        getVariantClasses(),
        getAnimationClasses(),
        onClick && 'cursor-pointer',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
    >
      {/* Shimmer effect */}
      {shimmer && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              repeatDelay: 4,
              ease: 'easeInOut'
            }}
          />
        </div>
      )}

      {/* Glow effect on hover */}
      <AnimatePresence>
        {isHovered && glow && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[inherit]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      {header && (
        <motion.div
          className="relative z-10 mb-4"
          animate={{ x: isHovered ? 2 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {header}
        </motion.div>
      )}

      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <motion.div
          className="relative z-10 mt-4"
          animate={{ x: isHovered ? -2 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {footer}
        </motion.div>
      )}

      {/* Decorative corner elements */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-white/30 to-transparent rounded-full opacity-60" />
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-gradient-to-tr from-white/20 to-transparent rounded-full opacity-40" />
    </motion.div>
  );
};

// Specialized card variants
interface ContentCardProps extends Omit<RomanticCardProps, 'variant'> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const ElegantContentCard: React.FC<ContentCardProps> = ({
  title,
  subtitle,
  icon,
  children,
  ...props
}) => (
  <RomanticCard
    variant="pearl"
    shimmer
    glow
    header={
      title && (
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="flex-shrink-0 p-2 rounded-full bg-white/20">
              {icon}
            </div>
          )}
          <div>
            <h3 className="font-romantic text-xl font-semibold text-elegant">
              {title}
            </h3>
            {subtitle && (
              <p className="font-elegant text-sm text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )
    }
    {...props}
  >
    {children}
  </RomanticCard>
);

export const DreamyContentCard: React.FC<ContentCardProps> = ({
  title,
  subtitle,
  icon,
  children,
  ...props
}) => (
  <RomanticCard
    variant="dreamy"
    glow
    floating
    header={
      title && (
        <div className="flex items-center space-x-3">
          {icon && (
            <motion.div
              className="flex-shrink-0 p-2 rounded-full bg-white/25"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              {icon}
            </motion.div>
          )}
          <div>
            <h3 className="font-romantic text-xl font-semibold text-romantic">
              {title}
            </h3>
            {subtitle && (
              <p className="font-elegant text-sm text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )
    }
    {...props}
  >
    {children}
  </RomanticCard>
);

export const GlassContentCard: React.FC<ContentCardProps> = ({
  title,
  subtitle,
  icon,
  children,
  ...props
}) => (
  <RomanticCard
    variant="glass"
    shimmer
    header={
      title && (
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="flex-shrink-0 p-2 rounded-full bg-white/30 backdrop-blur-sm">
              {icon}
            </div>
          )}
          <div>
            <h3 className="font-display text-xl font-semibold text-elegant">
              {title}
            </h3>
            {subtitle && (
              <p className="font-elegant text-sm text-muted-foreground mt-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )
    }
    {...props}
  >
    {children}
  </RomanticCard>
);
