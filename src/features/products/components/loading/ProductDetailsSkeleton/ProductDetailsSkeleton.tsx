import type { ReactElement } from "react";
import "../productSkeleton.css";

interface Props {
  children?: never;
}

/**
 * Provides a detail-shaped pending page without interactive placeholders.
 * @param _props - Empty component props; no configurable inputs.
 * @returns A loading landmark with one polite announcement.
 */
export function ProductDetailsSkeleton(_props: Props): ReactElement {
  return (
    <main
      id="main-content"
      role="status"
      aria-busy="true"
      className="mx-auto w-full max-w-7xl flex-1 px-5 py-7 pb-16 sm:px-8 lg:px-12"
    >
      <span className="sr-only">Loading product details…</span>
      <div aria-hidden="true">
        <div className="product-skeleton-block mb-8 h-5 w-32 rounded" />
        <div className="grid items-center gap-8 md:grid-cols-2 lg:gap-20">
          <div className="product-skeleton-block aspect-square rounded-2xl" />
          <div className="space-y-7">
            <div className="product-skeleton-block h-4 w-1/4 rounded" />
            <div className="product-skeleton-block h-12 w-3/4 rounded" />
            <div className="product-skeleton-block h-6 w-24 rounded" />
            <div className="product-skeleton-block h-8 w-32 rounded" />
            <div className="product-skeleton-block h-28 rounded" />
          </div>
        </div>
      </div>
    </main>
  );
}
