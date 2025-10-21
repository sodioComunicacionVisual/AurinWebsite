import { motion, useInView } from 'motion/react';
import { useRef, type ReactNode } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  x?: number;
  scale?: number;
  opacity?: number;
  blur?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

export default function ScrollAnimation({
  children,
  delay = 0,
  duration = 0.6,
  y = 20,
  x = 0,
  scale = 1,
  opacity = 0,
  blur = 0,
  className = '',
  threshold = 0.1,
  once = true
}: ScrollAnimationProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once, 
    margin: '0px 0px -50px 0px',
    amount: threshold 
  });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity,
        y,
        x,
        scale,
        filter: blur > 0 ? `blur(${blur}px)` : 'none'
      }}
      animate={isInView ? {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: 'blur(0px)'
      } : {}}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
        type: 'tween'
      }}
    >
      {children}
    </motion.div>
  );
}
