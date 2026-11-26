"use client";

/**
 * Kerangka modal: overlay, kartu putih, header, isi, footer.
 *
 * Shell seperti ini ditulis tangan di 62 file. Ini versi tunggalnya.
 * Hanya mengurus tampilan dan perilaku tutup — tidak tahu-menahu soal form.
 * Untuk modal berisi form, pakai @/components/base/form-modal.
 */
import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type UkuranModal = "sm" | "md" | "lg" | "xl";

const LEBAR: Record<UkuranModal, string> = {
  sm: "max-w-md",
  md: "max-w-xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

export interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  judul: React.ReactNode;
  deskripsi?: React.ReactNode;
  ukuran?: UkuranModal;
  /** Isi footer, biasanya tombol. Kosong = footer tidak dirender. */
  footer?: React.ReactNode;
  /** Bungkus isi+footer dengan <form>. Dipakai form-modal. */
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  /** Matikan tutup lewat klik latar dan tombol Esc, misal saat menyimpan. */
  kunci?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function BaseModal({
  open,
  onClose,
  judul,
  deskripsi,
  ukuran = "md",
  footer,
  onSubmit,
  kunci = false,
  className,
  children,
}: BaseModalProps) {
  // Esc untuk menutup, dan kunci scroll halaman di belakang modal.
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !kunci) onClose();
    };

    document.addEventListener("keydown", onKey);
    const overflowAwal = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflowAwal;
    };
  }, [open, kunci, onClose]);

  if (!open) return null;

  const isi = (
    <>
      <div className="px-6 py-5">{children}</div>
      {footer && (
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-zinc-100">
          {footer}
        </div>
      )}
    </>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
      onClick={() => {
        if (!kunci) onClose();
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "bg-white rounded-2xl shadow-2xl w-full max-h-[90vh] overflow-y-auto relative",
          LEBAR[ukuran],
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <p className="font-bold text-zinc-800 text-sm">{judul}</p>
            {deskripsi && (
              <p className="text-[11px] text-zinc-400 mt-0.5">{deskripsi}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-zinc-600 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {onSubmit ? <form onSubmit={onSubmit}>{isi}</form> : isi}
      </div>
    </div>
  );
}

export default BaseModal;
