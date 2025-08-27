import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Plus, Minus } from 'lucide-react';
import { CurvePoint } from '@/types/color-grading';

interface BezierCurveEditorProps {
  points: CurvePoint[];
  onChange: (points: CurvePoint[]) => void;
  width?: number;
  height?: number;
  color?: string;
  title?: string;
  className?: string;
}

export const BezierCurveEditor: React.FC<BezierCurveEditorProps> = ({
  points,
  onChange,
  width = 300,
  height = 200,
  color = '#ff69b4',
  title = 'Tone Curve',
  className = ''
}) => {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [curvePoints, setCurvePoints] = useState<CurvePoint[]>(points);

  useEffect(() => {
    setCurvePoints(points);
  }, [points]);

  const handleMouseDown = useCallback((index: number, event: React.MouseEvent) => {
    event.preventDefault();
    setDragIndex(index);
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || dragIndex === null || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / width));
    const y = Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / height));

    const newPoints = [...curvePoints];
    
    // Constrain x movement to prevent points from crossing
    const prevPoint = newPoints[dragIndex - 1];
    const nextPoint = newPoints[dragIndex + 1];
    
    let constrainedX = x;
    if (prevPoint) constrainedX = Math.max(constrainedX, prevPoint.x + 0.01);
    if (nextPoint) constrainedX = Math.min(constrainedX, nextPoint.x - 0.01);
    
    newPoints[dragIndex] = { x: constrainedX, y };
    setCurvePoints(newPoints);
    onChange(newPoints);
  }, [isDragging, dragIndex, curvePoints, onChange, width, height]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragIndex(null);
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

  const addPoint = useCallback((event: React.MouseEvent) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / width;
    const y = 1 - (event.clientY - rect.top) / height;

    // Find the correct position to insert the new point
    let insertIndex = curvePoints.length;
    for (let i = 0; i < curvePoints.length; i++) {
      if (curvePoints[i].x > x) {
        insertIndex = i;
        break;
      }
    }

    const newPoints = [...curvePoints];
    newPoints.splice(insertIndex, 0, { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
    setCurvePoints(newPoints);
    onChange(newPoints);
  }, [curvePoints, onChange, width, height]);

  const removePoint = useCallback((index: number) => {
    if (curvePoints.length <= 2) return; // Keep at least 2 points

    const newPoints = curvePoints.filter((_, i) => i !== index);
    setCurvePoints(newPoints);
    onChange(newPoints);
  }, [curvePoints, onChange]);

  const resetCurve = useCallback(() => {
    const defaultPoints: CurvePoint[] = [
      { x: 0, y: 0 },
      { x: 1, y: 1 }
    ];
    setCurvePoints(defaultPoints);
    onChange(defaultPoints);
  }, [onChange]);

  // Generate smooth curve path using cubic Bezier interpolation
  const generateCurvePath = useCallback(() => {
    if (curvePoints.length < 2) return '';

    let path = `M ${curvePoints[0].x * width} ${(1 - curvePoints[0].y) * height}`;

    for (let i = 1; i < curvePoints.length; i++) {
      const prev = curvePoints[i - 1];
      const curr = curvePoints[i];
      
      // Calculate control points for smooth curve
      const cp1x = prev.x * width + (curr.x - prev.x) * width * 0.3;
      const cp1y = (1 - prev.y) * height;
      const cp2x = curr.x * width - (curr.x - prev.x) * width * 0.3;
      const cp2y = (1 - curr.y) * height;
      
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x * width} ${(1 - curr.y) * height}`;
    }

    return path;
  }, [curvePoints, width, height]);

  // Generate grid lines
  const gridLines = [];
  for (let i = 1; i < 4; i++) {
    const pos = (i / 4) * width;
    gridLines.push(
      <line
        key={`v-${i}`}
        x1={pos}
        y1={0}
        x2={pos}
        y2={height}
        stroke="currentColor"
        strokeOpacity={0.1}
        strokeWidth={1}
      />
    );
  }
  for (let i = 1; i < 4; i++) {
    const pos = (i / 4) * height;
    gridLines.push(
      <line
        key={`h-${i}`}
        x1={0}
        y1={pos}
        x2={width}
        y2={pos}
        stroke="currentColor"
        strokeOpacity={0.1}
        strokeWidth={1}
      />
    );
  }

  return (
    <Card className={`p-4 card-romantic-3d ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-elegant font-semibold text-sm">{title}</h3>
          <Badge variant="outline" className="text-xs">
            {curvePoints.length} points
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetCurve}
            className="h-7 w-7 p-0"
          >
            <RotateCcw className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="border border-border rounded-lg bg-gradient-to-br from-background to-muted/20 cursor-crosshair"
          onDoubleClick={addPoint}
        >
          {/* Grid */}
          {gridLines}
          
          {/* Diagonal reference line */}
          <line
            x1={0}
            y1={height}
            x2={width}
            y2={0}
            stroke="currentColor"
            strokeOpacity={0.2}
            strokeWidth={1}
            strokeDasharray="4 4"
          />

          {/* Curve path */}
          <path
            d={generateCurvePath()}
            fill="none"
            stroke={color}
            strokeWidth={2}
            className="drop-shadow-sm"
          />

          {/* Control points */}
          {curvePoints.map((point, index) => (
            <motion.circle
              key={index}
              cx={point.x * width}
              cy={(1 - point.y) * height}
              r={hoveredIndex === index || dragIndex === index ? 6 : 4}
              fill={color}
              stroke="white"
              strokeWidth={2}
              className="cursor-grab active:cursor-grabbing drop-shadow-md"
              onMouseDown={(e) => handleMouseDown(index, e)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onDoubleClick={(e) => {
                e.stopPropagation();
                removePoint(index);
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}

          {/* Point coordinates tooltip */}
          {hoveredIndex !== null && (
            <g>
              <rect
                x={curvePoints[hoveredIndex].x * width + 10}
                y={(1 - curvePoints[hoveredIndex].y) * height - 20}
                width={60}
                height={16}
                fill="black"
                fillOpacity={0.8}
                rx={4}
              />
              <text
                x={curvePoints[hoveredIndex].x * width + 15}
                y={(1 - curvePoints[hoveredIndex].y) * height - 8}
                fill="white"
                fontSize={10}
                fontFamily="monospace"
              >
                {curvePoints[hoveredIndex].x.toFixed(2)}, {curvePoints[hoveredIndex].y.toFixed(2)}
              </text>
            </g>
          )}
        </svg>

        <div className="mt-2 text-xs text-muted-foreground text-center">
          Double-click to add points • Double-click points to remove • Drag to adjust
        </div>
      </div>
    </Card>
  );
};
