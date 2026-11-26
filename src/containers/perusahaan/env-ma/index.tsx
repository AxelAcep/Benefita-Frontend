"use client";

import React from "react";
import { TableProperties } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Anchor from "@/components/base/anchor";
import TableLoading from "@/components/base/table-loading";
import TablePagination from "@/components/base/table-pagination";
import { usePerusahaanEnvMaManage } from "./manage";

export default function PerusahaanEnvMaContainer() {
  const {
    search,
    changeSearch,
    currentPage,
    setCurrentPage,
    paginated,
    totalPages,
    PAGE_SIZE,
    total, loading, error,
    liniBisnisId, changeLiniBisnis, liniBisnisOptions, optionsError,
  } = usePerusahaanEnvMaManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Perusahaan" },
        { label: "Daftar Perusahaan ENV : MA" },
      ]}



    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Title */}
            <div className="flex items-center gap-2 mr-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <TableProperties className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">
                Daftar Perusahaan Bebas (MA, dll)
              </span>
            </div>

            <label className="flex items-center gap-2 text-xs text-zinc-600">
              Line Bisnis
              <select value={liniBisnisId} onChange={(e) => changeLiniBisnis(e.target.value)}
                className="max-w-64 rounded-lg border border-zinc-200 px-2 py-1.5">
                <option value="">Semua lini bisnis</option>
                {liniBisnisOptions.map((item) => <option key={item.id} value={item.id}>{item.nama}</option>)}
              </select>
            </label>
            {optionsError && <span role="alert" className="text-xs text-red-600">{optionsError}</span>}

            {/* Search — pushed to the right */}
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
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No ↕
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  AE
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  No Induk
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Perusahaan/Instansi
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-52">
                  Alamat
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  No. Telepon
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Email
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Line of Biz
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  PROPER
                </th>
              </tr>
            </thead>

            <tbody aria-busy={loading}>
              {loading ? (
                <TableLoading columns={9} />
              ) : error || paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    <span role={error ? "alert" : "status"} className={error ? "text-red-600" : undefined}>
                      {error || "Tidak ada data tersedia."}
                    </span>
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => (
                  <tr
                    key={row.noInduk}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors align-top"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                      {row.ae}
                    </td>
                    <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap">
                      <Anchor name={row.noInduk} route={`/database/${row.jenisInstansi === "RUMAH_SAKIT" ? "rumah-sakit" : "perusahaan"}/${encodeURIComponent(row.noInduk)}`} />
                    </td>
                    <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap">
                      <Anchor name={row.perusahaan} route={`/database/${row.jenisInstansi === "RUMAH_SAKIT" ? "rumah-sakit" : "perusahaan"}/${encodeURIComponent(row.noInduk)}`} />
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 leading-relaxed">
                      {row.alamat || "–"}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 whitespace-nowrap">
                      {row.noTelepon || "–"}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600">
                      {row.email || "–"}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600">
                      {row.lineOfBiz || "–"}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600">
                      {!row.proper || row.proper === "-" ? (
                        <span className="text-zinc-300 select-none">–</span>
                      ) : (
                        row.proper
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && !error && <TablePagination
          page={currentPage}
          limit={PAGE_SIZE}
          total={total}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />}
      </div>
    </AppLayout>
  );
}
