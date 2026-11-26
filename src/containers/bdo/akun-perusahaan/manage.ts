"use client";

import { useState } from "react";
import { DATA_CONTOH } from "./data";

export const AKUN = {
  ENV: { kode: "accEnv", kontak: "diKontakTerakhirEnv", jumlah: "enviro", label: "Enviro" },
  CSR: { kode: "accCsr", kontak: "diKontakTerakhirCsr", jumlah: "csr", label: "CSR" },
  TSM: { kode: "accTsm", kontak: "diKontakTerakhirTsm", jumlah: "tsm", label: "TSM" },
  EPM: { kode: "accEpm", kontak: "diKontakTerakhirEpm", jumlah: "epm", label: "EPM" },
} as const;

type Kategori = keyof typeof AKUN;
export const KATEGORI_AKUN = Object.keys(AKUN) as Kategori[];

interface Filter {
  kategori: Kategori;
  kode: string;
}

const FILTER_AWAL: Filter = { kategori: "ENV", kode: "" };
const PAGE_SIZE = 10;

export function useAkunPerusahaanManage() {
  const [draft, setDraft] = useState(FILTER_AWAL);
  const [filter, setFilter] = useState(FILTER_AWAL);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const kodeTersedia = [...new Set(DATA_CONTOH.map((row) => row[AKUN[draft.kategori].kode]))].sort();
  const query = search.trim().toLowerCase();
  const filtered = DATA_CONTOH.filter((row) => {
    if (filter.kode && row[AKUN[filter.kategori].kode] !== filter.kode) return false;

    return row.perusahaan.toLowerCase().includes(query) || row.noInduk.toLowerCase().includes(query);
  });
  const start = (page - 1) * PAGE_SIZE;

  return {
    draft,
    filter,
    kodeTersedia,
    pilihKategori(kategori: Kategori) {
      setDraft({ kategori, kode: "" });
    },
    pilihKode(kode: string) {
      setDraft((prev) => ({ ...prev, kode }));
    },
    terapkan() {
      setFilter(draft);
      setPage(1);
    },
    search,
    changeSearch(value: string) {
      setSearch(value);
      setPage(1);
    },
    page,
    setPage,
    pageSize: PAGE_SIZE,
    data: filtered.slice(start, start + PAGE_SIZE),
    total: filtered.length,
    totalPages: Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
  };
}
