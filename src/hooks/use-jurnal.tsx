// hooks/use-jurnal.tsx
// Fitur 2 (Jurnal Keuangan): read hook (list) + mutation hook (create).
import { useState, useEffect, useCallback } from "react";
import { useBoolean } from "./use-boolean";
import {
  getJurnalList,
  getJurnalById,
  createJurnal,
  JurnalTransaksiItem,
  JurnalBarisInput,
  ModeJurnal,
} from "@/lib/services/jurnal-keuangan.service";
import { Pagination } from "@/lib/services/accounting.service";

interface UseJurnalParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
}

interface UseJurnalReturn {
  data: JurnalTransaksiItem[];
  pagination: Pagination;
  loading: boolean;
  error: Error | null;
  refetch: (newParams?: Partial<UseJurnalParams>) => Promise<void>;
}

export function useJurnal(initialParams?: UseJurnalParams): UseJurnalReturn {
  const [data, setData] = useState<JurnalTransaksiItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const { value: loading, onTrue: onLoadingTrue, onFalse: onLoadingFalse } = useBoolean(true);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<UseJurnalParams>(initialParams || {});

  const fetchData = useCallback(
    async (fetchParams: UseJurnalParams = params) => {
      onLoadingTrue();
      setError(null);
      try {
        const response = await getJurnalList(fetchParams);
        setData(response.data);
        setPagination(response.pagination);
        setParams(fetchParams);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Gagal mengambil data jurnal"),
        );
      } finally {
        onLoadingFalse();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [params],
  );

  const refetch = useCallback(
    async (newParams?: Partial<UseJurnalParams>) => {
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

export function useJurnalDetail(id: number | null) {
  const [data, setData] = useState<JurnalTransaksiItem | null>(null);
  const { value: loading, onTrue: onLoadingTrue, onFalse: onLoadingFalse } = useBoolean(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    onLoadingTrue();
    setError(null);
    try {
      const response = await getJurnalById(id);
      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Gagal mengambil detail jurnal"),
      );
    } finally {
      onLoadingFalse();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { data, loading, error, refetch: fetchDetail };
}

export function useJurnalMutation() {
  const { value: loading, onTrue: onLoadingTrue, onFalse: onLoadingFalse } = useBoolean(false);
  const [error, setError] = useState<Error | null>(null);

  const create = useCallback(
    async (payload: {
      tanggal: string;
      deskripsi: string;
      mode: ModeJurnal;
      baris: JurnalBarisInput[];
    }) => {
      onLoadingTrue();
      setError(null);
      try {
        return await createJurnal(payload);
      } catch (err) {
        const e =
          err instanceof Error ? err : new Error("Gagal menyimpan jurnal");
        setError(e);
        throw e;
      } finally {
        onLoadingFalse();
      }
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return { loading, error, create };
}
