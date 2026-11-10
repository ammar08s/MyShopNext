import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createDemoCatalogStore,
  demoCatalogStorageKey,
} from "../demoCatalog.store.ts";
import type { DemoCatalogStorage } from "../demoCatalog.types.ts";

/** @param saved - Initial record. @returns A storage adapter confined to this test. */
function memoryStorage(saved: string | null = null): DemoCatalogStorage {
  let record = saved;
  /** @param _key - Requested identity. @returns Saved text or null. */
  function getItem(_key: string): string | null {
    return record;
  }
  /** @param _key - Storage identity. @param value - New JSON text. @returns No value. */
  function setItem(_key: string, value: string): void {
    record = value;
  }
  /** @param _key - Storage identity. @returns No value; clears this test's record. */
  function removeItem(_key: string): void {
    record = null;
  }
  return { getItem, setItem, removeItem };
}

/** @returns No value; takes no inputs and tests hydration, actions and reset persistence. */
function persistsChanges(): void {
  const storage = memoryStorage();
  let accesses = 0;
  /** @returns The test adapter, recording access; takes no inputs. */
  function getStorage(): DemoCatalogStorage {
    accesses += 1;
    return storage;
  }
  const store = createDemoCatalogStore(getStorage);
  assert.equal(accesses, 0);
  assert.equal(store.getSnapshot(), store.getServerSnapshot());
  /** @returns No value; takes no inputs and intentionally performs no work. */
  function listener(): void {}
  store.subscribe(listener);
  assert.equal(store.getSnapshot().status, "ready");
  assert.equal(storage.getItem(demoCatalogStorageKey), null);
  store.createDemoProduct({
    title: "Demo",
    category: "Bags",
    priceCents: 100,
    inStock: true,
  });
  assert.equal(store.getSnapshot().changes.created[0]?.title, "Demo");
  assert.ok(storage.getItem(demoCatalogStorageKey));
  store.updateDemoProduct({
    id: -1,
    title: "Edited demo",
    category: "Shoes",
    priceCents: 250,
    inStock: false,
  });
  assert.equal(store.getSnapshot().changes.created[0]?.priceCents, 250);
  const saved = storage.getItem(demoCatalogStorageKey);
  /** @returns An independent adapter with the saved changes; takes no inputs. */
  function restoredStorage(): DemoCatalogStorage {
    return memoryStorage(saved);
  }
  const restored = createDemoCatalogStore(restoredStorage);
  restored.subscribe(listener);
  assert.equal(restored.getSnapshot().changes.created[0]?.title, "Edited demo");
  store.deleteDemoProduct(-1);
  assert.equal(store.getSnapshot().changes.created.length, 0);
  store.resetDemoCatalog();
  assert.equal(storage.getItem(demoCatalogStorageKey), null);
}

/** @returns No value; takes no inputs and verifies blocked/corrupt storage recovery. */
function survivesFailures(): void {
  /** @returns No value; takes no inputs and performs no work. */
  function listener(): void {}
  /** @returns Never; takes no inputs and simulates blocked storage. */
  function blocked(): DemoCatalogStorage {
    throw new Error("blocked");
  }
  const store = createDemoCatalogStore(blocked);
  store.subscribe(listener);
  assert.ok(store.getSnapshot().warning);
  store.createDemoProduct({
    title: "Visit only",
    category: "Bags",
    priceCents: 0,
    inStock: false,
  });
  assert.equal(store.getSnapshot().changes.created.length, 1);
  assert.ok(store.getSnapshot().warning);
  store.resetDemoCatalog();
  assert.equal(store.getSnapshot().changes.created.length, 0);
  assert.ok(store.getSnapshot().warning);
  /** @returns A malformed adapter; takes no inputs. */
  function corrupt(): DemoCatalogStorage {
    return memoryStorage("not JSON");
  }
  const recovered = createDemoCatalogStore(corrupt);
  recovered.subscribe(listener);
  assert.equal(recovered.getSnapshot().status, "ready");
  assert.equal(recovered.getSnapshot().changes.created.length, 0);
  assert.ok(recovered.getSnapshot().warning);
}

test(
  "hydrates and persists demo CRUD without writing defaults before load",
  persistsChanges,
);
test(
  "keeps the visit usable when catalog storage is blocked or corrupt",
  survivesFailures,
);
