"use client";

import React from "react";
import { TableProperties } from "lucide-react";
import AppLayout from "@/components/app-layout";
import TablePagination from "@/components/base/table-pagination";
import { usePerusahaanJabatanTeknisManage } from "./manage";

export default function PerusahaanJabatanTeknisContainer() {
  const {
    search,
    changeSearch,
    currentPage,
    setCurrentPage,
    paginated,
    totalPages,
    PAGE_SIZE,
    total,
  } = usePerusahaanJabatanTeknisManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Vendor", href: "/vendor" },
        { label: "Daftar Jabatan Teknis" },
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
                Daftar Jabatan Teknis
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
                onChange={(e) => changeSearch(e.target.value)}
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
                  No ↕
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  No Induk
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  Perusahaan/Instansi
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  Nama
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  Jabatan
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  No. Telepon
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  Email
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors align-top"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </td>

                    <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap">
                      {row.noInduk}
                    </td>

                    <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap">
                      {row.perusahaan}
                    </td>

                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.nama}
                    </td>

                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.jabatan}
                    </td>

                    <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                      {row.noTelepon === "-" ? (
                        <span className="text-zinc-300">–</span>
                      ) : (
                        row.noTelepon
                      )}
                    </td>

                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.email === "-" ? (
                        <span className="text-zinc-300">–</span>
                      ) : (
                        row.email
                      )}
                    </td>
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
