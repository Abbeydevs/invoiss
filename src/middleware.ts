import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;

    const isAuthPage =
      req.nextUrl.pathname.startsWith("/login") ||
      req.nextUrl.pathname.startsWith("/register");
    const isOnboarding = req.nextUrl.pathname.startsWith("/onboarding");
    const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return null;
    }

    if (!isAuth && (isDashboard || isOnboarding)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isAuth) {
      const hasProfile = token?.hasProfile;

      if (!hasProfile && !isOnboarding) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }

      if (hasProfile && isOnboarding) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: () => true,
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding", "/login", "/register"],
};
