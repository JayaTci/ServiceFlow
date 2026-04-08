import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuth = !!req.auth;
  const isAdmin = req.auth?.user?.role === "admin";

  const isPublicPath = pathname === "/login" || pathname === "/register";
  const isAdminPath = pathname.startsWith("/admin");

  if (!isAuth && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuth && isPublicPath) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isAdminPath && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
