import { useState } from "react";
import { DUMMY_DATA } from "./data-contoh";

const PAGE_SIZE = 10;

export function usePesertaRekapTahunanManage() {
  const [search, setSearch] = useState("");
  const [selectedTahun, setSelectedTahun] = useState("2026");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = DUMMY_DATA.filter(
    (d) =>
      d.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
      d.kode.toLowerCase().includes(search.toLowerCase()),
  );

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  function changeSearch(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  return {
    PAGE_SIZE,
    search,
    selectedTahun,
    setSelectedTahun,
    currentPage,
    setCurrentPage,
    paginated,
    total,
    totalPages,
    changeSearch,
  };
}
