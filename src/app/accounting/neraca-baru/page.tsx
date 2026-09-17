"use client";

import React, { useEffect, useState } from "react";
import { Scale } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { useLaporanNeraca } from "@/hooks/use-laporan-keuangan";

function formatRupiah(val: number) {
  return `Rp${val.toLocaleString("id-ID")}`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function NeracaSection({
  title,
  rows,
  total,
}: {
  title: string;
  rows: { akun: { id: number; kode: string | null; nama: string }; saldo: number }[];
  total: number;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="border-b bg-gray-50 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
      </div>
      <table className="w-full text-sm">
        <tbody className="divide-y divide-gray-100">
          {rows && rows.length > 0 ? (
            rows.map((r) => {
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
                Tidak ada data.
              </td>
            </tr>
          )}
          <tr className="bg-gray-50 font-semibold text-gray-700">
            <td className="px-4 py-2">Total {title}</td>
            <td className="px-4 py-2 text-right">{formatRupiah(total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function NeracaBaruPage() {
  const [tanggal, setTanggal] = useState(todayIso());
  const { data, loading, fetchData } = useLaporanNeraca();

  useEffect(() => {
    fetchData(tanggal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onFilter() {
    fetchData(tanggal);
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <Scale size={22} /> Neraca
          </h1>
          <p className="text-sm text-gray-500">
            Posisi keuangan (Aset = Liabilitas + Modal) per tanggal tertentu.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Per Tanggal</label>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
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
                data.isBalance ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
              }`}
            >
              {data.isBalance ? "Balance" : `Selisih ${formatRupiah(data.selisih)}`}
            </span>
          ) : null}
        </div>

        {loading ? (
          <p className="py-6 text-center text-gray-400">Memuat data...</p>
        ) : data ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <NeracaSection title="Aset" rows={data.aset} total={data.totalAset} />
            <div className="space-y-6">
              <NeracaSection title="Liabilitas" rows={data.liabilitas} total={data.totalLiabilitas} />
              <NeracaSection title="Modal" rows={data.modal} total={data.totalModal} />
            </div>
          </div>
        ) : null}
      </div>
    </AppLayout>
  );
}
