"use client";

import React, { useEffect } from "react";
import { Download, Plus, Pencil } from "lucide-react";
import AppLayout from "@/components/app-layout";
import { DataTable, ColumnDef } from "@/components/training/Table";
import ModalJudulTraining, {
  JudulTrainingFormData,
  JudulTrainingModalData,
} from "./ModalJudulTraining";
import {
  useJudulTrainingList,
  useJudulTrainingMutation,
} from "@/hooks/use-judul-training";
import { useState } from "react";
import { JudulTrainingListItem } from "@/lib/services/judul-training.service";
import Notification from "@/components/base/notifications";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function formatRupiah(n: number) {
  return n.toLocaleString("id-ID");
}

const PAGE_SIZE = 10;

// ─────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────

export default function ManajemenJudulTrainingPage() {
  // ── List hook ─────────────────────────────
  const {
    data,
    meta,
    isLoading,
    search,
    filterTipe,
    setFilterTipe,
    filterKode,
    setFilterKode,
    currentPage,
    fetch,
    handleSearch,
    handleTerapkan,
    handlePageChange,
  } = useJudulTrainingList({ initialLimit: PAGE_SIZE });

  // ── Modal state ───────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"buat" | "edit">("buat");
  const [modalData, setModalData] = useState<JudulTrainingModalData>({});
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // tambah state ini di dalam component, setelah state modal
  const [notif, setNotif] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  // ── Mutation hook ─────────────────────────
  const {
    isLoading: isSubmitting,
    handleCreate,
    handleUpdate,
  } = useJudulTrainingMutation({
    onSuccess: () => {
      setModalOpen(false);
      setNotif({
        message:
          modalMode === "buat"
            ? "Judul Training berhasil ditambahkan."
            : "Judul Training berhasil diperbarui.",
        type: "success",
      });
      fetch();
    },
    onError: (msg) => {
      setNotif({ message: msg, type: "error" });
    },
  });

  // ── Initial fetch ─────────────────────────
  useEffect(() => {
    fetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Handlers ──────────────────────────────

  const handleOpenCreate = () => {
    setModalMode("buat");
    setModalData({});
    setSelectedId(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (row: JudulTrainingListItem) => {
    setModalMode("edit");
    setModalData({
      id: row.id,
      kode: row.kode,
      judulTraining: row.judulTraining,
      tipe: row.tipe,
      hari: row.hari,
      biayaOffline: row.biayaOffline,
      biayaOnline: row.biayaOnline,
      batch: row.batch,
      brosur: row.brosur ?? null,
    });
    setSelectedId(row.id);
    setModalOpen(true);
  };

  const handleSubmit = async (form: JudulTrainingFormData) => {
    if (modalMode === "buat") {
      await handleCreate(form);
    } else if (selectedId !== null) {
      await handleUpdate(selectedId, form);
    }
  };

  // ── Columns ───────────────────────────────

  const columns: ColumnDef<JudulTrainingListItem>[] = [
    {
      key: "no",
      label: "No",
      render: (_val, _row, index) => (
        <span className="text-zinc-400 font-medium">
          {(currentPage - 1) * PAGE_SIZE + index + 1}
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
      render: (_val, row) => (
        <span className="text-zinc-600">
          {formatRupiah(row.biayaOnline)} / {formatRupiah(row.biayaOffline)}
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
      render: (_val, row) => (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => handleOpenEdit(row)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-zinc-400 hover:text-emerald-600 transition-colors"
          >
            <Pencil className="w-3 h-3" />
            edit
          </button>
          <button
            onClick={() => {
              const url = row.brosur?.startsWith("http")
                ? row.brosur
                : `${process.env.NEXT_PUBLIC_API_URL}/${row.brosur}`;
              window.open(url, "_blank");
            }}
            disabled={!row.brosur}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 hover:text-emerald-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Download className="w-3 h-3" />
            download
          </button>
        </div>
      ),
    },
  ];

  // ── Render ────────────────────────────────

  const selectCls =
    "h-9 w-36 pl-2 pr-6 border border-zinc-200 rounded-lg text-xs text-zinc-600 outline-none focus:border-emerald-300 bg-white appearance-none cursor-pointer";

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Training" },
        { label: "Manajemen Judul Training" },
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
          searchPlaceholder="Cari judul, kode, tipe..."
          searchValue={search}
          onSearchChange={handleSearch}
          isLoading={isLoading}
          filterSlot={
            <div className="flex items-center gap-2 flex-wrap">
              {/* Tipe */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-500 font-medium">Tipe</span>
                <div className="relative">
                  <select
                    value={filterTipe}
                    onChange={(e) => setFilterTipe(e.target.value)}
                    className={selectCls}
                  >
                    <option value="">Pilih Tipe</option>
                    {["CSR", "K3", "HR", "ENV"].map((t) => (
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

              {/* Kode */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-zinc-500 font-medium">Kode</span>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ketik kode..."
                    value={filterKode}
                    onChange={(e) =>
                      setFilterKode(e.target.value.toUpperCase())
                    }
                    className="h-9 w-36 pl-2 pr-3 border border-zinc-200 rounded-lg text-xs text-zinc-600 outline-none focus:border-emerald-300 bg-white"
                  />
                </div>
              </div>

              <button
                onClick={handleTerapkan}
                className="h-8 px-3 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
              >
                Terapkan
              </button>

              <button
                onClick={handleOpenCreate}
                className="h-8 px-3 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors inline-flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah
              </button>
            </div>
          }
          actionSlot={
            <button
              onClick={() => console.log("download jadwal")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-emerald-500 text-emerald-500 hover:bg-emerald-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Jadwal Tahun 2026
            </button>
          }
        />
      </div>

      {notif && (
        <Notification
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif(null)}
        />
      )}

      <ModalJudulTraining
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
        data={modalData}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </AppLayout>
  );
}
