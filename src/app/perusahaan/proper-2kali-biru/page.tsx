"use client";

import React, { useState } from "react";
import { Building2 } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PerusahaanProper {
  id: number;
  noInduk: string;
  perusahaan: string;
  acc: string;
  alamat: string;
  noTelepon: string;
  email: string;
  tahunPeringkat: string;
  update: string;
  lineOfBiz: string;
  cust: string;
  no: string | null;
  bdo: string;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: PerusahaanProper[] = [
  {
    id: 1,
    noInduk: "PR00621",
    perusahaan: "PT. ABC",
    acc: "EE",
    alamat: "Jl. Raya Jakarta-Bogor Km. 37 Cimanggis, Depok - Jabar",
    noTelepon: "021-8751735",
    email: "abc@gmail.com",
    tahunPeringkat:
      "KAN25; P24: Emas; KANEmas24; P24-KLHK; P23: Emas; P23-KLHK; P22: Emas; P22-Prov; P21: Emas; P20: Ema",
    update: "260115-RIFQI",
    lineOfBiz: "1-Mining:Produk",
    cust: "1-C-ISO 14001,Proper-IMA",
    no: "254",
    bdo: "Nanang",
  },
  {
    id: 2,
    noInduk: "PR07304",
    perusahaan: "PT. BCA",
    acc: "SS",
    alamat:
      "ACSET Building Jl. Majapahit No.26 Petojo Selatan Jakarta Pusat 10160",
    noTelepon: "021-87511231",
    email: "bca@gmail.com",
    tahunPeringkat:
      "KAN25; P24: Emas; KANEmas24; P24-KLHK; P23: Hijau; KANEmas23; KAN23; P23-KLHK; P22: Hijau; P22-Prov",
    update: "251226-WULAN",
    lineOfBiz: "1-Mining :PEM -",
    cust: "4-C",
    no: "330",
    bdo: "Nanang",
  },
  {
    id: 3,
    noInduk: "PR02434",
    perusahaan: "PT. XYZ",
    acc: "SL",
    alamat: "Jl. Raya Pasar Minggu Km. 18 Jakarta Selatan",
    noTelepon: "021-87511222",
    email: "ccc@gmail.com",
    tahunPeringkat:
      "KAN25; P24: Emas; KANEmas24; P24-PROV; P23: Emas; P23-Prov; P22: Hijau; P22-Prov; P21: Emas; P20: Hi",
    update: "241205-WIDIA",
    lineOfBiz: "1-Mining :PEM –",
    cust: "1-C-ISO 14001,Proper",
    no: "244",
    bdo: "Nanang",
  },
  {
    id: 4,
    noInduk: "PR08091",
    perusahaan: "PT. ACC",
    acc: "WW",
    alamat:
      "Gd. Graha Kirana Lt. 6, Jl. Yos Sudarso No. 88 Jakarta Utara 14350",
    noTelepon: "021-8751222",
    email: "aaa@gmail.com",
    tahunPeringkat:
      "KAN25; P24: Emas; KANEmas24; P24-KLHK; P23: Hijau; KANEmas23; KAN23; P23-KLHK; P22: Hijau; P22-Prov",
    update: "260212-GEMPI",
    lineOfBiz: "1-Mining:PEM –",
    cust: "6-Proper",
    no: null,
    bdo: "Axel",
  },
];

const BDO_OPTIONS = ["Axel", "Nanang"];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DaftarPerusahaanProperBDOPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBDO, setSelectedBDO] = useState("");
  const [appliedBDO, setAppliedBDO] = useState("");

  const PAGE_SIZE = 10;

  const handleTerapkan = () => {
    setAppliedBDO(selectedBDO);
    setCurrentPage(1);
  };

  const filtered = appliedBDO
    ? DUMMY_DATA.filter((d) => {
        const matchBDO = d.bdo === appliedBDO;
        const matchSearch =
          d.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
          d.noInduk.toLowerCase().includes(search.toLowerCase());
        return matchBDO && matchSearch;
      })
    : [];

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const hasApplied = appliedBDO !== "";

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Daftar Perusahaan PROPER" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100">
          {/* Row 1 */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Title */}
            <div className="flex items-center gap-2 mr-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">
                Daftar Perusahaan PROPER
              </span>
            </div>

            {/* Filter BDO */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">BDO</span>
              <select
                value={selectedBDO}
                onChange={(e) => setSelectedBDO(e.target.value)}
                className="pl-2.5 pr-6 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white appearance-none cursor-pointer"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 6px center",
                }}
              >
                <option value="">Pilih BDO</option>
                {BDO_OPTIONS.map((o) => (
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

          {/* Row 2: label filter aktif */}
          {hasApplied && (
            <p className="mt-2 text-[11px] text-zinc-500">
              Menampilkan daftar perusahaan dari{" "}
              <span className="font-semibold text-zinc-700">
                &quot;{appliedBDO}&quot;
              </span>
            </p>
          )}
        </div>

        {/* Body */}
        {!hasApplied ? (
          /* Empty state — belum pilih BDO */
          <div className="flex flex-col items-center justify-center py-24 gap-2">
            <p className="text-sm font-semibold text-zinc-700">
              Silahkan Pilih Kode BDO
            </p>
            <p className="text-xs text-zinc-400">
              Pilih kode BDO yang ingin ditampilkan
            </p>
          </div>
        ) : (
          /* Table */
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
                  <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                    Perusahaan/Instansi
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                    Acc
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-52">
                    Alamat
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                    No. Telepon
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                    Email ↕
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-56">
                    Tahun Peringkat
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                    Update
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                    Line of Biz
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                    Cust
                  </th>
                  <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-center w-14">
                    No
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
                      <td className="px-4 py-3 text-xs text-zinc-400">
                        {(currentPage - 1) * PAGE_SIZE + i + 1}
                      </td>
                      <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap">
                        {row.noInduk}
                      </td>
                      <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap">
                        {row.perusahaan}
                      </td>
                      <td className="px-3 py-3 text-center text-xs font-semibold text-zinc-600">
                        {row.acc}
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600 leading-relaxed">
                        {row.alamat}
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600 whitespace-nowrap">
                        {row.noTelepon}
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600">
                        {row.email}
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600 leading-relaxed">
                        {row.tahunPeringkat}
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600 whitespace-nowrap">
                        {row.update}
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600">
                        {row.lineOfBiz}
                      </td>
                      <td className="px-3 py-3 text-xs text-zinc-600">
                        {row.cust}
                      </td>
                      <td className="px-3 py-3 text-center text-xs text-zinc-600">
                        {row.no ?? (
                          <span className="text-zinc-300 select-none">–</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-zinc-100">
          <p className="text-[11px] text-zinc-400">
            Menampilkan{" "}
            <span className="font-semibold text-zinc-600">
              {!hasApplied || filtered.length === 0
                ? 0
                : (currentPage - 1) * PAGE_SIZE + 1}
              –{Math.min(currentPage * PAGE_SIZE, filtered.length)}
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
            {Array.from(
              { length: hasApplied ? totalPages : 1 },
              (_, i) => i + 1,
            ).map((p) => (
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
              disabled={!hasApplied || currentPage === totalPages}
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
