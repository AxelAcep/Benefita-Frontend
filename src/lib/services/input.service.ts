const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { fetchWithAuth } from "./login.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface PesertaTrainingListItem {
  id: number;
  nama: string;
  perusahaan: { noInduk: string; company: string | null };
  accExecutive: string | null;
  ownEnv: string | null;
  metode: string | null;
  status: string | null;
  ujian: string | null;
  konfirmasiOleh: string | null;
  hargaTotal: number | null;
  diskon: number | null;
  ppn: number | null;
  bayar: number | null;
  cashback: number | null;
  sisa: number;
  infoPembayaran: string | null;
  catatan: string | null;
  tglInput: string;
  tglUpdate: string;
  pegawaiInput: { id: string; nama: string } | null;
  pegawaiUpdate: { id: string; nama: string } | null;
  pegawaiKonfirmasi: { id: string; nama: string } | null;
}

export interface PesertaTraining extends PesertaTrainingListItem {
  jabatan: string | null;
  alamat: string | null;
  noTelp: string | null;
  noFax: string | null;
  email: string | null;
  alamatPengirimanSertifikat: string | null;
  industri: string | null;
  noInvUjian: string | null;
  noKwtUjian: string | null;
  infoPenagihan: string | null;
  tglBayar: string | null;
  noInvoice: string | null;
  noKwitansi: string | null;
  fileBuktiPembayaran: string | null;
  filePendaftaran: string | null;
  jadwalTraining: {
    noJadwal: string;
    judulLengkap: string;
    judulPendek: string;
    metode: string;
    biaya: number;
    status: string;
    kodePelatihan: string;
    lokasiDetail: string | null;
    kota: string;
    tglMulai: string | null;
    tglSelesai: string | null;
    catatan: string | null;
  };
}

export interface JadwalSummary {
  noJadwal: string;
  metode: string;
  biaya: number;
  status: string;
  kodePelatihan: string;
  lokasiDetail: string | null;
  judulLengkap: string;
  catatan: string | null;
  tglMulai: string | null;
  tglSelesai: string | null;
  kota: string;
  pesertaFixOffline: number;
  pesertaFixOnline: number;
}

export interface PesertaTrainingPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetPesertaTrainingResponse {
  jadwal: JadwalSummary;
  data: PesertaTrainingListItem[];
  meta: PesertaTrainingPagination;
}

export interface CreatePesertaTrainingRequest {
  nama: string;
  jabatan?: string;
  alamat?: string;
  noTelp?: string;
  noFax?: string;
  email?: string;
  alamatPengirimanSertifikat?: string;
  catatan?: string;
  industri?: string;
  status?: string;
  ownEnv?: string;
  metode?: string;
  noIndukPerusahaan: string;
  accExecutive?: string;
  ujian?: string;
  noInvUjian?: string;
  noKwtUjian?: string;
  diskon?: number;
  ppn?: number;
  cashback?: number;
  hargaTotal?: number;
  bayar?: number;
  infoPembayaran?: string;
  infoPenagihan?: string;
  tglBayar?: string;
  noInvoice?: string;
  noKwitansi?: string;
  fileBuktiPembayaran?: File;
  filePendaftaran?: File;
}

export type UpdatePesertaTrainingRequest =
  Partial<CreatePesertaTrainingRequest> & {
    konfirmasiOleh?: string;
  };

// ─────────────────────────────────────────────
// API SERVICE
// ─────────────────────────────────────────────

/**
 * GET LIST PESERTA BY JADWAL
 */
export async function getPesertaTraining(
  noJadwal: string,
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  },
): Promise<GetPesertaTrainingResponse> {
  const query = new URLSearchParams();

  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.search) query.append("search", params.search);
  if (params?.status) query.append("status", params.status);

  const res = await fetchWithAuth(
    `${API_URL}/api/input/jadwal/${noJadwal}/peserta?${query.toString()}`,
    { method: "GET" },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil data peserta");
  }

  return data;
}

/**
 * GET ONE PESERTA
 */
export async function getPesertaTrainingById(
  id: string,
): Promise<PesertaTraining> {
  const res = await fetchWithAuth(`${API_URL}/api/input/peserta/${id}`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil detail peserta");
  }

  return data.data;
}

/**
 * CREATE PESERTA
 */
export async function createPesertaTraining(
  noJadwal: string,
  payload: CreatePesertaTrainingRequest,
): Promise<PesertaTraining> {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, val]) => {
    if (val === undefined || val === null) return;
    if (val instanceof File) {
      formData.append(key, val);
    } else {
      formData.append(key, String(val));
    }
  });

  const res = await fetchWithAuth(
    `${API_URL}/api/input/jadwal/${noJadwal}/peserta`,
    { method: "POST", body: formData },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal menambahkan peserta");
  }

  return data.data;
}

/**
 * UPDATE PESERTA
 */
export async function updatePesertaTraining(
  id: string,
  payload: UpdatePesertaTrainingRequest,
): Promise<PesertaTraining> {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, val]) => {
    if (val === undefined || val === null) return;
    if (val instanceof File) {
      formData.append(key, val);
    } else {
      formData.append(key, String(val));
    }
  });

  const res = await fetchWithAuth(`${API_URL}/api/input/peserta/${id}`, {
    method: "PUT",
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengupdate peserta");
  }

  return data.data;
}

/**
 * DELETE PESERTA
 */
export async function deletePesertaTraining(id: string): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/api/input/peserta/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal menghapus peserta");
  }
}
