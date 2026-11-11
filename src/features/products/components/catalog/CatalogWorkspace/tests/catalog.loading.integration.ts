import assert from "node:assert/strict";
import { once } from "node:events";
import {
  createServer,
  type IncomingMessage,
  type Server,
  type ServerResponse,
} from "node:http";
import { test, type TestContext } from "node:test";
import next from "next";

/**
 * Opens an isolated local HTTP server on an available port.
 * @param server - Test fixture or production Next request server.
 * @returns Its local origin; throws when the listener has no TCP address.
 */
async function listen(server: Server): Promise<string> {
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const address = server.address();
  if (address === null || typeof address === "string")
    throw new Error("The test server needs a TCP port.");
  return `http://127.0.0.1:${address.port}`;
}

/**
 * Closes a test listener and any unfinished streaming connections.
 * @param server - HTTP server created by this test only.
 * @returns Completion after all owned connections close.
 */
async function close(server: Server): Promise<void> {
  server.closeAllConnections();
  if (!server.listening) return;
  server.close();
  await once(server, "close");
}

/**
 * Holds the real API boundary to verify controls render before product data.
 * @param context - Native test lifecycle for guaranteed server/environment cleanup.
 * @returns Completion after streamed shell and resolved product assertions.
 */
async function streamsControlsBeforeProducts(
  context: TestContext,
): Promise<void> {
  const product = {
    id: 1,
    title: "Streaming test tote",
    category_name: "Bags",
    price_cents: 2500,
    in_stock: true,
  };
  const pending: { response: ServerResponse | null } = { response: null };
  let collectionReads = 0;
  /** @param request - Local API read. @param response - Held catalog reply. @returns No value; rejects unexpected paths/methods. */
  function serveApi(request: IncomingMessage, response: ServerResponse): void {
    if (request.method !== "GET" || request.url !== "/api/products") {
      response.writeHead(404).end();
      return;
    }
    collectionReads += 1;
    pending.response = response;
  }
  const apiServer = createServer(serveApi);
  const previousBaseUrl = process.env.SHOPBOARD_API_BASE_URL;
  const app = next({ dev: false, dir: process.cwd() });
  const webServer = createServer(app.getRequestHandler());
  /** @returns Completion after releasing all test resources; takes no inputs. */
  async function cleanup(): Promise<void> {
    pending.response?.end(JSON.stringify({ items: [product], total: 1 }));
    await close(webServer);
    await app.close();
    await close(apiServer);
    if (previousBaseUrl === undefined)
      delete process.env.SHOPBOARD_API_BASE_URL;
    else process.env.SHOPBOARD_API_BASE_URL = previousBaseUrl;
  }
  context.after(cleanup);
  process.env.SHOPBOARD_API_BASE_URL = await listen(apiServer);
  const apiRequested = once(apiServer, "request");
  await app.prepare();
  const origin = await listen(webServer);
  const response = await fetch(origin, {
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(10_000),
  });
  assert.equal(response.status, 200);
  assert.ok(response.body);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let html = "";
  while (!html.includes("Loading the collection")) {
    const chunk = await reader.read();
    assert.equal(
      chunk.done,
      false,
      "The pending route should stream a loading state.",
    );
    html += decoder.decode(chunk.value, { stream: true });
  }
  const shell = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  assert.match(
    shell,
    /<input[^>]*id="product-search"[^>]*>/,
    "Search must render before the API completes.",
  );
  assert.match(
    shell,
    /<button[^>]*id="product-sort"[^>]*>/,
    "Fixed sort choices must render before the API completes.",
  );
  assert.doesNotMatch(
    shell,
    /<(?:input|button)[^>]*id="product-(?:search|sort)"[^>]*disabled/,
  );
  assert.doesNotMatch(shell, /Streaming test tote/);
  assert.doesNotMatch(shell, /0 products to explore/);
  await apiRequested;
  assert.ok(
    pending.response,
    "The real server catalog read must reach the fixture.",
  );
  pending.response.setHeader("Content-Type", "application/json");
  pending.response.end(JSON.stringify({ items: [product], total: 1 }));
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    html += decoder.decode(chunk.value, { stream: true });
  }
  assert.match(html, /Streaming test tote/);
  assert.match(html, /href="\/products\/1"/);
  assert.equal(
    collectionReads,
    1,
    "The shell must not add a second catalog request.",
  );
}

test(
  "streams enabled search and sorting while the product API is pending",
  { timeout: 20_000 },
  streamsControlsBeforeProducts,
);
