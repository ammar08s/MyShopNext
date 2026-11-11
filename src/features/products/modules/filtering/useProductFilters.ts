"use client";

import { use } from "react";
import {
  ProductFiltersContext,
  type ProductFilterState,
} from "./products.filters.context";

/**
 * Reads the catalog layout's selection state and actions; takes no inputs.
 * @returns The shared filter contract; throws when used outside CatalogWorkspace.
 */
export function useProductFilters(): ProductFilterState {
  const context = use(ProductFiltersContext);
  if (context === null)
    throw new Error("Product filters require CatalogWorkspace.");
  return context;
}
