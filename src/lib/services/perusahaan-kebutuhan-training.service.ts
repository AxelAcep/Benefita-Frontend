import { apiGet, apiGetResponse, type ListParams } from "@/lib/api/client";
import type { CustomerTraining } from "@/lib/types/customer-training";
import type { PerusahaanTbkPagination } from "@/lib/types/perusahaan-tbk";

export interface KodePelatihanOption { kode: string; judulTraining: string }

export function getKebutuhanTraining(params: ListParams, signal?: AbortSignal) {
  return apiGetResponse<{ data: CustomerTraining[]; pagination: PerusahaanTbkPagination }>(
    "/api/database/perusahaan-kebutuhan-training", params, "Gagal mengambil kebutuhan training.", signal,
  );
}

export function getKodeKebutuhanTraining() {
  return apiGet<KodePelatihanOption[]>("/api/database/perusahaan-kebutuhan-training/kode");
}
