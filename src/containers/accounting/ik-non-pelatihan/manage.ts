"use client";

import { useMemo, useState } from "react";

export interface InvoiceItem {
  id: number;
  noKwitansi: string | null;
  noInvoice: string;
  nama: string;
  instansi: string;
  kodePelTgl: string;
  harga: string;
  bayar: number;
  acc: string;
  status: "B. Bayar" | "Lunas" | "Pending";
}

export function useIKNonPelatihanManage(data: InvoiceItem[]) {
  const [tanggal, setTanggal] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  function applyFilters() {
    setAppliedStatus(selectedStatus);
    setCurrentPage(1);
  }

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return data.filter((item) => {
      const matchesStatus = !appliedStatus || item.status === appliedStatus;
      const matchesSearch = [item.nama, item.noInvoice, item.instansi, item.noKwitansi ?? ""]
        .some((value) => value.toLowerCase().includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [data, appliedStatus, search]);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return {
    tanggal,
    setTanggal,
    selectedStatus,
    setSelectedStatus,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    pageSize,
    filtered,
    paginated,
    totalPages,
    applyFilters,
  };
}
