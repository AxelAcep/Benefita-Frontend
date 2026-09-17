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
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <TrendingUp size={22} /> Laporan Laba Rugi
          </h1>
          <p className="text-sm text-gray-500">
            Ringkasan pendapatan dan beban untuk rentang periode terpilih.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Periode Awal (YYYYMM)</label>
            <input
              type="text"
              value={startPeriode}
              onChange={(e) => setStartPeriode(e.target.value)}
              placeholder="202601"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Periode Akhir (YYYYMM)</label>
            <input
              type="text"
              value={endPeriode}
              onChange={(e) => setEndPeriode(e.target.value)}
              placeholder="202612"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={onFilter}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Tampilkan
          </button>
          {data ? (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                data.status === "FINAL" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
              }`}
            >
              {data.status === "FINAL" ? "Final (sudah tutup buku)" : "Draft (belum tutup buku)"}
            </span>
          ) : null}
        </div>

        {loading ? (
          <p className="py-6 text-center text-gray-400">Memuat data...</p>
        ) : data ? (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="border-b bg-gray-50 px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-700">Pendapatan</h2>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {pendapatanRows && pendapatanRows.length > 0 ? (
                  pendapatanRows.map((r) => {
                    return (
                      <tr key={r.akun.id}>
                        <td className="px-4 py-2 text-gray-600">
                          {r.akun.kode ? `${r.akun.kode} - ${r.akun.nama}` : r.akun.nama}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-700">{formatRupiah(r.saldo)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={2} className="px-4 py-4 text-center text-gray-400">
                      Belum ada pendapatan.
                    </td>
                  </tr>
                )}
                <tr className="bg-gray-50 font-semibold text-gray-700">
                  <td className="px-4 py-2">Total Pendapatan</td>
                  <td className="px-4 py-2 text-right">{formatRupiah(data.totalPendapatan)}</td>
                </tr>
              </tbody>
            </table>

            <div className="border-y bg-gray-50 px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-700">Beban</h2>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                {bebanRows && bebanRows.length > 0 ? (
                  bebanRows.map((r) => {
                    return (
                      <tr key={r.akun.id}>
                        <td className="px-4 py-2 text-gray-600">
                          {r.akun.kode ? `${r.akun.kode} - ${r.akun.nama}` : r.akun.nama}
                        </td>
                        <td className="px-4 py-2 text-right text-gray-700">{formatRupiah(r.saldo)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={2} className="px-4 py-4 text-center text-gray-400">
                      Belum ada beban.
                    </td>
                  </tr>
                )}
                <tr className="bg-gray-50 font-semibold text-gray-700">
                  <td className="px-4 py-2">Total Beban</td>
                  <td className="px-4 py-2 text-right">{formatRupiah(data.totalBeban)}</td>
                </tr>
              </tbody>
            </table>

            <div
              className={`flex items-center justify-between px-4 py-4 text-base font-bold ${
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
