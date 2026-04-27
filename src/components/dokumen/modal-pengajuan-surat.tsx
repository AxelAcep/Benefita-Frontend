// components/modal-pengajuan-surat.tsx
"use client";

import React, { useState, useEffect } from "react";

interface ModalPengajuanSuratProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "buat" | "edit";
  data?: {
    keterangan?: string;
    tujuan?: string;
  };
}

export default function ModalPengajuanSurat({
  isOpen,
  onClose,
  mode,
  data = {},
}: ModalPengajuanSuratProps) {
  const [form, setForm] = useState({
    keterangan: data.keterangan ?? "",
    tujuan: data.tujuan ?? "",
  });

  useEffect(() => {
    setForm({
      keterangan: data.keterangan ?? "",
      tujuan: data.tujuan ?? "",
    });
  }, [data.keterangan, data.tujuan, isOpen]);

  if (!isOpen) return null;

  const title = mode === "buat" ? "Buat Pengajuan" : "Edit Pengajuan";
  const subtitle =
    "Lengkapi formulir di bawah ini untuk mengajukan nomor surat.";
  const isValid = form.keterangan.trim() !== "" && form.tujuan.trim() !== "";

  const inputClass =
    "w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all bg-white resize-none";
  const labelClass = "block text-sm font-medium text-zinc-700 mb-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <h2 className="text-base font-bold text-zinc-800">{title}</h2>
            <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 transition-colors ml-4 mt-0.5"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="px-6 pb-4 space-y-4">
          <div>
            <label className={labelClass}>Keterangan</label>
            <textarea
              className={inputClass}
              rows={4}
              placeholder="Masukkan keterangan"
              value={form.keterangan}
              onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
            />
          </div>

          <div>
            <label className={labelClass}>Tajuan</label>
            <textarea
              className={inputClass}
              rows={4}
              placeholder="Masukkan tujuan"
              value={form.tujuan}
              onChange={(e) => setForm({ ...form, tujuan: e.target.value })}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-medium text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => {
              if (!isValid) return;
              onClose();
            }}
            disabled={!isValid}
            className={`px-5 py-2 text-xs font-medium rounded-lg transition-colors ${
              isValid
                ? "bg-emerald-500 text-white hover:bg-emerald-700"
                : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
            }`}
          >
            Ajukan
          </button>
        </div>
      </div>
    </div>
  );
}
