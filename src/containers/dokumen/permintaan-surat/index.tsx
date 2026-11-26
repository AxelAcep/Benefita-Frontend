"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import AppLayout from "@/components/app-layout";
import ConfirmModal from "@/components/base/confirm-modal";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import Notification from "@/components/base/notifications";
import type { PermintaanNomorSurat, TipeSurat } from "@/lib/types/surat";
import { SuratForm } from "./form";
import { useSuratManage } from "./manage";

const LABEL_TIPE: Record<TipeSurat, string> = {
  umum: "Umum",
  marketing: "Marketing",
  lsp: "LSP",
};

export default function PermintaanSuratContainer({ tipe }: { tipe: TipeSurat }) {
  const m = useSuratManage(tipe);
  const judul = `Permintaan Nomor Surat (${LABEL_TIPE[tipe]})`;

  const columns: ColumnDef<PermintaanNomorSurat>[] = [
    { key: "no", label: "No", render: (_value, _row, i) => (m.page - 1) * m.limit + i + 1 },
    { key: "noSurat", label: "No. Surat", className: "font-medium" },
    { key: "keterangan", label: "Keterangan", className: "whitespace-normal" },
    {
      key: "tujuan",
      label: "Tujuan",
      render: (_value, row) => row.tujuan?.company || row.tujuanNoInduk || "-",
    },
    {
      key: "tanggalKirim",
      label: "Tgl. Kirim",
      render: (_value, row) => new Date(row.tanggalKirim).toLocaleDateString("id-ID"),
    },
    { key: "pengirim", label: "Pengirim", render: (_value, row) => row.pengirim?.nama ?? "-" },
    {
      key: "aksi",
      label: "Aksi",
      render: (_value, row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={`Edit ${row.noSurat}`}
            title="Edit"
            onClick={() => m.openForm(row)}
            className="text-zinc-500 hover:text-emerald-600"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label={`Hapus ${row.noSurat}`}
            title="Hapus"
            onClick={() => m.askDelete(row)}
            className="text-zinc-500 hover:text-red-600"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: "Dokumen" }, { label: judul }]}>
      <h1 className="mb-4 text-lg font-semibold">{judul}</h1>

      {m.notif && (
        <Notification
          key={m.notif.key}
          message={m.notif.message}
          type={m.notif.type}
          onClose={m.clearNotif}
        />
      )}

      {m.error && (
        <div role="alert" className="mb-4 flex items-center gap-3 text-sm text-red-700">
          <p>{m.error}</p>
          <button type="button" className="font-semibold underline" onClick={m.refetch}>
            Coba lagi
          </button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={m.error ? [] : m.data}
        totalData={m.error ? 0 : m.total}
        currentPage={m.page}
        totalPages={m.totalPages}
        pageSize={m.limit}
        onPageChange={m.setPage}
        searchValue={m.search}
        onSearchChange={m.setSearch}
        searchPlaceholder="Cari no surat, pengirim, perusahaan..."
        isLoading={m.loading}
        emptyMessage={m.error ? "Data gagal dimuat." : undefined}
        actionSlot={
          <button
            type="button"
            onClick={() => m.openForm(null)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Buat Permintaan
          </button>
        }
      />

      <SuratForm
        open={m.modalOpen}
        onClose={m.closeForm}
        onSubmit={m.save}
        initialData={m.formValues}
        isLoading={m.isSaving}
        error={m.saveError}
      />

      <ConfirmModal
        isOpen={!!m.hapusTarget}
        title="Hapus Permintaan Nomor Surat"
        message={`Permintaan surat ${m.namaHapus} akan dihapus permanen.`}
        onConfirm={m.confirmDelete}
        onCancel={m.cancelDelete}
        loading={m.isDeleting}
      />
    </AppLayout>
  );
}
