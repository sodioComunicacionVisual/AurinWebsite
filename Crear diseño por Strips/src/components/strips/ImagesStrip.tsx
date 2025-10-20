import { motion } from "motion/react";
import ImageCard from "../ImageCard/ImageCard";
import styles from "./ImagesStrip.module.css";

interface ImagesStripProps {
  images: string[];
}

export default function ImagesStrip({ images }: ImagesStripProps) {
  const firstRow = images.slice(0, 2);
  const secondRow = images.slice(2, 4);

  return (
    <div className={styles.strip}>
      <div className={styles.grid}>
        <motion.div
          className={styles.row}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {firstRow.map((image, index) => (
            <motion.div
              key={index}
              style={{ flex: 1 }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
            >
              <ImageCard title={image} />
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className={styles.row}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        >
          {secondRow.map((image, index) => (
            <motion.div
              key={index}
              style={{ flex: 1 }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
            >
              <ImageCard title={image} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
