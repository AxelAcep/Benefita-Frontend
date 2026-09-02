// hooks/use-perusahaan-iso.ts

import { useCallback, useEffect, useState } from "react";
import {
  getPerusahaanIsoList,
  type PerusahaanIsoItem,
  type PerusahaanIsoPagination,
} from "@/lib/services/perusahaan.service";

const PAGE_SIZE = 10;

export function usePerusahaanIso() {
  const [data, setData] = useState<PerusahaanIsoItem[]>([]);
  const [pagination, setPagination] = useState<PerusahaanIsoPagination>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: PAGE_SIZE,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [liniBisnisId, setLiniBisnisId] = useState<number | "">("");
  const [appliedLiniBisnisId, setAppliedLiniBisnisId] = useState<
    number | ""
  >("");

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPerusahaanIsoList({
        page,
        limit: PAGE_SIZE,
        search,
        sort,
        liniBisnisId: appliedLiniBisnisId,
      });
      setData(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [page, search, sort, appliedLiniBisnisId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const toggleSort = useCallback(() => {
    setSort((prev) => (prev === "asc" ? "desc" : "asc"));
    setPage(1);
  }, []);

  const handleTerapkan = useCallback(() => {
    setAppliedLiniBisnisId(liniBisnisId);
    setPage(1);
  }, [liniBisnisId]);

  return {
    data,
    pagination,
    loading,
    error,
    search,
    page,
    sort,
    liniBisnisId,
    setPage,
    setLiniBisnisId,
    handleSearch,
    toggleSort,
    handleTerapkan,
    refresh: fetch,
  };
}
