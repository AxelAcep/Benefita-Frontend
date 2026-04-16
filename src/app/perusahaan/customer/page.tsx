"use client";

import React, { useState } from "react";
import { LayoutGrid } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PerusahaanCustomer {
  id: number;
  noInduk: string;
  perusahaan: string;
  env: string;
  csr: string;
  tsm: string;
  epm: string;
  proper: string;
  pelPertamaTgl: string;
  pelPertamaThn: number;
  pelTerakhirTgl: string;
  pelTerakhirThn: number;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: PerusahaanCustomer[] = [
  {
    id: 1,
    noInduk: "PR00621",
    perusahaan: "PT. ABC",
    env: "EE",
    csr: "EE",
    tsm: "TA",
    epm: "NW",
    proper: "PR",
    pelPertamaTgl: "9 - 11 March 2026",
    pelPertamaThn: 2026,
    pelTerakhirTgl: "9 - 11 March 2026",
    pelTerakhirThn: 2026,
  },
  {
    id: 2,
    noInduk: "PR07304",
    perusahaan: "PT. BCA",
    env: "SL",
    csr: "SL",
    tsm: "CF",
    epm: "NW",
    proper: "P24: Merah PR",
    pelPertamaTgl: "23 - 26 February 2026",
    pelPertamaThn: 2026,
    pelTerakhirTgl: "23 - 26 February 2026",
    pelTerakhirThn: 2026,
  },
  {
    id: 3,
    noInduk: "PR02434",
    perusahaan: "PT. XYZ",
    env: "SL",
    csr: "NW",
    tsm: "EE",
    epm: "SL",
    proper: "CKAN25; P2 PR",
    pelPertamaTgl: "2 - 4 February 2026",
    pelPertamaThn: 2026,
    pelTerakhirTgl: "2 - 4 February 2026",
    pelTerakhirThn: 2026,
  },
  {
    id: 4,
    noInduk: "PR08091",
    perusahaan: "PT. ACC",
    env: "SL",
    csr: "EE",
    tsm: "EE",
    epm: "SL",
    proper: "PR",
    pelPertamaTgl: "2 - 4 February 2026",
    pelPertamaThn: 2026,
    pelTerakhirTgl: "2 - 4 February 2026",
    pelTerakhirThn: 2026,
  },
  {
    id: 5,
    noInduk: "PR00145",
    perusahaan: "PT. Maju Jaya",
    env: "NW",
    csr: "SL",
    tsm: "SL",
    epm: "EE",
    proper: "P24: Emas PR",
    pelPertamaTgl: "14 - 16 January 2025",
    pelPertamaThn: 2025,
    pelTerakhirTgl: "14 - 16 January 2025",
    pelTerakhirThn: 2025,
  },
  {
    id: 6,
    noInduk: "PR00312",
    perusahaan: "PT. Nusantara Energy",
    env: "EE",
    csr: "CF",
    tsm: "NW",
    epm: "TA",
    proper: "CKAN25; P3 PR",
    pelPertamaTgl: "5 - 7 March 2025",
    pelPertamaThn: 2025,
    pelTerakhirTgl: "5 - 7 March 2025",
    pelTerakhirThn: 2025,
  },
  {
    id: 7,
    noInduk: "PR00489",
    perusahaan: "PT. Sinar Mas",
    env: "SL",
    csr: "SL",
    tsm: "EE",
    epm: "NW",
    proper: "PR",
    pelPertamaTgl: "10 - 12 April 2025",
    pelPertamaThn: 2025,
    pelTerakhirTgl: "10 - 12 April 2025",
    pelTerakhirThn: 2025,
  },
  {
    id: 8,
    noInduk: "PR00567",
    perusahaan: "PT. Tambang Raya",
    env: "TA",
    csr: "NW",
    tsm: "SL",
    epm: "CF",
    proper: "P24: Hijau PR",
    pelPertamaTgl: "20 - 22 June 2024",
    pelPertamaThn: 2024,
    pelTerakhirTgl: "20 - 22 June 2024",
    pelTerakhirThn: 2024,
  },
  {
    id: 9,
    noInduk: "PR00734",
    perusahaan: "PT. Indah Nusantara",
    env: "CF",
    csr: "EE",
    tsm: "NW",
    epm: "SL",
    proper: "CKAN24; P2 PR",
    pelPertamaTgl: "8 - 10 August 2024",
    pelPertamaThn: 2024,
    pelTerakhirTgl: "8 - 10 August 2024",
    pelTerakhirThn: 2024,
  },
  {
    id: 10,
    noInduk: "PR00891",
    perusahaan: "PT. Karya Mandiri",
    env: "NW",
    csr: "TA",
    tsm: "CF",
    epm: "EE",
    proper: "PR",
    pelPertamaTgl: "15 - 17 October 2024",
    pelPertamaThn: 2024,
    pelTerakhirTgl: "15 - 17 October 2024",
    pelTerakhirThn: 2024,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const BADGE_CLASS: Record<string, string> = {
  EE: "bg-green-100 text-green-800",
  SL: "bg-blue-100 text-blue-800",
  NW: "bg-yellow-100 text-yellow-800",
  TA: "bg-purple-100 text-purple-800",
  CF: "bg-orange-100 text-orange-800",
};

function AccBadge({ val }: { val: string }) {
  const cls = BADGE_CLASS[val] ?? "bg-zinc-100 text-zinc-600";
  return (
    <td className={`px-3 py-4 text-center ${cls}`}>
      <span className="text-[11px] font-bold tracking-wide">{val}</span>
    </td>
  );
}

const FILTER_OPTIONS = [
  { label: "Terbaru", value: "terbaru" },
  { label: "Semua", value: "semua" },
  { label: "2026", value: "2026" },
  { label: "2025", value: "2025" },
  { label: "2024", value: "2024" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DaftarPerusahaanCustomerPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("terbaru");
  const [appliedFilter, setAppliedFilter] = useState("terbaru");
  const PAGE_SIZE = 10;

  // Filter logic
  const filtered = DUMMY_DATA.filter((d) => {
    const matchSearch =
      d.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
      d.noInduk.toLowerCase().includes(search.toLowerCase());

    let matchFilter = true;
    if (appliedFilter === "terbaru" || appliedFilter === "2026") {
      matchFilter = d.pelTerakhirThn === 2026;
    } else if (appliedFilter === "2025") {
      matchFilter = d.pelTerakhirThn === 2025;
    } else if (appliedFilter === "2024") {
      matchFilter = d.pelTerakhirThn === 2024;
    }
    // "semua" → no filter

    return matchSearch && matchFilter;
  });

  const filterLabel =
    appliedFilter === "terbaru"
      ? "Peserta Terakhir 2026"
      : appliedFilter === "semua"
        ? "Semua Peserta"
        : `Peserta Terakhir ${appliedFilter}`;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Daftar Perusahaan Customer" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <LayoutGrid className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">
              Daftar Perusahaan Customer
            </span>
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
              className="w-full sm:w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
            />
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-5 py-3 border-b border-zinc-100 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-zinc-500 font-medium mr-1">
            Peserta Terakhir
          </span>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="text-xs border border-zinc-200 rounded-lg px-2.5 py-1.5 text-zinc-700 outline-none focus:border-emerald-300 transition-all bg-white"
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              setAppliedFilter(selectedFilter);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 text-[11px] bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
          >
            Terapkan
          </button>
          <span className="text-[11px] text-emerald-600 font-medium ml-1">
            Menampilkan data dari &quot;{filterLabel}&quot;
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th
                  className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10"
                  rowSpan={2}
                >
                  No ↕
                </th>
                <th
                  className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24"
                  rowSpan={2}
                >
                  IN_PER
                </th>
                <th
                  className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-44"
                  rowSpan={2}
                >
                  Perusahaan/Instansi
                </th>
                <th
                  className="px-3 py-2 text-[10px] font-bold text-center w-16 bg-blue-100 text-blue-800"
                  rowSpan={2}
                >
                  ENV ↕
                </th>
                <th
                  className="px-3 py-2 text-[10px] font-bold text-center w-16 bg-green-100 text-green-800"
                  rowSpan={2}
                >
                  CSR ↕
                </th>
                <th
                  className="px-3 py-2 text-[10px] font-bold text-center w-16 bg-purple-100 text-purple-800"
                  rowSpan={2}
                >
                  TSM ↕
                </th>
                <th
                  className="px-3 py-2 text-[10px] font-bold text-center w-16 bg-yellow-100 text-yellow-800"
                  rowSpan={2}
                >
                  EPM ↕
                </th>
                <th
                  className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32"
                  rowSpan={2}
                >
                  PROPER
                </th>
                {/* Pel. Pertama group */}
                <th
                  colSpan={2}
                  className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center border-b border-zinc-100"
                >
                  Pel. Pertama
                </th>
                {/* Pel. Terakhir group */}
                <th
                  colSpan={2}
                  className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center border-b border-zinc-100"
                >
                  Pel. Terakhir
                </th>
              </tr>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-36">
                  Tgl ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  Thn ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-36">
                  Tgl ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  Thn ↕
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="px-4 py-16 text-center text-xs text-zinc-400"
                  >
                    Belum Ada Data
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-4 py-4 text-xs text-zinc-400">
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-4 py-4 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap">
                      {row.noInduk}
                    </td>
                    <td className="px-4 py-4 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap max-w-[160px] truncate overflow-hidden">
                      {row.perusahaan}
                    </td>
                    <td className="px-3 py-4 text-xs text-blue-700 bg-blue-100 whitespace-nowrap">
                      {row.env}
                    </td>

                    <td className="px-3 py-4 text-xs text-green-700 bg-green-100 text-center">
                      {row.csr}
                    </td>

                    <td className="px-3 py-4 text-xs text-purple-700 bg-purple-100 whitespace-nowrap">
                      {row.tsm}
                    </td>

                    <td className="px-3 py-4 text-xs text-yellow-700 bg-yellow-100 text-center">
                      {row.epm}
                    </td>
                    <td className="px-3 py-4 text-xs text-zinc-600">
                      {row.proper}
                    </td>
                    <td className="px-3 py-4 text-xs text-zinc-600 whitespace-nowrap">
                      {row.pelPertamaTgl}
                    </td>
                    <td className="px-3 py-4 text-xs text-zinc-600 text-center">
                      {row.pelPertamaThn}
                    </td>
                    <td className="px-3 py-4 text-xs text-zinc-600 whitespace-nowrap">
                      {row.pelTerakhirTgl}
                    </td>
                    <td className="px-3 py-4 text-xs text-zinc-600 text-center">
                      {row.pelTerakhirThn}
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
