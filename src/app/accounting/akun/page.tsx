"use client";

import React, { useState } from "react";
import { Wallet, Plus, Pencil, Power } from "lucide-react";
import AppLayout from "@/components/app-layout";
import Notification from "@/components/base/notifications";
import { useAkun, useAkunMutation } from "@/hooks/use-akun";
import {
  JENIS_AKUN_OPTIONS,
  type JenisAkun,
  type AkunItem,
} from "@/lib/services/accounting.service";
import { AkunModal, type AkunFormValues, type AkunData } from "@/components/training/AkunModal";

const PAGE_SIZE = 10;

const JENIS_LABEL: Record<JenisAkun, string> = {
  ASET: "Aset",
  LIABILITAS: "Liabilitas",
  MODAL: "Modal",
  PENDAPATAN: "Pendapatan",
  BEBAN: "Beban",
};

const JENIS_BADGE: Record<JenisAkun, string> = {
  ASET: "bg-blue-50 text-blue-600",
  LIABILITAS: "bg-orange-50 text-orange-600",
  MODAL: "bg-purple-50 text-purple-600",
  PENDAPATAN: "bg-emerald-50 text-emerald-600",
  BEBAN: "bg-red-50 text-red-600",
};

function formatRupiah(val: string) {
  const num = Number(val);
  if (isNaN(num)) return "-";
  return `Rp${num.toLocaleString("id-ID")}`;
}

interface NotifState {
  message: string;
  type: "success" | "error";
  key: number;
}

export default function MasterAkunPage() {
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState<JenisAkun | "">("");
  const [statusFilter, setStatusFilter] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);

  const { data, pagination, loading, refetch } = useAkun({
    page,
    limit: PAGE_SIZE,
  });
  const { loading: isSaving, create, update, toggleStatus } = useAkunMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<(AkunData & { id: number }) | null>(
    null,
  );
  const [notif, setNotif] = useState<NotifState | null>(null);

  const showNotif = (message: string, type: "success" | "error") => {
    setNotif({ message, type, key: Date.now() });
  };

  function applyFilters(overrides?: {
    page?: number;
    search?: string;
    jenis?: JenisAkun | "";
    isActive?: "" | "true" | "false";
  }) {
    const p = overrides?.page ?? page;
    const s = overrides?.search ?? search;
    const j = overrides?.jenis ?? jenisFilter;
    const a = overrides?.isActive ?? statusFilter;
    refetch({
      page: p,
      search: s || undefined,
      jenis: j || undefined,
      isActive: a === "" ? undefined : a === "true",
    });
  }

  function handleSearch(v: string) {
    setSearch(v);
    setPage(1);
    applyFilters({ page: 1, search: v });
  }

  function handleJenisFilter(v: JenisAkun | "") {
    setJenisFilter(v);
    setPage(1);
    applyFilters({ page: 1, jenis: v });
  }

  function handleStatusFilter(v: "" | "true" | "false") {
    setStatusFilter(v);
    setPage(1);
    applyFilters({ page: 1, isActive: v });
  }

  function handlePageChange(p: number) {
    setPage(p);
    applyFilters({ page: p });
  }

  function openAdd() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function openEdit(row: AkunItem) {
    setEditTarget({
      id: row.id,
      kode: row.kode ?? "",
      nama: row.nama,
      jenis: row.jenis,
      saldoAwal: row.saldoAwal,
    });
    setModalOpen(true);
  }

  function handleClose() {
    setModalOpen(false);
    setEditTarget(null);
  }

  async function handleSave(data: AkunFormValues) {
    try {
      const payload = {
        kode: data.kode || undefined,
        nama: data.nama,
        jenis: data.jenis,
        saldoAwal: data.saldoAwal ? Number(data.saldoAwal) : undefined,
      };

      if (editTarget) {
        await update(editTarget.id, payload);
        showNotif("Akun berhasil diperbarui", "success");
      } else {
        await create(payload);
        showNotif("Akun berhasil ditambahkan", "success");
      }

      handleClose();
      applyFilters();
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal menyimpan akun",
        "error",
      );
    }
  }

  async function handleToggleStatus(row: AkunItem) {
    try {
      await toggleStatus(row.id, !row.isActive);
      showNotif(
        row.isActive
          ? `Akun "${row.nama}" berhasil dinonaktifkan`
          : `Akun "${row.nama}" berhasil diaktifkan`,
        "success",
      );
      applyFilters();
    } catch (err) {
      showNotif(
        err instanceof Error ? err.message : "Gagal mengubah status akun",
        "error",
      );
    }
  }

  return (
    <AppLayout
      breadcrumbs={[
        { label: "Accounting", href: "/accounting" },
        { label: "Master Akun" },
      ]}
    >
      {notif && (
        <Notification
          key={notif.key}
          message={notif.message}
          type={notif.type}
          onClose={() => setNotif(null)}
        />
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-zinc-100 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <span className="font-bold text-zinc-800 text-sm">Master Akun</span>
          </div>

          <select
            value={jenisFilter}
            onChange={(e) => handleJenisFilter(e.target.value as JenisAkun | "")}
            className="px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white"
          >
            <option value="">Semua Jenis</option>
            {JENIS_AKUN_OPTIONS.map((j) => (
              <option key={j} value={j}>
                {JENIS_LABEL[j]}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              handleStatusFilter(e.target.value as "" | "true" | "false")
            }
            className="px-2.5 py-1.5 border border-zinc-200 rounded-lg text-[11px] text-zinc-600 outline-none focus:border-emerald-300 transition-all bg-white"
          >
            <option value="">Semua Status</option>
            <option value="true">Aktif</option>
            <option value="false">Nonaktif</option>
          </select>

          <div className="relative">
            <svg
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-300"
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama atau kode akun..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-56 pl-7 pr-3 py-1.5 border border-zinc-200 rounded-lg text-xs text-zinc-700 outline-none focus:border-emerald-300 transition-all"
            />
          </div>

          <button
            onClick={openAdd}
            className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            Tambah Akun
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">No</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">Kode</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">Nama Akun</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-28">Jenis</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-right w-36">Saldo Awal</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-20">Status</th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-xs text-zinc-400">
                    Memuat data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-xs text-zinc-400">
                    Tidak ada data tersedia.
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={row.id} className="border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-zinc-400 align-top">
                      {(page - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 align-top whitespace-nowrap">
                      {row.kode ?? <span className="text-zinc-300">-</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700 font-medium align-top">
                      {row.nama}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap ${JENIS_BADGE[row.jenis]}`}
                      >
                        {JENIS_LABEL[row.jenis]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600 text-right align-top whitespace-nowrap">
                      {formatRupiah(row.saldoAwal)}
                    </td>
                    <td className="px-4 py-3 text-center align-top">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          row.isActive
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        {row.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(row)}
                          title="Edit"
                          className="text-zinc-400 hover:text-emerald-600 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(row)}
                          title={row.isActive ? "Nonaktifkan" : "Aktifkan"}
                          className={`transition-colors ${
                            row.isActive
                              ? "text-zinc-400 hover:text-red-500"
                              : "text-zinc-400 hover:text-emerald-600"
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-3 border-t border-zinc-100">
          <p className="text-[11px] text-zinc-400">
            Menampilkan{" "}
            <span className="font-semibold text-zinc-600">
              {pagination.total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
              {Math.min(page * PAGE_SIZE, pagination.total)}
            </span>{" "}
            dari <span className="font-semibold text-zinc-600">{pagination.total}</span> data
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              ‹ Sebelumnya
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-7 h-7 rounded-lg text-[11px] font-semibold transition-colors ${
                    p === page
                      ? "bg-emerald-500 text-white"
                      : "border border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                  }`}
                >
                  {p}
                </button>
              ),
            )}
            <button
              onClick={() => handlePageChange(Math.min(pagination.totalPages, page + 1))}
              disabled={page === pagination.totalPages}
              className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Selanjutnya ›
            </button>
          </div>
        </div>
      </div>

      <AkunModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSave}
        initialData={editTarget}
        isLoading={isSaving}
      />
    </AppLayout>
  );
}
