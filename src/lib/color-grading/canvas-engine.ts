import { 
  ColorGradingEngine, 
  ColorGradingSettings, 
  ColorSpaceSettings, 
  PerformanceMetrics 
} from '@/types/color-grading';

export class CanvasColorGradingEngine implements ColorGradingEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private performanceMetrics: PerformanceMetrics = {
    processingTime: 0,
    fps: 0,
    memoryUsage: 0
  };

  constructor() {
    this.canvas = document.createElement('canvas');
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('Canvas 2D context not available');
    }
    this.ctx = context;
  }

  public async processImage(
    imageData: ImageData,
    settings: ColorGradingSettings,
    colorSpace?: ColorSpaceSettings
  ): Promise<ImageData> {
    const startTime = performance.now();

    try {
      // Set canvas size
      this.canvas.width = imageData.width;
      this.canvas.height = imageData.height;

      // Create a copy of the image data to work with
      const processedData = new ImageData(
        new Uint8ClampedArray(imageData.data),
        imageData.width,
        imageData.height
      );

      // Process each pixel
      this.processPixels(processedData, settings);

      // Update performance metrics
      const endTime = performance.now();
      this.performanceMetrics.processingTime = endTime - startTime;
      this.performanceMetrics.fps = 1000 / this.performanceMetrics.processingTime;

      return processedData;
    } catch (error) {
      console.error('Canvas processing error:', error);
      throw error;
    }
  }

  private processPixels(imageData: ImageData, settings: ColorGradingSettings): void {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    for (let i = 0; i < data.length; i += 4) {
      // Get RGB values (0-255)
      let r = data[i] / 255;
      let g = data[i + 1] / 255;
      let b = data[i + 2] / 255;

      // Apply color grading transformations
      [r, g, b] = this.applyExposure([r, g, b], settings.exposure);
      [r, g, b] = this.applyContrast([r, g, b], settings.contrast);
      [r, g, b] = this.applyTemperatureTint([r, g, b], settings.temperature, settings.tint);
      [r, g, b] = this.applyHSL([r, g, b], settings.hue, settings.saturation, settings.lightness);
      [r, g, b] = this.applyShadowsHighlights([r, g, b], settings.shadows, settings.highlights);
      [r, g, b] = this.applyWhitesBlacks([r, g, b], settings.whites, settings.blacks);
      [r, g, b] = this.applyVibrance([r, g, b], settings.vibrance);
      
      // Apply vignette based on pixel position
      const x = (i / 4) % width;
      const y = Math.floor((i / 4) / width);
      [r, g, b] = this.applyVignette([r, g, b], x, y, width, height, settings.vignette);

      // Apply tone mapping
      [r, g, b] = this.applyToneMapping([r, g, b], settings.toneMapping);

      // Clamp and convert back to 0-255 range
      data[i] = Math.max(0, Math.min(255, Math.round(r * 255)));
      data[i + 1] = Math.max(0, Math.min(255, Math.round(g * 255)));
      data[i + 2] = Math.max(0, Math.min(255, Math.round(b * 255)));
      // Alpha channel remains unchanged
    }
  }

  private applyExposure(rgb: number[], exposure: number): number[] {
    const factor = Math.pow(2, exposure);
    return rgb.map(c => c * factor);
  }

  private applyContrast(rgb: number[], contrast: number): number[] {
    return rgb.map(c => (c - 0.5) * (1 + contrast) + 0.5);
  }

  private applyTemperatureTint(rgb: number[], temperature: number, tint: number): number[] {
    // Simplified temperature adjustment
    let [r, g, b] = rgb;
    
    // Temperature adjustment (simplified)
    if (temperature > 5500) {
      const factor = (temperature - 5500) / 4500;
      r *= 1 + factor * 0.3;
      b *= 1 - factor * 0.2;
    } else {
      const factor = (5500 - temperature) / 3500;
      r *= 1 - factor * 0.2;
      b *= 1 + factor * 0.3;
    }

    // Tint adjustment (green-magenta)
    const tintFactor = tint / 100;
    g += tintFactor * 0.1;
    r -= tintFactor * 0.05;
    b -= tintFactor * 0.05;

    return [r, g, b];
  }

  private rgbToHsl(r: number, g: number, b: number): number[] {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (delta !== 0) {
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
      
      switch (max) {
        case r:
          h = (g - b) / delta + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / delta + 2;
          break;
        case b:
          h = (r - g) / delta + 4;
          break;
      }
      h /= 6;
    }

    return [h, s, l];
  }

  private hslToRgb(h: number, s: number, l: number): number[] {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (h < 1/6) {
      [r, g, b] = [c, x, 0];
    } else if (h < 2/6) {
      [r, g, b] = [x, c, 0];
    } else if (h < 3/6) {
      [r, g, b] = [0, c, x];
    } else if (h < 4/6) {
      [r, g, b] = [0, x, c];
    } else if (h < 5/6) {
      [r, g, b] = [x, 0, c];
    } else {
      [r, g, b] = [c, 0, x];
    }

    return [r + m, g + m, b + m];
  }

  private applyHSL(rgb: number[], hue: number, saturation: number, lightness: number): number[] {
    const [r, g, b] = rgb;
    const [h, s, l] = this.rgbToHsl(r, g, b);

    const newH = (h + hue / 360) % 1;
    const newS = Math.max(0, Math.min(1, s * (1 + saturation)));
    const newL = Math.max(0, Math.min(1, l + lightness));

    return this.hslToRgb(newH, newS, newL);
  }

  private applyShadowsHighlights(rgb: number[], shadows: number, highlights: number): number[] {
    return rgb.map(c => {
      // Simple shadows/highlights adjustment
      if (c < 0.5) {
        // Shadows
        return c * (1 + shadows);
      } else {
        // Highlights
        return c + (1 - c) * highlights;
      }
    });
  }

  private applyWhitesBlacks(rgb: number[], whites: number, blacks: number): number[] {
    return rgb.map(c => {
      if (c > 0.8) {
        // Whites
        return c + (1 - c) * whites;
      } else if (c < 0.2) {
        // Blacks
        return c * (1 + blacks);
      }
      return c;
    });
  }

  private applyVibrance(rgb: number[], vibrance: number): number[] {
    const [r, g, b] = rgb;
    const max = Math.max(r, g, b);
    const avg = (r + g + b) / 3;
    const amount = (max - avg) * vibrance;
    
    return [
      r + (r - avg) * amount,
      g + (g - avg) * amount,
      b + (b - avg) * amount
    ];
  }

  private applyVignette(
    rgb: number[], 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    vignette: { amount: number; midpoint: number; roundness: number; feather: number }
  ): number[] {
    const centerX = width / 2;
    const centerY = height / 2;
    
    const dx = (x - centerX) / centerX;
    const dy = (y - centerY) / centerY * vignette.roundness;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    const vignetteFactor = Math.max(0, 1 - Math.pow(distance / vignette.midpoint, 2) * vignette.amount);
    
    return rgb.map(c => c * vignetteFactor);
  }

  private applyToneMapping(rgb: number[], toneMapping: { algorithm: string; exposure: number; whitePoint: number }): number[] {
    let [r, g, b] = rgb.map(c => c * Math.pow(2, toneMapping.exposure));

    switch (toneMapping.algorithm) {
      case 'reinhard':
        return [r, g, b].map(c => c / (1 + c / (toneMapping.whitePoint * toneMapping.whitePoint)));
      
      case 'aces':
        const a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
        return [r, g, b].map(color => 
          Math.max(0, Math.min(1, (color * (a * color + b)) / (color * (c * color + d) + e)))
        );
      
      case 'uncharted2':
        const A = 0.15, B = 0.50, C = 0.10, D = 0.20, E = 0.02, F = 0.30;
        const W = toneMapping.whitePoint;
        
        const uncharted2Tonemap = (x: number) => 
          ((x * (A * x + C * B) + D * E) / (x * (A * x + B) + D * F)) - E / F;
        
        const whiteScale = 1 / uncharted2Tonemap(W);
        return [r, g, b].map(c => uncharted2Tonemap(c) * whiteScale);
      
      default:
        return [r, g, b];
    }
  }

  public supportsWebGL(): boolean {
    return false;
  }

  public getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }
}
