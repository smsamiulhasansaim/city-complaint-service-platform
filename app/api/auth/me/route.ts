import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/auth/server-user";

export async function GET() {
  const user = await getServerUser();

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Not authenticated", errors: [] },
      { status: 401 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Current user fetched",
    data: user,
  });
}