import { NextResponse, type NextRequest } from "next/server";
import { BACKEND_API_URL } from "@/lib/auth/constants";
import { writeSessionToken } from "@/lib/auth/session";
import type { ApiErrorBody, ApiSuccess, AuthResponse } from "@/lib/api/types";

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

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_API_URL}/auth/register`, {
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
        message: "Registration failed",
        errors: [],
      },
      { status: backendRes.status },
    );
  }

  const payload = (await backendRes.json()) as ApiSuccess<AuthResponse>;
  if (!payload.success || !payload.data?.token) {
    return NextResponse.json(
      { success: false, message: "Malformed register response", errors: [] },
      { status: 502 },
    );
  }

  await writeSessionToken(payload.data.token);

  return NextResponse.json(
    {
      success: true,
      message: payload.message,
      data: { user: payload.data.user },
    },
    { status: 201 },
  );
}

async function safeJson(res: Response): Promise<unknown> {
  try {
    return await res.json();
  } catch {
    return null;
  }
}