"use client";

import React from "react";
import { BadgeCheck } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Anchor from "@/components/base/anchor";

import TablePagination from "@/components/base/table-pagination";
import { usePerusahaanBnspManage } from "./manage";

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

export default function PerusahaanBnspContainer() {
  const { search, changeSearch, page, setPage, limit, offset, total, totalPages, rows, loading, error } =
    usePerusahaanBnspManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Perusahaan" },
        { label: "Daftar Perusahaan Bersertifikat BNSP" },
      ]}
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
              onChange={(e) => changeSearch(e.target.value)}
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
              {loading || error || rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={16}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    <span role={error ? "alert" : "status"} className={error ? "text-red-600" : undefined}>
                      {loading ? "Memuat data..." : error || "Tidak ada data tersedia."}
                    </span>
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr
                    key={row.noInduk}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {offset + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap max-w-[140px] truncate overflow-hidden">
                      <Anchor name={row.perusahaan} route={`/database/perusahaan/${encodeURIComponent(row.noInduk)}`} />
                    </td>
                    {/* Acc ENV */}
                    <td
                      style={ACC_ENV_STYLE}
                      className="px-3 py-3 text-center text-xs font-semibold w-20"
                    >
                      {row.accEnv || "–"}
                    </td>
                    {/* Acc EPM */}
                    <td
                      style={ACC_EPM_STYLE}
                      className="px-3 py-3 text-center text-xs font-semibold w-20"
                    >
                      {row.accEpm || "–"}
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

        <TablePagination
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>
    </AppLayout>
  );
}
