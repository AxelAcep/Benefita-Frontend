import { useEffect, useState } from "react";
import { getPerusahaanPrioritasList } from "@/lib/services/perusahaan.service";
import type {
  PerusahaanPrioritasItem,
  PerusahaanPrioritasPagination,
} from "@/lib/types/perusahaan-prioritas";

const PAGE_SIZE = 10;

export function usePerusahaanPrioritas(
  page: number,
  search: string,
  prioritasMa: string,
  prioritasAe: string,
) {
  const [data, setData] = useState<PerusahaanPrioritasItem[]>([]);
  const [pagination, setPagination] = useState<PerusahaanPrioritasPagination>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: PAGE_SIZE,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!prioritasMa && !prioritasAe) {
      setLoading(false);
      setError(null);
      return;
    }

    let batal = false;
    setLoading(true);
    setError(null);
    getPerusahaanPrioritasList({ page, limit: PAGE_SIZE, search, prioritasMa, prioritasAe })
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
  }, [page, search, prioritasMa, prioritasAe]);

  return { data, pagination, loading, error };
}
