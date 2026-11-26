"use client";

/**
 * Daftar pegawai aktif untuk dropdown PIC dan penerima laporan pada menu
 * Tugas. Bukan useDropdownSales: yang itu khusus Account Executive,
 * sedangkan PIC tugas juga diisi pegawai non-AE.
 */
import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api/client";
import type { PegawaiRingkas } from "@/lib/types/bdo";

interface Jawaban {
  data: PegawaiRingkas[];
}

export function useBdoPegawai() {
  const [data, setData] = useState<PegawaiRingkas[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let batal = false;

    apiGet<Jawaban>("/api/bdo/pegawai-opsi", undefined, "Gagal mengambil daftar pegawai")
      .then((res) => {
        if (!batal) setData(res.data ?? []);
      })
      .catch(() => {
        if (!batal) setData([]);
      })
      .finally(() => {
        if (!batal) setLoading(false);
      });

    return () => {
      batal = true;
    };
  }, []);

  return { data, loading };
}
