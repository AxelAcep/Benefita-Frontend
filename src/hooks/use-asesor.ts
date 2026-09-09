import { useCallback, useEffect, useState } from "react";
import {
  getAsesorList,
  createAsesor,
  updateAsesor,
  deleteAsesor,
  Asesor,
  CreateAsesorRequest,
  UpdateAsesorRequest,
} from "@/lib/services/asesor.service";

interface UseAsesorParams {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
}

export function useAsesor(params?: UseAsesorParams) {
  const [data, setData] = useState<Asesor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(params?.initialPage || 1);
  const [limit, setLimit] = useState(params?.initialLimit || 10);
  const [search, setSearch] = useState(params?.initialSearch || "");

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchAsesor = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAsesorList({
        page,
        limit,
        search: search || undefined,
      });
      setData(res.data);
      setTotal(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data asesor");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchAsesor();
  }, [fetchAsesor]);

  const refetch = () => fetchAsesor();

  const changePage = (newPage: number) => setPage(newPage);

  const setSearchQuery = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const create = async (payload: CreateAsesorRequest) => {
    const result = await createAsesor(payload);
    await refetch();
    return result;
  };

  const update = async (id: number, payload: UpdateAsesorRequest) => {
    const result = await updateAsesor(id, payload);
    await refetch();
    return result;
  };

  const remove = async (id: number) => {
    await deleteAsesor(id);
    await refetch();
  };

  return {
    data,
    loading,
    error,

    page,
    limit,
    total,
    totalPages,

    search,

    setPage: changePage,
    setSearch: setSearchQuery,

    refetch,
    create,
    update,
    remove,
  };
}
