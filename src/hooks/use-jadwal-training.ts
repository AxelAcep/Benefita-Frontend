import { useState, useCallback } from "react";
import {
  getJadwalTraining,
  getJadwalTrainingById,
  createJadwalTraining,
  updateJadwalTraining,
  deleteJadwalTraining,
  getNextNoJadwal,
  type JadwalTrainingListItem,
  type JadwalTraining,
  type JadwalTrainingPagination,
  type CreateJadwalTrainingRequest,
  type UpdateJadwalTrainingRequest,
} from "@/lib/services/jadwal-training.service";

// ─────────────────────────────────────────────
// LIST HOOK
// ─────────────────────────────────────────────

interface UseJadwalTrainingListParams {
  initialLimit?: number;
}

export function useJadwalTrainingList({
  initialLimit = 10,
}: UseJadwalTrainingListParams = {}) {
  const [data, setData] = useState<JadwalTrainingListItem[]>([]);
  const [meta, setMeta] = useState<JadwalTrainingPagination>({
    total: 0,
    page: 1,
    limit: initialLimit,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterMetode, setFilterMetode] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [appliedJenis, setAppliedJenis] = useState("");
  const [appliedMetode, setAppliedMetode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetch = useCallback(
    async (params?: {
      page?: number;
      search?: string;
      status?: string;
      jenisTraining?: string;
      metode?: string;
    }) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getJadwalTraining({
          page: params?.page ?? currentPage,
          limit: initialLimit,
          search: params?.search ?? search,
          status: params?.status ?? appliedStatus,
          jenisTraining: params?.jenisTraining ?? appliedJenis,
          metode: params?.metode ?? appliedMetode,
        });
        setData(res.data);
        setMeta(res.meta);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setIsLoading(false);
      }
    },
    [
      currentPage,
      search,
      appliedStatus,
      appliedJenis,
      appliedMetode,
      initialLimit,
    ],
  );

  const handleSearch = useCallback(
    (val: string) => {
      setSearch(val);
      setCurrentPage(1);
      fetch({
        page: 1,
        search: val,
        status: appliedStatus,
        jenisTraining: appliedJenis,
        metode: appliedMetode,
      });
    },
    [fetch, appliedStatus, appliedJenis, appliedMetode],
  );

  const handleTerapkan = useCallback(() => {
    setAppliedStatus(filterStatus);
    setAppliedJenis(filterJenis);
    setAppliedMetode(filterMetode);
    setCurrentPage(1);
    fetch({
      page: 1,
      search,
      status: filterStatus,
      jenisTraining: filterJenis,
      metode: filterMetode,
    });
  }, [fetch, filterStatus, filterJenis, filterMetode, search]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetch({
        page,
        search,
        status: appliedStatus,
        jenisTraining: appliedJenis,
        metode: appliedMetode,
      });
    },
    [fetch, search, appliedStatus, appliedJenis, appliedMetode],
  );

  return {
    data,
    meta,
    isLoading,
    error,
    search,
    currentPage,
    filterStatus,
    setFilterStatus,
    filterJenis,
    setFilterJenis,
    filterMetode,
    setFilterMetode,
    fetch,
    handleSearch,
    handleTerapkan,
    handlePageChange,
  };
}

// ─────────────────────────────────────────────
// DETAIL HOOK
// ─────────────────────────────────────────────

export function useJadwalTrainingDetail() {
  const [data, setData] = useState<JadwalTraining | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getJadwalTrainingById(id);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil detail");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, fetch };
}

// ─────────────────────────────────────────────
// NEXT NO. JADWAL HOOK (auto-generate)
// ─────────────────────────────────────────────

export function useNextNoJadwal() {
  const [noJadwal, setNoJadwal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getNextNoJadwal();
      setNoJadwal(res.noJadwal);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil nomor jadwal berikutnya",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { noJadwal, isLoading, error, fetch };
}

// ─────────────────────────────────────────────
// MUTATION HOOK
// ─────────────────────────────────────────────

interface UseJadwalTrainingMutationOptions {
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

export function useJadwalTrainingMutation({
  onSuccess,
  onError,
}: UseJadwalTrainingMutationOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = useCallback(
    async (payload: CreateJadwalTrainingRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        await createJadwalTraining(payload);
        onSuccess?.();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Gagal membuat data";
        setError(msg);
        onError?.(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, onError],
  );

  const handleUpdate = useCallback(
    async (id: string, payload: UpdateJadwalTrainingRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        await updateJadwalTraining(id, payload);
        onSuccess?.();
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Gagal mengupdate data";
        setError(msg);
        onError?.(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, onError],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);
      try {
        await deleteJadwalTraining(id);
        onSuccess?.();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Gagal menghapus data";
        setError(msg);
        onError?.(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess, onError],
  );

  return { isLoading, error, handleCreate, handleUpdate, handleDelete };
}
