const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { fetchWithAuth } from "./login.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface Konfirmasi {
  id: number;
  noKonfirmasi: string;
  tanggalKonfirmasi: string;
  tanggalPelatihan: string | null;
  metode: string;
  kepada: string | null;
  kodePelatihan: string | null;
  namaPeserta: string;
  jabatan: string | null;
  kontak: string | null;
  filePath: string | null;
  instansi: string | null;
  noIndukInstansi: string | null;
  noJadwal: string;
  pesertaTrainingId: number;
  dibuatOlehId: string;
  createdAt: string;
  updatedAt: string;
  jadwalTraining: {
    noJadwal: string;
    judulLengkap: string;
    judulPendek: string;
    kodePelatihan: string;
    metode: string;
    tglMulai: string | null;
    tglSelesai: string | null;
  };
  pesertaTraining: { id: number; nama: string; jabatan: string | null };
  dibuatOleh: { id: string; nama: string };
}

export interface KonfirmasiPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetListKonfirmasiResponse {
  data: Konfirmasi[];
  meta: KonfirmasiPagination;
}

export interface CreateKonfirmasiRequest {
  pesertaTrainingId: number;
  metode: string;
  tanggalPelatihan?: string;
  kepada?: string;
  namaPeserta?: string;
  jabatan?: string;
  kontak?: string;
  noIndukInstansi?: string;
  file?: File;
}

export type UpdateKonfirmasiRequest = Omit<
  CreateKonfirmasiRequest,
  "pesertaTrainingId"
>;

// ─────────────────────────────────────────────
// API SERVICE
// ─────────────────────────────────────────────

/**
 * GET LIST KONFIRMASI
 */
export async function getListKonfirmasi(params?: {
  page?: number;
  limit?: number;
  search?: string;
  noJadwal?: string;
  pesertaTrainingId?: number;
}): Promise<GetListKonfirmasiResponse> {
  const query = new URLSearchParams();

  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.search) query.append("search", params.search);
  if (params?.noJadwal) query.append("noJadwal", params.noJadwal);
  if (params?.pesertaTrainingId)
    query.append("pesertaTrainingId", String(params.pesertaTrainingId));

  const res = await fetchWithAuth(
    `${API_URL}/api/konfirmasi?${query.toString()}`,
    { method: "GET" },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil data konfirmasi");
  }

  return data;
}

/**
 * GET ONE KONFIRMASI
 */
export async function getKonfirmasiById(id: number): Promise<Konfirmasi> {
  const res = await fetchWithAuth(`${API_URL}/api/konfirmasi/${id}`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil detail konfirmasi");
  }

  return data.data;
}

/**
 * CREATE KONFIRMASI
 */
export async function createKonfirmasi(
  payload: CreateKonfirmasiRequest,
): Promise<Konfirmasi> {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, val]) => {
    if (val === undefined || val === null) return;
    if (val instanceof File) {
      formData.append(key, val);
    } else {
      formData.append(key, String(val));
    }
  });

  const res = await fetchWithAuth(`${API_URL}/api/konfirmasi`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal membuat konfirmasi");
  }

  return data.data;
}

/**
 * UPDATE KONFIRMASI
 */
export async function updateKonfirmasi(
  id: number,
  payload: UpdateKonfirmasiRequest,
): Promise<Konfirmasi> {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, val]) => {
    if (val === undefined || val === null) return;
    if (val instanceof File) {
      formData.append(key, val);
    } else {
      formData.append(key, String(val));
    }
  });

  const res = await fetchWithAuth(`${API_URL}/api/konfirmasi/${id}`, {
    method: "PUT",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengupdate konfirmasi");
  }

  return data.data;
}

/**
 * DELETE KONFIRMASI
 */
export async function deleteKonfirmasi(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/api/konfirmasi/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal menghapus konfirmasi");
  }
}
