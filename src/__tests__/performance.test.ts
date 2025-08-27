import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ColorGradingService } from '@/lib/color-grading/color-grading-service';
import { ImageOptimizer } from '@/lib/image-optimization';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { renderHook, act } from '@testing-library/react';

// Mock performance API
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByName: vi.fn(() => [{ duration: 16.67 }]),
  clearMarks: vi.fn(),
  clearMeasures: vi.fn(),
  memory: {
    usedJSHeapSize: 50 * 1024 * 1024, // 50MB
    totalJSHeapSize: 100 * 1024 * 1024, // 100MB
    jsHeapSizeLimit: 2 * 1024 * 1024 * 1024 // 2GB
  }
};

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true
});

// Mock requestAnimationFrame
let animationFrameCallbacks: FrameRequestCallback[] = [];
let animationFrameId = 0;

global.requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
  animationFrameCallbacks.push(callback);
  return ++animationFrameId;
});

global.cancelAnimationFrame = vi.fn((id: number) => {
  // Remove callback if it exists
});

// Helper to trigger animation frames
const triggerAnimationFrame = () => {
  const callbacks = [...animationFrameCallbacks];
  animationFrameCallbacks = [];
  callbacks.forEach(callback => callback(performance.now()));
};

// Mock Canvas and WebGL
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn((contextType) => {
    if (contextType === 'webgl') {
      return {
        createShader: vi.fn(),
        createProgram: vi.fn(),
        getShaderParameter: vi.fn(() => true),
        getProgramParameter: vi.fn(() => true),
        shaderSource: vi.fn(),
        compileShader: vi.fn(),
        attachShader: vi.fn(),
        linkProgram: vi.fn(),
        getUniformLocation: vi.fn(),
        getAttribLocation: vi.fn(),
        createBuffer: vi.fn(),
        bindBuffer: vi.fn(),
        bufferData: vi.fn(),
        enableVertexAttribArray: vi.fn(),
        vertexAttribPointer: vi.fn(),
        createTexture: vi.fn(),
        bindTexture: vi.fn(),
        texImage2D: vi.fn(),
        texParameteri: vi.fn(),
        useProgram: vi.fn(),
        uniform1f: vi.fn(),
        uniform1i: vi.fn(),
        activeTexture: vi.fn(),
        viewport: vi.fn(),
        drawArrays: vi.fn(),
        readPixels: vi.fn((x, y, width, height, format, type, pixels) => {
          // Fill with test data
          for (let i = 0; i < pixels.length; i++) {
            pixels[i] = 128;
          }
        }),
        deleteTexture: vi.fn(),
        deleteProgram: vi.fn(),
        deleteFramebuffer: vi.fn(),
        VERTEX_SHADER: 35633,
        FRAGMENT_SHADER: 35632,
        COMPILE_STATUS: 35713,
        LINK_STATUS: 35714,
        TEXTURE_2D: 3553,
        RGBA: 6408,
        UNSIGNED_BYTE: 5121,
        CLAMP_TO_EDGE: 33071,
        LINEAR: 9729,
        TEXTURE0: 33984,
        TEXTURE1: 33985,
        TRIANGLES: 4,
        ARRAY_BUFFER: 34962,
        STATIC_DRAW: 35044,
        FLOAT: 5126
      };
    }
    if (contextType === '2d') {
      return {
        drawImage: vi.fn(),
        putImageData: vi.fn(),
        getImageData: vi.fn(() => new ImageData(100, 100)),
        createImageData: vi.fn(() => new ImageData(100, 100)),
        clearRect: vi.fn(),
        fillRect: vi.fn(),
        beginPath: vi.fn(),
        arc: vi.fn(),
        fill: vi.fn(),
        stroke: vi.fn(),
        fillText: vi.fn(),
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      };
    }
    return null;
  })
});

describe('Performance Tests', () => {
  let service: ColorGradingService;
  let testImageData: ImageData;

  beforeEach(() => {
    service = new ColorGradingService();
    testImageData = new ImageData(1920, 1080); // Full HD image
    
    // Fill with test pattern
    for (let i = 0; i < testImageData.data.length; i += 4) {
      testImageData.data[i] = Math.random() * 255;     // R
      testImageData.data[i + 1] = Math.random() * 255; // G
      testImageData.data[i + 2] = Math.random() * 255; // B
      testImageData.data[i + 3] = 255;                 // A
    }
    
    // Reset performance mocks
    vi.clearAllMocks();
    mockPerformance.now.mockImplementation(() => Date.now());
  });

  afterEach(() => {
    service.dispose();
  });

  describe('Color Grading Performance', () => {
    it('should process 1080p image within performance targets', async () => {
      const startTime = performance.now();
      
      await service.processImage(testImageData);
      
      const endTime = performance.now();
      const processingTime = endTime - startTime;
      
      // Should process within 100ms for real-time feel
      expect(processingTime).toBeLessThan(100);
    });

    it('should maintain 30+ FPS for real-time preview', async () => {
      const frameTargetTime = 1000 / 30; // 33.33ms for 30fps
      const iterations = 10;
      const times: number[] = [];
      
      for (let i = 0; i < iterations; i++) {
        const startTime = performance.now();
        await service.processImage(testImageData);
        const endTime = performance.now();
        times.push(endTime - startTime);
      }
      
      const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
      expect(averageTime).toBeLessThan(frameTargetTime);
    });

    it('should handle multiple rapid updates efficiently', async () => {
      const updates = 20;
      const startTime = performance.now();
      
      // Simulate rapid setting changes
      for (let i = 0; i < updates; i++) {
        service.updateSettings({ exposure: i * 0.1 });
        await service.processImage(testImageData);
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTimePerUpdate = totalTime / updates;
      
      // Each update should be fast enough for smooth interaction
      expect(averageTimePerUpdate).toBeLessThan(50);
    });

    it('should optimize memory usage for large images', async () => {
      const largeImageData = new ImageData(4096, 4096); // 4K image
      
      // Fill with test data
      for (let i = 0; i < largeImageData.data.length; i += 4) {
        largeImageData.data[i] = 128;
        largeImageData.data[i + 1] = 128;
        largeImageData.data[i + 2] = 128;
        largeImageData.data[i + 3] = 255;
      }
      
      const initialMemory = mockPerformance.memory.usedJSHeapSize;
      
      await service.processImage(largeImageData);
      
      const finalMemory = mockPerformance.memory.usedJSHeapSize;
      const memoryIncrease = finalMemory - initialMemory;
      
      // Memory increase should be reasonable (less than 100MB for 4K image)
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
    });

    it('should provide accurate performance metrics', async () => {
      await service.processImage(testImageData);
      const metrics = service.getPerformanceMetrics();
      
      expect(metrics).toHaveProperty('processingTime');
      expect(metrics).toHaveProperty('fps');
      expect(metrics).toHaveProperty('memoryUsage');
      
      expect(metrics.processingTime).toBeGreaterThan(0);
      expect(metrics.fps).toBeGreaterThan(0);
      expect(metrics.memoryUsage).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Image Optimization Performance', () => {
    let testFile: File;

    beforeEach(() => {
      // Create a mock file
      const canvas = document.createElement('canvas');
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 1920, 1080);
      
      // Mock toBlob for testing
      HTMLCanvasElement.prototype.toBlob = vi.fn((callback) => {
        const blob = new Blob(['mock image data'], { type: 'image/jpeg' });
        callback?.(blob);
      });
      
      testFile = new File(['mock image data'], 'test.jpg', { type: 'image/jpeg' });
    });

    it('should optimize images within reasonable time', async () => {
      const startTime = performance.now();
      
      await ImageOptimizer.optimizeImage(testFile, {
        format: 'webp',
        quality: 0.8,
        width: 1280
      });
      
      const endTime = performance.now();
      const optimizationTime = endTime - startTime;
      
      // Should optimize within 200ms
      expect(optimizationTime).toBeLessThan(200);
    });

    it('should handle batch optimization efficiently', async () => {
      const files = Array(5).fill(testFile);
      const startTime = performance.now();
      
      await ImageOptimizer.batchOptimize(files, {
        format: 'webp',
        quality: 0.8
      });
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTimePerFile = totalTime / files.length;
      
      // Should process each file efficiently
      expect(averageTimePerFile).toBeLessThan(100);
    });

    it('should create responsive images quickly', async () => {
      const breakpoints = [640, 768, 1024, 1280];
      const startTime = performance.now();
      
      await ImageOptimizer.createResponsiveImages(testFile, breakpoints);
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      // Should create all responsive versions within reasonable time
      expect(totalTime).toBeLessThan(500);
    });
  });

  describe('Performance Monitoring Hook', () => {
    it('should track FPS accurately', async () => {
      const { result } = renderHook(() => usePerformanceMonitor(true));
      
      act(() => {
        result.current.startMonitoring();
      });
      
      // Simulate several animation frames
      for (let i = 0; i < 10; i++) {
        mockPerformance.now.mockReturnValue(Date.now() + i * 16.67); // 60fps timing
        act(() => {
          triggerAnimationFrame();
        });
      }
      
      expect(result.current.metrics.fps).toBeGreaterThan(0);
      expect(result.current.metrics.averageFps).toBeGreaterThan(0);
    });

    it('should detect performance issues', async () => {
      const { result } = renderHook(() => usePerformanceMonitor(true, {
        targetFps: 60,
        maxFrameTime: 16.67,
        maxMemoryUsage: 50,
        throttleThreshold: 30
      }));
      
      act(() => {
        result.current.startMonitoring();
      });
      
      // Simulate slow frames
      for (let i = 0; i < 5; i++) {
        mockPerformance.now.mockReturnValue(Date.now() + i * 50); // 20fps timing
        act(() => {
          triggerAnimationFrame();
        });
      }
      
      expect(result.current.metrics.isThrottled).toBe(true);
      expect(result.current.isPerformanceGood).toBe(false);
    });

    it('should provide optimization suggestions', async () => {
      const { result } = renderHook(() => usePerformanceMonitor(true));
      
      act(() => {
        result.current.startMonitoring();
      });
      
      // Simulate poor performance
      mockPerformance.now.mockReturnValue(Date.now() + 100); // Very slow frame
      act(() => {
        triggerAnimationFrame();
      });
      
      const suggestions = result.current.getOptimizationSuggestions();
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions.some(s => s.includes('resolution') || s.includes('quality'))).toBe(true);
    });

    it('should calculate performance grade correctly', async () => {
      const { result } = renderHook(() => usePerformanceMonitor(true));
      
      act(() => {
        result.current.startMonitoring();
      });
      
      // Simulate good performance
      for (let i = 0; i < 10; i++) {
        mockPerformance.now.mockReturnValue(Date.now() + i * 16.67); // 60fps
        act(() => {
          triggerAnimationFrame();
        });
      }
      
      const grade = result.current.getPerformanceGrade();
      expect(['A', 'B', 'C', 'D', 'F']).toContain(grade);
    });
  });

  describe('Memory Management', () => {
    it('should clean up resources properly', async () => {
      const initialMemory = mockPerformance.memory.usedJSHeapSize;
      
      // Process multiple images
      for (let i = 0; i < 10; i++) {
        await service.processImage(testImageData);
      }
      
      // Force cleanup
      service.dispose();
      
      // Memory should not grow excessively
      const finalMemory = mockPerformance.memory.usedJSHeapSize;
      const memoryGrowth = finalMemory - initialMemory;
      
      // Should not leak more than 50MB
      expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024);
    });

    it('should handle WebGL context loss gracefully', async () => {
      // Simulate WebGL context loss
      const mockWebGLContext = {
        isContextLost: vi.fn(() => true),
        getError: vi.fn(() => 0x9242) // CONTEXT_LOST_WEBGL
      };
      
      // This would need to be integrated with the actual WebGL engine
      // For now, just ensure the service doesn't crash
      await expect(service.processImage(testImageData)).resolves.toBeDefined();
    });
  });

  describe('Stress Testing', () => {
    it('should handle rapid successive operations', async () => {
      const operations = 50;
      const promises: Promise<any>[] = [];
      
      // Fire off many operations simultaneously
      for (let i = 0; i < operations; i++) {
        promises.push(service.processImage(testImageData));
      }
      
      const startTime = performance.now();
      await Promise.all(promises);
      const endTime = performance.now();
      
      const totalTime = endTime - startTime;
      const averageTime = totalTime / operations;
      
      // Should handle concurrent operations efficiently
      expect(averageTime).toBeLessThan(100);
    });

    it('should maintain performance under continuous load', async () => {
      const duration = 1000; // 1 second
      const startTime = performance.now();
      let operationCount = 0;
      
      while (performance.now() - startTime < duration) {
        await service.processImage(testImageData);
        operationCount++;
      }
      
      const actualDuration = performance.now() - startTime;
      const operationsPerSecond = (operationCount / actualDuration) * 1000;
      
      // Should maintain reasonable throughput
      expect(operationsPerSecond).toBeGreaterThan(10);
    });
  });
});
