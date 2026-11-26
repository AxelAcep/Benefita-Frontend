import { useState } from "react";
import { usePerusahaanKantorPusat } from "@/hooks/use-perusahaan-kantor-pusat";

export function usePerusahaanKantorPusatManage() {
  const PAGE_SIZE = 10;
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"semua" | "customer">("customer");
  const [appliedFilter, setAppliedFilter] = useState<"semua" | "customer">(
    "customer",
  );
  const [currentPage, setCurrentPage] = useState(1);

  const result = usePerusahaanKantorPusat(currentPage, search, appliedFilter, PAGE_SIZE);

  function handleTerapkan() {
    setAppliedFilter(filterType);
    setCurrentPage(1);
  }

  function changeSearch(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  return {
    search,
    changeSearch,
    currentPage,
    setCurrentPage,
    paginated: result.data,
    totalPages: result.totalPages,
    PAGE_SIZE,
    filterType,
    setFilterType,
    handleTerapkan,
    total: result.total,
    loading: result.loading,
    error: result.error,
  };
}
