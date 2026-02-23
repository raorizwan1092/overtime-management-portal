import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isSignin = pathname === "/signin";
  const isRoot = pathname === "/";
  if (token && (isSignin || isRoot)) {
    return NextResponse.redirect(new URL("/users", request.url));
  }
  if (!token && (pathname.startsWith("/users") || isRoot)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/signin", "/users/:path*"],
};
