const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { fetchWithAuth } from "./login.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type RoleStatus =
  | "ADMIN"
  | "USER"
  | "SUPERADMIN"
  | "FINANCE"
  | "DAILY_ADMIN"
  | "MARKETING_STAFF"
  | "MARKETING_SEMENTARA"; // sesuaikan enum prisma

export interface DokumenPegawai {
  id: string;
  pegawaiId: string;
  nama: string;
  url: string;
  key: string;
  tipe: string | null;
  createdAt: string;
}

export interface UserPegawai {
  id: string;
  email: string;
  phone: string;
  role: RoleStatus;
  createdAt?: string;
}

export interface Pegawai {
  id: string;
  nama: string;
  nip: string | null;
  prefix: string | null;
  kode: string | null;
  jabatan: string | null;
  departemen: string | null;
  fotoUrl: string | null;
  fotoKey: string | null;
  dokumen: DokumenPegawai[];
  user: UserPegawai | null;
}

export interface PegawaiListItem {
  id: string;
  nama: string;
  nip: string | null;
  jabatan: string | null;
  departemen: string | null;
  fotoUrl: string | null;
  user: Pick<UserPegawai, "id" | "email" | "phone" | "role"> | null;
}

export interface PegawaiPagination {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

export interface GetPegawaiListResponse {
  data: PegawaiListItem[];
  meta: PegawaiPagination;
}

export interface CreatePegawaiRequest {
  nama: string;
  nip?: string;
  prefix?: string;
  kode?: string;
  jabatan?: string;
  departemen?: string;
  // User
  phone: string;
  email: string;
  password: string;
  role: RoleStatus;
  // Files
  foto?: File | null;
  dokumen?: File[];
}

export interface UpdatePegawaiRequest {
  nama?: string;
  nip?: string;
  prefix?: string;
  kode?: string;
  jabatan?: string;
  departemen?: string;
  // User
  phone?: string;
  email?: string;
  role?: RoleStatus;
  // Files
  foto?: File | null;
  dokumen?: File[];
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function buildPegawaiFormData(
  payload: CreatePegawaiRequest | UpdatePegawaiRequest,
): FormData {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (key === "dokumen" && Array.isArray(value)) {
      value.forEach((file: File) => formData.append("dokumen", file));
    } else if (value instanceof File) {
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

export async function getListPegawai(params?: {
  page?: number;
  limit?: number;
  search?: string;
  departemen?: string;
  jabatan?: string;
}): Promise<GetPegawaiListResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.search) query.append("search", params.search);
  if (params?.departemen) query.append("departemen", params.departemen);
  if (params?.jabatan) query.append("jabatan", params.jabatan);

  const res = await fetchWithAuth(
    `${API_URL}/api/pegawai?${query.toString()}`,
    { method: "GET" },
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil data pegawai");

  return data;
}

export async function getPegawaiById(id: string): Promise<Pegawai> {
  const res = await fetchWithAuth(`${API_URL}/api/pegawai/${id}`, {
    method: "GET",
  });

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil detail pegawai");

  return data.data;
}

export async function createPegawai(
  payload: CreatePegawaiRequest,
): Promise<Pegawai> {
  const formData = buildPegawaiFormData(payload);

  const res = await fetchWithAuth(`${API_URL}/api/pegawai`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal membuat pegawai");

  return data.data;
}

export async function updatePegawai(
  id: string,
  payload: UpdatePegawaiRequest,
): Promise<Pegawai> {
  const formData = buildPegawaiFormData(payload);

  const res = await fetchWithAuth(`${API_URL}/api/pegawai/${id}`, {
    method: "PUT",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengupdate pegawai");

  return data.data;
}

export async function deletePegawai(id: string): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/api/pegawai/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal menghapus pegawai");
}

export async function resetPassword(
  id: string,
  newPassword: string,
): Promise<void> {
  const res = await fetchWithAuth(
    `${API_URL}/api/pegawai/${id}/reset-password`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    },
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mereset password");
}

export async function resetDevice(id: string): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/api/pegawai/${id}/reset-device`, {
    method: "PATCH",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mereset device");
}

export async function deleteDokumen(dokumenId: string): Promise<void> {
  const res = await fetchWithAuth(
    `${API_URL}/api/pegawai/dokumen/${dokumenId}`,
    { method: "DELETE" },
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal menghapus dokumen");
}
