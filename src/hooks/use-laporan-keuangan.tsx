// hooks/use-laporan-keuangan.tsx
// Laporan keuangan read-only: Laba Rugi, Laba Rugi Rinci, Neraca, Neraca
// Saldo, Arus Kas, Kas & Bank.
import { useState, useCallback } from "react";
import { useBoolean } from "./use-boolean";
import {
  getLaporanLabaRugi,
  getLaporanLabaRugiRinci,
  getNeracaSnapshot,
  getNeracaSaldo,
  getArusKas,
  getKasBank,
  LabaRugiResponse,
  LabaRugiRinciResponse,
  NeracaResponse,
  NeracaSaldoResponse,
  ArusKasResponse,
  KasBankResponse,
} from "@/lib/services/jurnal-keuangan.service";

/** Hook laporan yang butuh rentang tanggal (startDate, endDate). */
function useLaporanRentang<T>(
  ambil: (startDate: string, endDate: string) => Promise<{ data: T }>,
  pesanError: string,
) {
  const [data, setData] = useState<T | null>(null);
  const { value: loading, onTrue: onLoadingTrue, onFalse: onLoadingFalse } = useBoolean(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (startDate: string, endDate: string) => {
    onLoadingTrue();
    setError(null);
    try {
      const response = await ambil(startDate, endDate);
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(pesanError));
    } finally {
      onLoadingFalse();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, fetchData };
}

export function useLaporanLabaRugiRinci() {
  return useLaporanRentang<LabaRugiRinciResponse>(
    getLaporanLabaRugiRinci,
    "Gagal mengambil laporan laba rugi rinci",
  );
}

export function useNeracaSaldo() {
  return useLaporanRentang<NeracaSaldoResponse>(getNeracaSaldo, "Gagal mengambil neraca saldo");
}

export function useArusKas() {
  return useLaporanRentang<ArusKasResponse>(getArusKas, "Gagal mengambil laporan arus kas");
}

export function useLaporanLabaRugi() {
  const [data, setData] = useState<LabaRugiResponse | null>(null);
  const { value: loading, onTrue: onLoadingTrue, onFalse: onLoadingFalse } = useBoolean(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (
    startPeriode: string,
    endPeriode: string,
    pembanding?: { startDate: string; endDate: string },
  ) => {
    onLoadingTrue();
    setError(null);
    try {
      const response = await getLaporanLabaRugi(startPeriode, endPeriode, pembanding);
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

  const fetchData = useCallback(async (tanggal?: string, tanggalPembanding?: string) => {
    onLoadingTrue();
    setError(null);
    try {
      const response = await getNeracaSnapshot(tanggal, tanggalPembanding);
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

  const fetchData = useCallback(async (params?: { startDate?: string; endDate?: string; search?: string }) => {
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
