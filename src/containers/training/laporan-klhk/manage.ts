"use client";

/**
 * Keadaan halaman Laporan KLHK: filter tahun dan skema, pengambilan data,
 * serta penjumlahan K, BK, dan total.
 *
 * Laporan ini tidak berhalaman — backend mengembalikan seluruh rekap
 * sekaligus, jadi tidak memakai useResource.
 */
import { useEffect, useMemo, useState } from "react";
import {
  getLaporanKlhk,
  type LaporanKlhkRow,
} from "@/lib/services/peserta-uji.service";
import {
  getSkemaKualifikasiOptions,
  type SkemaKualifikasiOption,
} from "@/lib/services/input.service";

export function useLaporanKlhkManage() {
  const [data, setData] = useState<LaporanKlhkRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tahun, setTahun] = useState("");
  const [skemaId, setSkemaId] = useState<number | "">("");
  const [skemaOptions, setSkemaOptions] = useState<SkemaKualifikasiOption[]>([]);

  useEffect(() => {
    let batal = false;

    getSkemaKualifikasiOptions()
      .then((opsi) => {
        if (!batal) setSkemaOptions(opsi);
      })
      // Dropdown kosong lebih baik daripada halaman gagal dimuat.
      .catch(() => {
        if (!batal) setSkemaOptions([]);
      });

    return () => {
      batal = true;
    };
  }, []);

  useEffect(() => {
    let batal = false;
    setLoading(true);
    setError(null);

    getLaporanKlhk({
      tahun: tahun || undefined,
      skemaId: skemaId || undefined,
    })
      .then((rows) => {
        if (!batal) setData(rows);
      })
      .catch((err: unknown) => {
        if (batal) return;
        // Dulu galat diam-diam jadi array kosong, jadi gangguan jaringan
        // tampil sama persis dengan "tidak ada data".
        setData([]);
        setError(
          err instanceof Error ? err.message : "Gagal mengambil laporan KLHK",
        );
      })
      .finally(() => {
        if (!batal) setLoading(false);
      });

    return () => {
      batal = true;
    };
  }, [tahun, skemaId]);

  const total = useMemo(
    () => ({
      k: data.reduce((acc, r) => acc + r.jumlahK, 0),
      bk: data.reduce((acc, r) => acc + r.jumlahBk, 0),
      semua: data.reduce((acc, r) => acc + r.jumlahTotal, 0),
    }),
    [data],
  );

  return {
    data,
    loading,
    error,
    tahun,
    setTahun,
    skemaId,
    setSkemaId,
    skemaOptions,
    total,
  };
}
