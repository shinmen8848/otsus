import { 
  ColorGradingEngine, 
  ColorGradingSettings, 
  ColorSpaceSettings, 
  PerformanceMetrics,
  ColorGradingPreset,
  ColorGradingHistory,
  ExportSettings,
  PreviewSettings,
  ColorGradingEvents
} from '@/types/color-grading';
import { WebGLColorGradingEngine } from './webgl-engine';
import { CanvasColorGradingEngine } from './canvas-engine';

export class ColorGradingService {
  private engine: ColorGradingEngine;
  private history: ColorGradingHistory;
  private presets: Map<string, ColorGradingPreset> = new Map();
  private events: Partial<ColorGradingEvents> = {};
  private previewSettings: PreviewSettings;
  private worker?: Worker;

  constructor() {
    // Initialize with WebGL engine, fallback to Canvas
    this.engine = this.createEngine();
    
    this.history = {
      states: [this.getDefaultSettings()],
      currentIndex: 0,
      maxStates: 50
    };

    this.previewSettings = {
      enabled: true,
      quality: 'medium',
      updateThrottle: 16, // 60fps
      showBeforeAfter: false,
      splitPosition: 0.5
    };

    this.loadDefaultPresets();
    this.initializeWorker();
  }

  private createEngine(): ColorGradingEngine {
    try {
      const webglEngine = new WebGLColorGradingEngine();
      if (webglEngine.supportsWebGL()) {
        console.log('Using WebGL color grading engine');
        return webglEngine;
      }
    } catch (error) {
      console.warn('WebGL engine failed to initialize:', error);
    }

    console.log('Using Canvas color grading engine');
    return new CanvasColorGradingEngine();
  }

  private initializeWorker(): void {
    try {
      // Create worker for heavy processing tasks
      const workerCode = `
        self.onmessage = function(e) {
          const { type, data } = e.data;
          
          switch (type) {
            case 'processImage':
              // Process image in worker thread
              // This would contain the Canvas processing logic
              // for better performance on the main thread
              break;
            
            case 'generatePreview':
              // Generate low-quality preview
              break;
          }
        };
      `;
      
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      this.worker = new Worker(URL.createObjectURL(blob));
    } catch (error) {
      console.warn('Web Worker not available:', error);
    }
  }

  public getDefaultSettings(): ColorGradingSettings {
    return {
      // Basic adjustments
      exposure: 0,
      contrast: 0,
      highlights: 0,
      shadows: 0,
      whites: 0,
      blacks: 0,
      
      // Color adjustments
      temperature: 5500,
      tint: 0,
      vibrance: 0,
      saturation: 0,
      
      // HSL adjustments
      hue: 0,
      lightness: 0,
      
      // Tone curve (default linear)
      toneCurve: {
        shadows: [{ x: 0, y: 0 }, { x: 0.25, y: 0.25 }],
        midtones: [{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.75 }],
        highlights: [{ x: 0.75, y: 0.75 }, { x: 1, y: 1 }]
      },
      
      // Color wheels (neutral)
      colorWheels: {
        shadows: { hue: 0, saturation: 0, luminance: 0 },
        midtones: { hue: 0, saturation: 0, luminance: 0 },
        highlights: { hue: 0, saturation: 0, luminance: 0 }
      },
      
      // Advanced settings
      clarity: 0,
      dehaze: 0,
      vignette: {
        amount: 0,
        midpoint: 0.5,
        roundness: 1,
        feather: 0.5
      },
      
      // Tone mapping
      toneMapping: {
        algorithm: 'linear',
        exposure: 0,
        whitePoint: 11.2
      }
    };
  }

  public async processImage(
    imageData: ImageData,
    settings?: ColorGradingSettings,
    colorSpace?: ColorSpaceSettings
  ): Promise<ImageData> {
    const currentSettings = settings || this.getCurrentSettings();
    const startTime = performance.now();

    try {
      this.events.onProcessingStart?.();

      // Use Web Worker for heavy processing if available
      const result = await this.processWithOptimization(imageData, currentSettings, colorSpace);

      const endTime = performance.now();
      const processingTime = endTime - startTime;

      // Enhanced performance metrics
      const metrics: PerformanceMetrics = {
        ...this.engine.getPerformanceMetrics(),
        processingTime,
        fps: processingTime > 0 ? 1000 / processingTime : 0
      };

      this.events.onProcessingComplete?.(result, metrics);

      return result;
    } catch (error) {
      this.events.onError?.(error as Error);
      throw error;
    }
  }

  private async processWithOptimization(
    imageData: ImageData,
    settings: ColorGradingSettings,
    colorSpace?: ColorSpaceSettings
  ): Promise<ImageData> {
    // For large images, use lower quality preview for real-time updates
    const isLargeImage = imageData.width * imageData.height > 1920 * 1080;

    if (isLargeImage && this.previewSettings.enabled && this.previewSettings.quality !== 'high') {
      // Create downscaled version for preview
      const scale = this.previewSettings.quality === 'low' ? 0.25 : 0.5;
      const previewImageData = this.downscaleImageData(imageData, scale);
      const previewResult = await this.engine.processImage(previewImageData, settings, colorSpace);

      // Upscale result back to original size
      return this.upscaleImageData(previewResult, imageData.width, imageData.height);
    }

    return this.engine.processImage(imageData, settings, colorSpace);
  }

  private downscaleImageData(imageData: ImageData, scale: number): ImageData {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    const newWidth = Math.floor(imageData.width * scale);
    const newHeight = Math.floor(imageData.height * scale);

    canvas.width = newWidth;
    canvas.height = newHeight;

    // Create temporary canvas for source image
    const sourceCanvas = document.createElement('canvas');
    const sourceCtx = sourceCanvas.getContext('2d');
    if (!sourceCtx) throw new Error('Canvas context not available');

    sourceCanvas.width = imageData.width;
    sourceCanvas.height = imageData.height;
    sourceCtx.putImageData(imageData, 0, 0);

    // Draw scaled image
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sourceCanvas, 0, 0, newWidth, newHeight);

    return ctx.getImageData(0, 0, newWidth, newHeight);
  }

  private upscaleImageData(imageData: ImageData, targetWidth: number, targetHeight: number): ImageData {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not available');

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Create temporary canvas for source image
    const sourceCanvas = document.createElement('canvas');
    const sourceCtx = sourceCanvas.getContext('2d');
    if (!sourceCtx) throw new Error('Canvas context not available');

    sourceCanvas.width = imageData.width;
    sourceCanvas.height = imageData.height;
    sourceCtx.putImageData(imageData, 0, 0);

    // Draw upscaled image
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sourceCanvas, 0, 0, targetWidth, targetHeight);

    return ctx.getImageData(0, 0, targetWidth, targetHeight);
  }

  public updateSettings(newSettings: Partial<ColorGradingSettings>): void {
    const currentSettings = this.getCurrentSettings();
    const updatedSettings = { ...currentSettings, ...newSettings };
    
    // Add to history
    this.addToHistory(updatedSettings);
    
    // Trigger events
    this.events.onSettingsChange?.(updatedSettings);
  }

  private addToHistory(settings: ColorGradingSettings): void {
    // Remove any states after current index
    this.history.states = this.history.states.slice(0, this.history.currentIndex + 1);
    
    // Add new state
    this.history.states.push(settings);
    this.history.currentIndex = this.history.states.length - 1;
    
    // Limit history size
    if (this.history.states.length > this.history.maxStates) {
      this.history.states.shift();
      this.history.currentIndex--;
    }
  }

  public undo(): ColorGradingSettings | null {
    if (this.history.currentIndex > 0) {
      this.history.currentIndex--;
      const settings = this.getCurrentSettings();
      this.events.onSettingsChange?.(settings);
      return settings;
    }
    return null;
  }

  public redo(): ColorGradingSettings | null {
    if (this.history.currentIndex < this.history.states.length - 1) {
      this.history.currentIndex++;
      const settings = this.getCurrentSettings();
      this.events.onSettingsChange?.(settings);
      return settings;
    }
    return null;
  }

  public getCurrentSettings(): ColorGradingSettings {
    return this.history.states[this.history.currentIndex];
  }

  public canUndo(): boolean {
    return this.history.currentIndex > 0;
  }

  public canRedo(): boolean {
    return this.history.currentIndex < this.history.states.length - 1;
  }

  public savePreset(name: string, description?: string, category: ColorGradingPreset['category'] = 'custom'): ColorGradingPreset {
    const preset: ColorGradingPreset = {
      id: crypto.randomUUID(),
      name,
      description,
      settings: this.getCurrentSettings(),
      category,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.presets.set(preset.id, preset);
    return preset;
  }

  public loadPreset(presetId: string): boolean {
    const preset = this.presets.get(presetId);
    if (preset) {
      this.updateSettings(preset.settings);
      return true;
    }
    return false;
  }

  public getPresets(): ColorGradingPreset[] {
    return Array.from(this.presets.values());
  }

  public deletePreset(presetId: string): boolean {
    return this.presets.delete(presetId);
  }

  public addEventListener(event: keyof ColorGradingEvents, callback: any): void {
    this.events[event] = callback;
  }

  public removeEventListener(event: keyof ColorGradingEvents): void {
    delete this.events[event];
  }

  public getPerformanceMetrics(): PerformanceMetrics {
    return this.engine.getPerformanceMetrics();
  }

  public supportsWebGL(): boolean {
    return this.engine.supportsWebGL();
  }

  private loadDefaultPresets(): void {
    // Add some default presets
    const presets = [
      {
        name: 'Romantic Warm',
        description: 'Warm, soft tones perfect for romantic photos',
        category: 'portrait' as const,
        settings: {
          ...this.getDefaultSettings(),
          temperature: 6200,
          tint: 5,
          exposure: 0.2,
          shadows: 0.3,
          highlights: -0.2,
          saturation: 0.1,
          vibrance: 0.2
        }
      },
      {
        name: 'Dreamy Soft',
        description: 'Ethereal, dreamy look with lifted shadows',
        category: 'portrait' as const,
        settings: {
          ...this.getDefaultSettings(),
          exposure: 0.3,
          shadows: 0.5,
          highlights: -0.3,
          contrast: -0.2,
          clarity: -0.3,
          saturation: -0.1
        }
      }
    ];

    presets.forEach(preset => {
      const fullPreset: ColorGradingPreset = {
        id: crypto.randomUUID(),
        ...preset,
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.presets.set(fullPreset.id, fullPreset);
    });
  }

  public dispose(): void {
    if (this.worker) {
      this.worker.terminate();
    }
    if ('dispose' in this.engine) {
      (this.engine as any).dispose();
    }
  }
}
