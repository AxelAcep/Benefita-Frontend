// services/jadwal-training.service.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { fetchWithAuth } from "./login.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface TrainerItem {
  kode: string;
  nama: string;
}

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

export interface JadwalTrainingPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetJadwalTrainingResponse {
  data: JadwalTrainingListItem[];
  meta: JadwalTrainingPagination;
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
  updateOleh: string;
  trainerKodes?: string[];
  fileAgenda?: File | null;
}

export interface UpdateJadwalTrainingRequest {
  noJadwal?: string;
  kodePelatihan?: string;
  tglMulai?: string | null;
  tglSelesai?: string | null;
  judulLengkap?: string;
  judulPendek?: string;
  metode?: string;
  jenisTraining?: string;
  kota?: string;
  lokasiDetail?: string | null;
  biaya?: number;
  catatan?: string | null;
  status?: string;
  updateOleh?: string;
  trainerKodes?: string[];
  fileAgenda?: File | null;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function buildFormData(
  payload: CreateJadwalTrainingRequest | UpdateJadwalTrainingRequest,
): FormData {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "trainerKodes" && Array.isArray(value)) {
      // Array dikirim sebagai multiple field dengan key sama
      value.forEach((kode) => formData.append("trainerKodes", kode));
    } else if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
}

// ─────────────────────────────────────────────
// API SERVICE
// ─────────────────────────────────────────────

export async function getJadwalTraining(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  jenisTraining?: string;
  metode?: string;
}): Promise<GetJadwalTrainingResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.search) query.append("search", params.search);
  if (params?.status) query.append("status", params.status);
  if (params?.jenisTraining)
    query.append("jenisTraining", params.jenisTraining);
  if (params?.metode) query.append("metode", params.metode);

  const res = await fetchWithAuth(
    `${API_URL}/api/training/jadwal-training?${query.toString()}`,
    { method: "GET" },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil data jadwal training");

  return data;
}

export async function getJadwalTrainingById(
  id: string,
): Promise<JadwalTraining> {
  const res = await fetchWithAuth(
    `${API_URL}/api/training/jadwal-training/${id}`,
    { method: "GET" },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil detail jadwal training");

  return data.data;
}

export async function createJadwalTraining(
  payload: CreateJadwalTrainingRequest,
): Promise<JadwalTraining> {
  const formData = buildFormData(payload);

  const res = await fetchWithAuth(`${API_URL}/api/training/jadwal-training`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal membuat jadwal training");

  return data.data;
}

export async function updateJadwalTraining(
  id: string,
  payload: UpdateJadwalTrainingRequest,
): Promise<JadwalTraining> {
  const formData = buildFormData(payload);

  const res = await fetchWithAuth(
    `${API_URL}/api/training/jadwal-training/${id}`,
    { method: "PUT", body: formData },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengupdate jadwal training");

  return data.data;
}

export async function deleteJadwalTraining(id: string): Promise<void> {
  const res = await fetchWithAuth(
    `${API_URL}/api/training/jadwal-training/${id}`,
    { method: "DELETE" },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal menghapus jadwal training");
}
