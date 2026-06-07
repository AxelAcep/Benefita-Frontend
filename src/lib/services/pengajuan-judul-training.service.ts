// services/pengajuan-judul-training.service.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { fetchWithAuth } from "./login.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface PengajuanJudulTraining {
  id: string;
  judulTraining: string;
  jumlahHari: number;
  namaKontak: string | null;
  kontak: string | null;
  jumlahPeserta: number | null;
  responMA: "PENDING" | "DISETUJUI" | "DITOLAK";
  tanggalPengajuan: string;
  perusahaan: {
    noInduk: string;
    company: string | null;
  };
  inputOleh: {
    id: string;
    nama: string;
    jabatan?: string | null;
  };
}

export interface PengajuanListItem {
  id: string;
  judulTraining: string;
  jumlahHari: number;
  jumlahPeserta: number | null;
  namaKontak: string | null;
  kontak: string | null;
  responMA: string;
  tanggalPengajuan: string;
  perusahaan: {
    noInduk: string;
    company: string | null;
  };
  inputOleh: {
    id: string;
    nama: string;
  };
}

export interface PengajuanPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetPengajuanResponse {
  data: PengajuanListItem[];
  pagination: PengajuanPagination;
}

export interface CreatePengajuanRequest {
  judulTraining: string;
  jumlahHari: number;
  perusahaanId?: string;
  namaKontak?: string;
  kontak?: string;
  jumlahPeserta?: number;
}

export interface UpdatePengajuanRequest {
  judulTraining?: string;
  jumlahHari?: number;
  perusahaanId?: string;
  namaKontak?: string;
  kontak?: string;
  jumlahPeserta?: number;
  responMA?: string;
}

// ─────────────────────────────────────────────
// API SERVICE
// ─────────────────────────────────────────────

export async function getPengajuan(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<GetPengajuanResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.search) query.append("search", params.search);

  const res = await fetchWithAuth(
    `${API_URL}/api/training/pengajuan-judul?${query.toString()}`,
    { method: "GET" },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil data pengajuan");

  return data;
}

export async function getPengajuanById(
  id: string,
): Promise<PengajuanJudulTraining> {
  const res = await fetchWithAuth(
    `${API_URL}/api/training/pengajuan-judul/${id}`,
    { method: "GET" },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil detail pengajuan");

  return data.data;
}

export async function createPengajuan(
  payload: CreatePengajuanRequest,
): Promise<PengajuanJudulTraining> {
  const res = await fetchWithAuth(`${API_URL}/api/training/pengajuan-judul`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal membuat pengajuan");

  return data.data;
}

export async function updatePengajuan(
  id: string,
  payload: UpdatePengajuanRequest,
): Promise<PengajuanJudulTraining> {
  const res = await fetchWithAuth(
    `${API_URL}/api/training/pengajuan-judul/${id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengupdate pengajuan");

  return data.data;
}
