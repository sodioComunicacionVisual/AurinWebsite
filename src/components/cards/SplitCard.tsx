import { useRef } from 'react';
import { useTransform, motion, useScroll } from 'motion/react';
import styles from './SplitCard.module.css';

interface SplitCardProps {
  i: number;
  letter: string;
  title: string;
  description: string;
  range: [number, number];
  targetScale: number;
}

export default function SplitCard({
  i,
  letter,
  title,
  description,
  range,
  targetScale,
}: SplitCardProps) {
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
        className={styles['split-card']}
      >
        {/* Left Container - Letter and Title */}
        <div className={styles['left-container']}>
          <div className={styles['card-letter']}>{letter}</div>
          <div className={styles['card-title-wrapper']}>
            <h3 className={styles['card-title']}>{title}</h3>
          </div>
        </div>

        {/* Right Container - Description */}
        <div className={styles['right-container']}>
          <p className={styles['card-description']}>{description}</p>
        </div>
      </motion.div>
    </div>
  );
}
