export type ProductSort = "name-asc" | "name-desc" | "price-asc" | "price-desc";

export interface ProductFilters {
  query: string;
  category: string | null;
  sort: ProductSort;
}
