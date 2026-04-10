"use client";

import { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icons } from "@/assets";
import {
  loginUser,
  verifyOtp,
  saveSession,
  generateDeviceHash,
  generateDeviceLabel,
} from "@/lib/services/login.service";

export default function LoginPage() {
  const router = useRouter();

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // OTP state
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpMeta, setOtpMeta] = useState<{
    deviceHash: string;
    deviceLabel: string;
  } | null>(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isLoginValid = email && password;
  const isOtpValid = otpCode.length === 6;

  async function handleLogin() {
    setLoading(true);
    setError("");
    try {
      const deviceHash = generateDeviceHash();
      const deviceLabel = generateDeviceLabel();

      const res = await loginUser({ email, password, deviceHash, deviceLabel });

      if (res.requireOtp) {
        // Simpan meta untuk dikirim ulang saat verify OTP
        setOtpMeta({ deviceHash, deviceLabel });
        setIsOtpStep(true);
      } else {
        // Langsung masuk
        saveSession(res.token!, res.user!);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    if (!otpMeta) return;
    setLoading(true);
    setError("");
    try {
      const res = await verifyOtp({
        email,
        deviceHash: otpMeta.deviceHash,
        deviceLabel: otpMeta.deviceLabel,
        code: otpCode,
      });
      saveSession(res.token, res.user);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8">
            <Image src={Icons.Benefita} alt="Logo Benefita" className="w-full h-full object-contain" width={32} height={32} />
          </div>
          <div>
            <div className="text-sm font-bold text-zinc-800 leading-tight">CRM Benefita</div>
            <div className="text-[10px] text-zinc-400 tracking-widest uppercase leading-tight">Portal Perusahaan</div>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 w-full max-w-sm px-8 py-10">

          {!isOtpStep ? (
            <>
              {/* Title */}
              <h1 className="text-center text-xl font-bold text-zinc-800 mb-1">Selamat Datang Kembali</h1>
              <p className="text-center text-sm text-zinc-400 mb-7">Masuk ke akun Anda untuk melanjutkan.</p>

              {/* Error */}
              {error && (
                <div className="mb-4 text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm text-zinc-600 mb-1.5 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-700 placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                />
              </div>

              {/* Password */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm text-zinc-600 font-medium">Kata Sandi</label>
                  <Link href="/forgot-password" className="text-xs text-emerald-500 hover:text-emerald-600 transition-colors">
                    Lupa kata sandi?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 pr-10 text-sm text-zinc-700 placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-2 mb-6">
                <input id="remember" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-zinc-300 accent-emerald-500 cursor-pointer" />
                <label htmlFor="remember" className="text-sm text-zinc-500 cursor-pointer">Ingat saya</label>
              </div>

              {/* Submit */}
              <button
                onClick={handleLogin}
                disabled={!isLoginValid || loading}
                className="w-full bg-zinc-300 hover:bg-emerald-500 disabled:bg-zinc-200 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors duration-200"
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>
            </>
          ) : (
            <>
              {/* OTP Step */}
              <h1 className="text-center text-xl font-bold text-zinc-800 mb-1">Verifikasi OTP</h1>
              <p className="text-center text-sm text-zinc-400 mb-7">
                Kode OTP telah dikirim ke WhatsApp Anda. Masukkan kode 6 digit di bawah.
              </p>

              {/* Error */}
              {error && (
                <div className="mb-4 text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                  {error}
                </div>
              )}

              {/* OTP Input */}
              <div className="mb-6">
                <label className="block text-sm text-zinc-600 mb-1.5 font-medium">Kode OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••••"
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-700 placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition tracking-widest text-center text-lg"
                />
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyOtp}
                disabled={!isOtpValid || loading}
                className="w-full bg-zinc-300 hover:bg-emerald-500 disabled:bg-zinc-200 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors duration-200"
              >
                {loading ? "Memverifikasi..." : "Verifikasi"}
              </button>

              {/* Back */}
              <button
                onClick={() => { setIsOtpStep(false); setError(""); setOtpCode(""); }}
                className="w-full mt-3 text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                ← Kembali ke Login
              </button>
            </>
          )}

          {/* SSL */}
          <div className="mt-6">
            <div className="relative flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-zinc-100" />
              <span className="text-[10px] text-zinc-300 tracking-widest uppercase">Keamanan</span>
              <div className="flex-1 h-px bg-zinc-100" />
            </div>
            <div className="flex justify-center items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-emerald-400">Koneksi SSL Terenkripsi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 text-center">
        <p className="text-xs text-zinc-400">© 2026 CRM Benefita. Hak Cipta Dilindungi.</p>
      </div>
    </div>
  );
}