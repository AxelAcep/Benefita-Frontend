"use client";

import React, { useState } from "react";
import { X, Save } from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

const JENIS_AKSES_OPTIONS = ["ENV", "CSR", "TSM", "EPM"] as const;
type JenisAkses = (typeof JENIS_AKSES_OPTIONS)[number];

interface ModalRequestPosisiProps {
  perusahaanId: string;
  isSaving?: boolean;
  onClose: () => void;
  onSubmit: (jenisAkses: JenisAkses) => void;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function ModalRequestPosisi({
  perusahaanId,
  isSaving = false,
  onClose,
  onSubmit,
}: ModalRequestPosisiProps) {
  const [jenisAkses, setJenisAkses] = useState<JenisAkses | "">("");

  const handleSubmit = () => {
    if (!jenisAkses) return;
    onSubmit(jenisAkses);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isSaving) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-sm font-bold text-zinc-800">Request Posisi</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Perbarui informasi yang diperlukan
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSaving}
            className="text-zinc-400 hover:text-zinc-600 transition-colors mt-0.5 disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="border-t border-zinc-100 mx-6" />

        {/* ── Body ── */}
        <div className="px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-600">Jenis</label>
            <select
              value={jenisAkses}
              onChange={(e) => setJenisAkses(e.target.value as JenisAkses)}
              disabled={isSaving}
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 transition bg-white appearance-none disabled:opacity-50 disabled:bg-zinc-50"
            >
              <option value="">Pilih Jenis Akses</option>
              {JENIS_AKSES_OPTIONS.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-xs border border-zinc-200 rounded-lg text-zinc-600 hover:bg-zinc-50 disabled:opacity-40 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving || !jenisAkses}
            className="flex items-center gap-1.5 px-4 py-2 text-xs bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg disabled:opacity-40 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? "Menyimpan..." : "Simpan Data"}
          </button>
        </div>
      </div>
    </div>
  );
}
