import { useState } from "react";
import { DUMMY_DATA } from "./data-contoh";

export function usePesertaFinalManage() {
  const [search, setSearch] = useState("");
  const [filterNama, setFilterNama] = useState("");
  const [filterInstansi, setFilterInstansi] = useState("");
  const [filterMinat, setFilterMinat] = useState("");
  const [filterAccount, setFilterAccount] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 10;

  const handleTerapkan = () => {
    setCurrentPage(1);
  };

  // For demo purposes, filter locally on the 4 rows
  const filtered = DUMMY_DATA.filter((d) => {
    const matchNama = d.nama.toLowerCase().includes(filterNama.toLowerCase());
    const matchInstansi = d.perusahaan
      .toLowerCase()
      .includes(filterInstansi.toLowerCase());
    const matchSearch =
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.perusahaan.toLowerCase().includes(search.toLowerCase());
    return matchNama && matchInstansi && matchSearch;
  });

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
    search,
    filterNama,
    setFilterNama,
    filterInstansi,
    setFilterInstansi,
    filterMinat,
    setFilterMinat,
    filterAccount,
    setFilterAccount,
    currentPage,
    setCurrentPage,
    PAGE_SIZE,
    handleTerapkan,
    paginated,
    total,
    totalPages,
    changeSearch,
  };
}
