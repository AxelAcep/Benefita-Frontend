// hooks/use-request-keuangan.ts
import { useState, useEffect, useCallback } from "react";
import {
  getRequestKeuanganList,
  createRequestKeuangan,
  approveRequestKeuangan,
  rejectRequestKeuangan,
  RequestKeuanganItem,
  JenisRequestKeuangan,
  StatusRequestKeuangan,
  Pagination,
} from "@/lib/services/accounting.service";

interface UseRequestKeuanganParams {
  page?: number;
  limit?: number;
  status?: StatusRequestKeuangan;
  jenis?: JenisRequestKeuangan;
  search?: string;
}

interface UseRequestKeuanganReturn {
  data: RequestKeuanganItem[];
  pagination: Pagination;
  loading: boolean;
  error: Error | null;
  refetch: (newParams?: Partial<UseRequestKeuanganParams>) => Promise<void>;
}

export function useRequestKeuangan(
  initialParams?: UseRequestKeuanganParams,
): UseRequestKeuanganReturn {
  const [data, setData] = useState<RequestKeuanganItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<UseRequestKeuanganParams>(
    initialParams || {},
  );

  const fetchData = useCallback(
    async (fetchParams: UseRequestKeuanganParams = params) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getRequestKeuanganList(fetchParams);
        setData(response.data);
        setPagination(response.pagination);
        setParams(fetchParams);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Gagal mengambil data request keuangan"),
        );
      } finally {
        setLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params],
  );

  const refetch = useCallback(
    async (newParams?: Partial<UseRequestKeuanganParams>) => {
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

// ─── Mutation hook (create/approve/reject) ────────────────────────

export function useRequestKeuanganMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(
    async (payload: {
      jenis: JenisRequestKeuangan;
      akunId?: number;
      deskripsi: string;
      nominal: number;
      tanggal?: string;
      buktiFile?: File;
    }) => {
      setLoading(true);
      setError(null);
      try {
        return await createRequestKeuangan(payload);
      } catch (err) {
        const e =
          err instanceof Error ? err : new Error("Gagal mengajukan request");
        setError(e);
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const approve = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      return await approveRequestKeuangan(id);
    } catch (err) {
      const e =
        err instanceof Error ? err : new Error("Gagal menyetujui request");
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const reject = useCallback(async (id: number, catatan: string) => {
    setLoading(true);
    setError(null);
    try {
      return await rejectRequestKeuangan(id, catatan);
    } catch (err) {
      const e = err instanceof Error ? err : new Error("Gagal menolak request");
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, create, approve, reject };
}
