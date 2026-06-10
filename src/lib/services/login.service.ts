const API_URL = process.env.NEXT_PUBLIC_API_URL;
import Cookies from "js-cookie";
// ─────────────────────────────────────────────
// TYPES — tidak berubah
// ─────────────────────────────────────────────

export interface User {
  id: string;
  nama: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  deviceHash: string;
  deviceLabel: string;
}

export interface LoginResponse {
  requireOtp: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface VerifyOtpRequest {
  email: string;
  deviceHash: string;
  deviceLabel: string;
  code: string;
}

export interface VerifyOtpResponse {
  message: string;
  token: string;
  user: User;
}

// ─────────────────────────────────────────────
// IN-MEMORY SESSION
// Access token disimpan di sini — tidak menyentuh localStorage sama sekali.
// Hilang saat tab/halaman ditutup, tapi silent refresh akan ambil yang baru
// otomatis selama refresh token (httpOnly cookie) masih valid.
// ─────────────────────────────────────────────

interface Session {
  token: string;
  user: User;
}

let _session: Session | null = null;

export function getSession(): Session | null {
  return _session;
}

export function getAccessToken(): string | null {
  return _session?.token ?? null;
}

function setSession(token: string, user: User) {
  _session = { token, user };
}

function clearSession() {
  _session = null;
}

// ─────────────────────────────────────────────
// DEVICE HELPERS — tidak berubah
// ─────────────────────────────────────────────

export function generateDeviceHash(): string {
  const nav = window.navigator;
  const raw = `${nav.userAgent}-${nav.language}-${screen.width}x${screen.height}-${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

export function generateDeviceLabel(): string {
  const ua = window.navigator.userAgent;
  if (/chrome/i.test(ua)) return "Chrome Browser";
  if (/firefox/i.test(ua)) return "Firefox Browser";
  if (/safari/i.test(ua)) return "Safari Browser";
  if (/edg/i.test(ua)) return "Edge Browser";
  return "Unknown Browser";
}

// ─────────────────────────────────────────────
// AUTH API
// ─────────────────────────────────────────────

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // supaya cookie refresh_token diterima browser
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login gagal");

  // Kalau device trusted, langsung simpan ke memory
  if (!data.requireOtp && data.token && data.user) {
    setSession(data.token, data.user);
    Cookies.set("token", data.token, { expires: 1 });
    Cookies.set("role", data.user.role, { expires: 1 });
  }

  return data;
}

export async function verifyOtp(
  payload: VerifyOtpRequest,
): Promise<VerifyOtpResponse> {
  const res = await fetch(`${API_URL}/api/user/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Verifikasi OTP gagal");

  // Simpan ke memory setelah OTP sukses
  setSession(data.token, data.user);
  Cookies.set("token", data.token, { expires: 1 });
  Cookies.set("role", data.user.role, { expires: 1 });

  return data;
}

/**
 * Silent refresh — panggil saat:
 * 1. App pertama kali load (cek apakah cookie masih valid)
 * 2. fetchWithAuth dapat 401 (access token expired)
 *
 * Refresh token dikirim otomatis oleh browser via httpOnly cookie.
 * Return true kalau berhasil, false kalau harus login ulang.
 */
let isRefreshing = false; // Variable di luar fungsi

export async function silentRefresh(): Promise<boolean> {
  if (isRefreshing) return false; // Cegah pemanggilan ganda
  isRefreshing = true;

  try {
    const res = await fetch(`${API_URL}/api/user/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      clearSession();
      // Cookies.remove("token");
      // Cookies.remove("role");
      return false;
    }

    const data = await res.json();
    setSession(data.token, data.user);
    Cookies.set("token", data.token, { expires: 1 });
    Cookies.set("role", data.user.role, { expires: 1 });
    return true;
  } catch {
    clearSession();
    // Cookies.remove("token");
    // Cookies.remove("role");
    return false;
  } finally {
    isRefreshing = false; // Reset lock
  }
}

/**
 * Logout — hapus memory + minta server clear cookie
 */
export async function logout(): Promise<void> {
  try {
    await fetch(`${API_URL}/api/user/logout`, {
      method: "POST",
      credentials: "include",
    });
  } finally {
    clearSession();
    Cookies.remove("token");
    Cookies.remove("role");
  }
}

// ─────────────────────────────────────────────
// FETCH WRAPPER
// Pakai ini untuk semua request yang butuh autentikasi.
// Otomatis sisipkan Authorization header + retry sekali kalau 401.
// ─────────────────────────────────────────────

export async function fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {},
): Promise<Response> {
  const doFetch = (token: string) =>
    fetch(input, {
      ...init,
      credentials: "include",
      headers: {
        ...init.headers,
        Authorization: `Bearer ${token}`,
      },
    });

  const token = getAccessToken();
  if (!token) throw new Error("Tidak ada sesi aktif.");

  const res = await doFetch(token);

  // Access token expired → coba silent refresh sekali
  if (res.status === 401) {
    const refreshed = await silentRefresh();
    if (!refreshed) throw new Error("Sesi berakhir. Silakan login ulang.");

    const newToken = getAccessToken()!;
    return doFetch(newToken);
  }

  return res;
}

export interface PegawaiDropdownItem {
  id: string;
  nama: string;
  prefix?: string | null;
  kode?: string | null;
}

export async function getPegawaiMarketingSales(): Promise<
  PegawaiDropdownItem[]
> {
  const res = await fetch(`${API_URL}/api/user/dropdown/sales`); // endpoint backend
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Gagal mengambil data pegawai");
  }
  const data = await res.json();
  return data.data; // asumsikan response { data: PegawaiDropdownItem[] }
}

export interface PegawaiDetail {
  id: string;
  nama: string;
  nip: string | null;
  prefix: string | null;
  kode: string | null;
  jabatan: string | null;
  departemen: string | null;
  fotoUrl: string | null;
  fotoKey: string | null;
}

export interface UserDetail {
  id: string;
  pegawaiId: string;
  phone: string;
  email: string;
  role: string;
  createdAt: string;
  pegawai: PegawaiDetail; // Relasi data pegawai lengkap
}

export async function getUserDetail(id: string): Promise<UserDetail> {
  // Menggunakan fetchWithAuth karena endpoint ini membutuhkan validasi token
  const res = await fetchWithAuth(`${API_URL}/api/user/detail/${id}`, {
    method: "GET",
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil data detail user");
  }

  return data.data; // Mengembalikan object UserDetail yang berisi gabungan User & Pegawai
}

export interface PegawaiLoginItem {
  id: string;
  nama: string;
  user: {
    lastOnlineAt: string | null;
    lastIpAddress: string | null;
  } | null;
}

export interface PegawaiLoginMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PegawaiLoginResponse {
  data: PegawaiLoginItem[];
  meta: PegawaiLoginMeta;
}

export async function getPegawaiLogin(params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PegawaiLoginResponse> {
  const { page = 1, limit = 10, search = "" } = params;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
  });

  const res = await fetchWithAuth(
    `${API_URL}/api/user/pegawai-login?${query}`,
    {
      method: "GET",
    },
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil data pegawai login");
  }

  return { data: data.data, meta: data.meta };
}
