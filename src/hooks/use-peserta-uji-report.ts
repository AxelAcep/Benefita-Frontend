import { useCallback, useEffect, useState } from "react";
import { getPesertaUjiList } from "@/lib/services/peserta-uji.service";
import type { PesertaUji } from "@/lib/types/peserta-uji";

/** Bentuk paginasi yang dipakai ReportPagination. */
interface Paginasi {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const PAGE_SIZE = 10;

interface FixedParams {
  status?: string;
  statusHasil?: string;
}

/**
 * Hook generik buat 3 laporan read-only yang sama-sama nyambel getPesertaUjiList,
 * cuma beda fixed filter (status / statusHasil): Daftar Asesi (K), Daftar Asesi
 * BK (BK), Calon Peserta Uji (CALON).
 */
export function usePesertaUjiReport(fixed: FixedParams) {
  const [data, setData] = useState<PesertaUji[]>([]);
  const [pagination, setPagination] = useState<Paginasi>({
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [tahun, setTahun] = useState("");
  const [skemaId, setSkemaId] = useState<number | "">("");

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPesertaUjiList({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        tahun: tahun || undefined,
        skemaId: skemaId || undefined,
        status: fixed.status,
        statusHasil: fixed.statusHasil,
      });
      setData(res.data);
      setPagination({
        total: res.total,
        page: res.page,
        limit: res.limit,
        totalPages: res.totalPages,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, tahun, skemaId, fixed.status, fixed.statusHasil]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleTahun = useCallback((value: string) => {
    setTahun(value);
    setPage(1);
  }, []);

  const handleSkemaId = useCallback((value: number | "") => {
    setSkemaId(value);
    setPage(1);
  }, []);

  return {
    data,
    pagination,
    loading,
    error,
    page,
    search,
    tahun,
    skemaId,
    setPage,
    handleSearch,
    handleTahun,
    handleSkemaId,
  };
}
