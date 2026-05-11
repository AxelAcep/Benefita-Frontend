"use client";

import React, { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import SearchInput from "@/components/base/search-input";
import TableButton from "@/components/base/table-button";
import {
  useGetDailyActivityList,
  useGetOneDailyActivity,
  useCreateDailyActivity,
  useUpdateDailyActivity,
  useDeleteDailyActivity,
} from "@/hooks/use-daily-perusahaan";
import type { DailyActivityItem } from "@/lib/services/perusahaan.service";
import ModalDailyActivity, {
  type DailyActivityFormData,
} from "./perusahaan/(form)/modal-daily";
import Notification from "@/components/base/notifications";
import { getSession } from "@/lib/services/login.service";
// ─────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────

interface TabDailyProps {
  id: string;
}

const PAGE_SIZE = 10;

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

export default function TabDaily({ id }: TabDailyProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // ── Modal state ──
  const [modalMode, setModalMode] = useState<"create" | string | null>(null);
  const isModalOpen = modalMode !== null;
  const isEditMode = modalMode !== null && modalMode !== "create";

  // ── Delete confirmation ──
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    label: string;
  } | null>(null);

  // ── Debounce search ──
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // ── Hooks ──
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useGetDailyActivityList(id, {
    page: currentPage,
    limit: PAGE_SIZE,
    search: debouncedSearch || undefined,
  });

  const { data: editData, isLoading: isLoadingOne } = useGetOneDailyActivity(
    id,
    isEditMode ? modalMode : null,
  );

  const { mutate: create, isLoading: isCreating } = useCreateDailyActivity();
  const { mutate: update, isLoading: isUpdating } = useUpdateDailyActivity();
  const { mutate: remove, isLoading: isDeleting } = useDeleteDailyActivity();

  const isSaving = isCreating || isUpdating;

  const data: DailyActivityItem[] = response?.data ?? [];
  const meta = response?.meta ?? {
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
  };

  // ── Handlers ──
  const handleSearch = (value: string) => setSearch(value);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > meta.totalPages) return;
    setCurrentPage(page);
  };

  const handleTambah = () => setModalMode("create");

  const handleEdit = (activityId: string) => setModalMode(activityId);

  const handleHapus = (activityId: string, label: string) =>
    setDeleteTarget({ id: activityId, label });

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    remove(id, deleteTarget.id, {
      onSuccess: () => {
        setNotification({
          message: `Daily activity berhasil dihapus.`,
          type: "success",
        });
        setDeleteTarget(null);
        refetch();
      },
      onError: (msg) => {
        setNotification({ message: msg, type: "error" });
        setDeleteTarget(null);
      },
    });
  };

  const handleModalClose = () => setModalMode(null);

  const handleModalSubmit = (form: DailyActivityFormData) => {
    const session = getSession();

    if (!session) {
      setNotification({
        message: "Sesi berakhir. Silakan login ulang.",
        type: "error",
      });
      return;
    }

    const payload = {
      pegawaiId: session.user.id, // ← dari session user yang login
      kontak: form.kontak || "",
      jenisTraining: form.jenisTraining || "",
      keterangan: form.keterangan || "",
      kategori: form.kategori || "",
      inout: form.inout || "",
      tanggal: form.tanggal || "",
      perusahaan: id, // ← dari props TabDailyProps.id
      dateTarget: form.dateTarget || null,
    };

    if (isEditMode && modalMode) {
      update(id, modalMode, payload, {
        onSuccess: () => {
          setNotification({
            message: "Daily activity berhasil diperbarui.",
            type: "success",
          });
          setModalMode(null);
          refetch();
        },
        onError: (msg) => {
          setNotification({ message: msg, type: "error" });
        },
      });
    } else {
      create(id, payload, {
        onSuccess: () => {
          setNotification({
            message: "Daily activity berhasil ditambahkan.",
            type: "success",
          });
          setModalMode(null);
          refetch();
        },
        onError: (msg) => {
          setNotification({ message: msg, type: "error" });
        },
      });
    }
  };

  // ── Render page buttons ──
  const renderPageButtons = () => {
    const { totalPages } = meta;
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return pages.map((p, idx) =>
      p === "..." ? (
        <span
          key={`ellipsis-${idx}`}
          className="px-2 text-xs text-zinc-400 select-none"
        >
          ...
        </span>
      ) : (
        <button
          key={p}
          onClick={() => handlePageChange(p)}
          disabled={isLoading}
          className={`px-3 py-1.5 text-[11px] border rounded-lg transition-colors ${
            p === currentPage
              ? "bg-emerald-500 text-white border-emerald-500"
              : "border-zinc-200 text-zinc-500 hover:bg-zinc-50"
          }`}
        >
          {p}
        </button>
      ),
    );
  };

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        {/* ── Toolbar ── */}
        <div className="px-5 py-4 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-3">
          <span className="font-bold text-zinc-800 text-sm flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-emerald-500" />
            Daily Activity
          </span>
          <div className="flex items-center gap-2">
            <SearchInput
              value={search}
              onChange={handleSearch}
              placeholder="Cari kontak, jenis training, kategori..."
            />
            <TableButton icon="plus" onClick={handleTambah}>
              Tambah Data
            </TableButton>
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="px-5 py-3 bg-red-50 border-b border-red-100 text-xs text-red-600 flex items-center justify-between">
            {error}
            <button onClick={refetch} className="underline font-medium">
              Coba lagi
            </button>
          </div>
        )}

        {/* ── Table ── */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60">
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-10">
                  No
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Nama
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Kontak
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Jenis Training
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left">
                  Kategori
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-center w-16">
                  In/Out
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  Tanggal
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-24">
                  Target
                </th>
                <th className="px-4 py-2 text-[10px] font-semibold text-zinc-400 text-left w-32">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-8 text-xs text-zinc-400"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-8 text-xs text-zinc-400"
                  >
                    {debouncedSearch
                      ? `Tidak ada hasil untuk "${debouncedSearch}"`
                      : "Belum ada data daily activity."}
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr
                    key={row.id}
                    className="border-b border-zinc-50 hover:bg-zinc-50/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-zinc-400">
                      {(meta.page - 1) * meta.limit + index + 1}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-700 font-medium">
                      {row.pegawai?.nama || "-"}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.kontak || "-"}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.jenisTraining || "-"}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.kategori || "-"}
                    </td>
                    <td className="px-4 py-3 text-xs text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                          row.inout === "IN"
                            ? "bg-blue-100 text-blue-600"
                            : row.inout === "OUT"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        {row.inout || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.tanggal || "-"}
                    </td>
                    <td className="px-4 py-3 text-xs text-zinc-600">
                      {row.dateTarget
                        ? new Date(row.dateTarget).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(row.id)}
                          className="text-emerald-500 hover:text-emerald-600 hover:underline transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleHapus(
                              row.id,
                              `${row.jenisTraining} - ${row.tanggal}`,
                            )
                          }
                          disabled={isDeleting}
                          className="text-red-400 hover:text-red-500 hover:underline transition-colors disabled:opacity-40"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {meta.total > 0 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-100">
            <p className="text-[11px] text-zinc-400">
              Menampilkan {(meta.page - 1) * meta.limit + 1}–
              {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total}{" "}
              data
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
                className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ‹ Sebelumnya
              </button>
              {renderPageButtons()}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === meta.totalPages || isLoading}
                className="px-3 py-1.5 text-[11px] border border-zinc-200 rounded-lg text-zinc-500 hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Delete Confirmation ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !isDeleting && setDeleteTarget(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-sm font-bold text-zinc-800 mb-2">
              Hapus Daily Activity
            </h3>
            <p className="text-xs text-zinc-500 mb-5">
              Apakah kamu yakin ingin menghapus{" "}
              <span className="font-semibold text-zinc-700">
                {deleteTarget.label}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-zinc-600 bg-zinc-100 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-40"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-40"
              >
                {isDeleting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create / Edit Modal ── */}
      {isModalOpen && (
        <ModalDailyActivity
          data={isEditMode ? (isLoadingOne ? null : (editData ?? null)) : null}
          isLoading={isEditMode && isLoadingOne}
          isSaving={isSaving}
          onClose={handleModalClose}
          onSubmit={handleModalSubmit}
        />
      )}
    </>
  );
}
