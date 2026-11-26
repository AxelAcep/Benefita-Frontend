"use client";

import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import { Pencil, Plus } from "lucide-react";
import type { Asesor } from "@/lib/types/asesor";
import { AsesorForm } from "./form";
import { UKURAN_HALAMAN, useAsesorManage } from "./manage";

const teks = (v: unknown) => (v ? String(v) : "-");

export default function AsesorContainer() {
  const m = useAsesorManage();

  const columns: ColumnDef<Asesor>[] = [
    {
      key: "no",
      label: "No",
      render: (_v, _row, i) => (m.page - 1) * UKURAN_HALAMAN + i + 1,
    },
    { key: "nama", label: "Nama Asesor", render: (v) => String(v) },
    { key: "noRegAsesor", label: "No Reg Asesor", render: teks },
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
        { label: "Input Asesor" },
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
        <h1 className="text-lg font-semibold">Input Asesor</h1>
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
        searchPlaceholder="Cari nama atau No Reg Asesor..."
        isLoading={m.loading}
        actionSlot={
          <button
            onClick={m.openAdd}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Data Asesor
          </button>
        }
      />

      <AsesorForm
        open={m.modalOpen}
        onClose={m.closeModal}
        onSubmit={m.save}
        initialData={m.editValues}
        isLoading={m.isSaving}
      />
    </AppLayout>
  );
}
