"use client";

import type { ReactElement } from "react";
import type { Product } from "@/features/products/modules/catalog/products.types";
import { mergeDemoCatalog } from "@/features/products/modules/demo/demoCatalog.changes";
import { useDemoCatalog } from "@/features/products/modules/demo/useDemoCatalog";
import { CatalogSkeleton } from "../../loading/CatalogSkeleton/CatalogSkeleton";
import {
  filterProducts,
  getProductCategories,
} from "@/features/products/modules/filtering/products.filters";
import { useProductFilters } from "@/features/products/modules/filtering/useProductFilters";
import { CatalogToolbar } from "../../filtering/CatalogToolbar/CatalogToolbar";
import { ProductCard } from "../ProductCard/ProductCard";

interface Props {
  products: readonly Product[];
}

/**
 * Applies the layout's selections to server products plus browser-local changes.
 * @param props - Complete validated catalog; it is never copied into state.
 * @returns The filtered collection, empty collection, or no-match feedback.
 */
export function ProductCatalog({ products }: Props): ReactElement {
  const { filters, changeFilters, resetFilters } = useProductFilters();
  const { snapshot } = useDemoCatalog();
  const effectiveProducts = mergeDemoCatalog(products, snapshot.changes);
  const categories = getProductCategories(effectiveProducts);
  const visibleProducts = filterProducts(effectiveProducts, filters);
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
  return (
    <div>
      {snapshot.warning ? (
        <p
          role="status"
          className="mt-5 rounded-xl border bg-card p-4 text-sm text-muted-foreground"
        >
          {snapshot.warning}
        </p>
      ) : null}
      <section aria-label="Products" className="min-w-0">
        <CatalogToolbar
          count={visibleProducts.length}
          categories={categories}
          category={filters.category}
          onChange={changeFilters}
        />
        {visibleProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
            {visibleProducts.map(renderProduct)}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed bg-card px-6 py-16 text-center">
            <h2 className="text-2xl font-medium">
              {effectiveProducts.length === 0
                ? "The collection is empty"
                : "No products found"}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              {effectiveProducts.length === 0
                ? "There aren’t any products to browse right now. Please visit again soon."
                : "Try another search or reset your filters."}
            </p>
            {effectiveProducts.length > 0 ? (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-6 rounded-md bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:bg-primary/90"
              >
                Reset filters
              </button>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
