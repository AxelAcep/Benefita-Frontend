import { useState } from "react";
import { PERUSAHAAN_BNSP_CONTOH } from "./data-contoh";

const PAGE_SIZE = 10;

export function usePerusahaanBnspManage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const query = search.toLowerCase();
  const filtered = PERUSAHAAN_BNSP_CONTOH.filter(
    ({ perusahaan, noInduk }) =>
      perusahaan.toLowerCase().includes(query) ||
      noInduk.toLowerCase().includes(query),
  );
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
    total: filtered.length,
    totalPages: Math.ceil(filtered.length / PAGE_SIZE),
    rows: filtered.slice(offset, offset + PAGE_SIZE),
  };
}
