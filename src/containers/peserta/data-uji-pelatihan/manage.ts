import { useState } from "react";
import { DUMMY_DATA } from "./data-contoh";

const PAGE_SIZE = 4;

export function usePesertaDataUjiPelatihanManage() {
  const [search, setSearch] = useState("");
  const [kodePelatihan, setKodePelatihan] = useState("");
  const [appliedKode, setAppliedKode] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = DUMMY_DATA.filter((d) => {
    const matchSearch =
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.inPer.toLowerCase().includes(search.toLowerCase()) ||
      d.perusahaan.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

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
    kodePelatihan,
    setKodePelatihan,
    setAppliedKode,
    currentPage,
    setCurrentPage,
    paginated,
    total,
    totalPages,
  };
}
