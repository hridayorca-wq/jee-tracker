import { NextResponse } from "next/server";

// This runs before every page/API request. If the visitor doesn't have a
// valid "you've entered the password" cookie, send them to /login instead.
export function middleware(request) {
  const cookie = request.cookies.get("site_auth");

  if (cookie?.value === process.env.SITE_PASSWORD) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  return NextResponse.redirect(loginUrl);
}

// Protect everything EXCEPT the login page itself, the login API route,
// and Next.js's internal static assets (otherwise the login page can't load).
export const config = {
  matcher: ["/((?!login|api/login|_next/static|_next/image|favicon.ico).*)"],
};
