import type {
  DemoRole,
  DemoSessionSnapshot,
  DemoSessionStorage,
  DemoSessionStore,
} from "./demoSession.types.ts";

export const demoSessionStorageKey = "shopboard.session.v2";

/**
 * Obtains tab-scoped browser storage only after subscription or an explicit action.
 * @returns Browser sessionStorage; takes no inputs and may throw when blocked.
 */
function browserStorage(): DemoSessionStorage {
  return window.sessionStorage;
}

/**
 * Checks the versioned session marker without trusting decoded JSON.
 * @param value - Unknown parsed browser data.
 * @returns Whether it represents the current demo session format.
 */
function isSavedSession(
  value: unknown,
): value is { version: 2; role: DemoRole } {
  return (
    typeof value === "object" &&
    value !== null &&
    "version" in value &&
    value.version === 2 &&
    "role" in value &&
    (value.role === "user" || value.role === "admin")
  );
}

/**
 * Creates one hydration-safe session owner for a mounted provider.
 * @param getStorage - Lazy storage access; injectable for focused behavior tests.
 * @returns A stable external store with browser-only persistence actions.
 */
export function createDemoSessionStore(
  getStorage: () => DemoSessionStorage = browserStorage,
): DemoSessionStore {
  const initial: DemoSessionSnapshot = {
    status: "loading",
    role: null,
    warning: null,
  };
  let snapshot: DemoSessionSnapshot = initial;
  let hydrated = false;
  const listeners = new Set<() => void>();
  /**
   * Publishes one new snapshot to mounted consumers.
   * @param next - New session status and persistence feedback.
   * @returns No value; notifies current subscribers.
   */
  function publish(next: DemoSessionSnapshot): void {
    snapshot = next;
    for (const listener of listeners) listener();
  }
  /**
   * Loads saved state once after a client subscribes; takes no inputs.
   * @returns No value; unreadable records recover to a usable guest state.
   */
  function hydrate(): void {
    hydrated = true;
    try {
      const saved = getStorage().getItem(demoSessionStorageKey);
      if (saved === null) {
        publish({ status: "guest", role: null, warning: null });
        return;
      }
      const parsed: unknown = JSON.parse(saved);
      if (isSavedSession(parsed)) {
        publish({ status: "signed-in", role: parsed.role, warning: null });
        return;
      }
      publish({
        status: "guest",
        role: null,
        warning:
          "Your saved demo session is no longer valid. You can sign in again.",
      });
    } catch {
      publish({
        status: "guest",
        role: null,
        warning:
          "Your saved demo session couldn’t be read. You can still use the demo for this visit.",
      });
    }
  }
  /**
   * Reads the cached client snapshot without accessing browser storage.
   * @returns The same object until a session action changes it; takes no inputs.
   */
  function getSnapshot(): DemoSessionSnapshot {
    return snapshot;
  }
  /**
   * Keeps server HTML and the first client render in agreement.
   * @returns The stable neutral initial snapshot; takes no inputs.
   */
  function getServerSnapshot(): DemoSessionSnapshot {
    return initial;
  }
  /**
   * Registers a client listener and hydrates after mounting.
   * @param listener - Callback used by React to observe session changes.
   * @returns A cleanup callback that removes only this subscription.
   */
  function subscribe(listener: () => void): () => void {
    listeners.add(listener);
    if (!hydrated) hydrate();
    /** @returns No value; takes no inputs and releases this listener. */
    function unsubscribe(): void {
      listeners.delete(listener);
    }
    return unsubscribe;
  }
  /**
   * Saves a public role marker after locally validated sign-in.
   * @param role - Demo role accepted by the current login portal.
   * @returns No value; failed persistence retains the current visit's session.
   */
  function signIn(role: DemoRole): void {
    hydrated = true;
    let warning: string | null = null;
    try {
      getStorage().setItem(
        demoSessionStorageKey,
        JSON.stringify({ version: 2, role }),
      );
    } catch {
      warning =
        "You’re signed in for this visit. Browser storage is unavailable, so refreshing may sign you out.";
    }
    publish({ status: "signed-in", role, warning });
  }
  /**
   * Clears this tab's demo marker; takes no inputs.
   * @returns No value; blocked storage still signs out the current visit.
   */
  function signOut(): void {
    hydrated = true;
    let warning: string | null = null;
    try {
      getStorage().removeItem(demoSessionStorageKey);
    } catch {
      warning =
        "You’re signed out for this visit. Saved browser data couldn’t be cleared, so the old demo session may return after refresh.";
    }
    publish({ status: "guest", role: null, warning });
  }
  return { getSnapshot, getServerSnapshot, subscribe, signIn, signOut };
}
