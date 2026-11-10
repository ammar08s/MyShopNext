import assert from "node:assert/strict";
import { test } from "node:test";
import { formatProductPrice } from "../products.pricing.ts";

/**
 * Checks integer-cent USD display; takes no inputs.
 * @returns No value; assertions throw when formatting differs.
 */
function formatsUsd(): void {
  assert.equal(formatProductPrice(8900), "$89.00");
  assert.equal(formatProductPrice(1), "$0.01");
  assert.equal(formatProductPrice(0), "$0.00");
}

test("formats integer cents as USD without losing cents", formatsUsd);

/**
 * Checks the largest amount allowed by response validation; takes no inputs.
 * @returns No value; throws if dividing cents loses the exact remainder.
 */
function formatsLargeUsd(): void {
  assert.equal(
    formatProductPrice(Number.MAX_SAFE_INTEGER),
    "$90,071,992,547,409.91",
  );
  assert.equal(
    formatProductPrice(Number.MAX_SAFE_INTEGER - 92),
    "$90,071,992,547,408.99",
  );
}

test(
  "preserves cents across the complete accepted safe-integer range",
  formatsLargeUsd,
);
