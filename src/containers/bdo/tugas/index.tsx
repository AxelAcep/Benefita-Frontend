"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import { jenisTugas, type Tugas } from "@/lib/types/bdo";
import { TugasForm } from "./form";
import { useTugasManage } from "./manage";

const JUDUL = "Tugas dan Pelaporan";

const formatTanggal = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const tanggal = (nilai: string | null) =>
  nilai ? formatTanggal.format(new Date(nilai)) : "-";

export default function TugasContainer() {
  const m = useTugasManage();

  const columns: ColumnDef<Tugas>[] = [
    {
      key: "no",
      label: "No",
      render: (_v, _row, i) => (m.page - 1) * 10 + i + 1,
    },
    {
      key: "tanggalInput",
      label: "Tanggal",
      render: (_v, row) => tanggal(row.tanggalInput),
    },
    { key: "kegiatan", label: "Kegiatan", className: "whitespace-normal" },
    {
      key: "pic",
      label: "PIC",
      // picNama menyimpan nama mentah data lama, dipakai bila pegawainya
      // tidak ketemu saat migrasi.
      render: (_v, row) => row.pic?.nama ?? row.picNama ?? "-",
    },
    {
      key: "dueDate",
      label: "Tenggat",
      render: (_v, row) => tanggal(row.dueDate),
    },
    {
      key: "penerima",
      label: "Penerima Laporan",
      render: (_v, row) => row.penerima?.nama ?? row.penerimaNama ?? "-",
    },
    {
      key: "jenis",
      label: "Jenis",
      render: (_v, row) => jenisTugas(row),
    },
    {
      key: "status",
      label: "Status",
      render: (_v, row) => (
        <span
          className={
            row.selesai
              ? "rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600"
              : "rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700"
          }
        >
          {row.selesai ? "Selesai" : "Berjalan"}
        </span>
      ),
    },
    {
      key: "aksi",
      label: "Aksi",
      render: (_v, row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Edit ${row.kegiatan}`}
            title="Edit"
            onClick={() => m.openForm(row)}
            className="text-zinc-500 hover:text-emerald-600"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label={`Hapus ${row.kegiatan}`}
            title="Hapus"
            onClick={() => {
              if (confirm(`Hapus tugas "${row.kegiatan}"?`)) m.remove?.(row.id);
            }}
            className="text-zinc-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "BDO" }, { label: JUDUL }]}>
      <div className="mb-4">
        <h1 className="text-lg font-semibold">{JUDUL}</h1>
        <p className="text-sm text-zinc-500">
          Tugas yang masih berjalan juga muncul sebagai pengingat di dashboard.
        </p>
      </div>

      {m.error ? <p className="mb-3 text-sm text-red-600">{m.error}</p> : null}

      <DataTable
        columns={columns}
        data={m.data}
        isLoading={m.loading}
        totalData={m.total}
        currentPage={m.page}
        totalPages={m.totalPages}
        pageSize={10}
        onPageChange={m.setPage}
        searchValue={m.search}
        onSearchChange={m.setSearch}
        searchPlaceholder="Cari kegiatan, PIC, atau penerima..."
        actionSlot={
          <button
            type="button"
            onClick={() => m.openForm(null)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah
          </button>
        }
      />

      <TugasForm
        open={m.modalOpen}
        initialData={m.formValues}
        onClose={m.closeForm}
        onSave={m.save}
      />
    </AppLayout>
  );
}
