/**
 * Service Jadwal Training.
 *
 * Perakitan URL, pengiriman token, dan penanganan error ada di
 * @/lib/api/client — di sini tinggal endpoint dan tipenya.
 *
 * Create dan update dikirim sebagai multipart karena bisa membawa berkas
 * agenda, dan trainerKodes dikirim sebagai field berulang.
 *
 * Catatan: endpoint ubah dan hapus memakai noJadwal sebagai kunci, bukan
 * id — lihat router.put("/jadwal-training/:noJadwal") di backend.
 */
import {
  apiDelete,
  apiGet,
  apiList,
  apiPostForm,
  apiPutForm,
  keFormData,
} from "@/lib/api/client";
import type {
  OpsiJadwal,
  CreateJadwalTrainingRequest,
  JadwalTraining,
  JadwalTrainingListItem,
  TrainerItem,
  UpdateJadwalTrainingRequest,
} from "@/lib/types/jadwal-training";
import type { ListParams, ListResult } from "@/lib/api/client";

// Tipe pindah ke @/lib/types/jadwal-training. Diekspor ulang supaya file
// lama yang mengimpor dari service tidak ikut rusak.
export type {
  OpsiJadwal,
  CreateJadwalTrainingRequest,
  JadwalTraining,
  JadwalTrainingListItem,
  TrainerItem,
  UpdateJadwalTrainingRequest,
};

const BASE = "/api/training/jadwal-training";

export const getJadwalTraining = (
  params: ListParams = {},
): Promise<ListResult<JadwalTrainingListItem>> =>
  apiList<JadwalTrainingListItem>(
    BASE,
    params,
    "Gagal mengambil data jadwal training",
  );

export const getJadwalTrainingById = (id: string): Promise<JadwalTraining> =>
  apiGet<JadwalTraining>(
    `${BASE}/${id}`,
    undefined,
    "Gagal mengambil detail jadwal training",
  );

/**
 * Nilai status, metode, dan jenis yang benar-benar dipakai di database.
 * Backend menurunkan updateOleh sendiri dari token, jadi tidak dikirim.
 */
export const getOpsiJadwal = (): Promise<OpsiJadwal> =>
  apiGet<OpsiJadwal>(`${BASE}/opsi`, undefined, "Gagal mengambil opsi jadwal");

/** Nomor jadwal berikutnya, dipakai saat membuat jadwal baru. */
export const getNextNoJadwal = (): Promise<{ noJadwal: string }> =>
  apiGet<{ noJadwal: string }>(
    `${BASE}/next-no-jadwal`,
    undefined,
    "Gagal mengambil nomor jadwal berikutnya",
  );

export const createJadwalTraining = (
  payload: CreateJadwalTrainingRequest,
): Promise<JadwalTraining> =>
  apiPostForm<JadwalTraining>(
    BASE,
    keFormData(payload as unknown as Record<string, unknown>),
    "Gagal membuat jadwal training",
  );

/** `noJadwal` adalah nomor ASLI baris yang diubah, bukan nomor baru. */
export const updateJadwalTraining = (
  noJadwal: string,
  payload: UpdateJadwalTrainingRequest,
): Promise<JadwalTraining> =>
  apiPutForm<JadwalTraining>(
    `${BASE}/${noJadwal}`,
    keFormData(payload as unknown as Record<string, unknown>),
    "Gagal mengubah jadwal training",
  );

export const deleteJadwalTraining = (noJadwal: string): Promise<void> =>
  apiDelete(`${BASE}/${noJadwal}`, "Gagal menghapus jadwal training");
