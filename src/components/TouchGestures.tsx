import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useIsMobile, useIsTouchDevice, useHapticFeedback } from '@/hooks/use-device';

interface TouchGesturesProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
  enableSwipe?: boolean;
  enableDoubleTap?: boolean;
  enableLongPress?: boolean;
  swipeThreshold?: number;
  className?: string;
}

export const TouchGestures: React.FC<TouchGesturesProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onDoubleTap,
  onLongPress,
  enableSwipe = true,
  enableDoubleTap = true,
  enableLongPress = true,
  swipeThreshold = 50,
  className = ''
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [isPressed, setIsPressed] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const handlePanStart = () => {
    if (enableLongPress) {
      setIsPressed(true);
      longPressTimer.current = setTimeout(() => {
        if (isPressed) {
          onLongPress?.();
        }
      }, 500); // 500ms for long press
    }
  };

  const handlePanEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsPressed(false);
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }

    if (!enableSwipe) return;

    const { offset, velocity } = info;
    const swipe = Math.abs(offset.x) > Math.abs(offset.y) ? offset.x : offset.y;
    const swipeVelocity = Math.abs(velocity.x) > Math.abs(velocity.y) ? velocity.x : velocity.y;

    // Horizontal swipes
    if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > 500) {
      if (offset.x > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }
    // Vertical swipes
    else if (Math.abs(offset.y) > swipeThreshold || Math.abs(velocity.y) > 500) {
      if (offset.y > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }

    // Reset position
    x.set(0);
    y.set(0);
  };

  const handleTap = () => {
    if (!enableDoubleTap) return;

    const now = Date.now();
    const timeDiff = now - lastTap;
    
    if (timeDiff < 300 && timeDiff > 0) {
      // Double tap detected
      onDoubleTap?.();
    }
    
    setLastTap(now);
  };

  const handlePan = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (enableSwipe) {
      x.set(info.offset.x);
      y.set(info.offset.y);
    }
  };

  return (
    <motion.div
      className={className}
      style={{ x, y }}
      onPanStart={handlePanStart}
      onPan={handlePan}
      onPanEnd={handlePanEnd}
      onTap={handleTap}
      drag={enableSwipe}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.2}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};

