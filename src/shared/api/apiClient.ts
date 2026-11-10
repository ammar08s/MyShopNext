import "server-only";

interface ApiReadOptions {
  cache: "no-store";
}

export class ApiError extends Error {
  readonly status: number | null;

  /**
   * Creates a safe request error without retaining an upstream response body.
   * @param message - Controlled diagnostic message.
   * @param status - HTTP status, or null for configuration/network/JSON failures.
   * @returns An error instance for server-side request classification.
   */
  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Executes a bounded server-only GET and decodes its untrusted JSON.
 * @param path - Feature-owned API path.
 * @param options - Explicit uncached read policy owned by the feature.
 * @returns Unknown data; throws ApiError for failed HTTP responses and preserves
 * fetch, JSON, and framework exceptions for the route boundary to handle.
 */
export async function getApiJson(
  path: string,
  options: ApiReadOptions,
): Promise<unknown> {
  const baseUrl =
    process.env.SHOPBOARD_API_BASE_URL ?? "https://shopboard-api.vercel.app";
  const url = new URL(path, baseUrl);
  if (url.protocol !== "https:" && url.protocol !== "http:")
    throw new ApiError("Invalid API configuration.");
  const response = await fetch(url, {
    method: "GET",
    cache: options.cache,
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok)
    throw new ApiError(
      "The product service could not complete the request.",
      response.status,
    );
  const data: unknown = await response.json();
  return data;
}
