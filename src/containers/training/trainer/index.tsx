"use client";

import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import { Pencil, Plus } from "lucide-react";
import type { Trainer } from "@/lib/types/trainer";
import { TrainerDetailModal } from "./components/detail-modal";
import { TrainerForm } from "./form";
import { UKURAN_HALAMAN, useTrainerManage } from "./manage";

const BATAS_TAG = 8;

export default function TrainerContainer() {
  const m = useTrainerManage();

  const columns: ColumnDef<Trainer>[] = [
    {
      key: "no",
      label: "No",
      render: (_v, _row, i) => (
        <span className="text-zinc-400 font-medium">
          {(m.page - 1) * UKURAN_HALAMAN + i + 1}
        </span>
      ),
    },
    { key: "kode", label: "Kode", sortable: true },
    {
      key: "nama",
      label: "Nama",
      sortable: true,
      render: (v) => (
        <span className="font-semibold text-zinc-700">{String(v)}</span>
      ),
    },
    { key: "hp", label: "HP" },
    {
      key: "email",
      label: "Email",
      render: (v) => <span className="text-emerald-600">{String(v)}</span>,
    },
    { key: "kantor", label: "Kantor", sortable: true },
    {
      key: "referensi",
      label: "Referensi",
      className: "max-w-[200px]",
      render: (_v, row) => (
        <div className="flex flex-wrap gap-1">
          {row.referensi.slice(0, BATAS_TAG).map((ref) => (
            <span
              key={ref}
              className="inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold bg-zinc-100 text-zinc-500"
            >
              {ref}
            </span>
          ))}
          {row.referensi.length > BATAS_TAG && (
            <span className="text-[9px] text-zinc-400">
              +{row.referensi.length - BATAS_TAG}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "subyekKhusus",
      label: "Subyek Khusus",
      render: (v) =>
        v ? String(v) : <span className="text-zinc-300">-</span>,
    },
    {
      key: "jumlahHari",
      label: "Jumlah Hari",
      sortable: true,
      headerClassName: "text-center",
      className: "text-center font-semibold text-zinc-700",
      render: (v) => (v === null ? "-" : String(v)),
    },
    {
      key: "statusAktif",
      label: "Status",
      headerClassName: "text-center",
      className: "text-center",
      render: (_v, row) => (
        <span
          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
            row.statusAktif
              ? "bg-emerald-50 text-emerald-600"
              : "bg-zinc-100 text-zinc-500"
          }`}
        >
          {row.statusAktif ? "Aktif" : "Nonaktif"}
        </span>
      ),
    },
    {
      key: "aksi",
      label: "Aksi",
      render: (_v, row) => (
        <div className="flex items-center gap-3 whitespace-nowrap">
          <button
            onClick={() => m.openDetail(row)}
            className="text-[11px] font-semibold text-emerald-500 hover:text-emerald-700 transition-colors"
          >
            Lihat Detail →
          </button>
          <button
            onClick={() => m.openEdit(row)}
            aria-label={`Edit ${row.nama}`}
            title="Edit"
            className="text-zinc-500 hover:text-emerald-600 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout
      breadcrumbs={[{ label: "Training" }, { label: "Manajemen Trainer" }]}
    >
      {m.notif && (
        <Notification
          key={m.notif.key}
          message={m.notif.message}
          type={m.notif.type}
          onClose={m.clearNotif}
        />
      )}

      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={m.data}
          totalData={m.total}
          currentPage={m.page}
          totalPages={m.totalPages}
          pageSize={UKURAN_HALAMAN}
          onPageChange={m.setPage}
          searchPlaceholder="Cari kode, nama, HP, kantor..."
          searchValue={m.search}
          onSearchChange={m.setSearch}
          isLoading={m.loading}
          actionSlot={
            <div className="flex items-center gap-2">
              <select
                value={m.status}
                onChange={(e) => m.setStatus(e.target.value)}
                className="px-2.5 py-2 border border-zinc-200 rounded-xl text-xs text-zinc-600 outline-none focus:border-emerald-300"
              >
                <option value="">Semua Status</option>
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
              </select>
              <button
                onClick={m.openAdd}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Data Trainer
              </button>
            </div>
          }
        />

        <TrainerDetailModal
          open={m.detailOpen}
          onClose={m.closeDetail}
          onEdit={m.detailKeEdit}
          data={m.detail}
          loading={m.detailLoading}
        />

        <TrainerForm
          open={m.formOpen}
          onClose={m.closeForm}
          onSubmit={m.save}
          initialData={m.formValues}
          isLoading={m.isSaving}
        />
      </div>
    </AppLayout>
  );
}
