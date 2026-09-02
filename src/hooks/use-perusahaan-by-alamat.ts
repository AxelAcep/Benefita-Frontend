// hooks/use-perusahaan-by-alamat.ts

import { useCallback, useEffect, useState } from "react";
import {
  getPerusahaanByAlamatList,
  type PerusahaanByAlamatItem,
  type PerusahaanByAlamatPagination,
} from "@/lib/services/perusahaan.service";

const PAGE_SIZE = 10;

export function usePerusahaanByAlamat() {
  const [data, setData] = useState<PerusahaanByAlamatItem[]>([]);
  const [pagination, setPagination] = useState<PerusahaanByAlamatPagination>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: PAGE_SIZE,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPerusahaanByAlamatList({
        page,
        limit: PAGE_SIZE,
        search,
      });
      setData(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  return { data, pagination, loading, error, search, page, setPage, handleSearch };
}
