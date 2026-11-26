"use client";

import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import { Pencil, Plus } from "lucide-react";
import type { TUK } from "@/lib/types/tuk";
import { TUKForm } from "./form";
import { UKURAN_HALAMAN, useTUKManage } from "./manage";

function tanggal(iso: string | null) {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const teks = (v: unknown) => (v ? String(v) : "-");

export default function TUKContainer() {
  const m = useTUKManage();

  const columns: ColumnDef<TUK>[] = [
    {
      key: "no",
      label: "No",
      render: (_v, _row, i) => (m.page - 1) * UKURAN_HALAMAN + i + 1,
    },
    { key: "noSK", label: "No SK", render: (v) => String(v) },
    { key: "noPenetapan", label: "No Penetapan", render: teks },
    { key: "nama", label: "Nama TUK", render: (v) => String(v) },
    { key: "alamat", label: "Alamat", render: (v) => String(v) },
    { key: "telp", label: "Telp", render: teks },
    {
      key: "tglSanggup",
      label: "Tgl Kesanggupan",
      render: (v) => tanggal(v as string | null),
    },
    {
      key: "pegawai",
      label: "Updater",
      render: (_v, row) => row.pegawai?.nama ?? "-",
    },
    {
      key: "edit",
      label: "Edit",
      render: (_v, row) => (
        <button onClick={() => m.openEdit(row)} aria-label={`Edit ${row.nama}`}>
          <Pencil className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training", href: "/training" },
        { label: "Input TUK" },
      ]}
    >
      {m.notif && (
        <Notification
          key={m.notif.key}
          message={m.notif.message}
          type={m.notif.type}
          onClose={m.clearNotif}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Input TUK</h1>
      </div>

      <DataTable
        columns={columns}
        data={m.data}
        totalData={m.total}
        currentPage={m.page}
        totalPages={m.totalPages}
        pageSize={UKURAN_HALAMAN}
        onPageChange={m.setPage}
        searchValue={m.search}
        onSearchChange={m.setSearch}
        searchPlaceholder="Cari nama, No SK, atau alamat..."
        isLoading={m.loading}
        actionSlot={
          <button
            onClick={m.openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Data TUK
          </button>
        }
      />

      <TUKForm
        open={m.modalOpen}
        onClose={m.closeModal}
        onSubmit={m.save}
        initialData={m.editValues}
        isLoading={m.isSaving}
      />
    </AppLayout>
  );
}
