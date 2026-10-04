/**
 * Prisma Decimal fields (Payment.amount, Service.fee) arrive as strings over
 * JSON. Never coerce these with Number() for arithmetic — only for display.
 */

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format a Decimal-as-string (or number) into a USD currency string.
 * Returns "$0.00" for null/undefined/NaN.
 */
export function formatCurrency(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === "") return USD.format(0);
  const numeric = typeof value === "number" ? value : Number.parseFloat(value);
  if (Number.isNaN(numeric)) return USD.format(0);
  return USD.format(numeric);
}

const DATE_TIME = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const DATE_ONLY = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
});

/**
 * Format an ISO date string into a readable date-time.
 * Returns "—" for null/undefined/invalid input.
 */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return DATE_TIME.format(date);
}

/**
 * Format an ISO date string into a date-only string.
 */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return DATE_ONLY.format(date);
}

/**
 * Human-readable relative time (e.g., "2 hours ago").
 * Falls back to absolute date for anything older than 30 days.
 */
export function formatRelative(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return "just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  if (diffDay < 30) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  return formatDate(value);
}

/**
 * Truncate a string to a maximum length, appending an ellipsis when clipped.
 */
export function truncate(value: string, max = 80): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}

/**
 * Title-case a SCREAMING_SNAKE_CASE enum value into a human label.
 * "PENDING_PAYMENT" → "Pending Payment".
 */
export function humanizeEnum(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Build initials from a name for avatar fallbacks. "Rakib Hasan" → "RH".
 */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p.charAt(0).toUpperCase()).join("") || "?";
}