"use client";

import { createContext } from "react";
import type { ProductFilters } from "./products.filters.types";

export interface ProductFilterState {
  filters: ProductFilters;
  changeFilters: (changes: Partial<ProductFilters>) => void;
  resetFilters: () => void;
}

export const ProductFiltersContext = createContext<ProductFilterState | null>(
  null,
);
