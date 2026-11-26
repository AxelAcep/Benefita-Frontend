import { useState } from "react";
import { DUMMY_DATA } from "./data-contoh";

const PAGE_SIZE = 4;

export function usePesertaRekapPelatihanManage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = DUMMY_DATA.filter(
    (d) =>
      d.judul.toLowerCase().includes(search.toLowerCase()) ||
      d.kode.toLowerCase().includes(search.toLowerCase()),
  );

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, "...ellipsis", totalPages);
    }
    return pages;
  };
  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  function changeSearch(value: string) {
    setSearch(value);
    setCurrentPage(1);
  }

  return {
    PAGE_SIZE,
    search,
    currentPage,
    setCurrentPage,
    paginated,
    total,
    totalPages,
    changeSearch,
  };
}
