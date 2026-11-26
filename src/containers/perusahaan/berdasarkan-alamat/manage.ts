import { useState } from "react";
import { usePerusahaanByAlamat } from "@/hooks/use-perusahaan-by-alamat";

export function usePerusahaanByAlamatManage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const result = usePerusahaanByAlamat(page, search);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return {
    ...result,
    search,
    page,
    setPage,
    handleSearch,
  };
}
