"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  /** Debounce in ms before propagating changes. Default 350. */
  debounceMs?: number;
  ariaLabel?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
  debounceMs = 350,
  ariaLabel = "Search",
}: SearchInputProps) {
  const [local, setLocal] = useState(value);

  // Keep in sync if parent resets externally.
  useEffect(() => {
    setLocal(value);
  }, [value]);

  // Debounced propagation.
  useEffect(() => {
    if (local === value) return;
    const timer = window.setTimeout(() => onChange(local), debounceMs);
    return () => window.clearTimeout(timer);
  }, [local, value, onChange, debounceMs]);

  return (
    <div className={cn("relative w-full", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cn(
          "h-11 w-full rounded-md border-2 border-border-strong bg-surface pl-10 pr-10 text-sm text-ink",
          "placeholder:text-ink-muted/60",
          "outline-none transition-colors focus:border-ink",
        )}
      />
      {local && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setLocal("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}