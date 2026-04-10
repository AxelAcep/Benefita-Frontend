"use client";

import { useState } from "react";
import { RefreshCw, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Icons } from "@/assets";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email) return;
    setSubmitted(true);
  };

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

      {/* Center Card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 w-full max-w-sm px-10 py-10">
          
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-emerald-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-center text-xl font-bold text-zinc-800 mb-2">
            Lupa Kata Sandi
          </h1>
          <p className="text-center text-sm text-zinc-400 mb-7 leading-relaxed">
            Masukkan email Anda untuk menerima tautan<br />pemulihan kata sandi.
          </p>

          {/* Email Field */}
          {!submitted ? (
            <>
              <div className="mb-4">
                <label className="block text-sm text-zinc-600 mb-1.5 font-medium">
                  Alamat Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-700 placeholder:text-zinc-300 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!email}
                className="w-full bg-zinc-300 hover:bg-emerald-500 disabled:bg-zinc-200 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors duration-200"
              >
                Kirim Tautan Pemulihan
              </button>
            </>
          ) : (
            <div className="text-center text-sm text-emerald-600 bg-emerald-50 rounded-lg py-3 px-4 mb-4">
              Tautan pemulihan telah dikirim ke <strong>{email}</strong>
            </div>
          )}

          {/* Back to Login */}
          <div className="flex justify-center mt-5">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Login
            </Link>
          </div>

          {/* Divider + Security */}
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
        <p className="text-xs text-zinc-400">
          © 2026 CRM Benefita. Hak Cipta Dilindungi.
        </p>
      </div>
    </div>
  );
}