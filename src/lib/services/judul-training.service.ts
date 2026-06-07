const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { fetchWithAuth } from "./login.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface JudulTraining {
  id: number;
  kode: string;
  judulTraining: string;
  tipe: string;
  hari: number;
  biayaOffline: number;
  biayaOnline: number;
  batch: number;
  brosur: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JudulTrainingListItem {
  id: number;
  kode: string;
  judulTraining: string;
  tipe: string;
  hari: number;
  biayaOnline: number;
  biayaOffline: number;
  batch: number;
  brosur: string | null;
}

export interface JudulTrainingPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetJudulTrainingResponse {
  data: JudulTrainingListItem[];
  meta: JudulTrainingPagination;
}

export interface CreateJudulTrainingRequest {
  kode: string;
  judulTraining: string;
  tipe: string;
  hari: number;
  biayaOffline: number;
  biayaOnline: number;
  batch: number;
  brosur?: File | null;
}

export interface UpdateJudulTrainingRequest {
  kode?: string;
  judulTraining?: string;
  tipe?: string;
  hari?: number;
  biayaOffline?: number;
  biayaOnline?: number;
  batch?: number;
  brosur?: File | null;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function buildFormData(
  payload: CreateJudulTrainingRequest | UpdateJudulTrainingRequest,
): FormData {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (value instanceof File) {
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

export async function getJudulTraining(params?: {
  page?: number;
  limit?: number;
  search?: string;
  tipe?: string;
  kode?: string;
}): Promise<GetJudulTrainingResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.search) query.append("search", params.search);
  if (params?.tipe) query.append("tipe", params.tipe);
  if (params?.kode) query.append("kode", params.kode);

  const res = await fetchWithAuth(
    `${API_URL}/api/training/judul-training?${query.toString()}`,
    { method: "GET" },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil data judul training");

  return data;
}

export async function getJudulTrainingById(id: number): Promise<JudulTraining> {
  const res = await fetchWithAuth(
    `${API_URL}/api/training/judul-training/${id}`,
    { method: "GET" },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil detail judul training");

  return data.data;
}

export async function createJudulTraining(
  payload: CreateJudulTrainingRequest,
): Promise<JudulTraining> {
  const formData = buildFormData(payload);

  const res = await fetchWithAuth(`${API_URL}/api/training/judul-training`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal membuat judul training");

  return data.data;
}

export async function updateJudulTraining(
  id: number,
  payload: UpdateJudulTrainingRequest,
): Promise<JudulTraining> {
  const formData = buildFormData(payload);

  const res = await fetchWithAuth(
    `${API_URL}/api/training/judul-training/${id}`,
    {
      method: "PUT",
      body: formData,
    },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengupdate judul training");

  return data.data;
}
