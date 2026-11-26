"use client";

import { useEffect, useState } from "react";
import { getRiwayatByPegawai } from "@/lib/services/cuti.service";
import type { GetRiwayatResponse } from "@/lib/types/cuti";

export function useRiwayatPegawai(pegawaiId: string, page: number, limit: number) {
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{
    key: string;
    data: GetRiwayatResponse | null;
    error: string | null;
  } | null>(null);
  const key = JSON.stringify([pegawaiId, page, limit, revision]);

  useEffect(() => {
    let active = true;
    getRiwayatByPegawai(pegawaiId, { page, limit }).then(
      (data) => {
        if (active) setResult({ key, data, error: null });
      },
      (err: unknown) => {
        if (active) setResult({
          key,
          data: null,
          error: err instanceof Error ? err.message : "Gagal mengambil riwayat izin.",
        });
      },
    );
    return () => { active = false; };
  }, [key, pegawaiId, page, limit]);

  const current = result?.key === key ? result : null;
  return {
    data: current?.data ?? null,
    error: current?.error ?? null,
    loading: !current,
    retry: () => setRevision((value) => value + 1),
  };
}
