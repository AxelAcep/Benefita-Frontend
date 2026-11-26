"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Icons } from "@/assets";
import { useLoginManage } from "./manage";

export default function LoginContainer() {
  const {
    email, setEmail, password, setPassword, showPassword, setShowPassword,
    isOtpStep, otpCode, setOtpCode, loading, error, isLoginValid, isOtpValid,
    handleLogin, handleVerifyOtp, kembaliKeLogin,
  } = useLoginManage();

  return (
    <div className="min-h-screen bg-zinc-100 flex flex-col">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8">
            <Image
              src={Icons.Benefita}
              alt="Logo Benefita"
              className="w-full h-full object-contain"
              width={32}
              height={32}
            />
          </div>
          <div>
            <div className="text-sm font-bold text-zinc-800 leading-tight">
              CRM Benefita
            </div>
            <div className="text-[10px] text-zinc-400 tracking-widest uppercase leading-tight">
              Portal Perusahaan
            </div>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 w-full max-w-sm px-8 py-10">
          {!isOtpStep ? (
            <form onSubmit={(event) => { event.preventDefault(); void handleLogin(); }}>
              <h1 className="text-center text-xl font-bold text-zinc-800 mb-1">
                Selamat Datang Kembali
              </h1>
              <p className="text-center text-sm text-zinc-400 mb-7">
                Masuk ke akun Anda untuk melanjutkan.
              </p>

              {error && (
                <div role="alert" className="mb-4 text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label htmlFor="login-email" className="block text-sm text-zinc-600 mb-1.5 font-medium">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-700 placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                />
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="text-sm text-zinc-600 font-medium">
                    Kata Sandi
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-emerald-500 hover:text-emerald-600 transition-colors"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    autoComplete="current-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 pr-10 text-sm text-zinc-700 placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!isLoginValid || loading}
                className="w-full bg-zinc-300 hover:bg-emerald-500 disabled:bg-zinc-200 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors duration-200"
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>
            </form>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); void handleVerifyOtp(); }}>
              <h1 className="text-center text-xl font-bold text-zinc-800 mb-1">
                Verifikasi OTP
              </h1>
              <p className="text-center text-sm text-zinc-400 mb-7">
                Kode OTP telah dikirim ke WhatsApp Anda. Masukkan kode 6 digit
                di bawah.
              </p>

              {error && (
                <div role="alert" className="mb-4 text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label htmlFor="login-otp" className="block text-sm text-zinc-600 mb-1.5 font-medium">
                  Kode OTP
                </label>
                <input
                  type="text"
                  id="login-otp"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) =>
                    setOtpCode(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="••••••"
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-700 placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition tracking-widest text-center text-lg"
                />
              </div>

              <button
                type="submit"
                disabled={!isOtpValid || loading}
                className="w-full bg-zinc-300 hover:bg-emerald-500 disabled:bg-zinc-200 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors duration-200"
              >
                {loading ? "Memverifikasi..." : "Verifikasi"}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={kembaliKeLogin}
                className="w-full mt-3 text-sm text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                ← Kembali ke Login
              </button>
            </form>
          )}

          <div className="mt-6">
            <div className="relative flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-zinc-100" />
              <span className="text-[10px] text-zinc-300 tracking-widest uppercase">
                Keamanan
              </span>
              <div className="flex-1 h-px bg-zinc-100" />
            </div>
            <div className="flex justify-center items-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span className="text-xs text-emerald-400">
                Koneksi SSL Terenkripsi
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 text-center">
        <p className="text-xs text-zinc-400">
          © 2026 CRM Benefita. Hak Cipta Dilindungi.
        </p>
      </div>
    </div>
  );
}
