import { useState, useEffect, useCallback } from "react";
import {
  getLaporanHasilUsaha,
  LaporanHasilUsahaItem,
  Pagination,
  GetPendapatanParams,
} from "@/lib/services/accounting.service";

interface UseLaporanHasilUsahaReturn {
  data: LaporanHasilUsahaItem[];
  pagination: Pagination;
  grandTotal: {
    totalRealisasi: number;
    totalAnggaran: number;
  };
  loading: boolean;
  error: Error | null;
  refetch: (newParams?: Partial<GetPendapatanParams>) => Promise<void>;
}

export function useLaporanHasilUsaha(
  initialParams?: GetPendapatanParams,
): UseLaporanHasilUsahaReturn {
  const [data, setData] = useState<LaporanHasilUsahaItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [grandTotal, setGrandTotal] = useState({
    totalRealisasi: 0,
    totalAnggaran: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<GetPendapatanParams>(
    initialParams || {},
  );

  const fetchData = useCallback(
    async (fetchParams: GetPendapatanParams = params) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getLaporanHasilUsaha(fetchParams);
        setData(response.data);
        setPagination(response.pagination);
        setGrandTotal(response.grandTotal);
        setParams(fetchParams);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Gagal mengambil laporan hasil usaha"),
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
