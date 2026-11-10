import assert from "node:assert/strict";
import { test } from "node:test";
import type { Product } from "../../catalog/products.types.ts";
import {
  defaultProductFilters,
  filterProducts,
  getProductCategories,
} from "../products.filters.ts";

const products: Product[] = [
  { id: 3, title: "Tote", category: "Bags", priceCents: 3000, inStock: false },
  { id: 1, title: "Boots", category: "Shoes", priceCents: 5000, inStock: true },
  {
    id: 2,
    title: "Belt",
    category: "Accessories",
    priceCents: 3000,
    inStock: true,
  },
];

/**
 * Checks initial filters and the expected reset values; takes no inputs.
 * @returns No value; assertions throw when defaults change unexpectedly.
 */
function checksDefaults(): void {
  assert.deepEqual(defaultProductFilters, {
    query: "",
    category: null,
    sort: "name-asc",
  });
  assert.deepEqual(
    filterProducts(products, defaultProductFilters).map(productId),
    [2, 1, 3],
  );
}

/**
 * Returns a product identity for order assertions.
 * @param product - Product in the sorted output.
 * @returns Its identity.
 */
function productId(product: Product): number {
  return product.id;
}

/**
 * Checks AND filtering, normalized queries and no matches; takes no inputs.
 * @returns No value; assertions throw when matching is incorrect.
 */
function combinesFilters(): void {
  assert.deepEqual(
    filterProducts(products, {
      ...defaultProductFilters,
      query: "  TO  ",
      category: "Bags",
    }).map(productId),
    [3],
  );
  assert.deepEqual(
    filterProducts(products, {
      ...defaultProductFilters,
      query: "Tote",
      category: "Shoes",
    }),
    [],
  );
  assert.deepEqual(
    filterProducts(products, {
      ...defaultProductFilters,
      category: "Shoes",
      query: "Belt",
    }),
    [],
  );
  assert.deepEqual(
    filterProducts(products, { ...defaultProductFilters, query: "missing" }),
    [],
  );
  assert.deepEqual(filterProducts([], defaultProductFilters), []);
}

/**
 * Checks every sort, equal-price ties and source immutability; takes no inputs.
 * @returns No value; assertions throw when ordering or purity fails.
 */
function sortsWithoutMutation(): void {
  const original = structuredClone(products);
  assert.deepEqual(
    filterProducts(products, {
      ...defaultProductFilters,
      sort: "name-desc",
    }).map(productId),
    [3, 1, 2],
  );
  assert.deepEqual(
    filterProducts(products, {
      ...defaultProductFilters,
      sort: "price-asc",
    }).map(productId),
    [2, 3, 1],
  );
  assert.deepEqual(
    filterProducts(products, {
      ...defaultProductFilters,
      sort: "price-desc",
    }).map(productId),
    [1, 2, 3],
  );
  assert.deepEqual(products, original);
  assert.notEqual(filterProducts(products, defaultProductFilters), products);
}

/**
 * Checks full-snapshot categories and stable identity ties; takes no inputs.
 * @returns No value; assertions throw when duplicates or ties are unstable.
 */
function keepsStableChoices(): void {
  assert.deepEqual(getProductCategories([...products, products[0]]), [
    "Accessories",
    "Bags",
    "Shoes",
  ]);
  const sameName: Product[] = [
    { id: 9, title: "Bag", category: "Bags", priceCents: 1, inStock: true },
    { id: 4, title: "Bag", category: "Bags", priceCents: 1, inStock: true },
  ];
  assert.deepEqual(
    filterProducts(sameName, defaultProductFilters).map(productId),
    [4, 9],
  );
}

test("defaults and reset show all products in name order", checksDefaults);
test(
  "combines query and category while retaining out-of-stock matches",
  combinesFilters,
);
test(
  "sorts in four orders without mutating the source snapshot",
  sortsWithoutMutation,
);
test(
  "derives full category choices and deterministic ties",
  keepsStableChoices,
);
