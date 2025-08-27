import { useState, useEffect } from 'react';

// Hook for detecting mobile device
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

// Hook for detecting touch device
export const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouchDevice;
};

// Hook for haptic feedback
export const useHapticFeedback = () => {
  const vibrate = (pattern: number | number[] = 50) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const lightTap = () => vibrate(10);
  const mediumTap = () => vibrate(50);
  const heavyTap = () => vibrate([100, 50, 100]);
  const success = () => vibrate([50, 100, 50]);
  const error = () => vibrate([100, 50, 100, 50, 100]);

  return {
    vibrate,
    lightTap,
    mediumTap,
    heavyTap,
    success,
    error
  };
};
