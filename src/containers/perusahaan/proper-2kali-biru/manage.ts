import { useState } from "react";
import { DATA_CONTOH } from "./data-contoh";

export function usePerusahaanProper2kaliBiruManage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBDO, setSelectedBDO] = useState("");
  const [appliedBDO, setAppliedBDO] = useState("");

  const PAGE_SIZE = 10;

  const handleTerapkan = () => {
    setAppliedBDO(selectedBDO);
    setCurrentPage(1);
  };

  const filtered = appliedBDO
    ? DATA_CONTOH.filter((d) => {
        const matchBDO = d.bdo === appliedBDO;
        const matchSearch =
          d.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
          d.noInduk.toLowerCase().includes(search.toLowerCase());
        return matchBDO && matchSearch;
      })
    : [];

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const hasApplied = appliedBDO !== "";

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
    selectedBDO,
    appliedBDO,
    setSelectedBDO,
    hasApplied,
    handleTerapkan,
    total: filtered.length,
  };
}
