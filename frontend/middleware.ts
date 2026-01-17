import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware only blocks direct access to protected routes
 * Auth verification happens client-side using localStorage
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public & system routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/access-denied")
  ) {
    return NextResponse.next();
  }

  // Let frontend handle auth via localStorage
  return NextResponse.next();
}

/**
 * Run middleware only for app routes
 */
export const config = {
  matcher: ["/dashboard/:path*", "/history/:path*"],
};