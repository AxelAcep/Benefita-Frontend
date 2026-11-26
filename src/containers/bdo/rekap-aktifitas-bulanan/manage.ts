"use client";

import { useState } from "react";
import { BULAN_CONTOH, DATA_CONTOH } from "./data";

const PAGE_SIZE = 10;

export function useRekapBulananManage() {
  const [draftBulan, setDraftBulan] = useState(BULAN_CONTOH);
  const [bulan, setBulan] = useState(BULAN_CONTOH);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [tahun, nomorBulan] = bulan.split("-").map(Number);
  const jumlahHari = new Date(tahun, nomorBulan, 0).getDate();
  const hari = Array.from({ length: jumlahHari }, (_, index) => index + 1);
  const labelBulan = new Date(tahun, nomorBulan - 1, 1)
    .toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  const query = search.trim().toLowerCase();
  const tersedia = bulan === BULAN_CONTOH;
  const filtered = tersedia
    ? DATA_CONTOH.filter(({ nama }) => nama.toLowerCase().includes(query))
    : [];
  const start = (page - 1) * PAGE_SIZE;

  return {
    draftBulan,
    setDraftBulan,
    terapkanBulan() {
      if (!draftBulan) return;
      setBulan(draftBulan);
      setPage(1);
    },
    labelBulan,
    hari,
    tersedia,
    data: filtered.slice(start, start + PAGE_SIZE),
    total: filtered.length,
    totalPages: Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
    page,
    pageSize: PAGE_SIZE,
    setPage,
    search,
    changeSearch(value: string) {
      setSearch(value);
      setPage(1);
    },
  };
}
