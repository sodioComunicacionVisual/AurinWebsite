import { motion, useSpring, useTransform, useInView, MotionValue } from 'motion/react';
import { useEffect, useRef } from 'react';
import styles from './AnimatedCounter.module.css';

interface NumberProps {
  mv: MotionValue<number>;
  number: number;
  height: number;
}

function Number({ mv, number, height }: NumberProps) {
  const y = useTransform(mv, (latest: number) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) {
      memo -= 10 * height;
    }
    return memo;
  });

  return (
    <motion.span className={styles['counter-number']} style={{ y }}>
      {number}
    </motion.span>
  );
}

interface DigitProps {
  place: number;
  value: MotionValue<number>;
  height: number;
}

function Digit({ place, value, height }: DigitProps) {
  const valueRoundedToPlace = useTransform(value, (latest) => Math.floor(latest / place));
  const animatedValue = useSpring(valueRoundedToPlace, {
    stiffness: 100,
    damping: 30,
    mass: 1
  });

  return (
    <div className={styles['counter-digit']} style={{ height }}>
      {Array.from({ length: 10 }, (_, i) => (
        <Number key={i} mv={animatedValue} number={i} height={height} />
      ))}
    </div>
  );
}

interface AnimatedCounterProps {
  targetValue: number;
  fontSize?: number;
  padding?: number;
  gap?: number;
  textColor?: string;
  fontWeight?: string | number;
  suffix?: string;
  className?: string;
  startOffset?: number;
}

export default function AnimatedCounter({
  targetValue,
  fontSize = 100,
  padding = 0,
  gap = 8,
  textColor = '#D0DF00',
  fontWeight = 400,
  suffix = '',
  className = '',
  startOffset = 10
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: '0px 0px -100px 0px' 
  });
  
  const animatedValue = useSpring(0, {
    stiffness: 60,
    damping: 20,
    mass: 1
  });
  const height = fontSize + padding;
  
  // Calculate places based on target value
  const getPlaces = (num: number) => {
    const places = [];
    let tempNum = Math.abs(num);
    let place = 1;
    
    if (tempNum === 0) return [1];
    
    while (tempNum > 0) {
      places.unshift(place);
      tempNum = Math.floor(tempNum / 10);
      place *= 10;
    }
    
    return places;
  };
  
  const places = getPlaces(targetValue);
  
  useEffect(() => {
    if (isInView) {
      // Start from startOffset below target and animate to target
      const startValue = Math.max(0, targetValue - startOffset);
      animatedValue.set(startValue);
      
      // Animate to target value
      setTimeout(() => {
        animatedValue.set(targetValue);
      }, 100);
    }
  }, [isInView, targetValue, animatedValue, startOffset]);

  const counterStyle = {
    fontSize,
    gap,
    color: textColor,
    fontWeight
  };

  return (
    <div 
      ref={ref}
      className={`${styles['counter-container']} ${className}`}
    >
      <div className={styles['counter-counter']} style={counterStyle}>
        {places.map(place => (
          <Digit 
            key={place} 
            place={place} 
            value={animatedValue} 
            height={height} 
          />
        ))}
        {suffix && (
          <span className={styles['counter-suffix']} style={{ color: textColor, fontWeight }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
