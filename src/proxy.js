import { NextResponse } from "next/server";
import { NAVIGATION_URLS,  } from "./constants/AppConstants";

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isSignin = pathname === NAVIGATION_URLS.AUTH_URLS.SIGNIN;
  const isRoot = pathname === NAVIGATION_URLS.BASE_URL;
  const protectedRoutes = ["/users", "/settings", "/time-log"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  if (token && (isSignin || isRoot)) {
    return NextResponse.redirect(
      new URL(NAVIGATION_URLS.USERS, request.url)
    );
  }
  if (!token && (isProtectedRoute || isRoot)) {
    return NextResponse.redirect(
      new URL(NAVIGATION_URLS.AUTH_URLS.SIGNIN, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/signin",
    "/users/:path*",
    "/settings/:path*",
    "/time-log/:path*",
  ],
};
