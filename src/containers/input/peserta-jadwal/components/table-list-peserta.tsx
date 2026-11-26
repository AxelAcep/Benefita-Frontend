"use client";

import React from "react";
import Link from "next/link";
import { Users, Plus } from "lucide-react";
import { TablePagination } from "@/components/base/table-pagination";
import type { PesertaTrainingListItem } from "@/lib/types/input-peserta";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface PesertaAksiHandlers {
  onEdit?: (peserta: PesertaTrainingListItem) => void;
  onKonfirmasi?: (peserta: PesertaTrainingListItem) => void;
  onCetakKwitansi?: (peserta: PesertaTrainingListItem) => void;
  onCetakInvoice?: (peserta: PesertaTrainingListItem) => void;
  onPesertaFinal?: (peserta: PesertaTrainingListItem) => void;
  onDaftarkanUji?: (peserta: PesertaTrainingListItem) => void;
}

interface TableListPesertaProps {
  data: PesertaTrainingListItem[];
  totalData: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearchChange: (val: string) => void;
  searchValue: string;
  isLoading?: boolean;
  onTambah?: () => void;
  aksiHandlers?: PesertaAksiHandlers;
  // Tombol "Daftarkan ke Uji" cuma muncul kalau jadwal ini jenisnya "UJI"
  jenisTraining?: string;
}

const PAGE_SIZE = 10;
const COMPANY_ROUTES: Record<string, string> = {
  PERUSAHAAN: "perusahaan",
  PEMDA: "pemda",
  SEKOLAH: "sekolah",
  RUMAH_SAKIT: "rumah-sakit",
  INSTANSI_DAERAH: "instansi-daerah",
};

// ─────────────────────────────────────────────
// CELL HELPERS
// ─────────────────────────────────────────────

function Dash({ children }: { children: React.ReactNode }) {
  if (!children && children !== 0)
    return <span className="text-zinc-300 select-none">–</span>;
  return <>{children}</>;
}

function formatRupiah(val: number | null | undefined) {
  if (val === null || val === undefined)
    return <span className="text-zinc-300">–</span>;
  return <span>Rp{val.toLocaleString("id-ID")}</span>;
}

function StatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="text-zinc-300">–</span>;
  const isCancelled = status.trim().toUpperCase() === "CANCEL";
  const color =
    status === "FIX"
      ? "bg-emerald-50 text-emerald-600"
      : isCancelled
        ? "bg-red-50 text-red-600"
        : "bg-zinc-100 text-zinc-500";
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${color}`}
    >
      {isCancelled ? "BTL" : status}
    </span>
  );
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function TableListPeserta({
  data,
  totalData,
  currentPage,
  totalPages,
  onPageChange,
  onSearchChange,
  searchValue,
  isLoading,
  onTambah,
  aksiHandlers = {},
  jenisTraining,
}: TableListPesertaProps) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="px-5 py-3 border-b border-zinc-100 flex items-center gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
            <Users className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <span className="font-bold text-zinc-800 text-sm">List Peserta</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
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
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-48 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
            />
          </div>

          <button
            type="button"
            onClick={onTambah}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Peserta
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        role="region"
        aria-label="Tabel peserta, gulir untuk melihat seluruh data"
        tabIndex={0}
        className="max-h-[65vh] overflow-auto focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-emerald-600"
      >
        <table className="w-full">
          <thead className="sticky top-0 z-10 bg-zinc-50">
            <tr className="border-b border-zinc-100 bg-zinc-50/60">
              {[
                "No",
                "Nama",
                "Perusahaan",
                "No. WA",
                "AE",
                "Own\nEnv",
                "Status",
                "Status\nUji",
                "Konf",
                "Biaya",
                "Diskon",
                "Total",
                "Bayar",
                "Cashback",
                "Sisa",
                "Info Bayar",
                "Input By",
                "Upd By",
                "Catatan",
                "Aksi",
              ].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left whitespace-pre"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={20}
                  className="px-4 py-12 text-center text-xs text-zinc-400"
                >
                  Memuat data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={20}
                  className="px-4 py-12 text-center text-xs text-zinc-400"
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
                  <td className="px-3 py-3 text-xs text-zinc-400 align-top">
                    {(currentPage - 1) * PAGE_SIZE + i + 1}
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-700 font-medium align-top">
                    <div className="w-28 whitespace-normal wrap-anywhere leading-relaxed">{row.nama}</div>
                  </td>
                  <td className="px-3 py-3 text-xs align-top">
                    {row.perusahaan?.noInduk ? (
                      <Link
                        href={`/database/${COMPANY_ROUTES[row.perusahaan.jenisInstansi ?? "PERUSAHAAN"] ?? "perusahaan"}/${encodeURIComponent(row.perusahaan.noInduk)}`}
                        className="font-semibold text-emerald-600 hover:underline focus-visible:outline-2 focus-visible:outline-emerald-600"
                      >
                        {row.perusahaan.company || row.perusahaan.noInduk}
                      </Link>
                    ) : <Dash>{row.perusahaan?.company}</Dash>}
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-600 align-top">
                    <Dash>{row.noHp}</Dash>
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-600 align-top">
                    <Dash>{row.accExecutive}</Dash>
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-600 align-top">
                    <Dash>{row.ownEnv}</Dash>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <div className="flex flex-col items-start gap-1">
                      <StatusBadge status={row.status} />
                      {row.statusFinal && (
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-600">
                          FINAL
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-600 align-top">
                    <span title={row.ujian ?? undefined} className="whitespace-nowrap">
                      <Dash>{row.ujian
                        ?.replace(/\bRefresh\b/gi, "Ref")
                        .replace(/\bUjian\b/gi, "Uji")
                        .replace(/\bPelatihan\b/gi, "Pel")
                        .trim()}</Dash>
                    </span>
                  </td>
                  <td className="px-3 py-3 align-top">
                    {row.pegawaiKonfirmasi ? (
                      <div className="flex flex-col">
                        <span className="text-xs text-zinc-600">
                          KONFIRMASI OLEH {row.pegawaiKonfirmasi.nama}
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          {row.konTgl
                            ? new Date(row.konTgl).toISOString().split("T")[0]
                            : "-"}
                        </span>
                      </div>
                    ) : (
                      <span className="text-zinc-300 select-none">–</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                    {formatRupiah(row.hargaTotal)}
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                    {formatRupiah(row.diskon)}
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-600 font-medium align-top whitespace-nowrap">
                    {formatRupiah(row.hargaTotal)}
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                    {formatRupiah(row.bayar)}
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                    {formatRupiah(row.cashback)}
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                    {formatRupiah(row.sisa)}
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-500 align-top whitespace-pre-line">
                    <Dash>{row.infoPembayaran}</Dash>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-600">
                        {row.pegawaiInput?.nama ?? "-"}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {row.tglInput
                          ? new Date(row.tglInput).toISOString().split("T")[0]
                          : "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-600">
                        {row.pegawaiUpdate?.nama ?? "-"}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {row.tglUpdate
                          ? new Date(row.tglUpdate).toISOString().split("T")[0]
                          : "-"}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-600 align-top">
                    <div className="w-32 whitespace-pre-wrap wrap-anywhere leading-relaxed">
                      <Dash>{row.catatan}</Dash>
                    </div>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => aksiHandlers.onEdit?.(row)}
                        className="text-[11px] text-emerald-600 font-semibold hover:underline text-left"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => aksiHandlers.onKonfirmasi?.(row)}
                        className="text-[11px] text-emerald-600 font-semibold hover:underline text-left"
                      >
                        Konfirmasi
                      </button>
                      <button
                        onClick={() => aksiHandlers.onCetakKwitansi?.(row)}
                        className="text-[11px] text-emerald-600 font-semibold hover:underline text-left"
                      >
                        Kwitansi
                      </button>
                      <button
                        onClick={() => aksiHandlers.onCetakInvoice?.(row)}
                        className="text-[11px] text-emerald-600 font-semibold hover:underline text-left"
                      >
                        Invoice
                      </button>
                      <button
                        onClick={() => aksiHandlers.onPesertaFinal?.(row)}
                        className={`text-[11px] font-semibold hover:underline text-left ${
                          row.statusFinal
                            ? "text-zinc-500"
                            : "text-emerald-600"
                        }`}
                      >
                        {row.statusFinal
                          ? "Batalkan Final"
                          : "Tandai Peserta Final"}
                      </button>
                      {jenisTraining === "UJI" && row.statusFinal && (
                        <button
                          onClick={() => aksiHandlers.onDaftarkanUji?.(row)}
                          className="text-[11px] text-blue-600 font-semibold hover:underline text-left"
                        >
                          Daftarkan ke Uji
                        </button>
                      )}
                    </div>
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
        total={totalData}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
