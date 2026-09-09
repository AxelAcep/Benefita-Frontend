const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { fetchWithAuth } from "./login.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface TUK {
  id: number;
  noSK: string;
  noPenetapan: string | null;
  tglSanggup: string | null;
  nama: string;
  alamat: string;
  telp: string | null;
  updateOleh: string | null;
  pegawai: { id: string; nama: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface TUKPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetTUKResponse {
  data: TUK[];
  pagination: TUKPagination;
}

export interface CreateTUKRequest {
  noSK: string;
  noPenetapan?: string;
  tglSanggup?: string;
  nama: string;
  alamat: string;
  telp?: string;
}

export type UpdateTUKRequest = Partial<CreateTUKRequest>;

// ─────────────────────────────────────────────
// API SERVICE
// ─────────────────────────────────────────────

/**
 * GET LIST TUK — pagination & search
 */
export async function getTUKList(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<GetTUKResponse> {
  const query = new URLSearchParams();

  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.search) query.append("search", params.search);

  const res = await fetchWithAuth(`${API_URL}/api/lsp/tuk?${query.toString()}`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil data TUK");
  }

  return data;
}

/**
 * GET TUK BY ID
 */
export async function getTUKById(id: number): Promise<TUK> {
  const res = await fetchWithAuth(`${API_URL}/api/lsp/tuk/${id}`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil detail TUK");
  }

  return data.data;
}

/**
 * CREATE TUK
 */
export async function createTUK(payload: CreateTUKRequest): Promise<TUK> {
  const res = await fetchWithAuth(`${API_URL}/api/lsp/tuk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal membuat data TUK");
  }

  return data.data;
}

/**
 * UPDATE TUK
 */
export async function updateTUK(
  id: number,
  payload: UpdateTUKRequest,
): Promise<TUK> {
  const res = await fetchWithAuth(`${API_URL}/api/lsp/tuk/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengupdate data TUK");
  }

  return data.data;
}

/**
 * DELETE TUK
 */
export async function deleteTUK(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/api/lsp/tuk/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal menghapus data TUK");
  }
}
