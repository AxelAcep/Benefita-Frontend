import { useState, useEffect, useCallback } from "react";
import {
  getLogPerubahan,
  LogPerubahanItem,
  LogPerubahanMeta,
} from "@/lib/services/perusahaan.service";

export function useLogPerubahan() {
  const [data, setData] = useState<LogPerubahanItem[]>([]);
  const [meta, setMeta] = useState<LogPerubahanMeta | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const limit = 10;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getLogPerubahan({ page, limit, search });
      setData(res.data);
      setMeta(res.meta);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
