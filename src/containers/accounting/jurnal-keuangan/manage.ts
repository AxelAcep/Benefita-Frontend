"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { useBoolean } from "@/hooks/use-boolean";
import { useJurnal, useJurnalMutation } from "@/hooks/use-jurnal";
import { useRole } from "@/hooks/use-role";
import { getAkunList, type AkunItem } from "@/lib/services/accounting.service";
import type { JurnalTransaksiItem } from "@/lib/services/jurnal-keuangan.service";

const PAGE_SIZE = 10;

function awalBulanIni() {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10);
}

function hariIni() {
  return new Date().toISOString().slice(0, 10);
}

export function useJurnalKeuanganManage() {
  const { isFinance } = useRole();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(awalBulanIni());
  const [endDate, setEndDate] = useState(hariIni());
  const { data, pagination, loading, error, refetch } = useJurnal({
    page,
    limit: PAGE_SIZE,
    startDate,
    endDate,
  });
  const { loading: saving, create, update } = useJurnalMutation();
  const { value: modalOpen, onTrue: openModal, onFalse: closeModal } = useBoolean(false);
  const [akunList, setAkunList] = useState<AkunItem[]>([]);
  const [notif, setNotif] = useState<{ message: string; type: "success" | "error"; key: number } | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<JurnalTransaksiItem | null>(null);

  function showNotif(message: string, type: "success" | "error") {
    setNotif({ message, type, key: Date.now() });
  }

  useEffect(() => {
    let batal = false;
    getAkunList({ limit: 1000, isActive: true })
      .then((response) => {
        if (!batal) setAkunList(response.data);
      })
      .catch((error) => {
        if (!batal) showNotif(error instanceof Error ? error.message : "Gagal memuat daftar akun", "error");
      });
    return () => {
      batal = true;
    };
  }, []);

  function toggleExpand(id: number) {
    setExpandedId((previous) => (previous === id ? null : id));
  }

  function openEdit(item: JurnalTransaksiItem, event: MouseEvent) {
    event.stopPropagation();
    setEditTarget(item);
    openModal();
  }

  function closeModalAndReset() {
    closeModal();
    setEditTarget(null);
  }

  function onSearch(value: string) {
    setSearch(value);
    setPage(1);
    refetch({ page: 1, search: value || undefined, startDate, endDate });
  }

  function filterDates() {
    setPage(1);
    refetch({ page: 1, search: search || undefined, startDate, endDate });
  }

  function changePage(newPage: number) {
    setPage(newPage);
    refetch({ page: newPage, search: search || undefined, startDate, endDate });
  }

  async function submitJurnal(payload: Parameters<typeof create>[0]) {
    try {
      if (editTarget) {
        await update(editTarget.id, payload);
        showNotif("Jurnal berhasil diperbarui.", "success");
      } else {
        await create(payload);
        showNotif("Jurnal berhasil disimpan.", "success");
      }
      closeModalAndReset();
      setPage(1);
      refetch({ page: 1, search: search || undefined, startDate, endDate });
    } catch (error) {
      showNotif(error instanceof Error ? error.message : "Gagal menyimpan jurnal.", "error");
      throw error;
    }
  }

  function openAdd() {
    setEditTarget(null);
    openModal();
  }

  return {
    isFinance,
    page,
    search,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    data,
    pagination,
    loading,
    error,
    saving,
    modalOpen,
    akunList,
    notif,
    setNotif,
    expandedId,
    editTarget,
    toggleExpand,
    openEdit,
    closeModalAndReset,
    onSearch,
    filterDates,
    changePage,
    submitJurnal,
    openAdd,
  };
}
