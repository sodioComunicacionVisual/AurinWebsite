'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface InteractiveGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  shockRadius?: number;
  shockStrength?: number;
  className?: string;
}

interface DotProps {
  x: number;
  y: number;
  mouseX: any;
  mouseY: any;
  proximity: number;
  baseColor: string;
  activeColor: string;
  dotSize: number;
  onShock: (dotX: number, dotY: number) => void;
}

const Dot: React.FC<DotProps> = ({ 
  x, 
  y, 
  mouseX, 
  mouseY, 
  proximity, 
  baseColor, 
  activeColor, 
  dotSize,
  onShock 
}) => {
  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  
  const springX = useSpring(dotX, { stiffness: 150, damping: 15 });
  const springY = useSpring(dotY, { stiffness: 150, damping: 15 });

  // Calculate distance and color interpolation
  const distance = useTransform([mouseX, mouseY], ([mx, my]) => {
    const dx = x - mx;
    const dy = y - my;
    return Math.sqrt(dx * dx + dy * dy);
  });

  const colorProgress = useTransform(distance, [0, proximity], [1, 0]);
  
  const backgroundColor = useTransform(colorProgress, (progress) => {
    const clampedProgress = Math.max(0, Math.min(1, progress));
    
    // Parse hex colors
    const parseHex = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { r, g, b };
    };

    const base = parseHex(baseColor);
    const active = parseHex(activeColor);

    const r = Math.round(base.r + (active.r - base.r) * clampedProgress);
    const g = Math.round(base.g + (active.g - base.g) * clampedProgress);
    const b = Math.round(base.b + (active.b - base.b) * clampedProgress);

    return `rgb(${r}, ${g}, ${b})`;
  });

  const handleClick = () => {
    onShock(x, y);
  };

  return (
    <motion.div
      style={{
        width: dotSize,
        height: dotSize,
        borderRadius: '50%',
        backgroundColor,
        x: springX,
        y: springY,
        cursor: 'pointer',
      }}
      onClick={handleClick}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.8 }}
    />
  );
};

const InteractiveGrid: React.FC<InteractiveGridProps> = ({
  dotSize = 8,
  gap = 12,
  baseColor = '#1e293b',
  activeColor = '#64748b',
  proximity = 100,
  shockRadius = 200,
  shockStrength = 5,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dots, setDots] = useState<Array<{ x: number; y: number; id: string }>>([]);
  const [shockWaves, setShockWaves] = useState<Array<{ x: number; y: number; id: string }>>([]);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const buildGrid = useCallback(() => {
    if (!containerRef.current) return;

    const { width, height } = containerRef.current.getBoundingClientRect();
    const cols = Math.floor(width / (dotSize + gap));
    const rows = Math.floor(height / (dotSize + gap));
    
    const newDots: Array<{ x: number; y: number; id: string }> = [];
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * (dotSize + gap) + dotSize / 2;
        const y = row * (dotSize + gap) + dotSize / 2;
        newDots.push({
          x,
          y,
          id: `${row}-${col}`,
        });
      }
    }
    
    setDots(newDots);
  }, [dotSize, gap]);

  useEffect(() => {
    buildGrid();
    
    const handleResize = () => buildGrid();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [buildGrid]);

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  };

  const handleShock = (shockX: number, shockY: number) => {
    const shockId = `shock-${Date.now()}`;
    setShockWaves(prev => [...prev, { x: shockX, y: shockY, id: shockId }]);
    
    // Remove shock wave after animation
    setTimeout(() => {
      setShockWaves(prev => prev.filter(shock => shock.id !== shockId));
    }, 1000);

    // Apply shock effect to nearby dots
    dots.forEach((dot) => {
      const distance = Math.sqrt((dot.x - shockX) ** 2 + (dot.y - shockY) ** 2);
      if (distance < shockRadius) {
        const force = (1 - distance / shockRadius) * shockStrength;
        const angle = Math.atan2(dot.y - shockY, dot.x - shockX);
        
        // This would need to be implemented with individual dot motion values
        // For now, we'll use the visual shock wave effect
      }
    });
  };

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      style={{
        background: 'transparent',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {dots.map((dot) => (
          <div
            key={dot.id}
            style={{
              position: 'absolute',
              left: dot.x - dotSize / 2,
              top: dot.y - dotSize / 2,
            }}
          >
            <Dot
              x={dot.x}
              y={dot.y}
              mouseX={mouseX}
              mouseY={mouseY}
              proximity={proximity}
              baseColor={baseColor}
              activeColor={activeColor}
              dotSize={dotSize}
              onShock={handleShock}
            />
          </div>
        ))}
        
        {/* Shock wave effects */}
        {shockWaves.map((shock) => (
          <motion.div
            key={shock.id}
            style={{
              position: 'absolute',
              left: shock.x - shockRadius,
              top: shock.y - shockRadius,
              width: shockRadius * 2,
              height: shockRadius * 2,
              borderRadius: '50%',
              border: `2px solid ${activeColor}`,
              pointerEvents: 'none',
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        ))}
      </div>
    </div>
  );
};

export default InteractiveGrid;
