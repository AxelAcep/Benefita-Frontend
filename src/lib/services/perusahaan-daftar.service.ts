import { apiGetResponse, type ListParams } from "@/lib/api/client";
import type { PerusahaanENVMA } from "@/lib/types/perusahaan-env-ma";
import type { JabatanTeknis } from "@/lib/types/perusahaan-jabatan-teknis";
import type { PerusahaanTbkPagination } from "@/lib/types/perusahaan-tbk";

type Daftar<T> = { data: T[]; pagination: PerusahaanTbkPagination };

export function getPerusahaanEnvMaList(params: ListParams, signal?: AbortSignal) {
  return apiGetResponse<Daftar<PerusahaanENVMA>>(
    "/api/database/perusahaan-env-ma", params, "Gagal mengambil perusahaan bebas.", signal,
  );
}

export function getPerusahaanJabatanTeknisList(params: ListParams, signal?: AbortSignal) {
  return apiGetResponse<Daftar<JabatanTeknis>>(
    "/api/database/perusahaan-jabatan-teknis", params, "Gagal mengambil jabatan teknis.", signal,
  );
}
