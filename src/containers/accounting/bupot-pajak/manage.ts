"use client";

import { useMemo, useState } from "react";

export interface InvoiceListItem {
  id: number;
  instansi: string;
  noInvoice: string;
  kodePelTgl: string;
  harga: string;
  bayar: string | number;
  pengirimanBerkas: string;
  pengirimanDitujukan: string;
  pengirimanPenerima: string;
  bupot: string;
}

export function useBupotPajakManage(data: InvoiceListItem[]) {
  const [search, setSearch] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 4;
  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    return data.filter((item) =>
      [item.instansi, item.noInvoice, item.kodePelTgl].some((value) =>
        value.toLowerCase().includes(query),
      ),
    );
  }, [data, search]);
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return {
    search,
    setSearch,
    tanggal,
    setTanggal,
    page,
    setPage,
    perPage,
    filtered,
    paginated,
    totalPages,
  };
}
