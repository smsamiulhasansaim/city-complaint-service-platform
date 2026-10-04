import { NextResponse, type NextRequest } from "next/server";
import { BACKEND_API_URL } from "@/lib/auth/constants";
import { writeSessionToken } from "@/lib/auth/session";
import type { ApiErrorBody, ApiSuccess, AuthResponse } from "@/lib/api/types";

interface LoginPayload {
  email: string;
  password: string;
}

function isLoginPayload(value: unknown): value is LoginPayload {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.email === "string" && typeof v.password === "string";
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

  if (!isLoginPayload(body)) {
    return NextResponse.json(
      {
        success: false,
        message: "Email and password are required",
        errors: [],
      },
      { status: 422 },
    );
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_API_URL}/auth/login`, {
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
        message: "Login failed",
        errors: [],
      },
      { status: backendRes.status },
    );
  }

  const payload = (await backendRes.json()) as ApiSuccess<AuthResponse>;
  if (!payload.success || !payload.data?.token) {
    return NextResponse.json(
      { success: false, message: "Malformed login response", errors: [] },
      { status: 502 },
    );
  }

  await writeSessionToken(payload.data.token);

  // Do NOT return the token to the browser.
  return NextResponse.json(
    {
      success: true,
      message: payload.message,
      data: { user: payload.data.user },
    },
    { status: 200 },
  );
}

async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}