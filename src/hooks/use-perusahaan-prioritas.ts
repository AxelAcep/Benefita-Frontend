// hooks/use-perusahaan-prioritas.ts

import { useCallback, useState } from "react";
import {
  getPerusahaanPrioritasList,
  type PerusahaanPrioritasItem,
  type PerusahaanPrioritasPagination,
} from "@/lib/services/perusahaan.service";

const PAGE_SIZE = 10;

export function usePerusahaanPrioritas() {
  const [data, setData] = useState<PerusahaanPrioritasItem[]>([]);
  const [pagination, setPagination] = useState<PerusahaanPrioritasPagination>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: PAGE_SIZE,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [prioritasMa, setPrioritasMa] = useState("");
  const [prioritasAe, setPrioritasAe] = useState("");
  const [appliedMa, setAppliedMa] = useState("");
  const [appliedAe, setAppliedAe] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  const fetch = useCallback(
    async (params?: { page?: number; ma?: string; ae?: string; search?: string }) => {
      const ma = params?.ma ?? appliedMa;
      const ae = params?.ae ?? appliedAe;
      if (!ma && !ae) return; // sama kayak UX lama: gak query sampai ada filter dipilih

      setLoading(true);
      setError(null);
      try {
        const res = await getPerusahaanPrioritasList({
          page: params?.page ?? page,
          limit: PAGE_SIZE,
          search: params?.search ?? search,
          prioritasMa: ma || undefined,
          prioritasAe: ae || undefined,
        });
        setData(res.data);
        setPagination(res.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    },
    [page, search, appliedMa, appliedAe],
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      setPage(1);
      if (hasApplied) fetch({ page: 1, search: value });
    },
    [fetch, hasApplied],
  );

  const handleTerapkan = useCallback(() => {
    setAppliedMa(prioritasMa);
    setAppliedAe(prioritasAe);
    setHasApplied(!!prioritasMa || !!prioritasAe);
    setPage(1);
    fetch({ page: 1, ma: prioritasMa, ae: prioritasAe });
  }, [prioritasMa, prioritasAe, fetch]);

  const handlePageChange = useCallback(
    (p: number) => {
      setPage(p);
      fetch({ page: p });
    },
    [fetch],
  );

  return {
    data,
    pagination,
    loading,
    error,
    search,
    page,
    prioritasMa,
    prioritasAe,
    hasApplied,
    setPrioritasMa,
    setPrioritasAe,
    handleSearch,
    handleTerapkan,
    handlePageChange,
  };
}
