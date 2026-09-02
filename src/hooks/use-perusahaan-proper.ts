// hooks/use-perusahaan-proper.ts

import { useCallback, useEffect, useState } from "react";
import {
  getPerusahaanProperList,
  type PerusahaanProperItem,
  type PerusahaanProperPagination,
  type PeringkatProper,
} from "@/lib/services/perusahaan.service";

const PAGE_SIZE = 10;

export function usePerusahaanProper() {
  const [data, setData] = useState<PerusahaanProperItem[]>([]);
  const [pagination, setPagination] = useState<PerusahaanProperPagination>({
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
  const [peringkat, setPeringkat] = useState<PeringkatProper | "">("");
  const [liniBisnisId, setLiniBisnisId] = useState<number | "">("");
  const [appliedPeringkat, setAppliedPeringkat] = useState<
    PeringkatProper | ""
  >("");
  const [appliedLiniBisnisId, setAppliedLiniBisnisId] = useState<
    number | ""
  >("");

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPerusahaanProperList({
        page,
        limit: PAGE_SIZE,
        search,
        sort,
        peringkat: appliedPeringkat,
        liniBisnisId: appliedLiniBisnisId,
      });
      setData(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [page, search, sort, appliedPeringkat, appliedLiniBisnisId]);

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
    setAppliedPeringkat(peringkat);
    setAppliedLiniBisnisId(liniBisnisId);
    setPage(1);
  }, [peringkat, liniBisnisId]);

  return {
    data,
    pagination,
    loading,
    error,
    search,
    page,
    sort,
    peringkat,
    liniBisnisId,
    appliedPeringkat,
    setPage,
    setPeringkat,
    setLiniBisnisId,
    handleSearch,
    toggleSort,
    handleTerapkan,
    refresh: fetch,
  };
}
