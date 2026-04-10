"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { DataTable, ColumnDef } from "@/components/training/Table";

// ---------------------------------------------------------------------------
// Types & Dummy Data
// ---------------------------------------------------------------------------

export interface JadwalTraining {
  id: number;
  noJadwal: string;
  tglMulai: string;
  kode: string;
  jenis: string;
  judulTraining: string;
  biaya: number;
  lokasi: string;
  status: string;
  trainer: string[];
  updOleh: string;
  catatan: string | null;
}

const dummyData: JadwalTraining[] = [
  { id: 1, noJadwal: "2026410", tglMulai: "13 Jul 2026", kode: "WM-01", jenis: "REG", judulTraining: "PPPA", biaya: 5900000, lokasi: "Jakarta/Jakarta", status: "R", trainer: ["HSL", "HSL", "AR"], updOleh: "NANANG", catatan: null },
  { id: 2, noJadwal: "2026410", tglMulai: "13 Jul 2026", kode: "WM-01", jenis: "REG", judulTraining: "PPPA", biaya: 5900000, lokasi: "Jakarta/Jakarta", status: "R", trainer: ["HSL", "HSL", "AR"], updOleh: "NANANG", catatan: null },
  { id: 3, noJadwal: "2026410", tglMulai: "13 Jul 2026", kode: "WM-01", jenis: "REG", judulTraining: "PPPA", biaya: 5900000, lokasi: "Jakarta/Jakarta", status: "R", trainer: ["HSL", "HSL", "AR"], updOleh: "NANANG", catatan: null },
  { id: 4, noJadwal: "2026410", tglMulai: "13 Jul 2026", kode: "WM-01", jenis: "REG", judulTraining: "PPPA", biaya: 5900000, lokasi: "Jakarta/Jakarta", status: "R", trainer: ["HSL", "HSL", "AR"], updOleh: "NANANG", catatan: null },
  { id: 5, noJadwal: "2026411", tglMulai: "20 Jul 2026", kode: "K3-01", jenis: "REG", judulTraining: "Ahli K3 Umum", biaya: 6500000, lokasi: "Bandung/Bandung", status: "R", trainer: ["BW", "SR"], updOleh: "NANANG", catatan: "Peserta min 10" },
  { id: 6, noJadwal: "2026412", tglMulai: "25 Jul 2026", kode: "ENV-01", jenis: "IHT", judulTraining: "ISO 14001:2015", biaya: 4000000, lokasi: "Surabaya/Surabaya", status: "C", trainer: ["DK"], updOleh: "ADMIN", catatan: null },
  { id: 7, noJadwal: "2026413", tglMulai: "01 Agu 2026", kode: "HR-05", jenis: "REG", judulTraining: "Effective Leadership", biaya: 3500000, lokasi: "Jakarta/Jakarta", status: "R", trainer: ["AS", "RN"], updOleh: "NANANG", catatan: null },
];

const PAGE_SIZE = 10;

export default function ManajemenJadwalTrainingPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = dummyData.filter(
    (d) =>
      d.judulTraining.toLowerCase().includes(search.toLowerCase()) ||
      d.noJadwal.includes(search) ||
      d.kode.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const columns: ColumnDef<JadwalTraining>[] = [
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
    { key: "noJadwal", label: "No. Jadwal", sortable: true },
    { key: "tglMulai", label: "Tgl. Mulai", sortable: true },
    { key: "kode", label: "Kode", sortable: true },
    { key: "jenis", label: "Jenis", sortable: true },
    { key: "judulTraining", label: "Judul Training", sortable: true },
    {
      key: "biaya",
      label: "Biaya (Rupiah)",
      sortable: true,
      render: (val) => (
        <span>{(val as number).toLocaleString("id-ID")}</span>
      ),
    },
    { key: "lokasi", label: "Lokasi", sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (val) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 text-zinc-600">
          {val as string}
        </span>
      ),
    },
    {
      key: "trainer",
      label: "Trainer",
      render: (_val, row) => (
        <div className="flex flex-wrap gap-1">
          {row.trainer.map((t, i) => (
            <span key={i} className="inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-600">
              {t}
            </span>
          ))}
        </div>
      ),
    },
    { key: "updOleh", label: "Upd. Oleh", sortable: true },
    {
      key: "catatan",
      label: "Catatan",
      render: (val) => val ? <span>{val as string}</span> : <span className="text-zinc-300">-</span>,
    },
    {
      key: "edit",
      label: "Edit",
      headerClassName: "text-center",
      className: "text-center",
      render: (_val, row) => (
        <button
          onClick={() => router.push(`/training/jadwal/edit/${row.id}`)}
          className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-500 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training" },
        { label: "Manajemen Jadwal Training" },
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
          actionSlot={
            <button
              onClick={() => router.push("/training//jadwal/tambah")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Jadwal Training
            </button>
          }
        />
      </div>
    </AppLayout>
  );
}