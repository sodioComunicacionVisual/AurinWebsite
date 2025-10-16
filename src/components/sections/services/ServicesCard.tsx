import { useRef } from 'react';
import { useTransform, motion, useScroll, type MotionValue } from 'motion/react';
import styles from './ServicesCard.module.css';

interface CardProps {
  i: number;
  title: string;
  description: string;
  letter: string;
  color: string;
  range: [number, number];
  targetScale: number;
}

export default function ServicesCard({
  i,
  title,
  description,
  letter,
  color,
  range,
  targetScale,
}: CardProps) {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div
      ref={container}
      className={styles['card-wrapper']}
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className={styles['service-card']}
      >
        <div className={styles['card-letter']}>{letter}</div>
        <div className={styles['card-content']}>
          <h3 className={styles['card-title']}>{title}</h3>
          <p className={styles['card-description']}>{description}</p>
        </div>
      </motion.div>
    </div>
  );
}
