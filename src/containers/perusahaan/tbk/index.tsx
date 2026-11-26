"use client";

import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Anchor from "@/components/base/anchor";
import TablePagination from "@/components/base/table-pagination";
import TableLoading from "@/components/base/table-loading";
import { usePerusahaanTbkManage } from "./manage";

function formatTanggal(iso: string | null) {
  if (!iso) return <span className="text-zinc-300">-</span>;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Dash({ children }: { children: React.ReactNode }) {
  if (!children) return <span className="text-zinc-300">-</span>;
  return <>{children}</>;
}

export default function PerusahaanTbkContainer() {
  const {
    data,
    pagination,
    loading,
    error,
    search,
    page,
    sort,
    setPage,
    handleSearch,
    toggleSort,
  } = usePerusahaanTbkManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Perusahaan" },
        { label: "Daftar Perusahaan TBK" },
      ]}
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="font-bold text-zinc-800 text-sm">
            Daftar Perusahaan TBK
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
              placeholder="Cari kategori CPN atau nama perusahaan..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full sm:w-64 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  No Induk
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-44">
                  Perusahaan/Instansi
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-32">
                  Acc
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-44">
                  <button
                    type="button"
                    onClick={toggleSort}
                    className="inline-flex items-center gap-1 hover:text-zinc-600 transition-colors"
                  >
                    Tgl. Terakhir Training
                    {sort === "asc" ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Alamat
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  No. Telepon
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  Update Terakhir
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  Lini Bisnis
                </th>
              </tr>
            </thead>
            <tbody aria-busy={loading}>
              {loading ? (
                <TableLoading columns={9} />
              ) : error || data.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    {error ?? "Tidak ada data tersedia."}
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr
                    key={row.noInduk}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-400 align-top">
                      {(page - 1) * pagination.pageSize + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs align-top whitespace-nowrap">
                      <Anchor
                        name={row.noInduk}
                        route={`/database/perusahaan/${row.noInduk}`}
                      />
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700 align-top max-w-[180px] truncate">
                      <Dash>{row.namaPerusahaan}</Dash>
                    </td>
                    <td className="px-3 py-3 text-center text-xs text-zinc-600 align-top max-w-[160px] truncate">
                      <Dash>{row.acc}</Dash>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                      {formatTanggal(row.tglTerakhirTraining)}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 align-top max-w-[240px]">
                      <Dash>{row.alamat}</Dash>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 align-top">
                      <Dash>{row.telp}</Dash>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                      {formatTanggal(row.updateTerakhir)}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 align-top">
                      <Dash>{row.liniBisnis}</Dash>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!error && !loading && (
          <TablePagination
            page={page}
            limit={pagination.pageSize}
            total={pagination.total}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </AppLayout>
  );
}
