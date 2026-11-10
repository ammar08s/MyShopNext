import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";
import { getProduct, getProducts } from "../products.api.ts";

const apiProduct = {
  id: 1,
  title: "Tote",
  category_name: "Bags",
  price_cents: 8900,
  in_stock: true,
};

/**
 * Checks direct individual reads do not request the collection.
 * @param context - Test context that owns the fetch mock.
 * @returns A promise resolving after detail mapping assertions.
 */
async function readsIndividual(context: TestContext): Promise<void> {
  /**
   * Supplies a product only for the expected individual URL.
   * @param input - URL being requested.
   * @returns A raw product response.
   */
  async function fetchProduct(
    input: string | URL | Request,
  ): Promise<Response> {
    assert.equal(new URL(String(input)).pathname, "/api/products/1");
    return Response.json(apiProduct);
  }
  const fetchMock = context.mock.method(globalThis, "fetch", fetchProduct);
  assert.deepEqual(await getProduct(1), {
    id: 1,
    title: "Tote",
    category: "Bags",
    priceCents: 8900,
    inStock: true,
  });
  assert.equal(fetchMock.mock.callCount(), 1);
}

/**
 * Checks complete collection mapping.
 * @param context - Test context that owns the fetch mock.
 * @returns A promise resolving after collection validation.
 */
async function readsCollection(context: TestContext): Promise<void> {
  /**
   * Supplies the actual collection envelope; takes no inputs.
   * @returns A collection response.
   */
  async function fetchCollection(): Promise<Response> {
    return Response.json({ items: [apiProduct], total: 1 });
  }
  context.mock.method(globalThis, "fetch", fetchCollection);
  assert.equal((await getProducts())[0]?.title, "Tote");
}

/**
 * Keeps expected missing records distinct from failed requests.
 * @param context - Test context that owns the fetch mock.
 * @returns A promise resolving after missing/error assertions.
 */
async function distinguishesMissing(context: TestContext): Promise<void> {
  /**
   * Supplies missing-product feedback; takes no inputs.
   * @returns A 404 response.
   */
  async function missing(): Promise<Response> {
    return new Response(null, { status: 404 });
  }
  context.mock.method(globalThis, "fetch", missing);
  assert.equal(await getProduct(1), null);
  context.mock.restoreAll();
  /**
   * Supplies upstream failure; takes no inputs.
   * @returns A 500 response.
   */
  async function failed(): Promise<Response> {
    return new Response(null, { status: 500 });
  }
  context.mock.method(globalThis, "fetch", failed);
  await assert.rejects(getProduct(1), { name: "ApiError", status: 500 });
}

/**
 * Rejects mismatched identities rather than showing the wrong record.
 * @param context - Test context that owns the fetch mock.
 * @returns A promise resolving after mismatch validation.
 */
async function rejectsWrongRecord(context: TestContext): Promise<void> {
  /**
   * Supplies an unexpected identity; takes no inputs.
   * @returns An individual record for another product.
   */
  async function wrongProduct(): Promise<Response> {
    return Response.json({ ...apiProduct, id: 2 });
  }
  context.mock.method(globalThis, "fetch", wrongProduct);
  await assert.rejects(getProduct(1), /match/);
}

test(
  "reads and validates only the requested individual endpoint",
  readsIndividual,
);
test("reads the complete collection envelope", readsCollection);
test(
  "represents HTTP 404 as missing and propagates HTTP 500",
  distinguishesMissing,
);
test("rejects an individual response with a mismatched ID", rejectsWrongRecord);
