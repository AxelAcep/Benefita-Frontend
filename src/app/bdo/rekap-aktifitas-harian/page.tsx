"use client";

import React, { useState } from "react";
import { BarChart2 } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RekapAktivitas {
  id: number;
  nama: string;
  jam: Record<string, number>;
}

// ---------------------------------------------------------------------------
// Jam columns
// ---------------------------------------------------------------------------

const JAM_COLS = ["08", "09", "10", "11", "12", "13", "14", "15", "16", "17"];

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: RekapAktivitas[] = [
  {
    id: 1,
    nama: "Muamal Rasyid",
    jam: {
      "08": 1,
      "09": 1,
      "10": 1,
      "11": 1,
      "12": 1,
      "13": 1,
      "14": 1,
      "15": 1,
      "16": 1,
      "17": 1,
    },
  },
  {
    id: 2,
    nama: "Yayat Hidayat",
    jam: {
      "08": 1,
      "09": 1,
      "10": 1,
      "11": 1,
      "12": 1,
      "13": 1,
      "14": 1,
      "15": 1,
      "16": 1,
      "17": 1,
    },
  },
  {
    id: 3,
    nama: "Toni Purba",
    jam: {
      "08": 0,
      "09": 0,
      "10": 0,
      "11": 0,
      "12": 0,
      "13": 0,
      "14": 0,
      "15": 0,
      "16": 0,
      "17": 1,
    },
  },
  {
    id: 4,
    nama: "Imamsyah Roesil",
    jam: {
      "08": 1,
      "09": 1,
      "10": 1,
      "11": 1,
      "12": 1,
      "13": 1,
      "14": 1,
      "15": 1,
      "16": 1,
      "17": 1,
    },
  },
  {
    id: 5,
    nama: "Budi Santoso",
    jam: {
      "08": 1,
      "09": 0,
      "10": 1,
      "11": 1,
      "12": 0,
      "13": 1,
      "14": 1,
      "15": 0,
      "16": 1,
      "17": 1,
    },
  },
  {
    id: 6,
    nama: "Siti Rahayu",
    jam: {
      "08": 0,
      "09": 1,
      "10": 1,
      "11": 0,
      "12": 1,
      "13": 1,
      "14": 0,
      "15": 1,
      "16": 1,
      "17": 0,
    },
  },
  {
    id: 7,
    nama: "Deni Kurniawan",
    jam: {
      "08": 1,
      "09": 1,
      "10": 0,
      "11": 1,
      "12": 1,
      "13": 0,
      "14": 1,
      "15": 1,
      "16": 0,
      "17": 1,
    },
  },
  {
    id: 8,
    nama: "Rina Wulandari",
    jam: {
      "08": 0,
      "09": 0,
      "10": 1,
      "11": 1,
      "12": 1,
      "13": 1,
      "14": 0,
      "15": 0,
      "16": 1,
      "17": 1,
    },
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function RekapAktivitasHarianPage() {
  const [tanggal, setTanggal] = useState("2026-04-02");
  const [appliedTanggal, setAppliedTanggal] = useState("2026-04-02");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const handleTerapkan = () => {
    setAppliedTanggal(tanggal);
    setCurrentPage(1);
  };

  const filtered = DUMMY_DATA.filter((d) =>
    d.nama.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const getTotal = (jam: Record<string, number>) =>
    JAM_COLS.reduce((sum, j) => sum + (jam[j] ?? 0), 0);

  // Format tanggal untuk display: dd/MM/yyyy
  const formatDisplay = (val: string) => {
    if (!val) return "";
    const [y, m, d] = val.split("-");
    return `${d} / ${m} / ${y}`;
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Aktivitas", href: "/aktivitas" },
        { label: "Rekap Aktivitas Harian" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-zinc-100 space-y-3">
          {/* Baris 1: title */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <BarChart2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">
              Rekap Aktivitas Harian
            </span>
          </div>

          {/* Baris 2: filter + search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-zinc-500 whitespace-nowrap">
                Pilih Tanggal
              </span>
              <div className="relative">
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
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
          <table className="w-full min-w-[900px] table-fixed">
            <thead>
              {/* Row 1 — group "Jam" */}
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No ↕
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  AE
                </th>
                <th
                  colSpan={JAM_COLS.length}
                  className="py-2 text-[10px] font-semibold text-zinc-400 text-center"
                >
                  Jam
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  Total
                </th>
              </tr>
              {/* Row 2 — jam per kolom */}
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th colSpan={2} />
                {JAM_COLS.map((j) => (
                  <th
                    key={j}
                    className="py-1.5 text-[10px] font-semibold text-zinc-400 text-center"
                  >
                    {j}
                  </th>
                ))}
                <th />
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={JAM_COLS.length + 3}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => {
                  const total = getTotal(row.jam);
                  return (
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
                      {JAM_COLS.map((j) => (
                        <td
                          key={j}
                          className="py-3 text-xs text-zinc-600 text-center"
                        >
                          {row.jam[j] ?? 0}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-xs text-zinc-600 text-center font-semibold">
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
