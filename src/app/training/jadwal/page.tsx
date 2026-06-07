"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { DataTable, ColumnDef } from "@/components/training/Table";
import { useJadwalTrainingList } from "@/hooks/use-jadwal-training";
import { JadwalTrainingListItem } from "@/lib/services/jadwal-training.service";

const PAGE_SIZE = 10;

export default function ManajemenJadwalTrainingPage() {
  const router = useRouter();

  const {
    data,
    meta,
    isLoading,
    search,
    currentPage,
    filterStatus,
    setFilterStatus,
    filterJenis,
    setFilterJenis,
    filterMetode,
    setFilterMetode,
    fetch,
    handleSearch,
    handleTerapkan,
    handlePageChange,
  } = useJadwalTrainingList({ initialLimit: PAGE_SIZE });

  useEffect(() => {
    fetch();
  }, []);

  const columns: ColumnDef<JadwalTrainingListItem>[] = [
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
    {
      key: "tglMulai",
      label: "Tgl. Mulai",
      sortable: true,
      render: (val) =>
        val
          ? new Date(val as string).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "-",
    },
    { key: "kodePelatihan", label: "Kode", sortable: true },
    { key: "jenisTraining", label: "Jenis", sortable: true },
    { key: "judulLengkap", label: "Judul Training", sortable: true },
    {
      key: "biaya",
      label: "Biaya (Rupiah)",
      sortable: true,
      render: (val) => <span>{(val as number).toLocaleString("id-ID")}</span>,
    },
    { key: "lokasiDetail", label: "Lokasi", sortable: true },
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
      key: "trainers",
      label: "Trainer",
      render: (_val, row) => (
        <div className="flex flex-wrap gap-1">
          {row.trainers?.map((t, i) => (
            <span
              key={i}
              className="inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-600"
            >
              {t.trainer.kode}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "pegawai",
      label: "Upd. Oleh",
      sortable: true,
      render: (_val, row) => (
        <div className="flex flex-col">
          <span>{row.pegawai?.nama ?? "-"}</span>
          <span className="text-[10px] text-zinc-400">
            {row.lastUpdate
              ? new Date(row.lastUpdate).toISOString().split("T")[0]
              : "-"}
          </span>
        </div>
      ),
    },
    {
      key: "catatan",
      label: "Catatan",
      render: (val) =>
        val ? (
          <span>{val as string}</span>
        ) : (
          <span className="text-zinc-300">-</span>
        ),
    },
    {
      key: "edit",
      label: "Edit",
      headerClassName: "text-center",
      className: "text-center",
      render: (_val, row) => (
        <button
          onClick={() => router.push(`/training/jadwal/edit/${row.noJadwal}`)}
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
          data={data}
          totalData={meta.total}
          currentPage={currentPage}
          totalPages={meta.totalPages}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
          searchPlaceholder="Cari informasi..."
          searchValue={search}
          onSearchChange={handleSearch}
          isLoading={isLoading}
          actionSlot={
            <button
              onClick={() => router.push("/training/jadwal/tambah")}
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
