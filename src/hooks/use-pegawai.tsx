"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getListPegawai,
  getPegawaiById,
  createPegawai,
  updatePegawai,
  deletePegawai,
  resetPassword,
  resetDevice,
  deleteDokumen,
  Pegawai,
  PegawaiListItem,
  PegawaiPagination,
  CreatePegawaiRequest,
  UpdatePegawaiRequest,
} from "@/lib/services/pegawai.service";

// ─────────────────────────────────────────────
// LIST + PAGINATION + SEARCH
// ─────────────────────────────────────────────
export function usePegawaiList() {
  const [data, setData] = useState<PegawaiListItem[]>([]);
  const [meta, setMeta] = useState<PegawaiPagination | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 10;

  const fetch = useCallback(async (page: number, q: string) => {
    setIsLoading(true);
    try {
      const res = await getListPegawai({ page, limit: pageSize, search: q });
      setData(res.data);
      setMeta(res.meta);
    } catch (_) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetch(currentPage, search), 300);
    return () => clearTimeout(timeout);
  }, [currentPage, search, fetch]);

  function onPageChange(page: number) {
    setCurrentPage(page);
  }

  function onSearchChange(val: string) {
    setSearch(val);
    setCurrentPage(1);
  }

  function refetch() {
    fetch(currentPage, search);
  }

  return {
    data,
    isLoading,
    currentPage,
    totalPages: meta?.totalPage ?? 1,
    totalData: meta?.total ?? 0,
    pageSize,
    search,
    onPageChange,
    onSearchChange,
    refetch,
  };
}

// ─────────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────────
export function usePegawaiActions(refetch: () => void) {
  const [isSaving, setIsSaving] = useState(false);

  async function onGetDetail(id: string): Promise<Pegawai> {
    return await getPegawaiById(id);
  }

  async function onCreatePegawai(payload: CreatePegawaiRequest): Promise<void> {
    setIsSaving(true);
    try {
      await createPegawai(payload);
      refetch();
    } finally {
      setIsSaving(false);
    }
  }

  async function onUpdatePegawai(
    id: string,
    payload: UpdatePegawaiRequest,
  ): Promise<void> {
    setIsSaving(true);
    try {
      await updatePegawai(id, payload);
      refetch();
    } finally {
      setIsSaving(false);
    }
  }

  async function onDeletePegawai(id: string): Promise<void> {
    await deletePegawai(id);
    refetch();
  }

  async function onResetPassword(
    id: string,
    newPassword: string,
  ): Promise<void> {
    setIsSaving(true);
    try {
      await resetPassword(id, newPassword);
    } finally {
      setIsSaving(false);
    }
  }

  async function onResetDevice(id: string): Promise<void> {
    await resetDevice(id);
  }

  async function onDeleteDokumen(dokumenId: string): Promise<void> {
    await deleteDokumen(dokumenId);
  }

  return {
    isSaving,
    onGetDetail,
    onCreatePegawai,
    onUpdatePegawai,
    onDeletePegawai,
    onResetPassword,
    onResetDevice,
    onDeleteDokumen,
  };
}
