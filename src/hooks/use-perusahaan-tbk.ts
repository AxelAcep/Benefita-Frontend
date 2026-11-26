import { useEffect, useState } from "react";
import { getPerusahaanTbkList } from "@/lib/services/perusahaan.service";
import type {
  PerusahaanTbkItem,
  PerusahaanTbkPagination,
} from "@/lib/types/perusahaan-tbk";

const PAGE_SIZE = 10;

export function usePerusahaanTbk(
  page: number,
  search: string,
  sort: "asc" | "desc",
) {
  const [data, setData] = useState<PerusahaanTbkItem[]>([]);
  const [pagination, setPagination] = useState<PerusahaanTbkPagination>({
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
    getPerusahaanTbkList({ page, limit: PAGE_SIZE, search, sort })
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
  }, [page, search, sort]);

  return { data, pagination, loading, error };
}
