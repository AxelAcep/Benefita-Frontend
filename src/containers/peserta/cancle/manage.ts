import { useState } from "react";
import { DUMMY_DATA } from "./data-contoh";

const PAGE_SIZE = 10;

export function usePesertaCancleManage() {
  const [search, setSearch] = useState("");
  const [selectedTanggal, setSelectedTanggal] = useState("");
  const [selectedKode, setSelectedKode] = useState("Pilih Kode");
  const [selectedAccount, setSelectedAccount] = useState("Pilih Account");
  const [currentPage, setCurrentPage] = useState(1);

  const handleTerapkan = () => {
    setCurrentPage(1);
  };

  const filtered = DUMMY_DATA.filter(
    (d) =>
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.perusahaan.toLowerCase().includes(search.toLowerCase()),
  );

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );


  const total = filtered.length;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return {
    PAGE_SIZE,
    search,
    setSearch,
    selectedTanggal,
    setSelectedTanggal,
    selectedKode,
    setSelectedKode,
    selectedAccount,
    setSelectedAccount,
    currentPage,
    setCurrentPage,
    handleTerapkan,
    paginated,
    total,
    totalPages,
  };
}
