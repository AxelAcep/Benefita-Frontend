import { useState, useCallback } from "react";
import {
  getJudulTraining,
  getJudulTrainingById,
  createJudulTraining,
  updateJudulTraining,
  type JudulTrainingListItem,
  type JudulTrainingPagination,
  type CreateJudulTrainingRequest,
  type UpdateJudulTrainingRequest,
  JudulTraining,
} from "@/lib/services/judul-training.service";
import { JudulTrainingFormData } from "@/app/training/judul/ModalJudulTraining";

// ─────────────────────────────────────────────
// LIST + FILTER HOOK
// ─────────────────────────────────────────────

interface UseJudulTrainingListParams {
  initialPage?: number;
  initialLimit?: number;
}

export function useJudulTrainingList({
  initialPage = 1,
  initialLimit = 10,
}: UseJudulTrainingListParams = {}) {
  const [data, setData] = useState<JudulTrainingListItem[]>([]);
  const [meta, setMeta] = useState<JudulTrainingPagination>({
    total: 0,
    page: initialPage,
    limit: initialLimit,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter & search state
  const [search, setSearch] = useState("");
  const [filterTipe, setFilterTipe] = useState("");
  const [filterKode, setFilterKode] = useState("");
  const [appliedTipe, setAppliedTipe] = useState("");
  const [appliedKode, setAppliedKode] = useState("");
  const [currentPage, setCurrentPage] = useState(initialPage);

  const fetch = useCallback(
    async (params?: {
      page?: number;
      search?: string;
      tipe?: string;
      kode?: string;
    }) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await getJudulTraining({
          page: params?.page ?? currentPage,
          limit: initialLimit,
          search: params?.search ?? search,
          tipe: params?.tipe ?? appliedTipe,
          kode: params?.kode ?? appliedKode,
        });
        setData(res.data);
        setMeta(res.meta);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setIsLoading(false);
      }
    },
    [currentPage, search, appliedTipe, appliedKode, initialLimit],
  );

  const handleSearch = useCallback(
    (val: string) => {
      setSearch(val);
      setCurrentPage(1);
      fetch({ page: 1, search: val, tipe: appliedTipe, kode: appliedKode });
    },
    [fetch, appliedTipe, appliedKode],
  );

  const handleTerapkan = useCallback(() => {
    setAppliedTipe(filterTipe);
    setAppliedKode(filterKode);
    setCurrentPage(1);
    fetch({ page: 1, search, tipe: filterTipe, kode: filterKode });
  }, [fetch, filterTipe, filterKode, search]);

  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetch({ page, search, tipe: appliedTipe, kode: appliedKode });
    },
    [fetch, search, appliedTipe, appliedKode],
  );

  return {
    // data
    data,
    meta,
    isLoading,
    error,
    // filter state
    search,
    filterTipe,
    setFilterTipe,
    filterKode,
    setFilterKode,
    currentPage,
    // handlers
    fetch,
    handleSearch,
    handleTerapkan,
    handlePageChange,
  };
}

// ─────────────────────────────────────────────
// MUTATION HOOK (create / edit)
// ─────────────────────────────────────────────

function formDataToRequest(
  form: JudulTrainingFormData,
): CreateJudulTrainingRequest | UpdateJudulTrainingRequest {
  return {
    kode: form.kode,
    judulTraining: form.judulTraining,
    tipe: form.tipe,
    hari: form.hari as number,
    biayaOffline: form.biayaOffline as number,
    biayaOnline: form.biayaOnline as number,
    batch: form.batch as number,
    brosur: form.brosur ?? undefined,
  };
}

interface UseJudulTrainingMutationOptions {
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

export function useJudulTrainingMutation({
  onSuccess,
  onError,
}: UseJudulTrainingMutationOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = useCallback(
    async (form: JudulTrainingFormData) => {
      setIsLoading(true);
      setError(null);
      try {
        await createJudulTraining(
          formDataToRequest(form) as CreateJudulTrainingRequest,
        );
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
    async (id: number, form: JudulTrainingFormData) => {
      setIsLoading(true);
      setError(null);
      try {
        await updateJudulTraining(id, formDataToRequest(form));
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

  return { isLoading, error, handleCreate, handleUpdate };
}

// ─────────────────────────────────────────────
// DETAIL HOOK
// ─────────────────────────────────────────────

export function useJudulTrainingDetail() {
  const [data, setData] = useState<JudulTraining | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (id: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getJudulTrainingById(id);
      setData(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengambil detail");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, isLoading, error, fetch };
}
