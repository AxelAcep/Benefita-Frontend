import { useState, useEffect, useCallback, useRef } from "react";
import {
  getRekapEvaluasi,
  RekapEvaluasiResponse,
} from "@/lib/services/input.service";

interface UseRekapEvaluasiOptions {
  noJadwal: string;
}

export function useRekapEvaluasi({ noJadwal }: UseRekapEvaluasiOptions) {
  const [data, setData] = useState<RekapEvaluasiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchData = useCallback(async () => {
    if (!noJadwal) {
      setIsLoading(false);
      setError("noJadwal tidak ditemukan di URL");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await getRekapEvaluasi(noJadwal);
      if (isMounted.current) {
        setData(result);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(
          err instanceof Error ? err.message : "Gagal mengambil rekap evaluasi",
        );
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [noJadwal]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
