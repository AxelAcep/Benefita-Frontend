// services/proper.service.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { fetchWithAuth } from "./login.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface PeringkatCounts {
  EMAS: number;
  HIJAU: number;
  BIRU: number;
  MERAH: number;
  HITAM: number;
  DITUNDA: number;
  MASALAH: number;
  TUTUP: number;
  DITANGGUHKAN: number;
  MERAH_MUDA: number;
}

export interface ProperProvinsiData {
  id: string;
  provinsi: string;
  peringkat: PeringkatCounts;
  total: number;
}

export interface ProperListResponse {
  tahun: number;
  data: ProperProvinsiData[];
  total: number; // total keseluruhan semua provinsi
}

// ─────────────────────────────────────────────
// API SERVICE
// ─────────────────────────────────────────────

/**
 * GET /api/database/proper-list?tahun={tahun}
 * Mengambil data proper berdasarkan tahun,
 * dikelompokkan per provinsi dengan count peringkat.
 */
export async function getProperList(
  tahun: number,
): Promise<ProperListResponse> {
  const res = await fetchWithAuth(
    `${API_URL}/api/database/proper-list?tahun=${tahun}`,
    {
      method: "GET",
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil data proper");
  }

  return data;
}
