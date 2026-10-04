"use client";

import { useCallback } from "react";
import { request, type RequestOptions } from "@/lib/api/client";

/**
 * Client-side API caller. Routes every request through the Next.js BFF proxy
 * (`/api/proxy/...`) so the JWT never reaches the browser.
 *
 * The typed endpoint modules (lib/api/endpoints/*) are called from server
 * components or route handlers. In client components, use this hook.
 */

const PROXY_PREFIX = "/api/proxy";

export function useApiAuth() {
  const call = useCallback(
    async <T,>(path: string, options: RequestOptions = {}): Promise<T> => {
      const { method = "GET", body, signal, query } = options;

      const url = new URL(
        `${PROXY_PREFIX}${path.startsWith("/") ? path : `/${path}`}`,
        window.location.origin,
      );
      if (query) {
        for (const [key, value] of Object.entries(query)) {
          if (value === undefined || value === null || value === "") continue;
          url.searchParams.set(key, String(value));
        }
      }

      const res = await fetch(url.toString(), {
        method,
        headers: {
          Accept: "application/json",
          ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        credentials: "include",
        signal,
      });

      const parsed = (await res.json().catch(() => null)) as
        | { success: true; data: T; message: string }
        | { success: false; message: string; errors: unknown[] }
        | null;

      if (!res.ok || !parsed || !parsed.success) {
        const message = parsed && "message" in parsed ? parsed.message : `Request failed (${res.status})`;
        const errors =
          parsed && "errors" in parsed && Array.isArray(parsed.errors)
            ? parsed.errors
            : [];
        throw new ApiProxyError(message, res.status, errors);
      }

      return parsed.data;
    },
    [],
  );

  return { call };
}

export class ApiProxyError extends Error {
  readonly status: number;
  readonly errors: unknown[];

  constructor(message: string, status: number, errors: unknown[] = []) {
    super(message);
    this.name = "ApiProxyError";
    this.status = status;
    this.errors = errors;
  }
}

// Re-export request() for server-component use where the token is available.
export { request };