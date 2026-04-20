"use client";

import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TugasPelaporanFormData {
  status: string;
  pic: string;
  dueDate: string;
  penerimaLaporan: string;
  kegiatan: string;
}

interface TugasPelaporanModalProps {
  open: boolean;
  mode: "tambah" | "edit";
  initialData?: Partial<TugasPelaporanFormData>;
  onClose: () => void;
  onSave: (data: TugasPelaporanFormData) => void;
}

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

const STATUS_OPTIONS = ["Tugas", "Tugas dan Pelaporan", "Pelaporan"];
const PIC_OPTIONS = [
  "Muamal Rasyid",
  "Yayat Hidayat",
  "Toni Purba",
  "Imamsyah Roesil",
  "Exel",
  "Aldy",
  "Andi",
];
const PENERIMA_OPTIONS = ["Nanang", "Axel", "Aldy", "Andi", "-"];

const DEFAULT_FORM: TugasPelaporanFormData = {
  status: "Tugas",
  pic: "Exel",
  dueDate: "",
  penerimaLaporan: "Nanang",
  kegiatan: "",
};

// ---------------------------------------------------------------------------
// Modal
// ---------------------------------------------------------------------------

export default function TugasPelaporanModal({
  open,
  mode,
  initialData,
  onClose,
  onSave,
}: TugasPelaporanModalProps) {
  const [form, setForm] = useState<TugasPelaporanFormData>(DEFAULT_FORM);

  useEffect(() => {
    if (open) {
      setForm({ ...DEFAULT_FORM, ...initialData });
    }
  }, [open, initialData]);

  if (!open) return null;

  const title =
    mode === "edit" ? "Edit Tugas/Pelaporan" : "Tambah Tugas/Pelaporan";
  const subtitle =
    mode === "edit"
      ? "Isi informasi di bawah ini untuk mengubah tugas atau pelaporan"
      : "Isi informasi di bawah ini untuk menambahkan tugas atau pelaporan";

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-zinc-100">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-zinc-800">{title}</h2>
              <p className="text-[11px] text-zinc-400 mt-0.5">{subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-zinc-600 transition-colors mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600">
              Status
            </label>
            <div className="relative">
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full appearance-none pl-3 pr-8 py-2 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all bg-white cursor-pointer"
              >
                {STATUS_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">
                ▾
              </span>
            </div>
          </div>

          {/* PIC */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600">PIC</label>
            <div className="relative">
              <select
                value={form.pic}
                onChange={(e) => setForm({ ...form, pic: e.target.value })}
                className="w-full appearance-none pl-3 pr-8 py-2 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all bg-white cursor-pointer"
              >
                {PIC_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">
                ▾
              </span>
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600">
              Due Date
            </label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full pl-3 pr-3 py-2 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all bg-white"
            />
          </div>

          {/* Penerima Laporan */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600">
              Penerima Laporan
            </label>
            <div className="relative">
              <select
                value={form.penerimaLaporan}
                onChange={(e) =>
                  setForm({ ...form, penerimaLaporan: e.target.value })
                }
                className="w-full appearance-none pl-3 pr-8 py-2 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all bg-white cursor-pointer"
              >
                {PENERIMA_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">
                ▾
              </span>
            </div>
          </div>

          {/* Kegiatan / Tindak Lanjut */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-600">
              Kegiatan / Tindak Lanjut
            </label>
            <textarea
              value={form.kegiatan}
              onChange={(e) => setForm({ ...form, kegiatan: e.target.value })}
              rows={4}
              placeholder="Masukkan kegiatan atau tindak lanjut..."
              className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Save className="w-3 h-3" />
            Simpan Data
          </button>
        </div>
      </div>
    </div>
  );
}
