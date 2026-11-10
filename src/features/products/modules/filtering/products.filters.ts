import type { Product } from "../catalog/products.types.ts";
import type { ProductFilters } from "./products.filters.types.ts";

export const defaultProductFilters: ProductFilters = {
  query: "",
  category: null,
  sort: "name-asc",
};

/**
 * Derives stable category choices from the full catalog.
 * @param products - Validated server snapshot, before filtering.
 * @returns Unique category names in alphabetical order.
 */
export function getProductCategories(products: readonly Product[]): string[] {
  const categories = new Set<string>();
  for (const product of products) categories.add(product.category);
  return [...categories].sort();
}

/**
 * Applies AND filters and sorts a new array without changing the snapshot.
 * @param products - Complete validated catalog.
 * @param filters - Current local filter selections.
 * @returns Matching products in a deterministic selected order.
 */
export function filterProducts(
  products: readonly Product[],
  filters: ProductFilters,
): Product[] {
  const query = filters.query.trim().toLowerCase();
  /**
   * Checks one product against every selected filter.
   * @param product - Product to evaluate.
   * @returns Whether all selected conditions match.
   */
  function matches(product: Product): boolean {
    if (!product.title.toLowerCase().includes(query)) return false;
    if (filters.category !== null && product.category !== filters.category)
      return false;
    return true;
  }
  /**
   * Orders two products with title and identity tie-breakers.
   * @param left - First product.
   * @param right - Second product.
   * @returns Their selected sort comparison.
   */
  function compare(left: Product, right: Product): number {
    const byName =
      left.title.localeCompare(right.title, "en") || left.id - right.id;
    switch (filters.sort) {
      case "name-desc":
        return (
          right.title.localeCompare(left.title, "en") || left.id - right.id
        );
      case "price-asc":
        return left.priceCents - right.priceCents || byName;
      case "price-desc":
        return right.priceCents - left.priceCents || byName;
      default:
        return byName;
    }
  }
  return products.filter(matches).sort(compare);
}
