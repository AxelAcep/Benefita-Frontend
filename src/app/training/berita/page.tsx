"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Newspaper, Plus, Pencil } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { DataTable, ColumnDef } from "@/components/training/Table";
import { useRiwayatBerita } from "@/hooks/use-berita"; // Sesuaikan path hook kamu
import { Berita } from "@/lib/services/berita.service"; // Sesuaikan path service kamu

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------

function StatusBadge({ status }: { status: Berita["status"] }) {
  const isAktif = status === "aktif";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
        isAktif ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
      }`}
    >
      {isAktif ? "Aktif" : "Tidak Aktif"}
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

  // Menggunakan hook riwayat berita untuk mendapatkan seluruh data berita backend (GET ALL)
  const { data: beritaList, loading, error } = useRiwayatBerita();

  // Memformat tampilan tanggal agar konsisten (atau menggunakan string mentah dari backend)
  const formatDate = (dateStr: string) => {
    try {
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
        year: "numeric",
      };
      return new Date(dateStr).toLocaleDateString("id-ID", options);
    } catch {
      return dateStr;
    }
  };

  const filtered = beritaList.filter(
    (d) =>
      d.isi.toLowerCase().includes(search.toLowerCase()) ||
      formatDate(d.periode).toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
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
      render: (val) => <span>{formatDate(val as string)}</span>,
    },
    {
      key: "isi",
      label: "Isi",
      render: (val) => (
        <span className="text-zinc-600 max-w-xl block truncate">
          {val as string}
        </span>
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
          onClick={() =>
            router.push(`/training/berita/edit/${(row as Berita).id}`)
          }
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
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={paginated}
        totalData={filtered.length}
        currentPage={currentPage}
        totalPages={totalPages || 1}
        pageSize={PAGE_SIZE}
        onPageChange={(p) => setCurrentPage(p)}
        searchValue={search}
        onSearchChange={(v) => {
          setSearch(v);
          setCurrentPage(1);
        }}
        searchPlaceholder={loading ? "Memuat data..." : "Cari informasi..."}
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
            <span className="font-bold text-zinc-800 text-sm">
              Manajemen Berita
            </span>
          </div>
        }
      />
    </AppLayout>
  );
}
