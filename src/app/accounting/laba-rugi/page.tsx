"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { useLaporanLabaRugi } from "@/hooks/use-laporan-keuangan";

function formatRupiah(val: number) {
  return `Rp${val.toLocaleString("id-ID")}`;
}

function currentPeriode() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
}

const inputCls =
  "px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-zinc-300";

export default function LabaRugiPage() {
  const [startPeriode, setStartPeriode] = useState(currentPeriode());
  const [endPeriode, setEndPeriode] = useState(currentPeriode());
  const { data, loading, fetchData } = useLaporanLabaRugi();

  useEffect(() => {
    fetchData(startPeriode, endPeriode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onFilter() {
    fetchData(startPeriode, endPeriode);
  }

  const pendapatanRows = data ? data.rows.filter((r) => r.akun.jenis === "PENDAPATAN") : [];
  const bebanRows = data ? data.rows.filter((r) => r.akun.jenis === "BEBAN") : [];

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Accounting", href: "/accounting" },
        { label: "Laporan Laba Rugi" },
      ]}
    >
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
              type="text"
              value={startPeriode}
              onChange={(e) => setStartPeriode(e.target.value)}
              placeholder="202601"
              className={`${inputCls} w-24`}
            />
            <span className="text-[11px] text-zinc-400">s/d</span>
            <input
              type="text"
              value={endPeriode}
              onChange={(e) => setEndPeriode(e.target.value)}
              placeholder="202612"
              className={`${inputCls} w-24`}
            />
            <button
              onClick={onFilter}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
            >
              Tampilkan
            </button>
          </div>

          {data ? (
            <span
              className={`ml-auto inline-block px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${
                data.status === "FINAL" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
              }`}
            >
              {data.status === "FINAL" ? "Final (sudah tutup buku)" : "Draft (belum tutup buku)"}
            </span>
          ) : null}
        </div>

        {loading ? (
          <p className="py-12 text-center text-xs text-zinc-400">Memuat data...</p>
        ) : data ? (
          <div>
            <div className="px-5 py-2 bg-zinc-50/60 border-b border-zinc-100">
              <p className="text-[11px] font-semibold text-zinc-500">Pendapatan</p>
            </div>
            <table className="w-full">
              <tbody>
                {pendapatanRows && pendapatanRows.length > 0 ? (
                  pendapatanRows.map((r) => {
                    return (
                      <tr key={r.akun.id} className="border-b border-zinc-50">
                        <td className="px-5 py-2 text-xs text-zinc-600">
                          {r.akun.kode ? `${r.akun.kode} - ${r.akun.nama}` : r.akun.nama}
                        </td>
                        <td className="px-5 py-2 text-xs text-zinc-700 text-right">{formatRupiah(r.saldo)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={2} className="px-5 py-4 text-center text-xs text-zinc-400">
                      Belum ada pendapatan.
                    </td>
                  </tr>
                )}
                <tr className="bg-zinc-50/60">
                  <td className="px-5 py-2 text-xs font-semibold text-zinc-700">Total Pendapatan</td>
                  <td className="px-5 py-2 text-xs font-semibold text-zinc-700 text-right">
                    {formatRupiah(data.totalPendapatan)}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="px-5 py-2 bg-zinc-50/60 border-y border-zinc-100">
              <p className="text-[11px] font-semibold text-zinc-500">Beban</p>
            </div>
            <table className="w-full">
              <tbody>
                {bebanRows && bebanRows.length > 0 ? (
                  bebanRows.map((r) => {
                    return (
                      <tr key={r.akun.id} className="border-b border-zinc-50">
                        <td className="px-5 py-2 text-xs text-zinc-600">
                          {r.akun.kode ? `${r.akun.kode} - ${r.akun.nama}` : r.akun.nama}
                        </td>
                        <td className="px-5 py-2 text-xs text-zinc-700 text-right">{formatRupiah(r.saldo)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={2} className="px-5 py-4 text-center text-xs text-zinc-400">
                      Belum ada beban.
                    </td>
                  </tr>
                )}
                <tr className="bg-zinc-50/60">
                  <td className="px-5 py-2 text-xs font-semibold text-zinc-700">Total Beban</td>
                  <td className="px-5 py-2 text-xs font-semibold text-zinc-700 text-right">
                    {formatRupiah(data.totalBeban)}
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
              <span>{formatRupiah(Math.abs(data.labaRugiBersih))}</span>
            </div>
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}
