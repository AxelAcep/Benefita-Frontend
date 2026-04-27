"use client";

import React, { useState } from "react";
import { Award } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PemegangSertifikat {
  id: number;
  nama: string;
  perusahaan: string;
  akun: string;
  email: string;
  noTelp: string;
  kodePel: string;
  tglUjian: string;
  masaBerlaku: string;
  lsp: string;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: PemegangSertifikat[] = [
  {
    id: 1,
    nama: "Ali M. Siregar",
    perusahaan: "PT. ABC",
    akun: "EE-L",
    email: "seml-env-eng@supreme-energy.com",
    noTelp: "081276778671",
    kodePel: "WM-08",
    tglUjian: "01 Februari 2026",
    masaBerlaku: "01 Februari 2029",
    lsp: "LSP Daimaru",
  },
  {
    id: 2,
    nama: "Didin Sukma Rachmat Zaenudin",
    perusahaan: "PT. BCA",
    akun: "EE-L",
    email: "wahyu.aditama@merdekacoppergold.com",
    noTelp: "081341415146",
    kodePel: "WM-08",
    tglUjian: "01 Februari 2026",
    masaBerlaku: "01 Februari 2029",
    lsp: "LSP Daimaru",
  },
  {
    id: 3,
    nama: "Dani Hamdani",
    perusahaan: "PT. XYZ",
    akun: "SL-L",
    email: "annisanugroho81@gmail.com",
    noTelp: "081388980900",
    kodePel: "WM-08",
    tglUjian: "01 Maret 2026",
    masaBerlaku: "01 Maret 2029",
    lsp: "LSP Daimaru",
  },
  {
    id: 4,
    nama: "Andri Faizal, SH",
    perusahaan: "PT. ACC",
    akun: "RQ-L",
    email: "-",
    noTelp: "081293156787",
    kodePel: "WM-08",
    tglUjian: "04 Maret 2026",
    masaBerlaku: "04 Maret 2029",
    lsp: "LSP Daimaru",
  },
];

const LSP_OPTIONS = ["Semua", "LSP Daimaru", "LSP Nusantara", "LSP Mandiri"];
const KODE_PEL_OPTIONS = ["Semua", "WM-08", "EP-03", "EP-04"];
const TAHUN_OPTIONS = ["2024", "2025", "2026"];
const TOTAL_DATA = 28;
const TOTAL_PAGES = 7;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PemegangSertifikatBNSPPage() {
  const [search, setSearch] = useState("");
  const [selectedLSP, setSelectedLSP] = useState("Semua");
  const [selectedKodePel, setSelectedKodePel] = useState("Semua");
  const [selectedTahun, setSelectedTahun] = useState("2026");
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 10;

  const handleTerapkan = () => {
    setCurrentPage(1);
  };

  const filtered = DUMMY_DATA.filter((d) => {
    const matchSearch =
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.perusahaan.toLowerCase().includes(search.toLowerCase());
    const matchLSP = selectedLSP === "Semua" || d.lsp === selectedLSP;
    const matchKode =
      selectedKodePel === "Semua" || d.kodePel === selectedKodePel;
    return matchSearch && matchLSP && matchKode;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const selectClass =
    "pl-2.5 pr-6 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white appearance-none cursor-pointer";
  const selectStyle = {
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 6px center",
  };

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Pemegang Sertifikat BNSP" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100">
          <div className="flex items-center gap-2 mr-1 mb-3">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Award className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">
              Pemegang Sertifikat BNSP
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Title */}

            {/* Filter LSP */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">LSP</span>
              <select
                value={selectedLSP}
                onChange={(e) => setSelectedLSP(e.target.value)}
                className={selectClass}
                style={selectStyle}
              >
                {LSP_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Kode Pel */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Kode Pel
              </span>
              <select
                value={selectedKodePel}
                onChange={(e) => setSelectedKodePel(e.target.value)}
                className={selectClass}
                style={selectStyle}
              >
                {KODE_PEL_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Tahun */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Tahun
              </span>
              <select
                value={selectedTahun}
                onChange={(e) => setSelectedTahun(e.target.value)}
                className={selectClass}
                style={selectStyle}
              >
                {TAHUN_OPTIONS.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </div>

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
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No ↕
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  Nama
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Perusahaan/Instansi
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20">
                  Akun
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-44">
                  Email
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  No. Telp
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  Kode Pel
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  Tgl. Ujian
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  Masa Berlaku
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  LSP
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
                    <td className="px-4 py-3 text-xs text-zinc-400 align-top">
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700 font-medium align-top">
                      {row.nama}
                    </td>
                    <td className="px-3 py-3 text-xs align-top">
                      <span className="text-emerald-600 font-semibold cursor-pointer hover:underline">
                        {row.perusahaan}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top">
                      {row.akun}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top leading-relaxed break-all">
                      {row.email}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                      {row.noTelp}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top font-medium">
                      {row.kodePel}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                      {row.tglUjian}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                      {row.masaBerlaku}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top">
                      {row.lsp}
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
            <span className="font-semibold text-zinc-600">{TOTAL_DATA}</span>{" "}
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
              onClick={() =>
                setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))
              }
              disabled={currentPage === TOTAL_PAGES}
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
