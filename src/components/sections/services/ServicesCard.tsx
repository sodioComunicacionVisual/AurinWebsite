import { useRef } from 'react';
import { useTransform, motion, useScroll, type MotionValue } from 'motion/react';

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
      className="card-wrapper"
      style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: 0 }}
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className="service-card"
      >
        <div className="card-letter">{letter}</div>
        <div className="card-content">
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
        </div>
      </motion.div>

      <style>{`
        .service-card {
          width: 70%;
          max-width: var(--maxWidth);
          min-height: 300px;
          background: linear-gradient(184deg, rgba(0, 0, 0, 0) 58%, #181818 58%), #282828;
          overflow: hidden;
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          padding: 40px;
          gap: 40px;
          transform-origin: top;
          cursor: pointer;
        }

        /* Estado hover permanente - colores amarillos */
        .service-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(184deg, rgba(0, 0, 0, 0) 58%, #C5D400 58%), var(--color-yellow, #D0DF00);
          border-radius: 10px;
          opacity: 1;
          pointer-events: none;
          z-index: 0;
          transition: opacity 0.3s ease;
        }

        .service-card:hover::before {
          opacity: 0.9;
        }

        .card-letter {
          position: relative;
          color: #0A0A0A;
          font-size: clamp(150px, 20vw, 308.50px);
          font-family: var(--font-heading, 'Titillium Web', sans-serif);
          font-weight: 600;
          line-height: 1;
          text-align: center;
          flex-shrink: 0;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .service-card:hover .card-letter {
          transform: scale(1.05) rotate(2deg);
        }

        .card-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
          z-index: 1;
          position: relative;
          max-width: 700px;
        }

        .card-title {
          color: #0A0A0A;
          font-size: clamp(24px, 3vw, 32px);
          font-family: var(--font-heading, 'Titillium Web', sans-serif);
          font-weight: 300;
          line-height: 1.2;
          margin: 0;
          transition: all 0.3s ease;
        }

        .service-card:hover .card-title {
          transform: translateY(-2px) scale(1.01);
        }

        .card-description {
          color: #0A0A0A;
          font-size: clamp(16px, 1.5vw, 20px);
          font-family: var(--font-body, 'Urbanist', sans-serif);
          font-weight: 400;
          line-height: 1.5;
          margin: 0;
          transition: all 0.3s ease;
        }

        .service-card:hover .card-description {
          transform: translateY(-2px);
        }

        /* Responsive */
        @media (max-width: 968px) {
          .service-card {
            width: 85%;
            flex-direction: column;
            text-align: center;
            padding: 30px 20px;
            min-height: auto;
          }

          .card-letter {
            font-size: clamp(100px, 25vw, 200px);
          }

          .card-content {
            align-items: center;
            max-width: 100%;
          }

          .card-title {
            text-align: center;
          }

          .card-description {
            text-align: center;
          }
        }

        @media (max-width: 768px) {
          .service-card {
            width: 90%;
            padding: 24px 16px;
            gap: 20px;
          }

          .card-letter {
            font-size: clamp(80px, 20vw, 150px);
          }
        }
      `}</style>
    </div>
  );
}
