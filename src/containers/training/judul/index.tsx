"use client";

import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import { DataTable, type ColumnDef } from "@/components/base/data-table";
import { Download, Pencil, Plus, X } from "lucide-react";
import {
  urlBrosur,
  type JudulTrainingListItem,
} from "@/lib/types/judul-training";
import { JudulForm } from "./form";
import { UKURAN_HALAMAN, useJudulManage } from "./manage";

const rupiah = (n: number) => n.toLocaleString("id-ID");

const selectCls =
  "h-9 w-36 pl-2 pr-6 border border-zinc-200 rounded-lg text-xs text-zinc-600 outline-none focus:border-emerald-300 bg-white appearance-none cursor-pointer";

export default function JudulTrainingContainer() {
  const m = useJudulManage();

  const columns: ColumnDef<JudulTrainingListItem>[] = [
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
      key: "judulTraining",
      label: "Judul Training",
      sortable: true,
      className: "max-w-[300px] whitespace-normal",
    },
    { key: "tipe", label: "Tipe", sortable: true },
    {
      key: "hari",
      label: "Hari",
      headerClassName: "text-center",
      className: "text-center",
    },
    {
      key: "biaya",
      label: "Biaya Online / Offline",
      render: (_v, row) => (
        <span className="text-zinc-600">
          {rupiah(row.biayaOnline)} / {rupiah(row.biayaOffline)}
        </span>
      ),
    },
    {
      key: "batch",
      label: "BATCH",
      headerClassName: "text-center",
      className: "text-center font-semibold text-zinc-700",
    },
    {
      key: "brosur",
      label: "BROSUR",
      headerClassName: "text-center",
      className: "text-center",
      render: (_v, row) => {
        const url = urlBrosur(row.brosur);
        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => m.openEdit(row)}
              aria-label={`Edit ${row.kode}`}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-emerald-600 transition-colors"
            >
              <Pencil className="w-3 h-3" />
              edit
            </button>
            {url ? (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 hover:text-emerald-700 transition-colors"
              >
                <Download className="w-3 h-3" />
                download
              </a>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-300 cursor-not-allowed">
                <Download className="w-3 h-3" />
                download
              </span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training" },
        { label: "Manajemen Judul Training" },
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
          searchPlaceholder="Cari judul, kode, tipe..."
          searchValue={m.search}
          onSearchChange={m.setSearch}
          isLoading={m.loading}
          filterSlot={
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-500 font-medium">Tipe</span>
                <div className="relative">
                  <select
                    value={m.draftTipe}
                    onChange={(e) => m.setDraftTipe(e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Pilih Tipe</option>
                    {m.tipeList.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 text-[10px]">
                    ▾
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-500 font-medium">Kode</span>
                <input
                  type="text"
                  placeholder="Ketik kode..."
                  value={m.draftKode}
                  onChange={(e) => m.setDraftKode(e.target.value.toUpperCase())}
                  // Enter juga menerapkan filter, supaya tidak harus
                  // memindahkan tangan ke tombol.
                  onKeyDown={(e) => {
                    if (e.key === "Enter") m.terapkanFilter();
                  }}
                  className="h-9 w-36 pl-2 pr-3 border border-zinc-200 rounded-lg text-xs text-zinc-600 outline-none focus:border-emerald-300 bg-white"
                />
              </div>

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

              <button
                onClick={m.openAdd}
                className="h-8 px-3 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah
              </button>
            </div>
          }
        />
      </div>

      <JudulForm
        open={m.modalOpen}
        onClose={m.closeModal}
        onSubmit={m.save}
        initialData={m.formValues}
        isLoading={m.isSaving}
        tipeList={m.tipeList}
        brosurLama={m.brosurLama}
      />
    </AppLayout>
  );
}
