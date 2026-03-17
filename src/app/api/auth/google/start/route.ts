// ─── Google OAuth Start ─────────────────────────────────────────────────────
// GET /api/auth/google/start
// Redirects user to Google's OAuth consent screen to authorize Calendar access.

import { NextResponse } from "next/server";
import { getAuthUrl } from "@/lib/google-calendar";

export async function GET() {
  const url = getAuthUrl();
  return NextResponse.redirect(url);
}
