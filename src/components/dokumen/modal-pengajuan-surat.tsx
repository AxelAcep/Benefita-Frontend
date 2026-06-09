// components/dokumen/modal-pengajuan-surat.tsx
"use client";

import React, { useState, useEffect } from "react";
import { PerusahaanSelect } from "@/components/base/PerusahaanSelect";

interface ModalPengajuanSuratProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "buat" | "edit";
  data?: {
    keterangan?: string;
    tujuanNoInduk?: string;
    tujuanNama?: string;
  };
  onSubmit?: (form: {
    keterangan: string;
    tujuanNoInduk: string;
  }) => Promise<void>;
}

export default function ModalPengajuanSurat({
  isOpen,
  onClose,
  mode,
  data = {},
  onSubmit,
}: ModalPengajuanSuratProps) {
  const [form, setForm] = useState({
    keterangan: "",
    tujuanNoInduk: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setForm({
        keterangan: data.keterangan ?? "",
        tujuanNoInduk: data.tujuanNoInduk ?? "",
      });
    }
  }, [data.keterangan, data.tujuanNoInduk, isOpen]);

  if (!isOpen) return null;

  const title =
    mode === "buat"
      ? "Buat Permintaan Nomor Surat"
      : "Edit Permintaan Nomor Surat";
  const subtitle =
    "Lengkapi formulir di bawah ini untuk mengajukan nomor surat.";
  const isValid =
    form.keterangan.trim() !== "" && form.tujuanNoInduk.trim() !== "";

  const handleSubmit = async () => {
    if (!isValid || !onSubmit) return;
    setLoading(true);
    try {
      await onSubmit({
        keterangan: form.keterangan,
        tujuanNoInduk: form.tujuanNoInduk,
      });
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "block text-xs font-medium text-zinc-700 mb-1.5";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
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
            <label className={labelClass}>Keterangan *</label>
            <textarea
              className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all bg-white resize-none"
              rows={4}
              placeholder="Masukkan keterangan"
              value={form.keterangan}
              onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
            />
          </div>

          <div>
            <label className={labelClass}>Perusahaan Tujuan *</label>
            <PerusahaanSelect
              value={form.tujuanNoInduk}
              onChange={(noInduk) => {
                setForm({ ...form, tujuanNoInduk: noInduk });
              }}
              placeholder="Pilih perusahaan tujuan..."
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
            onClick={handleSubmit}
            disabled={!isValid || loading}
            className={`px-5 py-2 text-xs font-medium rounded-lg transition-colors ${
              isValid && !loading
                ? "bg-emerald-500 text-white hover:bg-emerald-700"
                : "bg-zinc-200 text-zinc-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Menyimpan..." : mode === "buat" ? "Ajukan" : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
