"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/sidebar";
import { Icons } from "@/assets";
import { generatePastelBg, generatePastelText } from "@/lib/pastelColor";

export default function FormCutiSakitPage() {
  const [jenisIzin, setJenisIzin] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [alasan, setAlasan] = useState("");
  const router = useRouter(); // Ganti navigate jadi router

  return (
    <div className="flex min-h-screen bg-zinc-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 md:ml-[250px] min-w-0 overflow-x-hidden">

        {/* Page Header */}
        <div className="px-6 py-4 bg-white border-b border-zinc-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">
              Karyawan & Aktivitas &rsaquo; <span className="font-semibold text-zinc-700">Form Cuti/Sakit</span>
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">Hari ini: Selasa, 3 Februari 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs font-semibold text-zinc-800">Nanang</p>
              <p className="text-[10px] text-zinc-400">Super Admin</p>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: generatePastelBg("Nanang"), color: generatePastelText("Nanang") }}
            >
              N
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">

            {/* Form Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <img src={Icons.Riwayat.src} className="w-5 h-auto" alt="Form" />
                <div>
                  <p className="font-bold text-zinc-800 text-sm">Form Pengajuan</p>
                  <p className="text-[11px] text-zinc-400">Lengkapi data pengajuan di bawah ini</p>
                </div>
              </div>
                <button 
                  onClick={() => router.push('form-cuti/riwayat')}
                  className="flex items-center gap-1.5 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-600 hover:bg-zinc-50 transition-colors"
                >
                  <img src={Icons.Riwayat.src} className="w-3.5 h-auto" alt="Riwayat" />
                  Riwayat
                </button>
            </div>

            <div className="px-5 py-5 space-y-6">

              {/* Identitas Diri */}
              <div>
                <p className="text-xs font-bold text-zinc-700 mb-3">Identitas Diri</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[11px] text-zinc-500 mb-1 block">Nama Lengkap</label>
                    <input
                      defaultValue="Nanang"
                      readOnly
                      className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-700 bg-zinc-50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-500 mb-1 block">Jabatan</label>
                    <input
                      defaultValue="Manager"
                      readOnly
                      className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-700 bg-zinc-50 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-500 mb-1 block">Departemen</label>
                    <input
                      defaultValue="Marketing & Sales"
                      readOnly
                      className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-700 bg-zinc-50 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Detail Pengajuan */}
              <div>
                <p className="text-xs font-bold text-zinc-700 mb-3">Detail Pengajuan</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-[11px] text-zinc-500 mb-1 block">
                      Jenis Izin <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={jenisIzin}
                      onChange={(e) => setJenisIzin(e.target.value)}
                      className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-700 outline-none appearance-none bg-white cursor-pointer"
                    >
                      <option value="">Pilih</option>
                      <option value="cuti">Cuti</option>
                      <option value="sakit">Sakit</option>
                      <option value="izin">Izin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-500 mb-1 block">
                      Rentang Tanggal <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={tanggalMulai}
                        onChange={(e) => setTanggalMulai(e.target.value)}
                        className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-700 outline-none"
                      />
                      <span className="text-zinc-300 text-sm">-</span>
                      <input
                        type="date"
                        value={tanggalSelesai}
                        onChange={(e) => setTanggalSelesai(e.target.value)}
                        className="flex-1 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-700 outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-zinc-500 mb-1 block">
                    Alasan / Keterangan <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={alasan}
                    onChange={(e) => setAlasan(e.target.value)}
                    placeholder="Jelaskan alasan pengajuan secara spesifik..."
                    rows={4}
                    className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-700 outline-none resize-none placeholder:text-zinc-300"
                  />
                </div>
              </div>

              {/* Informasi Tambahan */}
              <div>
                <p className="text-xs font-bold text-zinc-700 mb-3">Informasi Tambahan</p>
                <div>
                  <label className="text-[11px] text-zinc-500 mb-1 block">
                    Lampiran <span className="text-zinc-400 font-normal">(Wajib untuk Sakit, Opsional untuk Cuti)</span>
                  </label>
                  <div className="border border-dashed border-zinc-300 rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-zinc-50 transition-colors">
                    <div className="w-10 h-10 flex items-center justify-center text-zinc-300">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <p className="text-xs text-zinc-500">
                      <span className="text-emerald-500 font-medium cursor-pointer hover:underline">Upload a file</span> or drag and drop
                    </p>
                    <p className="text-[10px] text-zinc-400">PNG, JPG, PDF up to 5MB (Surat Dokter, dll)</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-zinc-100">
              <button className="px-4 py-2 rounded-lg text-xs text-zinc-500 hover:bg-zinc-100 transition-colors font-medium">
                Batal
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
                Kirim Pengajuan
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}