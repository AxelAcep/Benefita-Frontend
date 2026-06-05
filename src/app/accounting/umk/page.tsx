"use client";

import React, { useState } from "react";
import { FileText } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface InvoicePengirimanItem {
  id: number;
  instansi: string;
  noInvoice: string;
  kodePelTgl: string;
  harga: string;
  bayar: number;
  pengiriman: {
    berkas: string | null;
    ditujukan: string | null;
    penerima: string | null;
    bupot: "Belum" | "Sudah" | null;
  };
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: InvoicePengirimanItem[] = [
  {
    id: 1,
    instansi: "PT Sucofindo Cabang Semarang",
    noInvoice: "0200/INV/REG-WM-01/V/26",
    kodePelTgl: "WM-01 /\n04-06 Mei 2026",
    harga: "Rp20.000.000",
    bayar: 0,
    pengiriman: {
      berkas: null,
      ditujukan: null,
      penerima: null,
      bupot: "Belum",
    },
  },
  {
    id: 2,
    instansi: "Institut Teknologi Kalimantan",
    noInvoice: "0199/INV/REG-EP-14/VI/26",
    kodePelTgl: "EP-14 /\n22-25 Juni 2026",
    harga: "Rp15.650.000",
    bayar: 0,
    pengiriman: {
      berkas: null,
      ditujukan: null,
      penerima: null,
      bupot: "Belum",
    },
  },
  {
    id: 3,
    instansi: "PT Indo Raya Tenaga",
    noInvoice: "0198/INV/REG-WM-07/VI/26",
    kodePelTgl: "WM-07 /\n08-10 Juni 2026",
    harga: "Rp15.000.000",
    bayar: 15000000,
    pengiriman: {
      berkas: "Ada",
      ditujukan: "Direktur",
      penerima: "Budi S.",
      bupot: "Sudah",
    },
  },
  {
    id: 4,
    instansi: "PT Indonesia Asahan Aluminium",
    noInvoice: "0196/INV/KON-EP-07/II/26",
    kodePelTgl: "EP-07 /\n18-18 Februari 2026",
    harga: "Rp12.000.000",
    bayar: 0,
    pengiriman: {
      berkas: null,
      ditujukan: null,
      penerima: null,
      bupot: "Belum",
    },
  },
  {
    id: 5,
    instansi: "PT Pertamina EP",
    noInvoice: "0195/INV/REG-WM-03/IV/26",
    kodePelTgl: "WM-03 /\n15-17 April 2026",
    harga: "Rp18.500.000",
    bayar: 18500000,
    pengiriman: {
      berkas: "Ada",
      ditujukan: "HRD Manager",
      penerima: "Siti R.",
      bupot: "Sudah",
    },
  },
  {
    id: 6,
    instansi: "PT PLN (Persero) UIP JBT",
    noInvoice: "0194/INV/REG-EP-11/IV/26",
    kodePelTgl: "EP-11 /\n22-24 April 2026",
    harga: "Rp22.000.000",
    bayar: 0,
    pengiriman: {
      berkas: null,
      ditujukan: null,
      penerima: null,
      bupot: "Belum",
    },
  },
  {
    id: 7,
    instansi: "PT Freeport Indonesia",
    noInvoice: "0193/INV/REG-WM-05/III/26",
    kodePelTgl: "WM-05 /\n10-12 Maret 2026",
    harga: "Rp25.000.000",
    bayar: 25000000,
    pengiriman: {
      berkas: "Ada",
      ditujukan: "Finance Dept.",
      penerima: "Anita K.",
      bupot: "Sudah",
    },
  },
  {
    id: 8,
    instansi: "PT Chevron Pacific Indonesia",
    noInvoice: "0192/INV/KON-EP-03/III/26",
    kodePelTgl: "EP-03 /\n17-19 Maret 2026",
    harga: "Rp14.000.000",
    bayar: 0,
    pengiriman: {
      berkas: null,
      ditujukan: null,
      penerima: null,
      bupot: "Belum",
    },
  },
  {
    id: 9,
    instansi: "PT Bukit Asam Tbk",
    noInvoice: "0191/INV/REG-WM-02/II/26",
    kodePelTgl: "WM-02 /\n03-05 Februari 2026",
    harga: "Rp16.500.000",
    bayar: 16500000,
    pengiriman: {
      berkas: "Ada",
      ditujukan: "GM Operasi",
      penerima: "Mega L.",
      bupot: "Sudah",
    },
  },
  {
    id: 10,
    instansi: "PT Medco Energi Internasional",
    noInvoice: "0190/INV/REG-EP-09/II/26",
    kodePelTgl: "EP-09 /\n10-12 Februari 2026",
    harga: "Rp13.750.000",
    bayar: 0,
    pengiriman: {
      berkas: null,
      ditujukan: null,
      penerima: null,
      bupot: "Belum",
    },
  },
  {
    id: 11,
    instansi: "PT Krakatau Steel Tbk",
    noInvoice: "0189/INV/KON-WM-08/I/26",
    kodePelTgl: "WM-08 /\n20-22 Januari 2026",
    harga: "Rp19.000.000",
    bayar: 0,
    pengiriman: {
      berkas: null,
      ditujukan: null,
      penerima: null,
      bupot: "Belum",
    },
  },
  {
    id: 12,
    instansi: "PT Holcim Indonesia Tbk",
    noInvoice: "0188/INV/REG-EP-06/I/26",
    kodePelTgl: "EP-06 /\n27-29 Januari 2026",
    harga: "Rp17.250.000",
    bayar: 17250000,
    pengiriman: {
      berkas: "Ada",
      ditujukan: "Procurement",
      penerima: "Nurul H.",
      bupot: "Sudah",
    },
  },
];

const PAGE_SIZE = 10;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DaftarInvoicePengirimanPage() {
  const [tanggal, setTanggal] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = DUMMY_DATA.filter(
    (d) =>
      d.instansi.toLowerCase().includes(search.toLowerCase()) ||
      d.noInvoice.toLowerCase().includes(search.toLowerCase()) ||
      d.kodePelTgl.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function pageNumbers() {
    const total = totalPages;
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    for (
      let p = Math.max(2, currentPage - 1);
      p <= Math.min(total - 1, currentPage + 1);
      p++
    )
      pages.push(p);
    if (currentPage < total - 2) pages.push("...");
    pages.push(total);
    return pages;
  }

  function Dash() {
    return <span className="text-zinc-300 select-none">–</span>;
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Keuangan", href: "/keuangan" },
        { label: "Beranda" },
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
                <FileText className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">List UMK</span>
            </div>

            {/* Tanggal */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Tanggal
              </span>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="pl-2.5 pr-2 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white cursor-pointer"
              />
            </div>

            {/* Terapkan */}
            <button
              onClick={() => setCurrentPage(1)}
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
          <table className="w-full min-w-[1000px]">
            <thead>
              {/* Row 1 — group headers */}
              <tr className="bg-zinc-50/60">
                <th
                  className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10"
                  rowSpan={2}
                >
                  No ↕
                </th>
                <th
                  className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40"
                  rowSpan={2}
                >
                  Instansi
                </th>
                <th
                  className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-40"
                  rowSpan={2}
                >
                  No. Invoice
                </th>
                <th
                  className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32"
                  rowSpan={2}
                >
                  Kode. Pel/Tgl
                </th>
                <th
                  className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28"
                  rowSpan={2}
                >
                  Harga
                </th>
                <th
                  className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-16"
                  rowSpan={2}
                >
                  Bayar
                </th>
                {/* Pengiriman group */}
                <th
                  colSpan={4}
                  className="px-3 py-1.5 text-[10px] font-semibold text-zinc-400 text-center border-b border-zinc-100"
                >
                  Pengiriman
                </th>
                <th
                  className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-14"
                  rowSpan={2}
                >
                  Aksi
                </th>
              </tr>

              {/* Row 2 — sub-headers for Pengiriman */}
              <tr className="bg-zinc-50/60 border-b border-zinc-100">
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20">
                  Berkas
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  Ditujukan
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  Penerima
                </th>
                <th className="px-3 py-2 text-[10px] font-semibold text-zinc-400 text-left w-20">
                  Bupot
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
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
                    <td className="px-4 py-3 text-xs text-zinc-700 leading-relaxed">
                      {row.instansi}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600">
                      {row.noInvoice}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 whitespace-pre-line leading-relaxed">
                      {row.kodePelTgl}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-700 font-medium whitespace-nowrap">
                      {row.harga}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600">
                      {row.bayar === 0
                        ? "0"
                        : `Rp${row.bayar.toLocaleString("id-ID")}`}
                    </td>
                    {/* Pengiriman cols */}
                    <td className="px-3 py-3 text-xs text-zinc-600">
                      {row.pengiriman.berkas ?? <Dash />}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600">
                      {row.pengiriman.ditujukan ?? <Dash />}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600">
                      {row.pengiriman.penerima ?? <Dash />}
                    </td>
                    <td className="px-3 py-3 text-xs">
                      {row.pengiriman.bupot === "Sudah" ? (
                        <span className="text-emerald-600 font-semibold">
                          Sudah
                        </span>
                      ) : row.pengiriman.bupot === "Belum" ? (
                        <span className="text-zinc-500">Belum</span>
                      ) : (
                        <Dash />
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <button className="text-xs text-emerald-600 font-semibold hover:underline cursor-pointer">
                        Lihat
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

            {pageNumbers().map((p, idx) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-7 h-7 flex items-center justify-center text-[11px] text-zinc-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p as number)}
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
