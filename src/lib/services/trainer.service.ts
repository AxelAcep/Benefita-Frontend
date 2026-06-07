const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface Trainer {
  id: number;
  kode: string;
  nama: string;
  referensi?: string | null;
  alamat?: string | null;
  subjekKhusus?: string | null;
  telp?: string | null;
  keterangan?: string | null;
  email?: string | null;
  tugas?: string | null;
  kantor?: string | null;
  alamatKantor?: string | null;
  noTelpKantor?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TrainerListItem {
  id: number;
  kode: string;
  nama: string;
  telp?: string | null;
  email?: string | null;
  kantor?: string | null;
  referensi?: string | null;
  subjekKhusus?: string | null;
  tugas?: string | null;
  jumlahHari?: number | null;
}

export interface TrainerPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetTrainersResponse {
  data: TrainerListItem[];
  pagination: TrainerPagination;
}

export interface CreateTrainerRequest {
  kode: string;
  nama: string;
  referensi?: string;
  alamat?: string;
  subjekKhusus?: string;
  telp?: string;
  keterangan?: string;
  email?: string;
  tugas?: string;
  kantor?: string;
  alamatKantor?: string;
  noTelpKantor?: string;
}

export interface UpdateTrainerRequest {
  kode?: string;
  nama?: string;
  referensi?: string;
  alamat?: string;
  subjekKhusus?: string;
  telp?: string;
  keterangan?: string;
  email?: string;
  tugas?: string;
  kantor?: string;
  alamatKantor?: string;
  noTelpKantor?: string;
}

// ─────────────────────────────────────────────
// FETCH HELPERS
// ─────────────────────────────────────────────

import { fetchWithAuth } from "./login.service";

// ─────────────────────────────────────────────
// API SERVICE
// ─────────────────────────────────────────────

/**
 * GET ALL TRAINER
 * support:
 * - pagination
 * - search (kode, nama, telp, kantor, subjekKhusus)
 */
export async function getTrainers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<GetTrainersResponse> {
  const query = new URLSearchParams();

  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.search) query.append("search", params.search);

  const res = await fetchWithAuth(
    `${API_URL}/api/training/trainer?${query.toString()}`,
    { method: "GET" },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil data trainer");
  }

  return data;
}

/**
 * GET BY ID
 */
export async function getTrainerById(id: number): Promise<Trainer> {
  const res = await fetchWithAuth(`${API_URL}/api/training/trainer/${id}`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil detail trainer");
  }

  return data.data;
}

/**
 * CREATE TRAINER
 */
export async function createTrainer(
  payload: CreateTrainerRequest,
): Promise<Trainer> {
  const res = await fetchWithAuth(`${API_URL}/api/training/trainer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal membuat trainer");
  }

  return data.data;
}

/**
 * UPDATE TRAINER
 */
export async function updateTrainer(
  id: number,
  payload: UpdateTrainerRequest,
): Promise<Trainer> {
  const res = await fetchWithAuth(`${API_URL}/api/training/trainer/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengupdate trainer");
  }

  return data.data;
}
