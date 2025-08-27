import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  Move, 
  RotateCw, 
  Download,
  Maximize2,
  SplitSquareHorizontal
} from 'lucide-react';

interface BeforeAfterComparisonProps {
  beforeImage: ImageData | string;
  afterImage: ImageData | string;
  splitPosition?: number;
  onSplitPositionChange?: (position: number) => void;
  showLabels?: boolean;
  className?: string;
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
  beforeImage,
  afterImage,
  splitPosition = 50,
  onSplitPositionChange,
  showLabels = true,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [currentSplit, setCurrentSplit] = useState(splitPosition);
  const [viewMode, setViewMode] = useState<'split' | 'before' | 'after'>('split');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const beforeCanvasRef = useRef<HTMLCanvasElement>(null);
  const afterCanvasRef = useRef<HTMLCanvasElement>(null);

  // Update canvas when images change
  useEffect(() => {
    updateCanvas(beforeCanvasRef.current, beforeImage);
  }, [beforeImage]);

  useEffect(() => {
    updateCanvas(afterCanvasRef.current, afterImage);
  }, [afterImage]);

  const updateCanvas = (canvas: HTMLCanvasElement | null, image: ImageData | string) => {
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (image instanceof ImageData) {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.putImageData(image, 0, 0);
    } else if (typeof image === 'string') {
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
      img.src = image;
    }
  };

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (viewMode !== 'split') return;
    setIsDragging(true);
    event.preventDefault();
  }, [viewMode]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const newPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
    
    setCurrentSplit(newPosition);
    onSplitPositionChange?.(newPosition);
  }, [isDragging, onSplitPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const toggleViewMode = () => {
    const modes: Array<'split' | 'before' | 'after'> = ['split', 'before', 'after'];
    const currentIndex = modes.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setViewMode(modes[nextIndex]);
  };

  const downloadComparison = async () => {
    if (!beforeCanvasRef.current || !afterCanvasRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const beforeCanvas = beforeCanvasRef.current;
    const afterCanvas = afterCanvasRef.current;

    // Create side-by-side comparison
    canvas.width = beforeCanvas.width + afterCanvas.width + 20; // 20px gap
    canvas.height = Math.max(beforeCanvas.height, afterCanvas.height);

    // Fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw before image
    ctx.drawImage(beforeCanvas, 0, 0);

    // Draw after image
    ctx.drawImage(afterCanvas, beforeCanvas.width + 20, 0);

    // Add labels
    if (showLabels) {
      ctx.fillStyle = '#000000';
      ctx.font = '16px Arial';
      ctx.fillText('Before', 10, 25);
      ctx.fillText('After', beforeCanvas.width + 30, 25);
    }

    // Download
    const link = document.createElement('a');
    link.download = 'before-after-comparison.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const getViewModeIcon = () => {
    switch (viewMode) {
      case 'before': return <EyeOff className="w-4 h-4" />;
      case 'after': return <Eye className="w-4 h-4" />;
      default: return <SplitSquareHorizontal className="w-4 h-4" />;
    }
  };

  const getViewModeLabel = () => {
    switch (viewMode) {
      case 'before': return 'Before Only';
      case 'after': return 'After Only';
      default: return 'Split View';
    }
  };

  return (
    <Card className={`overflow-hidden card-romantic-3d ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-elegant font-semibold">Before & After</h3>
            <Badge variant="outline" className="text-xs">
              {getViewModeLabel()}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleViewMode}
              className="h-8"
            >
              {getViewModeIcon()}
              <span className="ml-1 text-xs">{getViewModeLabel()}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={downloadComparison}
              className="h-8"
            >
              <Download className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Image Container */}
      <div 
        ref={containerRef}
        className={`relative overflow-hidden bg-gradient-3d-background ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}
        style={{ minHeight: '400px' }}
      >
        {/* Before Image */}
        <div 
          className={`absolute inset-0 ${viewMode === 'after' ? 'opacity-0' : 'opacity-100'}`}
          style={{
            clipPath: viewMode === 'split' ? `inset(0 ${100 - currentSplit}% 0 0)` : 'none'
          }}
        >
          <canvas
            ref={beforeCanvasRef}
            className="w-full h-full object-contain"
          />
          {showLabels && viewMode !== 'after' && (
            <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-elegant">
              Before
            </div>
          )}
        </div>

        {/* After Image */}
        <div 
          className={`absolute inset-0 ${viewMode === 'before' ? 'opacity-0' : 'opacity-100'}`}
          style={{
            clipPath: viewMode === 'split' ? `inset(0 0 0 ${currentSplit}%)` : 'none'
          }}
        >
          <canvas
            ref={afterCanvasRef}
            className="w-full h-full object-contain"
          />
          {showLabels && viewMode !== 'before' && (
            <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm font-elegant">
              After
            </div>
          )}
        </div>

        {/* Split Line */}
        <AnimatePresence>
          {viewMode === 'split' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-col-resize z-10"
              style={{ left: `${currentSplit}%` }}
              onMouseDown={handleMouseDown}
            >
              {/* Split handle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center cursor-col-resize">
                <Move className="w-4 h-4 text-gray-600" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Split position indicator */}
        {viewMode === 'split' && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-elegant">
            {Math.round(currentSplit)}% / {Math.round(100 - currentSplit)}%
          </div>
        )}

        {/* Fullscreen overlay */}
        {isFullscreen && (
          <div className="absolute top-4 right-4 z-50">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsFullscreen(false)}
              className="bg-black/70 text-white hover:bg-black/90"
            >
              Exit Fullscreen
            </Button>
          </div>
        )}
      </div>

      {/* Hidden canvases for processing */}
      <div className="hidden">
        <canvas ref={beforeCanvasRef} />
        <canvas ref={afterCanvasRef} />
      </div>
    </Card>
  );
};
