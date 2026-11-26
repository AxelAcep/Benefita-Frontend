"use client";

import { useRouter } from "next/navigation";
import { Pencil, Plus, X } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import type { JadwalTrainingListItem } from "@/lib/types/jadwal-training";
import { UKURAN_HALAMAN, useJadwalManage } from "./manage";

const selectCls =
  "h-9 pl-2 pr-6 border border-zinc-200 rounded-lg text-xs text-zinc-600 outline-none focus:border-emerald-300 bg-white cursor-pointer";

function tanggal(iso: string | null) {
  if (!iso) return <span className="text-zinc-300">-</span>;
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function JadwalTrainingContainer() {
  const router = useRouter();
  const m = useJadwalManage();

  const columns: ColumnDef<JadwalTrainingListItem>[] = [
    {
      key: "no",
      label: "No",
      render: (_v, _row, i) => (
        <span className="text-zinc-400 font-medium">
          {(m.page - 1) * UKURAN_HALAMAN + i + 1}
        </span>
      ),
    },
    { key: "noJadwal", label: "No. Jadwal", sortable: true },
    {
      key: "tglMulai",
      label: "Tgl. Mulai",
      sortable: true,
      render: (v) => tanggal(v as string | null),
    },
    { key: "kodePelatihan", label: "Kode", sortable: true },
    { key: "jenisTraining", label: "Jenis", sortable: true },
    { key: "judulLengkap", label: "Judul Training", sortable: true },
    {
      key: "biaya",
      label: "Biaya (Rupiah)",
      sortable: true,
      render: (v) => (typeof v === "number" ? v.toLocaleString("id-ID") : "-"),
    },
    { key: "lokasiDetail", label: "Lokasi", sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (v) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-100 text-zinc-600">
          {String(v)}
        </span>
      ),
    },
    {
      key: "trainers",
      label: "Trainer",
      render: (_v, row) => (
        <div className="flex flex-wrap gap-1">
          {(row.trainers ?? []).map((t) => (
            <span
              key={t.trainer.kode}
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
      render: (_v, row) => (
        <div className="flex flex-col">
          <span>{row.pegawai?.nama ?? "-"}</span>
          <span className="text-[10px] text-zinc-400">
            {/* Dulu memakai toISOString(), yang selalu UTC dan bisa
                menggeser tanggal satu hari bagi pembaca di WIB. */}
            {row.lastUpdate
              ? new Date(row.lastUpdate).toLocaleDateString("id-ID")
              : "-"}
          </span>
        </div>
      ),
    },
    {
      key: "catatan",
      label: "Catatan",
      render: (v) => (v ? String(v) : <span className="text-zinc-300">-</span>),
    },
    {
      key: "edit",
      label: "Edit",
      headerClassName: "text-center",
      className: "text-center",
      render: (_v, row) => (
        <button
          onClick={() => router.push(`/training/jadwal/edit/${row.noJadwal}`)}
          aria-label={`Edit jadwal ${row.noJadwal}`}
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
    >
      <div className="space-y-4">
        <DataTable
          columns={columns}
          data={m.data}
          totalData={m.total}
          currentPage={m.page}
          totalPages={m.totalPages}
          pageSize={UKURAN_HALAMAN}
          onPageChange={m.setPage}
          searchPlaceholder="Cari no jadwal, judul, lokasi..."
          searchValue={m.search}
          onSearchChange={m.setSearch}
          isLoading={m.loading}
          filterSlot={
            // Tiga filter ini sudah lama ada di hook tapi tidak pernah
            // dirender, jadi tidak pernah bisa dipakai dari layar.
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={m.draftStatus}
                onChange={(e) => m.setDraftStatus(e.target.value)}
                className={selectCls}
                aria-label="Filter status"
              >
                <option value="">Semua Status</option>
                {m.opsi.status.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                value={m.draftJenis}
                onChange={(e) => m.setDraftJenis(e.target.value)}
                className={selectCls}
                aria-label="Filter jenis training"
              >
                <option value="">Semua Jenis</option>
                {m.opsi.jenisTraining.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                value={m.draftMetode}
                onChange={(e) => m.setDraftMetode(e.target.value)}
                className={selectCls}
                aria-label="Filter metode"
              >
                <option value="">Semua Metode</option>
                {m.opsi.metode.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button
                onClick={m.terapkanFilter}
                className="h-8 px-3 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
              >
                Terapkan
              </button>

              {m.adaFilter && (
                <button
                  onClick={m.resetFilter}
                  className="h-8 px-3 rounded-lg text-xs font-semibold border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors inline-flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>
          }
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
