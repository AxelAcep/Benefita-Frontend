"use client";

import React, { useEffect, useState } from "react";
import { Building2, ArrowUp, ArrowDown } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Anchor from "@/components/base/anchor";
import { usePerusahaanProper } from "@/hooks/use-perusahaan-proper";
import {
  getLiniBisnis,
  type LiniBisnisItem,
  type PeringkatProper,
} from "@/lib/services/perusahaan.service";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PERINGKAT_OPTIONS: { value: PeringkatProper; label: string }[] = [
  { value: "EMAS", label: "Emas" },
  { value: "HIJAU", label: "Hijau" },
  { value: "BIRU", label: "Biru" },
  { value: "MERAH", label: "Merah" },
  { value: "HITAM", label: "Hitam" },
  { value: "DITUNDA", label: "Ditunda" },
  { value: "MASALAH", label: "Masalah" },
  { value: "TUTUP", label: "Tutup" },
  { value: "DITANGGUHKAN", label: "Ditangguhkan" },
  { value: "MERAH_MUDA", label: "Merah Muda" },
];

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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DaftarPerusahaanProperPage() {
  const {
    data,
    pagination,
    loading,
    search,
    page,
    sort,
    peringkat,
    liniBisnisId,
    setPage,
    setPeringkat,
    setLiniBisnisId,
    handleSearch,
    toggleSort,
    handleTerapkan,
  } = usePerusahaanProper();

  const [liniBisnisOptions, setLiniBisnisOptions] = useState<LiniBisnisItem[]>(
    [],
  );

  useEffect(() => {
    getLiniBisnis()
      .then((res) => setLiniBisnisOptions(res.data))
      .catch(() => setLiniBisnisOptions([]));
  }, []);

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Daftar Perusahaan PROPER" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 mr-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">
                Daftar Perusahaan PROPER
              </span>
            </div>

            {/* Filter Peringkat */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Peringkat
              </span>
              <select
                value={peringkat}
                onChange={(e) =>
                  setPeringkat(e.target.value as PeringkatProper | "")
                }
                className="pl-2.5 pr-6 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white cursor-pointer"
              >
                <option value="">Semua Peringkat</option>
                {PERINGKAT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
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

            {/* Tombol Terapkan */}
            <button
              onClick={handleTerapkan}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold rounded-sm transition-colors"
            >
              Terapkan
            </button>

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
                placeholder="Cari kategori CPN atau nama perusahaan..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full sm:w-64 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
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
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-28">
                  Acc
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-80">
                  Alamat
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20">
                  No. Telepon
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Email
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
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  Cust
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Tidak ada data tersedia.
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
                    <td className="px-3 py-3 text-center text-xs text-zinc-600 align-top max-w-[160px] truncate">
                      <Dash>{row.acc}</Dash>
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top leading-relaxed max-w-[320px]">
                      <Dash>{row.alamat}</Dash>
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top leading-relaxed max-w-[90px] break-words">
                      <Dash>{row.telp}</Dash>
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top">
                      <Dash>{row.email}</Dash>
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
