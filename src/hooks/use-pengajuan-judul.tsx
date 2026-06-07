// hooks/use-pengajuan-judul.ts

import { useState, useEffect, useCallback } from "react";
import {
  getPengajuan,
  getPengajuanById,
  createPengajuan,
  updatePengajuan,
  type PengajuanListItem,
  type PengajuanJudulTraining,
  type PengajuanPagination,
  type CreatePengajuanRequest,
  type UpdatePengajuanRequest,
} from "@/lib/services/pengajuan-judul-training.service";

// ─────────────────────────────────────────────
// GET LIST
// ─────────────────────────────────────────────

export function usePengajuan() {
  const [data, setData] = useState<PengajuanListItem[]>([]);
  const [pagination, setPagination] = useState<PengajuanPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPengajuan({ page, limit, search });
      setData(res.data);
      setPagination(res.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return {
    data,
    pagination,
    loading,
    error,
    search,
    page,
    limit,
    setPage,
    setLimit,
    handleSearch,
    refresh: fetch,
  };
}

// ─────────────────────────────────────────────
// GET ONE
// ─────────────────────────────────────────────

export function usePengajuanById(id: string | null) {
  const [data, setData] = useState<PengajuanJudulTraining | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      return;
    }
    let cancelled = false;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPengajuanById(id);
        if (!cancelled) setData(res);
      } catch (err: any) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetch();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { data, loading, error };
}

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────

export function useCreatePengajuan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    payload: CreatePengajuanRequest,
    onSuccess?: () => void,
  ) => {
    setLoading(true);
    setError(null);
    try {
      await createPengajuan(payload);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────

export function useUpdatePengajuan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    id: string,
    payload: UpdatePengajuanRequest,
    onSuccess?: () => void,
  ) => {
    setLoading(true);
    setError(null);
    try {
      await updatePengajuan(id, payload);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
}
