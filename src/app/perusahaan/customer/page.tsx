"use client";

import React, { useEffect, useState } from "react";
import { LayoutGrid } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Anchor from "@/components/base/anchor";
import { usePerusahaanCustomer } from "@/hooks/use-perusahaan-customer";
import {
  getPelatihanTahunOptions,
  type PelatihanRange,
} from "@/lib/services/perusahaan.service";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRentang(range: PelatihanRange): { tgl: string; thn: number | null } {
  if (!range.tglMulai) return { tgl: "-", thn: null };
  const start = new Date(range.tglMulai);
  const end = range.tglSelesai ? new Date(range.tglSelesai) : start;
  const monthYear = end.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
  const sameDay =
    start.getDate() === end.getDate() &&
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();
  const tgl = sameDay
    ? `${start.getDate()} ${monthYear}`
    : `${start.getDate()} - ${end.getDate()} ${monthYear}`;
  return { tgl, thn: end.getFullYear() };
}

function Dash({ children }: { children: React.ReactNode }) {
  if (!children) return <span className="text-zinc-300">-</span>;
  return <>{children}</>;
}

function AksesBadge({
  val,
  bg,
  text,
}: {
  val: string | null;
  bg: string;
  text: string;
}) {
  if (!val) {
    return (
      <td className="px-3 py-4 text-center text-zinc-300 select-none">–</td>
    );
  }
  return (
    <td className={`px-3 py-4 text-center ${bg}`}>
      <span className={`text-[11px] font-bold tracking-wide ${text}`}>
        {val}
      </span>
    </td>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DaftarPerusahaanCustomerPage() {
  const {
    data,
    pagination,
    loading,
    search,
    page,
    tahun,
    appliedTahun,
    setPage,
    setTahun,
    handleSearch,
    handleTerapkan,
  } = usePerusahaanCustomer();

  const [tahunOptions, setTahunOptions] = useState<number[]>([]);

  useEffect(() => {
    getPelatihanTahunOptions()
      .then(setTahunOptions)
      .catch(() => setTahunOptions([]));
  }, []);

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Daftar Perusahaan Customer" },
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
              <LayoutGrid className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">
              Daftar Perusahaan Customer
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
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full sm:w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
            />
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-5 py-3 border-b border-zinc-100 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-zinc-500 font-medium mr-1">
            Peserta Terakhir
          </span>
          <select
            value={tahun}
            onChange={(e) =>
              setTahun(e.target.value ? Number(e.target.value) : "")
            }
            className="text-xs border border-zinc-200 rounded-lg px-2.5 py-1.5 text-zinc-700 outline-none focus:border-emerald-300 transition-all bg-white"
          >
            <option value="">Semua Tahun</option>
            {tahunOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <button
            onClick={handleTerapkan}
            className="px-3 py-1.5 text-[11px] bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors"
          >
            Terapkan
          </button>
          <span className="text-[11px] text-emerald-600 font-medium ml-1">
            Menampilkan data dari &quot;
            {appliedTahun ? `Peserta Terakhir ${appliedTahun}` : "Semua Peserta"}
            &quot;
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th
                  className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10"
                  rowSpan={2}
                >
                  No
                </th>
                <th
                  className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24"
                  rowSpan={2}
                >
                  No Induk
                </th>
                <th
                  className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-44"
                  rowSpan={2}
                >
                  Perusahaan/Instansi
                </th>
                <th
                  className="px-3 py-2 text-[10px] font-bold text-center w-14 bg-blue-100 text-blue-800"
                  rowSpan={2}
                >
                  ENV
                </th>
                <th
                  className="px-3 py-2 text-[10px] font-bold text-center w-14 bg-green-100 text-green-800"
                  rowSpan={2}
                >
                  CSR
                </th>
                <th
                  className="px-3 py-2 text-[10px] font-bold text-center w-14 bg-purple-100 text-purple-800"
                  rowSpan={2}
                >
                  TSM
                </th>
                <th
                  className="px-3 py-2 text-[10px] font-bold text-center w-14 bg-yellow-100 text-yellow-800"
                  rowSpan={2}
                >
                  EPM
                </th>
                <th
                  className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-56"
                  rowSpan={2}
                >
                  PROPER
                </th>
                <th
                  colSpan={2}
                  className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center border-b border-zinc-100"
                >
                  Pel. Pertama
                </th>
                <th
                  colSpan={2}
                  className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center border-b border-zinc-100"
                >
                  Pel. Terakhir
                </th>
              </tr>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-36">
                  Tgl
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  Thn
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-36">
                  Tgl
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  Thn
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={12}
                    className="px-4 py-16 text-center text-xs text-zinc-400"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
                    className="px-4 py-16 text-center text-xs text-zinc-400"
                  >
                    Belum Ada Data
                  </td>
                </tr>
              ) : (
                data.map((row, i) => {
                  const pertama = formatRentang(row.pelatihanPertama);
                  const terakhir = formatRentang(row.pelatihanTerakhir);
                  return (
                    <tr
                      key={row.noInduk}
                      className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                    >
                      <td className="px-4 py-4 text-xs text-zinc-400">
                        {(page - 1) * pagination.pageSize + i + 1}
                      </td>
                      <td className="px-4 py-4 text-xs whitespace-nowrap">
                        <Anchor
                          name={row.noInduk}
                          route={`/database/perusahaan/${row.noInduk}`}
                        />
                      </td>
                      <td className="px-4 py-4 text-xs text-zinc-700 whitespace-nowrap max-w-[160px] truncate overflow-hidden">
                        <Dash>{row.namaPerusahaan}</Dash>
                      </td>
                      <AksesBadge
                        val={row.env}
                        bg="bg-blue-100"
                        text="text-blue-700"
                      />
                      <AksesBadge
                        val={row.csr}
                        bg="bg-green-100"
                        text="text-green-700"
                      />
                      <AksesBadge
                        val={row.tsm}
                        bg="bg-purple-100"
                        text="text-purple-700"
                      />
                      <AksesBadge
                        val={row.epm}
                        bg="bg-yellow-100"
                        text="text-yellow-700"
                      />
                      <td className="px-3 py-4 text-xs text-zinc-600 leading-relaxed max-w-[220px] break-words">
                        <Dash>{row.proper}</Dash>
                      </td>
                      <td className="px-3 py-4 text-xs text-zinc-600 whitespace-nowrap">
                        {pertama.tgl}
                      </td>
                      <td className="px-3 py-4 text-xs text-zinc-600 text-center">
                        <Dash>{pertama.thn}</Dash>
                      </td>
                      <td className="px-3 py-4 text-xs text-zinc-600 whitespace-nowrap">
                        {terakhir.tgl}
                      </td>
                      <td className="px-3 py-4 text-xs text-zinc-600 text-center">
                        <Dash>{terakhir.thn}</Dash>
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
              {pagination.total === 0
                ? 0
                : (page - 1) * pagination.pageSize + 1}
              –{Math.min(page * pagination.pageSize, pagination.total)}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-zinc-600">
              {pagination.total}
            </span>{" "}
            data
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              ‹ Sebelumnya
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
                    p === page
                      ? "bg-emerald-500 text-white"
                      : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
            <button
              onClick={() =>
                setPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={page === pagination.totalPages}
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
