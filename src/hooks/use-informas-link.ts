import { useState, useEffect, useCallback, useRef } from "react";
import {
  getJadwalPesertaLinks,
  JadwalPesertaLinksResponse,
} from "@/lib/services/input.service";

interface UseJadwalPesertaLinksOptions {
  noJadwal: string;
}

export function useJadwalPesertaLinks({
  noJadwal,
}: UseJadwalPesertaLinksOptions) {
  const [data, setData] = useState<JadwalPesertaLinksResponse | null>(null);
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
    if (!noJadwal) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getJadwalPesertaLinks(noJadwal);
      if (isMounted.current) {
        setData(result);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(
          err instanceof Error ? err.message : "Gagal mengambil data jadwal",
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
