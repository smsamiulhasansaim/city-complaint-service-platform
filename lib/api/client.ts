/**
 * Typed fetch wrapper for the backend API.
 *
 * - Unwraps the `{ success, message, data, meta }` envelope.
 * - Throws `ApiError` on non-2xx or `{ success: false }` responses.
 * - Automatically attaches the Bearer token when a `token` is provided.
 * - Never logs tokens or sensitive payloads.
 * - The base URL must include the `/api` prefix.
 */

import type { ApiErrorBody, ApiMeta } from "./types";

export class ApiError extends Error {
  readonly status: number;
  readonly errors: unknown[];

  constructor(message: string, status: number, errors: unknown[] = []) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  token?: string | null;
  signal?: AbortSignal;
  /** When true, returns the full envelope (data + meta). Defaults to false. */
  withMeta?: boolean;
  /** Query string params. Undefined/null/empty values are omitted. */
  query?: Record<string, string | number | boolean | null | undefined>;
  /** Optional Next.js fetch cache directives. */
  cache?: RequestCache;
  next?: { revalidate?: number | false; tags?: string[] };
}

export interface EnvelopeResult<T> {
  data: T;
  meta?: ApiMeta;
  message: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

function buildUrl(
  path: string,
  query?: RequestOptions["query"],
): string {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${cleanPath}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function parseEnvelope<T>(
  response: Response,
  withMeta: boolean,
): Promise<T | EnvelopeResult<T>> {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  let payload: unknown = null;
  if (isJson) {
    try {
      payload = await response.json();
    } catch {
      payload = null;
    }
  }

  // Non-2xx — surface the backend error envelope if available.
  if (!response.ok) {
    if (
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      typeof (payload as ApiErrorBody).message === "string"
    ) {
      const body = payload as ApiErrorBody;
      throw new ApiError(body.message, response.status, body.errors ?? []);
    }
    throw new ApiError(
      `Request failed with status ${response.status}`,
      response.status,
      [],
    );
  }

  // 2xx but malformed body — do not silently return undefined.
  if (!payload || typeof payload !== "object" || !("success" in payload)) {
    throw new ApiError(
      "Malformed response from server",
      response.status,
      [],
    );
  }

  const body = payload as
    | { success: true; message: string; data: T; meta?: ApiMeta }
    | ApiErrorBody;

  if (!body.success) {
    throw new ApiError(
      (body as ApiErrorBody).message ?? "Request failed",
      response.status,
      (body as ApiErrorBody).errors ?? [],
    );
  }

  if (withMeta) {
    return {
      data: body.data,
      meta: body.meta,
      message: body.message,
    } satisfies EnvelopeResult<T>;
  }

  return body.data;
}

/**
 * Core request function. Prefer the typed endpoint modules over calling this
 * directly.
 */
export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    token,
    signal,
    withMeta = false,
    query,
    cache,
    next,
  } = options;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, query), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
    cache,
    next,
    credentials: "include",
  });

  const parsed = await parseEnvelope<T>(response, withMeta);
  return parsed as T;
}

/**
 * Request variant that returns `{ data, meta, message }` for list endpoints.
 */
export async function requestWithMeta<T>(
  path: string,
  options: Omit<RequestOptions, "withMeta"> = {},
): Promise<EnvelopeResult<T>> {
  return request<EnvelopeResult<T>>(path, { ...options, withMeta: true });
}