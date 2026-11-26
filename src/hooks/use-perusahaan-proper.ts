import { useEffect, useState } from "react";
import { getPerusahaanProperList } from "@/lib/services/perusahaan.service";
import type {
  PerusahaanProperItem,
  PeringkatProper,
  PerusahaanProperPagination,
} from "@/lib/types/perusahaan-proper";

const PAGE_SIZE = 10;

export function usePerusahaanProper(
  page: number,
  search: string,
  sort: "asc" | "desc",
  peringkat: PeringkatProper | "",
  liniBisnisId: number | "",
) {
  const [data, setData] = useState<PerusahaanProperItem[]>([]);
  const [pagination, setPagination] = useState<PerusahaanProperPagination>({
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
    getPerusahaanProperList({ page, limit: PAGE_SIZE, search, sort, peringkat, liniBisnisId })
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
  }, [page, search, sort, peringkat, liniBisnisId]);

  return { data, pagination, loading, error };
}
