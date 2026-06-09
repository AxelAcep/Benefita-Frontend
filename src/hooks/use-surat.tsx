// hooks/usePermintaanSurat.ts
import { useState, useEffect } from "react";
import {
  getListPermintaanSurat,
  getPermintaanSuratById,
  createPermintaanSurat,
  updatePermintaanSurat,
  deletePermintaanSurat,
  PermintaanNomorSurat,
  CreatePermintaanSuratRequest,
  UpdatePermintaanSuratRequest,
} from "@/lib/services/surat.service";

interface UsePermintaanSuratProps {
  page?: number;
  limit?: number;
  tipe?: "umum" | "marketing" | "lsp";
  search?: string;
}

export const usePermintaanSurat = (props?: UsePermintaanSuratProps) => {
  const [data, setData] = useState<PermintaanNomorSurat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: props?.page || 1,
    limit: props?.limit || 10,
    total: 0,
    totalPages: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getListPermintaanSurat({
        page: pagination.page,
        limit: pagination.limit,
        tipe: props?.tipe,
        search: props?.search,
      });
      setData(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.limit, props?.tipe, props?.search]);

  const refetch = () => {
    fetchData();
  };

  const create = async (payload: CreatePermintaanSuratRequest) => {
    setLoading(true);
    try {
      const result = await createPermintaanSurat(payload);
      await fetchData();
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: number, payload: UpdatePermintaanSuratRequest) => {
    setLoading(true);
    try {
      const result = await updatePermintaanSurat(id, payload);
      await fetchData();
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: number) => {
    setLoading(true);
    try {
      await deletePermintaanSurat(id);
      await fetchData();
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setPage = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return {
    data,
    loading,
    error,
    pagination,
    create,
    update,
    remove,
    refetch,
    setPage,
  };
};

// Hook untuk detail
export const usePermintaanSuratDetail = (id: number | null) => {
  const [data, setData] = useState<PermintaanNomorSurat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getPermintaanSuratById(id);
        setData(result);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  return { data, loading, error };
};
