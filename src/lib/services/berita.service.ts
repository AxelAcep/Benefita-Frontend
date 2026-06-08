const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { fetchWithAuth } from "./login.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface Berita {
  id: string;
  periode: string; // ISO Date String dari backend
  isi: string;
  status: "aktif" | "nonaktif";
}

export interface BeritaResponse<T> {
  message: string;
  data: T;
}

export interface CreateBeritaRequest {
  periode: string; // Format: "YYYY-MM-DD" atau ISO string
  isi: string;
}

export interface UpdateBeritaRequest {
  periode?: string;
  isi?: string;
}

// ─────────────────────────────────────────────
// API SERVICE
// ─────────────────────────────────────────────

/**
 * POST /api/berita
 * Membuat berita baru
 */
export async function createBerita(
  payload: CreateBeritaRequest,
): Promise<BeritaResponse<Berita>> {
  const res = await fetchWithAuth(`${API_URL}/api/berita`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal membuat berita");
  }

  return data;
}

/**
 * GET /api/berita
 * Mengambil semua berita yang berstatus aktif (periode >= now)
 */
export async function getBeritaAktif(): Promise<BeritaResponse<Berita[]>> {
  const res = await fetchWithAuth(`${API_URL}/api/berita`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil berita aktif");
  }

  return data;
}

/**
 * GET /api/berita/riwayat
 * Mengambil semua riwayat berita (dengan status derived)
 */
export async function getAllBerita(): Promise<BeritaResponse<Berita[]>> {
  const res = await fetchWithAuth(`${API_URL}/api/berita/riwayat`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil semua berita");
  }

  return data;
}

/**
 * GET /api/berita/riwayat/:id
 * Mengambil detail satu berita berdasarkan ID
 */
export async function getBeritaById(
  id: string,
): Promise<BeritaResponse<Berita>> {
  const res = await fetchWithAuth(`${API_URL}/api/berita/riwayat/${id}`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Berita tidak ditemukan");
  }

  return data;
}

/**
 * PATCH /api/berita/:id
 * Memperbarui data berita berdasarkan ID
 */
export async function updateBerita(
  id: string,
  payload: UpdateBeritaRequest,
): Promise<BeritaResponse<Berita>> {
  const res = await fetchWithAuth(`${API_URL}/api/berita/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal memperbarui berita");
  }

  return data;
}
