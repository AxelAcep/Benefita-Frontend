// hooks/use-konfirmasi.ts

import { useState, useCallback } from "react";
import {
  getListKonfirmasi,
  getKonfirmasiById,
  createKonfirmasi,
  updateKonfirmasi,
  deleteKonfirmasi,
  type Konfirmasi,
  type KonfirmasiPagination,
  type CreateKonfirmasiRequest,
  type UpdateKonfirmasiRequest,
} from "@/lib/services/konfirmasi.service";

// ─────────────────────────────────────────────
// LIST HOOK — dipakai buat cek apakah peserta sudah pernah dikonfirmasi
// ─────────────────────────────────────────────

export function useKonfirmasiList() {
  const [data, setData] = useState<Konfirmasi[]>([]);
  const [meta, setMeta] = useState<KonfirmasiPagination>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(
    async (params?: {
      page?: number;
      search?: string;
      noJadwal?: string;
      pesertaTrainingId?: number;
    }) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getListKonfirmasi(params);
        setData(res.data);
        setMeta(res.meta);
        return res;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Gagal mengambil data konfirmasi";
        setError(msg);
        throw err instanceof Error ? err : new Error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { data, meta, isLoading, error, fetch };
}

// ─────────────────────────────────────────────
// DETAIL HOOK
// ─────────────────────────────────────────────

export function useKonfirmasiDetail() {
  const [data, setData] = useState<Konfirmasi | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getKonfirmasiById(id);
      setData(res);
      return res;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Gagal mengambil detail konfirmasi";
      setError(msg);
      throw err instanceof Error ? err : new Error(msg);
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

interface UseKonfirmasiMutationOptions {
  onSuccess?: (data: Konfirmasi) => void;
  onError?: (msg: string) => void;
}

export function useKonfirmasiMutation({
  onSuccess,
  onError,
}: UseKonfirmasiMutationOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = useCallback(
    async (payload: CreateKonfirmasiRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await createKonfirmasi(payload);
        onSuccess?.(res);
        return res;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Gagal membuat konfirmasi";
        setError(msg);
        onError?.(msg);
        throw err instanceof Error ? err : new Error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, onError],
  );

  const handleUpdate = useCallback(
    async (id: number, payload: UpdateKonfirmasiRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await updateKonfirmasi(id, payload);
        onSuccess?.(res);
        return res;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Gagal mengupdate konfirmasi";
        setError(msg);
        onError?.(msg);
        throw err instanceof Error ? err : new Error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, onError],
  );

  const handleDelete = useCallback(
    async (id: number) => {
      setIsLoading(true);
      setError(null);
      try {
        await deleteKonfirmasi(id);
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Gagal menghapus konfirmasi";
        setError(msg);
        onError?.(msg);
        throw err instanceof Error ? err : new Error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [onError],
  );

  return { isLoading, error, handleCreate, handleUpdate, handleDelete };
}
