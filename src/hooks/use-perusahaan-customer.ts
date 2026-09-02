// hooks/use-perusahaan-customer.ts

import { useCallback, useEffect, useState } from "react";
import {
  getPerusahaanCustomerList,
  type PerusahaanCustomerItem,
  type PerusahaanCustomerPagination,
} from "@/lib/services/perusahaan.service";

const PAGE_SIZE = 10;

export function usePerusahaanCustomer() {
  const [data, setData] = useState<PerusahaanCustomerItem[]>([]);
  const [pagination, setPagination] = useState<PerusahaanCustomerPagination>({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    pageSize: PAGE_SIZE,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tahun, setTahun] = useState<number | "">("");
  const [appliedTahun, setAppliedTahun] = useState<number | "">("");

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPerusahaanCustomerList({
        page,
        limit: PAGE_SIZE,
        search,
        tahun: appliedTahun,
      });
      setData(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [page, search, appliedTahun]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleTerapkan = useCallback(() => {
    setAppliedTahun(tahun);
    setPage(1);
  }, [tahun]);

  return {
    data,
    pagination,
    loading,
    error,
    search,
    page,
    tahun,
    appliedTahun,
    setPage,
    setTahun,
    handleSearch,
    handleTerapkan,
  };
}
