import { useCallback, useEffect, useState } from "react";
import {
  getPesertaUjiList,
  updatePesertaUjiChecklist,
  type PesertaUji,
  type PesertaUjiPagination,
  type ChecklistField,
} from "@/lib/services/peserta-uji.service";

const PAGE_SIZE = 10;

export function usePesertaUji() {
  const [data, setData] = useState<PesertaUji[]>([]);
  const [pagination, setPagination] = useState<PesertaUjiPagination>({
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [tanggal, setTanggal] = useState("");

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPesertaUjiList({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        tanggal: tanggal || undefined,
      });
      setData(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [page, search, tanggal]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleTanggal = useCallback((value: string) => {
    setTanggal(value);
    setPage(1);
  }, []);

  // Optimistic toggle: update UI dulu, baru sync ke server. Kalau gagal, revert.
  const toggleChecklist = useCallback(
    async (id: number, field: ChecklistField, value: boolean) => {
      setData((prev) =>
        prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
      );
      try {
        const updated = await updatePesertaUjiChecklist(id, {
          [field]: value,
        });
        setData((prev) =>
          prev.map((row) => (row.id === id ? updated : row)),
        );
      } catch (err) {
        // revert
        setData((prev) =>
          prev.map((row) =>
            row.id === id ? { ...row, [field]: !value } : row,
          ),
        );
        throw err;
      }
    },
    [],
  );

  return {
    data,
    pagination,
    loading,
    error,
    page,
    search,
    tanggal,
    setPage,
    handleSearch,
    handleTanggal,
    toggleChecklist,
    refetch: fetch,
  };
}
