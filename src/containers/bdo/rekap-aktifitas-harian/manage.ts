"use client";
import { useState } from "react";
import { useRekapHarian } from "@/hooks/use-bdo-laporan";

export function useRekapHarianManage() {
  const [draftTanggal, setDraftTanggal] = useState(() => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Jakarta" }).format(new Date()));
  const [tanggal, setTanggal] = useState(draftTanggal);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const result = useRekapHarian(page, search, tanggal);
  return {
    ...result, total: result.pagination.total, totalPages: result.pagination.totalPages,
    page, pageSize: 10, setPage, search, draftTanggal, setDraftTanggal,
    labelTanggal: new Date(`${tanggal}T00:00:00+07:00`).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", day: "numeric", month: "long", year: "numeric" }),
    changeSearch(value: string) { setSearch(value); setPage(1); },
    terapkanTanggal() { if (draftTanggal) { setTanggal(draftTanggal); setPage(1); } },
  };
}
