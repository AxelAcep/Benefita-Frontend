"use client";

import React, { useState } from "react";
import { Users, Plus } from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface Peserta {
  id: number;
  nama: string;
  perusahaan: string;
  noTelp: string;
  ae: string;
  ovEnv: string;
  status: string;
  statusUji: string;
  form: string;
  konf: string;
  biaya: string;
  diskon: number;
  total: string;
  bayar: number;
  cashback: number;
  sisa: string;
  infoBayar: string;
  inputBy: string;
  updBy: string;
  catatan: string;
}

export interface PesertaAksiHandlers {
  onEdit?: (peserta: Peserta) => void;
  onKonfirmasi?: (peserta: Peserta) => void;
  onCetakKwitansi?: (peserta: Peserta) => void;
  onCetakInvoice?: (peserta: Peserta) => void;
  onPesertaFinal?: (peserta: Peserta) => void;
}

interface TableListPesertaProps {
  data: Peserta[];
  onTambah?: () => void;
  aksiHandlers?: PesertaAksiHandlers;
}

// ─────────────────────────────────────────────
// CELL HELPERS
// ─────────────────────────────────────────────

function Dash({ children }: { children: React.ReactNode }) {
  if (!children || children === "-" || children === "")
    return <span className="text-zinc-300 select-none">–</span>;
  return <>{children}</>;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

const TOTAL_DATA = 28;
const TOTAL_PAGES = 7;
const PAGE_SIZE = 10;

export default function TableListPeserta({
  data,
  onTambah,
  aksiHandlers = {},
}: TableListPesertaProps) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = data.filter(
    (d) =>
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.perusahaan.toLowerCase().includes(search.toLowerCase()),
  );

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

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
          {/* Search */}
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
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-48 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
            />
          </div>

          {/* Tambah Peserta */}
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
        <table className="w-full min-w-[1600px]">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/60">
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                No ↕
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                Nama
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                Perusahaan/Instansi
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                No. Telp
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-12">
                AE
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-14">
                Ov ENV
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                Status
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                Status Uji
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-14">
                Form
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-14">
                Konf
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-right w-28">
                Biaya
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-right w-16">
                Diskon
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-right w-28">
                Total
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-right w-14">
                Bayar
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-right w-16">
                Cash back
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-right w-28">
                Sisa
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                Info Bayar
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                Input By
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                Upd By
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                Catatan
              </th>
              <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-28">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={20}
                  className="px-4 py-12 text-center text-xs text-zinc-400"
                >
                  Tidak ada data tersedia.
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr
                  key={row.id}
                  className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                >
                  <td className="px-3 py-3 text-xs text-zinc-400 align-top">
                    {(currentPage - 1) * PAGE_SIZE + i + 1}
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-700 font-medium align-top">
                    {row.nama}
                  </td>
                  <td className="px-3 py-3 text-xs align-top">
                    <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">
                      {row.perusahaan}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                    <Dash>{row.noTelp}</Dash>
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-zinc-600 align-top">
                    {row.ae}
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-zinc-600 align-top">
                    {row.ovEnv}
                  </td>
                  <td className="px-3 py-3 text-center text-xs align-top">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        row.status === "FIX"
                          ? "bg-emerald-50 text-emerald-600"
                          : row.status === "Cancel"
                            ? "bg-red-50 text-red-500"
                            : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-zinc-600 align-top">
                    <Dash>{row.statusUji}</Dash>
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-zinc-600 align-top">
                    <Dash>{row.form}</Dash>
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-zinc-600 align-top">
                    <Dash>{row.konf}</Dash>
                  </td>
                  <td className="px-3 py-3 text-right text-xs text-zinc-600 align-top">
                    {row.biaya}
                  </td>
                  <td className="px-3 py-3 text-right text-xs text-zinc-600 align-top">
                    {row.diskon}
                  </td>
                  <td className="px-3 py-3 text-right text-xs text-zinc-600 font-medium align-top">
                    {row.total}
                  </td>
                  <td className="px-3 py-3 text-right text-xs text-zinc-600 align-top">
                    {row.bayar}
                  </td>
                  <td className="px-3 py-3 text-right text-xs text-zinc-600 align-top">
                    {row.cashback}
                  </td>
                  <td className="px-3 py-3 text-right text-xs text-zinc-600 align-top">
                    {row.sisa}
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-500 align-top whitespace-pre-line">
                    {row.infoBayar}
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-500 align-top whitespace-pre-line">
                    {row.inputBy}
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-500 align-top whitespace-pre-line">
                    {row.updBy}
                  </td>
                  <td className="px-3 py-3 text-xs text-zinc-600 align-top font-medium">
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
            {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)}
          </span>{" "}
          dari <span className="font-semibold text-zinc-600">{TOTAL_DATA}</span>{" "}
          data
        </p>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
          >
            ‹ Sebelumnya
          </button>

          {[1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
                p === currentPage
                  ? "bg-emerald-500 text-white"
                  : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
              }`}
            >
              {p}
            </button>
          ))}

          <span className="text-[11px] text-zinc-400 px-1">...</span>

          <button
            onClick={() => setCurrentPage(TOTAL_PAGES)}
            className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
              currentPage === TOTAL_PAGES
                ? "bg-emerald-500 text-white"
                : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
            }`}
          >
            {TOTAL_PAGES}
          </button>

          <button
            onClick={() => setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))}
            disabled={currentPage === TOTAL_PAGES}
            className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Selanjutnya ›
          </button>
        </div>
      </div>
    </div>
  );
}
