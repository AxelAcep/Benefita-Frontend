"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Newspaper, Plus, Pencil } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { DataTable, ColumnDef } from "@/components/training/Table";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Berita {
  id: number;
  periode: string;
  isi: string;
  status: "Aktif" | "Tidak Aktif";
}

// ---------------------------------------------------------------------------
// Dummy data
// ---------------------------------------------------------------------------

const DUMMY_DATA: Berita[] = [
  {
    id: 1,
    periode: "13 Jul 2026",
    isi: "Saya ingin mengingatkan bahwa besok kita akan kembali masuk kerja setelah libur. Pastikan untuk mempersiapkan segala sesuatunya agar bisa me...",
    status: "Aktif",
  },
  {
    id: 2,
    periode: "13 Jul 2026",
    isi: "Mengingatkan besok event tahunan",
    status: "Tidak Aktif",
  },
  {
    id: 3,
    periode: "13 Jul 2026",
    isi: "Besok cuti bersama",
    status: "Tidak Aktif",
  },
  {
    id: 4,
    periode: "13 Jul 2026",
    isi: "Pelatihan dengan kode WM-08 segera dilaksanakan",
    status: "Tidak Aktif",
  },
  {
    id: 5,
    periode: "20 Agu 2026",
    isi: "Reminder pengisian form kebutuhan training Q3 2026 sebelum tanggal 25 Agustus",
    status: "Aktif",
  },
  {
    id: 6,
    periode: "01 Sep 2026",
    isi: "Jadwal sertifikasi K3 Umum periode September sudah dibuka",
    status: "Tidak Aktif",
  },
];

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: Berita["status"] }) {
  const isAktif = status === "Aktif";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
        isAktif
          ? "bg-emerald-50 text-emerald-600"
          : "bg-red-50 text-red-500"
      }`}
    >
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ManajemenBeritaPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const filtered = DUMMY_DATA.filter(
    (d) =>
      d.isi.toLowerCase().includes(search.toLowerCase()) ||
      d.periode.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const columns: ColumnDef<Berita>[] = [
    {
      key: "no",
      label: "No",
      headerClassName: "w-12",
      render: (_val, _row, index) => (
        <span className="text-zinc-400">
          {(currentPage - 1) * PAGE_SIZE + index + 1}
        </span>
      ),
    },
    {
      key: "periode",
      label: "Periode / Batas",
      sortable: true,
      headerClassName: "w-36",
    },
    {
      key: "isi",
      label: "Isi",
      render: (val) => (
        <span className="text-zinc-600 max-w-xl block truncate">{val as string}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      headerClassName: "w-28",
      render: (val) => <StatusBadge status={val as Berita["status"]} />,
    },
    {
      key: "edit",
      label: "Edit",
      headerClassName: "w-16 text-right",
      className: "text-right",
      render: (_val, row) => (
        <button
          onClick={() => router.push(`/training/berita/edit/${(row as Berita).id}`)}
          className="p-1.5 rounded-lg hover:bg-zinc-100 text-emerald-500 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Manajemen Berita" },
      ]}
      subtitle="Hari ini: Selasa, 3 Februari 2026"
      userName="Nanang"
      userRole="Super Admin"
    >
      <DataTable
        columns={columns}
        data={paginated}
        totalData={filtered.length}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={PAGE_SIZE}
        onPageChange={(p) => setCurrentPage(p)}
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setCurrentPage(1);
        }}
        searchPlaceholder="Cari informasi..."
        actionSlot={
          <button
            onClick={() => router.push("/training/berita/tambah")}
            className="flex sm:inline-flex w-full sm:w-auto items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Berita
          </button>
        }
        filterSlot={
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Newspaper className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">Manajemen Berita</span>
          </div>
        }
      />
    </AppLayout>
  );
}