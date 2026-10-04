"use client";

import { useEffect, useState } from "react";

/**
 * Debounce a value by `delay` ms. Useful for search inputs that trigger
 * network requests.
 */
export function useDebounce<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}