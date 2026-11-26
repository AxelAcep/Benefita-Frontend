"use client";

import { useState } from "react";
import { useBoolean } from "@/hooks/use-boolean";
import { useBukuBesarRingkasan, useBukuBesarAkun } from "@/hooks/use-buku-besar";
import type { JenisAkun } from "@/lib/services/accounting.service";
import { exportBukuBesarAkunExcel } from "@/lib/services/jurnal-keuangan.service";

function awalBulanIni() {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().slice(0, 10);
}

function hariIni() {
  return new Date().toISOString().slice(0, 10);
}

export function useBukuBesarManage() {
  const [jenisFilter, setJenisFilter] = useState<JenisAkun | "">("");
  const [startDate, setStartDate] = useState(awalBulanIni());
  const [endDate, setEndDate] = useState(hariIni());
  const [search, setSearch] = useState("");
  const { data, loading, error, refetch } = useBukuBesarRingkasan({ startDate, endDate });
  const {
    data: detail,
    loading: detailLoading,
    error: detailError,
    fetchDetail,
    reset: resetDetail,
  } = useBukuBesarAkun();
  const { value: detailOpen, onTrue: onOpenDetail, onFalse: onCloseDetail } = useBoolean(false);
  const { value: exporting, onTrue: onExportingTrue, onFalse: onExportingFalse } = useBoolean(false);
  const [selectedAkunId, setSelectedAkunId] = useState<number | null>(null);
  const [notif, setNotif] = useState<{ message: string; type: "success" | "error"; key: number } | null>(null);

  function onFilterJenis(value: JenisAkun | "") {
    setJenisFilter(value);
    refetch({ jenis: value || undefined, startDate, endDate, search: search || undefined });
  }

  function onFilterTanggal() {
    refetch({ jenis: jenisFilter || undefined, startDate, endDate, search: search || undefined });
  }

  function onSearch(value: string) {
    setSearch(value);
    refetch({ jenis: jenisFilter || undefined, startDate, endDate, search: value || undefined });
  }

  function onRowClick(akunId: number) {
    onOpenDetail();
    setSelectedAkunId(akunId);
    fetchDetail(akunId, { startDate, endDate });
  }

  function onCloseDetailModal() {
    onCloseDetail();
    resetDetail();
    setSelectedAkunId(null);
  }

  async function onExportExcel() {
    if (!selectedAkunId) return;
    onExportingTrue();
    try {
      await exportBukuBesarAkunExcel(selectedAkunId, { startDate, endDate });
    } catch (error) {
      setNotif({
        message: error instanceof Error ? error.message : "Gagal mengunduh Excel",
        type: "error",
        key: Date.now(),
      });
    } finally {
      onExportingFalse();
    }
  }

  return {
    jenisFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    search,
    data,
    loading,
    error,
    detail,
    detailLoading,
    detailError,
    detailOpen,
    exporting,
    notif,
    setNotif,
    onFilterJenis,
    onFilterTanggal,
    onSearch,
    onRowClick,
    onCloseDetailModal,
    onExportExcel,
  };
}
