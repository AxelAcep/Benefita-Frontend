import { useState } from "react";
import { DUMMY_DATA } from "./data-contoh";

export function usePesertaSertifikatBnspManage() {
  const [search, setSearch] = useState("");
  const [selectedLSP, setSelectedLSP] = useState("Semua");
  const [selectedKodePel, setSelectedKodePel] = useState("Semua");
  const [selectedTahun, setSelectedTahun] = useState("2026");
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 10;

  const handleTerapkan = () => {
    setCurrentPage(1);
  };

  const filtered = DUMMY_DATA.filter((d) => {
    const matchSearch =
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.perusahaan.toLowerCase().includes(search.toLowerCase());
    const matchLSP = selectedLSP === "Semua" || d.lsp === selectedLSP;
    const matchKode =
      selectedKodePel === "Semua" || d.kodePel === selectedKodePel;
    return matchSearch && matchLSP && matchKode;
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
    selectedLSP,
    setSelectedLSP,
    selectedKodePel,
    setSelectedKodePel,
    selectedTahun,
    setSelectedTahun,
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
