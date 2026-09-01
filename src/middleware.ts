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

// Halaman public yang HARUS SELALU bisa diakses tanpa auth (form isi biodata
// peserta, form evaluasi pelatihan, halaman pengumuman link per jadwal, dst).
// Tinggal tambah prefix baru di sini kalau ada halaman public baru — tidak
// perlu ubah logic middleware.
const ALWAYS_PUBLIC_PREFIXES = ["/biodata", "/evaluasi", "/pengumuman"];

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

  if (ALWAYS_PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
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
