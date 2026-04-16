"use client";

import React, { useState } from "react";
import { LayoutGrid } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PerusahaanISO {
  id: number;
  noInduk: string;
  perusahaan: string;
  env: string;
  csr: string;
  tsm: string;
  epm: string;
  noTelepon: string;
  tahunPeringkat: string;
  update: string;
  lineOfBiz: string;
  cust: string;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: PerusahaanISO[] = [
  {
    id: 1,
    noInduk: "PR00621",
    perusahaan: "PT. ABC",
    env: "EE",
    csr: "EE",
    tsm: "TA",
    epm: "NW",
    noTelepon: "021-8751735",
    tahunPeringkat:
      "KAN25; P24: Emas; KANEmas24; P24-KLHK; P23: Emas; P23-KLHK; P22: Emas; P22-Prov; P21: Emas; P20: Ema",
    update: "260115-RIFQI",
    lineOfBiz: "1-Mining:Produk",
    cust: "1-C-ISO 14001,Proper-IMA",
  },
  {
    id: 2,
    noInduk: "PR07304",
    perusahaan: "PT. BCA",
    env: "SL",
    csr: "SL",
    tsm: "CF",
    epm: "NW",
    noTelepon: "021-87511231",
    tahunPeringkat:
      "KAN25; P24: Emas; KANEmas24; P24-KLHK; P23: Hijau; KANEmas23; KAN23; P23-KLHK; P22: Hijau; P22-Prov",
    update: "251226-WULAN",
    lineOfBiz: "1-Mining :PEM -",
    cust: "4-C",
  },
  {
    id: 3,
    noInduk: "PR02434",
    perusahaan: "PT. XYZ",
    env: "SL",
    csr: "NW",
    tsm: "EE",
    epm: "SL",
    noTelepon: "021-87511222",
    tahunPeringkat:
      "KAN25; P24: Emas; KANEmas24; P24-PROV; P23: Emas; P23-Prov; P22: Hijau; P22-Prov; P21: Emas; P20: Hi",
    update: "241205-WIDIA",
    lineOfBiz: "1-Mining :PEM -",
    cust: "1-C-ISO 14001,Proper",
  },
  {
    id: 4,
    noInduk: "PR08091",
    perusahaan: "PT. ACC",
    env: "SL",
    csr: "EE",
    tsm: "EE",
    epm: "SL",
    noTelepon: "021-8751222",
    tahunPeringkat:
      "KAN25; P24: Emas; KANEmas24; P24-KLHK; P23: Hijau; KANEmas23; KAN23; P23-KLHK; P22: Hijau; P22-Prov",
    update: "260212-GEMPI",
    lineOfBiz: "1-Mining:PEM -",
    cust: "6-Proper",
  },
  {
    id: 5,
    noInduk: "PR00145",
    perusahaan: "PT. Maju Jaya",
    env: "NW",
    csr: "SL",
    tsm: "SL",
    epm: "EE",
    noTelepon: "021-87512345",
    tahunPeringkat:
      "KAN25; P24: Hijau; KANEmas24; P24-KLHK; P23: Emas; P23-KLHK; P22: Hijau; P22-Prov",
    update: "250820-BUDI",
    lineOfBiz: "2-Manufaktur:Produk",
    cust: "2-C-ISO 14001",
  },
  {
    id: 6,
    noInduk: "PR00312",
    perusahaan: "PT. Nusantara Energy",
    env: "EE",
    csr: "CF",
    tsm: "NW",
    epm: "TA",
    noTelepon: "021-87519876",
    tahunPeringkat:
      "KAN25; P24: Emas; P24-PROV; P23: Emas; KAN23; P23-KLHK; P22: Emas; P22-Prov; P21: Hijau",
    update: "260103-RINI",
    lineOfBiz: "3-Energi:PEM -",
    cust: "3-C-ISO 50001,Proper",
  },
  {
    id: 7,
    noInduk: "PR00489",
    perusahaan: "PT. Sinar Mas",
    env: "SL",
    csr: "SL",
    tsm: "EE",
    epm: "NW",
    noTelepon: "021-87514321",
    tahunPeringkat:
      "KAN25; P24: Emas; KANEmas24; P24-KLHK; P23: Emas; P23-KLHK; P22: Hijau; P22-Prov; P21: Emas",
    update: "251115-TONO",
    lineOfBiz: "1-Mining:Produk",
    cust: "1-C-ISO 14001,Proper-IMA",
  },
  {
    id: 8,
    noInduk: "PR00567",
    perusahaan: "PT. Tambang Raya",
    env: "TA",
    csr: "NW",
    tsm: "SL",
    epm: "CF",
    noTelepon: "021-87516789",
    tahunPeringkat:
      "KAN25; P24: Hijau; P24-PROV; P23: Hijau; P23-Prov; P22: Emas; KAN22; P22-KLHK; P21: Hijau",
    update: "260205-SARI",
    lineOfBiz: "1-Mining:PEM -",
    cust: "5-C-ISO 14001",
  },
  {
    id: 9,
    noInduk: "PR00734",
    perusahaan: "PT. Indah Nusantara",
    env: "CF",
    csr: "EE",
    tsm: "NW",
    epm: "SL",
    noTelepon: "021-87518888",
    tahunPeringkat:
      "KAN25; P24: Emas; KANEmas24; P24-KLHK; P23: Emas; KANEmas23; KAN23; P23-KLHK; P22: Emas",
    update: "251030-DIAN",
    lineOfBiz: "4-Jasa:PEM -",
    cust: "2-C-ISO 14001,Proper",
  },
  {
    id: 10,
    noInduk: "PR00891",
    perusahaan: "PT. Karya Mandiri",
    env: "NW",
    csr: "TA",
    tsm: "CF",
    epm: "EE",
    noTelepon: "021-87511111",
    tahunPeringkat:
      "KAN25; P24: Hijau; P24-PROV; P23: Emas; P23-KLHK; P22: Hijau; P22-Prov; P21: Emas; P20: Hijau",
    update: "260310-AGUS",
    lineOfBiz: "2-Manufaktur:Produk",
    cust: "3-C-ISO 14001",
  },
  {
    id: 11,
    noInduk: "PR00923",
    perusahaan: "PT. Bangun Sejahtera",
    env: "SL",
    csr: "SL",
    tsm: "SL",
    epm: "NW",
    noTelepon: "021-87512222",
    tahunPeringkat:
      "KAN25; P24: Emas; KANEmas24; P24-KLHK; P23: Hijau; P23-Prov; P22: Emas; KAN22",
    update: "250915-WAHYU",
    lineOfBiz: "3-Energi:Produk",
    cust: "4-C-ISO 50001",
  },
  {
    id: 12,
    noInduk: "PR01012",
    perusahaan: "PT. Gemilang Abadi",
    env: "EE",
    csr: "CF",
    tsm: "TA",
    epm: "SL",
    noTelepon: "021-87513333",
    tahunPeringkat:
      "KAN25; P24: Emas; P24-PROV; P23: Emas; KANEmas23; KAN23; P23-KLHK; P22: Emas; P22-Prov; P21: Hijau",
    update: "260118-FITRI",
    lineOfBiz: "1-Mining:PEM -",
    cust: "1-C-ISO 14001,Proper-IMA",
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Badge color map per value
const BADGE_COLOR: Record<string, React.CSSProperties> = {
  EE: { backgroundColor: "#bbf7d0", color: "#166534" },
  SL: { backgroundColor: "#bfdbfe", color: "#1d4ed8" },
  NW: { backgroundColor: "#fde68a", color: "#854d0e" },
  TA: { backgroundColor: "#e9d5ff", color: "#6b21a8" },
  CF: { backgroundColor: "#fed7aa", color: "#9a3412" },
};

function AccBadge({ val }: { val: string }) {
  const style = BADGE_COLOR[val] ?? {
    backgroundColor: "#f1f5f9",
    color: "#475569",
  };
  return (
    <td className="px-3 py-4 text-center">
      <span
        style={style}
        className="inline-block px-2 py-0.5 rounded text-[11px] font-bold tracking-wide"
      >
        {val}
      </span>
    </td>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DaftarPerusahaanISOPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = DUMMY_DATA.filter(
    (d) =>
      d.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
      d.noInduk.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Daftar Perusahaan ISO" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <LayoutGrid className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">
              Daftar Perusahaan ISO
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
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No ↕
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  No Induk
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  Perusahaan/Instansi
                </th>
                {/* ENV */}
                <th
                  style={{ backgroundColor: "#bfdbfe", color: "#1d4ed8" }}
                  className="px-3 py-2 text-[10px] font-bold text-center w-16"
                >
                  ENV ↕
                </th>
                {/* CSR */}
                <th
                  style={{ backgroundColor: "#bbf7d0", color: "#166534" }}
                  className="px-3 py-2 text-[10px] font-bold text-center w-16"
                >
                  CSR ↕
                </th>
                {/* TSM */}
                <th
                  style={{ backgroundColor: "#e9d5ff", color: "#6b21a8" }}
                  className="px-3 py-2 text-[10px] font-bold text-center w-16"
                >
                  TSM ↕
                </th>
                {/* EPM */}
                <th
                  style={{ backgroundColor: "#fde68a", color: "#854d0e" }}
                  className="px-3 py-2 text-[10px] font-bold text-center w-16"
                >
                  EPM ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  No. Telepon
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-56">
                  Tahun Peringkat
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  Update
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Line of Biz
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-44">
                  Cust
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={12}
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
                    <td className="px-4 py-4 text-xs text-zinc-400">
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-4 py-4 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap">
                      {row.noInduk}
                    </td>
                    <td className="px-4 py-4 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap max-w-[160px] truncate overflow-hidden">
                      {row.perusahaan}
                    </td>
                    <td className="px-3 py-4 text-center bg-blue-100">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold tracking-wide bg-blue-100 text-blue-700">
                        {row.env}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-center bg-emerald-100">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold tracking-wide bg-emerald-100 text-green-800">
                        {row.csr}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-center bg-purple-100">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold tracking-wide bg-purple-100 text-purple-800">
                        {row.tsm}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-center bg-yellow-100">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold tracking-wide bg-yellow-100 text-yellow-800">
                        {row.epm}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-xs text-zinc-600 whitespace-nowrap">
                      {row.noTelepon}
                    </td>
                    <td className="px-3 py-4 text-xs text-zinc-500 leading-relaxed max-w-[220px]">
                      {row.tahunPeringkat}
                    </td>
                    <td className="px-3 py-4 text-xs text-zinc-600 whitespace-nowrap">
                      {row.update}
                    </td>
                    <td className="px-3 py-4 text-xs text-zinc-600 whitespace-nowrap">
                      {row.lineOfBiz}
                    </td>
                    <td className="px-3 py-4 text-xs text-zinc-600">
                      {row.cust}
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
