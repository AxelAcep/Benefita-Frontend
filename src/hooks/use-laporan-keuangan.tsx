// hooks/use-laporan-keuangan.tsx
// Fitur 4 (Laba Rugi), Fitur 5 (Neraca), Fitur 6 (Kas & Bank) — read-only.
import { useState, useCallback } from "react";
import { useBoolean } from "./use-boolean";
import {
  getLaporanLabaRugi,
  getNeracaSnapshot,
  getKasBank,
  LabaRugiResponse,
  NeracaResponse,
  KasBankResponse,
} from "@/lib/services/jurnal-keuangan.service";

export function useLaporanLabaRugi() {
  const [data, setData] = useState<LabaRugiResponse | null>(null);
  const { value: loading, onTrue: onLoadingTrue, onFalse: onLoadingFalse } = useBoolean(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (startPeriode: string, endPeriode: string) => {
    onLoadingTrue();
    setError(null);
    try {
      const response = await getLaporanLabaRugi(startPeriode, endPeriode);
      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Gagal mengambil laporan laba rugi"),
      );
    } finally {
      onLoadingFalse();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, fetchData };
}

export function useLaporanNeraca() {
  const [data, setData] = useState<NeracaResponse | null>(null);
  const { value: loading, onTrue: onLoadingTrue, onFalse: onLoadingFalse } = useBoolean(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (tanggal?: string) => {
    onLoadingTrue();
    setError(null);
    try {
      const response = await getNeracaSnapshot(tanggal);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Gagal mengambil neraca"));
    } finally {
      onLoadingFalse();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, fetchData };
}

export function useKasBank() {
  const [data, setData] = useState<KasBankResponse | null>(null);
  const { value: loading, onTrue: onLoadingTrue, onFalse: onLoadingFalse } = useBoolean(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (params?: { startDate?: string; endDate?: string }) => {
    onLoadingTrue();
    setError(null);
    try {
      const response = await getKasBank(params);
      setData(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Gagal mengambil data Kas & Bank"),
      );
    } finally {
      onLoadingFalse();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, fetchData };
}
