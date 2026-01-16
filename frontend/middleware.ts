import { NextRequest, NextResponse } from "next/server";

/**
 * Paths that REQUIRE authentication
 */
const PROTECTED_PATHS = ["/dashboard", "/history"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  /**
   * ✅ Allow public & system routes
   */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/access-denied")
  ) {
    return NextResponse.next();
  }

  /**
   * 🔐 Check if current path is protected
   */
  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  /**
   * 🍪 Read token from cookies
   */
  const token = req.cookies.get("access_token")?.value;

  /**
   * 🚫 No token → Access Denied
   */
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/access-denied";
    return NextResponse.redirect(url);
  }

  /**
   * ✅ Token exists → allow access
   */
  return NextResponse.next();
}

/**
 * 🚀 Limit middleware execution to relevant routes
 */
export const config = {
  matcher: ["/dashboard/:path*", "/history/:path*"],
};