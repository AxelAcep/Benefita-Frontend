import { useState } from "react";
import { DATA_CONTOH } from "./data-contoh";

export function usePerusahaanKantorPusatManage() {
  const PAGE_SIZE = 10;
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"semua" | "customer">("semua");
  const [appliedFilter, setAppliedFilter] = useState<"semua" | "customer">(
    "semua",
  );
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = DATA_CONTOH.filter((d) => {
    const matchFilter = appliedFilter === "semua" || d.type === "customer";
    const matchSearch =
      d.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
      d.noInduk.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

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
    paginated,
    totalPages,
    PAGE_SIZE,
    filterType,
    setFilterType,
    handleTerapkan,
    total: filtered.length,
  };
}
