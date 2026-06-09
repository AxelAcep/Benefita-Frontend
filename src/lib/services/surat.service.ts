// services/permintaanSurat.service.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface TabPerusahaan {
  noInduk: string;
  jenisInstansi: string;
  company: string | null;
  alamat?: string | null;
  telepon?: string | null;
  email?: string | null;
}

export interface Pegawai {
  id: string;
  nama: string;
  nip: string | null;
  prefix: string | null;
  kode: string | null;
  jabatan: string | null;
  departemen: string | null;
  email: string | null;
  noTelepon: string | null;
}

export interface PermintaanNomorSurat {
  id: number;
  noSurat: string;
  keterangan: string | null;
  tanggalKirim: string;
  tipe: "umum" | "marketing" | "lsp";
  tujuanNoInduk: string;
  pengirimId: string;
  createdAt: string;
  updatedAt: string;
  tujuan: TabPerusahaan;
  pengirim: Pegawai;
}

export interface PermintaanSuratPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetPermintaanSuratResponse {
  success: boolean;
  data: PermintaanNomorSurat[];
  pagination: PermintaanSuratPagination;
}

export interface CreatePermintaanSuratRequest {
  keterangan: string;
  tanggalKirim?: string;
  tujuanNoInduk: string;
  pengirimId: string;
  tipe: "umum" | "marketing" | "lsp";
}

export interface UpdatePermintaanSuratRequest {
  keterangan?: string;
  tanggalKirim?: string;
  tujuanNoInduk?: string;
  pengirimId?: string;
  tipe?: "umum" | "marketing" | "lsp";
}

// ─────────────────────────────────────────────
// FETCH HELPERS
// ─────────────────────────────────────────────

import { fetchWithAuth } from "./login.service";

// ─────────────────────────────────────────────
// API SERVICE
// ─────────────────────────────────────────────

/**
 * GET LIST PERMINTAAN SURAT
 * support:
 * - pagination
 * - filter tipe
 * - search (noSurat, nama pengirim, nama perusahaan)
 */
export async function getListPermintaanSurat(params?: {
  page?: number;
  limit?: number;
  tipe?: "umum" | "marketing" | "lsp";
  search?: string;
}): Promise<GetPermintaanSuratResponse> {
  const query = new URLSearchParams();

  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.tipe) query.append("tipe", params.tipe);
  if (params?.search) query.append("search", params.search);

  const res = await fetchWithAuth(
    `${API_URL}/api/permintaan-surat?${query.toString()}`,
    {
      method: "GET",
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil data permintaan surat");
  }

  return data;
}

/**
 * GET BY ID
 */
export async function getPermintaanSuratById(
  id: number,
): Promise<PermintaanNomorSurat> {
  const res = await fetchWithAuth(`${API_URL}/api/permintaan-surat/${id}`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil detail permintaan surat");
  }

  return data.data;
}

/**
 * CREATE PERMINTAAN SURAT
 */
export async function createPermintaanSurat(
  payload: CreatePermintaanSuratRequest,
): Promise<PermintaanNomorSurat> {
  const res = await fetchWithAuth(`${API_URL}/api/permintaan-surat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal membuat permintaan surat");
  }

  return data.data;
}

/**
 * UPDATE PERMINTAAN SURAT
 */
export async function updatePermintaanSurat(
  id: number,
  payload: UpdatePermintaanSuratRequest,
): Promise<PermintaanNomorSurat> {
  const res = await fetchWithAuth(`${API_URL}/api/permintaan-surat/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal update permintaan surat");
  }

  return data.data;
}

/**
 * DELETE PERMINTAAN SURAT
 */
export async function deletePermintaanSurat(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/api/permintaan-surat/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal hapus permintaan surat");
  }
}
