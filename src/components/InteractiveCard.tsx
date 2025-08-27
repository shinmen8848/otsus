import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Star, Sparkles, ArrowRight } from 'lucide-react';

interface InteractiveCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'sunset' | 'dreamy' | 'romantic';
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  title,
  description,
  icon,
  variant = 'default',
  onClick,
  children,
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const getCardClass = () => {
    switch (variant) {
      case 'sunset':
        return 'card-romantic-sunset';
      case 'dreamy':
        return 'card-romantic-dreamy';
      case 'romantic':
        return 'card-romantic-3d romantic-glow';
      default:
        return 'card-romantic-3d';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'sunset':
        return 'text-orange-500';
      case 'dreamy':
        return 'text-purple-500';
      case 'romantic':
        return 'text-pink-500';
      default:
        return 'text-primary';
    }
  };

  return (
    <motion.div
      className={`${getCardClass()} ${className} cursor-pointer relative overflow-hidden`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      whileTap={{ 
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTapStart={() => setIsPressed(true)}
      onTap={() => {
        setIsPressed(false);
        onClick?.();
      }}
      onTapCancel={() => setIsPressed(false)}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 opacity-0 bg-gradient-to-br from-primary/10 to-secondary/10"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Shimmer effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10">
        {/* Header with icon */}
        <div className="flex items-center space-x-3 mb-4">
          {icon && (
            <motion.div
              className={`${getIconColor()} p-2 rounded-full bg-white/20`}
              animate={{ 
                rotate: isHovered ? 360 : 0,
                scale: isPressed ? 0.9 : 1
              }}
              transition={{ duration: 0.5 }}
            >
              {icon}
            </motion.div>
          )}
          <div className="flex-1">
            <motion.h3 
              className="text-xl font-elegant font-bold text-foreground mb-1"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {title}
            </motion.h3>
            <motion.div
              className="h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: isHovered ? '100%' : '30%' }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Description */}
        <motion.p 
          className="text-foreground/80 font-elegant leading-relaxed mb-4"
          animate={{ opacity: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.3 }}
        >
          {description}
        </motion.p>

        {/* Children content */}
        {children && (
          <motion.div
            animate={{ y: isHovered ? -2 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        )}

        {/* Action indicator */}
        {onClick && (
          <motion.div
            className="flex items-center justify-end mt-4 text-primary/60"
            animate={{ x: isHovered ? 5 : 0, opacity: isHovered ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-sm font-elegant mr-2">Explore</span>
            <ArrowRight className="w-4 h-4" />
          </motion.div>
        )}
      </div>

      {/* Floating hearts animation */}
      <AnimatePresence>
        {isPressed && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-pink-500 pointer-events-none"
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
                  duration: 1,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              >
                <Heart className="w-4 h-4 fill-current" />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
