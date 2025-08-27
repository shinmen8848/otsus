import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronDown, 
  ChevronUp, 
  Palette, 
  Sliders, 
  Wand2, 
  Settings, 
  Layers,
  Zap,
  Eye,
  Download,
  Upload,
  Save,
  RotateCcw
} from 'lucide-react';
import { ColorGradingSettings } from '@/types/color-grading';
import { BezierCurveEditor } from './BezierCurveEditor';
import { ColorWheel } from './ColorWheel';
import { BeforeAfterComparison } from './BeforeAfterComparison';

interface AdvancedColorGradingPanelProps {
  settings: ColorGradingSettings;
  onSettingsChange: (settings: Partial<ColorGradingSettings>) => void;
  beforeImage?: ImageData | string;
  afterImage?: ImageData | string;
  isProcessing?: boolean;
  performanceMetrics?: {
    fps: number;
    processingTime: number;
    memoryUsage: number;
  };
  className?: string;
}

export const AdvancedColorGradingPanel: React.FC<AdvancedColorGradingPanelProps> = ({
  settings,
  onSettingsChange,
  beforeImage,
  afterImage,
  isProcessing = false,
  performanceMetrics,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['exposure', 'color']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const CollapsibleSection: React.FC<{
    id: string;
    title: string;
    icon: React.ReactNode;
    badge?: string;
    children: React.ReactNode;
  }> = ({ id, title, icon, badge, children }) => {
    const isExpanded = expandedSections.has(id);

    return (
      <Collapsible open={isExpanded} onOpenChange={() => toggleSection(id)}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-3 h-auto hover:bg-muted/50"
          >
            <div className="flex items-center gap-2">
              {icon}
              <span className="font-elegant font-medium">{title}</span>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="px-3 pb-3"
          >
            {children}
          </motion.div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Performance Metrics */}
      {performanceMetrics && (
        <Card className="p-3 card-color-grading">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-primary" />
                <span className="text-metric">{Math.round(performanceMetrics.fps)} FPS</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-technical">Processing:</span>
                <span className="text-metric">{Math.round(performanceMetrics.processingTime)}ms</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-technical">Memory:</span>
                <span className="text-metric">{Math.round(performanceMetrics.memoryUsage)}MB</span>
              </div>
            </div>
            {isProcessing && (
              <Badge variant="secondary" className="animate-pulse">
                Processing...
              </Badge>
            )}
          </div>
        </Card>
      )}

      {/* Before/After Comparison */}
      {beforeImage && afterImage && (
        <BeforeAfterComparison
          beforeImage={beforeImage}
          afterImage={afterImage}
          className="mb-4"
        />
      )}

      {/* Main Controls */}
      <Card className="card-color-grading">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="p-4 border-b border-border/50">
            <TabsList className="grid w-full grid-cols-4 bg-muted/30">
              <TabsTrigger value="basic" className="text-xs">
                <Sliders className="w-3 h-3 mr-1" />
                Basic
              </TabsTrigger>
              <TabsTrigger value="color" className="text-xs">
                <Palette className="w-3 h-3 mr-1" />
                Color
              </TabsTrigger>
              <TabsTrigger value="curves" className="text-xs">
                <Layers className="w-3 h-3 mr-1" />
                Curves
              </TabsTrigger>
              <TabsTrigger value="advanced" className="text-xs">
                <Settings className="w-3 h-3 mr-1" />
                Advanced
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="p-4">
            <TabsContent value="basic" className="space-y-0 mt-0">
              <CollapsibleSection
                id="exposure"
                title="Exposure & Contrast"
                icon={<Eye className="w-4 h-4" />}
                badge="Basic"
              >
                <div className="space-y-4">
                  {/* Exposure controls would go here */}
                  <div className="text-sm text-muted-foreground">
                    Basic exposure and contrast controls
                  </div>
                </div>
              </CollapsibleSection>

              <Separator className="my-2" />

              <CollapsibleSection
                id="highlights"
                title="Highlights & Shadows"
                icon={<Layers className="w-4 h-4" />}
                badge="Tone"
              >
                <div className="space-y-4">
                  {/* Highlights/Shadows controls would go here */}
                  <div className="text-sm text-muted-foreground">
                    Highlight and shadow recovery controls
                  </div>
                </div>
              </CollapsibleSection>
            </TabsContent>

            <TabsContent value="color" className="space-y-0 mt-0">
              <CollapsibleSection
                id="color"
                title="Color Temperature & Tint"
                icon={<Palette className="w-4 h-4" />}
                badge="White Balance"
              >
                <div className="space-y-4">
                  {/* Temperature/Tint controls would go here */}
                  <div className="text-sm text-muted-foreground">
                    White balance and color temperature controls
                  </div>
                </div>
              </CollapsibleSection>

              <Separator className="my-2" />

              <CollapsibleSection
                id="colorwheels"
                title="Color Wheels"
                icon={<Wand2 className="w-4 h-4" />}
                badge="Professional"
              >
                <div className="grid gap-4">
                  <ColorWheel
                    settings={settings.colorWheels.shadows}
                    onChange={(newSettings) => 
                      onSettingsChange({
                        colorWheels: {
                          ...settings.colorWheels,
                          shadows: newSettings
                        }
                      })
                    }
                    title="Shadows"
                    size={150}
                  />
                  
                  <ColorWheel
                    settings={settings.colorWheels.midtones}
                    onChange={(newSettings) => 
                      onSettingsChange({
                        colorWheels: {
                          ...settings.colorWheels,
                          midtones: newSettings
                        }
                      })
                    }
                    title="Midtones"
                    size={150}
                  />
                  
                  <ColorWheel
                    settings={settings.colorWheels.highlights}
                    onChange={(newSettings) => 
                      onSettingsChange({
                        colorWheels: {
                          ...settings.colorWheels,
                          highlights: newSettings
                        }
                      })
                    }
                    title="Highlights"
                    size={150}
                  />
                </div>
              </CollapsibleSection>
            </TabsContent>

            <TabsContent value="curves" className="space-y-0 mt-0">
              <CollapsibleSection
                id="tonecurve"
                title="Tone Curves"
                icon={<Layers className="w-4 h-4" />}
                badge="Bezier"
              >
                <div className="space-y-4">
                  <BezierCurveEditor
                    points={settings.toneCurve.shadows}
                    onChange={(points) => 
                      onSettingsChange({
                        toneCurve: {
                          ...settings.toneCurve,
                          shadows: points
                        }
                      })
                    }
                    title="Shadows Curve"
                    color="#8B5CF6"
                  />
                  
                  <BezierCurveEditor
                    points={settings.toneCurve.midtones}
                    onChange={(points) => 
                      onSettingsChange({
                        toneCurve: {
                          ...settings.toneCurve,
                          midtones: points
                        }
                      })
                    }
                    title="Midtones Curve"
                    color="#EC4899"
                  />
                  
                  <BezierCurveEditor
                    points={settings.toneCurve.highlights}
                    onChange={(points) => 
                      onSettingsChange({
                        toneCurve: {
                          ...settings.toneCurve,
                          highlights: points
                        }
                      })
                    }
                    title="Highlights Curve"
                    color="#F59E0B"
                  />
                </div>
              </CollapsibleSection>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-0 mt-0">
              <CollapsibleSection
                id="tonemapping"
                title="Tone Mapping"
                icon={<Zap className="w-4 h-4" />}
                badge="HDR"
              >
                <div className="space-y-4">
                  {/* Tone mapping controls would go here */}
                  <div className="text-sm text-muted-foreground">
                    Advanced tone mapping algorithms
                  </div>
                </div>
              </CollapsibleSection>

              <Separator className="my-2" />

              <CollapsibleSection
                id="lut"
                title="LUT (Look-Up Table)"
                icon={<Upload className="w-4 h-4" />}
                badge="Professional"
              >
                <div className="space-y-4">
                  {/* LUT controls would go here */}
                  <div className="text-sm text-muted-foreground">
                    Load and apply professional LUTs
                  </div>
                </div>
              </CollapsibleSection>
            </TabsContent>
          </div>
        </Tabs>
      </Card>

      {/* Action Buttons */}
      <Card className="p-4 card-color-grading">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-1" />
              Save Preset
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-1" />
              Load LUT
            </Button>
            <Button size="sm" className="bg-gradient-color-grading text-white">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
