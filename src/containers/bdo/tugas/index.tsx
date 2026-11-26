"use client";

import { Pencil, Plus } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import type { TugasPelaporan } from "./data";
import { TugasForm } from "./form";
import { useTugasManage } from "./manage";

const JUDUL = "Tugas dan Pelaporan";
const formatTanggal = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export default function TugasContainer() {
  const m = useTugasManage();
  const columns: ColumnDef<TugasPelaporan>[] = [
    {
      key: "no",
      label: "No",
      render: (_value, _row, i) => (m.page - 1) * m.pageSize + i + 1,
    },
    {
      key: "tanggal",
      label: "Tanggal",
      render: (_value, row) => formatTanggal.format(new Date(row.tanggal)),
    },
    { key: "kegiatan", label: "Kegiatan", className: "whitespace-normal" },
    { key: "pic", label: "PIC" },
    {
      key: "dueDate",
      label: "Tenggat",
      render: (_value, row) => row.dueDate ? formatTanggal.format(new Date(row.dueDate)) : "-",
    },
    { key: "penerimaLaporan", label: "Penerima Laporan" },
    { key: "status", label: "Status" },
    {
      key: "aksi",
      label: "Aksi",
      render: (_value, row) => (
        <button
          type="button"
          aria-label={`Edit ${row.kegiatan}`}
          title="Edit"
          onClick={() => m.openForm(row)}
          className="text-zinc-500 hover:text-emerald-600"
        >
          <Pencil className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "BDO" }, { label: JUDUL }]}>
      <div className="mb-4">
        <h1 className="text-lg font-semibold">{JUDUL}</h1>
        <p className="text-sm text-zinc-500">Ini data contoh. Perubahan hilang saat halaman dimuat ulang.</p>
      </div>
      <DataTable
        columns={columns}
        data={m.data}
        totalData={m.total}
        currentPage={m.page}
        totalPages={m.totalPages}
        pageSize={m.pageSize}
        onPageChange={m.setPage}
        searchValue={m.search}
        onSearchChange={m.changeSearch}
        searchPlaceholder="Cari kegiatan, PIC, atau status..."
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
