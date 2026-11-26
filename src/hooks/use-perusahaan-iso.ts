import { useEffect, useState } from "react";
import { getPerusahaanIsoList } from "@/lib/services/perusahaan.service";
import type {
  PerusahaanIsoItem,
  PerusahaanIsoPagination,
} from "@/lib/types/perusahaan-iso";

const PAGE_SIZE = 10;

export function usePerusahaanIso(
  page: number,
  search: string,
  sort: "asc" | "desc",
  liniBisnisId: number | "",
) {
  const [data, setData] = useState<PerusahaanIsoItem[]>([]);
  const [pagination, setPagination] = useState<PerusahaanIsoPagination>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: PAGE_SIZE,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let batal = false;
    setLoading(true);
    setError(null);
    getPerusahaanIsoList({ page, limit: PAGE_SIZE, search, sort, liniBisnisId })
      .then((result) => {
        if (batal) return;
        setData(result.data);
        setPagination(result.pagination);
      })
      .catch((err: unknown) => {
        if (batal) return;
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      })
      .finally(() => {
        if (!batal) setLoading(false);
      });

    return () => {
      batal = true;
    };
  }, [page, search, sort, liniBisnisId]);

  return { data, pagination, loading, error };
}
