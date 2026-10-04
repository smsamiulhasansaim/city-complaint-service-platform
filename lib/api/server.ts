import "server-only";

import { BACKEND_API_URL } from "@/lib/auth/constants";
import type { ApiSuccess, Category, Service } from "@/lib/api/types";

/**
 * Server-side fetchers for public data. Uses Next.js fetch caching so public
 * pages are cheap. Never called with an auth token.
 */

async function serverGet<T>(path: string, revalidate = 300): Promise<T | null> {
  try {
    const res = await fetch(`${BACKEND_API_URL}${path}`, {
      headers: { Accept: "application/json" },
      next: { revalidate },
    });

    if (!res.ok) return null;

    const body = (await res.json()) as ApiSuccess<T>;
    if (!body.success) return null;

    return body.data;
  } catch {
    return null;
  }
}

export function getPublicCategories(): Promise<Category[] | null> {
  return serverGet<Category[]>("/categories", 3600);
}

export function getPublicServices(): Promise<Service[] | null> {
  return serverGet<Service[]>("/services", 3600);
}