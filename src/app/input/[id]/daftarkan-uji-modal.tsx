"use client";

import React, { useEffect, useState } from "react";
import { X, Send, Loader2 } from "lucide-react";
import {
  getSkemaKualifikasiOptions,
  type SkemaKualifikasiOption,
} from "@/lib/services/input.service";

interface DaftarkanUjiModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (skemaId: number) => Promise<void> | void;
  namaPeserta?: string;
  isLoading?: boolean;
}

export default function DaftarkanUjiModal({
  open,
  onClose,
  onSubmit,
  namaPeserta,
  isLoading = false,
}: DaftarkanUjiModalProps) {
  const [options, setOptions] = useState<SkemaKualifikasiOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [skemaId, setSkemaId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setSkemaId("");
    setError(null);
    setLoadingOptions(true);
    getSkemaKualifikasiOptions()
      .then(setOptions)
      .catch(() => setOptions([]))
      .finally(() => setLoadingOptions(false));
  }, [open]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!skemaId) {
      setError("Pilih skema kualifikasi dulu.");
      return;
    }
    onSubmit(Number(skemaId));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <p className="font-bold text-zinc-800 text-sm">
              Daftarkan ke Uji Kompetensi
            </p>
            {namaPeserta && (
              <p className="text-[11px] text-zinc-400 mt-0.5">
                {namaPeserta}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5">
            <label className="block text-[11px] font-semibold text-zinc-500 mb-1.5">
              Skema Kualifikasi
            </label>
            <select
              value={skemaId}
              onChange={(e) => setSkemaId(e.target.value)}
              disabled={loadingOptions}
              className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all bg-white"
            >
              <option value="">
                {loadingOptions ? "Memuat..." : "Pilih skema..."}
              </option>
              {options.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.kode} — {o.nama}
                </option>
              ))}
            </select>
            {!loadingOptions && options.length === 0 && (
              <p className="mt-1.5 text-[10px] text-zinc-400">
                Belum ada data skema kualifikasi. Tambahkan dulu di master
                Skema Kualifikasi.
              </p>
            )}
            {error && <p className="mt-1.5 text-[10px] text-red-500">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading || loadingOptions}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              {isLoading ? "Mendaftarkan..." : "Daftarkan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
