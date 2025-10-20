import { motion } from "motion/react";
import styles from "./CaseStudyStrip.module.css";

interface CaseStudyStripProps {
  title: string;
  content: string;
}

export default function CaseStudyStrip({ title, content }: CaseStudyStripProps) {
  return (
    <motion.div
      className={styles.strip}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.h2
        className={styles.title}
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {title}
      </motion.h2>
      <motion.p
        className={styles.content}
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
      >
        {content}
      </motion.p>
    </motion.div>
  );
}
