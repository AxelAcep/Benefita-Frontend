import { useState } from "react";
import { usePerusahaanJabatanTeknis } from "@/hooks/use-perusahaan-jabatan-teknis";

export function usePerusahaanJabatanTeknisManage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;
  const result = usePerusahaanJabatanTeknis(currentPage, search);
  function changeSearch(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }
  return {
    ...result, search, changeSearch, currentPage, setCurrentPage, PAGE_SIZE,
    paginated: result.data, totalPages: result.pagination.totalPages, total: result.pagination.total,
  };
}
