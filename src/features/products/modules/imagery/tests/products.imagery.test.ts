import assert from "node:assert/strict";
import { test } from "node:test";
import { getProductArtworkIndex } from "../products.imagery.ts";

/**
 * Checks the ordered atlas mapping and honest unknown-category fallback.
 * @returns No value; takes no inputs and throws when a tile is incorrect.
 */
function mapsArtwork(): void {
  assert.equal(getProductArtworkIndex(" Leather Tote Bag ", "Bags"), 0);
  assert.equal(getProductArtworkIndex("WHITE SNEAKERS", "Shoes"), 3);
  assert.equal(getProductArtworkIndex("Silver Watch", "Accessories"), 7);
  assert.equal(getProductArtworkIndex("Leather Belt", "Accessories"), 11);
  assert.equal(getProductArtworkIndex("Another bag", "Bags"), 0);
  assert.equal(getProductArtworkIndex("Another shoe", "Shoes"), 3);
  assert.equal(getProductArtworkIndex("Unknown item", "Electronics"), null);
}

test("maps product titles to matching illustrative atlas cells", mapsArtwork);
