import { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  type: 'sakura' | 'tulip' | 'heart' | 'star';
  color: string;
}

export const SakuraPetals = () => {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    const generatePetals = () => {
      const newPetals: Petal[] = [];
      const petalTypes = ['sakura', 'tulip', 'heart', 'star'] as const;
      const colors = [
        'hsl(340 90% 70%)', // romantic pink
        'hsl(45 95% 75%)', // warm yellow
        'hsl(280 60% 80%)', // soft lavender
        'hsl(350 85% 75%)', // rose
        'hsl(15 80% 85%)', // peach
      ];

      for (let i = 0; i < 20; i++) {
        newPetals.push({
          id: i,
          left: Math.random() * 100,
          size: Math.random() * 10 + 6,
          duration: Math.random() * 6 + 8,
          delay: Math.random() * 12,
          type: petalTypes[Math.floor(Math.random() * petalTypes.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      setPetals(newPetals);
    };

    generatePetals();
  }, []);

  const getPetalShape = (type: string) => {
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
  };

  const getPetalAnimation = (type: string) => {
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
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className={`absolute ${getPetalShape(petal.type)} opacity-80 shadow-lg`}
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size}px`,
            backgroundColor: petal.color,
            animation: `${getPetalAnimation(petal.type)} ${petal.duration}s linear infinite`,
            animationDelay: `${petal.delay}s`,
            boxShadow: `0 2px 8px ${petal.color}40, 0 4px 16px ${petal.color}20`,
          }}
        />
      ))}
    </div>
  );
};