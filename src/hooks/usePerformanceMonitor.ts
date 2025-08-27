import { useState, useEffect, useRef, useCallback } from 'react';

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage: number;
  cpuUsage: number;
  renderTime: number;
  totalFrames: number;
  droppedFrames: number;
  averageFps: number;
  isThrottled: boolean;
}

export interface PerformanceThresholds {
  targetFps: number;
  maxFrameTime: number;
  maxMemoryUsage: number;
  throttleThreshold: number;
}

export const usePerformanceMonitor = (
  enabled: boolean = true,
  thresholds: PerformanceThresholds = {
    targetFps: 60,
    maxFrameTime: 16.67, // 60fps = 16.67ms per frame
    maxMemoryUsage: 100, // MB
    throttleThreshold: 30 // fps
  }
) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    renderTime: 0,
    totalFrames: 0,
    droppedFrames: 0,
    averageFps: 0,
    isThrottled: false
  });

  const [isMonitoring, setIsMonitoring] = useState(false);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef(performance.now());

  // Memory usage monitoring
  const getMemoryUsage = useCallback((): number => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
    }
    return 0;
  }, []);

  // CPU usage estimation (simplified)
  const estimateCpuUsage = useCallback((frameTime: number): number => {
    // Rough estimation based on frame time
    const idealFrameTime = 1000 / thresholds.targetFps;
    return Math.min(100, (frameTime / idealFrameTime) * 100);
  }, [thresholds.targetFps]);

  // Frame monitoring loop
  const monitorFrame = useCallback(() => {
    if (!enabled) return;

    const now = performance.now();
    const deltaTime = now - lastTimeRef.current;
    
    frameCountRef.current++;
    
    // Calculate FPS
    const currentFps = 1000 / deltaTime;
    
    // Update FPS history (keep last 60 frames)
    fpsHistoryRef.current.push(currentFps);
    if (fpsHistoryRef.current.length > 60) {
      fpsHistoryRef.current.shift();
    }
    
    // Calculate average FPS
    const averageFps = fpsHistoryRef.current.reduce((sum, fps) => sum + fps, 0) / fpsHistoryRef.current.length;
    
    // Calculate dropped frames
    const expectedFrames = Math.floor((now - startTimeRef.current) / (1000 / thresholds.targetFps));
    const droppedFrames = Math.max(0, expectedFrames - frameCountRef.current);
    
    // Determine if performance is throttled
    const isThrottled = averageFps < thresholds.throttleThreshold;
    
    // Update metrics
    setMetrics({
      fps: Math.round(currentFps),
      frameTime: deltaTime,
      memoryUsage: getMemoryUsage(),
      cpuUsage: estimateCpuUsage(deltaTime),
      renderTime: deltaTime,
      totalFrames: frameCountRef.current,
      droppedFrames,
      averageFps: Math.round(averageFps),
      isThrottled
    });
    
    lastTimeRef.current = now;
    
    if (isMonitoring) {
      animationFrameRef.current = requestAnimationFrame(monitorFrame);
    }
  }, [enabled, isMonitoring, getMemoryUsage, estimateCpuUsage, thresholds]);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (!enabled || isMonitoring) return;
    
    setIsMonitoring(true);
    frameCountRef.current = 0;
    lastTimeRef.current = performance.now();
    startTimeRef.current = performance.now();
    fpsHistoryRef.current = [];
    
    animationFrameRef.current = requestAnimationFrame(monitorFrame);
  }, [enabled, isMonitoring, monitorFrame]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, []);

  // Reset metrics
  const resetMetrics = useCallback(() => {
    frameCountRef.current = 0;
    lastTimeRef.current = performance.now();
    startTimeRef.current = performance.now();
    fpsHistoryRef.current = [];
    
    setMetrics({
      fps: 0,
      frameTime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      renderTime: 0,
      totalFrames: 0,
      droppedFrames: 0,
      averageFps: 0,
      isThrottled: false
    });
  }, []);

  // Performance optimization suggestions
  const getOptimizationSuggestions = useCallback((): string[] => {
    const suggestions: string[] = [];
    
    if (metrics.fps < thresholds.targetFps * 0.8) {
      suggestions.push('Consider reducing image resolution or quality');
    }
    
    if (metrics.memoryUsage > thresholds.maxMemoryUsage) {
      suggestions.push('High memory usage detected - consider optimizing image sizes');
    }
    
    if (metrics.droppedFrames > 10) {
      suggestions.push('Frame drops detected - try reducing processing complexity');
    }
    
    if (metrics.isThrottled) {
      suggestions.push('Performance is throttled - consider using lower quality preview');
    }
    
    if (metrics.frameTime > thresholds.maxFrameTime * 2) {
      suggestions.push('Frame time is high - consider using Web Workers for processing');
    }
    
    return suggestions;
  }, [metrics, thresholds]);

  // Performance grade (A, B, C, D, F)
  const getPerformanceGrade = useCallback((): string => {
    const fpsScore = (metrics.averageFps / thresholds.targetFps) * 100;
    const memoryScore = Math.max(0, 100 - (metrics.memoryUsage / thresholds.maxMemoryUsage) * 100);
    const frameTimeScore = Math.max(0, 100 - (metrics.frameTime / thresholds.maxFrameTime) * 100);
    
    const overallScore = (fpsScore + memoryScore + frameTimeScore) / 3;
    
    if (overallScore >= 90) return 'A';
    if (overallScore >= 80) return 'B';
    if (overallScore >= 70) return 'C';
    if (overallScore >= 60) return 'D';
    return 'F';
  }, [metrics, thresholds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Auto-start monitoring when enabled
  useEffect(() => {
    if (enabled && !isMonitoring) {
      startMonitoring();
    } else if (!enabled && isMonitoring) {
      stopMonitoring();
    }
  }, [enabled, isMonitoring, startMonitoring, stopMonitoring]);

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    resetMetrics,
    getOptimizationSuggestions,
    getPerformanceGrade,
    
    // Convenience getters
    isPerformanceGood: metrics.averageFps >= thresholds.targetFps * 0.9,
    isMemoryHigh: metrics.memoryUsage > thresholds.maxMemoryUsage,
    hasFrameDrops: metrics.droppedFrames > 5,
    
    // Thresholds for reference
    thresholds
  };
};

// Hook for measuring specific operations
export const useOperationTimer = () => {
  const [measurements, setMeasurements] = useState<Map<string, number>>(new Map());
  
  const startTimer = useCallback((operationName: string) => {
    performance.mark(`${operationName}-start`);
  }, []);
  
  const endTimer = useCallback((operationName: string) => {
    performance.mark(`${operationName}-end`);
    performance.measure(operationName, `${operationName}-start`, `${operationName}-end`);
    
    const measure = performance.getEntriesByName(operationName, 'measure')[0];
    if (measure) {
      setMeasurements(prev => new Map(prev).set(operationName, measure.duration));
    }
    
    // Cleanup
    performance.clearMarks(`${operationName}-start`);
    performance.clearMarks(`${operationName}-end`);
    performance.clearMeasures(operationName);
  }, []);
  
  const getLastMeasurement = useCallback((operationName: string): number | undefined => {
    return measurements.get(operationName);
  }, [measurements]);
  
  const getAllMeasurements = useCallback((): Record<string, number> => {
    return Object.fromEntries(measurements);
  }, [measurements]);
  
  return {
    startTimer,
    endTimer,
    getLastMeasurement,
    getAllMeasurements,
    measurements: Object.fromEntries(measurements)
  };
};
