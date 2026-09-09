"use client";

import React, { useEffect, useState } from "react";
import {
  getSkemaKualifikasiOptions,
  type SkemaKualifikasiOption,
} from "@/lib/services/input.service";

interface PesertaUjiReportFilterProps {
  search: string;
  onSearch: (v: string) => void;
  tahun: string;
  onTahun: (v: string) => void;
  skemaId: number | "";
  onSkemaId: (v: number | "") => void;
  searchPlaceholder?: string;
}

export function PesertaUjiReportFilter({
  search,
  onSearch,
  tahun,
  onTahun,
  skemaId,
  onSkemaId,
  searchPlaceholder = "Cari nama atau instansi...",
}: PesertaUjiReportFilterProps) {
  const [skemaOptions, setSkemaOptions] = useState<SkemaKualifikasiOption[]>([]);

  useEffect(() => {
    getSkemaKualifikasiOptions()
      .then(setSkemaOptions)
      .catch(() => setSkemaOptions([]));
  }, []);

  return (
    <div className="px-5 py-3 border-b border-zinc-100 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-zinc-500 font-medium">Tahun</span>
        <input
          type="number"
          placeholder="Semua tahun"
          value={tahun}
          onChange={(e) => onTahun(e.target.value)}
          className="w-28 px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all"
        />
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-[11px] text-zinc-500 font-medium">Skema</span>
        <select
          value={skemaId}
          onChange={(e) =>
            onSkemaId(e.target.value ? Number(e.target.value) : "")
          }
          className="px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white"
        >
          <option value="">Semua Skema</option>
          {skemaOptions.map((s) => (
            <option key={s.id} value={s.id}>
              {s.kode}
            </option>
          ))}
        </select>
      </div>

      <div className="relative ml-auto">
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-300"
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full sm:w-56 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
        />
      </div>
    </div>
  );
}

export function ReportPagination({
  page,
  limit,
  total,
  totalPages,
  onPageChange,
}: {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) {
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
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
        >
          ‹ Sebelumnya
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
              p === page
                ? "bg-emerald-500 text-white"
                : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Selanjutnya ›
        </button>
      </div>
    </div>
  );
}
