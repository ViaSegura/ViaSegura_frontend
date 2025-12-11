import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_TOKEN } from "@viasegura/constants/cookies";
import {
  PUBLIC_ROUTES,
  PROTECTED_ROUTES,
  AUTH_ROUTES,
} from "@viasegura/constants/routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(COOKIE_TOKEN)?.value;
  const isAuthenticated = !!token && token !== "undefined";

  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(COOKIE_TOKEN);
    return response;
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(PROTECTED_ROUTES[0], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico).*)"],
};
