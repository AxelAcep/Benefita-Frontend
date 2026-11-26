"use client";

import React from "react";
import { TableProperties } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Anchor from "@/components/base/anchor";
import TablePagination from "@/components/base/table-pagination";
import { usePerusahaanByAlamatManage } from "./manage";

function Dash({ children }: { children: React.ReactNode }) {
  if (!children) return <span className="text-zinc-300">–</span>;
  return <>{children}</>;
}

export default function PerusahaanByAlamatContainer() {
  const { data, pagination, loading, error, search, page, setPage, handleSearch } =
    usePerusahaanByAlamatManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Vendor", href: "/vendor" },
        { label: "Daftar Per. berdasarkan Alamat" },
      ]}
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 mr-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <TableProperties className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">
                Daftar Per. berdasarkan Alamat
              </span>
            </div>

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
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full sm:w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  No Induk
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  Perusahaan/Instansi
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-64">
                  Alamat
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-64">
                  Alamat FAC
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20">
                  ACC
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : error || data.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    {error ?? "Tidak ada data tersedia."}
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr
                    key={row.noInduk}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors align-top"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {(page - 1) * pagination.pageSize + i + 1}
                    </td>

                    <td className="px-4 py-3 text-xs whitespace-nowrap">
                      <Anchor
                        name={row.noInduk}
                        route={`/database/perusahaan/${row.noInduk}`}
                      />
                    </td>

                    <td className="px-4 py-3 text-xs text-zinc-700 whitespace-nowrap max-w-[180px] truncate">
                      <Dash>{row.namaPerusahaan}</Dash>
                    </td>

                    <td className="px-4 py-3 text-xs text-zinc-600 leading-relaxed max-w-[280px]">
                      <Dash>{row.alamat}</Dash>
                    </td>

                    <td className="px-4 py-3 text-xs text-zinc-600 leading-relaxed max-w-[280px]">
                      <Dash>{row.alamatFactory?.trim()}</Dash>
                    </td>

                    <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                      <Dash>{row.acc}</Dash>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!error && (
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
