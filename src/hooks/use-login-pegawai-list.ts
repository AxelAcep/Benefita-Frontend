import { useState, useEffect, useCallback } from "react";
import {
  getPegawaiLogin,
  PegawaiLoginItem,
  PegawaiLoginMeta,
} from "@/lib/services/login.service";

export function usePegawaiLogin() {
  const [data, setData] = useState<PegawaiLoginItem[]>([]);
  const [meta, setMeta] = useState<PegawaiLoginMeta | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limit = 10;

  const fetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getPegawaiLogin({ page, limit, search });
      setData(res.data);
      setMeta(res.meta);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Reset ke page 1 kalau search berubah
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return {
    data,
    meta,
    search,
    page,
    isLoading,
    error,
    setPage,
    handleSearch,
  };
}
