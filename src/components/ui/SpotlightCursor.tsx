'use client';
import { useRef, useEffect } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

interface SpotlightConfig {
  radius?: number;
  brightness?: number;
  color?: string;
  smoothing?: number;
}

export const SpotlightCursor = ({
  config = {},
}: {
  config?: SpotlightConfig;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseX = useMotionValue(-1000);
  const mouseY = useMotionValue(-1000);
  
  // Smooth mouse position with spring physics
  const smoothMouseX = useSpring(mouseX, { 
    stiffness: config.smoothing ? 1000 * config.smoothing : 150,
    damping: 25,
    mass: 0.1
  });
  const smoothMouseY = useSpring(mouseY, { 
    stiffness: config.smoothing ? 1000 * config.smoothing : 150,
    damping: 25,
    mass: 0.1
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let currentMouseX = -1000;
    let currentMouseY = -1000;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    const handleMouseLeave = () => {
      mouseX.set(-1000);
      mouseY.set(-1000);
    };

    // Subscribe to smooth mouse position changes
    const unsubscribeX = smoothMouseX.on('change', (value) => {
      currentMouseX = value;
    });
    
    const unsubscribeY = smoothMouseY.on('change', (value) => {
      currentMouseY = value;
    });

    const hexToRgb = (hex: string) => {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 12) & 255;
      const g = (bigint >> 4) & 255;
      const b = bigint & 255;
      return `${r},${g},${b}`;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (currentMouseX !== -1000 && currentMouseY !== -1000) {
        const gradient = ctx.createRadialGradient(
          currentMouseX, currentMouseY, 0,
          currentMouseX, currentMouseY, config.radius || 300
        );
        const rgbColor = hexToRgb(config.color || '#ffffff');
        gradient.addColorStop(0, `rgba(${rgbColor}, ${config.brightness || 0.10})`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
      unsubscribeX();
      unsubscribeY();
    };
  }, [config.radius, config.brightness, config.color, config.smoothing, mouseX, mouseY, smoothMouseX, smoothMouseY]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};
