"use client";

import React, { useState } from "react";
import { CalendarDays } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PesertaBulanan {
  id: number;
  ae: string;
  noJadwal: string;
  kode: string;
  tglTraining: string;
  nama: string;
  perusahaan: string;
  noTelp: string;
  lineOfBusiness: string;
  catatan: string | null;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: PesertaBulanan[] = [
  {
    id: 1,
    ae: "NW",
    noJadwal: "2026199",
    kode: "ENG-01",
    tglTraining: "06 April 2026",
    nama: "Agus Kurniawan",
    perusahaan: "PT. ABC",
    noTelp: "081276778671",
    lineOfBusiness:
      "2-Listrik :PEM – Energi PLTU; Pembangkit-PLTU (3 × 350 WM) (direncanakan selesai 100201)",
    catatan: null,
  },
  {
    id: 2,
    ae: "NW",
    noJadwal: "2026199",
    kode: "ENG-01",
    tglTraining: "06 April 2026",
    nama: "Firza Muldani",
    perusahaan: "PT. BCA",
    noTelp: "081341415146",
    lineOfBusiness:
      "2-Listrik :PEM – Energi PLTU; Pembangkit-PLTU (3 × 350 WM) (direncanakan selesai 100201)",
    catatan: "PROSES; uji offline 9 april",
  },
  {
    id: 3,
    ae: "NW",
    noJadwal: "2026199",
    kode: "ENG-01",
    tglTraining: "06 April 2026",
    nama: "Gihon Andre Asmitra Harahap",
    perusahaan: "PT. XYZ",
    noTelp: "081388980900",
    lineOfBusiness: "3-Migas:Petrokimia –",
    catatan: "PROSES",
  },
  {
    id: 4,
    ae: "SL",
    noJadwal: "2026199",
    kode: "ENG-01",
    tglTraining: "06 April 2026",
    nama: "Murra Candra Wicaksana",
    perusahaan: "PT. ACC",
    noTelp: "081293156787",
    lineOfBusiness: "3-Migas:Petrokimia –",
    catatan: "PROSES",
  },
];

const JENIS_OPTIONS = ["REG", "NON-REG", "CORP"];
const TOTAL_DATA = 28;
const TOTAL_PAGES = 7;
const PAGE_SIZE = 10;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DaftarPesertaBulananPage() {
  const [search, setSearch] = useState("");
  const [selectedTanggal, setSelectedTanggal] = useState("April 2026");
  const [selectedJenis, setSelectedJenis] = useState("REG");
  const [appliedTanggal, setAppliedTanggal] = useState("April 2026");
  const [appliedJenis, setAppliedJenis] = useState("REG");
  const [currentPage, setCurrentPage] = useState(1);

  const handleTerapkan = () => {
    setAppliedTanggal(selectedTanggal);
    setAppliedJenis(selectedJenis);
    setCurrentPage(1);
  };

  const filtered = DUMMY_DATA.filter(
    (d) =>
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.perusahaan.toLowerCase().includes(search.toLowerCase()),
  );

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

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
        { label: "Daftar Peserta FIX (Bulanan)" },
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
            <div className="flex items-center gap-2 mr-1">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CalendarDays className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">
                Daftar Peserta FIX (Bulanan)
              </span>
            </div>

            {/* Filter Pilih Tanggal */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Pilih Tanggal
              </span>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={selectedTanggal}
                  onChange={(e) => setSelectedTanggal(e.target.value)}
                  className="pl-2.5 pr-7 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all w-28"
                />
                <svg
                  className="absolute right-2 text-zinc-400 pointer-events-none"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
            </div>

            {/* Filter Jenis */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Jenis
              </span>
              <select
                value={selectedJenis}
                onChange={(e) => setSelectedJenis(e.target.value)}
                className="pl-2.5 pr-6 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white appearance-none cursor-pointer"
                style={selectStyle}
              >
                {JENIS_OPTIONS.map((o) => (
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
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-14">
                  AE
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  No. Jadwal
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20">
                  Kode
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  Tgl. Training
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  Nama
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  Perusahaan/Instansi
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  No. Telp
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Line of Business
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Catatan
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
                    <td className="px-3 py-3 text-xs text-zinc-600 font-medium align-top">
                      {row.ae}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top">
                      {row.noJadwal}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top font-medium">
                      {row.kode}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                      {row.tglTraining}
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
                      {row.noTelp}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top leading-relaxed">
                      {row.lineOfBusiness}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 align-top">
                      {row.catatan ?? (
                        <span className="text-zinc-300 select-none">–</span>
                      )}
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
