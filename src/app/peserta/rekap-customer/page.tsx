"use client";

import React, { useState } from "react";
import { Users } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RekapCustomer {
  id: number;
  noInduk: string;
  perusahaan: string;
  total: number;
  reg: number;
  inh: number;
  env: string;
  csr: string;
  tsm: string;
  epm: string;
  tahunPelatihan: string;
  proper: string | null;
  lineBisnis: string | null;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: RekapCustomer[] = [
  {
    id: 1,
    noInduk: "PD09927",
    perusahaan: "PT. ABC",
    total: 1,
    reg: 1,
    inh: 0,
    env: "EE",
    csr: "EE",
    tsm: "TA",
    epm: "NW",
    tahunPelatihan: "2023 – 2023",
    proper: null,
    lineBisnis: null,
  },
  {
    id: 2,
    noInduk: "PD09928",
    perusahaan: "PT. BCA",
    total: 1,
    reg: 1,
    inh: 0,
    env: "EE",
    csr: "EE",
    tsm: "TA",
    epm: "NW",
    tahunPelatihan: "2021 – 2021",
    proper: null,
    lineBisnis: null,
  },
  {
    id: 3,
    noInduk: "PD02073",
    perusahaan: "PT. XYZ",
    total: 2,
    reg: 2,
    inh: 0,
    env: "EE",
    csr: "EE",
    tsm: "TA",
    epm: "NW",
    tahunPelatihan: "2017 – 2017",
    proper: null,
    lineBisnis: null,
  },
  {
    id: 4,
    noInduk: "PD07101",
    perusahaan: "PT. ACC",
    total: 3,
    reg: 3,
    inh: 0,
    env: "EE",
    csr: "EE",
    tsm: "TA",
    epm: "NW",
    tahunPelatihan: "2013 – 2013",
    proper: null,
    lineBisnis: null,
  },
];

const DATABASE_OPTIONS = [
  "Pilih Database",
  "Database-01",
  "Database-02",
  "Database-03",
];
const LINE_BISNIS_OPTIONS = [
  "Pilih Line Bisnis",
  "1-Mining:Produk",
  "1-Mining:PEM",
  "2-Manufacturing",
];

const TOTAL_DATA = 28;
const TOTAL_PAGES = 7;
const PAGE_SIZE = 10;

// ---------------------------------------------------------------------------
// Colored full-cell
// ---------------------------------------------------------------------------

type CellColor = "blue" | "green" | "purple" | "yellow";

const CELL_STYLES: Record<CellColor, React.CSSProperties> = {
  blue: { backgroundColor: "#bfdbfe", color: "#1d4ed8" },
  green: { backgroundColor: "#bbf7d0", color: "#15803d" },
  purple: { backgroundColor: "#e9d5ff", color: "#7e22ce" },
  yellow: { backgroundColor: "#fef08a", color: "#854d0e" },
};

function ColorCell({ val, color }: { val: string; color: CellColor }) {
  return (
    <td
      className="px-3 py-3 text-center text-xs font-thin align-top w-20"
      style={CELL_STYLES[color]}
    >
      {val}
    </td>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RekapPesertaPerCustomerPage() {
  const [search, setSearch] = useState("");
  const [selectedDatabase, setSelectedDatabase] = useState("Pilih Database");
  const [selectedLineBisnis, setSelectedLineBisnis] =
    useState("Pilih Line Bisnis");
  const [currentPage, setCurrentPage] = useState(1);

  const handleTerapkan = () => setCurrentPage(1);

  const filtered = DUMMY_DATA.filter(
    (d) =>
      d.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
      d.noInduk.toLowerCase().includes(search.toLowerCase()),
  );

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const selectStyle = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 6px center",
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Perusahaan", href: "/perusahaan" },
        { label: "Rekap Peserta per Customer" },
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
                <Users className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">
                Rekap Peserta per Customer
              </span>
            </div>

            {/* Filter Database */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Database
              </span>
              <select
                value={selectedDatabase}
                onChange={(e) => setSelectedDatabase(e.target.value)}
                className="pl-2.5 pr-6 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white appearance-none cursor-pointer"
                style={selectStyle}
              >
                {DATABASE_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Line Bisnis */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Line Bisnis
              </span>
              <select
                value={selectedLineBisnis}
                onChange={(e) => setSelectedLineBisnis(e.target.value)}
                className="pl-2.5 pr-6 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white appearance-none cursor-pointer"
                style={selectStyle}
              >
                {LINE_BISNIS_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Terapkan */}
            <button
              onClick={handleTerapkan}
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
                  No. Induk
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Perusahaan/Instansi
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  Total
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  REG
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  INH
                </th>
                {/* Colored headers */}
                <th
                  className="px-3 py-2 text-[10px] font-bold text-center w-20"
                  style={{ backgroundColor: "#bfdbfe", color: "#1d4ed8" }}
                >
                  ENV
                </th>
                <th
                  className="px-3 py-2 text-[10px] font-bold text-center w-20"
                  style={{ backgroundColor: "#bbf7d0", color: "#15803d" }}
                >
                  CSR
                </th>
                <th
                  className="px-3 py-2 text-[10px] font-bold text-center w-20"
                  style={{ backgroundColor: "#e9d5ff", color: "#7e22ce" }}
                >
                  TSM
                </th>
                <th
                  className="px-3 py-2 text-[10px] font-bold text-center w-20"
                  style={{ backgroundColor: "#fef08a", color: "#854d0e" }}
                >
                  EPM
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  Tahun Pelatihan
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-20">
                  PROPER
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  Line Bisnis
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={13}
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
                    <td className="px-4 py-3 text-xs text-zinc-400 align-top">
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 align-top">
                      {row.noInduk}
                    </td>
                    <td className="px-3 py-3 text-xs align-top">
                      <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">
                        {row.perusahaan}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center text-xs text-zinc-600 font-medium align-top">
                      {row.total}
                    </td>
                    <td className="px-3 py-3 text-center text-xs text-zinc-600 font-medium align-top">
                      {row.reg}
                    </td>
                    <td className="px-3 py-3 text-center text-xs text-zinc-600 font-medium align-top">
                      {row.inh}
                    </td>
                    <ColorCell val={row.env} color="blue" />
                    <ColorCell val={row.csr} color="green" />
                    <ColorCell val={row.tsm} color="purple" />
                    <ColorCell val={row.epm} color="yellow" />
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                      {row.tahunPelatihan}
                    </td>
                    <td className="px-3 py-3 text-center text-xs align-top">
                      {row.proper ?? (
                        <span className="text-zinc-300 select-none">–</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs align-top">
                      {row.lineBisnis ?? (
                        <span className="text-zinc-300 select-none">–</span>
                      )}
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
