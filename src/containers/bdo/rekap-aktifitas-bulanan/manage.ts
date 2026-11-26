"use client";
import { useState } from "react";
import { useRekapBulanan } from "@/hooks/use-bdo-laporan";

export function useRekapBulananManage() {
  const [draftBulan, setDraftBulan] = useState(() => new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Jakarta" }).format(new Date()).slice(0, 7));
  const [bulan, setBulan] = useState(draftBulan);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const result = useRekapBulanan(page, search, bulan);
  const [tahun, nomorBulan] = bulan.split("-").map(Number);
  const hari = Array.from({ length: new Date(tahun, nomorBulan, 0).getDate() }, (_, i) => i + 1);
  return {
    ...result, total: result.pagination.total, totalPages: result.pagination.totalPages,
    page, pageSize: 10, setPage, search, draftBulan, setDraftBulan,
    labelBulan: new Date(`${bulan}-01T00:00:00+07:00`).toLocaleDateString("id-ID", { timeZone: "Asia/Jakarta", month: "long", year: "numeric" }),
    changeSearch(value: string) { setSearch(value); setPage(1); },
    terapkanBulan() { if (draftBulan) { setBulan(draftBulan); setPage(1); } },
    hari,
  };
}
