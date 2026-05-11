import { useState, useEffect, useCallback } from "react";
import {
  getOnePerusahaan,
  updatePerusahaan,
  type PerusahaanMapped,
  type UpdatePerusahaanPayload,
} from "@/lib/services/perusahaan.service"; // sesuaikan path

// ─────────────────────────────────────────────
// useGetOnePerusahaan
// ─────────────────────────────────────────────

interface UseGetOnePerusahaanReturn {
  data: PerusahaanMapped | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGetOnePerusahaan(
  noInduk: string,
): UseGetOnePerusahaanReturn {
  const [data, setData] = useState<PerusahaanMapped | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!noInduk) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await getOnePerusahaan(noInduk);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  }, [noInduk]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

// ─────────────────────────────────────────────
// useUpdatePerusahaan
// ─────────────────────────────────────────────

interface MutateCallbacks {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}

interface UseUpdatePerusahaanReturn {
  mutate: (
    noInduk: string,
    payload: UpdatePerusahaanPayload,
    callbacks?: MutateCallbacks,
  ) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
  reset: () => void;
}

export function useUpdatePerusahaan(): UseUpdatePerusahaanReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const reset = useCallback(() => {
    setError(null);
    setIsSuccess(false);
  }, []);

  const mutate = useCallback(
    async (
      noInduk: string,
      payload: UpdatePerusahaanPayload,
      callbacks?: MutateCallbacks,
    ) => {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      try {
        await updatePerusahaan(noInduk, payload);
        setIsSuccess(true);
        callbacks?.onSuccess?.();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Terjadi kesalahan.";
        setError(message);
        callbacks?.onError?.(message);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { mutate, isLoading, error, isSuccess, reset };
}
