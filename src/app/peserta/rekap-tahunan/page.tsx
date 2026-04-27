"use client";

import React, { useState } from "react";
import { BarChart2 } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RekapReguler {
  id: number;
  kode: string;
  perusahaan: string;
  jan: number | null;
  feb: number | null;
  mar: number | null;
  apr: number | null;
  mei: number | null;
  jun: number | null;
  jul: number | null;
  aug: number | null;
  sep: number | null;
  okt: number | null;
  nov: number | null;
  dec: number | null;
  total: number;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: RekapReguler[] = [
  {
    id: 1,
    kode: "CSR-01",
    perusahaan: "PT. ABC",
    jan: 1,
    feb: 1,
    mar: null,
    apr: null,
    mei: null,
    jun: null,
    jul: null,
    aug: null,
    sep: null,
    okt: null,
    nov: null,
    dec: null,
    total: 2,
  },
  {
    id: 2,
    kode: "CSR-02",
    perusahaan: "PT. BCA",
    jan: 1,
    feb: 1,
    mar: null,
    apr: null,
    mei: null,
    jun: null,
    jul: null,
    aug: null,
    sep: null,
    okt: null,
    nov: null,
    dec: null,
    total: 2,
  },
  {
    id: 3,
    kode: "CSR-03",
    perusahaan: "PT. XYZ",
    jan: 2,
    feb: 2,
    mar: null,
    apr: null,
    mei: null,
    jun: null,
    jul: null,
    aug: null,
    sep: null,
    okt: null,
    nov: null,
    dec: null,
    total: 4,
  },
  {
    id: 4,
    kode: "CSR-04",
    perusahaan: "PT. ACC",
    jan: 3,
    feb: 3,
    mar: null,
    apr: null,
    mei: null,
    jun: null,
    jul: null,
    aug: null,
    sep: null,
    okt: null,
    nov: null,
    dec: null,
    total: 6,
  },
];

const MONTHS = [
  { key: "jan", label: "Jan" },
  { key: "feb", label: "Feb" },
  { key: "mar", label: "Mar" },
  { key: "apr", label: "Apr" },
  { key: "mei", label: "Mei" },
  { key: "jun", label: "Jun" },
  { key: "jul", label: "Jul" },
  { key: "aug", label: "Aug" },
  { key: "sep", label: "Sep" },
  { key: "okt", label: "Okt" },
  { key: "nov", label: "Nov" },
  { key: "dec", label: "Dec" },
] as const;

const TOTAL_DATA = 28;
const TOTAL_PAGES = 7;
const PAGE_SIZE = 10;

// ---------------------------------------------------------------------------
// Cell
// ---------------------------------------------------------------------------

function Cell({ val }: { val: number | null }) {
  if (val === null)
    return (
      <td className="px-3 py-3 text-center text-xs text-zinc-300 select-none">
        –
      </td>
    );
  return (
    <td className="px-3 py-3 text-center text-xs text-zinc-600 font-medium">
      {val}
    </td>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RekapPesertaRegulerTahunanPage() {
  const [search, setSearch] = useState("");
  const [selectedTahun, setSelectedTahun] = useState("2026");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = DUMMY_DATA.filter(
    (d) =>
      d.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
      d.kode.toLowerCase().includes(search.toLowerCase()),
  );

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Rekap Peserta Reguler (Tahunan)" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Title */}
            <div className="flex items-center gap-2 mr-1">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <BarChart2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">
                Rekap Peserta Reguler (Tahunan)
              </span>
            </div>

            {/* Filter Tahun */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Tahun
              </span>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={selectedTahun}
                  onChange={(e) => setSelectedTahun(e.target.value)}
                  className="pl-2.5 pr-7 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all w-20"
                />
                <svg
                  className="absolute right-2 text-zinc-400 pointer-events-none"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>

            {/* Terapkan */}
            <button
              onClick={() => setCurrentPage(1)}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold rounded-lg transition-colors"
            >
              Terapkan
            </button>

            {/* Search */}
            <div className="relative ml-auto">
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
                className="w-full sm:w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No ↕
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  Kode
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  Perusahaan/Instansi
                </th>
                {MONTHS.map((m) => (
                  <th
                    key={m.key}
                    className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-14"
                  >
                    {m.label}
                  </th>
                ))}
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={16}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 font-medium">
                      {row.kode}
                    </td>
                    <td className="px-3 py-3 text-xs">
                      <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">
                        {row.perusahaan}
                      </span>
                    </td>
                    {MONTHS.map((m) => (
                      <Cell key={m.key} val={row[m.key]} />
                    ))}
                    <td className="px-3 py-3 text-center text-xs text-zinc-700 font-bold">
                      {row.total}
                    </td>
                  </tr>
                ))
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
            <span className="font-semibold text-zinc-600">{TOTAL_DATA}</span>{" "}
            data
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              ‹ Sebelumnya
            </button>

            {[1, 2, 3].map((p) => (
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
            ))}

            <span className="text-[11px] text-zinc-400 px-1">...</span>

            <button
              onClick={() => setCurrentPage(TOTAL_PAGES)}
              className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
                currentPage === TOTAL_PAGES
                  ? "bg-emerald-500 text-white"
                  : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
              }`}
            >
              {TOTAL_PAGES}
            </button>

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))
              }
              disabled={currentPage === TOTAL_PAGES}
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
