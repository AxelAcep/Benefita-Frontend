"use client";

import React from "react";
import { LayoutList } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Anchor from "@/components/base/anchor";
import { usePerusahaanPrioritas } from "@/hooks/use-perusahaan-prioritas";
import { PRIORITAS_LETTER_OPTIONS } from "@/lib/services/perusahaan.service";

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
  if (!val) return <span className="text-zinc-300 select-none">–</span>;
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
};

const selectClass =
  "pl-2.5 pr-6 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white appearance-none cursor-pointer";
const chevronStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
  backgroundRepeat: "no-repeat" as const,
  backgroundPosition: "right 6px center",
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DaftarPerusahaanPrioritasPage() {
  const {
    data,
    pagination,
    loading,
    search,
    page,
    prioritasMa,
    prioritasAe,
    hasApplied,
    setPrioritasMa,
    setPrioritasAe,
    handleSearch,
    handleTerapkan,
    handlePageChange,
  } = usePerusahaanPrioritas();

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Daftar Perusahaan Prioritas" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Title */}
            <div className="flex items-center gap-2 mr-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <LayoutList className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">
                Daftar Perusahaan Prioritas
              </span>
            </div>

            {/* Filter Prioritas MA */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Prioritas MA
              </span>
              <select
                value={prioritasMa}
                onChange={(e) => setPrioritasMa(e.target.value)}
                className={selectClass}
                style={chevronStyle}
              >
                <option value="">Semua</option>
                {PRIORITAS_LETTER_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Prioritas AE */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Prioritas AE
              </span>
              <select
                value={prioritasAe}
                onChange={(e) => setPrioritasAe(e.target.value)}
                className={selectClass}
                style={chevronStyle}
              >
                <option value="">Semua</option>
                {PRIORITAS_LETTER_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Kategori & Akun — dikomen dulu, belum ketemu field DB
                sumbernya. Lihat catatan di perusahaan.controller.js. */}
            {/*
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">Kategori</span>
              <select className={selectClass} style={chevronStyle}>
                <option value="">Semua</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">Akun</span>
              <select className={selectClass} style={chevronStyle}>
                <option value="">Semua</option>
              </select>
            </div>
            */}

            {/* Terapkan */}
            <button
              onClick={handleTerapkan}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold rounded-lg transition-colors"
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
                placeholder="Cari nama perusahaan atau no induk..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full sm:w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
              />
            </div>
          </div>

          {hasApplied && (
            <p className="mt-2 text-[11px] text-zinc-500">
              Menampilkan data dari{" "}
              <span className="font-semibold text-zinc-700">
                &quot;{[prioritasMa, prioritasAe].filter(Boolean).join(", ")}
                &quot;
              </span>
            </p>
          )}
        </div>

        {/* Body */}
        {!hasApplied ? (
          <div className="flex flex-col items-center justify-center py-24 gap-2">
            <p className="text-sm font-bold text-zinc-700">
              Silahkan Pilih Prioritas MA / Prioritas AE
            </p>
            <p className="text-xs text-zinc-400">
              Pilih input yang ingin ditampilkan, lalu klik Terapkan
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1300px]">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60">
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                    No
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                    Prio MA
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    Prio AE
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    No Induk
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                    Perusahaan/Instansi
                  </th>
                  <th className="px-3 py-2 text-[10px] font-bold text-center w-16 bg-blue-100 text-blue-700">
                    ENV
                  </th>
                  <th className="px-3 py-2 text-[10px] font-bold text-center w-16 bg-emerald-100 text-emerald-800">
                    CSR
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-80">
                    Alamat
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-56">
                    No. Telepon & Email
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    Upd. By
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                    Tanggal
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
                      className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors align-top"
                    >
                      <td className="px-3 py-3 text-xs text-zinc-400">
                        {(page - 1) * pagination.pageSize + i + 1}
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600">
                        <Dash>{row.prioritasMa}</Dash>
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600">
                        <Dash>{row.prioritasAe}</Dash>
                      </td>
                      <td className="px-3 py-3 text-xs whitespace-nowrap">
                        <Anchor
                          name={row.noInduk}
                          route={`/database/perusahaan/${row.noInduk}`}
                        />
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-700 max-w-[160px] truncate">
                        <Dash>{row.namaPerusahaan}</Dash>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <AksesBadge val={row.env} color={AKSES_COLOR.env} />
                      </td>
                      <td className="px-3 py-3 text-center">
                        <AksesBadge val={row.csr} color={AKSES_COLOR.csr} />
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600 leading-relaxed max-w-[320px]">
                        <Dash>{row.alamat}</Dash>
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600 leading-relaxed max-w-[220px] break-words">
                        {row.telp || row.email ? (
                          <>
                            <Dash>{row.telp}</Dash>
                            {row.telp && row.email && (
                              <span className="text-zinc-300"> | </span>
                            )}
                            <Dash>{row.email}</Dash>
                          </>
                        ) : (
                          <span className="text-zinc-300">-</span>
                        )}
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600 whitespace-nowrap">
                        <Dash>{row.updatter}</Dash>
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600 whitespace-nowrap">
                        {formatTanggal(row.updateTerakhir)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-zinc-100">
          <p className="text-[11px] text-zinc-400">
            Menampilkan{" "}
            <span className="font-semibold text-zinc-600">
              {!hasApplied || pagination.total === 0
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
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={!hasApplied || page === 1}
              className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              ‹ Sebelumnya
            </button>
            {Array.from(
              { length: hasApplied ? pagination.totalPages : 0 },
              (_, i) => i + 1,
            ).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
                  p === page
                    ? "bg-emerald-500 text-white"
                    : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() =>
                handlePageChange(Math.min(pagination.totalPages, page + 1))
              }
              disabled={!hasApplied || page === pagination.totalPages}
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
