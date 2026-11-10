import type { Product } from "./products.types.ts";

/**
 * Narrows an untrusted value to a non-array record.
 * @param value - Decoded external data.
 * @returns Whether properties can safely be inspected.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Validates and maps one API product without trusting extra fields.
 * @param value - Unknown API record.
 * @returns A normalized product; throws when required fields are invalid.
 */
function mapProduct(value: unknown): Product {
  if (
    !isRecord(value) ||
    typeof value.id !== "number" ||
    !Number.isSafeInteger(value.id) ||
    value.id <= 0 ||
    typeof value.title !== "string" ||
    !value.title.trim() ||
    typeof value.category_name !== "string" ||
    !value.category_name.trim() ||
    typeof value.price_cents !== "number" ||
    !Number.isSafeInteger(value.price_cents) ||
    value.price_cents < 0 ||
    typeof value.in_stock !== "boolean"
  ) {
    throw new Error("Invalid product response.");
  }
  return {
    id: value.id,
    title: value.title.trim(),
    category: value.category_name.trim(),
    priceCents: value.price_cents,
    inStock: value.in_stock,
  };
}

/**
 * Validates a complete collection and rejects duplicate product identities.
 * @param value - Unknown collection envelope decoded from the API.
 * @returns Validated products; throws for invalid, duplicate, or incomplete data.
 */
export function parseProducts(value: unknown): Product[] {
  if (
    !isRecord(value) ||
    !Array.isArray(value.items) ||
    typeof value.total !== "number" ||
    !Number.isSafeInteger(value.total) ||
    value.total < 0
  ) {
    throw new Error("Invalid catalog response.");
  }
  const items: unknown[] = value.items;
  if (value.total !== items.length)
    throw new Error("Incomplete catalog response.");
  const ids = new Set<number>();
  const products: Product[] = [];
  for (const item of items) {
    const product = mapProduct(item);
    if (ids.has(product.id))
      throw new Error("Duplicate product in catalog response.");
    ids.add(product.id);
    products.push(product);
  }
  return products;
}

/**
 * Maps a detail response and guards against a mismatched product.
 * @param value - Unknown individual product record.
 * @param expectedId - Identity requested by the route.
 * @returns The product; throws for invalid fields or a different identity.
 */
export function parseProduct(value: unknown, expectedId: number): Product {
  const product = mapProduct(value);
  if (product.id !== expectedId)
    throw new Error("Product response does not match the requested product.");
  return product;
}

/**
 * Validates a canonical product ID before any network request.
 * @param value - Product route segment.
 * @returns A positive safe integer, or null for an invalid segment.
 */
export function parseProductId(value: string): number | null {
  if (!/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}
