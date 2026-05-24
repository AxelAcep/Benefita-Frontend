import { useState, useEffect, useCallback } from "react";
import {
  getPerusahaan,
  Perusahaan,
  PaginationMeta,
  getHakAksesPerusahaan,
  GetHakAksesPerusahaanResponse,
  LogPerubahan,
  getLogPerusahaan,
  PosPerusahaan,
  getPosPerusahaan,
  createPosPerusahaan,
  updatePosPerusahaan,
  deletePosPerusahaan,
  Penawaran,
  getPenawaran,
  createPenawaran,
  updatePenawaran,
  deletePenawaran,
  uploadFilePenawaran,
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

export function useLogPerusahaan(
  perusahaanId: string,
  options: { page: number; search: string },
) {
  const [data, setData] = useState<LogPerubahan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk Pagination & Filter
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalData, setTotalData] = useState<number>(0);

  const fetchLogs = useCallback(async () => {
    if (!perusahaanId) return;

    setLoading(true);
    try {
      const response = await getLogPerusahaan(perusahaanId, page, 10, search);
      setData(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotalData(response.pagination.totalData);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memuat history.");
    } finally {
      setLoading(false);
    }
  }, [perusahaanId, page, search]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await getLogPerusahaan(
          perusahaanId,
          options.page,
          10,
          options.search,
        );
        setData(res.data);
        setTotalPages(res.pagination.totalPages);
        setTotalData(res.pagination.totalData);
      } catch (err) {
        setError("Gagal load history");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [perusahaanId, options.page, options.search]); //

  return {
    data,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    totalPages,
    totalData,
    refresh: fetchLogs,
  };
}

// ── usePosPerusahaan ──
export function usePosPerusahaan(idPerusahaan: string) {
  const [data, setData] = useState<PosPerusahaan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPosPerusahaan(idPerusahaan);
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [idPerusahaan]);

  useEffect(() => {
    if (idPerusahaan) fetch();
  }, [idPerusahaan, fetch]);

  const create = useCallback(
    async (payload: {
      nama: string;
      jabatan: string;
      acc: string;
      followUp?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const created = await createPosPerusahaan({
          ...payload,
          noInduk: idPerusahaan,
        });
        setData((prev) => [...prev, created]);
        return created;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [idPerusahaan],
  );

  const update = useCallback(
    async (payload: {
      id: string;
      nama?: string;
      jabatan?: string;
      acc?: string;
      followUp?: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await updatePosPerusahaan(idPerusahaan, payload);
        setData((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item)),
        );
        return updated;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [idPerusahaan],
  );

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deletePosPerusahaan(id);
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refetch: fetch, create, update, remove };
}

export function usePenawaran() {
  const [data, setData] = useState<Penawaran[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPenawaran();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = useCallback(async (kodePelatihan: string[]) => {
    setLoading(true);
    setError(null);
    try {
      const created = await createPenawaran({ kodePelatihan });
      setData((prev) => [created, ...prev]);
      return created;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(
    async (id: string, payload: { kodePelatihan?: string[]; file?: File }) => {
      setLoading(true);
      setError(null);
      try {
        const updated = await updatePenawaran(id, payload);
        setData((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item)),
        );
        return updated;
      } catch (err: any) {
        setError(err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const remove = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deletePenawaran(id);
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadFile = useCallback(async (id: string, file: File) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await uploadFilePenawaran(id, file);
      setData((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
      return updated;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetch,
    create,
    update,
    remove,
    uploadFile,
  };
}
