import { NextResponse, type NextRequest } from "next/server";
import { BACKEND_API_URL } from "@/lib/auth/constants";
import { writeSessionToken } from "@/lib/auth/session";
import type { ApiErrorBody, ApiSuccess, AuthResponse } from "@/lib/api/types";

interface GooglePayload {
  idToken: string;
}

function isGooglePayload(value: unknown): value is GooglePayload {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.idToken === "string" && v.idToken.length > 10;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body", errors: [] },
      { status: 400 },
    );
  }

  if (!isGooglePayload(body)) {
    return NextResponse.json(
      { success: false, message: "A Google idToken is required", errors: [] },
      { status: 422 },
    );
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_API_URL}/auth/google`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Authentication service is unreachable",
        errors: [],
      },
      { status: 502 },
    );
  }

  if (!backendRes.ok) {
    const errorBody = (await safeJson(backendRes)) as ApiErrorBody | null;
    return NextResponse.json(
      errorBody ?? {
        success: false,
        message: "Google login failed",
        errors: [],
      },
      { status: backendRes.status },
    );
  }

  const payload = (await backendRes.json()) as ApiSuccess<AuthResponse>;
  if (!payload.success || !payload.data?.token) {
    return NextResponse.json(
      { success: false, message: "Malformed Google response", errors: [] },
      { status: 502 },
    );
  }

  await writeSessionToken(payload.data.token);

  return NextResponse.json({
    success: true,
    message: payload.message,
    data: { user: payload.data.user },
  });
}

async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}