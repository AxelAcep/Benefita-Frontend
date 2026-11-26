"use client";

import React from "react";
import { LayoutGrid, ArrowUp, ArrowDown } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Anchor from "@/components/base/anchor";
import TablePagination from "@/components/base/table-pagination";
import { usePerusahaanIsoManage } from "./manage";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

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

function AksesBadge({
  val,
  color,
}: {
  val: string | null;
  color: { bg: string; text: string };
}) {
  if (!val) {
    return <span className="text-zinc-300 select-none">–</span>;
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold tracking-wide ${color.bg} ${color.text}`}
    >
      {val}
    </span>
  );
}

const AKSES_COLOR = {
  env: { bg: "bg-blue-100", text: "text-blue-700" },
  csr: { bg: "bg-emerald-100", text: "text-emerald-800" },
  tsm: { bg: "bg-purple-100", text: "text-purple-800" },
  epm: { bg: "bg-yellow-100", text: "text-yellow-800" },
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PerusahaanIsoContainer() {
  const {
    data,
    pagination,
    loading,
    error,
    liniBisnisOptions,
    optionsError,
    search,
    page,
    sort,
    liniBisnisId,
    setPage,
    setLiniBisnisId,
    handleSearch,
    toggleSort,
    handleTerapkan,
  } = usePerusahaanIsoManage();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Perusahaan" },
        { label: "Daftar Perusahaan ISO" },
      ]}
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 mr-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <LayoutGrid className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">
                Daftar Perusahaan ISO
              </span>
            </div>

            {/* Filter Line Bisnis */}
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Line Bisnis
              </span>
              <select
                value={liniBisnisId}
                onChange={(e) =>
                  setLiniBisnisId(
                    e.target.value ? Number(e.target.value) : "",
                  )
                }
                className="pl-2.5 pr-6 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white cursor-pointer"
              >
                <option value="">Semua Line Bisnis</option>
                {liniBisnisOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.nama}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleTerapkan}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold rounded-sm transition-colors"
            >
              Terapkan
            </button>

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
                placeholder="Cari kategori CPN atau nama perusahaan..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full sm:w-64 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
              />
            </div>
          </div>
        </div>

        {optionsError && (
          <p role="alert" className="px-5 py-2 text-xs text-red-600">
            {optionsError}
          </p>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1300px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  No Induk
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Perusahaan/Instansi
                </th>
                <th className="px-3 py-2 text-[10px] font-bold text-center w-14 bg-blue-100 text-blue-700">
                  ENV
                </th>
                <th className="px-3 py-2 text-[10px] font-bold text-center w-14 bg-emerald-100 text-emerald-800">
                  CSR
                </th>
                <th className="px-3 py-2 text-[10px] font-bold text-center w-14 bg-purple-100 text-purple-800">
                  TSM
                </th>
                <th className="px-3 py-2 text-[10px] font-bold text-center w-14 bg-yellow-100 text-yellow-800">
                  EPM
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-80">
                  Alamat
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20">
                  No. Telepon
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-64">
                  <button
                    type="button"
                    onClick={toggleSort}
                    className="inline-flex items-center gap-1 hover:text-zinc-600 transition-colors"
                  >
                    Tahun Peringkat
                    {sort === "asc" ? (
                      <ArrowUp className="w-3 h-3" />
                    ) : (
                      <ArrowDown className="w-3 h-3" />
                    )}
                  </button>
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  Update
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  Line of Biz
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-44">
                  Cust
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={13}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : error || data.length === 0 ? (
                <tr>
                  <td
                    colSpan={13}
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
                    <td className="px-4 py-3 text-xs text-zinc-700 align-top max-w-[140px] truncate">
                      <Dash>{row.namaPerusahaan}</Dash>
                    </td>
                    <td className="px-3 py-3 text-center align-top">
                      <AksesBadge val={row.env} color={AKSES_COLOR.env} />
                    </td>
                    <td className="px-3 py-3 text-center align-top">
                      <AksesBadge val={row.csr} color={AKSES_COLOR.csr} />
                    </td>
                    <td className="px-3 py-3 text-center align-top">
                      <AksesBadge val={row.tsm} color={AKSES_COLOR.tsm} />
                    </td>
                    <td className="px-3 py-3 text-center align-top">
                      <AksesBadge val={row.epm} color={AKSES_COLOR.epm} />
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top leading-relaxed max-w-[320px]">
                      <Dash>{row.alamat}</Dash>
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top leading-relaxed max-w-[90px] break-words">
                      <Dash>{row.telp}</Dash>
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top leading-relaxed max-w-[260px]">
                      <Dash>{row.tahunPeringkat}</Dash>
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                      {row.updatter ? (
                        <div className="flex flex-col">
                          <span>{formatTanggal(row.updateTerakhir)}</span>
                          <span className="text-[10px] text-zinc-400">
                            {row.updatter}
                          </span>
                        </div>
                      ) : (
                        formatTanggal(row.updateTerakhir)
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top">
                      <Dash>{row.liniBisnis}</Dash>
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top leading-relaxed max-w-[220px] break-words">
                      <Dash>{row.kategoriCpn}</Dash>
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
