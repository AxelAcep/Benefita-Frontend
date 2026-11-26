"use client";

import { useEffect, useState } from "react";
import { getRekapEvaluasi } from "@/lib/services/rekap-evaluasi.service";
import type { RekapEvaluasiResponse } from "@/lib/types/rekap-evaluasi";

export function useRekapEvaluasi({ noJadwal }: { noJadwal: string }) {
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{
    key: string;
    data: RekapEvaluasiResponse | null;
    error: string | null;
  } | null>(null);
  const key = JSON.stringify([noJadwal, revision]);

  useEffect(() => {
    if (!noJadwal) return;
    let active = true;
    getRekapEvaluasi(noJadwal).then(
      (data) => {
        if (active) setResult({ key, data, error: null });
      },
      (err: unknown) => {
        if (active) setResult({
          key,
          data: null,
          error: err instanceof Error ? err.message : "Gagal mengambil rekap evaluasi.",
        });
      },
    );
    return () => { active = false; };
  }, [key, noJadwal]);

  const current = result?.key === key ? result : null;
  return {
    data: current?.data ?? null,
    error: noJadwal ? current?.error ?? null : "Nomor jadwal tidak ditemukan.",
    isLoading: Boolean(noJadwal && !current),
    refetch: () => setRevision((value) => value + 1),
  };
}
