"use client";

import { useState } from "react";
import { DATA_CONTOH } from "./data";

const PAGE_SIZE = 7;

export function useWhatsappStoryManage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const filtered = DATA_CONTOH.filter(({ judulTraining, tanggalPelatihan }) =>
    [judulTraining, tanggalPelatihan].some((value) => value.toLowerCase().includes(query)),
  );
  const start = (page - 1) * PAGE_SIZE;

  return {
    page,
    setPage,
    search,
    changeSearch(value: string) {
      setSearch(value);
      setPage(1);
    },
    pageSize: PAGE_SIZE,
    data: filtered.slice(start, start + PAGE_SIZE),
    total: filtered.length,
    totalPages: Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
  };
}
