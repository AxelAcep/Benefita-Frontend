import { apiGet, apiGetResponse, type ListParams } from "@/lib/api/client";
import type { PesertaOpsi, PesertaRow } from "@/lib/types/peserta-laporan";
import type { PerusahaanTbkPagination } from "@/lib/types/perusahaan-tbk";

export function getPesertaLaporan(params: ListParams, signal?: AbortSignal) {
  const { mode, ...query } = params;
  return apiGetResponse<{ data: PesertaRow[]; pagination: PerusahaanTbkPagination }>(
    `/api/peserta/${mode}`, query, "Gagal mengambil data peserta.", signal,
  );
}
export const getPesertaOpsi = () => apiGet<PesertaOpsi>("/api/peserta/opsi");
