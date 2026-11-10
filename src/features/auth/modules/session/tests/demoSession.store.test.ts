import assert from "node:assert/strict";
import { test } from "node:test";
import {
  createDemoSessionStore,
  demoSessionStorageKey,
} from "../demoSession.store.ts";
import type { DemoSessionStorage } from "../demoSession.types.ts";

/**
 * Creates a tiny sessionStorage substitute without relying on browser globals.
 * @param initial - Optional saved session marker.
 * @returns A storage adapter containing only the test's own record.
 */
function memoryStorage(initial: string | null = null): DemoSessionStorage {
  const records = new Map<string, string>();
  if (initial !== null) records.set(demoSessionStorageKey, initial);
  /** @param key - Record identity. @returns Saved text or null. */
  function getItem(key: string): string | null {
    return records.get(key) ?? null;
  }
  /** @param key - Record identity. @param value - Text to save. @returns No value. */
  function setItem(key: string, value: string): void {
    records.set(key, value);
  }
  /** @param key - Record identity. @returns No value; removes the saved record. */
  function removeItem(key: string): void {
    records.delete(key);
  }
  return { getItem, setItem, removeItem };
}

/**
 * Proves hydration does not read browser storage during rendering.
 * @returns No value; takes no inputs and throws when snapshots are unstable.
 */
function hydratesOnSubscription(): void {
  const storage = memoryStorage(JSON.stringify({ version: 2, role: "admin" }));
  let reads = 0;
  /** @returns The saved adapter, recording each access; takes no inputs. */
  function getStorage(): DemoSessionStorage {
    reads += 1;
    return storage;
  }
  const store = createDemoSessionStore(getStorage);
  assert.equal(store.getSnapshot().status, "loading");
  assert.equal(store.getSnapshot().role, null);
  assert.equal(store.getSnapshot(), store.getServerSnapshot());
  assert.equal(store.getSnapshot(), store.getSnapshot());
  assert.equal(reads, 0);
  /** @returns No value; takes no inputs and records no side effects. */
  function listener(): void {}
  const unsubscribe = store.subscribe(listener);
  assert.equal(store.getSnapshot().status, "signed-in");
  assert.equal(reads, 1);
  assert.equal(store.getSnapshot().role, "admin");
  unsubscribe();
}

/**
 * Checks persistence, notification and sign-out without storing credentials.
 * @returns No value; takes no inputs and throws if lifecycle behavior differs.
 */
function persistsSession(): void {
  const storage = memoryStorage();
  /** @returns The test's storage; takes no inputs. */
  function getStorage(): DemoSessionStorage {
    return storage;
  }
  const store = createDemoSessionStore(getStorage);
  let notifications = 0;
  /** @returns No value; takes no inputs and counts changes. */
  function listener(): void {
    notifications += 1;
  }
  const unsubscribe = store.subscribe(listener);
  assert.equal(store.getSnapshot().status, "guest");
  assert.equal(store.getSnapshot().role, null);
  store.signIn("user");
  assert.equal(store.getSnapshot().role, "user");
  assert.equal(store.getSnapshot().status, "signed-in");
  assert.deepEqual(
    JSON.parse(storage.getItem(demoSessionStorageKey) ?? "null"),
    { version: 2, role: "user" },
  );
  store.signOut();
  assert.equal(store.getSnapshot().status, "guest");
  assert.equal(store.getSnapshot().role, null);
  assert.equal(storage.getItem(demoSessionStorageKey), null);
  unsubscribe();
  const previous = notifications;
  store.signIn("user");
  assert.equal(store.getSnapshot().role, "user");
  assert.equal(notifications, previous);
}

/**
 * Recovers invalid or unavailable saved state and failed writes.
 * @returns No value; takes no inputs and throws if the demo becomes unusable.
 */
function survivesStorageFailures(): void {
  /** @returns No value; takes no inputs and performs no work. */
  function listener(): void {}
  for (const saved of [
    "not json",
    "null",
    '{"version":2,"signedIn":true}',
    '{"version":1,"signedIn":true}',
    '{"version":2,"role":"owner"}',
    '{"version":1,"signedIn":"yes"}',
  ]) {
    const storage = memoryStorage(saved);
    /** @returns The invalid-record adapter; takes no inputs. */
    function getStorage(): DemoSessionStorage {
      return storage;
    }
    const store = createDemoSessionStore(getStorage);
    store.subscribe(listener);
    assert.equal(store.getSnapshot().status, "guest");
    assert.equal(store.getSnapshot().role, null);
    assert.ok(store.getSnapshot().warning);
  }
  /** @returns Never; takes no inputs and simulates blocked browser storage. */
  function blockedStorage(): DemoSessionStorage {
    throw new Error("blocked");
  }
  const store = createDemoSessionStore(blockedStorage);
  store.subscribe(listener);
  store.signIn("user");
  assert.equal(store.getSnapshot().role, "user");
  assert.equal(store.getSnapshot().status, "signed-in");
  assert.ok(store.getSnapshot().warning);
  store.signOut();
  assert.equal(store.getSnapshot().status, "guest");
  assert.equal(store.getSnapshot().role, null);
  assert.ok(store.getSnapshot().warning);
}

test(
  "hydrates saved sessions only after subscribing and keeps snapshots stable",
  hydratesOnSubscription,
);
test(
  "persists only a session marker and supports sign-out/unsubscribe",
  persistsSession,
);
test(
  "recovers corrupt, unsupported and blocked storage in the current visit",
  survivesStorageFailures,
);

/**
 * Keeps actions usable when storage can be read but cannot be changed.
 * @returns No value; takes no inputs and verifies persistence warnings.
 */
function survivesFailedWrites(): void {
  const marker = JSON.stringify({ version: 2, role: "admin" });
  /** @param _key - Requested storage identity. @returns The existing marker. */
  function getItem(_key: string): string {
    return marker;
  }
  /** @param _key - Record identity. @param _value - Proposed value. @returns Never; simulates quota failure. */
  function setItem(_key: string, _value: string): void {
    throw new Error("quota exceeded");
  }
  /** @param _key - Record identity. @returns Never; simulates failed removal. */
  function removeItem(_key: string): void {
    throw new Error("blocked removal");
  }
  /** @returns A read-only adapter; takes no inputs. */
  function getStorage(): DemoSessionStorage {
    return { getItem, setItem, removeItem };
  }
  /** @returns No value; takes no inputs and performs no work. */
  function listener(): void {}
  const store = createDemoSessionStore(getStorage);
  store.subscribe(listener);
  assert.equal(store.getSnapshot().status, "signed-in");
  store.signIn("user");
  assert.equal(store.getSnapshot().role, "user");
  assert.equal(store.getSnapshot().status, "signed-in");
  assert.match(store.getSnapshot().warning ?? "", /refresh/i);
  store.signOut();
  assert.equal(store.getSnapshot().status, "guest");
  assert.equal(store.getSnapshot().role, null);
  assert.match(store.getSnapshot().warning ?? "", /return after refresh/i);
}

test(
  "keeps sign-in and sign-out usable after quota/removal failures",
  survivesFailedWrites,
);
