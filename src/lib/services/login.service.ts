const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
  user?: {
    id: string;
    nama: string;
    email: string;
    role: string;
  };
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
  user: {
    id: string;
    nama: string;
    email: string;
    role: string;
  };
}

// Generate device hash dari browser fingerprint sederhana
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

export async function loginUser(payload: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login gagal");
  return data;
}

export async function verifyOtp(payload: VerifyOtpRequest): Promise<VerifyOtpResponse> {
  const res = await fetch(`${API_URL}/api/user/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Verifikasi OTP gagal");
  return data;
}

export function saveSession(token: string, user: VerifyOtpResponse["user"]) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}