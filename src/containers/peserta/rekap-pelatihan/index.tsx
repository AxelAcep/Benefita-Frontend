"use client";

import React from "react";
import AppLayout from "@/components/app-layout";
import TablePagination from "@/components/base/table-pagination";
import { usePesertaRekapPelatihanManage } from "./manage";

const YEARS = [2026, 2025, 2024];

function Val({ v }: { v: number | null }) {
  return (
    <td className="px-3 py-3 text-center text-xs text-zinc-500">
      {v === null ? "-" : v}
    </td>
  );
}

export default function PesertaRekapPelatihanContainer() {
  const {
    PAGE_SIZE,
    search,
    currentPage,
    setCurrentPage,
    paginated,
    total,
    totalPages,
    changeSearch,
  } = usePesertaRekapPelatihanManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Peserta" },
        { label: "Rekap Pelatihan Running (Tahunan)" },
      ]}
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between gap-3">
          <span className="font-bold text-zinc-800 text-sm flex items-center gap-2">
            🗓️ Rekap Pelatihan Running (Tahunan)
          </span>
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
              className="w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full" style={{ minWidth: "1400px" }}>
            <thead>
              {/* Year group row */}
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th
                  className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10"
                  rowSpan={2}
                >
                  No ↕
                </th>
                <th
                  className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20"
                  rowSpan={2}
                >
                  Kode
                </th>
                <th
                  className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-56"
                  rowSpan={2}
                >
                  Judul
                </th>
                {YEARS.map((year) => (
                  <th
                    key={year}
                    colSpan={5}
                    className="px-3 py-2 text-[10px] font-bold text-zinc-500 text-center border-l border-zinc-100"
                  >
                    {year}
                  </th>
                ))}
              </tr>

              {/* Sub-header row */}
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                {YEARS.map((year) => (
                  <React.Fragment key={year}>
                    <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center border-l border-zinc-100 w-16">
                      Rencana
                    </th>
                    <th
                      className="px-3 py-2 text-[10px] font-bold text-center w-16"
                      style={{ color: "#059669", backgroundColor: "#d1fae5" }}
                    >
                      Running
                    </th>
                    <th
                      className="px-3 py-2 text-[10px] font-bold text-center w-16"
                      style={{ color: "#dc2626", backgroundColor: "#fee2e2" }}
                    >
                      Cancel
                    </th>
                    <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                      Peserta
                    </th>
                    <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-24">
                      Rata-rata Peserta
                    </th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={3 + YEARS.length * 5}
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
                    <td className="px-4 py-3 text-xs text-zinc-700 leading-relaxed">
                      {row.judul}
                    </td>
                    {YEARS.map((year) => {
                      const d = row.data[year] ?? {
                        rencana: null,
                        running: null,
                        cancel: null,
                        peserta: null,
                        rataRataPeserta: null,
                      };
                      return (
                        <React.Fragment key={year}>
                          <Val v={d.rencana} />
                          <td
                            className="px-3 py-3 text-center text-xs font-semibold"
                            style={{
                              color: d.running !== null ? "#059669" : "#d1d5db",
                            }}
                          >
                            {d.running === null ? "-" : d.running}
                          </td>
                          <td
                            className="px-3 py-3 text-center text-xs font-semibold"
                            style={{
                              color: d.cancel !== null ? "#dc2626" : "#d1d5db",
                            }}
                          >
                            {d.cancel === null ? "-" : d.cancel}
                          </td>
                          <Val v={d.peserta} />
                          <Val v={d.rataRataPeserta} />
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          page={currentPage}
          limit={PAGE_SIZE}
          total={total}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </AppLayout>
  );
}
