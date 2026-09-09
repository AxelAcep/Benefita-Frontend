import { useCallback, useEffect, useState } from "react";
import {
  getTUKList,
  createTUK,
  updateTUK,
  deleteTUK,
  TUK,
  CreateTUKRequest,
  UpdateTUKRequest,
} from "@/lib/services/tuk.service";

interface UseTUKParams {
  initialPage?: number;
  initialLimit?: number;
  initialSearch?: string;
}

export function useTUK(params?: UseTUKParams) {
  const [data, setData] = useState<TUK[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(params?.initialPage || 1);
  const [limit, setLimit] = useState(params?.initialLimit || 10);
  const [search, setSearch] = useState(params?.initialSearch || "");

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchTUK = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTUKList({
        page,
        limit,
        search: search || undefined,
      });
      setData(res.data);
      setTotal(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data TUK");
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  useEffect(() => {
    fetchTUK();
  }, [fetchTUK]);

  const refetch = () => fetchTUK();

  const changePage = (newPage: number) => setPage(newPage);

  const setSearchQuery = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const create = async (payload: CreateTUKRequest) => {
    const result = await createTUK(payload);
    await refetch();
    return result;
  };

  const update = async (id: number, payload: UpdateTUKRequest) => {
    const result = await updateTUK(id, payload);
    await refetch();
    return result;
  };

  const remove = async (id: number) => {
    await deleteTUK(id);
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
