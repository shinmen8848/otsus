import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  emoji: string;
  color: string;
  opacity: number;
}

interface FloatingHeartsProps {
  count?: number;
  className?: string;
  romantic?: boolean;
  interactive?: boolean;
  onClick?: (heart: Heart) => void;
}

export const FloatingHearts: React.FC<FloatingHeartsProps> = ({
  count = 12,
  className = '',
  romantic = true,
  interactive = false,
  onClick
}) => {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [clickedHearts, setClickedHearts] = useState<Set<number>>(new Set());

  const heartEmojis = ['💕', '💖', '💗', '💘', '💝', '💞', '💟', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤍', '🖤', '🤎'];
  const romanticColors = [
    'hsl(340 85% 68%)',
    'hsl(345 80% 72%)',
    'hsl(285 55% 78%)',
    'hsl(25 80% 78%)',
    'hsl(320 45% 78%)',
    'hsl(15 75% 82%)',
    'hsl(165 35% 82%)'
  ];

  useEffect(() => {
    const generateHearts = () => {
      const newHearts: Heart[] = [];
      for (let i = 0; i < count; i++) {
        newHearts.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 15,
          duration: Math.random() * 8 + 6,
          delay: Math.random() * 10,
          emoji: romantic ? heartEmojis[Math.floor(Math.random() * heartEmojis.length)] : '💕',
          color: romanticColors[Math.floor(Math.random() * romanticColors.length)],
          opacity: Math.random() * 0.4 + 0.3
        });
      }
      setHearts(newHearts);
    };

    generateHearts();
  }, [count, romantic]);

  const handleHeartClick = (heart: Heart) => {
    if (!interactive) return;
    
    setClickedHearts(prev => new Set([...prev, heart.id]));
    onClick?.(heart);
    
    // Remove from clicked set after animation
    setTimeout(() => {
      setClickedHearts(prev => {
        const newSet = new Set(prev);
        newSet.delete(heart.id);
        return newSet;
      });
    }, 1000);
  };

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-5 ${className}`}>
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            className={`absolute ${interactive ? 'pointer-events-auto cursor-pointer' : ''}`}
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              fontSize: `${heart.size}px`,
              color: heart.color,
              opacity: heart.opacity
            }}
            initial={{ 
              scale: 0,
              rotate: 0,
              y: 0
            }}
            animate={{
              scale: clickedHearts.has(heart.id) ? [1, 1.5, 0] : [0, 1, 1],
              rotate: [0, 360, 720],
              y: [0, -30, 0],
              opacity: clickedHearts.has(heart.id) ? [heart.opacity, 1, 0] : heart.opacity
            }}
            transition={{
              duration: clickedHearts.has(heart.id) ? 1 : heart.duration,
              delay: clickedHearts.has(heart.id) ? 0 : heart.delay,
              repeat: clickedHearts.has(heart.id) ? 0 : Infinity,
              ease: 'easeInOut'
            }}
            onClick={() => handleHeartClick(heart)}
          >
            {heart.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Additional romantic sparkles */}
      {romantic && (
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute text-yellow-300"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: '12px'
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Specialized variants
export const InteractiveFloatingHearts: React.FC<Omit<FloatingHeartsProps, 'interactive'>> = (props) => (
  <FloatingHearts interactive {...props} />
);

export const SubtleFloatingHearts: React.FC<Omit<FloatingHeartsProps, 'count' | 'romantic'>> = (props) => (
  <FloatingHearts count={6} romantic={false} {...props} />
);

// Heart burst effect for special moments
interface HeartBurstProps {
  x: number;
  y: number;
  onComplete?: () => void;
}

export const HeartBurst: React.FC<HeartBurstProps> = ({ x, y, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed pointer-events-none z-50"
      style={{ left: x, top: y }}
    >
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          initial={{ 
            scale: 0,
            x: 0,
            y: 0,
            opacity: 1
          }}
          animate={{
            scale: [0, 1, 0],
            x: Math.cos(i * 45 * Math.PI / 180) * 100,
            y: Math.sin(i * 45 * Math.PI / 180) * 100,
            opacity: [1, 1, 0],
            rotate: 360
          }}
          transition={{
            duration: 2,
            ease: 'easeOut'
          }}
        >
          💕
        </motion.div>
      ))}
    </div>
  );
};

// Romantic trail effect
interface RomanticTrailProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export const RomanticTrail: React.FC<RomanticTrailProps> = ({ 
  children, 
  enabled = true 
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Add new trail point
      const newTrail = { id: Date.now(), x: e.clientX, y: e.clientY };
      setTrails(prev => [...prev.slice(-5), newTrail]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  return (
    <>
      {children}
      {enabled && (
        <div className="fixed inset-0 pointer-events-none z-40">
          <AnimatePresence>
            {trails.map((trail, index) => (
              <motion.div
                key={trail.id}
                className="absolute text-pink-300"
                style={{
                  left: trail.x - 10,
                  top: trail.y - 10,
                  fontSize: '20px'
                }}
                initial={{ opacity: 0.8, scale: 1 }}
                animate={{ opacity: 0, scale: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, delay: index * 0.1 }}
              >
                💕
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};
