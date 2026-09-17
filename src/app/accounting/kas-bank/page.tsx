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

export default function KasBankPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { data, loading, fetchData } = useKasBank();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onFilter() {
    fetchData({ startDate: startDate || undefined, endDate: endDate || undefined });
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <Wallet2 size={22} /> Kas & Bank
          </h1>
          <p className="text-sm text-gray-500">
            Mutasi dan saldo seluruh akun Kas &amp; Bank.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Dari Tanggal</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Sampai Tanggal</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
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
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              Total Saldo Gabungan: {formatRupiah(data.totalSaldoGabungan)}
            </span>
          ) : null}
        </div>

        {loading ? (
          <p className="py-6 text-center text-gray-400">Memuat data...</p>
        ) : data && data.mutasi && data.mutasi.length > 0 ? (
          data.mutasi.map((akunMutasi) => {
            return (
              <div key={akunMutasi.akun.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-3">
                  <h2 className="text-sm font-semibold text-gray-700">
                    {akunMutasi.akun.kode ? `${akunMutasi.akun.kode} - ${akunMutasi.akun.nama}` : akunMutasi.akun.nama}
                  </h2>
                  <span className="text-sm font-semibold text-gray-700">
                    Saldo: {formatRupiah(akunMutasi.saldoAkhir)}
                  </span>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                    <tr>
                      <th className="px-4 py-2">No. Jurnal</th>
                      <th className="px-4 py-2">Tanggal</th>
                      <th className="px-4 py-2">Keterangan</th>
                      <th className="px-4 py-2 text-right">Masuk</th>
                      <th className="px-4 py-2 text-right">Keluar</th>
                      <th className="px-4 py-2 text-right">Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {akunMutasi.rows && akunMutasi.rows.length > 0 ? (
                      akunMutasi.rows.map((row) => {
                        return (
                          <tr key={row.noJurnal + row.tanggal}>
                            <td className="px-4 py-2 text-gray-600">{row.noJurnal}</td>
                            <td className="px-4 py-2 text-gray-600">{formatTanggal(row.tanggal)}</td>
                            <td className="px-4 py-2 text-gray-600">{row.keterangan}</td>
                            <td className="px-4 py-2 text-right text-emerald-600">{formatRupiah(row.masuk)}</td>
                            <td className="px-4 py-2 text-right text-red-500">{formatRupiah(row.keluar)}</td>
                            <td className="px-4 py-2 text-right font-medium text-gray-700">
                              {formatRupiah(row.saldo)}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-4 text-center text-gray-400">
                          Belum ada mutasi.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            );
          })
        ) : (
          <p className="py-6 text-center text-gray-400">
            Belum ada akun Kas &amp; Bank aktif. Tandai akun sebagai Kas &amp; Bank di Master Akun.
          </p>
        )}
      </div>
    </AppLayout>
  );
}
