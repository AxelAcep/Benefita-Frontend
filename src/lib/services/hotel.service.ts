const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface Hotel {
  id: string;
  kodeHotel: string;
  namaHotel: string;
  alamat: string;
  kota: string;
  telepon: string;
  fax?: string | null;
  pubRate?: number | null;
  corRate?: number | null;
}

export interface HotelPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetHotelsResponse {
  data: Hotel[];
  pagination: HotelPagination;
}

export interface CreateHotelRequest {
  kodeHotel: string;
  namaHotel: string;
  alamat: string;
  kota: string;
  telepon: string;
  fax?: string;
  pubRate?: number;
  corRate?: number;
}

export interface UpdateHotelRequest {
  namaHotel?: string;
  alamat?: string;
  kota?: string;
  telepon?: string;
  fax?: string;
  pubRate?: number;
  corRate?: number;
}

// ─────────────────────────────────────────────
// FETCH HELPERS (pakai auth wrapper kamu)
// ─────────────────────────────────────────────

import { fetchWithAuth } from "./login.service";

// ─────────────────────────────────────────────
// API SERVICE
// ─────────────────────────────────────────────

/**
 * GET ALL HOTEL
 * support:
 * - pagination
 * - filter kota
 * - search (kode, nama, alamat)
 */
export async function getHotels(params?: {
  page?: number;
  limit?: number;
  kota?: string;
  search?: string;
}): Promise<GetHotelsResponse> {
  const query = new URLSearchParams();

  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.kota) query.append("kota", params.kota);
  if (params?.search) query.append("search", params.search);

  const res = await fetchWithAuth(
    `${API_URL}/api/training/hotel?${query.toString()}`,
    {
      method: "GET",
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil data hotel");
  }

  return data;
}

/**
 * GET BY ID
 */
export async function getHotelById(id: string): Promise<Hotel> {
  const res = await fetchWithAuth(`${API_URL}/api/training/hotel/${id}`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil detail hotel");
  }

  return data.data;
}

/**
 * CREATE HOTEL
 */
export async function createHotel(payload: CreateHotelRequest): Promise<Hotel> {
  const res = await fetchWithAuth(`${API_URL}/api/training/hotel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal membuat hotel");
  }

  return data.data;
}

/**
 * UPDATE HOTEL
 */
export async function updateHotel(
  id: string,
  payload: UpdateHotelRequest,
): Promise<Hotel> {
  const res = await fetchWithAuth(`${API_URL}/api/training/hotel/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal update hotel");
  }

  return data.data;
}

/**
 * DELETE HOTEL
 */
export async function deleteHotel(id: string): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/api/training/hotel/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal hapus hotel");
  }
}
