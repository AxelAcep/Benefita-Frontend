/**
 * Service Judul Training.
 *
 * Perakitan URL, pengiriman token, dan penanganan error ada di
 * @/lib/api/client — di sini tinggal endpoint dan tipenya.
 *
 * Create dan update dikirim sebagai multipart karena bisa membawa berkas
 * brosur. Backend belum punya route hapus untuk judul training.
 */
import {
  apiGet,
  apiList,
  apiPostForm,
  apiPutForm,
  keFormData,
} from "@/lib/api/client";
import type {
  CreateJudulTrainingRequest,
  JudulTraining,
  JudulTrainingListItem,
  UpdateJudulTrainingRequest,
} from "@/lib/types/judul-training";
import type { ListParams, ListResult } from "@/lib/api/client";

// Tipe pindah ke @/lib/types/judul-training. Diekspor ulang supaya file
// lama yang mengimpor dari service tidak ikut rusak.
export type {
  CreateJudulTrainingRequest,
  JudulTraining,
  JudulTrainingListItem,
  UpdateJudulTrainingRequest,
};

const BASE = "/api/training/judul-training";

export const getJudulTraining = (
  params: ListParams = {},
): Promise<ListResult<JudulTrainingListItem>> =>
  apiList<JudulTrainingListItem>(
    BASE,
    params,
    "Gagal mengambil data judul training",
  );

export const getJudulTrainingById = (id: number): Promise<JudulTraining> =>
  apiGet<JudulTraining>(
    `${BASE}/${id}`,
    undefined,
    "Gagal mengambil detail judul training",
  );

/** Tipe yang benar-benar dipakai di database, untuk mengisi dropdown. */
export const getJudulTrainingTipeList = (): Promise<string[]> =>
  apiGet<string[]>(`${BASE}/tipe`, undefined, "Gagal mengambil daftar tipe");

export const createJudulTraining = (
  payload: CreateJudulTrainingRequest,
): Promise<JudulTrainingListItem> =>
  apiPostForm<JudulTrainingListItem>(
    BASE,
    keFormData(payload as unknown as Record<string, unknown>),
    "Gagal membuat judul training",
  );

export const updateJudulTraining = (
  id: number,
  payload: UpdateJudulTrainingRequest,
): Promise<JudulTrainingListItem> =>
  apiPutForm<JudulTrainingListItem>(
    `${BASE}/${id}`,
    keFormData(payload as unknown as Record<string, unknown>),
    "Gagal mengubah judul training",
  );

/** Dibentuk untuk useResource. Tanpa `remove`: endpoint hapus belum ada. */
export const judulTrainingService = {
  list: getJudulTraining,
  create: createJudulTraining,
  update: updateJudulTraining,
};
