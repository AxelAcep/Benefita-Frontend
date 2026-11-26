import { apiGet } from "@/lib/api/client";
import type { RekapEvaluasiResponse } from "@/lib/types/rekap-evaluasi";

export const getRekapEvaluasi = (noJadwal: string) =>
  apiGet<RekapEvaluasiResponse>(
    `/api/training/jadwal/${encodeURIComponent(noJadwal)}/rekap-evaluasi`,
    undefined,
    "Gagal mengambil rekap evaluasi.",
  );
