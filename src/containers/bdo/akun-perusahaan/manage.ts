"use client";

import { useEffect, useState } from "react";
import { useAkunPerusahaan } from "@/hooks/use-bdo-laporan";
import { getAkunOpsi } from "@/lib/services/bdo-laporan.service";

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

  const [kodeTersedia, setKodeTersedia] = useState<string[]>([]);
  const [optionsError, setOptionsError] = useState<string | null>(null);
  useEffect(() => {
    let batal = false;
    setKodeTersedia([]);
    setOptionsError(null);
    getAkunOpsi(draft.kategori).then((data) => { if (!batal) setKodeTersedia(data); })
      .catch((err: unknown) => { if (!batal) setOptionsError(err instanceof Error ? err.message : "Gagal mengambil kode akun."); });
    return () => { batal = true; };
  }, [draft.kategori]);
  const result = useAkunPerusahaan(page, search, filter.kategori, filter.kode);

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
    data: result.data, total: result.pagination.total, totalPages: result.pagination.totalPages,
    loading: result.loading, error: result.error, optionsError,
  };
}
