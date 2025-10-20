import { motion } from "motion/react";
import svgPaths from "../../imports/svg-7niet7ueol";
import styles from "./BannerStrip.module.css";

interface BannerStripProps {
  projectName: string;
  categories: string[];
  description: string;
  bannerImageText?: string;
}

export default function BannerStrip({
  projectName,
  categories,
  description,
  bannerImageText = "Banner Imagen"
}: BannerStripProps) {
  return (
    <motion.div
      className={styles.strip}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className={styles.content}>
        <div className={styles.textContent}>
          <h1 className={styles.projectTitle}>{projectName}</h1>
          <div className={styles.categories}>
            {categories.map((category, index) => (
              <motion.p
                key={index}
                className={styles.category}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1, ease: "easeOut" }}
              >
                {category}
              </motion.p>
            ))}
          </div>
        </div>
        <motion.div
          className={styles.bannerImage}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className={styles.bannerImageText}>{bannerImageText}</p>
          <div className={styles.noise} />
        </motion.div>
      </div>
      <motion.p
        className={styles.description}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
      >
        {description}
      </motion.p>
      <motion.div
        className={styles.scrollDown}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      >
        <svg className={styles.scrollIcon} fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
          <path d={svgPaths.p3a677500} fill="white" />
        </svg>
      </motion.div>
    </motion.div>
  );
}
