import { motion } from "motion/react";
import ServiceCard from "../ServiceCard/ServiceCard";
import styles from "./ServicesStrip.module.css";

interface ServicesStripProps {
  title: string;
  services: string[];
}

export default function ServicesStrip({ title, services }: ServicesStripProps) {
  return (
    <div className={styles.strip}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className={styles.title}>{title}</h2>
        <svg
          className={styles.decorativeLines}
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 900 930"
        >
          <line
            stroke="url(#paint0_linear)"
            style={{ mixBlendMode: "screen" }}
            x1="899.5"
            x2="899.5"
            y1="0"
            y2="930"
          />
          <line
            stroke="url(#paint1_linear)"
            style={{ mixBlendMode: "screen" }}
            x1="232.5"
            x2="232.5"
            y1="0"
            y2="930"
          />
          <line
            stroke="url(#paint2_linear)"
            style={{ mixBlendMode: "screen" }}
            x1="451.5"
            x2="451.5"
            y1="0"
            y2="930"
          />
          <line
            stroke="url(#paint3_linear)"
            style={{ mixBlendMode: "screen" }}
            x1="0.5"
            x2="0.5"
            y1="0"
            y2="930"
          />
          <line
            stroke="url(#paint4_linear)"
            style={{ mixBlendMode: "screen" }}
            x1="671.5"
            x2="671.5"
            y1="0"
            y2="930"
          />
          <defs>
            {[0, 1, 2, 3, 4].map((i) => (
              <linearGradient
                key={i}
                id={`paint${i}_linear`}
                x1="0"
                y1="0"
                x2="0"
                y2="930"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#0D0D0D" />
                <stop offset="0.475" stopColor="#212121" />
                <stop offset="1" stopOpacity="0" />
              </linearGradient>
            ))}
          </defs>
        </svg>
      </motion.div>
      <div className={styles.servicesList}>
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
          >
            <ServiceCard title={service} index={index} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
