import { apiGet, apiPut } from "@/lib/api/client";
import type { RekapSertifikat, SertifikatPelatihan, UpdateSertifikat } from "@/lib/types/rekap-sertifikat";

export const getRekapSertifikat = (noJadwal: string) =>
  apiGet<RekapSertifikat>(
    `/api/input/jadwal/${encodeURIComponent(noJadwal)}/rekap-sertifikat`,
    undefined,
    "Gagal mengambil rekap sertifikat.",
  );

export const updateSertifikat = (noJadwal: string, id: number, data: UpdateSertifikat) =>
  apiPut<SertifikatPelatihan>(
    `/api/input/jadwal/${encodeURIComponent(noJadwal)}/rekap-sertifikat/${id}`,
    data,
    "Gagal memperbarui sertifikat.",
  );
