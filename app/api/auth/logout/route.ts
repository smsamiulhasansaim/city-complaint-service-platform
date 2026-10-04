import { NextResponse } from "next/server";
import { clearSessionToken } from "@/lib/auth/session";

export async function POST() {
  await clearSessionToken();
  return NextResponse.json({ success: true, message: "Logged out", data: null });
}