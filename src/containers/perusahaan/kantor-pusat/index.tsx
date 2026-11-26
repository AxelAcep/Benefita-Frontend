"use client";

import React from "react";
import AppLayout from "@/components/app-layout";
import Anchor from "@/components/base/anchor";
import TablePagination from "@/components/base/table-pagination";
import { usePerusahaanKantorPusatManage } from "./manage";

function formatUpdate(date: string | null, name: string | null) {
  const stamp = date ? new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta", year: "2-digit", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date(date)) : [];
  const part = (type: string) => stamp.find((item) => item.type === type)?.value ?? "";
  const label = date ? `${part("year")}${part("month")}${part("day")}` : "";
  return [label, name].filter(Boolean).join("-") || "–";
}

export default function PerusahaanKantorPusatContainer() {
  const {
    search,
    changeSearch,
    currentPage,
    setCurrentPage,
    paginated,
    totalPages,
    PAGE_SIZE,
    filterType,
    setFilterType,
    handleTerapkan,
    total,
    loading,
    error,
  } = usePerusahaanKantorPusatManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Perusahaan" },
        { label: "Daftar Perusahaan Kantor Pusat dan Customer Benefita" },
      ]}



    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-zinc-800">
            Daftar Perusahaan Kantor Pusat dan Customer Benefita
          </div>
        </div>

        {/* Filter + Search */}
        <div className="px-5 py-3 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500">Menampilkan</span>
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as "semua" | "customer")
              }
              className="text-xs border border-zinc-200 rounded-lg px-2 py-1.5 text-zinc-700 outline-none focus:border-emerald-300"
            >
              <option value="semua">Semua</option>
              <option value="customer">Customer</option>
            </select>
            <button
              onClick={handleTerapkan}
              className="px-4 py-1.5 text-xs bg-emerald-500 text-white rounded-sm font-medium hover:bg-emerald-600 transition-colors ml-1"
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
              onChange={(e) => changeSearch(e.target.value)}
              className="w-full sm:w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
            />
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
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20">
                  No Induk
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Perusahaan/Instansi
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  Acc
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-44">
                  Tgl. Terakhir Training ↕
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Alamat
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  No. Telepon
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  Update
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Line of Biz ↕
                </th>
              </tr>
            </thead>
            <tbody>
              {loading || error || paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    <span role={error ? "alert" : "status"} className={error ? "text-red-600" : undefined}>
                      {loading ? "Memuat data..." : error || "Tidak ada data tersedia."}
                    </span>
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => (
                  <tr
                    key={row.noInduk}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline">
                      <Anchor name={row.noInduk} route={`/database/perusahaan/${encodeURIComponent(row.noInduk)}`} />
                    </td>
                    <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline max-w-[140px] truncate overflow-hidden whitespace-nowrap">
                      <Anchor name={row.perusahaan} route={`/database/perusahaan/${encodeURIComponent(row.noInduk)}`} />
                    </td>
                    <td className="px-3 py-3 text-center text-xs font-semibold text-zinc-600">
                      {row.acc || "–"}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.tglTerakhirTraining || "–"}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 max-w-[200px]">
                      {row.alamat || "–"}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.noTelepon || "–"}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {formatUpdate(row.updateTerakhir, row.updateOleh)}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.lineOfBiz || "–"}
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
