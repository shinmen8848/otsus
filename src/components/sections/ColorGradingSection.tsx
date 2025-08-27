import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Palette, 
  Upload, 
  Download, 
  Sparkles, 
  Zap, 
  Settings,
  Eye,
  Camera,
  Wand2
} from 'lucide-react';
import { ColorGradingStudio } from '@/components/ColorGradingStudio';
import { AdvancedColorGradingPanel } from '@/components/AdvancedColorGradingPanel';
import { PresetManager } from '@/components/PresetManager';
import { ColorGradingService } from '@/lib/color-grading/color-grading-service';
import { ColorGradingSettings, ColorGradingPreset, PerformanceMetrics } from '@/types/color-grading';

export const ColorGradingSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('studio');
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);
  const [processedImage, setProcessedImage] = useState<ImageData | null>(null);
  const [settings, setSettings] = useState<ColorGradingSettings | null>(null);
  const [presets, setPresets] = useState<ColorGradingPreset[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const colorGradingService = useRef<ColorGradingService | null>(null);

  // Initialize color grading service
  useEffect(() => {
    colorGradingService.current = new ColorGradingService();
    
    // Set up event listeners
    colorGradingService.current.addEventListener('onSettingsChange', (newSettings: ColorGradingSettings) => {
      setSettings(newSettings);
    });

    colorGradingService.current.addEventListener('onProcessingStart', () => {
      setIsProcessing(true);
    });

    colorGradingService.current.addEventListener('onProcessingComplete', (result: ImageData, metrics: PerformanceMetrics) => {
      setProcessedImage(result);
      setPerformanceMetrics(metrics);
      setIsProcessing(false);
    });

    colorGradingService.current.addEventListener('onError', (error: Error) => {
      console.error('Color grading error:', error);
      setIsProcessing(false);
    });

    // Initialize with default settings and presets
    setSettings(colorGradingService.current.getDefaultSettings());
    setPresets(colorGradingService.current.getPresets());

    return () => {
      colorGradingService.current?.dispose();
    };
  }, []);

  const handleImageProcessed = (imageData: ImageData) => {
    setProcessedImage(imageData);
  };

  const handleSettingsChange = (newSettings: Partial<ColorGradingSettings>) => {
    if (colorGradingService.current) {
      colorGradingService.current.updateSettings(newSettings);
    }
  };

  const handleLoadPreset = (preset: ColorGradingPreset) => {
    if (colorGradingService.current) {
      colorGradingService.current.loadPreset(preset.id);
    }
  };

  const handleSavePreset = (name: string, description?: string, category?: ColorGradingPreset['category']) => {
    if (colorGradingService.current) {
      const newPreset = colorGradingService.current.savePreset(name, description, category);
      setPresets(colorGradingService.current.getPresets());
    }
  };

  const handleDeletePreset = (presetId: string) => {
    if (colorGradingService.current) {
      colorGradingService.current.deletePreset(presetId);
      setPresets(colorGradingService.current.getPresets());
    }
  };

  const handleExportPreset = (preset: ColorGradingPreset) => {
    // Export functionality is handled in PresetManager
    console.log('Exporting preset:', preset.name);
  };

  const handleImportPreset = async (file: File) => {
    try {
      const text = await file.text();
      const preset: ColorGradingPreset = JSON.parse(text);
      
      // Validate preset structure
      if (preset.settings && preset.name) {
        // Add imported preset
        if (colorGradingService.current) {
          const newPreset = colorGradingService.current.savePreset(
            `${preset.name} (Imported)`,
            preset.description,
            preset.category
          );
          setPresets(colorGradingService.current.getPresets());
        }
      }
    } catch (error) {
      console.error('Failed to import preset:', error);
    }
  };

  const supportsWebGL = colorGradingService.current?.supportsWebGL() ?? false;

  return (
    <section className="min-h-screen py-12 px-4 bg-gradient-to-br from-background via-muted/10 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-color-grading rounded-full">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-elegant font-bold bg-gradient-color-grading bg-clip-text text-transparent">
              Professional Color Grading Studio
            </h1>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
            Transform your photos with professional-grade color grading tools. 
            Advanced tone mapping, color wheels, Bezier curves, and LUT support powered by WebGL acceleration.
          </p>

          <div className="flex items-center justify-center gap-4">
            {supportsWebGL && (
              <Badge className="bg-gradient-professional text-white">
                <Zap className="w-3 h-3 mr-1" />
                WebGL Accelerated
              </Badge>
            )}
            <Badge variant="outline">
              <Sparkles className="w-3 h-3 mr-1" />
              Real-time Preview
            </Badge>
            <Badge variant="outline">
              <Camera className="w-3 h-3 mr-1" />
              Professional Tools
            </Badge>
          </div>
        </motion.div>

        {/* Main Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="card-color-grading overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="p-6 border-b border-border/50">
                <TabsList className="grid w-full grid-cols-3 bg-muted/30">
                  <TabsTrigger value="studio" className="flex items-center gap-2">
                    <Wand2 className="w-4 h-4" />
                    Color Grading Studio
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Advanced Controls
                  </TabsTrigger>
                  <TabsTrigger value="presets" className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Preset Manager
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="studio" className="mt-0">
                  <ColorGradingStudio
                    onImageProcessed={handleImageProcessed}
                    className="w-full"
                  />
                </TabsContent>

                <TabsContent value="advanced" className="mt-0">
                  {settings && (
                    <AdvancedColorGradingPanel
                      settings={settings}
                      onSettingsChange={handleSettingsChange}
                      beforeImage={currentImage || undefined}
                      afterImage={processedImage || undefined}
                      isProcessing={isProcessing}
                      performanceMetrics={performanceMetrics || undefined}
                    />
                  )}
                </TabsContent>

                <TabsContent value="presets" className="mt-0">
                  {settings && (
                    <PresetManager
                      presets={presets}
                      currentSettings={settings}
                      onLoadPreset={handleLoadPreset}
                      onSavePreset={handleSavePreset}
                      onDeletePreset={handleDeletePreset}
                      onExportPreset={handleExportPreset}
                      onImportPreset={handleImportPreset}
                    />
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12"
        >
          {[
            {
              icon: <Zap className="w-6 h-6" />,
              title: 'WebGL Acceleration',
              description: 'Real-time processing at 60fps with GPU acceleration'
            },
            {
              icon: <Palette className="w-6 h-6" />,
              title: 'Professional Tools',
              description: 'Color wheels, tone curves, and advanced adjustments'
            },
            {
              icon: <Upload className="w-6 h-6" />,
              title: 'LUT Support',
              description: 'Import .cube, .3dl, and .lut files for cinematic looks'
            },
            {
              icon: <Eye className="w-6 h-6" />,
              title: 'Before/After',
              description: 'Real-time comparison with split-view preview'
            }
          ].map((feature, index) => (
            <Card key={index} className="p-6 card-color-grading text-center">
              <div className="w-12 h-12 bg-gradient-color-grading rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                {feature.icon}
              </div>
              <h3 className="font-elegant font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </motion.div>

        {/* Performance Info */}
        {performanceMetrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8"
          >
            <Card className="p-4 card-color-grading">
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="text-metric">{Math.round(performanceMetrics.fps)} FPS</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-technical">Processing Time:</span>
                  <span className="text-metric">{Math.round(performanceMetrics.processingTime)}ms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-technical">Memory Usage:</span>
                  <span className="text-metric">{Math.round(performanceMetrics.memoryUsage)}MB</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
};
