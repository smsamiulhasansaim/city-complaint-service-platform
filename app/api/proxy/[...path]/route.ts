import { NextResponse, type NextRequest } from "next/server";
import { BACKEND_API_URL } from "@/lib/auth/constants";
import { readSessionToken } from "@/lib/auth/session";

/**
 * Authenticated reverse proxy. The client never sees or stores the JWT;
 * this handler reads the httpOnly session cookie and forwards the request
 * to the backend with a fresh Bearer header.
 *
 * The Stripe webhook lives at /api/payments/webhook and must NOT pass through
 * here (it's a backend-only route). It is intentionally excluded.
 */

export const dynamic = "force-dynamic";

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

async function handle(request: NextRequest, ctx: RouteContext): Promise<Response> {
  const { path } = await ctx.params;

  if (path.length === 0) {
    return NextResponse.json(
      { success: false, message: "Proxy path is required", errors: [] },
      { status: 400 },
    );
  }

  const token = await readSessionToken();
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Not authenticated", errors: [] },
      { status: 401 },
    );
  }

  const target = `${BACKEND_API_URL}/${path.join("/")}${request.nextUrl.search}`;

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  headers.set("Accept", "application/json");

  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const method = request.method;
  let body: BodyInit | undefined;

  if (method !== "GET" && method !== "HEAD") {
    // Forward the raw body without parsing. Preserves multipart and URL-encoded.
    body = await request.arrayBuffer();
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method,
      headers,
      body,
      cache: "no-store",
      redirect: "manual",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Upstream service unreachable", errors: [] },
      { status: 502 },
    );
  }

  // If the session is no longer valid on the backend, clear the cookie.
  if (upstream.status === 401) {
    const response = NextResponse.json(
      { success: false, message: "Session expired", errors: [] },
      { status: 401 },
    );
    response.cookies.delete(process.env.SESSION_COOKIE_NAME ?? "ccsp_session");
    return response;
  }

  const responseContentType = upstream.headers.get("content-type") ?? "";
  const isJson = responseContentType.includes("application/json");

  if (!isJson) {
    const buffer = await upstream.arrayBuffer();
    return new NextResponse(buffer, {
      status: upstream.status,
      headers: {
        "Content-Type": responseContentType || "application/octet-stream",
      },
    });
  }

  const json = (await upstream.json()) as unknown;
  return NextResponse.json(json, { status: upstream.status });
}

export const GET = handle;
export const POST = handle;
export const PATCH = handle;
export const PUT = handle;
export const DELETE = handle;