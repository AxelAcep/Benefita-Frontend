import { useEffect, useState } from "react";
import { getProperList } from "@/lib/services/proper.service";
import type { ProperListResponse } from "@/lib/types/proper-ringkasan";

export function useProperList(tahun: number) {
  const [data, setData] = useState<ProperListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let batal = false;
    setLoading(true);
    setError(null);

    getProperList(tahun)
      .then((result) => {
        if (!batal) setData(result);
      })
      .catch((err: unknown) => {
        if (batal) return;
        setData(null);
        setError(
          err instanceof Error ? err.message : "Gagal mengambil data proper",
        );
      })
      .finally(() => {
        if (!batal) setLoading(false);
      });

    return () => {
      batal = true;
    };
  }, [tahun]);

  return { data, loading, error };
}
