import { useState } from "react";
import { usePerusahaanTbk } from "@/hooks/use-perusahaan-tbk";

export function usePerusahaanTbkManage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const result = usePerusahaanTbk(page, search, sort);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function toggleSort() {
    setSort((value) => (value === "asc" ? "desc" : "asc"));
    setPage(1);
  }

  return { ...result, search, page, sort, setPage, handleSearch, toggleSort };
}
