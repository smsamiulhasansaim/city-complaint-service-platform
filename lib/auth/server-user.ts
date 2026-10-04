import "server-only";

import { BACKEND_API_URL } from "./constants";
import { readSessionToken } from "./session";
import type { ApiSuccess, User } from "@/lib/api/types";

/**
 * Server-side helper to fetch the authenticated user from the backend.
 * Returns `null` when no token is present or the token is invalid.
 */
export async function getServerUser(): Promise<User | null> {
  const token = await readSessionToken();
  if (!token) return null;

  try {
    const res = await fetch(`${BACKEND_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const body = (await res.json()) as ApiSuccess<User>;
    if (!body.success || !body.data) return null;

    return body.data;
  } catch {
    return null;
  }
}