"use client";

import React, { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import AppLayout from "@/components/app-layout";
import {
  getLaporanKlhk,
  type LaporanKlhkRow,
} from "@/lib/services/peserta-uji.service";
import {
  getSkemaKualifikasiOptions,
  type SkemaKualifikasiOption,
} from "@/lib/services/input.service";

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function LaporanKlhkPage() {
  const [data, setData] = useState<LaporanKlhkRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [tahun, setTahun] = useState("");
  const [skemaId, setSkemaId] = useState<number | "">("");
  const [skemaOptions, setSkemaOptions] = useState<SkemaKualifikasiOption[]>([]);

  useEffect(() => {
    getSkemaKualifikasiOptions()
      .then(setSkemaOptions)
      .catch(() => setSkemaOptions([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    getLaporanKlhk({ tahun: tahun || undefined, skemaId: skemaId || undefined })
      .then(setData)
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [tahun, skemaId]);

  const totalK = data.reduce((acc, r) => acc + r.jumlahK, 0);
  const totalBk = data.reduce((acc, r) => acc + r.jumlahBk, 0);
  const totalAll = data.reduce((acc, r) => acc + r.jumlahTotal, 0);

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Laporan KLHK" },
      ]}
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">
              Laporan KLHK — Rekap Ujian
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-500 font-medium">
              Tahun
            </span>
            <input
              type="number"
              placeholder="Semua tahun"
              value={tahun}
              onChange={(e) => setTahun(e.target.value)}
              className="w-28 px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-500 font-medium">
              Skema
            </span>
            <select
              value={skemaId}
              onChange={(e) =>
                setSkemaId(e.target.value ? Number(e.target.value) : "")
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

          <div className="ml-auto flex items-center gap-3 text-[11px] text-zinc-500">
            <span>
              Total K:{" "}
              <span className="font-semibold text-emerald-600">{totalK}</span>
            </span>
            <span>
              Total BK:{" "}
              <span className="font-semibold text-red-500">{totalBk}</span>
            </span>
            <span>
              Total:{" "}
              <span className="font-semibold text-zinc-700">{totalAll}</span>
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Tgl Ujian
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  Kode Skema
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Kualifikasi
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  K
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  BK
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  Jml
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-xs text-zinc-400">
                    Memuat data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-xs text-zinc-400">
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr
                    key={`${row.tglUjian}-${row.kodeSkema}`}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-400">{i + 1}</td>
                    <td className="px-4 py-3 text-xs text-zinc-700 font-medium whitespace-nowrap">
                      {formatTanggal(row.tglUjian)}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                      {row.kodeSkema}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.namaSkema}
                    </td>
                    <td className="px-4 py-3 text-xs text-emerald-600 font-semibold text-center">
                      {row.jumlahK}
                    </td>
                    <td className="px-4 py-3 text-xs text-red-500 font-semibold text-center">
                      {row.jumlahBk}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700 font-semibold text-center">
                      {row.jumlahTotal}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
