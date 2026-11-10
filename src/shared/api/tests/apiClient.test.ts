import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";
import { getApiJson } from "../apiClient.ts";

/**
 * Checks GET policy, timeout and decoded unknown JSON.
 * @param context - Isolated test mocks.
 * @returns A promise resolving when the read assertions pass.
 */
async function readsJson(context: TestContext): Promise<void> {
  const timeoutSignal = new AbortController().signal;
  /**
   * Verifies the bounded timeout policy without waiting for real time.
   * @param milliseconds - Requested timeout duration.
   * @returns The controlled signal that must be forwarded to fetch.
   */
  function createTimeout(milliseconds: number): AbortSignal {
    assert.equal(milliseconds, 10_000);
    return timeoutSignal;
  }
  const timeoutMock = context.mock.method(
    AbortSignal,
    "timeout",
    createTimeout,
  );
  /**
   * Checks the request contract and supplies a JSON response.
   * @param input - URL requested by the API client.
   * @param options - Read-only request policy.
   * @returns A JSON response for the test.
   */
  async function fetchJson(
    input: string | URL | Request,
    options?: RequestInit,
  ): Promise<Response> {
    assert.equal(new URL(String(input)).pathname, "/api/products");
    assert.equal(options?.method, "GET");
    assert.equal(options?.cache, "no-store");
    assert.equal(options?.signal, timeoutSignal);
    return Response.json({ items: [], total: 0 });
  }
  context.mock.method(globalThis, "fetch", fetchJson);
  assert.deepEqual(await getApiJson("/api/products", { cache: "no-store" }), {
    items: [],
    total: 0,
  });
  assert.equal(timeoutMock.mock.callCount(), 1);
}

/**
 * Checks safe errors for failed HTTP, malformed JSON and network failures.
 * @param context - Isolated test mocks.
 * @returns A promise resolving when every failure is classified correctly.
 */
async function rejectsBadReads(context: TestContext): Promise<void> {
  /**
   * Supplies an unsuccessful HTTP response; takes no inputs.
   * @returns A failed response with intentionally private response text.
   */
  async function failedHttp(): Promise<Response> {
    return new Response("private upstream detail", { status: 503 });
  }
  context.mock.method(globalThis, "fetch", failedHttp);
  await assert.rejects(getApiJson("/api/products", { cache: "no-store" }), {
    name: "ApiError",
    status: 503,
  });
  context.mock.restoreAll();
  /**
   * Supplies invalid JSON; takes no inputs.
   * @returns An otherwise successful response containing malformed JSON.
   */
  async function invalidJson(): Promise<Response> {
    return new Response("{bad json", { status: 200 });
  }
  context.mock.method(globalThis, "fetch", invalidJson);
  await assert.rejects(
    getApiJson("/api/products", { cache: "no-store" }),
    SyntaxError,
  );
  context.mock.restoreAll();
  /**
   * Simulates an aborted request; takes no inputs.
   * @returns A rejected promise, as a timed-out fetch would.
   */
  async function abortedFetch(): Promise<Response> {
    throw new DOMException("timeout", "TimeoutError");
  }
  context.mock.method(globalThis, "fetch", abortedFetch);
  await assert.rejects(getApiJson("/api/products", { cache: "no-store" }), {
    name: "TimeoutError",
  });
}

test("executes an uncached GET with a finite abort signal", readsJson);
test(
  "classifies HTTP, JSON and network failures without leaking response text",
  rejectsBadReads,
);

/**
 * Preserves framework exceptions instead of wrapping dynamic-render signals.
 * @param context - Isolated fetch mock owner.
 * @returns A promise resolving when the original exception is preserved.
 */
async function preservesFrameworkErrors(context: TestContext): Promise<void> {
  const marker = new Error("framework render control flow");
  /**
   * Simulates a framework-owned exception; takes no inputs.
   * @returns A rejected promise carrying the original marker.
   */
  async function frameworkFetch(): Promise<Response> {
    throw marker;
  }
  /**
   * Checks exact exception identity.
   * @param error - Rejection received by the caller.
   * @returns Whether the framework can recognize its exception.
   */
  function isOriginal(error: unknown): boolean {
    return error === marker;
  }
  context.mock.method(globalThis, "fetch", frameworkFetch);
  await assert.rejects(
    getApiJson("/api/products", { cache: "no-store" }),
    isOriginal,
  );
}

test(
  "preserves framework control-flow errors from uncached fetch",
  preservesFrameworkErrors,
);
