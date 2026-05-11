import { useState, useEffect, useCallback } from "react";
import {
  getPerusahaan,
  Perusahaan,
  PaginationMeta,
  getHakAksesPerusahaan,
  GetHakAksesPerusahaanResponse,
} from "@/lib/services/perusahaan.service";

const PAGE_SIZE = 4;

export function usePerusahaan() {
  const [data, setData] = useState<Perusahaan[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    pageSize: PAGE_SIZE,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPerusahaan({
        search,
        page: currentPage,
        pageSize: PAGE_SIZE,
      });
      setData(res.data);
      setMeta(res.meta);
    } catch (err: any) {
      setError(err.message || "Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, [search, currentPage]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1); // Reset ke halaman pertama saat search berubah
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    data,
    meta,
    loading,
    error,
    search,
    currentPage,
    handleSearch,
    handlePageChange,
    reload: load,
  };
}

export function useHakAksesPerusahaan(perusahaanId: string) {
  const [data, setData] = useState<GetHakAksesPerusahaanResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!perusahaanId) return;

    setLoading(true);
    setError(null);

    getHakAksesPerusahaan(perusahaanId)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [perusahaanId]);

  return { data, loading, error };
}
