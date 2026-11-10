import type { Product } from "../catalog/products.types.ts";
import type {
  DemoCatalogChanges,
  DemoProductValues,
  ProductDraft,
} from "./demoCatalog.types.ts";

/** @returns A fresh empty overlay; takes no inputs and shares no mutable arrays. */
export function createEmptyDemoChanges(): DemoCatalogChanges {
  return { version: 1, nextId: -1, created: [], updated: [], deletedIds: [] };
}

/**
 * Adds a validated product with a monotonic noncolliding local identity.
 * @param changes - Previous overlay.
 * @param values - Validated frontend product values.
 * @returns A new overlay; throws if the safe local identity range is exhausted.
 */
export function addDemoProduct(
  changes: DemoCatalogChanges,
  values: DemoProductValues,
): DemoCatalogChanges {
  if (changes.nextId <= Number.MIN_SAFE_INTEGER)
    throw new Error(
      "The demo product limit was reached. Reset demo changes to continue.",
    );
  return {
    ...changes,
    nextId: changes.nextId - 1,
    created: [...changes.created, { ...values, id: changes.nextId }],
  };
}

/**
 * Saves a full product snapshot as a local creation edit or API override.
 * @param changes - Previous overlay.
 * @param product - Validated product snapshot being saved.
 * @returns A new overlay; rejects deleted/missing local identities.
 */
export function changeDemoProduct(
  changes: DemoCatalogChanges,
  product: Product,
): DemoCatalogChanges {
  if (
    !Number.isSafeInteger(product.id) ||
    product.id === 0 ||
    changes.deletedIds.includes(product.id)
  )
    throw new Error("This product is no longer available for editing.");
  const created: Product[] = [];
  const updated: Product[] = [];
  let found = false;
  for (const item of changes.created) {
    if (item.id === product.id) {
      created.push({ ...product });
      found = true;
    } else created.push(item);
  }
  if (product.id < 0 && !found)
    throw new Error("This demo product no longer exists.");
  for (const item of changes.updated)
    if (item.id !== product.id) updated.push(item);
  if (product.id > 0) updated.push({ ...product });
  return { ...changes, created, updated };
}

/**
 * Removes a local creation or hides an API identity in this browser.
 * @param changes - Previous overlay.
 * @param id - Nonzero safe identity to delete.
 * @returns New changes without altering the shared catalog.
 */
export function removeDemoProduct(
  changes: DemoCatalogChanges,
  id: number,
): DemoCatalogChanges {
  if (!Number.isSafeInteger(id) || id === 0)
    throw new Error("Invalid product identity.");
  /** @param product - Candidate saved product. @returns Whether it survives deletion. */
  function keep(product: Product): boolean {
    return product.id !== id;
  }
  const deletedIds = [...changes.deletedIds];
  if (id > 0 && !deletedIds.includes(id)) deletedIds.push(id);
  return {
    ...changes,
    created: changes.created.filter(keep),
    updated: changes.updated.filter(keep),
    deletedIds,
  };
}

/**
 * Combines the latest server snapshot with browser changes without mutation.
 * @param products - Validated server-owned API records.
 * @param changes - Current browser overlay.
 * @returns Effective storefront products including local creations.
 */
export function mergeDemoCatalog(
  products: readonly Product[],
  changes: DemoCatalogChanges,
): Product[] {
  const overrides = new Map<number, Product>();
  for (const product of changes.updated) overrides.set(product.id, product);
  const deleted = new Set(changes.deletedIds);
  const merged: Product[] = [];
  for (const product of products)
    if (!deleted.has(product.id))
      merged.push(overrides.get(product.id) ?? product);
  return [...merged, ...changes.created];
}

/**
 * Resolves a browser-aware detail record from one individual server read.
 * @param id - Requested route identity.
 * @param apiProduct - Individual API product, or null for a local-only route.
 * @param changes - Saved local changes.
 * @returns The effective product, or null when hidden/missing in this browser.
 */
export function getDemoProduct(
  id: number,
  apiProduct: Product | null,
  changes: DemoCatalogChanges,
): Product | null {
  if (changes.deletedIds.includes(id)) return null;
  for (const product of changes.created) if (product.id === id) return product;
  for (const product of changes.updated) if (product.id === id) return product;
  return apiProduct?.id === id ? apiProduct : null;
}

/**
 * Keeps shared table records separate from saved changes shown beside the editor.
 * @param products - Server API snapshot.
 * @param changes - Current overlay.
 * @returns Only unchanged, non-hidden API records; no duplicate saved rows.
 */
export function getSharedProducts(
  products: readonly Product[],
  changes: DemoCatalogChanges,
): Product[] {
  const excluded = new Set(changes.deletedIds);
  for (const product of changes.updated) excluded.add(product.id);
  const shared: Product[] = [];
  for (const product of products)
    if (!excluded.has(product.id)) shared.push(product);
  return shared;
}

/** @returns A fresh create-product draft; takes no inputs. */
export function createProductDraft(): ProductDraft {
  return { id: null, title: "", category: "", price: "", inStock: true };
}

/**
 * Converts a product to editable form fields without rounding its cents.
 * @param product - Product chosen for editing.
 * @returns One draft copy owned by the editor.
 */
export function productToDraft(product: Product): ProductDraft {
  const cents = product.priceCents % 100;
  return {
    id: product.id,
    title: product.title,
    category: product.category,
    price: `${(product.priceCents - cents) / 100}.${String(cents).padStart(2, "0")}`,
    inStock: product.inStock,
  };
}
