"use client";

import React, { useEffect, useState } from "react";
import { Loader2, X, Ban } from "lucide-react";

interface RejectRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (catatan: string) => Promise<void> | void;
  deskripsi?: string;
  isLoading?: boolean;
}

export function RejectRequestModal({
  open,
  onClose,
  onSubmit,
  deskripsi,
  isLoading = false,
}: RejectRequestModalProps) {
  const [catatan, setCatatan] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setCatatan("");
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!catatan.trim()) {
      setError("Catatan alasan wajib diisi.");
      return;
    }
    onSubmit(catatan.trim());
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <p className="font-bold text-zinc-800 text-sm">Tolak Request</p>
            {deskripsi && (
              <p className="text-[11px] text-zinc-400 mt-0.5">{deskripsi}</p>
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
              Catatan Alasan
            </label>
            <textarea
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              rows={3}
              placeholder="Jelaskan alasan penolakan..."
              className="w-full px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all resize-none placeholder:text-zinc-300"
            />
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
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50 inline-flex items-center gap-1.5"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Ban className="w-3.5 h-3.5" />
              )}
              Tolak Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RejectRequestModal;
