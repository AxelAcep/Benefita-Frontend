"use client";

import { useEffect, useState } from "react";
import { useResource } from "@/hooks/use-resource";
import { getHotelKotaList, hotelService } from "@/lib/services/hotel.service";
import type {
  CreateHotelRequest,
  Hotel,
  UpdateHotelRequest,
} from "@/lib/types/hotel";

/** List + paginasi + search + filter kota + CRUD hotel. */
export function useHotels(limit = 10) {
  return useResource<Hotel, string, CreateHotelRequest, UpdateHotelRequest>(
    hotelService,
    {
      limit,
      filter: { kota: "" },
      pesanGagal: "Gagal mengambil data hotel",
    },
  );
}

/**
 * Daftar kota untuk dropdown filter, diambil dari tabel hotel.
 * Sebelumnya daftar ini diturunkan dari file data dummy, jadi hotel di kota
 * lain tidak pernah bisa difilter.
 */
export function useKotaHotel() {
  const [kotaList, setKotaList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let batal = false;
    setLoading(true);

    getHotelKotaList()
      .then((list) => {
        if (!batal) setKotaList(list);
      })
      // Dropdown kosong lebih baik daripada halaman gagal dimuat.
      .catch(() => {
        if (!batal) setKotaList([]);
      })
      .finally(() => {
        if (!batal) setLoading(false);
      });

    return () => {
      batal = true;
    };
  }, []);

  return { kotaList, loading };
}
