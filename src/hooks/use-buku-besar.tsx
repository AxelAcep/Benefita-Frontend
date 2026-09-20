// hooks/use-buku-besar.tsx
// Fitur 3: Buku Besar (ringkasan + drill-down per akun), real-time.
import { useState, useEffect, useCallback } from "react";
import { useBoolean } from "./use-boolean";
import {
  getBukuBesarRingkasan,
  getBukuBesarAkun,
  BukuBesarRingkasItem,
  BukuBesarAkunResponse,
} from "@/lib/services/jurnal-keuangan.service";
import type { JenisAkun } from "@/lib/services/accounting.service";

export function useBukuBesarRingkasan(initialParams?: {
  jenis?: JenisAkun;
  startDate?: string;
  endDate?: string;
}) {
  const [data, setData] = useState<BukuBesarRingkasItem[]>([]);
  const { value: loading, onTrue: onLoadingTrue, onFalse: onLoadingFalse } = useBoolean(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(
    async (params?: { jenis?: JenisAkun; startDate?: string; endDate?: string }) => {
      onLoadingTrue();
      setError(null);
      try {
        const response = await getBukuBesarRingkasan(params || initialParams);
        setData(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Gagal mengambil ringkasan buku besar"),
        );
      } finally {
        onLoadingFalse();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    fetchData(initialParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading, error, refetch: fetchData };
}

export function useBukuBesarAkun() {
  const [data, setData] = useState<BukuBesarAkunResponse | null>(null);
  const { value: loading, onTrue: onLoadingTrue, onFalse: onLoadingFalse } = useBoolean(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchDetail = useCallback(
    async (akunId: number, params?: { startDate?: string; endDate?: string }) => {
      onLoadingTrue();
      setError(null);
      try {
        const response = await getBukuBesarAkun(akunId, params);
        setData(response);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Gagal mengambil buku besar akun"),
        );
      } finally {
        onLoadingFalse();
      }
    },
    [], // eslint-disable-line react-hooks/exhaustive-deps
  );

  const reset = useCallback(() => setData(null), []);

  return { data, loading, error, fetchDetail, reset };
}
