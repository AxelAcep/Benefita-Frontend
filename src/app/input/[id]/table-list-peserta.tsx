"use client";

import React, { useState } from "react";
import { Users, Plus } from "lucide-react";
import { PesertaTrainingListItem } from "@/lib/services/input.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface PesertaAksiHandlers {
  onEdit?: (peserta: PesertaTrainingListItem) => void;
  onKonfirmasi?: (peserta: PesertaTrainingListItem) => void;
  onCetakKwitansi?: (peserta: PesertaTrainingListItem) => void;
  onCetakInvoice?: (peserta: PesertaTrainingListItem) => void;
  onPesertaFinal?: (peserta: PesertaTrainingListItem) => void;
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
}

const PAGE_SIZE = 10;

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
  const color =
    status === "FIX"
      ? "bg-emerald-50 text-emerald-600"
      : status === "Cancel"
        ? "bg-red-50 text-red-500"
        : "bg-zinc-100 text-zinc-500";
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${color}`}
    >
      {status}
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
      <div className="overflow-x-auto">
        <table className="w-full min-w-[2000px]">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/60">
              {[
                "No",
                "Nama",
                "Perusahaan",
                "AE",
                "Own Env",
                "Status",
                "Status Uji",
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
                  className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left whitespace-nowrap"
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
                  colSpan={19}
                  className="px-4 py-12 text-center text-xs text-zinc-400"
                >
                  Memuat data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={19}
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
                  <td className="px-3 py-3 text-xs text-zinc-700 font-medium align-top whitespace-nowrap">
                    {row.nama}
                  </td>
                  <td className="px-3 py-3 text-xs align-top">
                    <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">
                      {row.perusahaan?.company ?? "-"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-600 align-top">
                    <Dash>{row.accExecutive}</Dash>
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-600 align-top">
                    <Dash>{row.ownEnv}</Dash>
                  </td>
                  <td className="px-3 py-3 align-top">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-600 align-top">
                    <Dash>{row.ujian ? "Ya" : null}</Dash>
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
                    <Dash>{row.catatan}</Dash>
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
                        Cetak Kwitansi
                      </button>
                      <button
                        onClick={() => aksiHandlers.onCetakInvoice?.(row)}
                        className="text-[11px] text-emerald-600 font-semibold hover:underline text-left"
                      >
                        Cetak Invoice
                      </button>
                      <button
                        onClick={() => aksiHandlers.onPesertaFinal?.(row)}
                        className="text-[11px] text-emerald-600 font-semibold hover:underline text-left"
                      >
                        Peserta Final
                      </button>
                    </div>
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
            {totalData === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, totalData)}
          </span>{" "}
          dari <span className="font-semibold text-zinc-600">{totalData}</span>{" "}
          data
        </p>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
          >
            ‹ Sebelumnya
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
                  p === currentPage
                    ? "bg-emerald-500 text-white"
                    : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                }`}
              >
                {p}
              </button>
            ),
          )}

          {totalPages > 5 && (
            <>
              <span className="text-[11px] text-zinc-400 px-1">...</span>
              <button
                onClick={() => onPageChange(totalPages)}
                className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
                  currentPage === totalPages
                    ? "bg-emerald-500 text-white"
                    : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                }`}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Selanjutnya ›
          </button>
        </div>
      </div>
    </div>
  );
}
