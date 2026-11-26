/** Jadwal Training — satu penyelenggaraan pelatihan beserta trainernya. */

export interface TrainerItem {
  kode: string;
  nama: string;
}

/** Bentuk baris dari GET /api/training/jadwal-training */
export interface JadwalTrainingListItem {
  id: string;
  noJadwal: string;
  tglMulai: string | null;
  kodePelatihan: string;
  jenisTraining: string;
  judulLengkap: string;
  biaya: number;
  lokasiDetail: string | null;
  status: string;
  catatan: string | null;
  lastUpdate: string;
  trainers: { trainer: TrainerItem }[];
  pegawai: { id: string; nama: string };
}

/** Bentuk detail dari GET /api/training/jadwal-training/:id */
export interface JadwalTraining {
  id: string;
  noJadwal: string;
  kodePelatihan: string;
  tglMulai: string | null;
  tglSelesai: string | null;
  judulLengkap: string;
  judulPendek: string;
  metode: string;
  jenisTraining: string;
  kota: string;
  lokasiDetail: string | null;
  biaya: number;
  catatan: string | null;
  status: string;
  fileAgenda: string | null;
  lastUpdate: string;
  updateOleh: string;
  trainers: { trainer: TrainerItem }[];
  pegawai: { id: string; nama: string };
  judulTraining: { kode: string; judulTraining: string };
}

export interface CreateJadwalTrainingRequest {
  noJadwal: string;
  kodePelatihan: string;
  tglMulai?: string | null;
  tglSelesai?: string | null;
  judulLengkap: string;
  judulPendek: string;
  metode: string;
  jenisTraining: string;
  kota: string;
  lokasiDetail?: string | null;
  biaya: number;
  catatan?: string | null;
  status?: string;
  trainerKodes?: string[];
  fileAgenda?: File | null;
}

export type UpdateJadwalTrainingRequest = Partial<CreateJadwalTrainingRequest>;

/** Opsi dropdown yang diambil dari nilai yang benar-benar ada di database. */
export interface OpsiJadwal {
  status: string[];
  metode: string[];
  jenisTraining: string[];
}

/**
 * Berkas agenda disimpan backend sebagai path relatif. Ubah jadi URL yang
 * bisa dibuka; kalau sudah URL penuh, pakai apa adanya.
 */
export function urlFileAgenda(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  return `${base}/${path.replace(/^\/+/, "")}`;
}

/** Kode trainer dari bentuk bersarang yang dikirim backend. */
export const kodeTrainer = (
  trainers: { trainer: TrainerItem }[] | undefined,
): string[] => (trainers ?? []).map((t) => t.trainer.kode);
