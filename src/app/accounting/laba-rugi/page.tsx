"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp, FileDown, Loader2 } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import { useBoolean } from "@/hooks/use-boolean";
import { useLaporanLabaRugi } from "@/hooks/use-laporan-keuangan";
import { exportLabaRugiPdf, type LabaRugiRow } from "@/lib/services/jurnal-keuangan.service";

function formatRupiah(val: number) {
  return `Rp${val.toLocaleString("id-ID")}`;
}

function formatPersen(val: number, total: number) {
  if (!total) return "-";
  return `${((val / total) * 100).toFixed(1)}%`;
}

function awalBulanIni() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

function hariIni() {
  return new Date().toISOString().slice(0, 10);
}

const inputCls =
  "px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-zinc-300";

function LabaRugiRows({ rows, total }: { rows: LabaRugiRow[]; total: number }) {
  return rows && rows.length > 0
    ? rows.map((r) => {
        return (
          <tr key={r.akun.id} className="border-b border-zinc-50">
            <td className="pl-8 pr-4 py-1.5 text-xs text-zinc-600">
              {r.akun.kode ? `${r.akun.kode} - ${r.akun.nama}` : r.akun.nama}
            </td>
            <td className="px-4 py-1.5 text-xs text-zinc-700 text-right">{formatRupiah(r.saldo)}</td>
            <td className="px-4 py-1.5 text-xs text-zinc-400 text-right w-20">{formatPersen(r.saldo, total)}</td>
          </tr>
        );
      })
    : null;
}

export default function LabaRugiPage() {
  const [startDate, setStartDate] = useState(awalBulanIni());
  const [endDate, setEndDate] = useState(hariIni());
  const { data, loading, fetchData } = useLaporanLabaRugi();
  const { value: exporting, onTrue: onExportingTrue, onFalse: onExportingFalse } = useBoolean(false);
  const [notif, setNotif] = useState<{ message: string; type: "success" | "error"; key: number } | null>(null);

  useEffect(() => {
    fetchData(startDate, endDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onFilter() {
    fetchData(startDate, endDate);
  }

  async function onExportPdf() {
    onExportingTrue();
    try {
      await exportLabaRugiPdf(startDate, endDate);
    } catch (err) {
      setNotif({
        message: err instanceof Error ? err.message : "Gagal mengunduh PDF",
        type: "error",
        key: Date.now(),
      });
    } finally {
      onExportingFalse();
    }
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Accounting", href: "/accounting" },
        { label: "Laporan Laba Rugi" },
      ]}
    >
      {notif ? (
        <Notification
          key={notif.key}
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif(null)}
        />
      ) : null}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">Laporan Laba Rugi</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputCls}
            />
            <span className="text-[11px] text-zinc-400">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className={inputCls}
            />
            <button
              onClick={onFilter}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
            >
              Tampilkan
            </button>
          </div>

          <button
            onClick={onExportPdf}
            disabled={exporting || !data}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {exporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileDown className="w-3.5 h-3.5" />}
            Export PDF
          </button>

          <span className="ml-auto inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600 whitespace-nowrap">
            Real-time
          </span>
        </div>

        {loading ? (
          <p className="py-12 text-center text-xs text-zinc-400">Memuat data...</p>
        ) : data ? (
          <div>
            <table className="w-full">
              <thead>
                <tr className="bg-zinc-50/60 border-b border-zinc-100">
                  <th className="px-4 py-1.5 text-left text-[10px] font-semibold text-zinc-400 uppercase">Pendapatan</th>
                  <th className="px-4 py-1.5 text-right text-[10px] font-semibold text-zinc-400">Nominal</th>
                  <th className="px-4 py-1.5 text-right text-[10px] font-semibold text-zinc-400 w-20">% Pdptn</th>
                </tr>
              </thead>
              <tbody>
                {data.pendapatan && data.pendapatan.length > 0 ? (
                  <LabaRugiRows rows={data.pendapatan} total={data.totalPendapatan} />
                ) : (
                  <tr>
                    <td colSpan={3} className="px-5 py-4 text-center text-xs text-zinc-400">
                      Belum ada pendapatan.
                    </td>
                  </tr>
                )}
                <tr className="bg-zinc-50/60 font-semibold">
                  <td className="px-4 py-2 text-xs text-zinc-700">Total Pendapatan</td>
                  <td className="px-4 py-2 text-xs text-zinc-700 text-right">{formatRupiah(data.totalPendapatan)}</td>
                  <td className="px-4 py-2 text-xs text-zinc-700 text-right">100.0%</td>
                </tr>
              </tbody>
            </table>

            <table className="w-full border-t border-zinc-100">
              <thead>
                <tr className="bg-zinc-50/60 border-b border-zinc-100">
                  <th className="px-4 py-1.5 text-left text-[10px] font-semibold text-zinc-400 uppercase">Beban Usaha</th>
                  <th className="px-4 py-1.5 text-right text-[10px] font-semibold text-zinc-400">Nominal</th>
                  <th className="px-4 py-1.5 text-right text-[10px] font-semibold text-zinc-400 w-20">% Pdptn</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3} className="px-4 py-1.5 text-[11px] font-semibold text-zinc-500">Beban Penjualan</td>
                </tr>
                {data.bebanPenjualan && data.bebanPenjualan.length > 0 ? (
                  <LabaRugiRows rows={data.bebanPenjualan} total={data.totalPendapatan} />
                ) : (
                  <tr>
                    <td colSpan={3} className="pl-8 pr-4 py-1.5 text-xs text-zinc-400">Tidak ada data.</td>
                  </tr>
                )}
                <tr className="bg-zinc-50/60">
                  <td className="pl-5 pr-4 py-1.5 text-xs font-semibold text-zinc-700">Total Beban Penjualan</td>
                  <td className="px-4 py-1.5 text-xs font-semibold text-zinc-700 text-right">
                    {formatRupiah(data.totalBebanPenjualan)}
                  </td>
                  <td className="px-4 py-1.5 text-xs font-semibold text-zinc-700 text-right">
                    {formatPersen(data.totalBebanPenjualan, data.totalPendapatan)}
                  </td>
                </tr>

                <tr>
                  <td colSpan={3} className="px-4 py-1.5 text-[11px] font-semibold text-zinc-500">Beban Umum &amp; Administrasi</td>
                </tr>
                {data.bebanAdministrasi && data.bebanAdministrasi.length > 0 ? (
                  <LabaRugiRows rows={data.bebanAdministrasi} total={data.totalPendapatan} />
                ) : (
                  <tr>
                    <td colSpan={3} className="pl-8 pr-4 py-1.5 text-xs text-zinc-400">Tidak ada data.</td>
                  </tr>
                )}
                <tr className="bg-zinc-50/60">
                  <td className="pl-5 pr-4 py-1.5 text-xs font-semibold text-zinc-700">Total Beban Administrasi</td>
                  <td className="px-4 py-1.5 text-xs font-semibold text-zinc-700 text-right">
                    {formatRupiah(data.totalBebanAdministrasi)}
                  </td>
                  <td className="px-4 py-1.5 text-xs font-semibold text-zinc-700 text-right">
                    {formatPersen(data.totalBebanAdministrasi, data.totalPendapatan)}
                  </td>
                </tr>

                <tr className="bg-zinc-100 font-semibold border-t border-zinc-200">
                  <td className="px-4 py-2 text-xs text-zinc-800">Total Beban Usaha</td>
                  <td className="px-4 py-2 text-xs text-zinc-800 text-right">{formatRupiah(data.totalBeban)}</td>
                  <td className="px-4 py-2 text-xs text-zinc-800 text-right">
                    {formatPersen(data.totalBeban, data.totalPendapatan)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div
              className={`flex items-center justify-between px-5 py-4 text-sm font-bold border-t border-zinc-100 ${
                data.labaRugiBersih >= 0 ? "text-emerald-600" : "text-red-500"
              }`}
            >
              <span>{data.labaRugiBersih >= 0 ? "Laba Bersih" : "Rugi Bersih"}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-normal text-zinc-400">
                  {formatPersen(Math.abs(data.labaRugiBersih), data.totalPendapatan)}
                </span>
                <span>{formatRupiah(Math.abs(data.labaRugiBersih))}</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}
