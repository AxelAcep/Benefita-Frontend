import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Definisi akses per role ───
const ADMIN_ROLES = ["SUPER_ADMIN", "ADMIN"];
const FINANCE_ROLES = ["SUPER_ADMIN", "ADMIN", "FINANCE"];

// Halaman yang butuh role ADMIN
// Hanya ADMIN
const ADMIN_ONLY_ROUTES = [
  "/karyawan/list-cuti",
  "/karyawan/riwayat-cuti",
  "/training/judul",
  "/training/berita",
  "/keuangan/karyawan",
];

// ADMIN + FINANCE
const FINANCE_ROUTES = ["/keuangan", "/accounting"];

// Halaman yang semua role boleh akses (asal login)
const AUTHENTICATED_ROUTES = ["/login", "/"];

// Public routes (ga perlu login)
const PUBLIC_ROUTES = ["/login", ""];

export function middleware(request: NextRequest) {
  console.log("MIDDLEWARE HIT:", request.nextUrl.pathname);
  const { pathname } = request.nextUrl;

  // Lewatin public routes
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;

  console.log("MIDDLEWARE HIT:", pathname);
  console.log("TOKEN:", token);
  console.log("ROLE:", role);

  // Belum login → redirect ke /login
  if (!token || !role) {
    return NextResponse.redirect(new URL("/login", request.url));
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
