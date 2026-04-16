"use client";

import React, { useState } from "react";
import AppLayout from "@/components/app-layout";

interface PerusahaanTBK {
  id: number;
  noInduk: string;
  perusahaan: string;
  acc: string;
  tglTerakhirTraining: string;
  alamat: string;
  noTelepon: string;
  update: string;
  lineOfBiz: string;
}

const DUMMY_DATA: PerusahaanTBK[] = [
  {
    id: 1,
    noInduk: "PR00621",
    perusahaan: "PT. ABC",
    acc: "EE",
    tglTerakhirTraining: "29 - 2 July 2015",
    alamat: "Jl. Raya Jakarta-Bogor Km. 37 Cimanggis, Depok - Jabar",
    noTelepon: "021-8751735",
    update: "700101-WULAN",
    lineOfBiz: "7-MM :MPJ - Farmasi; Susu - M",
  },
  {
    id: 2,
    noInduk: "PR07304",
    perusahaan: "PT. BCA",
    acc: "SS",
    tglTerakhirTraining: "18 - 20 December 2023",
    alamat:
      "ACSET Building Jl. Majapahit No.26 Petojo Selatan Jakarta Pusat 10160",
    noTelepon: "021-87511231",
    update: "700101-MULYADI",
    lineOfBiz: "14-EPC & Prop:Manajemen - EPC",
  },
  {
    id: 3,
    noInduk: "PR02434",
    perusahaan: "PT. XYZ",
    acc: "SL",
    tglTerakhirTraining: "12 - 14 March 2024",
    alamat: "Jl. Raya Pasar Minggu Km. 18 Jakarta Selatan",
    noTelepon: "021-87511222",
    update: "700101-MULYADI",
    lineOfBiz: "14-EPC & Prop:5 bisnis",
  },
  {
    id: 4,
    noInduk: "PR08091",
    perusahaan: "PT. ACC",
    acc: "WW",
    tglTerakhirTraining: "7 - 8 November 2013",
    alamat:
      "Gd. Graha Kirana Lt. 6, Jl. Yos Sudarso No. 88 Jakarta Utara 14350",
    noTelepon: "021-8751222",
    update: "700101-ARISTA",
    lineOfBiz: "5-Otomotif : Transportasi - D",
  },
  {
    id: 5,
    noInduk: "PR00123",
    perusahaan: "PT. Maju Jaya",
    acc: "MG",
    tglTerakhirTraining: "1 - 3 March 2025",
    alamat: "Jl. Sudirman Kav. 52-53, Jakarta Pusat 10220",
    noTelepon: "021-5711234",
    update: "700101-BUDI",
    lineOfBiz: "3-Manufaktur : Kimia - B",
  },
  {
    id: 6,
    noInduk: "PR00456",
    perusahaan: "PT. Nusantara Energy",
    acc: "NW",
    tglTerakhirTraining: "5 - 7 August 2024",
    alamat: "Jl. TB Simatupang No. 10, Jakarta Selatan 12430",
    noTelepon: "021-7884321",
    update: "700101-SARI",
    lineOfBiz: "10-Energi : Pertambangan - C",
  },
];

const PAGE_SIZE = 10;

export default function DaftarPerusahaanTBKPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
        { label: "Daftar Perusahaan TBK" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="font-bold text-zinc-800 text-sm">
            Daftar Perusahaan TBK
          </span>

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
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No ↕
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20">
                  No Induk
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Perusahaan/Instansi
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  Acc
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-44">
                  Tgl. Terakhir Training ↕
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Alamat
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  No. Telepon
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  Update
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Line of Biz ↕
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
                    className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {(currentPage - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline">
                      {row.noInduk}
                    </td>
                    <td className="px-4 py-3 text-xs text-emerald-600 font-semibold cursor-pointer hover:underline max-w-[140px] truncate overflow-hidden whitespace-nowrap">
                      {row.perusahaan}
                    </td>
                    <td className="px-3 py-3 text-center text-xs font-semibold text-zinc-600">
                      {row.acc}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.tglTerakhirTraining}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 max-w-[200px]">
                      {row.alamat}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.noTelepon}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.update}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.lineOfBiz}
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
