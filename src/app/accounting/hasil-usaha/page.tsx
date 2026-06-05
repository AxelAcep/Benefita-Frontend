"use client";

import React, { useState } from "react";
import { BarChart3 } from "lucide-react";
import AppLayout from "@/components/app-layout";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RowType = "section-header" | "total" | "group-header" | "item";

interface LaporanRow {
  id: string;
  type: RowType;
  kode?: string;
  keterangan: string;
  anggaran?: string | null;
  realisasi?: string | null;
  bold?: boolean;
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_ROWS: LaporanRow[] = [
  // ── PENDAPATAN ──────────────────────────────────────────────────────────
  {
    id: "total-pendapatan",
    type: "total",
    keterangan: "TOTAL PENDAPATAN",
    anggaran: null,
    realisasi: "Rp282.700.000",
  },

  // ── Biaya Tenaga Kerja Langsung ─────────────────────────────────────────
  {
    id: "grp-biaya-tk",
    type: "group-header",
    keterangan: "Biaya Tenaga Kerja Langsung",
  },
  {
    id: "wm-01",
    type: "item",
    kode: "WM-01",
    keterangan: "Pelatihan PPPA",
    anggaran: "-",
    realisasi: "Rp122.300.000",
  },
  {
    id: "wm-07",
    type: "item",
    kode: "WM-07",
    keterangan: "Pelatihan POPAL",
    anggaran: "-",
    realisasi: "Rp36.900.000",
  },

  // ── TOTAL BIAYA ─────────────────────────────────────────────────────────
  {
    id: "total-biaya",
    type: "total",
    keterangan: "TOTAL BIAYA",
    anggaran: null,
    realisasi: "Rp282.700.000",
  },

  // ── Biaya Operasi Langsung ──────────────────────────────────────────────
  {
    id: "b01",
    type: "item",
    kode: "B01",
    keterangan: "BIAYA OPERASI LANGSUNG",
    anggaran: "-",
    realisasi: "-",
    bold: true,
  },
  {
    id: "b011",
    type: "item",
    kode: "B011",
    keterangan: "Pembuatan Materi Pelatihan",
    anggaran: "-",
    realisasi: "-",
  },
  {
    id: "b012",
    type: "item",
    kode: "B012",
    keterangan: "Penggandaan Materi",
    anggaran: "-",
    realisasi: "-",
  },
  {
    id: "b013",
    type: "item",
    kode: "B013",
    keterangan: "Sewa Ruang & Fasilitas",
    anggaran: "-",
    realisasi: "-",
  },
  {
    id: "b014",
    type: "item",
    kode: "B014",
    keterangan: "Konsumsi Peserta",
    anggaran: "Rp12.000.000",
    realisasi: "Rp11.500.000",
  },
  {
    id: "b015",
    type: "item",
    kode: "B015",
    keterangan: "Transportasi & Akomodasi",
    anggaran: "Rp8.500.000",
    realisasi: "Rp7.200.000",
  },

  // ── Biaya Tenaga Ahli ───────────────────────────────────────────────────
  {
    id: "b02",
    type: "item",
    kode: "B02",
    keterangan: "BIAYA TENAGA AHLI",
    anggaran: "-",
    realisasi: "-",
    bold: true,
  },
  {
    id: "b021",
    type: "item",
    kode: "B021",
    keterangan: "Honorarium Trainer Internal",
    anggaran: "Rp24.000.000",
    realisasi: "Rp24.000.000",
  },
  {
    id: "b022",
    type: "item",
    kode: "B022",
    keterangan: "Honorarium Trainer Eksternal",
    anggaran: "Rp15.000.000",
    realisasi: "Rp15.000.000",
  },
  {
    id: "b023",
    type: "item",
    kode: "B023",
    keterangan: "Honorarium Asesor",
    anggaran: "Rp18.000.000",
    realisasi: "Rp17.500.000",
  },

  // ── Biaya Administrasi ──────────────────────────────────────────────────
  {
    id: "b03",
    type: "item",
    kode: "B03",
    keterangan: "BIAYA ADMINISTRASI",
    anggaran: "-",
    realisasi: "-",
    bold: true,
  },
  {
    id: "b031",
    type: "item",
    kode: "B031",
    keterangan: "Biaya ATK & Percetakan",
    anggaran: "Rp2.500.000",
    realisasi: "Rp2.300.000",
  },
  {
    id: "b032",
    type: "item",
    kode: "B032",
    keterangan: "Biaya Komunikasi",
    anggaran: "Rp1.800.000",
    realisasi: "Rp1.650.000",
  },
  {
    id: "b033",
    type: "item",
    kode: "B033",
    keterangan: "Biaya Pemasaran",
    anggaran: "Rp5.000.000",
    realisasi: "Rp4.750.000",
  },

  // ── LABA / RUGI ─────────────────────────────────────────────────────────
  {
    id: "total-laba",
    type: "total",
    keterangan: "LABA / RUGI",
    anggaran: null,
    realisasi: "Rp159.800.000",
  },
];

// ---------------------------------------------------------------------------
// Row renderer
// ---------------------------------------------------------------------------

function renderRow(row: LaporanRow) {
  if (row.type === "total") {
    return (
      <tr key={row.id} className="bg-zinc-100/80">
        <td className="px-5 py-3 text-xs font-bold text-zinc-700 w-44">
          {row.kode ?? ""}
        </td>
        <td className="px-5 py-3 text-xs font-bold text-zinc-700">
          {row.keterangan}
        </td>
        <td className="px-5 py-3 text-xs font-bold text-zinc-500 w-52">
          {row.anggaran ?? ""}
        </td>
        <td className="px-5 py-3 text-xs font-bold text-zinc-800 w-52">
          {row.realisasi ?? ""}
        </td>
      </tr>
    );
  }

  if (row.type === "group-header") {
    return (
      <tr key={row.id} className="bg-white border-t border-zinc-100">
        <td className="px-5 py-2.5 text-xs font-semibold text-zinc-600 w-44" />
        <td
          colSpan={3}
          className="px-5 py-2.5 text-xs font-semibold text-zinc-600"
        >
          {row.keterangan}
        </td>
      </tr>
    );
  }

  // item
  return (
    <tr
      key={row.id}
      className="border-t border-zinc-100 hover:bg-zinc-50/50 transition-colors"
    >
      <td
        className={`px-5 py-3 text-xs w-44 ${row.bold ? "font-bold text-zinc-700" : "text-zinc-500"}`}
      >
        {row.kode ?? ""}
      </td>
      <td
        className={`px-5 py-3 text-xs ${row.bold ? "font-bold text-zinc-700" : "text-zinc-600"}`}
      >
        {row.keterangan}
      </td>
      <td
        className={`px-5 py-3 text-xs w-52 ${row.bold ? "font-bold text-zinc-500" : "text-zinc-400"}`}
      >
        {row.anggaran ?? ""}
      </td>
      <td
        className={`px-5 py-3 text-xs w-52 ${row.bold ? "font-bold text-zinc-700" : "text-zinc-600"}`}
      >
        {row.realisasi ?? ""}
      </td>
    </tr>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LaporanHasilUsahaPage() {
  const [tanggal, setTanggal] = useState("");
  const [applied, setApplied] = useState(false);

  function handleTerapkan() {
    setApplied(true);
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Laporan", href: "/laporan" },
        { label: "Laporan Hasil Usaha" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100">
          <div className="flex flex-wrap items-center gap-3">
            {/* Title */}
            <div className="flex items-center gap-2 mr-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="font-bold text-zinc-800 text-sm">
                Laporan Hasil Usaha
              </span>
            </div>

            {/* Date filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-zinc-500 font-medium">
                Tanggal
              </span>
              <div className="relative">
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  placeholder="Pilih Tanggal"
                  className="pl-2.5 pr-8 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white cursor-pointer appearance-none"
                />
              </div>
            </div>

            {/* Terapkan */}
            <button
              onClick={handleTerapkan}
              className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-semibold rounded-lg transition-colors"
            >
              Terapkan
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            {/* Column headers */}
            <thead>
              <tr className="border-b border-zinc-100">
                <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 text-left w-44">
                  Kode
                </th>
                <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 text-left">
                  Keterangan
                </th>
                <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 text-left w-52">
                  Anggaran
                </th>
                <th className="px-5 py-3 text-[11px] font-semibold text-zinc-400 text-left w-52">
                  Realisasi
                </th>
              </tr>
            </thead>

            <tbody>{DUMMY_ROWS.map(renderRow)}</tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
