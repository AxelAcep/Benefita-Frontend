import { useState, useEffect, useCallback } from "react";
import {
  getNeraca,
  createNeraca,
  updateNeraca,
  deleteNeraca,
  type GetNeracaParams,
  type CreateNeracaPayload,
  type UpdateNeracaPayload,
  type NeracaResponse,
  type NeracaItem,
} from "@/lib/services/accounting.service";

interface UseNeracaReturn {
  // State
  data: NeracaItem[];
  meta: NeracaResponse["meta"] | null;
  loading: boolean;
  error: string | null;
  params: GetNeracaParams;

  // Actions
  setParams: (newParams: Partial<GetNeracaParams>) => void;
  refresh: () => Promise<void>;
  create: (payload: CreateNeracaPayload) => Promise<NeracaItem>;
  update: (id: number, payload: UpdateNeracaPayload) => Promise<NeracaItem>;
  remove: (id: number) => Promise<void>;
}

export function useNeraca(
  initialParams: GetNeracaParams = {},
): UseNeracaReturn {
  // ─── State ──────────────────────────────────────────────
  const [data, setData] = useState<NeracaItem[]>([]);
  const [meta, setMeta] = useState<NeracaResponse["meta"] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParamsState] = useState<GetNeracaParams>({
    page: 1,
    limit: 999999,
    ...initialParams,
  });

  // ─── Fetch Data ──────────────────────────────────────────
  const fetchData = useCallback(async (fetchParams: GetNeracaParams) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getNeraca(fetchParams);
      setData(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data neraca");
      setData([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Auto-fetch when params change ──────────────────────
  useEffect(() => {
    fetchData(params);
  }, [params, fetchData]);

  // ─── Set params (partial update) ────────────────────────
  const setParams = useCallback((newParams: Partial<GetNeracaParams>) => {
    setParamsState((prev) => ({
      ...prev,
      ...newParams,
      // Reset page to 1 when filter changes (optional)
      ...(Object.keys(newParams).some((k) => k !== "page" && k !== "limit")
        ? { page: 1 }
        : {}),
    }));
  }, []);

  // ─── Refresh with current params ────────────────────────
  const refresh = useCallback(async () => {
    await fetchData(params);
  }, [params, fetchData]);

  // ─── CREATE ──────────────────────────────────────────────
  const create = useCallback(
    async (payload: CreateNeracaPayload): Promise<NeracaItem> => {
      setLoading(true);
      setError(null);
      try {
        const result = await createNeraca(payload);
        // Refresh list after create
        await fetchData(params);
        return result.data;
      } catch (err: any) {
        setError(err.message || "Gagal membuat data neraca");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [params, fetchData],
  );

  // ─── UPDATE ──────────────────────────────────────────────
  const update = useCallback(
    async (id: number, payload: UpdateNeracaPayload): Promise<NeracaItem> => {
      setLoading(true);
      setError(null);
      try {
        const result = await updateNeraca(id, payload);
        // Refresh list after update
        await fetchData(params);
        return result.data;
      } catch (err: any) {
        setError(err.message || "Gagal mengupdate data neraca");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [params, fetchData],
  );

  // ─── DELETE ──────────────────────────────────────────────
  const remove = useCallback(
    async (id: number): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await deleteNeraca(id);
        // Refresh list after delete
        await fetchData(params);
      } catch (err: any) {
        setError(err.message || "Gagal menghapus data neraca");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [params, fetchData],
  );

  // ─── Return ──────────────────────────────────────────────
  return {
    data,
    meta,
    loading,
    error,
    params,
    setParams,
    refresh,
    create,
    update,
    remove,
  };
}
