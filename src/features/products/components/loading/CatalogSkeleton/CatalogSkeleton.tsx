import type { ReactElement } from "react";
import "../productSkeleton.css";

interface Props {
  children?: never;
}

/**
 * Matches the pending filters, toolbar and six-card catalog layout.
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
    <section role="status" aria-busy="true" className="py-7 pb-16">
      <span className="sr-only">Loading the collection…</span>
      <div aria-hidden="true" className="space-y-7">
        <div className="grid gap-4 rounded-2xl border bg-card p-5 sm:grid-cols-[minmax(0,1fr)_14rem_5rem]">
          <div className="product-skeleton-block h-14 rounded-xl" />
          <div className="product-skeleton-block h-14 rounded-xl" />
          <div className="product-skeleton-block h-14 rounded-xl" />
        </div>
        <div>
          <div className="product-skeleton-block mb-5 h-8 w-full rounded" />
          <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
            {[0, 1, 2, 3, 4, 5].map(renderPlaceholder)}
          </div>
        </div>
      </div>
    </section>
  );
}
