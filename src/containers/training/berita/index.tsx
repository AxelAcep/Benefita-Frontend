"use client";

import { useRouter } from "next/navigation";
import { Newspaper, Pencil, Plus } from "lucide-react";
import { Can } from "@/components/base/can";
import AppLayout from "@/components/app-layout";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import { tanggalBerita, type Berita } from "@/lib/types/berita";
import { UKURAN_HALAMAN, useBeritaManage } from "./manage";

function StatusBadge({ status }: { status: Berita["status"] }) {
  const aktif = status === "aktif";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
        aktif ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
      }`}
    >
      {aktif ? "Aktif" : "Tidak Aktif"}
    </span>
  );
}

export default function BeritaContainer() {
  const router = useRouter();
  const m = useBeritaManage();

  const columns: ColumnDef<Berita>[] = [
    {
      key: "no",
      label: "No",
      headerClassName: "w-12",
      render: (_v, _row, i) => (
        <span className="text-zinc-400">
          {(m.page - 1) * UKURAN_HALAMAN + i + 1}
        </span>
      ),
    },
    {
      key: "periode",
      label: "Periode / Batas",
      sortable: true,
      headerClassName: "w-36",
      render: (v) => tanggalBerita(String(v)),
    },
    {
      key: "isi",
      label: "Isi",
      render: (v) => (
        <span className="text-zinc-600 max-w-xl block truncate">
          {String(v)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      headerClassName: "w-28",
      render: (_v, row) => <StatusBadge status={row.status} />,
    },
    {
      key: "edit",
      label: "Edit",
      headerClassName: "w-16 text-right",
      className: "text-right",
      render: (_v, row) => (
        <Can modul="training" aksi="update">
          <button
            onClick={() => router.push(`/training/berita/edit/${row.id}`)}
            aria-label="Edit berita"
            className="p-1.5 rounded-lg hover:bg-zinc-100 text-emerald-500 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </Can>
      ),
    },
  ];

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Manajemen Berita" },
      ]}
    >
      {m.error && (
        <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-xl text-xs font-semibold">
          {m.error}
        </div>
      )}

      <DataTable
        columns={columns}
        data={m.baris}
        totalData={m.total}
        currentPage={m.page}
        totalPages={m.totalPages}
        pageSize={UKURAN_HALAMAN}
        onPageChange={m.setPage}
        searchValue={m.search}
        onSearchChange={m.setSearch}
        searchPlaceholder="Cari isi atau periode berita..."
        // Dulu keadaan memuat cuma jadi teks placeholder pada kolom cari,
        // jadi tabelnya terlihat kosong seolah tidak ada data.
        isLoading={m.loading}
        actionSlot={
          <Can modul="training" aksi="create">
            <button
              onClick={() => router.push("/training/berita/tambah")}
              className="flex sm:inline-flex w-full sm:w-auto items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              Tambah Berita
            </button>
          </Can>
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
