// hooks/use-umk.ts
import { useState, useEffect, useCallback } from "react";
import {
  getUmk,
  UmkItem,
  UmkResponse,
  Pagination,
} from "@/lib/services/accounting.service";

interface UseUmkParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  startMonth?: number;
  startYear?: number;
  endMonth?: number;
  endYear?: number;
  picId?: string;
  search?: string;
}

interface UseUmkReturn {
  data: UmkItem[];
  pagination: Pagination;
  grandTotal: {
    totalJumlah: number;
    totalRealisasi: number;
    totalSisa: number;
  };
  loading: boolean;
  error: Error | null;
  refetch: (newParams?: Partial<UseUmkParams>) => Promise<void>;
}

export function useUmk(initialParams?: UseUmkParams): UseUmkReturn {
  const [data, setData] = useState<UmkItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [grandTotal, setGrandTotal] = useState({
    totalJumlah: 0,
    totalRealisasi: 0,
    totalSisa: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<UseUmkParams>(initialParams || {});

  const fetchData = useCallback(
    async (fetchParams: UseUmkParams = params) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getUmk(fetchParams);
        setData(response.data);
        setPagination(response.pagination);
        setGrandTotal(response.grandTotal);
        setParams(fetchParams);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Gagal mengambil data UMK"),
        );
      } finally {
        setLoading(false);
      }
    },
    [params],
  );

  const refetch = useCallback(
    async (newParams?: Partial<UseUmkParams>) => {
      const mergedParams = { ...params, ...newParams };
      await fetchData(mergedParams);
    },
    [params, fetchData],
  );

  useEffect(() => {
    fetchData(params);
  }, []);

  return { data, pagination, grandTotal, loading, error, refetch };
}
