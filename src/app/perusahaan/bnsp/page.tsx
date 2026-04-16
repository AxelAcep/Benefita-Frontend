"use client";

import React, { useState } from "react";
import { BadgeCheck } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PerusahaanBNSP {
  id: number;
  noInduk: string;
  perusahaan: string;
  accEnv: string;
  accEpm: string;
  pppu: number | null;
  poippu: number | null;
  pppa: number | null;
  popal: number | null;
  lb3: number | null;
  tps: number | null;
  tiga_r: number | null;
  pSampah: number | null;
  aEng: number | null;
  mEng: number | null;
  pcua: number | null;
  lca: number | null;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: PerusahaanBNSP[] = [
  {
    id: 1,
    noInduk: "PR00002",
    perusahaan: "PT. ABC",
    accEnv: "SL",
    accEpm: "SL",
    pppu: 1,
    poippu: 4,
    pppa: 2,
    popal: 1,
    lb3: null,
    tps: null,
    tiga_r: null,
    pSampah: null,
    aEng: null,
    mEng: 1,
    pcua: null,
    lca: 1,
  },
  {
    id: 2,
    noInduk: "PR00003",
    perusahaan: "PT. BCA",
    accEnv: "EE",
    accEpm: "SL",
    pppu: null,
    poippu: null,
    pppa: 3,
    popal: null,
    lb3: null,
    tps: null,
    tiga_r: null,
    pSampah: null,
    aEng: null,
    mEng: 1,
    pcua: null,
    lca: 1,
  },
  {
    id: 3,
    noInduk: "PR00004",
    perusahaan: "PT. XYZ",
    accEnv: "NW",
    accEpm: "EE",
    pppu: 1,
    poippu: null,
    pppa: 2,
    popal: null,
    lb3: null,
    tps: null,
    tiga_r: null,
    pSampah: 5,
    aEng: null,
    mEng: 1,
    pcua: null,
    lca: null,
  },
  {
    id: 4,
    noInduk: "PR00005",
    perusahaan: "PT. ACC",
    accEnv: "SL",
    accEpm: "SL",
    pppu: 2,
    poippu: 5,
    pppa: 2,
    popal: null,
    lb3: null,
    tps: null,
    tiga_r: 1,
    pSampah: null,
    aEng: null,
    mEng: null,
    pcua: null,
    lca: null,
  },
  {
    id: 5,
    noInduk: "PR00006",
    perusahaan: "PT. Maju Jaya",
    accEnv: "MG",
    accEpm: "CF",
    pppu: null,
    poippu: 2,
    pppa: null,
    popal: 3,
    lb3: 1,
    tps: null,
    tiga_r: null,
    pSampah: null,
    aEng: 2,
    mEng: null,
    pcua: 1,
    lca: null,
  },
  {
    id: 6,
    noInduk: "PR00007",
    perusahaan: "PT. Nusantara Energy",
    accEnv: "EE",
    accEpm: "NW",
    pppu: 3,
    poippu: null,
    pppa: 1,
    popal: null,
    lb3: null,
    tps: 2,
    tiga_r: null,
    pSampah: 1,
    aEng: null,
    mEng: 2,
    pcua: null,
    lca: 3,
  },
  {
    id: 7,
    noInduk: "PR00008",
    perusahaan: "PT. Sinar Mas",
    accEnv: "SL",
    accEpm: "TA",
    pppu: null,
    poippu: 1,
    pppa: 4,
    popal: null,
    lb3: 2,
    tps: null,
    tiga_r: null,
    pSampah: null,
    aEng: 1,
    mEng: null,
    pcua: 2,
    lca: null,
  },
  {
    id: 8,
    noInduk: "PR00009",
    perusahaan: "PT. Tambang Raya",
    accEnv: "TA",
    accEpm: "SL",
    pppu: 2,
    poippu: null,
    pppa: null,
    popal: 1,
    lb3: null,
    tps: 3,
    tiga_r: 2,
    pSampah: null,
    aEng: null,
    mEng: 1,
    pcua: null,
    lca: 2,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ACC_ENV_STYLE: React.CSSProperties = {
  backgroundColor: "#dbeafe",
  color: "#1d4ed8",
};
const ACC_EPM_STYLE: React.CSSProperties = {
  backgroundColor: "#fef9c3",
  color: "#854d0e",
};

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

export default function DaftarPerusahaanBNSPPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = DUMMY_DATA.filter(
    (d) =>
      d.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
      d.noInduk.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Daftar Perusahaan Bersertifikat BNSP" },
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
              <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">
              Daftar Perusahaan (Pelanggan) Bersertifikat BNSP
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

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No ↕
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Perusahaan/Instansi
                </th>
                {/* Acc ENV langsung */}
                <th
                  style={{ backgroundColor: "#bfdbfe", color: "#1d4ed8" }}
                  className="px-3 py-2 text-[10px] font-bold text-center w-20"
                >
                  Acc ENV ↕
                </th>
                {/* Acc EPM langsung */}
                <th
                  style={{ backgroundColor: "#fde68a", color: "#854d0e" }}
                  className="px-3 py-2 text-[10px] font-bold text-center w-20"
                >
                  Acc EPM ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-14">
                  PPPU ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-14">
                  POIPPU ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-14">
                  PPPA ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-14">
                  POPAL ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-14">
                  LB3 ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-14">
                  TPS ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-14">
                  3R ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  P.SAMPAH ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-14">
                  A.ENG ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-14">
                  M.ENG ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-14">
                  PCUA ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-14">
                  LCA ↕
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
                    <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap max-w-[140px] truncate overflow-hidden">
                      {row.perusahaan}
                    </td>
                    {/* Acc ENV */}
                    <td
                      style={ACC_ENV_STYLE}
                      className="px-3 py-3 text-center text-xs font-semibold w-20"
                    >
                      {row.accEnv}
                    </td>
                    {/* Acc EPM */}
                    <td
                      style={ACC_EPM_STYLE}
                      className="px-3 py-3 text-center text-xs font-semibold w-20"
                    >
                      {row.accEpm}
                    </td>
                    <Cell val={row.pppu} />
                    <Cell val={row.poippu} />
                    <Cell val={row.pppa} />
                    <Cell val={row.popal} />
                    <Cell val={row.lb3} />
                    <Cell val={row.tps} />
                    <Cell val={row.tiga_r} />
                    <Cell val={row.pSampah} />
                    <Cell val={row.aEng} />
                    <Cell val={row.mEng} />
                    <Cell val={row.pcua} />
                    <Cell val={row.lca} />
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
