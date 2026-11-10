"use client";

import { useState, type ReactElement } from "react";
import type { Product } from "@/features/products/modules/catalog/products.types";
import { mergeDemoCatalog } from "@/features/products/modules/demo/demoCatalog.changes";
import { useDemoCatalog } from "@/features/products/modules/demo/useDemoCatalog";
import { CatalogSkeleton } from "../../loading/CatalogSkeleton/CatalogSkeleton";
import {
  defaultProductFilters,
  filterProducts,
  getProductCategories,
} from "@/features/products/modules/filtering/products.filters";
import type { ProductFilters as FilterValues } from "@/features/products/modules/filtering/products.filters.types";
import { ProductFilters } from "../../filtering/ProductFilters/ProductFilters";
import { CatalogToolbar } from "../../filtering/CatalogToolbar/CatalogToolbar";
import { ProductCard } from "../ProductCard/ProductCard";

interface Props {
  products: readonly Product[];
}

/**
 * Owns local filter selections and derives results from the server snapshot.
 * @param props - Complete validated catalog; it is never copied into state.
 * @returns The filtered collection, empty collection, or no-match feedback.
 */
export function ProductCatalog({ products }: Props): ReactElement {
  const [filters, setFilters] = useState<FilterValues>(defaultProductFilters);
  const { snapshot } = useDemoCatalog();
  const effectiveProducts = mergeDemoCatalog(products, snapshot.changes);
  const categories = getProductCategories(effectiveProducts);
  const visibleProducts = filterProducts(effectiveProducts, filters);
  /**
   * Merges user changes against the latest queued selections.
   * @param changes - Only the selections changed by a control.
   * @returns No value; schedules a pure state update.
   */
  function changeFilters(changes: Partial<FilterValues>): void {
    /**
     * Applies the current control change without losing queued updates.
     * @param current - Most recent filter selections.
     * @returns Updated selections.
     */
    function mergeFilters(current: FilterValues): FilterValues {
      return { ...current, ...changes };
    }
    setFilters(mergeFilters);
  }
  /**
   * Restores every initial filter selection; takes no inputs.
   * @returns No value; schedules one state update.
   */
  function resetFilters(): void {
    setFilters(defaultProductFilters);
  }
  /**
   * Creates a card with a stable product identity.
   * @param product - One matching product.
   * @returns A linked product card.
   */
  function renderProduct(product: Product): ReactElement {
    return <ProductCard key={product.id} product={product} />;
  }
  if (effectiveProducts.length === 0 && snapshot.status === "loading")
    return <CatalogSkeleton />;
  if (effectiveProducts.length === 0) {
    return (
      <section className="my-10 rounded-xl border bg-card px-6 py-16 text-center">
        {snapshot.warning ? (
          <p role="status" className="mb-4 text-sm text-muted-foreground">
            {snapshot.warning}
          </p>
        ) : null}
        <h2 className="text-2xl font-medium">The collection is empty</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          There aren’t any products to browse right now. Please visit again
          soon.
        </p>
      </section>
    );
  }
  return (
    <div className="py-7 pb-16">
      {snapshot.warning ? (
        <p
          role="status"
          className="mb-5 rounded-xl border bg-card p-4 text-sm text-muted-foreground"
        >
          {snapshot.warning}
        </p>
      ) : null}
      <ProductFilters
        categories={categories}
        values={filters}
        onChange={changeFilters}
        onReset={resetFilters}
      />
      <section aria-label="Products" className="min-w-0">
        <CatalogToolbar
          count={visibleProducts.length}
          sort={filters.sort}
          onChange={changeFilters}
        />
        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
            {visibleProducts.map(renderProduct)}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-card px-6 py-16 text-center">
            <h2 className="text-2xl font-medium">No products found</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Try another search or reset your filters.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:bg-primary/90"
            >
              Reset filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
