"use client";

import { useEffect, useState } from "react";
import { useResource } from "@/hooks/use-resource";
import {
  getPengajuanById,
  pengajuanService,
} from "@/lib/services/pengajuan-judul-training.service";
import type {
  CreatePengajuanRequest,
  PengajuanJudulTraining,
  PengajuanListItem,
  UpdatePengajuanRequest,
} from "@/lib/types/pengajuan-judul";

/** List + paginasi + search + CRUD pengajuan judul training. */
export function usePengajuan(limit = 10) {
  return useResource<
    PengajuanListItem,
    string,
    CreatePengajuanRequest,
    UpdatePengajuanRequest
  >(pengajuanService, {
    limit,
    pesanGagal: "Gagal mengambil data pengajuan",
  });
}

/**
 * Detail satu pengajuan. Endpoint list hanya mengirim nama perusahaan,
 * bukan perusahaanId — jadi formulir edit harus menariknya dari sini.
 */
export function usePengajuanById(id: string | null) {
  const [data, setData] = useState<PengajuanJudulTraining | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      setError(null);
      return;
    }

    let batal = false;
    setLoading(true);
    setError(null);

    getPengajuanById(id)
      .then((res) => {
        if (!batal) setData(res);
      })
      .catch((err: unknown) => {
        if (batal) return;
        setError(
          err instanceof Error ? err.message : "Gagal mengambil detail pengajuan",
        );
      })
      .finally(() => {
        if (!batal) setLoading(false);
      });

    // Cegah hasil permintaan lama menimpa yang baru.
    return () => {
      batal = true;
    };
  }, [id]);

  return { data, loading, error };
}
