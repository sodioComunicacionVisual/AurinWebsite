import React from 'react';
import styles from './StackedCards.module.css';

// Types
interface iCardItem {
  src?: string;
  alt: string;
  placeholder?: string;
}

interface iCardProps extends iCardItem {
  index: number;
}

// Card Component
const Card = ({ src, alt, placeholder, index }: iCardProps) => {
  // Calculate top offset: 0, 0.5rem, 1rem, 1.5rem, 2rem, 3rem for progressive stacking
  const topOffsets = [0, 0.5, 1, 1.5, 2, 3];
  const topOffset = topOffsets[index] || index * 0.5;

  // Calculate width: 55%, 60%, 65%, 70%, 75%, 80%
  const width = 55 + (index * 5);

  return (
    <div
      className={styles.cardWrapper}
      style={{ top: `${topOffset}rem` }}
    >
      <figure className={styles.figure}>
        {src ? (
          <img
            src={src}
            alt={alt}
            className={styles.image}
            style={{
              width: `${width}%`,
              boxShadow: index === 1 ? '0 -5px 16px 4px rgba(0,0,0,0.8), 0 2px 4px -1px rgba(0,0,0,0.06)' : 'none'
            }}
          />
        ) : (
          <div
            className={styles.placeholder}
            style={{
              width: `${width}%`,
              boxShadow: index === 1 ? '0 -5px 16px 4px rgba(0,0,0,0.8), 0 2px 4px -1px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <span>{placeholder || alt}</span>
          </div>
        )}
      </figure>
    </div>
  );
};

/**
 * CardsParallax component - Stacking cards effect with sticky positioning
 */
interface iCardSlideProps {
  items: iCardItem[];
}

const CardsParallax = ({ items }: iCardSlideProps) => {
  return (
    <section className={styles.container}>
      {items.map((item, i) => (
        <Card key={`card_${i}`} {...item} index={i} />
      ))}
    </section>
  );
};

export { CardsParallax, type iCardItem };
