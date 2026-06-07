import { useCallback, useEffect, useState } from "react";
import {
  getHotels,
  createHotel,
  updateHotel,
  deleteHotel,
  Hotel,
  CreateHotelRequest,
  UpdateHotelRequest,
} from "@/lib/services/hotel.service";

// ─────────────────────────────────────────────
// TYPES STATE
// ─────────────────────────────────────────────

interface UseHotelsParams {
  initialPage?: number;
  initialLimit?: number;
  initialKota?: string;
  initialSearch?: string;
}

// ─────────────────────────────────────────────
// HOOK
// ─────────────────────────────────────────────

export function useHotels(params?: UseHotelsParams) {
  const [data, setData] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(params?.initialPage || 1);
  const [limit, setLimit] = useState(params?.initialLimit || 10);
  const [kota, setKota] = useState(params?.initialKota || "");
  const [search, setSearch] = useState(params?.initialSearch || "");

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // ─────────────────────────────────────────────
  // FETCH DATA
  // ─────────────────────────────────────────────

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getHotels({
        page,
        limit,
        kota: kota || undefined,
        search: search || undefined,
      });

      setData(res.data);
      setTotal(res.pagination.total);
      setTotalPages(res.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data hotel");
    } finally {
      setLoading(false);
    }
  }, [page, limit, kota, search]);

  // auto fetch
  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  // ─────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────

  const refetch = () => fetchHotels();

  const changePage = (newPage: number) => setPage(newPage);

  const changeLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const setFilterKota = (value: string) => {
    setKota(value);
    setPage(1);
  };

  const setSearchQuery = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  // ─────────────────────────────────────────────
  // CRUD ACTIONS
  // ─────────────────────────────────────────────

  const create = async (payload: CreateHotelRequest) => {
    const result = await createHotel(payload);
    await refetch();
    return result;
  };

  const update = async (id: string, payload: UpdateHotelRequest) => {
    const result = await updateHotel(id, payload);
    await refetch();
    return result;
  };

  const remove = async (id: string) => {
    await deleteHotel(id);
    await refetch();
  };

  // ─────────────────────────────────────────────
  // RETURN
  // ─────────────────────────────────────────────

  return {
    // data
    data,
    loading,
    error,

    // pagination
    page,
    limit,
    total,
    totalPages,

    // filters
    kota,
    search,

    // setters
    setPage: changePage,
    setLimit: changeLimit,
    setKota: setFilterKota,
    setSearch: setSearchQuery,

    // actions
    refetch,
    create,
    update,
    remove,
  };
}
