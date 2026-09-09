const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { fetchWithAuth } from "./login.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface Asesor {
  id: number;
  nama: string;
  noRegAsesor: string | null;
  updateOleh: string | null;
  pegawai: { id: string; nama: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface AsesorPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAsesorResponse {
  data: Asesor[];
  pagination: AsesorPagination;
}

export interface CreateAsesorRequest {
  nama: string;
  noRegAsesor?: string;
}

export type UpdateAsesorRequest = Partial<CreateAsesorRequest>;

// ─────────────────────────────────────────────
// API SERVICE
// ─────────────────────────────────────────────

/**
 * GET LIST ASESOR — pagination & search
 */
export async function getAsesorList(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<GetAsesorResponse> {
  const query = new URLSearchParams();

  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.search) query.append("search", params.search);

  const res = await fetchWithAuth(
    `${API_URL}/api/lsp/asesor?${query.toString()}`,
    { method: "GET" },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil data asesor");
  }

  return data;
}

/**
 * GET ASESOR BY ID
 */
export async function getAsesorById(id: number): Promise<Asesor> {
  const res = await fetchWithAuth(`${API_URL}/api/lsp/asesor/${id}`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil detail asesor");
  }

  return data.data;
}

/**
 * CREATE ASESOR
 */
export async function createAsesor(
  payload: CreateAsesorRequest,
): Promise<Asesor> {
  const res = await fetchWithAuth(`${API_URL}/api/lsp/asesor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal membuat data asesor");
  }

  return data.data;
}

/**
 * UPDATE ASESOR
 */
export async function updateAsesor(
  id: number,
  payload: UpdateAsesorRequest,
): Promise<Asesor> {
  const res = await fetchWithAuth(`${API_URL}/api/lsp/asesor/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengupdate data asesor");
  }

  return data.data;
}

/**
 * DELETE ASESOR
 */
export async function deleteAsesor(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/api/lsp/asesor/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal menghapus data asesor");
  }
}
