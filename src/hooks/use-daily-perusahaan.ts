import { useState, useEffect, useCallback, useRef } from "react";
import {
  getDailyActivityList,
  getOneDailyActivity,
  createDailyActivity,
  updateDailyActivity,
  deleteDailyActivity,
  type GetDailyActivityListResponse,
  type GetDailyActivityListParams,
  type DailyActivityItem,
  type DailyActivityPayload,
} from "@/lib/services/perusahaan.service";

// ─────────────────────────────────────────────
// HOOK: GET LIST (Paginated + Search)
// ─────────────────────────────────────────────

export function useGetDailyActivityList(noInduk: string, params?: GetDailyActivityListParams) {
  const [data, setData] = useState<GetDailyActivityListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const request = useRef(0);
  const fetch = useCallback(async () => {
    const current = ++request.current;
    setIsLoading(true);
    setError(null);
    try {
      const result = await getDailyActivityList(noInduk, params);
      if (current === request.current) setData(result);
    } catch (err: unknown) {
      if (current === request.current) { setData(null); setError(err instanceof Error ? err.message : "Gagal mengambil daily."); }
    } finally {
      if (current === request.current) setIsLoading(false);
    }
  }, [noInduk, params?.page, params?.limit, params?.search]);
  useEffect(() => { fetch(); return () => { request.current++; }; }, [fetch]);
  return { data, isLoading, error, refetch: fetch };
}

export function useGetOneDailyActivity(noInduk: string, id: string | null) {
  const [data, setData] = useState<DailyActivityItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const request = useRef(0);
  const fetch = useCallback(async () => {
    const current = ++request.current;
    setData(null);
    setError(null);
    if (!id) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const result = await getOneDailyActivity(noInduk, id);
      if (current === request.current) setData(result.data);
    } catch (err: unknown) {
      if (current === request.current) setError(err instanceof Error ? err.message : "Gagal mengambil detail daily.");
    } finally {
      if (current === request.current) setIsLoading(false);
    }
  }, [noInduk, id]);
  useEffect(() => { fetch(); return () => { request.current++; }; }, [fetch]);
  return { data: data?.id === id ? data : null, isLoading, error, refetch: fetch };
}

// ─────────────────────────────────────────────
// HOOK: CREATE
// ─────────────────────────────────────────────

export function useCreateDailyActivity() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (
    noInduk: string,
    payload: DailyActivityPayload,
    options?: {
      onSuccess?: () => void;
      onError?: (msg: string) => void;
    },
  ) => {
    setIsLoading(true);
    try {
      await createDailyActivity(noInduk, payload);
      options?.onSuccess?.();
    } catch (err: any) {
      options?.onError?.(err.message || "Gagal menambahkan daily activity.");
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading };
}

// ─────────────────────────────────────────────
// HOOK: UPDATE
// ─────────────────────────────────────────────

export function useUpdateDailyActivity() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (
    noInduk: string,
    id: string,
    payload: Partial<DailyActivityPayload>,
    options?: {
      onSuccess?: () => void;
      onError?: (msg: string) => void;
    },
  ) => {
    setIsLoading(true);
    try {
      await updateDailyActivity(noInduk, id, payload);
      options?.onSuccess?.();
    } catch (err: any) {
      options?.onError?.(err.message || "Gagal memperbarui daily activity.");
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading };
}

// ─────────────────────────────────────────────
// HOOK: DELETE
// ─────────────────────────────────────────────

export function useDeleteDailyActivity() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (
    noInduk: string,
    id: string,
    options?: {
      onSuccess?: () => void;
      onError?: (msg: string) => void;
    },
  ) => {
    setIsLoading(true);
    try {
      await deleteDailyActivity(noInduk, id);
      options?.onSuccess?.();
    } catch (err: any) {
      options?.onError?.(err.message || "Gagal menghapus daily activity.");
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading };
}
