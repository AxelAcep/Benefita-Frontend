import { useState, useEffect, useCallback } from "react";
import {
  getContactPersonList,
  getOneContactPerson,
  createContactPerson,
  updateContactPerson,
  deleteContactPerson,
  type GetContactPersonListResponse,
  type GetContactPersonListParams,
  type ContactPersonItem,
  type ContactPersonPayload,
} from "@/lib/services/perusahaan.service";

// ─────────────────────────────────────────────
// HOOK: GET LIST (Paginated + Search)
// ─────────────────────────────────────────────

export function useGetContactPersonList(
  noInduk: string,
  params?: GetContactPersonListParams,
) {
  const [data, setData] = useState<GetContactPersonListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getContactPersonList(noInduk, params);
      setData(result);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  }, [noInduk, params?.page, params?.limit, params?.search]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

// ─────────────────────────────────────────────
// HOOK: GET ONE
// ─────────────────────────────────────────────

export function useGetOneContactPerson(noInduk: string, kode: string | null) {
  const [data, setData] = useState<ContactPersonItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!kode) return; // gak fetch kalau kode null
    setIsLoading(true);
    setError(null);
    try {
      const result = await getOneContactPerson(noInduk, kode);
      setData(result.data);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  }, [noInduk, kode]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, isLoading, error, refetch: fetch };
}

// ─────────────────────────────────────────────
// HOOK: CREATE
// ─────────────────────────────────────────────

export function useCreateContactPerson() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (
    noInduk: string,
    payload: ContactPersonPayload,
    options?: {
      onSuccess?: () => void;
      onError?: (msg: string) => void;
    },
  ) => {
    setIsLoading(true);
    try {
      await createContactPerson(noInduk, payload);
      options?.onSuccess?.();
    } catch (err: any) {
      options?.onError?.(err.message || "Gagal menambahkan contact person.");
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading };
}

// ─────────────────────────────────────────────
// HOOK: UPDATE
// ─────────────────────────────────────────────

export function useUpdateContactPerson() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (
    noInduk: string,
    kode: string,
    payload: Partial<ContactPersonPayload>,
    options?: {
      onSuccess?: () => void;
      onError?: (msg: string) => void;
    },
  ) => {
    setIsLoading(true);
    try {
      await updateContactPerson(noInduk, kode, payload);
      options?.onSuccess?.();
    } catch (err: any) {
      options?.onError?.(err.message || "Gagal memperbarui contact person.");
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading };
}

// ─────────────────────────────────────────────
// HOOK: DELETE
// ─────────────────────────────────────────────

export function useDeleteContactPerson() {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (
    noInduk: string,
    kode: string,
    options?: {
      onSuccess?: () => void;
      onError?: (msg: string) => void;
    },
  ) => {
    setIsLoading(true);
    try {
      await deleteContactPerson(noInduk, kode);
      options?.onSuccess?.();
    } catch (err: any) {
      options?.onError?.(err.message || "Gagal menghapus contact person.");
    } finally {
      setIsLoading(false);
    }
  };

  return { mutate, isLoading };
}
