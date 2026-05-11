"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  silentRefresh,
  logout as authLogout,
  getSession,
  User,
} from "@/lib/services/login.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface AuthContextValue {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
  logout: () => Promise<void>;
}

// ─────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue>({
  user: null,
  status: "loading",
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────

const PUBLIC_ROUTES = ["/", "/forgot-password"];

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

  useEffect(() => {
    async function init() {
      const existing = getSession();
      if (existing) {
        setUser(existing.user);
        setStatus("authenticated");
        return;
      }

      // Refresh terjadi -> memory kosong -> panggil silentRefresh
      const ok = await silentRefresh();

      if (ok) {
        const session = getSession(); // Ambil session yang baru di-set oleh silentRefresh
        setUser(session?.user ?? null);
        setStatus("authenticated");
      } else {
        setUser(null);
        setStatus("unauthenticated");

        // Gunakan pathname.startsWith jika ada sub-route
        if (!PUBLIC_ROUTES.includes(pathname)) {
          router.replace("/"); // Sesuaikan route login kamu
        }
      }
    }

    init();
  }, [pathname]); // Tambahkan pathname agar jika user paksa pindah route saat unauthenticated, dia dicek lagi

  // Guard: kalau sudah resolved, jangan biarkan user authenticated masuk ke /login
  useEffect(() => {
    if (status === "authenticated" && PUBLIC_ROUTES.includes(pathname)) {
      router.replace("/dashboard");
    }
  }, [status, pathname]);

  async function logout() {
    await authLogout();
    setUser(null);
    setStatus("unauthenticated");
    router.replace("/");
  }

  return (
    <AuthContext.Provider value={{ user, status, logout }}>
      {/* Tampilkan loading screen selama cek sesi, hindari flash konten */}
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
