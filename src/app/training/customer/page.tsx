"use client";

import React, { useState } from "react";
import { BookOpen } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AkunLevel = "EE" | "SL" | "TA" | "CF" | "NW" | "SP" | "MG";

interface CustomerTraining {
  id: number;
  noInduk: string;
  perusahaan: string;
  totalPeserta: number;
  akun: {
    env: AkunLevel;
    csr: AkunLevel;
    tsm: AkunLevel;
    epm: AkunLevel;
  };
  lineOfBusiness: string;
  kebutuhanTraining: string[];
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: CustomerTraining[] = [
  {
    id: 1,
    noInduk: "PR00002",
    perusahaan: "PT. ABC",
    totalPeserta: 2,
    akun: { env: "EE", csr: "EE", tsm: "TA", epm: "NW" },
    lineOfBusiness: "5-Otomotif",
    kebutuhanTraining: [
      "CSR-01",
      "FI-11",
      "FI-12",
      "PR-08",
      "PR-09",
      "OP-03",
      "LG-05",
      "LG-06",
      "AD-10",
      "EP-19",
      "WM-05",
      "WM-09",
      "HR-01",
      "IT-07",
      "IT-08",
      "MK-01",
      "MK-02",
      "OP-04",
      "SA-15",
      "SA-16",
      "CS-01",
      "CS-02",
      "AD-11",
      "AD-12",
      "RD-01",
    ],
  },
  {
    id: 2,
    noInduk: "PR00003",
    perusahaan: "PT. BCA",
    totalPeserta: 18,
    akun: { env: "SL", csr: "SL", tsm: "CF", epm: "NW" },
    lineOfBusiness: "5-Otomotif :MPJ - Komponen Otomotif",
    kebutuhanTraining: ["CSR-01", "FI-11", "FI-12", "PR-08", "AD-12", "RD-01"],
  },
  {
    id: 3,
    noInduk: "PR00004",
    perusahaan: "PT. XYZ",
    totalPeserta: 19,
    akun: { env: "SL", csr: "NW", tsm: "EE", epm: "SL" },
    lineOfBusiness: "1-Mining :PEM - Tambang Mineral; E",
    kebutuhanTraining: [
      "CSR-01",
      "FI-11",
      "FI-12",
      "PR-08",
      "PR-09",
      "OP-03",
      "LG-05",
      "LG-06",
      "AD-10",
      "EP-19",
      "WM-05",
      "WM-09",
      "HR-01",
      "HR-02",
      "IT-05",
      "IT-06",
      "IT-07",
      "MK-01",
      "MK-02",
      "OP-04",
      "SA-15",
      "SA-16",
      "CS-01",
      "AD-11",
      "AD-12",
      "RD-01",
    ],
  },
  {
    id: 4,
    noInduk: "PR00005",
    perusahaan: "PT. ACC",
    totalPeserta: 30,
    akun: { env: "SL", csr: "EE", tsm: "EE", epm: "SL" },
    lineOfBusiness: "1-Mining :Smelter - Nikel - FeNi 3",
    kebutuhanTraining: ["CSR-01", "FI-11", "FI-12", "PR-08", "AD-12", "RD-01"],
  },
  {
    id: 5,
    noInduk: "PR00006",
    perusahaan: "PT. Maju Jaya",
    totalPeserta: 12,
    akun: { env: "MG", csr: "SP", tsm: "SL", epm: "EE" },
    lineOfBusiness: "3-Agribusiness :PKS - Kelapa Sawit",
    kebutuhanTraining: [
      "CSR-01",
      "HR-01",
      "HR-02",
      "WM-05",
      "AD-10",
      "MK-01",
      "MK-02",
    ],
  },
  {
    id: 6,
    noInduk: "PR00007",
    perusahaan: "PT. Nusantara Energy",
    totalPeserta: 45,
    akun: { env: "EE", csr: "SL", tsm: "NW", epm: "CF" },
    lineOfBusiness: "2-Energy :PLN - Pembangkit Listrik",
    kebutuhanTraining: [
      "CSR-01",
      "FI-11",
      "FI-12",
      "EP-19",
      "WM-05",
      "WM-09",
      "IT-07",
      "IT-08",
      "SA-15",
      "SA-16",
      "RD-01",
    ],
  },
];

const KODE_OPTIONS = [
  "Semua",
  "CSR-01",
  "CSR-02",
  "WM-01",
  "K3-01",
  "ENV-01",
  "HR-05",
];

// ---------------------------------------------------------------------------
// Akun badge — warna berdasarkan level
// ---------------------------------------------------------------------------

// Warna per kolom akun — pakai inline style supaya tidak dipotong Tailwind purge
const AKUN_COL_STYLE: Record<
  "env" | "csr" | "tsm" | "epm",
  React.CSSProperties
> = {
  env: { backgroundColor: "#dbeafe", color: "#1d4ed8" }, // biru pastel
  csr: { backgroundColor: "#d1fae5", color: "#065f46" }, // hijau pastel
  tsm: { backgroundColor: "#fce7f3", color: "#9d174d" }, // pink pastel
  epm: { backgroundColor: "#fef9c3", color: "#854d0e" }, // kuning pastel
};

const AKUN_HEADER_STYLE: Record<
  "env" | "csr" | "tsm" | "epm",
  React.CSSProperties
> = {
  env: { backgroundColor: "#bfdbfe", color: "#1d4ed8" },
  csr: { backgroundColor: "#a7f3d0", color: "#065f46" },
  tsm: { backgroundColor: "#fbcfe8", color: "#9d174d" },
  epm: { backgroundColor: "#fde68a", color: "#854d0e" },
};

// ---------------------------------------------------------------------------
// Kebutuhan training tags — kecil
// ---------------------------------------------------------------------------

function TrainingTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex items-center gap-0.5 overflow-hidden w-[140px]">
      {tags.map((tag) => (
        <span
          key={tag}
          className="px-1 py-0.5 rounded text-[8px] font-semibold bg-zinc-100 text-zinc-400 whitespace-nowrap shrink-0"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function KebutuhanTrainingPerCustomerPage() {
  const [search, setSearch] = useState("");
  const [kodeTraining, setKodeTraining] = useState("Semua");
  const [applied, setApplied] = useState("Semua");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = DUMMY_DATA.filter((d) => {
    const matchSearch =
      d.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
      d.noInduk.toLowerCase().includes(search.toLowerCase()) ||
      d.lineOfBusiness.toLowerCase().includes(search.toLowerCase());
    const matchKode =
      applied === "Semua" || d.kebutuhanTraining.includes(applied);
    return matchSearch && matchKode;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Kebutuhan Training per Customer" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar atas */}
        <div className="px-5 py-4 border-b border-zinc-100 space-y-3">
          {/* Baris 1: title + search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">
                Kebutuhan Training per Customer
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

          {/* Baris 2: filter kode training */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-zinc-500 whitespace-nowrap">
              Kode Training
            </span>
            <div className="relative">
              <select
                value={kodeTraining}
                onChange={(e) => setKodeTraining(e.target.value)}
                className="appearance-none pl-3 pr-7 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all cursor-pointer bg-white"
              >
                {KODE_OPTIONS.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">
                ▾
              </span>
            </div>
            <button
              onClick={() => {
                setApplied(kodeTraining);
                setCurrentPage(1);
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
            >
              Terapkan
            </button>
          </div>

          {/* Info pencarian aktif */}
          {applied !== "Semua" && (
            <p className="text-[11px] text-zinc-400">
              Menampilkan pencarian dari{" "}
              <span className="font-semibold text-emerald-600">
                "{applied}"
              </span>
            </p>
          )}
        </div>

        {/* Sub-header Akun — sticky di atas tabel */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            {/* Grouped header: akun punya 4 sub-kolom */}
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  No. Induk ↕
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Perusahaan/Instansi ↕
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-28">
                  Total Peserta
                </th>
                {/* Akun group header */}
                <th
                  colSpan={4}
                  className="py-2 text-[10px] font-semibold text-zinc-400 text-center"
                >
                  Akun
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Line of Business
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  Kebutuhan Training
                </th>
              </tr>
              {/* Sub-header untuk akun — warna pastel per kolom */}
              <tr className="border-b border-zinc-100">
                <th colSpan={4} />
                {(["env", "csr", "tsm", "epm"] as const).map((col) => (
                  <th
                    key={col}
                    style={AKUN_HEADER_STYLE[col]}
                    className="px-3 py-1.5 text-[10px] font-bold text-center w-16"
                  >
                    {col.toUpperCase()}
                  </th>
                ))}
                <th colSpan={2} />
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
                    className="border-b border-zinc-50 align-top"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap">
                      {row.noInduk}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                      {row.perusahaan}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 text-center">
                      {row.totalPeserta}
                    </td>
                    {/* Akun 4 kolom — background penuh per kolom, inline style */}
                    <td
                      style={AKUN_COL_STYLE.env}
                      className="px-3 py-3 text-center text-xs font-semibold w-16"
                    >
                      {row.akun.env}
                    </td>
                    <td
                      style={AKUN_COL_STYLE.csr}
                      className="px-3 py-3 text-center text-xs font-semibold w-16"
                    >
                      {row.akun.csr}
                    </td>
                    <td
                      style={AKUN_COL_STYLE.tsm}
                      className="px-3 py-3 text-center text-xs font-semibold w-16"
                    >
                      {row.akun.tsm}
                    </td>
                    <td
                      style={AKUN_COL_STYLE.epm}
                      className="px-3 py-3 text-center text-xs font-semibold w-16"
                    >
                      {row.akun.epm}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 max-w-[200px]">
                      {row.lineOfBusiness}
                    </td>
                    <td className="px-4 py-3 w-[140px] max-w-[140px] overflow-hidden">
                      <TrainingTags tags={row.kebutuhanTraining} />
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
            {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(
              (p) => (
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
              disabled={currentPage === totalPages || totalPages === 0}
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
