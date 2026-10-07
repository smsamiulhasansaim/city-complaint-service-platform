import "server-only";

import { BACKEND_API_URL } from "@/lib/auth/constants";
import type { ApiSuccess, Category, Service } from "@/lib/api/types";

/**
 * Server-side fetchers for public data.
 *
 * Features:
 * - Next.js ISR caching
 * - Explicit request timeout
 * - Graceful fallback when backend is unavailable
 * - Never sends authentication tokens
 */

const REQUEST_TIMEOUT = 10_000; // 10 seconds

async function serverGet<T>(
  path: string,
  revalidate = 300,
): Promise<T | null> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);

  try {
    const res = await fetch(`${BACKEND_API_URL}${path}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
      next: {
        revalidate,
      },
    });

    if (!res.ok) {
      return null;
    }

    const body = (await res.json()) as ApiSuccess<T>;

    if (!body.success) {
      return null;
    }

    return body.data;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.error(
        `[serverGet] Request timed out after ${REQUEST_TIMEOUT}ms: ${path}`,
      );
    } else {
      console.error(`[serverGet] Request failed: ${path}`, error);
    }

    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export function getPublicCategories(): Promise<Category[] | null> {
  return serverGet<Category[]>("/categories", 3600);
}

export function getPublicServices(): Promise<Service[] | null> {
  return serverGet<Service[]>("/services", 3600);
}