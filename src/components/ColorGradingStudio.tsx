import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  Download, 
  Undo, 
  Redo, 
  Save, 
  Palette, 
  Sliders, 
  Sun, 
  Contrast,
  Lightbulb,
  Eye,
  Settings,
  Zap,
  Sparkles
} from 'lucide-react';
import { ColorGradingService } from '@/lib/color-grading/color-grading-service';
import { ColorGradingSettings, PerformanceMetrics } from '@/types/color-grading';

interface ColorGradingStudioProps {
  initialImage?: string;
  onImageProcessed?: (processedImageData: ImageData) => void;
  className?: string;
}

export const ColorGradingStudio: React.FC<ColorGradingStudioProps> = ({
  initialImage,
  onImageProcessed,
  className = ''
}) => {
  // State management
  const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
  const [processedImage, setProcessedImage] = useState<ImageData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [settings, setSettings] = useState<ColorGradingSettings | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [splitPosition, setSplitPosition] = useState(50);
  const [activeTab, setActiveTab] = useState('basic');

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorGradingService = useRef<ColorGradingService | null>(null);

  // Initialize color grading service
  useEffect(() => {
    colorGradingService.current = new ColorGradingService();
    
    // Set up event listeners
    colorGradingService.current.addEventListener('onSettingsChange', (newSettings: ColorGradingSettings) => {
      setSettings(newSettings);
      if (originalImage) {
        processImageWithSettings(newSettings);
      }
    });

    colorGradingService.current.addEventListener('onProcessingStart', () => {
      setIsProcessing(true);
    });

    colorGradingService.current.addEventListener('onProcessingComplete', (result: ImageData, metrics: PerformanceMetrics) => {
      setProcessedImage(result);
      setPerformanceMetrics(metrics);
      setIsProcessing(false);
      onImageProcessed?.(result);
    });

    colorGradingService.current.addEventListener('onError', (error: Error) => {
      console.error('Color grading error:', error);
      setIsProcessing(false);
    });

    // Initialize with default settings
    setSettings(colorGradingService.current.getDefaultSettings());

    return () => {
      colorGradingService.current?.dispose();
    };
  }, []);

  // Load initial image
  useEffect(() => {
    if (initialImage) {
      loadImageFromUrl(initialImage);
    }
  }, [initialImage]);

  const loadImageFromUrl = async (url: string) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        setOriginalImage(imageData);
        setProcessedImage(imageData);
        
        // Update canvas display
        updateCanvasDisplay(imageData);
      };
      img.src = url;
    } catch (error) {
      console.error('Failed to load image:', error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      loadImageFromUrl(url);
    };
    reader.readAsDataURL(file);
  };

  const processImageWithSettings = useCallback(async (newSettings: ColorGradingSettings) => {
    if (!originalImage || !colorGradingService.current) return;

    try {
      const result = await colorGradingService.current.processImage(originalImage, newSettings);
      updateCanvasDisplay(showBeforeAfter ? originalImage : result);
    } catch (error) {
      console.error('Image processing failed:', error);
    }
  }, [originalImage, showBeforeAfter]);

  const updateCanvasDisplay = (imageData: ImageData) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);
  };

  const handleSettingChange = (key: keyof ColorGradingSettings, value: any) => {
    if (!colorGradingService.current || !settings) return;

    const newSettings = { ...settings, [key]: value };
    colorGradingService.current.updateSettings({ [key]: value });
  };

  const handleUndo = () => {
    colorGradingService.current?.undo();
  };

  const handleRedo = () => {
    colorGradingService.current?.redo();
  };

  const handleReset = () => {
    if (!colorGradingService.current) return;
    const defaultSettings = colorGradingService.current.getDefaultSettings();
    colorGradingService.current.updateSettings(defaultSettings);
  };

  const toggleBeforeAfter = () => {
    setShowBeforeAfter(!showBeforeAfter);
    if (originalImage && processedImage) {
      updateCanvasDisplay(showBeforeAfter ? processedImage : originalImage);
    }
  };

  const canUndo = colorGradingService.current?.canUndo() ?? false;
  const canRedo = colorGradingService.current?.canRedo() ?? false;
  const supportsWebGL = colorGradingService.current?.supportsWebGL() ?? false;

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-2 animate-spin text-primary" />
          <p className="text-muted-foreground">Initializing Color Grading Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`color-grading-studio ${className}`}>
      {/* Header */}
      <Card className="p-4 mb-4 card-romantic-3d">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Palette className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-elegant font-bold text-title-3d">
                Color Grading Studio
              </h2>
            </div>
            
            {supportsWebGL && (
              <Badge variant="secondary" className="bg-gradient-3d-primary text-white">
                <Zap className="w-3 h-3 mr-1" />
                WebGL Accelerated
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Performance metrics */}
            {performanceMetrics && (
              <Badge variant="outline" className="text-xs">
                {Math.round(performanceMetrics.fps)} FPS • {Math.round(performanceMetrics.processingTime)}ms
              </Badge>
            )}

            {/* Action buttons */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={!canUndo || isProcessing}
            >
              <Undo className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRedo}
              disabled={!canRedo || isProcessing}
            >
              <Redo className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleBeforeAfter}
              disabled={!originalImage || isProcessing}
            >
              <Eye className="w-4 h-4 mr-1" />
              {showBeforeAfter ? 'After' : 'Before'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-1" />
              Upload
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Image Preview */}
        <div className="lg:col-span-2">
          <Card className="p-4 card-romantic-3d">
            <div className="relative bg-gradient-3d-background rounded-lg overflow-hidden">
              {originalImage ? (
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto rounded-lg shadow-3d-soft"
                    style={{ maxHeight: '600px' }}
                  />
                  
                  {isProcessing && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 flex items-center gap-3">
                        <Sparkles className="w-5 h-5 animate-spin text-primary" />
                        <span className="font-elegant">Processing...</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className="h-96 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-elegant font-semibold text-lg mb-2">Upload an Image</h3>
                    <p className="text-muted-foreground">
                      Drag & drop or click to select an image to start color grading
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Controls Panel */}
        <div className="space-y-4">
          <Card className="p-4 card-romantic-3d">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic" className="text-xs">
                  <Sliders className="w-3 h-3 mr-1" />
                  Basic
                </TabsTrigger>
                <TabsTrigger value="color" className="text-xs">
                  <Palette className="w-3 h-3 mr-1" />
                  Color
                </TabsTrigger>
                <TabsTrigger value="advanced" className="text-xs">
                  <Settings className="w-3 h-3 mr-1" />
                  Advanced
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                {/* Exposure */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-elegant text-sm">Exposure</Label>
                    <span className="text-xs text-muted-foreground">{settings.exposure.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[settings.exposure]}
                    onValueChange={([value]) => handleSettingChange('exposure', value)}
                    min={-2}
                    max={2}
                    step={0.01}
                    className="slider-romantic"
                  />
                </div>

                {/* Contrast */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-elegant text-sm">Contrast</Label>
                    <span className="text-xs text-muted-foreground">{settings.contrast.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[settings.contrast]}
                    onValueChange={([value]) => handleSettingChange('contrast', value)}
                    min={-1}
                    max={1}
                    step={0.01}
                    className="slider-romantic"
                  />
                </div>

                {/* Highlights */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-elegant text-sm">Highlights</Label>
                    <span className="text-xs text-muted-foreground">{settings.highlights.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[settings.highlights]}
                    onValueChange={([value]) => handleSettingChange('highlights', value)}
                    min={-1}
                    max={1}
                    step={0.01}
                    className="slider-romantic"
                  />
                </div>

                {/* Shadows */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-elegant text-sm">Shadows</Label>
                    <span className="text-xs text-muted-foreground">{settings.shadows.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[settings.shadows]}
                    onValueChange={([value]) => handleSettingChange('shadows', value)}
                    min={-1}
                    max={1}
                    step={0.01}
                    className="slider-romantic"
                  />
                </div>

                {/* Whites */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-elegant text-sm">Whites</Label>
                    <span className="text-xs text-muted-foreground">{settings.whites.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[settings.whites]}
                    onValueChange={([value]) => handleSettingChange('whites', value)}
                    min={-1}
                    max={1}
                    step={0.01}
                    className="slider-romantic"
                  />
                </div>

                {/* Blacks */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-elegant text-sm">Blacks</Label>
                    <span className="text-xs text-muted-foreground">{settings.blacks.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[settings.blacks]}
                    onValueChange={([value]) => handleSettingChange('blacks', value)}
                    min={-1}
                    max={1}
                    step={0.01}
                    className="slider-romantic"
                  />
                </div>
              </TabsContent>

              <TabsContent value="color" className="space-y-4 mt-4">
                {/* Temperature */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-elegant text-sm">Temperature</Label>
                    <span className="text-xs text-muted-foreground">{Math.round(settings.temperature)}K</span>
                  </div>
                  <Slider
                    value={[settings.temperature]}
                    onValueChange={([value]) => handleSettingChange('temperature', value)}
                    min={2000}
                    max={10000}
                    step={50}
                    className="slider-romantic"
                  />
                </div>

                {/* Tint */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-elegant text-sm">Tint</Label>
                    <span className="text-xs text-muted-foreground">{settings.tint.toFixed(0)}</span>
                  </div>
                  <Slider
                    value={[settings.tint]}
                    onValueChange={([value]) => handleSettingChange('tint', value)}
                    min={-100}
                    max={100}
                    step={1}
                    className="slider-romantic"
                  />
                </div>

                {/* Vibrance */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-elegant text-sm">Vibrance</Label>
                    <span className="text-xs text-muted-foreground">{settings.vibrance.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[settings.vibrance]}
                    onValueChange={([value]) => handleSettingChange('vibrance', value)}
                    min={-1}
                    max={1}
                    step={0.01}
                    className="slider-romantic"
                  />
                </div>

                {/* Saturation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-elegant text-sm">Saturation</Label>
                    <span className="text-xs text-muted-foreground">{settings.saturation.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[settings.saturation]}
                    onValueChange={([value]) => handleSettingChange('saturation', value)}
                    min={-1}
                    max={1}
                    step={0.01}
                    className="slider-romantic"
                  />
                </div>

                {/* Hue */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-elegant text-sm">Hue</Label>
                    <span className="text-xs text-muted-foreground">{settings.hue.toFixed(0)}°</span>
                  </div>
                  <Slider
                    value={[settings.hue]}
                    onValueChange={([value]) => handleSettingChange('hue', value)}
                    min={-180}
                    max={180}
                    step={1}
                    className="slider-romantic"
                  />
                </div>

                {/* Lightness */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-elegant text-sm">Lightness</Label>
                    <span className="text-xs text-muted-foreground">{settings.lightness.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[settings.lightness]}
                    onValueChange={([value]) => handleSettingChange('lightness', value)}
                    min={-1}
                    max={1}
                    step={0.01}
                    className="slider-romantic"
                  />
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4 mt-4">
                {/* Clarity */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-elegant text-sm">Clarity</Label>
                    <span className="text-xs text-muted-foreground">{settings.clarity.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[settings.clarity]}
                    onValueChange={([value]) => handleSettingChange('clarity', value)}
                    min={-1}
                    max={1}
                    step={0.01}
                    className="slider-romantic"
                  />
                </div>

                {/* Dehaze */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-elegant text-sm">Dehaze</Label>
                    <span className="text-xs text-muted-foreground">{settings.dehaze.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[settings.dehaze]}
                    onValueChange={([value]) => handleSettingChange('dehaze', value)}
                    min={-1}
                    max={1}
                    step={0.01}
                    className="slider-romantic"
                  />
                </div>

                {/* Vignette Amount */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-elegant text-sm">Vignette</Label>
                    <span className="text-xs text-muted-foreground">{settings.vignette.amount.toFixed(2)}</span>
                  </div>
                  <Slider
                    value={[settings.vignette.amount]}
                    onValueChange={([value]) => handleSettingChange('vignette', { ...settings.vignette, amount: value })}
                    min={-1}
                    max={1}
                    step={0.01}
                    className="slider-romantic"
                  />
                </div>

                {/* Reset Button */}
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full mt-6"
                  disabled={isProcessing}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Reset All
                </Button>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};
