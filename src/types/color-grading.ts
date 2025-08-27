// Color Grading System Types and Interfaces
export interface ColorGradingSettings {
  // Basic adjustments
  exposure: number;        // -2.0 to 2.0
  contrast: number;        // -1.0 to 1.0
  highlights: number;      // -1.0 to 1.0
  shadows: number;         // -1.0 to 1.0
  whites: number;          // -1.0 to 1.0
  blacks: number;          // -1.0 to 1.0
  
  // Color adjustments
  temperature: number;     // 2000K to 10000K
  tint: number;           // -100 to 100
  vibrance: number;       // -1.0 to 1.0
  saturation: number;     // -1.0 to 1.0
  
  // HSL adjustments
  hue: number;            // -180 to 180
  lightness: number;      // -1.0 to 1.0
  
  // Tone curve points (Bezier curve)
  toneCurve: {
    shadows: CurvePoint[];
    midtones: CurvePoint[];
    highlights: CurvePoint[];
  };
  
  // Color wheels (primary/secondary color correction)
  colorWheels: {
    shadows: ColorWheelSettings;
    midtones: ColorWheelSettings;
    highlights: ColorWheelSettings;
  };
  
  // Advanced settings
  clarity: number;        // -1.0 to 1.0 (local contrast)
  dehaze: number;         // -1.0 to 1.0
  vignette: VignetteSettings;
  
  // LUT settings
  lut?: LUTSettings;
  
  // Tone mapping
  toneMapping: ToneMappingSettings;
}

export interface CurvePoint {
  x: number; // 0.0 to 1.0
  y: number; // 0.0 to 1.0
}

export interface ColorWheelSettings {
  hue: number;        // -180 to 180
  saturation: number; // 0.0 to 2.0
  luminance: number;  // -1.0 to 1.0
}

export interface VignetteSettings {
  amount: number;     // -1.0 to 1.0
  midpoint: number;   // 0.0 to 1.0
  roundness: number;  // 0.0 to 1.0
  feather: number;    // 0.0 to 1.0
}

export interface LUTSettings {
  file?: File;
  intensity: number;  // 0.0 to 1.0
  format: 'cube' | '3dl' | 'lut';
}

export interface ToneMappingSettings {
  algorithm: 'reinhard' | 'aces' | 'uncharted2' | 'linear';
  exposure: number;   // -5.0 to 5.0
  whitePoint: number; // 1.0 to 20.0
}

// Color space definitions
export type ColorSpace = 'sRGB' | 'Adobe RGB' | 'Rec.2020' | 'P3';

export interface ColorSpaceSettings {
  input: ColorSpace;
  output: ColorSpace;
  gammaCorrection: boolean;
}

// Processing engine interfaces
export interface ColorGradingEngine {
  processImage(
    imageData: ImageData,
    settings: ColorGradingSettings,
    colorSpace?: ColorSpaceSettings
  ): Promise<ImageData>;
  
  supportsWebGL(): boolean;
  getPerformanceMetrics(): PerformanceMetrics;
}

export interface PerformanceMetrics {
  processingTime: number;  // milliseconds
  fps: number;
  memoryUsage: number;     // MB
  gpuUtilization?: number; // percentage
}

// Preset system
export interface ColorGradingPreset {
  id: string;
  name: string;
  description?: string;
  settings: ColorGradingSettings;
  thumbnail?: string;
  category: 'portrait' | 'landscape' | 'vintage' | 'cinematic' | 'custom';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// History system for undo/redo
export interface ColorGradingHistory {
  states: ColorGradingSettings[];
  currentIndex: number;
  maxStates: number;
}

// Export formats
export interface ExportSettings {
  format: 'jpeg' | 'png' | 'webp' | 'tiff';
  quality: number;        // 0.0 to 1.0
  colorSpace: ColorSpace;
  resolution: {
    width: number;
    height: number;
  };
  metadata: {
    preserveExif: boolean;
    addWatermark: boolean;
    watermarkText?: string;
  };
}

// Real-time preview settings
export interface PreviewSettings {
  enabled: boolean;
  quality: 'low' | 'medium' | 'high';
  updateThrottle: number; // milliseconds
  showBeforeAfter: boolean;
  splitPosition: number;  // 0.0 to 1.0 for split view
}

// Event system for real-time updates
export interface ColorGradingEvents {
  onSettingsChange: (settings: ColorGradingSettings) => void;
  onPreviewUpdate: (previewData: ImageData) => void;
  onProcessingStart: () => void;
  onProcessingComplete: (result: ImageData, metrics: PerformanceMetrics) => void;
  onError: (error: Error) => void;
}
