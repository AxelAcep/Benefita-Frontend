import { useState } from "react";
import { DUMMY_DATA } from "./data-contoh";

const PAGE_SIZE = 10;

export function usePesertaRekapCustomerManage() {
  const [search, setSearch] = useState("");
  const [selectedDatabase, setSelectedDatabase] = useState("Pilih Database");
  const [selectedLineBisnis, setSelectedLineBisnis] =
    useState("Pilih Line Bisnis");
  const [currentPage, setCurrentPage] = useState(1);

  const handleTerapkan = () => setCurrentPage(1);

  const filtered = DUMMY_DATA.filter(
    (d) =>
      d.perusahaan.toLowerCase().includes(search.toLowerCase()) ||
      d.noInduk.toLowerCase().includes(search.toLowerCase()),
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
    selectedDatabase,
    setSelectedDatabase,
    selectedLineBisnis,
    setSelectedLineBisnis,
    currentPage,
    setCurrentPage,
    handleTerapkan,
    paginated,
    total,
    totalPages,
    changeSearch,
  };
}
