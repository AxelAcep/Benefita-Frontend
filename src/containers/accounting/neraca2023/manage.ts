import { useState } from "react";
import { neracaData } from "./data-contoh";

export function useNeraca2023Manage() {
  const [search, setSearch] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [kode, setKode] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 4;

  const filtered = neracaData.filter((d) => {
    const matchSearch =
      d.kode.toLowerCase().includes(search.toLowerCase()) ||
      d.uraian.toLowerCase().includes(search.toLowerCase());
    const matchKode = kode ? d.kode === kode : true;
    return matchSearch && matchKode;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // Totals
  const totalDebet = filtered.reduce((sum, d) => {
    const val = parseFloat(d.debet.replace(/[^0-9]/g, "")) || 0;
    return sum + val;
  }, 0);
  const totalKredit = filtered.reduce((sum, d) => {
    const val = parseFloat(d.kredit.replace(/[^0-9]/g, "")) || 0;
    return sum + val;
  }, 0);
  const totalSaldo = filtered.reduce((sum, d) => {
    const val = parseFloat(d.saldo.replace(/[^0-9]/g, "")) || 0;
    return sum + val;
  }, 0);

  const total = filtered.length;

  return {
    search,
    setSearch,
    tanggal,
    setTanggal,
    kode,
    setKode,
    page,
    setPage,
    perPage,
    totalPages,
    paginated,
    total,
    totalDebet,
    totalKredit,
    totalSaldo,
  };
}
