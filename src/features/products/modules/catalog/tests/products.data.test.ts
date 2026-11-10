import assert from "node:assert/strict";
import { test } from "node:test";
import {
  parseProduct,
  parseProductId,
  parseProducts,
} from "../products.data.ts";

/**
 * Creates an untrusted API record for validation tests.
 * @param overrides - Fields to replace in the valid example.
 * @returns An API-shaped record with the requested changes.
 */
function apiProduct(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    id: 1,
    title: "Tote",
    category_name: "Bags",
    price_cents: 8900,
    in_stock: true,
    ...overrides,
  };
}

/**
 * Checks mapping and valid empty collection behavior; takes no inputs.
 * @returns No value; assertions throw on a contract violation.
 */
function mapsCollection(): void {
  assert.deepEqual(parseProducts({ items: [apiProduct()], total: 1 }), [
    { id: 1, title: "Tote", category: "Bags", priceCents: 8900, inStock: true },
  ]);
  assert.deepEqual(parseProducts({ items: [], total: 0 }), []);
  assert.equal(
    parseProduct(apiProduct({ title: "  Tote  " }), 1).title,
    "Tote",
  );
}

/**
 * Rejects invalid records and incomplete envelopes; takes no inputs.
 * @returns No value; assertions throw if malformed data is accepted.
 */
function rejectsInvalidCollections(): void {
  const invalid: unknown[] = [
    null,
    [],
    {},
    { items: [], total: -1 },
    { items: [], total: 0.5 },
    { items: [apiProduct()], total: 2 },
    { items: [apiProduct(), apiProduct()], total: 2 },
  ];
  const badFields = [
    { id: 0 },
    { id: 1.5 },
    { id: Number.MAX_SAFE_INTEGER + 1 },
    { title: " " },
    { category_name: "" },
    { price_cents: -1 },
    { price_cents: 1.25 },
    { price_cents: Number.MAX_SAFE_INTEGER + 1 },
    { in_stock: "true" },
  ];
  for (const fields of badFields)
    invalid.push({ items: [apiProduct(fields)], total: 1 });
  for (const value of invalid) {
    /**
     * Attempts to parse the current invalid fixture; takes no inputs.
     * @returns No value; parsing must throw.
     */
    function parseInvalid(): void {
      parseProducts(value);
    }
    assert.throws(parseInvalid, /invalid|incomplete|duplicate/i);
  }
}

/**
 * Ensures detail mapping rejects a different product; takes no inputs.
 * @returns No value; assertions throw if the ID guard fails.
 */
function rejectsMismatchedProduct(): void {
  /**
   * Parses a product for the wrong requested ID; takes no inputs.
   * @returns No value; validation must throw.
   */
  function parseWrongProduct(): void {
    parseProduct(apiProduct(), 2);
  }
  assert.throws(parseWrongProduct, /invalid|match/i);
}

/**
 * Checks that URL IDs are canonical positive safe integers; takes no inputs.
 * @returns No value; assertions throw for incorrect ID acceptance.
 */
function validatesRouteIds(): void {
  for (const value of [
    "",
    "0",
    "-1",
    "01",
    "+1",
    "1.0",
    "1e2",
    " 1",
    "1 ",
    "NaN",
    "9007199254740992",
  ]) {
    assert.equal(parseProductId(value), null, value);
  }
  assert.equal(parseProductId("1"), 1);
  assert.equal(parseProductId("9007199254740991"), Number.MAX_SAFE_INTEGER);
}

test("maps complete collections and trims product text", mapsCollection);
test(
  "rejects malformed, incomplete and duplicate catalog data",
  rejectsInvalidCollections,
);
test(
  "rejects an individual response with a different ID",
  rejectsMismatchedProduct,
);
test(
  "accepts only canonical positive safe-integer route IDs",
  validatesRouteIds,
);
