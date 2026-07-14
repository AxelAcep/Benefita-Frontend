// hooks/use-piutang.ts
import { useState, useEffect, useCallback } from "react";
import {
  getPiutang,
  PiutangItem,
  Pagination,
  GetPendapatanParams,
} from "@/lib/services/accounting.service";

interface UsePiutangReturn {
  data: PiutangItem[];
  pagination: Pagination;
  grandTotal: {
    totalPeserta: number;
    totalBelumBayar: number;
    totalPiutang: number;
  };
  loading: boolean;
  error: Error | null;
  refetch: (newParams?: Partial<GetPendapatanParams>) => Promise<void>;
}

export function usePiutang(
  initialParams?: GetPendapatanParams,
): UsePiutangReturn {
  const [data, setData] = useState<PiutangItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [grandTotal, setGrandTotal] = useState({
    totalPeserta: 0,
    totalBelumBayar: 0,
    totalPiutang: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<GetPendapatanParams>(
    initialParams || {},
  );

  const fetchData = useCallback(
    async (fetchParams: GetPendapatanParams = params) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getPiutang(fetchParams);
        setData(response.data);
        setPagination(response.pagination);
        setGrandTotal(response.grandTotal);
        setParams(fetchParams);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Gagal mengambil data piutang"),
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

  return { data, pagination, grandTotal, loading, error, refetch };
}
