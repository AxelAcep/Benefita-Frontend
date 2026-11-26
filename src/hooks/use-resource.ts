"use client";

/**
 * Hook list + paginasi + search + CRUD yang dipakai bersama.
 *
 * Dari 64 hook di folder ini, 20 punya bentuk yang sama persis. Contoh
 * paling telanjang: use-tuk.ts dan use-asesor.ts sama-sama 99 baris dan
 * hanya berbeda pada nama. Logikanya ditulis sekali di sini; hook per
 * entitas tinggal menyerahkan service-nya.
 *
 * Hook lama tidak dibuang. Dimigrasi satu per satu ikut giliran halamannya.
 */
import { useCallback, useEffect, useState } from "react";
import type { ListParams, ListResult } from "@/lib/api/client";

/**
 * `R` adalah bentuk yang dikembalikan create dan update. Seringkali sama
 * dengan `T`, tapi tidak selalu: beberapa endpoint mengembalikan bentuk
 * detail yang lebih lengkap daripada baris di daftar.
 */
export interface ResourceService<T, Id, C, U, R = T> {
  list: (params: ListParams) => Promise<ListResult<T>>;
  /** Opsional: sebagian halaman hanya membaca daftar. */
  create?: (payload: C) => Promise<R>;
  update?: (id: Id, payload: U) => Promise<R>;
  /** Opsional: sebagian entitas belum punya endpoint hapus di backend. */
  remove?: (id: Id) => Promise<void>;
}

export interface UseResourceOptions {
  limit?: number;
  search?: string;
  /** Filter tambahan di luar search, misal { kota: "" } pada halaman Hotel. */
  filter?: Record<string, string>;
  pesanGagal?: string;
}

export function useResource<T, Id = number, C = unknown, U = Partial<C>, R = T>(
  service: ResourceService<T, Id, C, U, R>,
  options: UseResourceOptions = {},
) {
  const { limit = 10, pesanGagal = "Gagal mengambil data." } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearchState] = useState(options.search ?? "");
  const [filter, setFilterState] = useState<Record<string, string>>(
    options.filter ?? {},
  );

  // Objek filter dijadikan string supaya dependensi useCallback stabil;
  // kalau objeknya langsung dipakai, tiap render bikin fetch baru.
  const filterKey = JSON.stringify(filter);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await service.list({
        page,
        limit,
        search: search || undefined,
        ...(JSON.parse(filterKey) as Record<string, string>),
      });
      setData(res.data);
      setTotal(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : pesanGagal);
    } finally {
      setLoading(false);
    }
    // `service` sengaja tidak masuk dependensi: pemanggil biasanya membuat
    // objeknya inline, jadi identitasnya berubah tiap render dan akan
    // memicu fetch tanpa henti.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search, filterKey, pesanGagal]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => fetchData(), [fetchData]);

  /** Ganti kata kunci pencarian. Selalu balik ke halaman 1. */
  const setSearch = (value: string) => {
    setSearchState(value);
    setPage(1);
  };

  /** Ganti satu filter, misal setFilter("kota", "Bandung"). Balik ke halaman 1. */
  const setFilter = (key: string, value: string) => {
    setFilterState((lama) => ({ ...lama, [key]: value }));
    setPage(1);
  };

  const create = async (payload: C) => {
    if (!service.create) {
      throw new Error("Tambah data belum didukung untuk data ini.");
    }
    const hasil = await service.create(payload);
    await fetchData();
    return hasil;
  };

  const update = async (id: Id, payload: U) => {
    if (!service.update) {
      throw new Error("Ubah data belum didukung untuk data ini.");
    }
    const hasil = await service.update(id, payload);
    await fetchData();
    return hasil;
  };

  const remove = async (id: Id) => {
    if (!service.remove) {
      throw new Error("Hapus belum didukung untuk data ini.");
    }
    await service.remove(id);
    await fetchData();
  };

  /** Dipakai halaman untuk menyembunyikan tombol yang tidak didukung. */
  const bisaTambah = typeof service.create === "function";
  const bisaUbah = typeof service.update === "function";
  const bisaHapus = typeof service.remove === "function";

  return {
    data,
    loading,
    error,
    page,
    limit,
    total,
    totalPages,
    search,
    filter,
    setPage,
    setSearch,
    setFilter,
    refetch,
    create,
    update,
    remove,
    bisaTambah,
    bisaUbah,
    bisaHapus,
  };
}
