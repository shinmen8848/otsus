import { useEffect, useState, useMemo } from 'react';

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  type: 'sakura' | 'tulip' | 'heart' | 'star';
  color: string;
}

// Constants moved outside component to prevent recreation
const PETAL_TYPES = ['sakura', 'tulip', 'heart', 'star'] as const;
const PETAL_COLORS = [
  'hsl(340 90% 70%)', // romantic pink
  'hsl(45 95% 75%)', // warm yellow
  'hsl(280 60% 80%)', // soft lavender
  'hsl(350 85% 75%)', // rose
  'hsl(15 80% 85%)', // peach
];

// Reduce petal count for better performance
const PETAL_COUNT = 12;

export const SakuraPetals = () => {
  // Memoize petals generation to prevent recreation on every render
  const petals = useMemo(() => {
    const newPetals: Petal[] = [];

    for (let i = 0; i < PETAL_COUNT; i++) {
      newPetals.push({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 8 + 6, // Slightly smaller for performance
        duration: Math.random() * 4 + 10, // Longer duration, less frequent updates
        delay: Math.random() * 15,
        type: PETAL_TYPES[Math.floor(Math.random() * PETAL_TYPES.length)],
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      });
    }
    return newPetals;
  }, []); // Empty dependency array - generate once

  // Memoize shape and animation functions to prevent recreation
  const getPetalShape = useMemo(() => (type: string) => {
    switch (type) {
      case 'sakura':
        return 'rounded-full';
      case 'tulip':
        return 'rounded-t-full rounded-b-none';
      case 'heart':
        return 'rounded-full transform rotate-45';
      case 'star':
        return 'rounded-sm transform rotate-12';
      default:
        return 'rounded-full';
    }
  }, []);

  const getPetalAnimation = useMemo(() => (type: string) => {
    switch (type) {
      case 'sakura':
        return 'sakura-fall-3d';
      case 'tulip':
        return 'tulip-fall';
      case 'heart':
        return 'sakura-fall-3d';
      case 'star':
        return 'tulip-fall';
      default:
        return 'sakura-fall-3d';
    }
  }, []);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Don't render if user prefers reduced motion
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className={`absolute ${getPetalShape(petal.type)} opacity-60 will-change-transform`}
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            backgroundColor: petal.color,
            animation: `${getPetalAnimation(petal.type)} ${petal.duration}s linear infinite`,
            animationDelay: `${petal.delay}s`,
            // Simplified shadow for better performance
            boxShadow: `0 2px 4px ${petal.color}30`,
          }}
        />
      ))}
    </div>
  );
};