import assert from "node:assert/strict";
import { test } from "node:test";
import type { Product } from "../../catalog/products.types.ts";
import {
  createEmptyDemoChanges,
  addDemoProduct,
  changeDemoProduct,
  removeDemoProduct,
  mergeDemoCatalog,
  getDemoProduct,
  getSharedProducts,
} from "../demoCatalog.changes.ts";
import {
  parseDemoChanges,
  parseProductRouteId,
  validateProductDraft,
} from "../demoCatalog.validation.ts";

const base: Product[] = [
  {
    id: 1,
    title: "API Tote",
    category: "Bags",
    priceCents: 8900,
    inStock: true,
  },
];
const values = {
  title: "Local bag",
  category: "Bags",
  priceCents: 1250,
  inStock: false,
};

/** @returns No value; takes no inputs and verifies exact validated form values. */
function validatesDraft(): void {
  const draft = {
    id: null,
    title: " Local bag ",
    category: " Bags ",
    price: " 12.50 ",
    inStock: false,
  };
  assert.deepEqual(validateProductDraft(draft), { success: true, values });
  for (const price of ["-1", "1.001", "1e2", "NaN", "", "90071992547409.92"]) {
    assert.equal(
      validateProductDraft({ ...draft, price }).success,
      false,
      price,
    );
  }
  assert.equal(validateProductDraft({ ...draft, title: " " }).success, false);
  assert.equal(
    validateProductDraft({ ...draft, category: "x".repeat(61) }).success,
    false,
  );
  assert.equal(validateProductDraft({ ...draft, price: "0" }).success, true);
  const maximum = validateProductDraft({
    ...draft,
    price: "90071992547409.91",
  });
  assert.ok(maximum.success);
  assert.equal(maximum.values.priceCents, Number.MAX_SAFE_INTEGER);
}

/** @returns No value; takes no inputs and exercises immutable create/edit/delete merges. */
function managesProducts(): void {
  const empty = createEmptyDemoChanges();
  const first = addDemoProduct(empty, values);
  const second = addDemoProduct(first, { ...values, title: "Another" });
  assert.deepEqual(second.created.map(identity), [-1, -2]);
  assert.equal(empty.created.length, 0);
  const editedLocal: Product = { ...values, id: -1, title: "Edited local" };
  const edited = changeDemoProduct(second, editedLocal);
  assert.equal(getDemoProduct(-1, null, edited)?.title, "Edited local");
  const removed = removeDemoProduct(edited, -1);
  const addedAgain = addDemoProduct(removed, values);
  assert.deepEqual(addedAgain.created.map(identity), [-2, -3]);
  const override = changeDemoProduct(addedAgain, {
    ...base[0],
    title: "Edited API",
    priceCents: 1,
  });
  assert.equal(mergeDemoCatalog(base, override)[0]?.title, "Edited API");
  assert.deepEqual(getSharedProducts(base, override), []);
  assert.equal(getDemoProduct(1, base[0], override)?.priceCents, 1);
  const hidden = removeDemoProduct(override, 1);
  assert.equal(getDemoProduct(1, base[0], hidden), null);
  assert.equal(mergeDemoCatalog(base, hidden).length, 2);
  assert.equal(base[0]?.title, "API Tote");
  assert.equal(override.updated.length, 1);
}

/** @param product - Product being inspected. @returns Its internal test identity. */
function identity(product: Product): number {
  return product.id;
}

/** @returns No value; takes no inputs and rejects unsafe browser records. */
function validatesStorage(): void {
  const changes = changeDemoProduct(
    addDemoProduct(createEmptyDemoChanges(), values),
    base[0],
  );
  assert.deepEqual(
    parseDemoChanges(JSON.parse(JSON.stringify(changes))),
    changes,
  );
  const invalid: unknown[] = [
    null,
    {},
    { ...changes, version: 2 },
    { ...changes, nextId: 0 },
    { ...changes, nextId: -1 },
    { ...changes, created: [base[0]] },
    { ...changes, created: [...changes.created, ...changes.created] },
    { ...changes, deletedIds: [1], updated: [base[0]] },
    { ...changes, deletedIds: [-1] },
  ];
  for (const value of invalid) {
    /** @returns No value; takes no inputs and must reject the current invalid fixture. */
    function parseInvalid(): void {
      parseDemoChanges(value);
    }
    assert.throws(parseInvalid, /invalid/i);
  }
}

/** @returns No value; takes no inputs and distinguishes local and shared route identities. */
function validatesRoutes(): void {
  assert.equal(parseProductRouteId("-1"), -1);
  assert.equal(parseProductRouteId("1"), 1);
  for (const value of [
    "0",
    "-0",
    "01",
    "-01",
    "+1",
    "1.0",
    "-9007199254740992",
    "other",
  ])
    assert.equal(parseProductRouteId(value), null);
}

test(
  "validates product drafts with exact cents and useful limits",
  validatesDraft,
);
test(
  "creates, updates, hides and resolves products without mutating the snapshot",
  managesProducts,
);
test(
  "validates versioned overlays and rejects conflicting or duplicate records",
  validatesStorage,
);
test(
  "accepts canonical shared and browser-demo detail routes",
  validatesRoutes,
);
