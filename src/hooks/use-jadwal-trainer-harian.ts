// hooks/use-jadwal-trainer-harian.ts

import { useState, useCallback } from "react";
import {
  getJadwalTrainerHari,
  updateJadwalTrainerHari,
  type JadwalTrainerHariItem,
  type JadwalTrainerHariSummary,
  type UpdateJadwalTrainerHariPayload,
} from "@/lib/services/jadwal-trainer-harian.service";

export function useJadwalTrainerHari() {
  const [jadwal, setJadwal] = useState<JadwalTrainerHariSummary | null>(null);
  const [data, setData] = useState<JadwalTrainerHariItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (noJadwal: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getJadwalTrainerHari(noJadwal);
      setJadwal(res.jadwal);
      setData(res.data);
      return res;
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Gagal mengambil assignment trainer";
      setError(msg);
      throw err instanceof Error ? err : new Error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const save = useCallback(
    async (noJadwal: string, payload: UpdateJadwalTrainerHariPayload) => {
      setIsSaving(true);
      setError(null);
      try {
        const res = await updateJadwalTrainerHari(noJadwal, payload);
        setJadwal(res.jadwal);
        setData(res.data);
        return res;
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : "Gagal menyimpan assignment trainer";
        setError(msg);
        throw err instanceof Error ? err : new Error(msg);
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setJadwal(null);
    setData([]);
    setError(null);
  }, []);

  return { jadwal, data, isLoading, isSaving, error, fetch, save, reset };
}
