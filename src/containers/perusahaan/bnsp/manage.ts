import { useState } from "react";
import { usePerusahaanBnsp } from "@/hooks/use-perusahaan-bnsp";

const PAGE_SIZE = 10;

export function usePerusahaanBnspManage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const result = usePerusahaanBnsp(page, search, PAGE_SIZE);
  const offset = (page - 1) * PAGE_SIZE;

  function changeSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return {
    search,
    changeSearch,
    page,
    setPage,
    limit: PAGE_SIZE,
    offset,
    total: result.total,
    totalPages: result.totalPages,
    rows: result.data,
    loading: result.loading,
    error: result.error,
  };
}
