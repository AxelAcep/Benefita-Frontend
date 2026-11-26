"use client";

import { useEffect, useState } from "react";
import { perusahaanKantorPusatService } from "@/lib/services/perusahaan-kantor-pusat.service";
import type { ListResult } from "@/lib/api/client";
import type { PerusahaanKantorPusat } from "@/lib/types/perusahaan-kantor-pusat";

// Abaikan respons lama saat pengguna mengubah search/filter/paginasi.
export function usePerusahaanKantorPusat(page: number, search: string, filter: "semua" | "customer", limit = 10) {
  const [result, setResult] = useState<ListResult<PerusahaanKantorPusat>>({
    data: [], page: 1, limit, total: 0, totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let batal = false;
    setLoading(true);
    setError(null);
    perusahaanKantorPusatService.list({ page, search, filter, limit })
      .then((data) => { if (!batal) setResult(data); })
      .catch((err: unknown) => {
        if (!batal) setError(err instanceof Error ? err.message : "Gagal mengambil data kantor pusat.");
      })
      .finally(() => { if (!batal) setLoading(false); });
    return () => { batal = true; };
  }, [page, search, filter, limit]);
  return { ...result, loading, error };
}
