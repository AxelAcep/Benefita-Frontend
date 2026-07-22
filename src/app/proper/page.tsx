"use client";

import React, { useState } from "react";
import AppLayout from "@/components/app-layout";
import { useProperList } from "@/hooks/use-proper";
import { ProperProvinsiData } from "@/lib/services/proper.service";

function Val({ v }: { v: number | null }) {
  return (
    <td className="px-4 py-3 text-xs text-center text-zinc-500">
      {v === null ? "-" : v}
    </td>
  );
}

function Dot({ color }: { color: string }) {
  return (
    <span
      className="inline-block w-3 h-3 rounded-full ml-1 align-middle"
      style={{ backgroundColor: color }}
    />
  );
}

export default function ProperPage() {
  const [search, setSearch] = useState("");
  const [tahun, setTahun] = useState("2025");
  const [appliedTahun, setAppliedTahun] = useState("2025");

  const tahunNumber = parseInt(appliedTahun, 10);
  const { data, loading, error } = useProperList(
    isNaN(tahunNumber) ? 2026 : tahunNumber,
  );

  // Map data API ke format tabel (hanya 5 peringkat utama)
  const mappedData =
    data?.data.map((item: ProperProvinsiData, index: number) => ({
      id: item.id,
      provinsi: item.provinsi,
      emas: item.peringkat.EMAS ?? null,
      hijau: item.peringkat.HIJAU ?? null,
      biru: item.peringkat.BIRU ?? null,
      merah: item.peringkat.MERAH ?? null,
      hitam: item.peringkat.HITAM ?? null,
    })) ?? [];

  // Filter lokal
  const filtered = mappedData.filter((d) =>
    d.provinsi.toLowerCase().includes(search.toLowerCase()),
  );

  const totalKeseluruhan = data?.total ?? 0;

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Perusahaan", href: "/perusahaan" },
        { label: "PROPER" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-medium">Tahun</span>
            <div className="relative">
              <input
                type="text"
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                className="border border-zinc-200 rounded-lg px-2.5 py-1.5 pr-7 text-xs text-zinc-700 outline-none focus:border-emerald-300 w-28"
              />
              <svg
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <button
              onClick={() => {
                setAppliedTahun(tahun);
              }}
              className="px-3 py-1.5 text-xs bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
            >
              Terapkan
            </button>
          </div>

          <div className="relative">
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
              placeholder="Cari informasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Provinsi
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-28">
                  Emas <Dot color="#EAB308" />
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-28">
                  Hijau <Dot color="#22C55E" />
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-28">
                  Biru <Dot color="#3B82F6" />
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-28">
                  Merah <Dot color="#EF4444" />
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-28">
                  Hitam <Dot color="#1F2937" />
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-20">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-xs text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => {
                  const total =
                    (row.emas ?? 0) +
                    (row.hijau ?? 0) +
                    (row.biru ?? 0) +
                    (row.merah ?? 0) +
                    (row.hitam ?? 0);
                  return (
                    <tr
                      key={row.id}
                      className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs text-zinc-400">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline">
                        <a href={`database/pemda/${row.id}`}>{row.provinsi}</a>
                      </td>
                      <Val v={row.emas} />
                      <Val v={row.hijau} />
                      <Val v={row.biru} />
                      <Val v={row.merah} />
                      <Val v={row.hitam} />
                      <td className="px-4 py-3 text-xs text-center font-semibold text-zinc-700">
                        {total}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {!loading && !error && data && (
              <tfoot>
                <tr className="border-t border-zinc-200 bg-zinc-50/60">
                  <td
                    colSpan={7}
                    className="px-4 py-3 text-xs font-semibold text-zinc-600 text-right"
                  >
                    Total Keseluruhan
                  </td>
                  <td className="px-4 py-3 text-xs text-center font-semibold text-zinc-700">
                    {totalKeseluruhan}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
