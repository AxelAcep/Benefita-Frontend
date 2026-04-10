"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { DataTable, ColumnDef } from "@/components/training/Table";

// ---------------------------------------------------------------------------
// Types & Dummy Data
// ---------------------------------------------------------------------------

interface JudulTraining {
  id: number;
  kode: string;
  judulTraining: string;
  tipe: string;
  hari: number;
  biayaOnline: number;
  biayaOffline: number;
  batch: number;
}

const dummyData: JudulTraining[] = [
  { id: 1, kode: "CSR-01", judulTraining: "Workshop Social Mapping untuk PROPER dan Program CSR Perusahaan", tipe: "CSR", hari: 3, biayaOnline: 5900000, biayaOffline: 7900000, batch: 33 },
  { id: 2, kode: "CSR-02", judulTraining: "Penyusunan Laporan Keberlanjutan (Sustainability Report)", tipe: "CSR", hari: 2, biayaOnline: 4500000, biayaOffline: 6500000, batch: 21 },
  { id: 3, kode: "HR-05", judulTraining: "Effective Leadership & People Management", tipe: "HR", hari: 2, biayaOnline: 3500000, biayaOffline: 5500000, batch: 15 },
  { id: 4, kode: "CSR-02", judulTraining: "Penyusunan Laporan Keberlanjutan (Sustainability Report)", tipe: "CSR", hari: 2, biayaOnline: 4500000, biayaOffline: 6500000, batch: 21 },
  { id: 5, kode: "HR-05", judulTraining: "Effective Leadership & People Management", tipe: "HR", hari: 2, biayaOnline: 3500000, biayaOffline: 5500000, batch: 15 },
  { id: 6, kode: "K3-01", judulTraining: "Ahli K3 Umum Sertifikasi Kemnaker RI", tipe: "K3", hari: 12, biayaOnline: 6500000, biayaOffline: 8500000, batch: 40 },
  { id: 7, kode: "K3-02", judulTraining: "Pelatihan K3 Konstruksi", tipe: "K3", hari: 8, biayaOnline: 5000000, biayaOffline: 7000000, batch: 28 },
  { id: 8, kode: "ENV-01", judulTraining: "Sistem Manajemen Lingkungan ISO 14001:2015", tipe: "ENV", hari: 3, biayaOnline: 4000000, biayaOffline: 6000000, batch: 18 },
  { id: 9, kode: "HR-01", judulTraining: "Pelatihan HR Business Partner", tipe: "HR", hari: 2, biayaOnline: 3800000, biayaOffline: 5800000, batch: 12 },
  { id: 10, kode: "ENV-02", judulTraining: "AMDAL Tipe A - Penyusunan Dokumen Lingkungan", tipe: "ENV", hari: 6, biayaOnline: 7200000, biayaOffline: 9200000, batch: 10 },
  { id: 11, kode: "CSR-03", judulTraining: "Strategi Program CSR Berbasis Komunitas", tipe: "CSR", hari: 2, biayaOnline: 4200000, biayaOffline: 6200000, batch: 16 },
  { id: 12, kode: "K3-03", judulTraining: "Keselamatan Kerja di Ketinggian", tipe: "K3", hari: 3, biayaOnline: 4800000, biayaOffline: 6800000, batch: 22 },
];

const TIPE_OPTIONS = [...new Set(dummyData.map((d) => d.tipe))].sort();
const KODE_OPTIONS = [...new Set(dummyData.map((d) => d.kode))].sort();

const PAGE_SIZE = 10;

function formatRupiah(n: number) {
  return n.toLocaleString("id-ID");
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ManajemenJudulTrainingPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTipe, setFilterTipe] = useState("");
  const [filterKode, setFilterKode] = useState("");
  const [appliedTipe, setAppliedTipe] = useState("");
  const [appliedKode, setAppliedKode] = useState("");

  const handleTerapkan = () => {
    setAppliedTipe(filterTipe);
    setAppliedKode(filterKode);
    setCurrentPage(1);
  };

  const filtered = dummyData.filter((d) => {
    const matchSearch =
      d.judulTraining.toLowerCase().includes(search.toLowerCase()) ||
      d.kode.toLowerCase().includes(search.toLowerCase());
    const matchTipe = appliedTipe ? d.tipe === appliedTipe : true;
    const matchKode = appliedKode ? d.kode === appliedKode : true;
    return matchSearch && matchTipe && matchKode;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const columns: ColumnDef<JudulTraining>[] = [
    {
      key: "no",
      label: "No",
      sortable: true,
      render: (_val, _row, index) => (
        <span className="text-zinc-400 font-medium">
          {(currentPage - 1) * PAGE_SIZE + index + 1}
        </span>
      ),
    },
    {
      key: "kode",
      label: "Kode",
      sortable: true,
    },
    {
      key: "judulTraining",
      label: "Judul Training",
      sortable: true,
      className: "max-w-[300px] whitespace-normal",
    },
    {
      key: "tipe",
      label: "Tipe",
      sortable: true,
    },
    {
      key: "hari",
      label: "Hari",
      sortable: true,
      headerClassName: "text-center",
      className: "text-center",
    },
    {
      key: "biaya",
      label: "Biaya Online / Offline",
      render: (_val, row) => (
        <span className="text-zinc-600">
          {formatRupiah(row.biayaOnline)} / {formatRupiah(row.biayaOffline)}
        </span>
      ),
    },
    {
      key: "batch",
      label: "BATCH",
      headerClassName: "text-center",
      className: "text-center font-semibold text-zinc-700",
    },
    {
      key: "brosur",
      label: "BROSUR",
      headerClassName: "text-center",
      className: "text-center",
      render: (_val, row) => (
        <button
          onClick={() => console.log("download brosur", row.kode)}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 hover:text-emerald-700 transition-colors"
        >
          <Download className="w-3 h-3" />
          download
        </button>
      ),
    },
  ];

  const selectCls =
  "h-9 w-36 pl-2 pr-6 border border-zinc-200 rounded-lg text-xs text-zinc-600 outline-none focus:border-emerald-300 bg-white appearance-none cursor-pointer";

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training" },
        { label: "Manajemen Judul Training" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={paginated}
          totalData={filtered.length}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
          searchPlaceholder="Cari informasi..."
          searchValue={search}
          onSearchChange={handleSearch}
          filterSlot={
            <div className="flex items-center gap-2 flex-wrap">
              {/* Tipe */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-500 font-medium">Tipe</span>
                <div className="relative">
                  <select
                    value={filterTipe}
                    onChange={(e) => setFilterTipe(e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Pilih Tipe</option>
                    {TIPE_OPTIONS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">▾</span>
                </div>
              </div>

              {/* Kode */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-500 font-medium">Kode</span>
                <div className="relative">
                  <select
                    value={filterKode}
                    onChange={(e) => setFilterKode(e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Pilih Kode</option>
                    {KODE_OPTIONS.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">▾</span>
                </div>
              </div>

              <button
                onClick={handleTerapkan}
                className="h-8 px-3 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
              >
                Terapkan
              </button>
            </div>
          }
          actionSlot={
            <button
              onClick={() => console.log("download jadwal")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-emerald-500 text-emerald-500 hover:bg-emerald-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Jadwal Tahun 2026
            </button>
          }
        />
      </div>
    </AppLayout>
  );
}