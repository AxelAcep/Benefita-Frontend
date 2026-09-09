const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { fetchWithAuth } from "./login.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export const CHECKLIST_FIELDS = [
  "suratKetKerja",
  "suratRekom",
  "sertPel",
  "cv",
  "ktp",
  "ijazah",
  "pasFoto",
  "verTUK",
  "ksediaTUK",
  "apl01",
  "apl02",
] as const;

export type ChecklistField = (typeof CHECKLIST_FIELDS)[number];

export interface PesertaUji {
  id: number;
  pesertaTrainingId: number | null;
  nama: string;
  instansi: string | null;
  tempatTinggal: string | null;
  email: string | null;
  wa: string | null;

  skemaId: number;
  skema: { id: number; kode: string; nama: string };

  tukId: number | null;
  tuk: { id: number; nama: string } | null;

  asesorId: number | null;
  asesor: { id: number; nama: string } | null;

  tglUji: string | null;
  noReg: string | null;
  noSerBNSP: string | null;
  tglTerbit: string | null;
  statusHasil: string | null;

  suratKetKerja: boolean;
  suratRekom: boolean;
  sertPel: boolean;
  cv: boolean;
  ktp: boolean;
  ijazah: boolean;
  pasFoto: boolean;
  verTUK: boolean;
  ksediaTUK: boolean;
  apl01: boolean;
  apl02: boolean;

  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PesertaUjiPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetPesertaUjiResponse {
  data: PesertaUji[];
  pagination: PesertaUjiPagination;
}

// ─────────────────────────────────────────────
// API SERVICE
// ─────────────────────────────────────────────

/**
 * GET LIST PESERTA UJI — default cuma status CALON & SIAP_UJI
 */
export async function getPesertaUjiList(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  statusHasil?: string;
  skemaId?: number | "";
  tahun?: string;
  tanggal?: string;
}): Promise<GetPesertaUjiResponse> {
  const query = new URLSearchParams();

  if (params?.page) query.append("page", String(params.page));
  if (params?.limit) query.append("limit", String(params.limit));
  if (params?.search) query.append("search", params.search);
  if (params?.status) query.append("status", params.status);
  if (params?.statusHasil) query.append("statusHasil", params.statusHasil);
  if (params?.skemaId) query.append("skemaId", String(params.skemaId));
  if (params?.tahun) query.append("tahun", params.tahun);
  if (params?.tanggal) query.append("tanggal", params.tanggal);

  const res = await fetchWithAuth(
    `${API_URL}/api/lsp/peserta-uji?${query.toString()}`,
    { method: "GET" },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil data peserta uji");
  }

  return data;
}

/**
 * UPDATE CHECKLIST DOKUMEN (inline)
 */
export async function updatePesertaUjiChecklist(
  id: number,
  payload: Partial<Record<ChecklistField, boolean>>,
): Promise<PesertaUji> {
  const res = await fetchWithAuth(
    `${API_URL}/api/lsp/peserta-uji/${id}/checklist`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengupdate checklist dokumen");
  }

  return data.data;
}

/**
 * GET PESERTA UJI BY ID
 */
export async function getPesertaUjiById(id: number): Promise<PesertaUji> {
  const res = await fetchWithAuth(`${API_URL}/api/lsp/peserta-uji/${id}`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil detail peserta uji");
  }

  return data.data;
}

/**
 * ASSIGN PELAKSANAAN UJI — TUK, Asesor, tanggal uji
 */
export async function assignPesertaUjiPelaksanaan(
  id: number,
  payload: { tukId?: number | ""; asesorId?: number | ""; tglUji?: string },
): Promise<PesertaUji> {
  const res = await fetchWithAuth(`${API_URL}/api/lsp/peserta-uji/${id}/assign`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal meng-assign pelaksanaan uji");
  }

  return data.data;
}

export interface UpdatePesertaUjiHasilPayload {
  statusHasil: "K" | "BK";
  noReg?: string;
  noSerBNSP?: string;
  tglTerbit?: string;
}

/**
 * INPUT HASIL UJI — K/BK, plus noSerBNSP & tglTerbit kalau K
 */
export async function updatePesertaUjiHasil(
  id: number,
  payload: UpdatePesertaUjiHasilPayload,
): Promise<PesertaUji> {
  const res = await fetchWithAuth(`${API_URL}/api/lsp/peserta-uji/${id}/hasil`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal menyimpan hasil uji");
  }

  return data.data;
}

// ─────────────────────────────────────────────
// LAPORAN
// ─────────────────────────────────────────────

export interface LaporanKlhkRow {
  tglUjian: string;
  kodeSkema: string;
  namaSkema: string;
  jumlahK: number;
  jumlahBk: number;
  jumlahTotal: number;
}

/**
 * LAPORAN KLHK — rekap jumlah K/BK/Total per tanggal ujian + skema
 */
export async function getLaporanKlhk(params?: {
  tahun?: string;
  skemaId?: number | "";
}): Promise<LaporanKlhkRow[]> {
  const query = new URLSearchParams();
  if (params?.tahun) query.append("tahun", params.tahun);
  if (params?.skemaId) query.append("skemaId", String(params.skemaId));

  const res = await fetchWithAuth(
    `${API_URL}/api/lsp/laporan/klhk?${query.toString()}`,
    { method: "GET" },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil laporan KLHK");
  }

  return data.data;
}
