"use client";

import React, { useState } from "react";
import AppLayout from "@/components/app-layout";

interface PesertaUjiPelatihan {
  id: number;
  inPer: string;
  nama: string;
  perusahaan: string;
  noTelp: string;
  email: string;
  acc: string;
  tglPelatihan: string;
  tglUji: string | null;
  stt: "Pel & Ujian" | "Refresh & Ujian";
}

const KODE_OPTIONS = [
  "CSR-01",
  "CSR-02",
  "CSR-03",
  "CSR-04",
  "CSR-05",
  "CSR-06",
  "CSR-07",
  "CSR-08",
  "CSR-09",
  "CSR-10",
];

const DUMMY_DATA: PesertaUjiPelatihan[] = [
  {
    id: 1,
    inPer: "PR12448",
    nama: "Abdul Fadhil",
    perusahaan: "PT. ABC",
    noTelp: "087784884980",
    email: "riza_fachmi.munggaran@daimlertruck.",
    acc: "SL",
    tglPelatihan: "2026-04-13",
    tglUji: "2025-10-30",
    stt: "Pel & Ujian",
  },
  {
    id: 2,
    inPer: "PR02631",
    nama: "Diana Fungki",
    perusahaan: "PT. BCA",
    noTelp: "087784884980",
    email: "ahmadzuaib88@gmail.com",
    acc: "SL",
    tglPelatihan: "2026-04-13",
    tglUji: null,
    stt: "Refresh & Ujian",
  },
  {
    id: 3,
    inPer: "PR01537",
    nama: "Mawardi",
    perusahaan: "PT. XYZ",
    noTelp: "082214047427",
    email: "agus.kurniawan@plnindonesiapower.co",
    acc: "SL",
    tglPelatihan: "2026-04-13",
    tglUji: null,
    stt: "Refresh & Ujian",
  },
  {
    id: 4,
    inPer: "PR01537",
    nama: "Ismadi",
    perusahaan: "PT. ACC",
    noTelp: "08170065552",
    email: "rainholdbutarbutar@ymail.com",
    acc: "NW",
    tglPelatihan: "2026-04-13",
    tglUji: null,
    stt: "Refresh & Ujian",
  },
  ...Array.from({ length: 24 }, (_, i) => ({
    id: i + 5,
    inPer: `PR0${String(i + 5).padStart(4, "0")}`,
    nama: `Peserta ${i + 5}`,
    perusahaan: "PT. Example",
    noTelp: "08100000000",
    email: `peserta${i + 5}@example.com`,
    acc: "SL",
    tglPelatihan: "2026-04-13",
    tglUji: null,
    stt: "Refresh & Ujian" as const,
  })),
];

const PAGE_SIZE = 4;

function getPageNumbers(currentPage: number, totalPages: number) {
  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3, "...ellipsis", totalPages);
  }
  return pages;
}

export default function DataPesertaUjiPelatihanPage() {
  const [search, setSearch] = useState("");
  const [kodePelatihan, setKodePelatihan] = useState("");
  const [appliedKode, setAppliedKode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = DUMMY_DATA.filter((d) => {
    const matchSearch =
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.inPer.toLowerCase().includes(search.toLowerCase()) ||
      d.perusahaan.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Peserta", href: "/peserta" },
        { label: "Data Peserta Uji + Pelatihan (LSP)" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-medium">
              Kode Pelatihan
            </span>
            <select
              value={kodePelatihan}
              onChange={(e) => setKodePelatihan(e.target.value)}
              className="text-xs border border-zinc-200 rounded-lg px-2.5 py-1.5 text-zinc-700 outline-none focus:border-emerald-300 w-36"
            >
              <option value="">Pilih Kode</option>
              {KODE_OPTIONS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setAppliedKode(kodePelatihan);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 text-xs bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
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
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-52 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
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
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  IN_PER
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  Nama
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Perusahaan/Instansi
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  No. Telp
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Email
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  Acc
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  Tgl. Pelatihan
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  Tgl. Uji
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  Stt
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={10}
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
                    <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline">
                      {row.inPer}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700">
                      {row.nama}
                    </td>
                    <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline">
                      {row.perusahaan}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.noTelp}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 max-w-[180px] truncate">
                      {row.email}
                    </td>
                    <td className="px-4 py-3 text-xs text-center text-zinc-600 font-medium">
                      {row.acc}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.tglPelatihan}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {row.tglUji ? (
                        <span className="text-emerald-600 cursor-pointer hover:underline">
                          {row.tglUji}
                        </span>
                      ) : (
                        <span className="text-zinc-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.stt}
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
            {getPageNumbers(currentPage, totalPages).map((p) =>
              typeof p === "string" ? (
                <span
                  key={p}
                  className="w-7 h-7 flex items-center justify-center text-[11px] text-zinc-400"
                >
                  ...
                </span>
              ) : (
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
              ),
            )}
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
