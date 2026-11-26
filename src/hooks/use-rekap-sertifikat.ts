"use client";

import { useEffect, useState } from "react";
import { getRekapSertifikat } from "@/lib/services/rekap-sertifikat.service";
import type { RekapSertifikat } from "@/lib/types/rekap-sertifikat";

// Respons berisi ringkasan jadwal dan dua kelompok, sehingga memakai hook
// khusus untuk mempertahankan keduanya saat refetch setelah update.
export function useRekapSertifikat(noJadwal: string) {
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{
    key: string;
    noJadwal: string;
    data: RekapSertifikat | null;
    error: string | null;
  } | null>(null);
  const key = JSON.stringify([noJadwal, revision]);
  useEffect(() => {
    let active = true;
    getRekapSertifikat(noJadwal).then(
      (data) => { if (active) setResult({ key, noJadwal, data, error: null }); },
      (error: unknown) => {
        if (active) setResult({ key, noJadwal, data: null, error: error instanceof Error ? error.message : "Gagal mengambil rekap sertifikat." });
      },
    );
    return () => { active = false; };
  }, [key, noJadwal]);
  return {
    data: result?.noJadwal === noJadwal ? result.data : null,
    error: result?.key === key ? result.error : null,
    isLoading: result?.key !== key,
    refetch: () => setRevision((value) => value + 1),
  };
}
