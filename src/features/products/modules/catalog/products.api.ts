import "server-only";
import { cache } from "react";
import { ApiError, getApiJson } from "../../../../shared/api/apiClient.ts";
import { parseProduct, parseProducts } from "./products.data.ts";
import type { Product } from "./products.types.ts";

/**
 * Reads and validates the complete shared catalog; takes no inputs.
 * @returns Validated products; throws for request or response failures.
 */
export async function getProducts(): Promise<Product[]> {
  const data = await getApiJson("/api/products", { cache: "no-store" });
  return parseProducts(data);
}

/**
 * Reads one product without downloading the collection.
 * @param id - Positive safe-integer identity validated by the route.
 * @returns The matching product, or null for HTTP 404; throws for other failures.
 */
async function readProduct(id: number): Promise<Product | null> {
  if (!Number.isSafeInteger(id) || id <= 0)
    throw new Error("Invalid product identity.");
  try {
    const data = await getApiJson(`/api/products/${id}`, { cache: "no-store" });
    return parseProduct(data, id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/**
 * Shares an individual read between metadata and page rendering within one request.
 * @param id - Positive safe-integer product identity.
 * @returns A matching product or null for HTTP 404; propagates other failures.
 */
export const getProduct = cache(readProduct);
