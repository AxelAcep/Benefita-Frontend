"use client";
import { useState } from "react";
import { usePengirimanBrosur } from "@/hooks/use-bdo-laporan";

export function usePengirimanBrosurManage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const result = usePengirimanBrosur(page, search);
  return {
    ...result, total: result.pagination.total, totalPages: result.pagination.totalPages,
    page, pageSize: 10, search, setPage,
    changeSearch(value: string) { setSearch(value); setPage(1); },
  };
}
