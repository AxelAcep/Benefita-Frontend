"use client";

import { useEffect, useState } from "react";
import { perusahaanBnspService } from "@/lib/services/perusahaan-bnsp.service";
import type { ListResult } from "@/lib/api/client";
import type { PerusahaanBNSP } from "@/lib/types/perusahaan-bnsp";

// Batalkan penerapan respons lama saat pencarian/paginasi berubah cepat.
export function usePerusahaanBnsp(page: number, search: string, limit = 10) {
  const [result, setResult] = useState<ListResult<PerusahaanBNSP>>({
    data: [], page: 1, limit, total: 0, totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let batal = false;
    setLoading(true);
    setError(null);
    perusahaanBnspService.list({ page, search, limit })
      .then((data) => { if (!batal) setResult(data); })
      .catch((err: unknown) => {
        if (!batal) setError(err instanceof Error ? err.message : "Gagal mengambil data BNSP.");
      })
      .finally(() => { if (!batal) setLoading(false); });
    return () => { batal = true; };
  }, [page, search, limit]);
  return { ...result, loading, error };
}
