"use client";

import React from "react";
import Link from "next/link";
import { ClipboardList, ArrowRight } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { usePesertaUji } from "@/hooks/use-peserta-uji";
import {
  CHECKLIST_FIELDS,
  type ChecklistField,
  type PesertaUji,
} from "@/lib/services/peserta-uji.service";

// ─────────────────────────────────────────────
// CHECKLIST COLUMN CONFIG — label pendek buat header, lengkap buat tooltip
// ─────────────────────────────────────────────

const CHECKLIST_LABELS: Record<ChecklistField, { short: string; full: string }> = {
  suratKetKerja: { short: "Surat Kerja", full: "Surat Keterangan Kerja" },
  suratRekom: { short: "Surat Rekom", full: "Surat Rekomendasi" },
  sertPel: { short: "Sert Pel", full: "Sertifikat Pelatihan" },
  cv: { short: "CV", full: "Curriculum Vitae" },
  ktp: { short: "KTP", full: "Kartu Tanda Penduduk" },
  ijazah: { short: "Ijazah", full: "Ijazah" },
  pasFoto: { short: "Pas Foto", full: "Pas Foto" },
  verTUK: { short: "Ver TUK", full: "Verifikasi TUK" },
  ksediaTUK: { short: "Ksedia TUK", full: "Kesediaan TUK" },
  apl01: { short: "APL01", full: "Formulir APL-01" },
  apl02: { short: "APL02", full: "Formulir APL-02" },
};

function Dash({ children }: { children: React.ReactNode }) {
  if (!children) return <span className="text-zinc-300">-</span>;
  return <>{children}</>;
}

function formatTanggal(iso: string | null) {
  if (!iso) return <span className="text-zinc-300">-</span>;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "SIAP_UJI"
      ? "bg-emerald-50 text-emerald-600"
      : status === "SUDAH_UJI"
        ? "bg-blue-50 text-blue-600"
        : "bg-zinc-100 text-zinc-500";
  const label =
    status === "SIAP_UJI"
      ? "Siap Uji"
      : status === "SUDAH_UJI"
        ? "Sudah Uji"
        : "Calon";
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${cls}`}
    >
      {label}
    </span>
  );
}

export default function PesertaUjiPage() {
  const {
    data,
    pagination,
    loading,
    page,
    search,
    tanggal,
    setPage,
    handleSearch,
    handleTanggal,
    toggleChecklist,
  } = usePesertaUji();

  async function handleToggle(row: PesertaUji, field: ChecklistField) {
    try {
      await toggleChecklist(row.id, field, !row[field]);
    } catch {
      // biarin optimistic revert-nya hooks yang urus, gak perlu notif ribet di sini
    }
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Peserta Uji" },
      ]}
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <ClipboardList className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">
              Peserta Uji (Calon &amp; Siap Uji)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-zinc-500 font-medium">
              Tgl Uji
            </span>
            <input
              type="date"
              value={tanggal}
              onChange={(e) => handleTanggal(e.target.value)}
              className="px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all"
            />
            {tanggal && (
              <button
                onClick={() => handleTanggal("")}
                className="text-[11px] text-zinc-400 hover:text-zinc-600 underline"
              >
                Reset
              </button>
            )}
          </div>

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
              placeholder="Cari nama atau instansi..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full sm:w-56 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs" style={{ minWidth: "2100px" }}>
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  Nama
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  Instansi
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  WA
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  Email
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  Skema
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  TUK
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  Tgl Uji
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-20">
                  Status
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-20">
                  Detail
                </th>
                {CHECKLIST_FIELDS.map((f) => (
                  <th
                    key={f}
                    title={CHECKLIST_LABELS[f].full}
                    className="px-2 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16"
                  >
                    {CHECKLIST_LABELS[f].short}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={10 + CHECKLIST_FIELDS.length}
                    className="px-4 py-12 text-center text-zinc-400"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={10 + CHECKLIST_FIELDS.length}
                    className="px-4 py-12 text-center text-zinc-400"
                  >
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-3 py-3 text-zinc-400 align-top">
                      {(page - 1) * pagination.limit + i + 1}
                    </td>
                    <td className="px-3 py-3 text-zinc-700 font-medium align-top whitespace-nowrap">
                      {row.nama}
                    </td>
                    <td className="px-3 py-3 text-zinc-600 align-top max-w-[160px] truncate">
                      <Dash>{row.instansi}</Dash>
                    </td>
                    <td className="px-3 py-3 text-zinc-600 align-top whitespace-nowrap">
                      <Dash>{row.wa}</Dash>
                    </td>
                    <td className="px-3 py-3 text-zinc-600 align-top max-w-[160px] truncate">
                      <Dash>{row.email}</Dash>
                    </td>
                    <td className="px-3 py-3 text-zinc-600 align-top whitespace-nowrap">
                      {row.skema.kode}
                    </td>
                    <td className="px-3 py-3 text-zinc-600 align-top">
                      <Dash>{row.tuk?.nama}</Dash>
                    </td>
                    <td className="px-3 py-3 text-zinc-600 align-top whitespace-nowrap">
                      {formatTanggal(row.tglUji)}
                    </td>
                    <td className="px-3 py-3 text-center align-top">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-3 py-3 text-center align-top">
                      <Link
                        href={`/training/peserta-uji/${row.id}`}
                        className="inline-flex items-center gap-0.5 text-emerald-600 hover:text-emerald-700 font-semibold whitespace-nowrap"
                      >
                        Detail <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                    {CHECKLIST_FIELDS.map((f) => (
                      <td key={f} className="px-2 py-3 text-center align-top">
                        <input
                          type="checkbox"
                          checked={row[f]}
                          onChange={() => handleToggle(row, f)}
                          className="w-3.5 h-3.5 rounded border-zinc-300 text-emerald-500 focus:ring-emerald-200 cursor-pointer"
                        />
                      </td>
                    ))}
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
                : (page - 1) * pagination.limit + 1}
              –{Math.min(page * pagination.limit, pagination.total)}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-zinc-600">
              {pagination.total}
            </span>{" "}
            data
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
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
              onClick={() => setPage(Math.min(pagination.totalPages, page + 1))}
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
