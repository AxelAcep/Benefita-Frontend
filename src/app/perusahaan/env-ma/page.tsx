"use client";

import React, { useState } from "react";
import { TableProperties } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PerusahaanENVMA {
  id: number;
  noInduk: string;
  perusahaan: string;
  prioAE: string;
  alamat: string;
  noTelepon: string;
  email: string;
  lineOfBiz: string;
  proper: string;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: PerusahaanENVMA[] = [
  {
    id: 1,
    noInduk: "PR00621",
    perusahaan: "PT. ABC",
    prioAE: "A201114",
    alamat: "Wisma KIE, Jl. Ammonia Kav. 79 Bontang - Kaltim 75314",
    noTelepon: "0254-392 159, 392 003",
    email: "-",
    lineOfBiz: "p 6-Metal : Baja",
    proper: "-",
  },
  {
    id: 2,
    noInduk: "PR07304",
    perusahaan: "PT. BCA",
    prioAE: "A201114",
    alamat:
      "Kawasan Industri Delta Silikon, Jl. MH Thamrin Blok A3-1 Lippo Cikarang Kab. Bekasi - Jabar 17550",
    noTelepon: "0254-392 159, 392 003",
    email: "-",
    lineOfBiz: "p 6-Metal : Baja",
    proper: "-",
  },
  {
    id: 3,
    noInduk: "PR02434",
    perusahaan: "PT. XYZ",
    prioAE: "A201114",
    alamat: "Jl. Raya Balongan Km. 09 Balongan, Indramayu - Jabar 45217",
    noTelepon: "0254-392 159, 392 003",
    email: "-",
    lineOfBiz: "p 6-Metal : Baja",
    proper: "ISO 14001 (LRQA)",
  },
  {
    id: 4,
    noInduk: "PR08091",
    perusahaan: "PT. ACC",
    prioAE: "A201114",
    alamat:
      "Jl. Raya Jaya Negara Kp. Kabandungan, Kec.Kalapanunggal Kab. Sukabumi - Jabar",
    noTelepon: "081213076631",
    email: "-",
    lineOfBiz: "p 6-Metal : Baja",
    proper: "ISO 14001 (PSB-9912)",
  },
  {
    id: 5,
    noInduk: "PR03312",
    perusahaan: "PT. DEF",
    prioAE: "A201115",
    alamat: "Jl. Gatot Subroto Kav. 51 Jakarta Selatan 12950",
    noTelepon: "021-5252-1111",
    email: "info@def.co.id",
    lineOfBiz: "p 4-Kimia : Petro",
    proper: "ISO 14001",
  },
  {
    id: 6,
    noInduk: "PR04455",
    perusahaan: "PT. GHI",
    prioAE: "A201115",
    alamat: "Jl. HR Rasuna Said Blok X-5 Kav. 2-3 Kuningan Jakarta Selatan",
    noTelepon: "021-527-7222",
    email: "hrd@ghi.co.id",
    lineOfBiz: "p 4-Kimia : Petro",
    proper: "-",
  },
  {
    id: 7,
    noInduk: "PR05678",
    perusahaan: "PT. JKL",
    prioAE: "A201116",
    alamat: "Jl. Jend. Sudirman Kav. 52-53 Jakarta Pusat 10220",
    noTelepon: "021-515-5000",
    email: "info@jkl.co.id",
    lineOfBiz: "p 2-Energi : Listrik",
    proper: "ISO 14001 (SGS)",
  },
  {
    id: 8,
    noInduk: "PR06789",
    perusahaan: "PT. MNO",
    prioAE: "A201116",
    alamat: "Jl. TB Simatupang No. 88 Jakarta Selatan 12560",
    noTelepon: "021-789-1111",
    email: "cs@mno.co.id",
    lineOfBiz: "p 2-Energi : Listrik",
    proper: "-",
  },
  {
    id: 9,
    noInduk: "PR09001",
    perusahaan: "PT. PQR",
    prioAE: "A201117",
    alamat: "Jl. Pangeran Jayakarta No. 117 Jakarta Barat 11110",
    noTelepon: "021-624-5000",
    email: "admin@pqr.co.id",
    lineOfBiz: "p 3-Manufaktur : Otomotif",
    proper: "ISO 14001 (BV)",
  },
  {
    id: 10,
    noInduk: "PR09112",
    perusahaan: "PT. STU",
    prioAE: "A201117",
    alamat: "Jl. Raya Bekasi Km. 22 Cakung Jakarta Timur 13910",
    noTelepon: "021-460-1234",
    email: "info@stu.co.id",
    lineOfBiz: "p 3-Manufaktur : Otomotif",
    proper: "-",
  },
  {
    id: 11,
    noInduk: "PR09223",
    perusahaan: "PT. VWX",
    prioAE: "A201118",
    alamat: "Kawasan Industri MM2100 Blok KK-1, Bekasi - Jabar",
    noTelepon: "021-898-1200",
    email: "contact@vwx.co.id",
    lineOfBiz: "p 5-Pertambangan : Batubara",
    proper: "ISO 14001 (TUV)",
  },
  {
    id: 12,
    noInduk: "PR09334",
    perusahaan: "PT. YZA",
    prioAE: "A201118",
    alamat: "Jl. Kalimantan No. 1 Sangatta Kutai Timur - Kaltim",
    noTelepon: "0549-521-100",
    email: "hrd@yza.co.id",
    lineOfBiz: "p 5-Pertambangan : Batubara",
    proper: "ISO 14001 (LRQA)",
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DaftarPerusahaanENVMAPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 10;

  const filtered = DUMMY_DATA.filter(
    (d) =>
      d.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
      d.noInduk.toLowerCase().includes(search.toLowerCase()) ||
      d.alamat.toLowerCase().includes(search.toLowerCase()),
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
        { label: "Daftar Perusahaan ENV : MA" },
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
            <div className="flex items-center gap-2 mr-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <TableProperties className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">
                Daftar Perusahaan ENV : MA
              </span>
            </div>

            {/* Search — pushed to the right */}
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
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  Prio AE
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  No Induk
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Perusahaan/Instansi
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-52">
                  Alamat
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  No. Telepon
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Email
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Line of Biz
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  PROPER
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-12 text-center text-xs text-zinc-400"
                  >
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                paginated.map((row, i) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors align-top"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                      {row.prioAE}
                    </td>
                    <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap">
                      {row.noInduk}
                    </td>
                    <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline whitespace-nowrap">
                      {row.perusahaan}
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
                    <td className="px-3 py-3 text-xs text-zinc-600">
                      {row.lineOfBiz}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600">
                      {row.proper === "-" ? (
                        <span className="text-zinc-300 select-none">–</span>
                      ) : (
                        row.proper
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
