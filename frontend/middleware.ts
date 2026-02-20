import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;

  // If token is missing, redirect to login
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    // loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/inventory/:path*",
    "/loft/:path*",
    "/lofts/:path*",
    "/birds/:path*",
    "/pigeons/:path*",
    "/health/:path*",
    "/tasks/:path*",
    "/pairings/:path*",
    "/eggs/:path*",
    "/life-events/:path*",
    "/pedigree/:path*",
    "/flock/:path*",
  ],
};
