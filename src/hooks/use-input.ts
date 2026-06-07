// hooks/use-input.ts

import { useState, useCallback } from "react";
import {
  getPesertaTraining,
  getPesertaTrainingById,
  createPesertaTraining,
  updatePesertaTraining,
  type PesertaTrainingListItem,
  type PesertaTraining,
  type PesertaTrainingPagination,
  type CreatePesertaTrainingRequest,
  type UpdatePesertaTrainingRequest,
  type JadwalSummary, // ✅ tambah import ini
} from "@/lib/services/input.service";

// Re-export agar page.tsx bisa import dari hooks saja
export type { JadwalSummary }; // ✅ tambah ini

// ─────────────────────────────────────────────
// LIST HOOK
// ─────────────────────────────────────────────

export function usePesertaTrainingList(noJadwal: string) {
  const [data, setData] = useState<PesertaTrainingListItem[]>([]);
  const [meta, setMeta] = useState<PesertaTrainingPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [jadwal, setJadwal] = useState<JadwalSummary | null>(null); // ✅ sudah ada, pastikan type-nya benar

  const fetch = useCallback(
    async (params?: { page?: number; search?: string; status?: string }) => {
      if (!noJadwal) return;
      setIsLoading(true);
      setError(null);
      try {
        const res = await getPesertaTraining(noJadwal, {
          page: params?.page ?? currentPage,
          limit: 10,
          search: params?.search ?? search,
          status: params?.status,
        });
        setData(res.data);
        setMeta(res.meta);
        setJadwal(res.jadwal ?? null); // ✅ tambah fallback null biar aman
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setIsLoading(false);
      }
    },
    [noJadwal, currentPage, search],
  );

  const handleSearch = useCallback(
    (val: string) => {
      setSearch(val);
      setCurrentPage(1);
      fetch({ page: 1, search: val });
    },
    [fetch],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetch({ page });
    },
    [fetch],
  );

  return {
    data,
    meta,
    isLoading,
    error,
    search,
    currentPage,
    fetch,
    handleSearch,
    handlePageChange,
    jadwal, // ✅ sudah ada di return
  };
}

// ─────────────────────────────────────────────
// DETAIL HOOK
// ─────────────────────────────────────────────

export function usePesertaTrainingDetail() {
  const [data, setData] = useState<PesertaTraining | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getPesertaTrainingById(id);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil detail");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => setData(null), []);

  return { data, isLoading, error, fetch, reset };
}

// ─────────────────────────────────────────────
// MUTATION HOOK
// ─────────────────────────────────────────────

interface UsePesertaMutationOptions {
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

export function usePesertaTrainingMutation({
  onSuccess,
  onError,
}: UsePesertaMutationOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = useCallback(
    async (noJadwal: string, payload: CreatePesertaTrainingRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        await createPesertaTraining(noJadwal, payload);
        onSuccess?.();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Gagal membuat data";
        setError(msg);
        onError?.(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, onError],
  );

  const handleUpdate = useCallback(
    async (id: string, payload: UpdatePesertaTrainingRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        await updatePesertaTraining(id, payload);
        onSuccess?.();
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Gagal mengupdate data";
        setError(msg);
        onError?.(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, onError],
  );

  return { isLoading, error, handleCreate, handleUpdate };
}
