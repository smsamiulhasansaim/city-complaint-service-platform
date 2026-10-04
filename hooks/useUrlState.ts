"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * Syncs a small object of primitive values with the URL query string.
 * Used for filters, search, sort, and pagination so views are shareable.
 *
 * Default values are omitted from the URL.
 */

export type UrlStateValue = string | number | boolean | null | undefined;

export function useUrlState<T extends Record<string, UrlStateValue>>(
  defaults: T,
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = useMemo<T>(() => {
    const next: Record<string, UrlStateValue> = { ...defaults };
    for (const key of Object.keys(defaults)) {
      const raw = searchParams.get(key);
      if (raw === null) continue;
      const def = defaults[key];
      if (typeof def === "number") {
        const n = Number(raw);
        if (!Number.isNaN(n)) next[key] = n;
      } else if (typeof def === "boolean") {
        next[key] = raw === "true";
      } else {
        next[key] = raw;
      }
    }
    return next as T;
  }, [defaults, searchParams]);

  const setState = useCallback(
    (patch: Partial<T>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        const def = defaults[key as keyof T];
        if (
          value === undefined ||
          value === null ||
          value === "" ||
          value === def
        ) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [defaults, pathname, router, searchParams],
  );

  const reset = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return { state, setState, reset };
}