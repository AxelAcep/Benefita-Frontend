"use client";

import React, { useEffect, useState } from "react";
import { Wallet2 } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { useKasBank } from "@/hooks/use-laporan-keuangan";

function formatRupiah(val: number | string) {
  const num = Number(val);
  if (isNaN(num)) return "-";
  return `Rp${num.toLocaleString("id-ID")}`;
}

function formatTanggal(val: string) {
  return new Date(val).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function awalBulanIni() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

function hariIni() {
  return new Date().toISOString().slice(0, 10);
}

export default function KasBankPage() {
  const [startDate, setStartDate] = useState(awalBulanIni());
  const [endDate, setEndDate] = useState(hariIni());
  const { data, loading, fetchData } = useKasBank();

  useEffect(() => {
    fetchData({ startDate, endDate });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onFilter() {
    fetchData({ startDate: startDate || undefined, endDate: endDate || undefined });
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Accounting", href: "/accounting" },
        { label: "Kas & Bank" },
      ]}
    >
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Wallet2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">Kas & Bank</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
              <span className="text-[11px] text-zinc-400">s/d</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition-all"
              />
              <button
                onClick={onFilter}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
              >
                Tampilkan
              </button>
            </div>

            {data ? (
              <span className="ml-auto inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600 whitespace-nowrap">
                Total Saldo Gabungan: {formatRupiah(data.totalSaldoGabungan)}
              </span>
            ) : null}
          </div>
        </div>

        {loading ? (
          <p className="py-12 text-center text-xs text-zinc-400">Memuat data...</p>
        ) : data && data.mutasi && data.mutasi.length > 0 ? (
          data.mutasi.map((akunMutasi) => {
            return (
              <div
                key={akunMutasi.akun.id}
                className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden"
              >
                <div className="px-5 py-2.5 bg-zinc-50/60 border-b border-zinc-100 flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-zinc-500">
                    {akunMutasi.akun.kode ? `${akunMutasi.akun.kode} - ${akunMutasi.akun.nama}` : akunMutasi.akun.nama}
                  </p>
                  <p className="text-xs font-semibold text-zinc-700">
                    Saldo: {formatRupiah(akunMutasi.saldoAkhir)}
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-100 bg-zinc-50/60">
                        <th className="px-5 py-2 text-[10px] font-semibold text-zinc-400 text-left">No. Jurnal</th>
                        <th className="px-5 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">Tanggal</th>
                        <th className="px-5 py-2 text-[10px] font-semibold text-zinc-400 text-left">Keterangan</th>
                        <th className="px-5 py-2 text-[10px] font-semibold text-zinc-400 text-right w-32">Masuk</th>
                        <th className="px-5 py-2 text-[10px] font-semibold text-zinc-400 text-right w-32">Keluar</th>
                        <th className="px-5 py-2 text-[10px] font-semibold text-zinc-400 text-right w-32">Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {akunMutasi.rows && akunMutasi.rows.length > 0 ? (
                        akunMutasi.rows.map((row) => {
                          return (
                            <tr key={row.noJurnal + row.tanggal} className="border-b border-zinc-50">
                              <td className="px-5 py-2 text-xs text-zinc-600 whitespace-nowrap">{row.noJurnal}</td>
                              <td className="px-5 py-2 text-xs text-zinc-600 whitespace-nowrap">{formatTanggal(row.tanggal)}</td>
                              <td className="px-5 py-2 text-xs text-zinc-600">{row.keterangan}</td>
                              <td className="px-5 py-2 text-xs text-emerald-600 text-right whitespace-nowrap">{formatRupiah(row.masuk)}</td>
                              <td className="px-5 py-2 text-xs text-red-500 text-right whitespace-nowrap">{formatRupiah(row.keluar)}</td>
                              <td className="px-5 py-2 text-xs text-zinc-700 font-medium text-right whitespace-nowrap">
                                {formatRupiah(row.saldo)}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-5 py-6 text-center text-xs text-zinc-400">
                            Belum ada mutasi.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm">
            <p className="py-12 text-center text-xs text-zinc-400">
              Belum ada akun Kas &amp; Bank aktif. Tandai akun sebagai Kas &amp; Bank di Master Akun.
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
