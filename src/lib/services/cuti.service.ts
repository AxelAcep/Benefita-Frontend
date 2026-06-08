const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { fetchWithAuth } from "./login.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type JenisIzin = "CUTI" | "SAKIT" | "IZIN";
export type StatusIzin = "PENDING" | "DISETUJUI" | "DITOLAK";

export interface BuktiIzin {
  id: string;
  pengajuanIzinId: string;
  nama: string;
  url: string;
  key: string;
  createdAt: string;
}

export interface PengajuanIzin {
  id: string;
  pegawaiId: string;
  jenisIzin: JenisIzin;
  tanggalMulai: string;
  tanggalSelesai: string;
  alasan: string;
  alasanTolak: string | null;
  status: StatusIzin;
  tanggalKonfirmasi: string | null;
  createdAt: string;
  bukti: BuktiIzin[];
  pegawai: {
    id: string;
    nama: string;
    nip: string | null;
    jabatan: string | null;
    departemen: string | null;
    fotoUrl: string | null;
  };
}

export interface PengajuanIzinListItem {
  id: string;
  jenisIzin: JenisIzin;
  tanggalMulai: string;
  tanggalSelesai: string;
  alasan: string;
  status: StatusIzin;
  createdAt: string;
  pegawai: {
    id: string;
    nama: string;
    nip: string | null;
    jabatan: string | null;
    departemen: string | null;
  };
}

export interface RiwayatIzinItem {
  id: string;
  jenisIzin: JenisIzin;
  tanggalMulai: string;
  tanggalSelesai: string;
  alasan: string;
  alasanTolak: string | null;
  status: StatusIzin;
  createdAt: string;
  tanggalKonfirmasi: string | null;
  pegawai?: {
    id: string;
    nama: string;
    nip: string | null;
    jabatan: string | null;
    departemen: string | null;
  };
}

export interface KaryawanCutiItem {
  id: string;
  nama: string;
  jabatan: string | null;
  departemen: string | null;
  fotoUrl: string | null;
  totalCutiDanIzin: number;
  totalSakit: number;
}

export interface IzinSummary {
  totalCuti: number;
  totalIzin: number;
  totalSakit: number;
  totalCutiDanIzin: number;
}

export interface IzinPagination {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

export interface GetPengajuanListResponse {
  data: PengajuanIzinListItem[];
  meta: IzinPagination;
}

export interface GetRiwayatResponse {
  data: RiwayatIzinItem[];
  meta: IzinPagination;
  summary: IzinSummary;
}

export interface GetKaryawanCutiResponse {
  data: KaryawanCutiItem[];
  meta: IzinPagination;
}

export interface CreatePengajuanRequest {
  pegawaiId: string;
  jenisIzin: JenisIzin;
  tanggalMulai: string;
  tanggalSelesai: string;
  alasan: string;
  bukti?: File[];
}

export interface KonfirmasiRequest {
  status: "DISETUJUI" | "DITOLAK";
  alasanTolak?: string;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function buildIzinFormData(payload: CreatePengajuanRequest): FormData {
  const formData = new FormData();
  formData.append("pegawaiId", payload.pegawaiId);
  formData.append("jenisIzin", payload.jenisIzin);
  formData.append("tanggalMulai", payload.tanggalMulai);
  formData.append("tanggalSelesai", payload.tanggalSelesai);
  formData.append("alasan", payload.alasan);
  payload.bukti?.forEach((file) => formData.append("bukti", file));
  return formData;
}

// ─────────────────────────────────────────────
// API SERVICE
// ─────────────────────────────────────────────

export async function createPengajuan(
  payload: CreatePengajuanRequest,
): Promise<PengajuanIzin> {
  const formData = buildIzinFormData(payload);

  const res = await fetchWithAuth(`${API_URL}/api/cuti`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal membuat pengajuan izin");

  return data.data;
}

export async function getListPengajuan(params?: {
  page?: number;
  limit?: number;
  search?: string;
  jenisIzin?: JenisIzin;
}): Promise<GetPengajuanListResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.search) query.append("search", params.search);
  if (params?.jenisIzin) query.append("jenisIzin", params.jenisIzin);

  const res = await fetchWithAuth(`${API_URL}/api/cuti?${query.toString()}`, {
    method: "GET",
  });

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil list pengajuan");

  return data;
}

export async function getDetailPengajuan(id: string): Promise<PengajuanIzin> {
  const res = await fetchWithAuth(`${API_URL}/api/cuti/${id}`, {
    method: "GET",
  });

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil detail pengajuan");

  return data.data;
}

export async function konfirmasiPengajuan(
  id: string,
  payload: KonfirmasiRequest,
): Promise<PengajuanIzin> {
  const res = await fetchWithAuth(`${API_URL}/api/cuti/${id}/konfirmasi`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal konfirmasi pengajuan");

  return data.data;
}

export async function getRiwayatByPegawai(
  pegawaiId: string,
  params?: {
    page?: number;
    limit?: number;
    status?: StatusIzin;
    jenisIzin?: JenisIzin;
    tanggalPengajuan?: string;
    tanggalMulai?: string;
  },
): Promise<GetRiwayatResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.status) query.append("status", params.status);
  if (params?.jenisIzin) query.append("jenisIzin", params.jenisIzin);
  if (params?.tanggalPengajuan)
    query.append("tanggalPengajuan", params.tanggalPengajuan);
  if (params?.tanggalMulai) query.append("tanggalMulai", params.tanggalMulai);

  const res = await fetchWithAuth(
    `${API_URL}/api/cuti/riwayat/${pegawaiId}?${query.toString()}`,
    { method: "GET" },
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil riwayat izin");

  return data;
}

export async function getRiwayatAll(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: StatusIzin;
  jenisIzin?: JenisIzin;
  tanggalPengajuan?: string;
  tanggalMulai?: string;
}): Promise<GetRiwayatResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.search) query.append("search", params.search);
  if (params?.status) query.append("status", params.status);
  if (params?.jenisIzin) query.append("jenisIzin", params.jenisIzin);
  if (params?.tanggalPengajuan)
    query.append("tanggalPengajuan", params.tanggalPengajuan);
  if (params?.tanggalMulai) query.append("tanggalMulai", params.tanggalMulai);

  const res = await fetchWithAuth(
    `${API_URL}/api/cuti/riwayat?${query.toString()}`,
    { method: "GET" },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil riwayat semua izin");

  return data;
}

export async function getKaryawanCuti(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<GetKaryawanCutiResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.search) query.append("search", params.search);

  const res = await fetchWithAuth(
    `${API_URL}/api/cuti/karyawan-cuti?${query.toString()}`,
    { method: "GET" },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil data karyawan cuti");

  return data;
}
