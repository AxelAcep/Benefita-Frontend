"use client";

import React, { useState } from "react";
import { FileText } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface InvoiceItem {
  id: number;
  noKwitansi: string | null;
  noInvoice: string;
  nama: string;
  instansi: string;
  kodePelTgl: string;
  harga: string;
  bayar: number;
  acc: string;
  status: "B. Bayar" | "Lunas" | "Pending";
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: InvoiceItem[] = [
  {
    id: 1,
    noKwitansi: "0029/KWT/REG-WM-01/V/26",
    noInvoice: "0200/INV/REG-WM-01/V/26",
    nama: "Uus Uswatun Hasanah dan Rahma Safitri",
    instansi: "PT Sucofindo Cabang Semarang",
    kodePelTgl: "WM-01 /\n04-06 Mei 2026",
    harga: "Rp20.000.000",
    bayar: 0,
    acc: "SL",
    status: "B. Bayar",
  },
  {
    id: 2,
    noKwitansi: null,
    noInvoice: "0199/INV/REG-EP-14/VI/26",
    nama: "Destyariani Liana Putri",
    instansi: "Institut Teknologi Kalimantan",
    kodePelTgl: "EP-14 /\n22-25 Juni 2026",
    harga: "Rp15.650.000",
    bayar: 0,
    acc: "SL",
    status: "B. Bayar",
  },
  {
    id: 3,
    noKwitansi: null,
    noInvoice: "0198/INV/REG-WM-07/VI/26",
    nama: "Habib Riziq dan Baihaqi Hafzani",
    instansi: "PT Indo Raya Tenaga",
    kodePelTgl: "WM-07 /\n08-10 Juni 2026",
    harga: "Rp15.000.000",
    bayar: 0,
    acc: "GE",
    status: "Lunas",
  },
  {
    id: 4,
    noKwitansi: null,
    noInvoice: "0196/INV/KON-EP-07/II/26",
    nama: "Dery Vitra Yuniarta",
    instansi: "PT Indonesia Asahan Aluminium",
    kodePelTgl: "EP-07 /\n18-18 Februari 2026",
    harga: "Rp12.000.000",
    bayar: 0,
    acc: "GE",
    status: "B. Bayar",
  },
  {
    id: 5,
    noKwitansi: "0028/KWT/REG-WM-03/IV/26",
    noInvoice: "0195/INV/REG-WM-03/IV/26",
    nama: "Siti Rahmawati",
    instansi: "PT Pertamina EP",
    kodePelTgl: "WM-03 /\n15-17 April 2026",
    harga: "Rp18.500.000",
    bayar: 18500000,
    acc: "NW",
    status: "Lunas",
  },
  {
    id: 6,
    noKwitansi: null,
    noInvoice: "0194/INV/REG-EP-11/IV/26",
    nama: "Rudi Hartono dan Eka Saputra",
    instansi: "PT PLN (Persero) UIP JBT",
    kodePelTgl: "EP-11 /\n22-24 April 2026",
    harga: "Rp22.000.000",
    bayar: 0,
    acc: "EE",
    status: "Pending",
  },
  {
    id: 7,
    noKwitansi: "0027/KWT/REG-WM-05/III/26",
    noInvoice: "0193/INV/REG-WM-05/III/26",
    nama: "Anita Kusuma Dewi",
    instansi: "PT Freeport Indonesia",
    kodePelTgl: "WM-05 /\n10-12 Maret 2026",
    harga: "Rp25.000.000",
    bayar: 25000000,
    acc: "SL",
    status: "Lunas",
  },
  {
    id: 8,
    noKwitansi: null,
    noInvoice: "0192/INV/KON-EP-03/III/26",
    nama: "Budi Santoso",
    instansi: "PT Chevron Pacific Indonesia",
    kodePelTgl: "EP-03 /\n17-19 Maret 2026",
    harga: "Rp14.000.000",
    bayar: 0,
    acc: "GE",
    status: "B. Bayar",
  },
  {
    id: 9,
    noKwitansi: "0026/KWT/REG-WM-02/II/26",
    noInvoice: "0191/INV/REG-WM-02/II/26",
    nama: "Mega Lestari dan Dian Pratiwi",
    instansi: "PT Bukit Asam Tbk",
    kodePelTgl: "WM-02 /\n03-05 Februari 2026",
    harga: "Rp16.500.000",
    bayar: 16500000,
    acc: "NW",
    status: "Lunas",
  },
  {
    id: 10,
    noKwitansi: null,
    noInvoice: "0190/INV/REG-EP-09/II/26",
    nama: "Farhan Maulana",
    instansi: "PT Medco Energi Internasional",
    kodePelTgl: "EP-09 /\n10-12 Februari 2026",
    harga: "Rp13.750.000",
    bayar: 0,
    acc: "EE",
    status: "B. Bayar",
  },
  {
    id: 11,
    noKwitansi: null,
    noInvoice: "0189/INV/KON-WM-08/I/26",
    nama: "Taufik Hidayat",
    instansi: "PT Krakatau Steel Tbk",
    kodePelTgl: "WM-08 /\n20-22 Januari 2026",
    harga: "Rp19.000.000",
    bayar: 0,
    acc: "SL",
    status: "Pending",
  },
  {
    id: 12,
    noKwitansi: "0025/KWT/REG-EP-06/I/26",
    noInvoice: "0188/INV/REG-EP-06/I/26",
    nama: "Nurul Hidayah dan Rina Agustina",
    instansi: "PT Holcim Indonesia Tbk",
    kodePelTgl: "EP-06 /\n27-29 Januari 2026",
    harga: "Rp17.250.000",
    bayar: 17250000,
    acc: "GE",
    status: "Lunas",
  },
];

const STATUS_OPTIONS = ["B. Bayar", "Lunas", "Pending"];
const PAGE_SIZE = 10;

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: InvoiceItem["status"] }) {
  const styles = {
    Lunas: "text-emerald-600 font-semibold",
    "B. Bayar": "text-zinc-600",
    Pending: "text-amber-500 font-medium",
  };
  return <span className={`text-xs ${styles[status]}`}>{status}</span>;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DaftarInvoiceKwitansiPage() {
  const [tanggal, setTanggal] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [appliedTanggal, setAppliedTanggal] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  function handleTerapkan() {
    setAppliedStatus(selectedStatus);
    setAppliedTanggal(tanggal);
    setCurrentPage(1);
  }

  const filtered = DUMMY_DATA.filter((d) => {
    const matchStatus = appliedStatus ? d.status === appliedStatus : true;
    const matchSearch =
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.noInvoice.toLowerCase().includes(search.toLowerCase()) ||
      d.instansi.toLowerCase().includes(search.toLowerCase()) ||
      (d.noKwitansi ?? "").toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // page numbers to show: always show 1, current-1~current+1, last, with ellipsis
  function pageNumbers() {
    const pages: (number | "...")[] = [];
    const total = totalPages;
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    pages.push(1);
    if (currentPage > 3) pages.push("...");
    for (
      let p = Math.max(2, currentPage - 1);
      p <= Math.min(total - 1, currentPage + 1);
      p++
    ) {
      pages.push(p);
    }
    if (currentPage < total - 2) pages.push("...");
    pages.push(total);
    return pages;
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Keuangan", href: "/keuangan" },
        { label: "Daftar Invoice/Kwitansi Non Pelatihan" },
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
              <span className="font-bold text-zinc-800 text-sm">
                Daftar Invoice/Kwitansi Non Pelatihan
              </span>
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

            {/* Status Bayar */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Status Bayar
              </span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-2.5 pr-7 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white appearance-none cursor-pointer"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 6px center",
                }}
              >
                <option value="">Pilih Status</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
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
                <th className="px-4 py-2.5 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No ↕
                </th>
                <th className="px-4 py-2.5 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  No. Kwitansi
                </th>
                <th className="px-3 py-2.5 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  No. Invoice
                </th>
                <th className="px-3 py-2.5 text-[10px] font-semibold text-zinc-400 text-left w-36">
                  Nama
                </th>
                <th className="px-3 py-2.5 text-[10px] font-semibold text-zinc-400 text-left w-40">
                  Instansi
                </th>
                <th className="px-3 py-2.5 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  Kode. Pel/Tgl
                </th>
                <th className="px-3 py-2.5 text-[10px] font-semibold text-zinc-400 text-left w-28">
                  Harga
                </th>
                <th className="px-3 py-2.5 text-[10px] font-semibold text-zinc-400 text-left w-16">
                  Bayar
                </th>
                <th className="px-3 py-2.5 text-[10px] font-semibold text-zinc-400 text-left w-14">
                  ACC
                </th>
                <th className="px-3 py-2.5 text-[10px] font-semibold text-zinc-400 text-left w-20">
                  Status
                </th>
                <th className="px-3 py-2.5 text-[10px] font-semibold text-zinc-400 text-left w-16">
                  Aksi
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
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.noKwitansi ?? (
                        <span className="text-zinc-300">–</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 whitespace-nowrap">
                      {row.noInvoice}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-700 leading-relaxed">
                      {row.nama}
                    </td>
                    <td className="px-3 py-3 text-xs text-zinc-600 leading-relaxed">
                      {row.instansi}
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
                    <td className="px-3 py-3 text-xs text-zinc-600 font-medium">
                      {row.acc}
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-3 py-3">
                      <button className="text-xs text-emerald-600 font-semibold hover:underline cursor-pointer">
                        Update
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
