import { useRef } from 'react';
import { useTransform, motion, useScroll } from 'motion/react';

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
      className="card-wrapper"
      style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'sticky', top: 0 }}
    >
      <motion.div
        style={{
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className="split-card"
      >
        {/* Left Container - Letter and Title */}
        <div className="left-container">
          <div className="card-letter">{letter}</div>
          <div className="card-title-wrapper">
            <h3 className="card-title">{title}</h3>
          </div>
        </div>

        {/* Right Container - Description */}
        <div className="right-container">
          <p className="card-description" style={{ color: '#FFFFFF !important' }}>{description}</p>
        </div>
      </motion.div>

      <style>{`
        .split-card {
          min-width: 100%;
          max-width: var(--maxWidth);
          min-height: 400px;
          display: flex;
          gap: 0;
          transform-origin: top;
          position: relative;
        }

        /* Left Container - Yellow with Letter and Title */
        .left-container {
          flex: 0 0 auto;
          width: 40%;
          background: linear-gradient(200deg, rgba(0, 0, 0, 0) 47%, #C5D400 47%), #D0DF00;
          overflow: hidden;
          border-radius: 10px 0px 0px 10px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          gap: 10px;
          transition: all 0.3s ease;
        }

        .left-container:hover {
          transform: translateY(-5px);
        }

        .card-letter {
          text-align: right;
          display: flex;
          justify-content: center;
          flex-direction: column;
          color: black;
          font-size: clamp(150px, 20vw, 308.50px);
          font-family: var(--font-heading, 'Titillium Web', sans-serif);
          font-weight: 600;
          line-height: 0.65;
          transition: all 0.3s ease;
          padding: 0 20px;
        }

        .left-container:hover .card-letter {
          transform: scale(1.05) rotate(2deg);
        }

        .card-title-wrapper {
          align-self: stretch;
          padding: 35px 25px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
        }

        .card-title {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          color: #0A0A0A;
          font-size: clamp(24px, 2.5vw, 32px);
          font-family: var(--font-heading, 'Titillium Web', sans-serif);
          font-weight: 300;
          line-height: 1.1;
          margin: 0;
          transition: all 0.3s ease;
        }

        .left-container:hover .card-title {
          transform: translateY(-2px);
        }

        /* Right Container - Dark with Description */
        .right-container {
          flex: 1;
          width: 60%;
          background: linear-gradient(184deg, rgba(0, 0, 0, 0) 58%, #181818 58%), #282828;
          overflow: hidden;
          border-radius: 0px 10px 10px 0px;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
          transition: all 0.3s ease;
        }

        .right-container:hover {
          transform: translateY(-5px);
          background: linear-gradient(184deg, rgba(0, 0, 0, 0) 58%, #1a1a1a 58%), #2a2a2a;
        }

        .card-description {
          max-width: 687px;
          color: #FFFFFF !important;
          font-size: clamp(16px, 1.5vw, 20px);
          font-family: var(--font-body, 'Urbanist', sans-serif);
          font-weight: 400;
          line-height: 1.5;
          margin: 0;
          transition: all 0.3s ease;
        }

        .right-container .card-description {
          color: #FFFFFF !important;
        }

        .right-container:hover .card-description {
          transform: translateY(-2px);
        }

        /* Responsive */
        @media (max-width: 968px) {
          .split-card {
            width: 85%;
            flex-direction: row;
            gap: 0;
          }

          .left-container {
            width: 40%;
          }

          .right-container {
            width: 60%;
          }

          .card-letter {
            font-size: clamp(80px, 15vw, 150px);
            padding: 0 10px;
          }

          .card-title-wrapper {
            padding: 20px 15px;
          }

          .card-title {
            font-size: clamp(18px, 2vw, 24px);
          }

          .right-container {
            padding: 20px 15px;
          }

          .card-description {
            font-size: clamp(14px, 1.8vw, 18px);
          }
        }

        @media (max-width: 768px) {
          .split-card {
            width: 90%;
            flex-direction: row;
          }

          .left-container {
            width: 40%;
          }

          .right-container {
            width: 60%;
          }

          .card-letter {
            font-size: clamp(60px, 12vw, 120px);
            padding: 0 8px;
          }

          .card-title {
            font-size: clamp(16px, 2.5vw, 20px);
          }

          .card-title-wrapper {
            padding: 15px 10px;
          }

          .right-container {
            padding: 16px 12px;
          }

          .card-description {
            font-size: clamp(12px, 2vw, 16px);
          }
        }
        
        .card-wrapper {
          max-width: var(--maxWidth);
          margin: 0 auto;
          width: 100%;
        }
      `}</style>
    </div>
  );
}
