import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RotateCcw } from 'lucide-react';
import { ColorWheelSettings } from '@/types/color-grading';

interface ColorWheelProps {
  settings: ColorWheelSettings;
  onChange: (settings: ColorWheelSettings) => void;
  title?: string;
  size?: number;
  className?: string;
}

export const ColorWheel: React.FC<ColorWheelProps> = ({
  settings,
  onChange,
  title = 'Color Wheel',
  size = 200,
  className = ''
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Convert hue/saturation to x/y coordinates
  const getPositionFromHS = useCallback((hue: number, saturation: number) => {
    const angle = (hue * Math.PI) / 180;
    const radius = (saturation * size) / 4; // Max radius is size/4
    return {
      x: size / 2 + radius * Math.cos(angle),
      y: size / 2 + radius * Math.sin(angle)
    };
  }, [size]);

  // Convert x/y coordinates to hue/saturation
  const getHSFromPosition = useCallback((x: number, y: number) => {
    const centerX = size / 2;
    const centerY = size / 2;
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    
    const radius = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxRadius = size / 4;
    const saturation = Math.min(2, (radius / maxRadius) * 2); // 0 to 2 range
    
    let hue = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    if (hue < 0) hue += 360;
    
    return { hue, saturation };
  }, [size]);

  // Draw the color wheel
  const drawColorWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 4;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw color wheel
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = (angle * Math.PI) / 180;
      const endAngle = ((angle + 1) * Math.PI) / 180;

      for (let r = 0; r < radius; r += 1) {
        const saturation = r / radius;
        const hsl = `hsl(${angle}, ${saturation * 100}%, 50%)`;

        ctx.beginPath();
        ctx.arc(centerX, centerY, r, startAngle, endAngle);
        ctx.strokeStyle = hsl;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }

    // Draw center circle (neutral)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#888';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [size]);

  useEffect(() => {
    drawColorWheel();
  }, [drawColorWheel]);

  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (!wheelRef.current) return;

    const rect = wheelRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setIsDragging(true);
    setDragOffset({ x, y });

    const { hue, saturation } = getHSFromPosition(x, y);
    onChange({
      ...settings,
      hue: hue - 180, // Convert to -180 to 180 range
      saturation
    });
  }, [settings, onChange, getHSFromPosition]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !wheelRef.current) return;

    const rect = wheelRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const { hue, saturation } = getHSFromPosition(x, y);
    onChange({
      ...settings,
      hue: hue - 180, // Convert to -180 to 180 range
      saturation
    });
  }, [isDragging, settings, onChange, getHSFromPosition]);

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

  const reset = useCallback(() => {
    onChange({
      hue: 0,
      saturation: 0,
      luminance: 0
    });
  }, [onChange]);

  const currentPosition = getPositionFromHS(settings.hue + 180, settings.saturation / 2);

  return (
    <Card className={`p-4 card-romantic-3d ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-elegant font-semibold text-sm">{title}</h3>
          <Badge variant="outline" className="text-xs">
            H: {Math.round(settings.hue)}° S: {Math.round(settings.saturation * 100)}%
          </Badge>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="h-7 w-7 p-0"
        >
          <RotateCcw className="w-3 h-3" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Color Wheel */}
        <div 
          ref={wheelRef}
          className="relative mx-auto cursor-crosshair"
          style={{ width: size, height: size }}
          onMouseDown={handleMouseDown}
        >
          <canvas
            ref={canvasRef}
            width={size}
            height={size}
            className="rounded-full border border-border shadow-3d-soft"
          />
          
          {/* Current position indicator */}
          <motion.div
            className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none"
            style={{
              left: currentPosition.x - 8,
              top: currentPosition.y - 8,
              backgroundColor: `hsl(${settings.hue + 180}, ${Math.min(100, settings.saturation * 50)}%, 50%)`
            }}
            animate={{
              scale: isDragging ? 1.2 : 1
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        </div>

        {/* Luminance Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-elegant text-xs">Luminance</Label>
            <span className="text-xs text-muted-foreground">
              {settings.luminance > 0 ? '+' : ''}{settings.luminance.toFixed(2)}
            </span>
          </div>
          <Slider
            value={[settings.luminance]}
            onValueChange={([value]) => onChange({ ...settings, luminance: value })}
            min={-1}
            max={1}
            step={0.01}
            className="slider-romantic"
          />
        </div>

        {/* Fine-tune controls */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="font-elegant text-xs">Hue</Label>
            <Slider
              value={[settings.hue]}
              onValueChange={([value]) => onChange({ ...settings, hue: value })}
              min={-180}
              max={180}
              step={1}
              className="slider-romantic"
            />
          </div>
          
          <div className="space-y-1">
            <Label className="font-elegant text-xs">Saturation</Label>
            <Slider
              value={[settings.saturation]}
              onValueChange={([value]) => onChange({ ...settings, saturation: value })}
              min={0}
              max={2}
              step={0.01}
              className="slider-romantic"
            />
          </div>
        </div>

        {/* Color preview */}
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground">Preview:</div>
          <div 
            className="w-8 h-4 rounded border border-border shadow-inner"
            style={{
              backgroundColor: `hsl(${settings.hue + 180}, ${Math.min(100, settings.saturation * 50)}%, ${50 + settings.luminance * 25}%)`
            }}
          />
        </div>
      </div>
    </Card>
  );
};
