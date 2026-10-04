import { NextResponse, type NextRequest } from "next/server";

import {
  AUTH_PATH_PREFIXES,
  PUBLIC_PATH_PREFIXES,
  ROLE_PREFIXES,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/constants";

/**
 * Route-level RBAC.
 *
 * - Public paths pass through.
 * - /login and /register redirect authenticated users to their role home.
 * - Role-prefixed paths require the matching role in the session cookie's
 *   decoded JWT. We decode without verifying — the backend always re-verifies
 *   the token on every request. This proxy is a UX guard, not a security
 *   boundary.
 */

interface JwtClaims {
  id: string;
  role: "CITIZEN" | "AGENT" | "ADMIN";
  exp?: number;
}

function decodeJwtPayload(token: string): JwtClaims | null {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];

    const decoded = atob(
      payload.replace(/-/g, "+").replace(/_/g, "/"),
    );

    const parsed = JSON.parse(decoded) as Partial<JwtClaims>;

    if (
      typeof parsed.id !== "string" ||
      typeof parsed.role !== "string"
    ) {
      return null;
    }

    return parsed as JwtClaims;
  } catch {
    return null;
  }
}

function matchesPrefix(pathname: string, prefix: string): boolean {
  if (prefix === "/") {
    return pathname === "/";
  }

  return (
    pathname === prefix ||
    pathname.startsWith(`${prefix}/`)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookie = SESSION_COOKIE_NAME
    ? request.cookies.get(SESSION_COOKIE_NAME)?.value
    : undefined;

  const claims = cookie ? decodeJwtPayload(cookie) : null;

  const isAuthPath = AUTH_PATH_PREFIXES.some((p) =>
    matchesPrefix(pathname, p),
  );

  const isRolePath = Object.values(ROLE_PREFIXES).some((p) =>
    matchesPrefix(pathname, p),
  );

  const isPublic = PUBLIC_PATH_PREFIXES.some((p) =>
    matchesPrefix(pathname, p),
  );

  // Authenticated users hitting /login or /register
  // → redirect to role home.
  if (isAuthPath && claims) {
    const home = ROLE_PREFIXES[claims.role] ?? "/dashboard";

    return NextResponse.redirect(
      new URL(home, request.url),
    );
  }

  // Role-scoped path without a session
  // → redirect to /login with a returnTo.
  if (isRolePath && !claims) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set("returnTo", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Wrong role for this prefix
  // → redirect to that user's own home.
  if (isRolePath && claims) {
    const allowedHome = ROLE_PREFIXES[claims.role];

    const belongsToThisRole = matchesPrefix(
      pathname,
      allowedHome,
    );

    if (!belongsToThisRole) {
      return NextResponse.redirect(
        new URL(allowedHome, request.url),
      );
    }
  }

  // Non-public, non-auth, non-role paths
  // → pass through.
  void isPublic;

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api).*)",
  ],
};