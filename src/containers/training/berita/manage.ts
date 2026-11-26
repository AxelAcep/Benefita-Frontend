"use client";

/**
 * Keadaan halaman daftar Berita: pencarian dan paginasi.
 *
 * Endpoint riwayat mengembalikan seluruh berita sekaligus, jadi keduanya
 * dikerjakan di sisi klien — bukan lewat useResource.
 */
import { useMemo, useState } from "react";
import { useRiwayatBerita } from "@/hooks/use-berita";
import { tanggalBerita } from "@/lib/types/berita";

export const UKURAN_HALAMAN = 10;

export function useBeritaManage() {
  const { data, loading, error } = useRiwayatBerita();

  const [search, setSearchState] = useState("");
  const [page, setPage] = useState(1);

  const hasilSaring = useMemo(() => {
    const kunci = search.trim().toLowerCase();
    if (!kunci) return data;
    return data.filter(
      (d) =>
        d.isi.toLowerCase().includes(kunci) ||
        tanggalBerita(d.periode).toLowerCase().includes(kunci),
    );
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(hasilSaring.length / UKURAN_HALAMAN));

  // Kalau hasil saring menyusut, halaman aktif bisa melewati halaman
  // terakhir dan tabel tampil kosong padahal datanya ada.
  const halamanAktif = Math.min(page, totalPages);

  const baris = useMemo(
    () =>
      hasilSaring.slice(
        (halamanAktif - 1) * UKURAN_HALAMAN,
        halamanAktif * UKURAN_HALAMAN,
      ),
    [hasilSaring, halamanAktif],
  );

  const setSearch = (v: string) => {
    setSearchState(v);
    setPage(1);
  };

  return {
    baris,
    total: hasilSaring.length,
    loading,
    error,
    search,
    setSearch,
    page: halamanAktif,
    setPage,
    totalPages,
  };
}
