"use client";

import { useState } from "react";
import { DATA_CONTOH } from "./data";

const PAGE_SIZE = 10;

export function usePengirimanBrosurManage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const query = search.trim().toLowerCase();

  const filtered = DATA_CONTOH.filter(({ nama, perusahaan, jabatan }) =>
    [nama, perusahaan, jabatan].some((value) => value.toLowerCase().includes(query)),
  );
  const start = (page - 1) * PAGE_SIZE;

  return {
    data: filtered.slice(start, start + PAGE_SIZE),
    total: filtered.length,
    totalPages: Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    page,
    pageSize: PAGE_SIZE,
    search,
    setPage,
    changeSearch(value: string) {
      setSearch(value);
      setPage(1);
    },
  };
}
