import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export async function POST(request: NextRequest) {
  const { pin } = await request.json();

  if (!pin || typeof pin !== "string") {
    return NextResponse.json({ error: "PIN is required" }, { status: 400 });
  }

  const pinHash = process.env.PIN_HASH;
  if (!pinHash) {
    // No PIN configured — allow access (development mode)
    const response = NextResponse.json({ success: true });
    response.cookies.set("family-travel-session", "dev-mode", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return response;
  }

  const inputHash = createHash("sha256").update(pin).digest("hex");

  if (inputHash === pinHash) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("family-travel-session", pinHash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return response;
  }

  return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
}
