import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingHeart {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

interface FloatingHeartsProps {
  count?: number;
  colors?: string[];
  enabled?: boolean;
  interactive?: boolean;
}

export const FloatingHearts: React.FC<FloatingHeartsProps> = ({
  count = 5,
  colors = ['💖', '💕', '💗', '💝', '💘'],
  enabled = true,
  interactive = false
}) => {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const generateHearts = () => {
      const newHearts: FloatingHeart[] = [];
      for (let i = 0; i < count; i++) {
        newHearts.push({
          id: `heart-${i}-${Date.now()}`,
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 50,
          size: Math.random() * 20 + 15,
          color: colors[Math.floor(Math.random() * colors.length)],
          duration: Math.random() * 8 + 12,
          delay: Math.random() * 5
        });
      }
      setHearts(newHearts);
    };

    generateHearts();
    const interval = setInterval(generateHearts, 8000);

    return () => clearInterval(interval);
  }, [count, colors, enabled]);

  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  if (!enabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-2xl select-none"
            style={{
              fontSize: `${heart.size}px`,
              left: heart.x,
              top: heart.y
            }}
            initial={{
              y: heart.y,
              x: heart.x,
              opacity: 0,
              scale: 0.5,
              rotate: 0
            }}
            animate={{
              y: -100,
              x: heart.x + (Math.sin(Date.now() * 0.001) * 50),
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 1.2, 0.8],
              rotate: [0, 10, -10, 0]
            }}
            exit={{
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: heart.duration,
              delay: heart.delay,
              ease: 'easeOut'
            }}
          >
            {heart.color}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Interactive hearts that follow mouse */}
      {interactive && (
        <motion.div
          className="absolute text-xl select-none opacity-60"
          style={{
            left: mousePosition.x - 10,
            top: mousePosition.y - 10
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 15, -15, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          💕
        </motion.div>
      )}
    </div>
  );
};

// Sparkle effect component
interface SparkleProps {
  count?: number;
  colors?: string[];
  size?: 'sm' | 'md' | 'lg';
  enabled?: boolean;
}

export const SparkleEffect: React.FC<SparkleProps> = ({
  count = 8,
  colors = ['✨', '⭐', '💫', '🌟'],
  size = 'md',
  enabled = true
}) => {
  const [sparkles, setSparkles] = useState<FloatingHeart[]>([]);

  const sizeMap = {
    sm: 12,
    md: 16,
    lg: 20
  };

  useEffect(() => {
    if (!enabled) return;

    const generateSparkles = () => {
      const newSparkles: FloatingHeart[] = [];
      for (let i = 0; i < count; i++) {
        newSparkles.push({
          id: `sparkle-${i}-${Date.now()}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: sizeMap[size],
          color: colors[Math.floor(Math.random() * colors.length)],
          duration: Math.random() * 3 + 2,
          delay: Math.random() * 2
        });
      }
      setSparkles(newSparkles);
    };

    generateSparkles();
    const interval = setInterval(generateSparkles, 4000);

    return () => clearInterval(interval);
  }, [count, colors, size, enabled]);

  if (!enabled) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute select-none"
            style={{
              fontSize: `${sparkle.size}px`,
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`
            }}
            initial={{
              opacity: 0,
              scale: 0,
              rotate: 0
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1.3, 0],
              rotate: [0, 180, 360]
            }}
            exit={{
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: sparkle.duration,
              delay: sparkle.delay,
              ease: 'easeInOut'
            }}
          >
            {sparkle.color}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};