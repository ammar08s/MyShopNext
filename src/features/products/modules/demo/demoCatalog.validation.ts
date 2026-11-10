import type { Product } from "../catalog/products.types.ts";
import type {
  DemoCatalogChanges,
  DraftValidation,
  ProductDraft,
  ProductDraftErrors,
} from "./demoCatalog.types.ts";

/** @param value - Unknown browser data. @returns Whether it is a non-array record. */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Checks product form fields and converts decimal USD to exact integer cents.
 * @param draft - Current controlled form values.
 * @returns Normalized values or field-specific errors; never stores/transmits data.
 */
export function validateProductDraft(draft: ProductDraft): DraftValidation {
  const title = draft.title.trim();
  const category = draft.category.trim();
  const price = draft.price.trim();
  const errors: ProductDraftErrors = {};
  if (!title || title.length > 120)
    errors.title = "Use a product name between 1 and 120 characters.";
  if (!category || category.length > 60)
    errors.category = "Use a category between 1 and 60 characters.";
  const [whole = "", fraction = ""] = price.split(".");
  const priceCents = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  if (
    !/^\d+(?:\.\d{1,2})?$/.test(price) ||
    !Number.isSafeInteger(priceCents) ||
    priceCents < 0
  )
    errors.price =
      "Enter a nonnegative USD price with up to two decimal places.";
  if (Object.keys(errors).length > 0) return { success: false, errors };
  return {
    success: true,
    values: { title, category, priceCents, inStock: draft.inStock },
  };
}

/**
 * Parses a canonical route ID, including browser-only negative demo identities.
 * @param value - Dynamic URL segment.
 * @returns A nonzero safe integer or null; negative values must never reach the API.
 */
export function parseProductRouteId(value: string): number | null {
  if (!/^-?[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

/**
 * Validates one browser-owned frontend product record.
 * @param value - Unknown stored product.
 * @param kind - Whether its identity must be created locally or override the API.
 * @returns A safe product; throws for malformed or incorrectly signed identities.
 */
function parseStoredProduct(
  value: unknown,
  kind: "created" | "updated",
): Product {
  if (
    !isRecord(value) ||
    typeof value.id !== "number" ||
    !Number.isSafeInteger(value.id) ||
    value.id === 0 ||
    (kind === "created" ? value.id > 0 : value.id < 0) ||
    typeof value.title !== "string" ||
    !value.title.trim() ||
    value.title.trim().length > 120 ||
    typeof value.category !== "string" ||
    !value.category.trim() ||
    value.category.trim().length > 60 ||
    typeof value.priceCents !== "number" ||
    !Number.isSafeInteger(value.priceCents) ||
    value.priceCents < 0 ||
    typeof value.inStock !== "boolean"
  )
    throw new Error("Invalid saved demo product.");
  return {
    id: value.id,
    title: value.title.trim(),
    category: value.category.trim(),
    priceCents: value.priceCents,
    inStock: value.inStock,
  };
}

/**
 * Validates an entire versioned overlay before it can affect storefront data.
 * @param value - Unknown decoded browser record.
 * @returns Validated local changes; throws for conflicting, duplicate or unsafe data.
 */
export function parseDemoChanges(value: unknown): DemoCatalogChanges {
  if (
    !isRecord(value) ||
    value.version !== 1 ||
    typeof value.nextId !== "number" ||
    !Number.isSafeInteger(value.nextId) ||
    value.nextId >= 0 ||
    !Array.isArray(value.created) ||
    !Array.isArray(value.updated) ||
    !Array.isArray(value.deletedIds)
  )
    throw new Error("Invalid saved demo catalog.");
  const createdItems: unknown[] = value.created;
  const updatedItems: unknown[] = value.updated;
  const deletedItems: unknown[] = value.deletedIds;
  const created: Product[] = [];
  const updated: Product[] = [];
  const deletedIds: number[] = [];
  const ids = new Set<number>();
  for (const item of createdItems) {
    const product = parseStoredProduct(item, "created");
    if (ids.has(product.id) || value.nextId >= product.id)
      throw new Error("Invalid duplicate demo identity or counter.");
    ids.add(product.id);
    created.push(product);
  }
  for (const item of updatedItems) {
    const product = parseStoredProduct(item, "updated");
    if (ids.has(product.id))
      throw new Error("Invalid duplicate demo override.");
    ids.add(product.id);
    updated.push(product);
  }
  for (const id of deletedItems) {
    if (
      typeof id !== "number" ||
      !Number.isSafeInteger(id) ||
      id <= 0 ||
      ids.has(id)
    )
      throw new Error("Invalid conflicting demo deletion.");
    ids.add(id);
    deletedIds.push(id);
  }
  return { version: 1, nextId: value.nextId, created, updated, deletedIds };
}
