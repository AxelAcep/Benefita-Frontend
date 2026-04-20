"use client";

import React, { useState } from "react";
import { Building2 } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AkunPerusahaan {
  id: number;
  noInduk: string;
  perusahaan: string;
  waktu: string;
  action: string | null;
  accEnv: string;
  diKontakTerakhirEnv: string;
  enviro: number;
  accCsr: string;
  diKontakTerakhirCsr: string;
  csr: number;
  accTsm: string;
  diKontakTerakhirTsm: string;
  tsm: number;
  accEpm: string;
  diKontakTerakhirEpm: string;
  epm: number;
  hp: string | null;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: AkunPerusahaan[] = [
  {
    id: 1,
    noInduk: "PR00621",
    perusahaan: "PT. ABC",
    waktu: "WITA",
    action: null,
    accEnv: "EE",
    diKontakTerakhirEnv: "09-Apr-2026",
    enviro: 0,
    accCsr: "SL",
    diKontakTerakhirCsr: "18-Jan-2026",
    csr: 81,
    accTsm: "SL",
    diKontakTerakhirTsm: "12-Jan-2026",
    tsm: 1,
    accEpm: "SL",
    diKontakTerakhirEpm: "12-Jan-2026",
    epm: 1,
    hp: "Ada",
  },
  {
    id: 2,
    noInduk: "PR07304",
    perusahaan: "PT. BCA",
    waktu: "WIB",
    action: null,
    accEnv: "EE",
    diKontakTerakhirEnv: "09-Apr-2026",
    enviro: 0,
    accCsr: "RQ",
    diKontakTerakhirCsr: "18-Jan-2026",
    csr: 7,
    accTsm: "NW",
    diKontakTerakhirTsm: "12-Jan-2026",
    tsm: 2,
    accEpm: "NW",
    diKontakTerakhirEpm: "12-Jan-2026",
    epm: 2,
    hp: null,
  },
  {
    id: 3,
    noInduk: "PR02434",
    perusahaan: "PT. XYZ",
    waktu: "WIB",
    action: "N",
    accEnv: "EE",
    diKontakTerakhirEnv: "08-Apr-2026",
    enviro: 1,
    accCsr: "SL",
    diKontakTerakhirCsr: "18-Jan-2026",
    csr: 104,
    accTsm: "RQ",
    diKontakTerakhirTsm: "12-Jan-2026",
    tsm: 3,
    accEpm: "RQ",
    diKontakTerakhirEpm: "12-Jan-2026",
    epm: 3,
    hp: null,
  },
  {
    id: 4,
    noInduk: "PR08091",
    perusahaan: "PT. ACC",
    waktu: "WITA",
    action: null,
    accEnv: "EE",
    diKontakTerakhirEnv: "08-Apr-2026",
    enviro: 2,
    accCsr: "EE",
    diKontakTerakhirCsr: "18-Jan-2026",
    csr: 1,
    accTsm: "SL",
    diKontakTerakhirTsm: "11-Jan-2026",
    tsm: 4,
    accEpm: "SL",
    diKontakTerakhirEpm: "12-Jan-2026",
    epm: 4,
    hp: "Ada",
  },
  {
    id: 5,
    noInduk: "PR00312",
    perusahaan: "PT. Maju Jaya",
    waktu: "WIB",
    action: null,
    accEnv: "SL",
    diKontakTerakhirEnv: "07-Apr-2026",
    enviro: 3,
    accCsr: "SL",
    diKontakTerakhirCsr: "15-Jan-2026",
    csr: 22,
    accTsm: "EE",
    diKontakTerakhirTsm: "10-Jan-2026",
    tsm: 2,
    accEpm: "CF",
    diKontakTerakhirEpm: "10-Jan-2026",
    epm: 1,
    hp: "Ada",
  },
  {
    id: 6,
    noInduk: "PR00445",
    perusahaan: "PT. Nusantara Energy",
    waktu: "WIT",
    action: "N",
    accEnv: "NW",
    diKontakTerakhirEnv: "06-Apr-2026",
    enviro: 0,
    accCsr: "NW",
    diKontakTerakhirCsr: "14-Jan-2026",
    csr: 55,
    accTsm: "SL",
    diKontakTerakhirTsm: "09-Jan-2026",
    tsm: 3,
    accEpm: "SL",
    diKontakTerakhirEpm: "09-Jan-2026",
    epm: 2,
    hp: null,
  },
  {
    id: 7,
    noInduk: "PR00889",
    perusahaan: "PT. Sinar Mas",
    waktu: "WIB",
    action: null,
    accEnv: "TA",
    diKontakTerakhirEnv: "05-Apr-2026",
    enviro: 1,
    accCsr: "CF",
    diKontakTerakhirCsr: "13-Jan-2026",
    csr: 38,
    accTsm: "TA",
    diKontakTerakhirTsm: "08-Jan-2026",
    tsm: 1,
    accEpm: "EE",
    diKontakTerakhirEpm: "08-Jan-2026",
    epm: 3,
    hp: null,
  },
  {
    id: 8,
    noInduk: "PR00991",
    perusahaan: "PT. Tambang Raya",
    waktu: "WITA",
    action: null,
    accEnv: "CF",
    diKontakTerakhirEnv: "04-Apr-2026",
    enviro: 4,
    accCsr: "EE",
    diKontakTerakhirCsr: "12-Jan-2026",
    csr: 12,
    accTsm: "CF",
    diKontakTerakhirTsm: "07-Jan-2026",
    tsm: 5,
    accEpm: "TA",
    diKontakTerakhirEpm: "07-Jan-2026",
    epm: 2,
    hp: "Ada",
  },
];

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

const AKUN_OPTIONS = ["ENV", "CSR", "TSM", "EPM"];
const BDO_OPTIONS = ["Eni", "Budi", "Sari", "Doni", "Rini"];
const DATABASE_OPTIONS = ["Perusahaan", "Instansi", "Semua"];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AkunPerusahaanBDOPage() {
  const [akun, setAkun] = useState("ENV");
  const [bdo, setBdo] = useState("Eni");
  const [database, setDatabase] = useState("Perusahaan");
  const [appliedAkun, setAppliedAkun] = useState("ENV");
  const [appliedBdo, setAppliedBdo] = useState("Eni");
  const [appliedDatabase, setAppliedDatabase] = useState("Perusahaan");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const handleTerapkan = () => {
    setAppliedAkun(akun);
    setAppliedBdo(bdo);
    setAppliedDatabase(database);
    setCurrentPage(1);
  };

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

  const SelectField = ({
    label,
    value,
    onChange,
    options,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: string[];
  }) => (
    <div className="flex items-center gap-1.5">
      <span className="text-[11px] font-semibold text-zinc-500 whitespace-nowrap">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none pl-3 pr-6 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all cursor-pointer bg-white"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">
          ▾
        </span>
      </div>
    </div>
  );

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Perusahaan", href: "/perusahaan" },
        { label: "Akun Perusahaan (BDO)" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-zinc-100 space-y-3">
          {/* Baris 1: title */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Building2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">
              Akun Perusahaan (BDO)
            </span>
          </div>

          {/* Baris 2: filter + search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Filter kiri */}
            <div className="flex flex-wrap items-center gap-3">
              <SelectField
                label="Akun"
                value={akun}
                onChange={setAkun}
                options={AKUN_OPTIONS}
              />
              <SelectField
                label="BDO"
                value={bdo}
                onChange={setBdo}
                options={BDO_OPTIONS}
              />
              <SelectField
                label="Database"
                value={database}
                onChange={setDatabase}
                options={DATABASE_OPTIONS}
              />
              <button
                onClick={handleTerapkan}
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
              >
                Terapkan
              </button>
            </div>

            {/* Search kanan */}
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

          {/* Info filter aktif */}
          <p className="text-[11px] text-zinc-400">
            Menampilkan daftar perusahaan dari{" "}
            <span className="font-semibold text-emerald-600">
              &quot;{appliedAkun}, {appliedBdo}, {appliedDatabase}&quot;
            </span>
          </p>
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
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Perusahaan/Instansi
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-16">
                  Waktu
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  Action
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  ACC ENV ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-28">
                  Di kontak terakhir ENV ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  Enviro
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  ACC CSR ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-28">
                  Di kontak terakhir CSR ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  CSR
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  ACC TSM ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-28">
                  Di kontak terakhir TSM ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  TSM
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  ACC EPM ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-28">
                  Di kontak terakhir EPM ↕
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  EPM
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-14">
                  HP
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={18}
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
                      {row.noInduk}
                    </td>
                    <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap">
                      {row.perusahaan}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.waktu}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-400 text-center">
                      {row.action ?? "–"}
                    </td>

                    {/* ENV group */}
                    <td className="px-3 py-3 text-center text-xs font-semibold text-zinc-600">
                      {row.accEnv}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-500 text-center whitespace-nowrap">
                      {row.diKontakTerakhirEnv}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 text-center font-medium">
                      {row.enviro}
                    </td>

                    {/* CSR group */}
                    <td className="px-3 py-3 text-center text-xs font-semibold text-zinc-600">
                      {row.accCsr}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-500 text-center whitespace-nowrap">
                      {row.diKontakTerakhirCsr}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 text-center font-medium">
                      {row.csr}
                    </td>

                    {/* TSM group */}
                    <td className="px-3 py-3 text-center text-xs font-semibold text-zinc-600">
                      {row.accTsm}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-500 text-center whitespace-nowrap">
                      {row.diKontakTerakhirTsm}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 text-center font-medium">
                      {row.tsm}
                    </td>

                    {/* EPM group */}
                    <td className="px-3 py-3 text-center text-xs font-semibold text-zinc-600">
                      {row.accEpm}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-500 text-center whitespace-nowrap">
                      {row.diKontakTerakhirEpm}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 text-center font-medium">
                      {row.epm}
                    </td>

                    {/* HP */}
                    <td className="px-4 py-3 text-xs text-center">
                      {row.hp ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 font-semibold text-[10px]">
                          {row.hp}
                        </span>
                      ) : (
                        <span className="text-zinc-300">–</span>
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
