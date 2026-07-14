import { useState, useEffect, useCallback } from "react";
import {
  getPendapatan,
  PendapatanItem,
  Pagination,
  GetPendapatanParams,
} from "@/lib/services/accounting.service";

interface UsePendapatanReturn {
  data: PendapatanItem[];
  pagination: Pagination;
  grandTotal: { totalPeserta: number; pendapatan: number };
  loading: boolean;
  error: Error | null;
  refetch: (newParams?: Partial<GetPendapatanParams>) => Promise<void>;
}

export function usePendapatan(
  initialParams?: GetPendapatanParams,
): UsePendapatanReturn {
  const [data, setData] = useState<PendapatanItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<GetPendapatanParams>(
    initialParams || {},
  );
  const [grandTotal, setGrandTotal] = useState({
    totalPeserta: 0,
    pendapatan: 0,
  });

  const fetchData = useCallback(
    async (fetchParams: GetPendapatanParams = params) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getPendapatan(fetchParams);
        setData(response.data);
        setPagination(response.pagination);
        setParams(fetchParams);
        setGrandTotal(response.grandTotal);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Gagal mengambil data pendapatan"),
        );
      } finally {
        setLoading(false);
      }
    },
    [params],
  );

  const refetch = useCallback(
    async (newParams?: Partial<GetPendapatanParams>) => {
      const mergedParams = { ...params, ...newParams };
      await fetchData(mergedParams);
    },
    [params, fetchData],
  );

  useEffect(() => {
    fetchData(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, pagination, loading, error, refetch, grandTotal };
}
