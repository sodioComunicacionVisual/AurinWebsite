import svgPaths from "../../imports/svg-7niet7ueol";
import styles from "./ServiceCard.module.css";

interface ServiceCardProps {
  title: string;
  index: number;
}

export default function ServiceCard({ title, index }: ServiceCardProps) {
  return (
    <div className={styles.card}>
      <p className={styles.cardTitle}>{title}</p>
      <div className={styles.button}>
        <div className={styles.iconWrapper}>
          <svg className={styles.arrow} fill="none" preserveAspectRatio="none" viewBox="0 0 22 22">
            <path d={svgPaths.pd69a00} fill="white" />
          </svg>
        </div>
      </div>
    </div>
  );
}
