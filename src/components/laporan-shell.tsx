"use client";

// Kerangka bersama halaman laporan keuangan: kartu, judul, filter rentang
// tanggal, badge status. Dipakai Neraca Saldo, Arus Kas, dan Laba Rugi
// Rinci supaya chrome-nya gak ditulis ulang tiga kali.
import React, { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import AppLayout from "@/components/app-layout";

export function formatRupiah(val: number) {
  const n = Math.round(val);
  return n < 0 ? `(Rp${Math.abs(n).toLocaleString("id-ID")})` : `Rp${n.toLocaleString("id-ID")}`;
}

export function formatPersen(val: number, total: number) {
  if (!total) return "-";
  return `${((val / total) * 100).toFixed(1)}%`;
}

export function awalTahunIni() {
  return `${new Date().getFullYear()}-01-01`;
}

export function hariIni() {
  return new Date().toISOString().slice(0, 10);
}

const inputCls =
  "px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-zinc-300";

export function LaporanShell({
  judul,
  icon: Icon,
  startDate,
  endDate,
  onStartDate,
  onEndDate,
  onFilter,
  loading,
  badge,
  children,
}: {
  judul: string;
  icon: LucideIcon;
  startDate: string;
  endDate: string;
  onStartDate: (v: string) => void;
  onEndDate: (v: string) => void;
  onFilter: () => void;
  loading: boolean;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <AppLayout breadcrumbs={[{ label: "Accounting", href: "/accounting" }, { label: judul }]}>
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Icon className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">{judul}</span>
          </div>

          <div className="flex items-center gap-2">
            <input type="date" value={startDate} onChange={(e) => onStartDate(e.target.value)} className={inputCls} />
            <span className="text-[11px] text-zinc-400">s/d</span>
            <input type="date" value={endDate} onChange={(e) => onEndDate(e.target.value)} className={inputCls} />
            <button
              onClick={onFilter}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
            >
              Tampilkan
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2">{badge}</div>
        </div>

        {loading ? <p className="py-12 text-center text-xs text-zinc-400">Memuat data...</p> : children}
      </div>
    </AppLayout>
  );
}

/** Badge "Balance" / "Selisih ..." yang dipakai Neraca Saldo & Arus Kas. */
export function BadgeBalance({ isBalance, selisih }: { isBalance: boolean; selisih: number }) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
        isBalance ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
      }`}
    >
      {isBalance ? "Balance" : `Selisih ${formatRupiah(selisih)}`}
    </span>
  );
}

/** Jalankan fetch sekali saat halaman dibuka. */
export function usePeriodeAwal(fetchData: (s: string, e: string) => void) {
  const [startDate, setStartDate] = useState(awalTahunIni());
  const [endDate, setEndDate] = useState(hariIni());

  useEffect(() => {
    fetchData(startDate, endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { startDate, setStartDate, endDate, setEndDate };
}
