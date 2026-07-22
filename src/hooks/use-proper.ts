// hooks/useProperList.ts

import { useState, useEffect } from "react";
import {
  getProperList,
  ProperListResponse,
} from "@/lib/services/proper.service";

interface UseProperListResult {
  data: ProperListResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useProperList(tahun: number): UseProperListResult {
  const [data, setData] = useState<ProperListResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getProperList(tahun);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengambil data proper");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tahun]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
