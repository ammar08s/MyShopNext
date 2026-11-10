import type { Product } from "../catalog/products.types.ts";
import {
  addDemoProduct,
  changeDemoProduct,
  createEmptyDemoChanges,
  removeDemoProduct,
} from "./demoCatalog.changes.ts";
import { parseDemoChanges } from "./demoCatalog.validation.ts";
import type {
  DemoCatalogChanges,
  DemoCatalogSnapshot,
  DemoCatalogStorage,
  DemoCatalogStore,
  DemoProductValues,
} from "./demoCatalog.types.ts";

export const demoCatalogStorageKey = "shopboard.catalog.v1";
/** @returns Browser localStorage; takes no inputs and may throw when blocked. */
function browserStorage(): DemoCatalogStorage {
  return window.localStorage;
}

/**
 * Creates one hydration-safe owner for browser-local product mutations.
 * @param getStorage - Lazy browser storage accessor, injectable for tests.
 * @returns Stable snapshots and explicit local CRUD actions; never contacts the API.
 */
export function createDemoCatalogStore(
  getStorage: () => DemoCatalogStorage = browserStorage,
): DemoCatalogStore {
  const initial: DemoCatalogSnapshot = {
    status: "loading",
    changes: createEmptyDemoChanges(),
    warning: null,
  };
  let snapshot = initial;
  let hydrated = false;
  const listeners = new Set<() => void>();
  /** @param next - New snapshot. @returns No value; publishes to current subscribers. */
  function publish(next: DemoCatalogSnapshot): void {
    snapshot = next;
    for (const listener of listeners) listener();
  }
  /** @returns No value; takes no inputs and hydrates once after subscription. */
  function hydrate(): void {
    hydrated = true;
    try {
      const saved = getStorage().getItem(demoCatalogStorageKey);
      publish({
        status: "ready",
        changes:
          saved === null
            ? createEmptyDemoChanges()
            : parseDemoChanges(JSON.parse(saved)),
        warning: null,
      });
    } catch {
      publish({
        status: "ready",
        changes: createEmptyDemoChanges(),
        warning:
          "Your saved demo changes couldn’t be read. You can still make changes for this visit.",
      });
    }
  }
  /** @returns The cached snapshot; takes no inputs and performs no storage access. */
  function getSnapshot(): DemoCatalogSnapshot {
    return snapshot;
  }
  /** @returns The stable server/first-client snapshot; takes no inputs. */
  function getServerSnapshot(): DemoCatalogSnapshot {
    return initial;
  }
  /** @param listener - React snapshot listener. @returns Cleanup for this subscription. */
  function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    if (!hydrated) hydrate();
    /** @returns No value; takes no inputs and releases this listener. */
    function unsubscribe(): void {
      listeners.delete(listener);
    }
    return unsubscribe;
  }
  /** @returns Loaded changes; takes no inputs and throws before hydration. */
  function readyChanges(): DemoCatalogChanges {
    if (snapshot.status !== "ready")
      throw new Error("Wait for your saved changes to load.");
    return snapshot.changes;
  }
  /** @param changes - Next validated overlay. @returns No value; saves or keeps changes for this visit. */
  function persist(changes: DemoCatalogChanges): void {
    let warning: string | null = null;
    try {
      getStorage().setItem(demoCatalogStorageKey, JSON.stringify(changes));
    } catch {
      warning =
        "Your changes work for this visit, but couldn’t be saved. Refreshing may restore older product data.";
    }
    publish({ status: "ready", changes, warning });
  }
  /** @param values - Validated form values. @returns No value; creates only a browser demo product. */
  function createDemoProduct(values: DemoProductValues): void {
    persist(addDemoProduct(readyChanges(), values));
  }
  /** @param product - Validated edited snapshot. @returns No value; saves only a browser override. */
  function updateDemoProduct(product: Product): void {
    persist(changeDemoProduct(readyChanges(), product));
  }
  /** @param id - Product identity. @returns No value; deletes/hides only in this browser. */
  function deleteDemoProduct(id: number): void {
    persist(removeDemoProduct(readyChanges(), id));
  }
  /** @returns No value; takes no inputs and clears only this browser's demo catalog record. */
  function resetDemoCatalog(): void {
    readyChanges();
    let warning: string | null = null;
    try {
      getStorage().removeItem(demoCatalogStorageKey);
    } catch {
      warning =
        "Demo changes are cleared for this visit, but saved data couldn’t be removed and may return after refresh.";
    }
    publish({ status: "ready", changes: createEmptyDemoChanges(), warning });
  }
  return {
    getSnapshot,
    getServerSnapshot,
    subscribe,
    createDemoProduct,
    updateDemoProduct,
    deleteDemoProduct,
    resetDemoCatalog,
  };
}
