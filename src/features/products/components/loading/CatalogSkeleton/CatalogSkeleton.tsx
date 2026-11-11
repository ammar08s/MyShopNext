import type { ReactElement } from "react";
import "../productSkeleton.css";

interface Props {
  children?: never;
}

/**
 * Matches only the data-dependent category/count row and product cards.
 * @param _props - Empty component props; no configurable inputs.
 * @returns One loading announcement and non-interactive decorative placeholders.
 */
export function CatalogSkeleton(_props: Props): ReactElement {
  /**
   * Renders one decorative card placeholder.
   * @param index - Stable placeholder position.
   * @returns A skeleton card hidden by its decorative parent.
   */
  function renderPlaceholder(index: number): ReactElement {
    return (
      <div
        key={index}
        className="overflow-hidden rounded-2xl border bg-card p-2.5"
      >
        <div className="product-skeleton-block aspect-square rounded-xl" />
        <div className="space-y-4 p-4">
          <div className="product-skeleton-block h-3 w-1/3 rounded" />
          <div className="product-skeleton-block h-4 w-3/4 rounded" />
          <div className="product-skeleton-block h-4 w-1/2 rounded" />
        </div>
      </div>
    );
  }
  return (
    <section role="status" aria-busy="true" className="pt-7">
      <span className="sr-only">Loading the collection…</span>
      <div aria-hidden="true" className="space-y-7">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="space-y-3">
            <div className="product-skeleton-block h-6 w-44 rounded" />
            <div className="product-skeleton-block h-3 w-28 rounded" />
          </div>
          <div className="product-skeleton-block h-16 w-44 max-w-full rounded-xl" />
        </div>
        <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
          {[0, 1, 2, 3, 4, 5].map(renderPlaceholder)}
        </div>
      </div>
    </section>
  );
}
