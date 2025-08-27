import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ColorGradingService } from '@/lib/color-grading/color-grading-service';
import { WebGLColorGradingEngine } from '@/lib/color-grading/webgl-engine';
import { CanvasColorGradingEngine } from '@/lib/color-grading/canvas-engine';
import { LUTLoader } from '@/lib/color-grading/lut-loader';
import { ImageOptimizer } from '@/lib/image-optimization';
import { ColorGradingSettings } from '@/types/color-grading';

// Mock WebGL context
const mockWebGLContext = {
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
  readPixels: vi.fn(),
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

// Mock HTMLCanvasElement
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn((contextType) => {
    if (contextType === 'webgl') {
      return mockWebGLContext;
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

describe('ColorGradingService', () => {
  let service: ColorGradingService;
  let testImageData: ImageData;

  beforeEach(() => {
    service = new ColorGradingService();
    testImageData = new ImageData(100, 100);
    
    // Fill with test pattern
    for (let i = 0; i < testImageData.data.length; i += 4) {
      testImageData.data[i] = 128;     // R
      testImageData.data[i + 1] = 128; // G
      testImageData.data[i + 2] = 128; // B
      testImageData.data[i + 3] = 255; // A
    }
  });

  afterEach(() => {
    service.dispose();
  });

  describe('Initialization', () => {
    it('should initialize with default settings', () => {
      const settings = service.getDefaultSettings();
      expect(settings.exposure).toBe(0);
      expect(settings.contrast).toBe(0);
      expect(settings.temperature).toBe(5500);
    });

    it('should detect WebGL support', () => {
      const supportsWebGL = service.supportsWebGL();
      expect(typeof supportsWebGL).toBe('boolean');
    });

    it('should load default presets', () => {
      const presets = service.getPresets();
      expect(presets.length).toBeGreaterThan(0);
      expect(presets[0]).toHaveProperty('name');
      expect(presets[0]).toHaveProperty('settings');
    });
  });

  describe('Image Processing', () => {
    it('should process image with default settings', async () => {
      const result = await service.processImage(testImageData);
      expect(result).toBeInstanceOf(ImageData);
      expect(result.width).toBe(testImageData.width);
      expect(result.height).toBe(testImageData.height);
    });

    it('should apply exposure adjustment', async () => {
      const settings = service.getDefaultSettings();
      settings.exposure = 1.0; // Increase exposure
      
      const result = await service.processImage(testImageData, settings);
      expect(result).toBeInstanceOf(ImageData);
    });

    it('should handle processing errors gracefully', async () => {
      const invalidImageData = new ImageData(0, 0);
      
      await expect(service.processImage(invalidImageData)).rejects.toThrow();
    });

    it('should provide performance metrics', async () => {
      await service.processImage(testImageData);
      const metrics = service.getPerformanceMetrics();
      
      expect(metrics).toHaveProperty('processingTime');
      expect(metrics).toHaveProperty('fps');
      expect(metrics.processingTime).toBeGreaterThan(0);
    });
  });

  describe('Settings Management', () => {
    it('should update settings correctly', () => {
      const newSettings = { exposure: 0.5, contrast: 0.3 };
      service.updateSettings(newSettings);
      
      const currentSettings = service.getCurrentSettings();
      expect(currentSettings.exposure).toBe(0.5);
      expect(currentSettings.contrast).toBe(0.3);
    });

    it('should maintain history for undo/redo', () => {
      const originalSettings = service.getCurrentSettings();
      
      service.updateSettings({ exposure: 1.0 });
      expect(service.canUndo()).toBe(true);
      
      const undoSettings = service.undo();
      expect(undoSettings?.exposure).toBe(originalSettings.exposure);
      
      expect(service.canRedo()).toBe(true);
      const redoSettings = service.redo();
      expect(redoSettings?.exposure).toBe(1.0);
    });

    it('should limit history size', () => {
      // Add more than max states
      for (let i = 0; i < 60; i++) {
        service.updateSettings({ exposure: i * 0.1 });
      }
      
      // Should still be able to undo
      expect(service.canUndo()).toBe(true);
    });
  });

  describe('Preset Management', () => {
    it('should save and load presets', () => {
      const testSettings = service.getDefaultSettings();
      testSettings.exposure = 0.8;
      testSettings.contrast = 0.5;
      
      service.updateSettings(testSettings);
      const preset = service.savePreset('Test Preset', 'Test description', 'custom');
      
      expect(preset.name).toBe('Test Preset');
      expect(preset.settings.exposure).toBe(0.8);
      
      // Reset settings
      service.updateSettings(service.getDefaultSettings());
      
      // Load preset
      const loaded = service.loadPreset(preset.id);
      expect(loaded).toBe(true);
      
      const currentSettings = service.getCurrentSettings();
      expect(currentSettings.exposure).toBe(0.8);
    });

    it('should delete presets', () => {
      const preset = service.savePreset('Test Delete', 'Test', 'custom');
      const initialCount = service.getPresets().length;
      
      const deleted = service.deletePreset(preset.id);
      expect(deleted).toBe(true);
      expect(service.getPresets().length).toBe(initialCount - 1);
    });
  });
});

describe('WebGLColorGradingEngine', () => {
  let engine: WebGLColorGradingEngine;
  let testImageData: ImageData;

  beforeEach(() => {
    engine = new WebGLColorGradingEngine();
    testImageData = new ImageData(100, 100);
  });

  afterEach(() => {
    engine.dispose();
  });

  it('should initialize WebGL context', () => {
    const supportsWebGL = engine.supportsWebGL();
    expect(typeof supportsWebGL).toBe('boolean');
  });

  it('should process image with WebGL', async () => {
    if (engine.supportsWebGL()) {
      const settings: ColorGradingSettings = {
        exposure: 0.5,
        contrast: 0.2,
        highlights: 0,
        shadows: 0,
        whites: 0,
        blacks: 0,
        temperature: 5500,
        tint: 0,
        vibrance: 0,
        saturation: 0,
        hue: 0,
        lightness: 0,
        toneCurve: {
          shadows: [{ x: 0, y: 0 }, { x: 0.25, y: 0.25 }],
          midtones: [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.75 }],
          highlights: [{ x: 0.75, y: 0.75 }, { x: 1, y: 1 }]
        },
        colorWheels: {
          shadows: { hue: 0, saturation: 0, luminance: 0 },
          midtones: { hue: 0, saturation: 0, luminance: 0 },
          highlights: { hue: 0, saturation: 0, luminance: 0 }
        },
        clarity: 0,
        dehaze: 0,
        vignette: { amount: 0, midpoint: 0.5, roundness: 1, feather: 0.5 },
        toneMapping: { algorithm: 'linear', exposure: 0, whitePoint: 11.2 }
      };

      const result = await engine.processImage(testImageData, settings);
      expect(result).toBeInstanceOf(ImageData);
    }
  });
});

describe('CanvasColorGradingEngine', () => {
  let engine: CanvasColorGradingEngine;
  let testImageData: ImageData;

  beforeEach(() => {
    engine = new CanvasColorGradingEngine();
    testImageData = new ImageData(100, 100);
  });

  it('should not support WebGL', () => {
    expect(engine.supportsWebGL()).toBe(false);
  });

  it('should process image with Canvas API', async () => {
    const settings: ColorGradingSettings = {
      exposure: 0.5,
      contrast: 0.2,
      highlights: 0,
      shadows: 0,
      whites: 0,
      blacks: 0,
      temperature: 5500,
      tint: 0,
      vibrance: 0,
      saturation: 0,
      hue: 0,
      lightness: 0,
      toneCurve: {
        shadows: [{ x: 0, y: 0 }, { x: 0.25, y: 0.25 }],
        midtones: [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.75 }],
        highlights: [{ x: 0.75, y: 0.75 }, { x: 1, y: 1 }]
      },
      colorWheels: {
        shadows: { hue: 0, saturation: 0, luminance: 0 },
        midtones: { hue: 0, saturation: 0, luminance: 0 },
        highlights: { hue: 0, saturation: 0, luminance: 0 }
      },
      clarity: 0,
      dehaze: 0,
      vignette: { amount: 0, midpoint: 0.5, roundness: 1, feather: 0.5 },
      toneMapping: { algorithm: 'linear', exposure: 0, whitePoint: 11.2 }
    };

    const result = await engine.processImage(testImageData, settings);
    expect(result).toBeInstanceOf(ImageData);
    expect(result.width).toBe(testImageData.width);
    expect(result.height).toBe(testImageData.height);
  });
});

describe('LUTLoader', () => {
  it('should validate LUT file formats', () => {
    const validFile = new File([''], 'test.cube', { type: 'text/plain' });
    const invalidFile = new File([''], 'test.txt', { type: 'text/plain' });
    
    expect(LUTLoader.validateLUTFile(validFile)).toBe(true);
    expect(LUTLoader.validateLUTFile(invalidFile)).toBe(false);
  });

  it('should parse CUBE format LUT', async () => {
    const cubeContent = `# Test LUT
LUT_3D_SIZE 2
0.0 0.0 0.0
0.5 0.0 0.0
0.0 0.5 0.0
0.5 0.5 0.0
0.0 0.0 0.5
0.5 0.0 0.5
0.0 0.5 0.5
1.0 1.0 1.0`;

    const file = new File([cubeContent], 'test.cube', { type: 'text/plain' });
    const lutData = await LUTLoader.loadLUT(file);
    
    expect(lutData.size).toBe(2);
    expect(lutData.format).toBe('cube');
    expect(lutData.data.length).toBe(24); // 2^3 * 3 channels
  });
});

describe('ImageOptimizer', () => {
  let testFile: File;

  beforeEach(() => {
    // Create a test image file
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 100, 100);
    
    canvas.toBlob((blob) => {
      testFile = new File([blob!], 'test.jpg', { type: 'image/jpeg' });
    });
  });

  it('should detect format support', async () => {
    const supportsWebP = await ImageOptimizer.supportsFormat('webp');
    expect(typeof supportsWebP).toBe('boolean');
  });

  it('should get best supported format', async () => {
    const bestFormat = await ImageOptimizer.getBestFormat();
    expect(['avif', 'webp', 'jpeg']).toContain(bestFormat);
  });
});
