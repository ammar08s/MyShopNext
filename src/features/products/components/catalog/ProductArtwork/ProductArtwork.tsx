import Image from "next/image";
import type { ReactElement } from "react";
import { getProductArtworkIndex } from "@/features/products/modules/imagery/products.imagery";
import styles from "./ProductArtwork.module.css";

interface Props {
  productTitle: string;
  category: string;
  className?: string;
}

/**
 * Displays a labelled illustrative product render, separate from API facts.
 * @param props - Product title, fallback category and parent layout classes.
 * @returns Decorative artwork with an explicit illustrative-image caption.
 */
export function ProductArtwork({
  productTitle,
  category,
  className = "",
}: Props): ReactElement {
  const index = getProductArtworkIndex(productTitle, category);
  return (
    <div aria-hidden="true" className={`${styles.artwork} ${className}`}>
      {index !== null ? (
        <div className={styles.image}>
          <Image
            src="/products/catalog-atlas.png"
            alt=""
            width={1448}
            height={1086}
            sizes="(min-width: 1280px) 1200px, (min-width: 768px) 1400px, 200vw"
            className={styles.atlas}
            style={{
              left: `${-(index % 4) * 100}%`,
              top: `${-Math.floor(index / 4) * 100}%`,
            }}
          />
        </div>
      ) : (
        <svg className={styles.fallback} viewBox="0 0 80 80" fill="none">
          <path
            d="M20 25h40l5 40H15l5-40Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M30 28V19a10 10 0 0 1 20 0v9"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      )}
      <span className={styles.caption}>Illustrative image</span>
    </div>
  );
}
