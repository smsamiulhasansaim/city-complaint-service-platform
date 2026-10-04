import "server-only";

import { cookies } from "next/headers";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from "./constants";

/**
 * Server-side session helpers. These run only in Route Handlers / Server
 * Components. The cookie is httpOnly — the browser JS never reads it.
 */

export async function readSessionToken(): Promise<string | null> {
  if (!SESSION_COOKIE_NAME) {
    return null;
  }

  const store = await cookies();
  return store.get(SESSION_COOKIE_NAME)?.value ?? null;
}

export async function writeSessionToken(token: string): Promise<void> {
  if (!SESSION_COOKIE_NAME) {
    throw new Error("Session cookie name is not configured");
  }

  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionToken(): Promise<void> {
  if (!SESSION_COOKIE_NAME) {
    return;
  }

  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}