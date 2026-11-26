import { apiPublic } from "@/lib/api/client";
import { apiDelete, apiGet, apiGetResponse, apiPatch, apiPost, apiPostForm, apiPutForm, keFormData } from "@/lib/api/client";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { fetchWithAuth } from "./login.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

import type {
  CreatePesertaTrainingRequest,
  GetPesertaTrainingResponse,
  PesertaTraining,
  UpdatePesertaTrainingRequest,
} from "@/lib/types/input-peserta";
export type * from "@/lib/types/input-peserta";

// ─────────────────────────────────────────────
// API SERVICE
// ─────────────────────────────────────────────

/**
 * GET LIST PESERTA BY JADWAL
 */
export function getPesertaTraining(noJadwal: string, params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  return apiGetResponse<GetPesertaTrainingResponse>(
    `/api/input/jadwal/${encodeURIComponent(noJadwal)}/peserta`,
    params,
    "Gagal mengambil data peserta.",
  );
}

/**
 * GET ONE PESERTA
 */
export const getPesertaTrainingById = (id: string) =>
  apiGet<PesertaTraining>(
    `/api/input/peserta/${encodeURIComponent(id)}`,
    undefined,
    "Gagal mengambil detail peserta.",
  );

export const createPesertaTraining = (noJadwal: string, payload: CreatePesertaTrainingRequest) =>
  apiPostForm<PesertaTraining>(
    `/api/input/jadwal/${encodeURIComponent(noJadwal)}/peserta`,
    keFormData({ ...payload }),
    "Gagal menambahkan peserta.",
  );

export const updatePesertaTraining = (id: string, payload: UpdatePesertaTrainingRequest) =>
  apiPutForm<PesertaTraining>(
    `/api/input/peserta/${encodeURIComponent(id)}`,
    keFormData({ ...payload }),
    "Gagal memperbarui peserta.",
  );

export const deletePesertaTraining = (id: string) =>
  apiDelete(`/api/input/peserta/${encodeURIComponent(id)}`, "Gagal menghapus peserta.");

export const updateStatusFinalPeserta = (id: string, statusFinal = true) =>
  apiPatch<PesertaTraining>(
    `/api/input/peserta/${encodeURIComponent(id)}/final`,
    { statusFinal },
    "Gagal mengubah status Final peserta.",
  );

// ─────────────────────────────────────────────
// BRIDGE KE UJI KOMPETENSI (LSP)
// Daftarkan peserta yang sudah Final ke PesertaUji.
// ─────────────────────────────────────────────

export interface SkemaKualifikasiOption {
  id: number;
  kode: string;
  nama: string;
}

export const getSkemaKualifikasiOptions = () =>
  apiGet<SkemaKualifikasiOption[]>("/api/input/skema-kualifikasi/list", undefined, "Gagal mengambil daftar skema kualifikasi.");

export interface PesertaUji {
  id: number;
  pesertaTrainingId: number | null;
  nama: string;
  instansi: string | null;
  email: string | null;
  wa: string | null;
  skemaId: number;
  status: string;
  skema: SkemaKualifikasiOption;
}

export const createPesertaUjiFromTraining = (pesertaTrainingId: string, skemaId: number) =>
  apiPost<PesertaUji>(
    "/api/input/peserta-uji/dari-training",
    { pesertaTrainingId, skemaId },
    "Gagal mendaftarkan peserta ke uji kompetensi.",
  );

export interface BiodataPeserta {
  id: number;
  nama: string;
  tempatLahir: string | null;
  tanggalLahir: string | null;
  jenisKelamin: string | null;
  jabatan: string | null;
  bidang: string | null;
  email: string | null;
  noHp: string | null;
  noIndukPerusahaan: string | null;
  perusahaan: {
    noInduk: string;
    company: string;
    alamat: string | null;
    telp: string | null;
  } | null;
}

export interface UpdateBiodataPesertaRequest {
  nama?: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  jenisKelamin?: string;
  noIndukPerusahaan?: string;
  jabatan?: string;
  bidang?: string;
  email?: string;
  noHp?: string;
}

/**
 * GET BIODATA PESERTA (public form - sebelum diisi)
 */
export function getBiodataPeserta(id: string): Promise<BiodataPeserta> {
  return apiPublic<BiodataPeserta>(
    `/api/input/peserta/${encodeURIComponent(id)}/biodata`,
    {},
    "Gagal mengambil biodata peserta",
  );
}

/**
 * UPDATE BIODATA PESERTA (public form - trainer isi/benerin)
 */
export function updateBiodataPeserta(
  id: string,
  payload: UpdateBiodataPesertaRequest,
): Promise<PesertaTraining> {
  return apiPublic<PesertaTraining>(
    `/api/input/peserta/${encodeURIComponent(id)}/biodata`,
    { method: "PATCH", payload },
    "Gagal mengupdate biodata peserta",
  );
}

/**
 * GET CONTEXT EVALUASI (public - sebelum diisi)
 */
export async function getEvaluasiContext(id: string): Promise<EvaluasiContext> {
  const res = await fetch(`${API_URL}/api/public/evaluasi/${id}`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil data evaluasi");
  }

  return data.data;
}

/**
 * GET LIST JUDUL TRAINING (public - opsi checkbox pelatihan diminati)
 */

export interface EvaluasiContext {
  pesertaTrainingId: number;
  nama: string;
  jadwalTraining: {
    noJadwal: string;
    judulLengkap: string;
    judulPendek: string | null;
    tglMulai: string | null;
    tglSelesai: string | null;
  };
  sudahMengisi: boolean;
}

export interface JudulTrainingOption {
  id: number;
  kode: string;
  judulTraining: string;
  tipe: string;
}

export interface CreateEvaluasiPelatihanRequest {
  nilaiSistematikaMateri: number;
  nilaiTampilanSlide: number;
  nilaiAlokasiWaktu: number;
  nilaiPenerapanMateri: number;
  nilaiPeningkatanKompetensi: number;
  nilaiTrainer: number;
  manfaatUntukPeserta?: string;
  manfaatUntukPerusahaan?: string;
  divisiDisarankan?: string;
  prosedurPengajuan?: string;
  pelatihanDiminatiIds?: number[];
}

export interface EvaluasiPelatihan {
  id: number;
  pesertaTrainingId: number;
  nilaiSistematikaMateri: number;
  nilaiTampilanSlide: number;
  nilaiAlokasiWaktu: number;
  nilaiPenerapanMateri: number;
  nilaiPeningkatanKompetensi: number;
  nilaiTrainer: number;
  manfaatUntukPeserta: string | null;
  manfaatUntukPerusahaan: string | null;
  divisiDisarankan: string | null;
  prosedurPengajuan: string | null;
  pelatihanDiminati: {
    judulTraining: JudulTrainingOption;
  }[];
}

export async function getJudulTrainingOptions(): Promise<
  JudulTrainingOption[]
> {
  const res = await fetch(`${API_URL}/api/public/evaluasi/judul-training`, {
    method: "GET",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil daftar pelatihan");
  }

  return data.data;
}

/**
 * CREATE EVALUASI PELATIHAN (public - submit form)
 */
export async function createEvaluasiPelatihan(
  id: string,
  payload: CreateEvaluasiPelatihanRequest,
): Promise<EvaluasiPelatihan> {
  const res = await fetch(`${API_URL}/api/public/evaluasi/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengirim evaluasi");
  }

  return data.data;
}

export interface JadwalPesertaLinksResponse {
  jadwal: {
    judulLengkap: string;
    tglMulai: string | null;
    metode: string | null;
  };
  peserta: {
    id: number;
    nama: string;
  }[];
}

/**
 * GET JADWAL + PESERTA (public - buat halaman pengumuman link biodata/evaluasi)
 */
export async function getJadwalPesertaLinks(
  noJadwal: string,
): Promise<JadwalPesertaLinksResponse> {
  const res = await fetch(
    `${API_URL}/api/public/jadwal/${noJadwal}/peserta-links`,
    { method: "GET" },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil data jadwal");
  }

  return data.data;
}

export type { RekapEvaluasiResponse } from "@/lib/types/rekap-evaluasi";
export { getRekapEvaluasi } from "./rekap-evaluasi.service";
