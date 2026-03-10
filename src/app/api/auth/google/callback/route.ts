// ─── Google OAuth Callback ──────────────────────────────────────────────────
// GET /api/auth/google/callback?code=...
// Exchanges the authorization code for tokens and stores the refresh token.

import { NextRequest, NextResponse } from "next/server";
import { getTokensFromCode } from "@/lib/google-calendar";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/settings?error=${error}`, request.nextUrl.origin)
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "Missing authorization code" },
      { status: 400 }
    );
  }

  try {
    const tokens = await getTokensFromCode(code);

    if (!tokens.refresh_token) {
      return NextResponse.redirect(
        new URL("/settings?error=no_refresh_token", request.nextUrl.origin)
      );
    }

    // Store the refresh token in settings
    await prisma.settings.upsert({
      where: { id: "app-settings" },
      create: {
        id: "app-settings",
        googleRefreshToken: tokens.refresh_token,
      },
      update: {
        googleRefreshToken: tokens.refresh_token,
      },
    });

    return NextResponse.redirect(
      new URL("/settings?success=google_connected", request.nextUrl.origin)
    );
  } catch (err) {
    console.error("Google OAuth error:", err);
    return NextResponse.redirect(
      new URL("/settings?error=oauth_failed", request.nextUrl.origin)
    );
  }
}
