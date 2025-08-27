import React from 'react';
import { motion } from 'framer-motion';

interface RomanticLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'hearts' | 'petals' | 'sparkles' | 'pulse';
  message?: string;
}

export const RomanticLoader: React.FC<RomanticLoaderProps> = ({
  size = 'md',
  variant = 'hearts',
  message = 'Loading with love...'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'lg':
        return 'w-16 h-16';
      default:
        return 'w-12 h-12';
    }
  };

  const getMessageSize = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      default:
        return 'text-base';
    }
  };

  const renderHearts = () => (
    <div className={`relative ${getSizeClasses()}`}>
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 flex items-center justify-center"
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 1, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut"
          }}
        >
          <span className="text-pink-500 text-2xl">💕</span>
        </motion.div>
      ))}
    </div>
  );

  const renderPetals = () => (
    <div className={`relative ${getSizeClasses()}`}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-pink-400 rounded-full"
          style={{
            left: '50%',
            top: '50%',
            transformOrigin: '0 0'
          }}
          animate={{
            rotate: [0, 360],
            scale: [0.5, 1, 0.5],
            x: [0, Math.cos(i * 72 * Math.PI / 180) * 20],
            y: [0, Math.sin(i * 72 * Math.PI / 180) * 20]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  const renderSparkles = () => (
    <div className={`relative ${getSizeClasses()}`}>
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-yellow-400"
          style={{
            left: `${20 + (i % 3) * 30}%`,
            top: `${20 + Math.floor(i / 3) * 30}%`
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );

  const renderPulse = () => (
    <div className={`relative ${getSizeClasses()}`}>
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.8, 0.3, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute inset-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.6, 0.9, 0.6]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          delay: 0.5,
          ease: "easeInOut"
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white text-xl">💖</span>
      </div>
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'petals':
        return renderPetals();
      case 'sparkles':
        return renderSparkles();
      case 'pulse':
        return renderPulse();
      default:
        return renderHearts();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      {renderLoader()}
      
      {message && (
        <motion.p
          className={`font-elegant text-foreground/80 text-center ${getMessageSize()}`}
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {message}
        </motion.p>
      )}
      
      {/* Floating background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-pink-300 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    </div>
  );
};
