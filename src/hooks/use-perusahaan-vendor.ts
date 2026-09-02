// hooks/use-perusahaan-vendor.ts

import { useCallback, useEffect, useState } from "react";
import {
  getPerusahaanVendorList,
  type PerusahaanVendorItem,
  type PerusahaanVendorPagination,
} from "@/lib/services/perusahaan.service";

const PAGE_SIZE = 10;

export function usePerusahaanVendor() {
  const [data, setData] = useState<PerusahaanVendorItem[]>([]);
  const [pagination, setPagination] = useState<PerusahaanVendorPagination>({
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
      const res = await getPerusahaanVendorList({
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

  return {
    data,
    pagination,
    loading,
    error,
    search,
    page,
    setPage,
    handleSearch,
  };
}
