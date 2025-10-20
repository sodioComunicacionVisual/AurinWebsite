import { useEffect, useRef } from 'react';
import { inView, animate } from 'motion';
import styles from './ServiceCard.module.css';

interface ServiceCardProps {
  serviceName: string;
  index: number;
}

export default function ServiceCard({ serviceName, index }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Set initial state
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';

    // Animate on scroll into view
    const cleanup = inView(
      card,
      () => {
        animate(
          card,
          {
            opacity: [0, 1],
            y: [40, 0]
          },
          {
            duration: 0.8,
            delay: index * 0.15,
            ease: [0.22, 1, 0.36, 1]
          }
        );
        return () => {}; // Return cleanup function
      },
      { margin: '0px 0px -100px 0px' }
    );

    return cleanup;
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={styles.serviceCard}
      data-card-index={index}
      data-motion-id={`service-card-${index}`}
    >
      <div className={styles.cardMainContent}>
        <h3 className={styles.serviceName}>{serviceName}</h3>
      </div>
      <div className={styles.cardIconWrapper}>
        <div className={styles.cardIcon}>
          <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
          >
            <path
              d="M0.87 21.13L21.13 0.87M21.13 0.87H0.87M21.13 0.87V21.13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
