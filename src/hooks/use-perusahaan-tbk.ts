// hooks/use-perusahaan-tbk.ts

import { useCallback, useEffect, useState } from "react";
import {
  getPerusahaanTbkList,
  type PerusahaanTbkItem,
  type PerusahaanTbkPagination,
} from "@/lib/services/perusahaan.service";

const PAGE_SIZE = 10;

export function usePerusahaanTbk() {
  const [data, setData] = useState<PerusahaanTbkItem[]>([]);
  const [pagination, setPagination] = useState<PerusahaanTbkPagination>({
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

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPerusahaanTbkList({
        page,
        limit: PAGE_SIZE,
        search,
        sort,
      });
      setData(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [page, search, sort]);

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

  return {
    data,
    pagination,
    loading,
    error,
    search,
    page,
    sort,
    setPage,
    handleSearch,
    toggleSort,
    refresh: fetch,
  };
}
