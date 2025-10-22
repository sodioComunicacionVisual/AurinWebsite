'use client';
import { useRef, useEffect, useState } from 'react';
import { useMotionValue, useSpring, motion, AnimatePresence } from 'framer-motion';

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
  const [tooltip, setTooltip] = useState<{ text: string; visible: boolean }>({
    text: '',
    visible: false
  });

  // Smooth tooltip position with spring physics
  const tooltipX = useMotionValue(0);
  const tooltipY = useMotionValue(0);
  
  const smoothTooltipX = useSpring(tooltipX, { 
    stiffness: 500, 
    damping: 50, 
    bounce: 0 
  });
  const smoothTooltipY = useSpring(tooltipY, { 
    stiffness: 500, 
    damping: 50, 
    bounce: 0 
  });
  
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
      
      // Update tooltip position with offset
      tooltipX.set(event.clientX + 20);
      tooltipY.set(event.clientY - 40);
    };

    const handleMouseLeave = () => {
      mouseX.set(-1000);
      mouseY.set(-1000);
      setTooltip({ text: '', visible: false });
    };

    // Listen for custom tooltip events
    const handleShowTooltip = (event: CustomEvent) => {
      setTooltip({ text: event.detail.text, visible: true });
    };

    const handleHideTooltip = () => {
      setTooltip({ text: '', visible: false });
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
        gradient.addColorStop(0, `rgba(${rgbColor}, ${config.brightness || 0.15})`);
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
    window.addEventListener('showCursorTooltip', handleShowTooltip as EventListener);
    window.addEventListener('hideCursorTooltip', handleHideTooltip);
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('showCursorTooltip', handleShowTooltip as EventListener);
      window.removeEventListener('hideCursorTooltip', handleHideTooltip);
      cancelAnimationFrame(animationFrameId);
      unsubscribeX();
      unsubscribeY();
    };
  }, [config.radius, config.brightness, config.color, config.smoothing, mouseX, mouseY, smoothMouseX, smoothMouseY]);

  return (
    <>
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
      <AnimatePresence>
        {tooltip.visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ 
              type: "spring", 
              stiffness: 600, 
              damping: 30,
              bounce: 0.1
            }}
            style={{
              position: 'fixed',
              left: smoothTooltipX,
              top: smoothTooltipY,
              backgroundColor: 'var(--color-yellow)',
              color: '#0A0A0A',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontFamily: 'var(--font-body)',
              fontWeight: '500',
              pointerEvents: 'none',
              zIndex: 10000,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {tooltip.text}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
