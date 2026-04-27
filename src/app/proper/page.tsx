"use client";

import React, { useState } from "react";
import AppLayout from "@/components/app-layout";

interface ProperData {
  id: number;
  provinsi: string;
  emas: number | null;
  hijau: number | null;
  biru: number | null;
  merah: number | null;
  hitam: number | null;
}

const DUMMY_DATA: ProperData[] = [
  {
    id: 1,
    provinsi: "Prov. Bali",
    emas: null,
    hijau: null,
    biru: null,
    merah: null,
    hitam: 1,
  },
  {
    id: 2,
    provinsi: "Prov. Banten",
    emas: null,
    hijau: null,
    biru: 1,
    merah: null,
    hitam: 2,
  },
  {
    id: 3,
    provinsi: "Prov. Bengkulu",
    emas: null,
    hijau: null,
    biru: 1,
    merah: null,
    hitam: 3,
  },
  {
    id: 4,
    provinsi: "Prov. DI Yogyakarta",
    emas: null,
    hijau: null,
    biru: null,
    merah: 5,
    hitam: 4,
  },
  {
    id: 5,
    provinsi: "Prov. DKI Jakarta",
    emas: 2,
    hijau: 3,
    biru: 5,
    merah: 1,
    hitam: 2,
  },
  {
    id: 6,
    provinsi: "Prov. Gorontalo",
    emas: null,
    hijau: 1,
    biru: null,
    merah: null,
    hitam: 1,
  },
  {
    id: 7,
    provinsi: "Prov. Jambi",
    emas: null,
    hijau: null,
    biru: 2,
    merah: 3,
    hitam: 1,
  },
  {
    id: 8,
    provinsi: "Prov. Jawa Barat",
    emas: 1,
    hijau: 4,
    biru: 6,
    merah: 2,
    hitam: 3,
  },
  {
    id: 9,
    provinsi: "Prov. Jawa Tengah",
    emas: null,
    hijau: 2,
    biru: 3,
    merah: null,
    hitam: 2,
  },
  {
    id: 10,
    provinsi: "Prov. Jawa Timur",
    emas: 1,
    hijau: 3,
    biru: 4,
    merah: 1,
    hitam: 5,
  },
  {
    id: 11,
    provinsi: "Prov. Kalimantan Barat",
    emas: null,
    hijau: null,
    biru: 1,
    merah: 2,
    hitam: 3,
  },
  {
    id: 12,
    provinsi: "Prov. Kalimantan Selatan",
    emas: null,
    hijau: 1,
    biru: 2,
    merah: null,
    hitam: 2,
  },
  {
    id: 13,
    provinsi: "Prov. Kalimantan Tengah",
    emas: null,
    hijau: null,
    biru: null,
    merah: 3,
    hitam: 4,
  },
  {
    id: 14,
    provinsi: "Prov. Kalimantan Timur",
    emas: 1,
    hijau: 2,
    biru: 3,
    merah: 1,
    hitam: 2,
  },
  {
    id: 15,
    provinsi: "Prov. Kalimantan Utara",
    emas: null,
    hijau: null,
    biru: 1,
    merah: null,
    hitam: 1,
  },
  {
    id: 16,
    provinsi: "Prov. Kepulauan Bangka Belitung",
    emas: null,
    hijau: 1,
    biru: null,
    merah: 2,
    hitam: 1,
  },
  {
    id: 17,
    provinsi: "Prov. Kepulauan Riau",
    emas: null,
    hijau: null,
    biru: 2,
    merah: 1,
    hitam: 3,
  },
  {
    id: 18,
    provinsi: "Prov. Lampung",
    emas: null,
    hijau: 1,
    biru: 1,
    merah: null,
    hitam: 2,
  },
  {
    id: 19,
    provinsi: "Prov. Maluku",
    emas: null,
    hijau: null,
    biru: null,
    merah: 1,
    hitam: 1,
  },
  {
    id: 20,
    provinsi: "Prov. Maluku Utara",
    emas: null,
    hijau: null,
    biru: 1,
    merah: null,
    hitam: 2,
  },
  {
    id: 21,
    provinsi: "Prov. Nusa Tenggara Barat",
    emas: null,
    hijau: null,
    biru: null,
    merah: 2,
    hitam: 1,
  },
  {
    id: 22,
    provinsi: "Prov. Nusa Tenggara Timur",
    emas: null,
    hijau: null,
    biru: 1,
    merah: 1,
    hitam: 1,
  },
  {
    id: 23,
    provinsi: "Prov. Papua",
    emas: null,
    hijau: null,
    biru: null,
    merah: 1,
    hitam: 2,
  },
  {
    id: 24,
    provinsi: "Prov. Papua Barat",
    emas: null,
    hijau: null,
    biru: 1,
    merah: null,
    hitam: 1,
  },
  {
    id: 25,
    provinsi: "Prov. Riau",
    emas: null,
    hijau: 2,
    biru: 3,
    merah: 1,
    hitam: 4,
  },
  {
    id: 26,
    provinsi: "Prov. Sulawesi Selatan",
    emas: null,
    hijau: 1,
    biru: 2,
    merah: null,
    hitam: 3,
  },
  {
    id: 27,
    provinsi: "Prov. Sulawesi Tengah",
    emas: null,
    hijau: null,
    biru: 1,
    merah: 2,
    hitam: 1,
  },
  {
    id: 28,
    provinsi: "Prov. Sumatera Utara",
    emas: 1,
    hijau: 2,
    biru: 3,
    merah: null,
    hitam: 2,
  },
];

const PAGE_SIZE = 4;

function getPageNumbers(currentPage: number, totalPages: number) {
  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3, "...ellipsis", totalPages);
  }
  return pages;
}

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
  const [tahun, setTahun] = useState("2026");
  const [appliedTahun, setAppliedTahun] = useState("2026");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = DUMMY_DATA.filter((d) =>
    d.provinsi.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

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
                setCurrentPage(1);
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
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
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
                  No ↕
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
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => {
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
                        {(currentPage - 1) * PAGE_SIZE + i + 1}
                      </td>
                      <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline">
                        {row.provinsi}
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
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-zinc-100">
          <p className="text-[11px] text-zinc-400">
            Menampilkan{" "}
            <span className="font-semibold text-zinc-600">
              {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-zinc-600">
              {filtered.length}
            </span>{" "}
            data
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              ‹ Sebelumnya
            </button>
            {getPageNumbers(currentPage, totalPages).map((p) =>
              typeof p === "string" ? (
                <span
                  key={p}
                  className="w-7 h-7 flex items-center justify-center text-[11px] text-zinc-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
                    p === currentPage
                      ? "bg-emerald-500 text-white"
                      : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Selanjutnya ›
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
