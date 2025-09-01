import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPrivate =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";
  const accessToken = req.cookies.get("accessToken")?.value;

  if (isPrivate && !accessToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  if (isAuthPage && accessToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/profile";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
