import styles from "./ImageCard.module.css";

interface ImageCardProps {
  title: string;
}

export default function ImageCard({ title }: ImageCardProps) {
  return (
    <div className={styles.imageCard}>
      <p className={styles.imagePlaceholder}>{title}</p>
    </div>
  );
}
