"use client";

import React, { useState } from "react";
import { ClipboardList } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DaftarASAP {
  id: number;
  perusahaan: string;
  asap: string;
  akun: string;
  kategori: string;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: DaftarASAP[] = [
  {
    id: 1,
    perusahaan: "PT. ABC",
    asap: "Kontak lagi fahlul",
    akun: "Aldy",
    kategori: "ENV",
  },
  {
    id: 2,
    perusahaan: "PT. BCA",
    asap: "Kontak lagi operator",
    akun: "Aldy",
    kategori: "ENV",
  },
  {
    id: 3,
    perusahaan: "PT. XYZ",
    asap: "Kontak lagi Hesti",
    akun: "Aldy",
    kategori: "ENV",
  },
  {
    id: 4,
    perusahaan: "PT. ACC",
    asap: "Kontak lagi Adam",
    akun: "Gempi",
    kategori: "ENV",
  },
  {
    id: 5,
    perusahaan: "PT. Maju Jaya",
    asap: "Follow up proposal",
    akun: "Andi",
    kategori: "CSR",
  },
  {
    id: 6,
    perusahaan: "PT. Nusantara Energy",
    asap: "Kirim jadwal training",
    akun: "Ihsan",
    kategori: "TSM",
  },
  {
    id: 7,
    perusahaan: "PT. Sinar Mas",
    asap: "Konfirmasi kehadiran peserta",
    akun: "Gempi",
    kategori: "ENV",
  },
  {
    id: 8,
    perusahaan: "PT. Tambang Raya",
    asap: "Tindak lanjut kontrak",
    akun: "Aldy",
    kategori: "EPM",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DaftarASAPPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = DUMMY_DATA.filter(
    (d) =>
      d.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
      d.asap.toLowerCase().includes(search.toLowerCase()) ||
      d.akun.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Perusahaan", href: "/perusahaan" },
        { label: "ASAP / Daftar ASAP" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <ClipboardList className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">
              ASAP / Daftar ASAP
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
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full sm:w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No ↕
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Perusahaan/Instansi
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  ASAP
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Akun
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Kategori
                </th>
                <th className="px-5 py-2 text-[10px] font-semibold text-zinc-400 text-right w-28">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
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
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap">
                      {row.perusahaan}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.asap}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.akun}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.kategori}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 transition-colors whitespace-nowrap">
                        Lihat Detail →
                      </button>
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
            dari{" "}
            <span className="font-semibold text-zinc-600">
              {filtered.length}
            </span>{" "}
            data
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              ‹ Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
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
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
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
