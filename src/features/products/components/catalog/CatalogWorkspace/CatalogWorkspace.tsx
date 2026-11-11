"use client";

import { useState, type ReactElement, type ReactNode } from "react";
import { ProductFiltersContext } from "@/features/products/modules/filtering/products.filters.context";
import { defaultProductFilters } from "@/features/products/modules/filtering/products.filters";
import type { ProductFilters as FilterValues } from "@/features/products/modules/filtering/products.filters.types";
import { ProductFilters } from "../../filtering/ProductFilters/ProductFilters";

interface Props {
  children: ReactNode;
}

/**
 * Keeps frontend controls and their state above product request boundaries.
 * @param props - Server route content, including loading or error fallbacks.
 * @returns Interactive search/sort controls and separately streamed catalog content.
 */
export function CatalogWorkspace({ children }: Props): ReactElement {
  const [filters, setFilters] = useState<FilterValues>(defaultProductFilters);
  /** @param changes - Edited selections. @returns No value; queues a pure selection update. */
  function changeFilters(changes: Partial<FilterValues>): void {
    /** @param current - Latest selections. @returns Merged selections without mutation. */
    function mergeFilters(current: FilterValues): FilterValues {
      return { ...current, ...changes };
    }
    setFilters(mergeFilters);
  }
  /** @returns No value; takes no inputs and restores initial selections. */
  function resetFilters(): void {
    setFilters(defaultProductFilters);
  }
  return (
    <ProductFiltersContext value={{ filters, changeFilters, resetFilters }}>
      <div className="py-7 pb-16">
        <ProductFilters
          values={filters}
          onChange={changeFilters}
          onReset={resetFilters}
        />
        {children}
      </div>
    </ProductFiltersContext>
  );
}
