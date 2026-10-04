/**
 * Auth cookie configuration shared between the BFF route handlers and
 * middleware. Keeping this in one place prevents drift.
 */

export const SESSION_COOKIE_NAME =
  process.env.SESSION_COOKIE_NAME;

/** Backend API base URL (server-side only — never exposed to the browser). */
export const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL;

/** Absolute app URL — used for redirects from the BFF. */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL;

/** Cookie lifetime in seconds (matches backend `JWT_EXPIRES_IN=7d`). */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

/** Public route prefixes that never require authentication. */
export const PUBLIC_PATH_PREFIXES = [
  "/",
  "/about",
  "/services",
  "/contact",
  "/faq",
  "/login",
  "/register",
  "/payments/success",
  "/payments/cancel",
] as const;

/** Auth-only path prefixes. */
export const AUTH_PATH_PREFIXES = ["/login", "/register"] as const;

/** Role-scoped route prefixes. */
export const ROLE_PREFIXES = {
  CITIZEN: "/dashboard",
  AGENT: "/provider",
  ADMIN: "/admin",
} as const;