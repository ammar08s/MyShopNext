import type { Product } from "../catalog/products.types.ts";

export interface DemoProductValues {
  title: string;
  category: string;
  priceCents: number;
  inStock: boolean;
}
export interface ProductDraft {
  id: number | null;
  title: string;
  category: string;
  price: string;
  inStock: boolean;
}
export interface ProductDraftErrors {
  title?: string;
  category?: string;
  price?: string;
}
export type DraftValidation =
  | { success: true; values: DemoProductValues }
  | { success: false; errors: ProductDraftErrors };
export interface DemoCatalogChanges {
  readonly version: 1;
  readonly nextId: number;
  readonly created: readonly Product[];
  readonly updated: readonly Product[];
  readonly deletedIds: readonly number[];
}
export interface DemoCatalogSnapshot {
  status: "loading" | "ready";
  changes: DemoCatalogChanges;
  warning: string | null;
}
export interface DemoCatalogStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}
export interface DemoCatalogStore {
  getSnapshot: () => DemoCatalogSnapshot;
  getServerSnapshot: () => DemoCatalogSnapshot;
  subscribe: (listener: () => void) => () => void;
  createDemoProduct: (values: DemoProductValues) => void;
  updateDemoProduct: (product: Product) => void;
  deleteDemoProduct: (id: number) => void;
  resetDemoCatalog: () => void;
}
export interface DemoCatalogContextValue {
  snapshot: DemoCatalogSnapshot;
  createDemoProduct: (values: DemoProductValues) => void;
  updateDemoProduct: (product: Product) => void;
  deleteDemoProduct: (id: number) => void;
  resetDemoCatalog: () => void;
}
