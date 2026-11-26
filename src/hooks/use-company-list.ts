"use client";

import { useEffect, useState } from "react";
import type { ListParams } from "@/lib/api/client";

interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

interface CompanyList<T> {
  data: T[];
  pagination: Pagination;
}

// Empat daftar memakai kontrak yang sama. useResource belum membatalkan fetch
// atau menunda search, jadi alur baca ini dipakai bersama tanpa mengubah CRUD.
export function useCompanyList<T, P extends ListParams>(
  loader: (params: P, signal?: AbortSignal) => Promise<CompanyList<T>>,
  params: P,
  enabled = true,
) {
  const search = params.search ?? "";
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [state, setState] = useState<CompanyList<T> & { key: string; error: string | null }>({
    data: [], pagination: { total: 0, totalPages: 0, currentPage: 1, pageSize: 10 },
    key: "", error: null,
  });
  const waitingForSearch = search !== debouncedSearch;
  const key = JSON.stringify({ ...params, search: debouncedSearch });
  const loading = enabled && (waitingForSearch || state.key !== key);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (!enabled || waitingForSearch) return;
    const controller = new AbortController();
    loader(JSON.parse(key) as P, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setState({ ...result, key, error: null });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setState((current) => ({ ...current, key,
          error: err instanceof Error ? err.message : "Gagal mengambil daftar perusahaan.",
        }));
      });
    return () => controller.abort();
  }, [key, loader, waitingForSearch, enabled]);

  return { data: enabled ? state.data : [], pagination: state.pagination, loading, error: !enabled || loading ? null : state.error };
}
