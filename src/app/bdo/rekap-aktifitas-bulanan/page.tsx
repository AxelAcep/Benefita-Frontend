"use client";

import React, { useState } from "react";
import { BarChart2 } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RekapDailyAE {
  id: number;
  nama: string;
  hari: Record<number, number | null>;
  total: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function getCellStyle(val: number | null): React.CSSProperties {
  if (val === null) return {};
  // Warna hijau emerald untuk sel yang ada nilainya
  return { backgroundColor: "#d1fae5", color: "#065f46" };
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const buildDummy = (): RekapDailyAE[] => [
  {
    id: 1,
    nama: "Aldy",
    hari: { 1: 10, 2: 10, 3: 10, 4: 10, 5: 10 },
    total: 50,
  },
  {
    id: 2,
    nama: "Andi",
    hari: { 1: 11, 2: 11, 3: 11, 4: 11, 5: 11 },
    total: 55,
  },
  {
    id: 3,
    nama: "Ihsan",
    hari: { 1: 13, 2: 13, 3: 13, 4: 13, 5: 13 },
    total: 65,
  },
  {
    id: 4,
    nama: "Gempi",
    hari: { 1: 23, 2: 23, 3: 23, 4: 23, 5: 23 },
    total: 115,
  },
  {
    id: 5,
    nama: "Budi",
    hari: { 1: 8, 2: 9, 3: 8, 4: 10, 5: 7, 6: 9, 7: 8 },
    total: 59,
  },
  {
    id: 6,
    nama: "Siti",
    hari: { 3: 12, 4: 11, 5: 13, 8: 10, 9: 12 },
    total: 58,
  },
  {
    id: 7,
    nama: "Deni",
    hari: { 2: 15, 3: 14, 6: 16, 7: 15, 10: 14 },
    total: 74,
  },
  {
    id: 8,
    nama: "Rina",
    hari: { 1: 9, 5: 10, 6: 11, 11: 9, 12: 10 },
    total: 49,
  },
];

const DUMMY_DATA = buildDummy();

// ---------------------------------------------------------------------------
// Total badge color — kuning pastel seperti di screenshot
// ---------------------------------------------------------------------------

const TOTAL_STYLE: React.CSSProperties = {
  backgroundColor: "#fef9c3",
  color: "#854d0e",
  fontWeight: 700,
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RekapDailyAEPage() {
  const [bulan, setBulan] = useState("2026-04");
  const [appliedBulan, setAppliedBulan] = useState("2026-04");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const handleTerapkan = () => {
    setAppliedBulan(bulan);
    setCurrentPage(1);
  };

  // Parse year & month dari appliedBulan
  const [year, month] = appliedBulan.split("-").map(Number);
  const totalDays = getDaysInMonth(year, month);
  const dayNumbers = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Format display bulan: "April 2026"
  const formatBulan = (val: string) => {
    const [y, m] = val.split("-");
    const date = new Date(Number(y), Number(m) - 1, 1);
    return date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  };

  const filtered = DUMMY_DATA.filter((d) =>
    d.nama.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Aktivitas", href: "/aktivitas" },
        { label: "Rekap Daily AE" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-zinc-100 space-y-3">
          {/* Title */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <BarChart2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">
              Rekap Daily AE
            </span>
          </div>

          {/* Filter baris */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-zinc-500 whitespace-nowrap">
                Pilih Tanggal
              </span>
              <div className="relative">
                <input
                  type="month"
                  value={bulan}
                  onChange={(e) => setBulan(e.target.value)}
                  className="pl-3 pr-8 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all cursor-pointer bg-white"
                />
              </div>
              <button
                onClick={handleTerapkan}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
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
                className="w-full sm:w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table
            className="w-full table-fixed"
            style={{ minWidth: `${totalDays * 36 + 260}px` }}
          >
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No ↕
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  Nama AE
                </th>
                {dayNumbers.map((d) => (
                  <th
                    key={d}
                    className="py-2 text-[10px] font-semibold text-zinc-400 text-center"
                  >
                    {d}
                  </th>
                ))}
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-14">
                  Total
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-right w-24">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={totalDays + 4}
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
                    <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                      {row.nama}
                    </td>
                    {dayNumbers.map((d) => {
                      const val = row.hari[d] ?? null;
                      return (
                        <td
                          key={d}
                          style={getCellStyle(val)}
                          className="py-3 text-xs text-center"
                        >
                          {val !== null ? val : ""}
                        </td>
                      );
                    })}
                    <td
                      style={TOTAL_STYLE}
                      className="px-3 py-3 text-xs text-center"
                    >
                      {row.total}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 transition-colors whitespace-nowrap">
                        Lihat Detail →
                      </button>
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
