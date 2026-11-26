/**
 * Service Trainer.
 *
 * Perakitan URL, pengiriman token, dan penanganan error ada di
 * @/lib/api/client — di sini tinggal endpoint dan tipenya.
 *
 * Catatan: backend belum punya route DELETE /api/training/trainer/:id,
 * jadi service ini tidak menyediakan fungsi hapus.
 */
import { apiGet, apiList, apiPost, apiPut } from "@/lib/api/client";
import {
  dariDetailApi,
  dariListApi,
  type CreateTrainerRequest,
  type Trainer,
  type TrainerApi,
  type TrainerListApi,
  type UpdateTrainerRequest,
} from "@/lib/types/trainer";
import type { ListParams, ListResult } from "@/lib/api/client";

export type {
  CreateTrainerRequest,
  Trainer,
  TrainerApi,
  TrainerListApi,
  UpdateTrainerRequest,
};

const BASE = "/api/training/trainer";

/** Hasilnya sudah dipetakan ke bentuk tampilan, termasuk referensi jadi array. */
export async function getTrainers(
  params: ListParams = {},
): Promise<ListResult<Trainer>> {
  const res = await apiList<TrainerListApi>(
    BASE,
    params,
    "Gagal mengambil data trainer",
  );
  return { ...res, data: res.data.map(dariListApi) };
}

export async function getTrainerById(id: number): Promise<Trainer> {
  const res = await apiGet<TrainerApi>(
    `${BASE}/${id}`,
    undefined,
    "Gagal mengambil detail trainer",
  );
  return dariDetailApi(res);
}

// create dan update ikut dipetakan ke bentuk tampilan supaya seluruh
// service mengembalikan Trainer, bukan campuran Trainer dan TrainerApi.
export async function createTrainer(
  payload: CreateTrainerRequest,
): Promise<Trainer> {
  const res = await apiPost<TrainerApi>(
    BASE,
    payload,
    "Gagal membuat data trainer",
  );
  return dariDetailApi(res);
}

export async function updateTrainer(
  id: number,
  payload: UpdateTrainerRequest,
): Promise<Trainer> {
  const res = await apiPut<TrainerApi>(
    `${BASE}/${id}`,
    payload,
    "Gagal mengubah data trainer",
  );
  return dariDetailApi(res);
}

/** Dibentuk untuk useResource. Tanpa `remove`: endpoint hapus belum ada. */
export const trainerService = {
  list: getTrainers,
  create: createTrainer,
  update: updateTrainer,
};
