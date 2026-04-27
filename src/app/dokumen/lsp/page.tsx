// app/perusahaan/permintaan-nomor-surat/page.tsx
"use client";

import React, { useState } from "react";
import AppLayout from "@/components/app-layout";
import ModalPengajuanSurat from "@/components/dokumen/modal-pengajuan-surat";

interface PermintaanNomorSurat {
  id: number;
  noSurat: string;
  keterangan: string;
  tujuan: string;
  tglPelatihan: string;
  pengirim: string;
}

const DUMMY_DATA: PermintaanNomorSurat[] = [
  {
    id: 1,
    noSurat: "0045/BNFT-IV/2026",
    keterangan: "BAST GRK (15-17 April 2026)",
    tujuan: "PT Indoporlen Refractories",
    tglPelatihan: "2026-04-13",
    pengirim: "Zirah",
  },
  {
    id: 2,
    noSurat: "0044/BNFT-IV/2026",
    keterangan: "BAST 3R Sampah (13-15 April 2026)",
    tujuan: "PT Sucofindo Balikpapan",
    tglPelatihan: "2026-04-13",
    pengirim: "Zirah",
  },
  {
    id: 3,
    noSurat: "0043/BNFT-IV/2026",
    keterangan: "BAST PPPU (30 Maret - 01 April 2026)",
    tujuan: "PT Krakatau Chandra Energi",
    tglPelatihan: "2026-04-13",
    pengirim: "Zirah",
  },
  {
    id: 4,
    noSurat: "0042/BNFT-IV/2026",
    keterangan: "Praktek Auditor Energi",
    tujuan: "Park Hotel Cawang Jakarta",
    tglPelatihan: "2026-04-13",
    pengirim: "Dian",
  },
  ...Array.from({ length: 24 }, (_, i) => ({
    id: i + 5,
    noSurat: `00${String(41 - i).padStart(2, "0")}/BNFT-IV/2026`,
    keterangan: `BAST Program ${i + 5}`,
    tujuan: `PT Contoh Perusahaan ${i + 5}`,
    tglPelatihan: "2026-04-13",
    pengirim: i % 2 === 0 ? "Zirah" : "Dian",
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

export default function PermintaanNomorSuratPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"buat" | "edit">("buat");
  const [modalData, setModalData] = useState<{
    keterangan?: string;
    tujuan?: string;
  }>({});

  const openBuat = () => {
    setModalMode("buat");
    setModalData({});
    setModalOpen(true);
  };

  const openEdit = (row: PermintaanNomorSurat) => {
    setModalMode("edit");
    setModalData({ keterangan: row.keterangan, tujuan: row.tujuan });
    setModalOpen(true);
  };

  const filtered = DUMMY_DATA.filter(
    (d) =>
      d.noSurat.toLowerCase().includes(search.toLowerCase()) ||
      d.keterangan.toLowerCase().includes(search.toLowerCase()) ||
      d.tujuan.toLowerCase().includes(search.toLowerCase()),
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
        { label: "Permintaan Nomor Surat (LSP)" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <ModalPengajuanSurat
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        data={modalData}
      />

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
          <span className="font-bold text-zinc-800 text-sm flex items-center gap-2">
            🗓️ Permintaan Nomor Surat (LSP)
          </span>

          <div className="flex items-center gap-2">
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
            <button
              onClick={openBuat}
              className="px-3 py-1.5 text-xs bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Buat Permintaan Nomor Surat
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No ↕
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  No. Surat
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Keterangan
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Tujuan
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  Tgl. Pelatihan
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  Pengirim
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-16">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
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
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.noSurat}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.keterangan}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.tujuan}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.tglPelatihan}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.pengirim}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openEdit(row)}
                        className="text-xs text-emerald-600 font-semibold hover:underline"
                      >
                        Edit
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
