/**
 * Service Pengajuan Judul Training.
 *
 * Perakitan URL, pengiriman token, dan penanganan error ada di
 * @/lib/api/client — di sini tinggal endpoint dan tipenya.
 *
 * Catatan: backend belum punya route hapus untuk pengajuan judul.
 */
import { apiGet, apiList, apiPost, apiPut } from "@/lib/api/client";
import type {
  CreatePengajuanRequest,
  PengajuanJudulTraining,
  PengajuanListItem,
  UpdatePengajuanRequest,
} from "@/lib/types/pengajuan-judul";
import type { ListParams, ListResult } from "@/lib/api/client";

// Tipe pindah ke @/lib/types/pengajuan-judul. Diekspor ulang di sini supaya
// file lama yang mengimpor dari service tidak ikut rusak.
export type {
  CreatePengajuanRequest,
  PengajuanJudulTraining,
  PengajuanListItem,
  UpdatePengajuanRequest,
};

const BASE = "/api/training/pengajuan-judul";

export const getPengajuan = (
  params: ListParams = {},
): Promise<ListResult<PengajuanListItem>> =>
  apiList<PengajuanListItem>(BASE, params, "Gagal mengambil data pengajuan");

export const getPengajuanById = (
  id: string,
): Promise<PengajuanJudulTraining> =>
  apiGet<PengajuanJudulTraining>(
    `${BASE}/${id}`,
    undefined,
    "Gagal mengambil detail pengajuan",
  );

export const createPengajuan = (
  payload: CreatePengajuanRequest,
): Promise<PengajuanListItem> =>
  apiPost<PengajuanListItem>(BASE, payload, "Gagal membuat pengajuan");

export const updatePengajuan = (
  id: string,
  payload: UpdatePengajuanRequest,
): Promise<PengajuanListItem> =>
  apiPut<PengajuanListItem>(`${BASE}/${id}`, payload, "Gagal mengubah pengajuan");

/** Dibentuk untuk useResource. Tanpa `remove`: endpoint hapus belum ada. */
export const pengajuanService = {
  list: getPengajuan,
  create: createPengajuan,
  update: updatePengajuan,
};

export const approvePengajuan = (id: string, payload: { responMA: "DISETUJUI" | "DITOLAK"; catatanMA: string }) =>
  apiPut<PengajuanListItem>(`${BASE}/${id}/approval`, payload, "Gagal menyimpan keputusan pengajuan.");
