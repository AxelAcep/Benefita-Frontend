"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  silentRefresh,
  logout as authLogout,
  getSession,
  getAccessToken,
  User,
} from "@/lib/services/login.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
  logout: () => Promise<void>;
  setAuthenticated: (user: User) => void;
}

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>({
  user: null,
  status: "loading",
  logout: async () => {},
  setAuthenticated: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────

// Guest-only: kalau status === "authenticated", di-redirect ke /dashboard
// (supaya user yang sudah login tidak balik lagi ke halaman login/forgot-password).
const GUEST_ONLY_ROUTES = ["/", "/forgot-password"];

function isGuestOnlyRoute(pathname: string): boolean {
  return GUEST_ONLY_ROUTES.includes(pathname);
}

// Always-public: harus SELALU bisa diakses, baik authenticated maupun
// unauthenticated. TIDAK PERNAH di-redirect kemanapun oleh guard di bawah.
// Prefix match karena ada dynamic segment ([id] / [noJadwal]). Tinggal
// tambah prefix baru di sini kalau ada halaman public baru — samakan dengan
// ALWAYS_PUBLIC_PREFIXES di middleware.ts.
const ALWAYS_PUBLIC_PREFIXES = ["/biodata", "/evaluasi", "/pengumuman"];

function isAlwaysPublicRoute(pathname: string): boolean {
  return ALWAYS_PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

// ─────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  // Pastikan init hanya jalan SEKALI, tidak terpengaruh re-render
  const initialized = useRef(false);

  // ── 1. Init session — hanya sekali saat mount ──────────────────────────────
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function init() {
      try {
        // Cek session di memory dulu
        const existing = getSession();
        if (existing) {
          setUser(existing.user);
          setStatus("authenticated");
          return;
        }

        // Memory kosong (misal habis refresh) → coba silent refresh via cookie
        const ok = await silentRefresh();

        if (ok) {
          const session = getSession();
          setUser(session?.user ?? null);
          setStatus("authenticated");
          return;
        }

        // Silent refresh gagal → fallback cek token & session sekali lagi
        const token = getAccessToken();
        const session = getSession();

        if (token && session) {
          setUser(session.user);
          setStatus("authenticated");
          return;
        }

        // Benar-benar tidak ada sesi yang valid
        setUser(null);
        setStatus("unauthenticated");
      } catch {
        // Jangan sampai error apapun (network, dll) menyebabkan logout paksa
        // Cek manual apakah masih ada session/token sebelum putuskan unauthenticated
        const token = getAccessToken();
        const session = getSession();

        if (token && session) {
          setUser(session.user);
          setStatus("authenticated");
        } else {
          setUser(null);
          setStatus("unauthenticated");
        }
      }
    }

    init();
  }, []); // ← KOSONG, hanya jalan sekali saat mount

  // ── 2. Route guard — jalan setiap pathname berubah, tapi TUNGGU status resolved ──
  useEffect(() => {
    // Belum selesai init, jangan redirect dulu
    if (status === "loading") return;

    // Always-public route (mis. /biodata/[id]): render apa adanya, tidak
    // pernah di-redirect ke manapun, baik authenticated maupun unauthenticated.
    if (isAlwaysPublicRoute(pathname)) return;

    const isGuestOnly = isGuestOnlyRoute(pathname);

    if (status === "unauthenticated" && !isGuestOnly) {
      router.replace("/");
      return;
    }

    if (status === "authenticated" && isGuestOnly) {
      router.replace("/dashboard");
      return;
    }
  }, [status, pathname]); // ← pathname di sini aman karena ada guard status === "loading"

  // ── 3. Set authenticated — dipanggil manual setelah login/verify OTP sukses ──
  // Tanpa ini, `status` tetap "unauthenticated" (hasil init sebelum login) sampai
  // ada hard reload, sehingga route guard di atas salah mem-bounce navigasi
  // client-side berikutnya ke "/".
  function setAuthenticated(newUser: User) {
    setUser(newUser);
    setStatus("authenticated");
  }

  // ── 4. Logout ──────────────────────────────────────────────────────────────
  async function logout() {
    try {
      await authLogout();
    } catch {
      // Tetap lanjut logout di sisi client meski API gagal
    } finally {
      setUser(null);
      setStatus("unauthenticated");
      router.replace("/");
    }
  }

  return (
    <AuthContext.Provider value={{ user, status, logout, setAuthenticated }}>
      {status === "loading" ? <AuthLoadingScreen /> : children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────
// LOADING SCREEN
// ─────────────────────────────────────────────

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-zinc-400">Memuat sesi...</p>
      </div>
    </div>
  );
}
