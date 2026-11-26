"use client";

import { useState } from "react";
import { useAkun, useAkunMutation } from "@/hooks/use-akun";
import type { AkunItem, JenisAkun } from "@/lib/services/accounting.service";
import type { AkunData, AkunFormValues } from "./components/akun-modal";

const PAGE_SIZE = 10;

interface NotifState {
  message: string;
  type: "success" | "error";
  key: number;
}

export function useAkunManage() {
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState<JenisAkun | "">("");
  const [statusFilter, setStatusFilter] = useState<"" | "true" | "false">("");
  const [page, setPage] = useState(1);
  const { data, pagination, loading, error, refetch } = useAkun({
    page,
    limit: PAGE_SIZE,
  });
  const { loading: isSaving, create, update, toggleStatus } = useAkunMutation();
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<(AkunData & { id: number }) | null>(null);
  const [notif, setNotif] = useState<NotifState | null>(null);

  const showNotif = (message: string, type: NotifState["type"]) => {
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

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
    applyFilters({ page: 1, search: value });
  }

  function handleJenisFilter(value: JenisAkun | "") {
    setJenisFilter(value);
    setPage(1);
    applyFilters({ page: 1, jenis: value });
  }

  function handleStatusFilter(value: "" | "true" | "false") {
    setStatusFilter(value);
    setPage(1);
    applyFilters({ page: 1, isActive: value });
  }

  function handlePageChange(value: number) {
    setPage(value);
    applyFilters({ page: value });
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
      isKasBank: row.isKasBank,
      kategori: row.kategori ?? "",
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditTarget(null);
  }

  async function save(data: AkunFormValues) {
    try {
      const payload = {
        kode: data.kode || undefined,
        nama: data.nama,
        jenis: data.jenis,
        saldoAwal: data.saldoAwal ? Number(data.saldoAwal) : undefined,
        isKasBank: data.isKasBank ?? false,
        kategori: data.kategori || undefined,
      };

      if (editTarget) {
        await update(editTarget.id, payload);
        showNotif("Akun berhasil diperbarui", "success");
      } else {
        await create(payload);
        showNotif("Akun berhasil ditambahkan", "success");
      }

      closeModal();
      applyFilters();
    } catch (error) {
      showNotif(
        error instanceof Error ? error.message : "Gagal menyimpan akun",
        "error",
      );
    }
  }

  async function toggleRowStatus(row: AkunItem) {
    try {
      await toggleStatus(row.id, !row.isActive);
      showNotif(
        row.isActive
          ? `Akun "${row.nama}" berhasil dinonaktifkan`
          : `Akun "${row.nama}" berhasil diaktifkan`,
        "success",
      );
      applyFilters();
    } catch (error) {
      showNotif(
        error instanceof Error ? error.message : "Gagal mengubah status akun",
        "error",
      );
    }
  }

  return {
    data,
    pagination,
    loading,
    error,
    isSaving,
    page,
    search,
    jenisFilter,
    statusFilter,
    modalOpen,
    editTarget,
    notif,
    setNotif,
    handleSearch,
    handleJenisFilter,
    handleStatusFilter,
    handlePageChange,
    openAdd,
    openEdit,
    closeModal,
    save,
    toggleRowStatus,
  };
}
