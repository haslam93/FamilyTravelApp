import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── PIN Protection Middleware ──────────────────────────────────────────────
// Simple PIN-based gate for the family app. No user accounts needed.
// Set PIN_HASH env var to the SHA-256 hash of your chosen PIN.
// Generate: node -e "console.log(require('crypto').createHash('sha256').update('1234').digest('hex'))"

const PUBLIC_PATHS = ["/api/auth", "/favicon.ico", "/manifest.json", "/icons"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip PIN check for public paths and static files
  if (
    PUBLIC_PATHS.some((path) => pathname.startsWith(path)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  // Skip if no PIN is configured (development mode)
  const pinHash = process.env.PIN_HASH;
  if (!pinHash) {
    return NextResponse.next();
  }

  // Check for valid session cookie
  const sessionCookie = request.cookies.get("family-travel-session");
  if (sessionCookie?.value === pinHash) {
    return NextResponse.next();
  }

  // Redirect to PIN entry page
  if (pathname !== "/pin") {
    const url = request.nextUrl.clone();
    url.pathname = "/pin";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and _next
    "/((?!_next/static|_next/image).*)",
  ],
};
