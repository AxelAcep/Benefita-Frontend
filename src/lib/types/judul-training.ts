/** Judul Training — katalog judul, biaya, dan brosurnya. */

export interface JudulTraining {
  id: number;
  kode: string;
  judulTraining: string;
  tipe: string;
  hari: number;
  biayaOffline: number;
  biayaOnline: number;
  batch: number;
  brosur: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Bentuk baris dari GET /api/training/judul-training */
export interface JudulTrainingListItem {
  id: number;
  kode: string;
  judulTraining: string;
  tipe: string;
  hari: number;
  biayaOnline: number;
  biayaOffline: number;
  batch: number;
  brosur: string | null;
}

export interface CreateJudulTrainingRequest {
  kode: string;
  judulTraining: string;
  tipe: string;
  hari: number;
  biayaOffline: number;
  biayaOnline: number;
  batch: number;
  /** Dikirim sebagai multipart kalau ada berkas baru. */
  brosur?: File | null;
}

export type UpdateJudulTrainingRequest = Partial<CreateJudulTrainingRequest>;

/**
 * Brosur disimpan backend sebagai path relatif. Ubah jadi URL yang bisa
 * dibuka; kalau sudah berupa URL penuh, pakai apa adanya.
 */
export function urlBrosur(brosur: string | null): string | null {
  if (!brosur) return null;
  if (brosur.startsWith("http://") || brosur.startsWith("https://")) {
    return brosur;
  }
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  return `${base}/${brosur.replace(/^\/+/, "")}`;
}
