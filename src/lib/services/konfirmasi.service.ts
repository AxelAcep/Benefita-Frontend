import { apiDelete, apiGet, apiGetResponse, apiPostForm, apiPutForm, keFormData } from "@/lib/api/client";
import type {
  CreateKonfirmasiRequest,
  GetListKonfirmasiResponse,
  Konfirmasi,
  UpdateKonfirmasiRequest,
} from "@/lib/types/konfirmasi";

export type * from "@/lib/types/konfirmasi";

const BASE = "/api/konfirmasi";

export const getListKonfirmasi = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  noJadwal?: string;
  pesertaTrainingId?: number;
}) => apiGetResponse<GetListKonfirmasiResponse>(BASE, params, "Gagal mengambil data konfirmasi.");

export const getKonfirmasiById = (id: number) =>
  apiGet<Konfirmasi>(`${BASE}/${id}`, undefined, "Gagal mengambil detail konfirmasi.");

export const createKonfirmasi = (payload: CreateKonfirmasiRequest) =>
  apiPostForm<Konfirmasi>(BASE, keFormData({ ...payload }), "Gagal membuat konfirmasi.");

export const updateKonfirmasi = (id: number, payload: UpdateKonfirmasiRequest) =>
  apiPutForm<Konfirmasi>(`${BASE}/${id}`, keFormData({ ...payload }), "Gagal memperbarui konfirmasi.");

export const deleteKonfirmasi = (id: number) =>
  apiDelete(`${BASE}/${id}`, "Gagal menghapus konfirmasi.");
