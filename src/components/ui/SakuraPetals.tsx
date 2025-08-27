import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SakuraPetal {
  id: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  duration: number;
  delay: number;
  color: string;
}

interface SakuraPetalsProps {
  count?: number;
  enabled?: boolean;
  intensity?: 'light' | 'medium' | 'heavy';
  colors?: string[];
}

export const SakuraPetals: React.FC<SakuraPetalsProps> = ({
  count = 15,
  enabled = true,
  intensity = 'medium',
  colors = ['#ffb3d9', '#ffc0cb', '#ffcccb', '#ffe4e1', '#f8bbd9']
}) => {
  const [petals, setPetals] = useState<SakuraPetal[]>([]);

  const intensitySettings = {
    light: { count: 8, interval: 12000 },
    medium: { count: 15, interval: 8000 },
    heavy: { count: 25, interval: 5000 }
  };

  useEffect(() => {
    if (!enabled) return;

    const settings = intensitySettings[intensity];

    const generatePetals = () => {
      const newPetals: SakuraPetal[] = [];
      for (let i = 0; i < settings.count; i++) {
        newPetals.push({
          id: `petal-${i}-${Date.now()}`,
          x: Math.random() * window.innerWidth,
          y: -50,
          size: Math.random() * 8 + 8,
          rotation: Math.random() * 360,
          duration: Math.random() * 10 + 15,
          delay: Math.random() * 8,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      setPetals(newPetals);
    };

    generatePetals();
    const interval = setInterval(generatePetals, settings.interval);

    return () => clearInterval(interval);
  }, [enabled, intensity, colors]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-5 overflow-hidden">
      <AnimatePresence>
        {petals.map((petal) => (
          <motion.div
            key={petal.id}
            className="absolute"
            style={{
              left: petal.x,
              top: petal.y,
              width: petal.size,
              height: petal.size,
              backgroundColor: petal.color,
              borderRadius: '50% 0 50% 0',
              boxShadow: `0 2px 8px ${petal.color}40`
            }}
            initial={{
              y: petal.y,
              x: petal.x,
              rotate: petal.rotation,
              opacity: 0,
              scale: 0.5
            }}
            animate={{
              y: window.innerHeight + 100,
              x: petal.x + Math.sin(Date.now() * 0.001) * 100,
              rotate: petal.rotation + 360,
              opacity: [0, 0.8, 0.6, 0],
              scale: [0.5, 1, 1.2, 0.8]
            }}
            exit={{
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: petal.duration,
              delay: petal.delay,
              ease: 'linear'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Romantic Background Effects
interface RomanticBackgroundProps {
  variant?: 'hearts' | 'petals' | 'sparkles' | 'all';
  intensity?: 'subtle' | 'moderate' | 'vibrant';
  enabled?: boolean;
}

export const RomanticBackground: React.FC<RomanticBackgroundProps> = ({
  variant = 'all',
  intensity = 'moderate',
  enabled = true
}) => {
  if (!enabled) return null;

  const intensityMap = {
    subtle: { hearts: 3, petals: 8, sparkles: 5 },
    moderate: { hearts: 5, petals: 15, sparkles: 8 },
    vibrant: { hearts: 8, petals: 25, sparkles: 12 }
  };

  const counts = intensityMap[intensity];

  return (
    <>
      {(variant === 'hearts' || variant === 'all') && (
        <div className="fixed inset-0 pointer-events-none z-1">
          {Array.from({ length: counts.hearts }).map((_, i) => (
            <motion.div
              key={`bg-heart-${i}`}
              className="absolute text-6xl opacity-10 select-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                color: '#ffb3d9'
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 5
              }}
            >
              💖
            </motion.div>
          ))}
        </div>
      )}

      {(variant === 'petals' || variant === 'all') && (
        <SakuraPetals
          count={counts.petals}
          enabled={enabled}
          intensity={intensity === 'subtle' ? 'light' : intensity === 'moderate' ? 'medium' : 'heavy'}
        />
      )}

      {(variant === 'sparkles' || variant === 'all') && (
        <div className="fixed inset-0 pointer-events-none z-2">
          {Array.from({ length: counts.sparkles }).map((_, i) => (
            <motion.div
              key={`bg-sparkle-${i}`}
              className="absolute text-2xl opacity-20 select-none"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 0.3, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 3
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}
    </>
  );
};