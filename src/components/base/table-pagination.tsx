"use client";

/**
 * Paginasi tabel: ringkasan jumlah data + tombol halaman.
 *
 * Versi lama (ReportPagination di components/training) merender SEMUA
 * tombol halaman lewat Array.from({ length: totalPages }). Pada data yang
 * banyak itu menghasilkan deretan tombol sepanjang layar. Di sini hanya
 * sejumlah halaman di sekitar halaman aktif yang dirender, dengan halaman
 * pertama dan terakhir selalu terlihat.
 */
import React from "react";

export interface TablePaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  /** Berapa halaman di kiri dan kanan halaman aktif. */
  jendela?: number;
}

/** Deret nomor halaman; null berarti pemisah "…". */
export function nomorHalaman(
  page: number,
  totalPages: number,
  jendela = 1,
): (number | null)[] {
  if (totalPages <= 1) return totalPages === 1 ? [1] : [];

  const wajib = new Set<number>([1, totalPages, page]);
  for (let i = 1; i <= jendela; i++) {
    if (page - i >= 1) wajib.add(page - i);
    if (page + i <= totalPages) wajib.add(page + i);
  }

  const urut = [...wajib].sort((a, b) => a - b);
  const hasil: (number | null)[] = [];

  urut.forEach((n, i) => {
    // Sisipkan pemisah hanya kalau ada lompatan lebih dari satu halaman.
    if (i > 0 && n - urut[i - 1] > 1) hasil.push(null);
    hasil.push(n);
  });

  return hasil;
}

export function TablePagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  jendela = 1,
}: TablePaginationProps) {
  const halaman = nomorHalaman(page, totalPages, jendela);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-zinc-100">
      <p className="text-[11px] text-zinc-400">
        Menampilkan{" "}
        <span className="font-semibold text-zinc-600">
          {total === 0 ? 0 : (page - 1) * limit + 1}–
          {Math.min(page * limit, total)}
        </span>{" "}
        dari <span className="font-semibold text-zinc-600">{total}</span> data
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
        >
          ‹ Sebelumnya
        </button>

        {halaman.map((p, i) =>
          p === null ? (
            <span key={`sela-${i}`} className="px-1 text-[11px] text-zinc-300">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              aria-current={p === page ? "page" : undefined}
              className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
                p === page
                  ? "bg-emerald-500 text-white"
                  : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          // totalPages bisa 0 saat data kosong; tombol harus tetap mati.
          disabled={page >= totalPages}
          className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Selanjutnya ›
        </button>
      </div>
    </div>
  );
}

export default TablePagination;
