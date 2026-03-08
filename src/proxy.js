import { NextResponse } from "next/server";
import { NAVIGATION_URLS } from "./constants/AppConstants";
import { verifyToken } from "./utils/verifyToken";

const ROUTE_PERMISSIONS = {
  "/users": ["HR", "MANAGER"],
  "/rules": ["HR"],
  "/time-log": ["EMPLOYEE", "MANAGER"],
  "/settings": ["HR", "EMPLOYEE", "MANAGER"],
};

const ROLE_HOME = {
  HR: "/users",
  MANAGER: "/users",
  EMPLOYEE: "/time-log",
};

export function proxy(request) {
  const decoded = verifyToken(request);
  const { pathname } = request.nextUrl;

  const isSignin = pathname === NAVIGATION_URLS.AUTH_URLS.SIGNIN;
  const isRoot = pathname === NAVIGATION_URLS.BASE_URL;

  if (decoded && (isSignin || isRoot)) {
    return NextResponse.redirect(
      new URL(ROLE_HOME[decoded.role], request.url)
    );
  }

  if (!decoded) {
    if (!isSignin) {
      return NextResponse.redirect(
        new URL(NAVIGATION_URLS.AUTH_URLS.SIGNIN, request.url)
      );
    }
    return NextResponse.next();
  }

  const matchedRoute = Object.keys(ROUTE_PERMISSIONS).find((route) =>
    pathname.startsWith(route)
  );

  if (matchedRoute) {
    const allowedRoles = ROUTE_PERMISSIONS[matchedRoute];

    if (!allowedRoles.includes(decoded.role)) {
      return NextResponse.redirect(
        new URL(ROLE_HOME[decoded.role], request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/signin",
    "/users/:path*",
    "/rules/:path*",
    "/settings/:path*",
    "/time-log/:path*",
  ],
};
