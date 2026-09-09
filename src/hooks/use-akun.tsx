// hooks/use-akun.ts
import { useState, useEffect, useCallback } from "react";
import {
  getAkunList,
  createAkun,
  updateAkun,
  toggleAkunStatus,
  AkunItem,
  JenisAkun,
  Pagination,
} from "@/lib/services/accounting.service";

interface UseAkunParams {
  page?: number;
  limit?: number;
  jenis?: JenisAkun;
  search?: string;
  isActive?: boolean;
}

interface UseAkunReturn {
  data: AkunItem[];
  pagination: Pagination;
  loading: boolean;
  error: Error | null;
  refetch: (newParams?: Partial<UseAkunParams>) => Promise<void>;
}

export function useAkun(initialParams?: UseAkunParams): UseAkunReturn {
  const [data, setData] = useState<AkunItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<UseAkunParams>(initialParams || {});

  const fetchData = useCallback(
    async (fetchParams: UseAkunParams = params) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAkunList(fetchParams);
        setData(response.data);
        setPagination(response.pagination);
        setParams(fetchParams);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Gagal mengambil data akun"),
        );
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params],
  );

  const refetch = useCallback(
    async (newParams?: Partial<UseAkunParams>) => {
      const mergedParams = { ...params, ...newParams };
      await fetchData(mergedParams);
    },
    [params, fetchData],
  );

  useEffect(() => {
    fetchData(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, pagination, loading, error, refetch };
}

// ─── Mutation hook (create/update/toggle status) ──────────────────

export function useAkunMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(
    async (payload: {
      kode?: string;
      nama: string;
      jenis: JenisAkun;
      saldoAwal?: number;
    }) => {
      setLoading(true);
      setError(null);
      try {
        return await createAkun(payload);
      } catch (err) {
        const e = err instanceof Error ? err : new Error("Gagal membuat akun");
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const update = useCallback(
    async (
      id: number,
      payload: {
        kode?: string;
        nama?: string;
        jenis?: JenisAkun;
        saldoAwal?: number;
      },
    ) => {
      setLoading(true);
      setError(null);
      try {
        return await updateAkun(id, payload);
      } catch (err) {
        const e =
          err instanceof Error ? err : new Error("Gagal memperbarui akun");
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const toggleStatus = useCallback(async (id: number, isActive?: boolean) => {
    setLoading(true);
    setError(null);
    try {
      return await toggleAkunStatus(id, isActive);
    } catch (err) {
      const e =
        err instanceof Error ? err : new Error("Gagal mengubah status akun");
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, create, update, toggleStatus };
}
