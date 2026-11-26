"use client";

import { useState } from "react";
import { DATA_CONTOH, TANGGAL_CONTOH } from "./data";

const PAGE_SIZE = 10;

const formatTanggal = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

export function useRekapHarianManage() {
  const [draftTanggal, setDraftTanggal] = useState(TANGGAL_CONTOH);
  const [tanggal, setTanggal] = useState(TANGGAL_CONTOH);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const query = search.trim().toLowerCase();
  const tersedia = tanggal === TANGGAL_CONTOH;
  const filtered = tersedia
    ? DATA_CONTOH.filter(({ nama }) => nama.toLowerCase().includes(query))
    : [];
  const start = (page - 1) * PAGE_SIZE;

  return {
    draftTanggal,
    setDraftTanggal,
    terapkanTanggal() {
      if (!draftTanggal) return;
      setTanggal(draftTanggal);
      setPage(1);
    },
    labelTanggal: formatTanggal.format(new Date(tanggal)),
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
