"use client";

import { Can } from "@/components/base/can";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import { Pencil, Plus } from "lucide-react";
import {
  LABEL_RESPON_MA,
  WARNA_RESPON_MA,
  type PengajuanListItem,
} from "@/lib/types/pengajuan-judul";
import { PengajuanForm } from "./form";
import { UKURAN_HALAMAN, usePengajuanManage } from "./manage";

function tanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function PengajuanJudulContainer() {
  const m = usePengajuanManage();

  const columns: ColumnDef<PengajuanListItem>[] = [
    {
      key: "no",
      label: "No",
      render: (_v, _row, i) => (
        <span className="text-zinc-400 font-medium">
          {(m.page - 1) * UKURAN_HALAMAN + i + 1}
        </span>
      ),
    },
    {
      key: "judulTraining",
      label: "Judul Training",
      sortable: true,
      className: "max-w-[220px] whitespace-normal",
      render: (v) => (
        <span className="font-semibold text-zinc-700">{String(v)}</span>
      ),
    },
    {
      key: "jumlahHari",
      label: "Jml Hari",
      sortable: true,
      headerClassName: "text-center",
      className: "text-center",
    },
    {
      key: "perusahaan",
      label: "Perusahaan/Instansi",
      sortable: true,
      className: "max-w-[180px] whitespace-normal",
      render: (_v, row) => row.perusahaan ?? "-",
    },
    { key: "namaKontak", label: "Nama Kontak", render: (v) => String(v || "-") },
    { key: "kontak", label: "Kontak", render: (v) => String(v || "-") },
    {
      key: "jumlahPeserta",
      label: "Jml Peserta",
      sortable: true,
      headerClassName: "text-center",
      className: "text-center",
      render: (v) =>
        v != null ? String(v) : <span className="text-zinc-300">-</span>,
    },
    {
      key: "inputOleh",
      label: "Input By",
      render: (_v, row) => (
        <div>
          <p className="font-semibold text-zinc-700 text-[11px]">
            {row.inputOleh?.nama ?? "-"}
          </p>
          <p className="text-zinc-400 text-[10px]">
            {tanggal(row.tanggalPengajuan)}
          </p>
        </div>
      ),
    },
    {
      key: "responMA",
      label: "Respons MA",
      render: (_v, row) => {
        const status = row.responMA || "PENDING";
        return (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              WARNA_RESPON_MA[status] ?? WARNA_RESPON_MA.PENDING
            }`}
          >
            {/* Dulu tabel menampilkan nilai mentah dari backend, sementara
                warnanya memakai label. Sekarang dua-duanya pakai label. */}
            {LABEL_RESPON_MA[status] ?? status}
          </span>
        );
      },
    },
    {
      key: "aksi",
      label: "",
      render: (_v, row) => (
        <Can modul="training" aksi="update">
          <button
            onClick={() => m.openEdit(row)}
            aria-label={`Edit ${row.judulTraining}`}
            title="Edit"
            className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-500 transition-colors"
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
        { label: "Training" },
        { label: "Pengajuan Judul Training" },
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

      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={m.data}
          totalData={m.total}
          currentPage={m.page}
          totalPages={m.totalPages}
          pageSize={UKURAN_HALAMAN}
          onPageChange={m.setPage}
          searchPlaceholder="Cari judul, perusahaan, input by..."
          searchValue={m.search}
          onSearchChange={m.setSearch}
          isLoading={m.loading}
          actionSlot={
            <Can modul="training" aksi="create">
              <button
                onClick={m.openAdd}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Pengajuan
              </button>
            </Can>
          }
        />

        <Can modul="training" aksi={m.isEdit ? "update" : "create"}>
          <PengajuanForm
            open={m.modalOpen}
            onClose={m.closeModal}
            onSubmit={m.save}
            initialData={m.formValues}
            isLoading={m.isSaving || m.detailLoading}
          />
        </Can>
      </div>
    </AppLayout>
  );
}
