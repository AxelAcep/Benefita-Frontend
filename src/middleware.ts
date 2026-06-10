import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"];
const FINANCE_ROLES = ["SUPER_ADMIN", "ADMIN", "FINANCE"];

const ADMIN_ONLY_ROUTES = [
  "/karyawan/list-cuti",
  "/karyawan/riwayat-cuti",
  "/training/judul",
  "/training/berita",
  "/keuangan/karyawan",
];

const FINANCE_ROUTES = ["/keuangan", "/accounting"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  // "/" adalah halaman login, kalau sudah login → ke dashboard
  if (pathname === "/") {
    if (token && role) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Belum login → redirect ke "/"
  if (!token || !role) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Cek ADMIN_ONLY_ROUTES
  if (ADMIN_ONLY_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!ADMIN_ROLES.includes(role)) {
      return NextResponse.redirect(
        new URL("/dashboard?forbidden=1", request.url),
      );
    }
  }

  // Cek FINANCE_ROUTES
  if (FINANCE_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!FINANCE_ROLES.includes(role)) {
      return NextResponse.redirect(
        new URL("/dashboard?forbidden=1", request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|assets).*)"],
};
