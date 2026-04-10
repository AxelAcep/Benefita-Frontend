"use client";

import React, { useState } from "react";
import { Pencil, Plus } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { DataTable, ColumnDef } from "@/components/training/Table";
import { PengajuanJudulModal, PengajuanJudulParsed } from "@/components/training/JudulModal";

// ---------------------------------------------------------------------------
// Types & Dummy Data
// ---------------------------------------------------------------------------

export interface PengajuanJudulTraining {
  id: number;
  judulTraining: string;
  jmlHari: number;
  perusahaan: string;
  namaKontak: string;
  kontak: string;
  jmlPeserta: number | null;
  inputBy: string;
  inputDate: string;
  responsMA: string | null;
}

const dummyData: PengajuanJudulTraining[] = [
  { id: 1, judulTraining: "Pelatihan Ahli K3 Umum Sertifikasi Kemnaker RI", jmlHari: 12, perusahaan: "PT Pertamina", namaKontak: "Budi Santoso", kontak: "-", jmlPeserta: 15, inputBy: "Admin CRM", inputDate: "03 Feb 2026", responsMA: null },
  { id: 2, judulTraining: "Sistem Manajemen Lingkungan ISO 14001-2015", jmlHari: 3, perusahaan: "PT Telkom", namaKontak: "Siti Rahma", kontak: "089876543210", jmlPeserta: 8, inputBy: "Sales A", inputDate: "01 Feb 2026", responsMA: null },
  { id: 3, judulTraining: "Proper Hijau & Emas Strategy", jmlHari: 4, perusahaan: "PT PLN", namaKontak: "Agus Salim", kontak: "085612349876", jmlPeserta: 25, inputBy: "Marketing B", inputDate: "28 Jan 2026", responsMA: null },
  { id: 4, judulTraining: "Ahli K3 Umum", jmlHari: 0, perusahaan: "Indolakto Ice Cream, PT - Sukabumi", namaKontak: "Tuti", kontak: "0813-9864-3607", jmlPeserta: null, inputBy: "RFQI", inputDate: "16 Oct 2025", responsMA: null },
  { id: 5, judulTraining: "Pelatihan ISO 45001 Occupational Health & Safety", jmlHari: 2, perusahaan: "PT Unilever Indonesia", namaKontak: "Dewi Kusuma", kontak: "081234567890", jmlPeserta: 20, inputBy: "Sales B", inputDate: "10 Jan 2026", responsMA: "Disetujui" },
  { id: 6, judulTraining: "SMK3 Audit Internal", jmlHari: 5, perusahaan: "PT Astra International", namaKontak: "Hendra Gunawan", kontak: "087765432100", jmlPeserta: 12, inputBy: "Admin CRM", inputDate: "05 Jan 2026", responsMA: null },
  { id: 7, judulTraining: "Pelatihan AMDAL Tipe A", jmlHari: 6, perusahaan: "PT Bukit Asam", namaKontak: "Rini Wulandari", kontak: "082233445566", jmlPeserta: 30, inputBy: "Marketing A", inputDate: "20 Dec 2025", responsMA: "Disetujui" },
  { id: 8, judulTraining: "Keselamatan Kerja di Ketinggian", jmlHari: 3, perusahaan: "PT Waskita Karya", namaKontak: "Fajar Nugroho", kontak: "081122334455", jmlPeserta: 18, inputBy: "Sales A", inputDate: "15 Dec 2025", responsMA: null },
  { id: 9, judulTraining: "Pelatihan P3K di Tempat Kerja", jmlHari: 1, perusahaan: "PT Indofood Sukses Makmur", namaKontak: "Lestari Putri", kontak: "089988776655", jmlPeserta: 40, inputBy: "Admin CRM", inputDate: "10 Dec 2025", responsMA: "Disetujui" },
  { id: 10, judulTraining: "Ahli K3 Konstruksi", jmlHari: 8, perusahaan: "PT Adhi Karya", namaKontak: "Bambang Setiawan", kontak: "082211334466", jmlPeserta: 10, inputBy: "RFQI", inputDate: "01 Dec 2025", responsMA: null },
];

const PAGE_SIZE = 10;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PengajuanJudulTrainingPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PengajuanJudulTraining | null>(null);

  const filtered = dummyData.filter(
    (d) =>
      d.judulTraining.toLowerCase().includes(search.toLowerCase()) ||
      d.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
      d.namaKontak.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleOpenAdd = () => {
    setSelectedItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (item: PengajuanJudulTraining) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const columns: ColumnDef<PengajuanJudulTraining>[] = [
    {
      key: "no",
      label: "No",
      render: (_val, _row, index) => (
        <span className="text-zinc-400 font-medium">
          {(currentPage - 1) * PAGE_SIZE + index + 1}
        </span>
      ),
    },
    {
      key: "judulTraining",
      label: "Judul Training",
      sortable: true,
      className: "max-w-[220px] whitespace-normal",
      render: (val) => (
        <span className="font-semibold text-zinc-700">{val as string}</span>
      ),
    },
    {
      key: "jmlHari",
      label: "Jml Hari",
      sortable: true,
      headerClassName: "text-center",
      className: "text-center",
    },
    {
      key: "perusahaan",
      label: "Perusahaan/Instansi",
      sortable: true,
      className: "max-w-[180px] whitespace-normal",
    },
    {
      key: "namaKontak",
      label: "Nama Kontak",
      sortable: true,
    },
    {
      key: "kontak",
      label: "Kontak",
    },
    {
      key: "jmlPeserta",
      label: "Jml Peserta",
      sortable: true,
      headerClassName: "text-center",
      className: "text-center",
      render: (val) =>
        val != null ? (
          <span>{val as number}</span>
        ) : (
          <span className="text-zinc-300">-</span>
        ),
    },
    {
      key: "inputBy",
      label: "Input By",
      render: (_val, row) => (
        <div>
          <p className="font-semibold text-zinc-700 text-[11px]">{row.inputBy}</p>
          <p className="text-zinc-400 text-[10px]">{row.inputDate}</p>
        </div>
      ),
    },
    {
      key: "responsMA",
      label: "Respons MA",
      render: (val) =>
        val ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600">
            {val as string}
          </span>
        ) : (
          <span className="text-zinc-300">-</span>
        ),
    },
    {
      key: "actions",
      label: "",
      render: (_val, row) => (
        <button
          onClick={() => handleOpenEdit(row)}
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
        { label: "Pengajuan Judul Training" },
      ]}
      subtitle="Hari ini: Jumat, 10 April 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <div className="space-y-4">
      {/* DataTable */}
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
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Pengajuan
          </button>
        }
      />


      <PengajuanJudulModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initialData={selectedItem}
        onSubmit={(data: PengajuanJudulParsed) => {
          console.log("submit", data);
          setModalOpen(false);
        }}
      />
      </div>
    </AppLayout>
  );
}