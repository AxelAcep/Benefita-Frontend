"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Save } from "lucide-react";
import Sidebar from "@/components/sidebar";

export default function ProfilePage() {
  const user = { nama: "Aditia", role: "Super Admin", initial: "A" };

  const [email, setEmail] = useState("user@gmail.com");
  const [whatsapp, setWhatsapp] = useState("089612340987");

  const [currentPassword, setCurrentPassword] = useState("Admin123!");
  const [newPassword, setNewPassword] = useState("Admin123!");
  const [confirmPassword, setConfirmPassword] = useState("Admin123!");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar />
      <div className="flex flex-col flex-1 md:ml-[250px]">

        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-zinc-200">
          <div>
            <h1 className="text-zinc-800 font-bold text-base leading-tight">Pengaturan Profil</h1>
            <p className="text-zinc-400 text-xs mt-0.5">Kelola informasi akun dan preferensi keamanan Anda.</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="text-right hidden sm:block">
              <p className="text-zinc-800 text-xs font-semibold leading-tight">{user.nama}</p>
              <p className="text-zinc-400 text-[10px] leading-tight">{user.role}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              BS
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">

            {/* Banner */}
            <div className="h-28 bg-gradient-to-r from-emerald-100 to-cyan-100" />

            {/* Avatar + Name */}
            <div className="px-8 pb-6">
              <div className="flex items-end gap-4 -mt-10 mb-6">
                <div className="w-20 h-20 rounded-full bg-emerald-200 border-4 border-white flex items-center justify-center text-emerald-700 text-3xl font-bold shadow-sm shrink-0">
                  {user.initial}
                </div>
                <div className="mb-1">
                  <h2 className="text-zinc-800 font-bold text-xl leading-tight">{user.nama}</h2>
                  <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-600 text-xs font-medium rounded-full">
                    {user.role}
                  </span>
                </div>
              </div>

              {/* Two column form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left: Email & WhatsApp */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-semibold text-zinc-800">Ganti Email & No. Whatsapp</span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-5">Perbarui alamat email/No. Whatsapp yang terhubung dengan akun Anda.</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-600 mb-1.5">Email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-700 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-600 mb-1.5">Nomor Whatsapp</label>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-700 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Right: Password */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-semibold text-zinc-800">Ganti Kata Sandi</span>
                  </div>
                  <p className="text-xs text-zinc-400 mb-5">Pastikan akun Anda aman dengan kata sandi yang kuat.</p>

                  <div className="space-y-4">
                    {[
                      { label: "Kata Sandi Saat Ini",  value: currentPassword, set: setCurrentPassword, show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
                      { label: "Kata Sandi Baru",      value: newPassword,     set: setNewPassword,     show: showNew,     toggle: () => setShowNew(!showNew) },
                      { label: "Konfirmasi Kata Sandi",value: confirmPassword,  set: setConfirmPassword,  show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="block text-xs font-medium text-zinc-600 mb-1.5">{field.label}</label>
                        <div className="relative">
                          <input
                            type={field.show ? "text" : "password"}
                            value={field.value}
                            onChange={(e) => field.set(e.target.value)}
                            className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 pr-10 text-sm text-zinc-700 outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition"
                          />
                          <button type="button" onClick={field.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors">
                            {field.show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-zinc-100">
                <button className="px-5 py-2 text-sm text-zinc-600 hover:text-zinc-800 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                  Batal
                </button>
                <button className="flex items-center gap-2 px-5 py-2 text-sm bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors">
                  <Save className="w-4 h-4" />
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}