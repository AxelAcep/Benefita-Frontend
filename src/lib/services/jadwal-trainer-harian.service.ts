// services/jadwal-trainer-harian.service.ts
// Assign trainer per hari — rentang tglMulai–tglSelesai jadwal dibongkar
// per hari, tiap hari bisa diisi lebih dari 1 trainer.

const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { fetchWithAuth } from "./login.service";
import type { TrainerOption } from "./dropdown.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface JadwalTrainerHariItem {
  tanggal: string; // yyyy-mm-dd
  trainers: TrainerOption[];
}

export interface JadwalTrainerHariSummary {
  noJadwal: string;
  judulLengkap: string;
  tglMulai: string;
  tglSelesai: string;
}

export interface GetJadwalTrainerHariResponse {
  jadwal: JadwalTrainerHariSummary;
  data: JadwalTrainerHariItem[];
}

export interface UpdateJadwalTrainerHariPayload {
  hari: { tanggal: string; trainerKodes: string[] }[];
}

// ─────────────────────────────────────────────
// API SERVICE
// ─────────────────────────────────────────────

/**
 * GET assign trainer per hari untuk 1 jadwal training
 */
export async function getJadwalTrainerHari(
  noJadwal: string,
): Promise<GetJadwalTrainerHariResponse> {
  const res = await fetchWithAuth(
    `${API_URL}/api/training/jadwal-training/${noJadwal}/hari-trainer`,
    { method: "GET" },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil assignment trainer");
  }

  return data;
}

/**
 * UPDATE (edit) assign trainer per hari untuk 1 jadwal training
 */
export async function updateJadwalTrainerHari(
  noJadwal: string,
  payload: UpdateJadwalTrainerHariPayload,
): Promise<GetJadwalTrainerHariResponse> {
  const res = await fetchWithAuth(
    `${API_URL}/api/training/jadwal-training/${noJadwal}/hari-trainer`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal menyimpan assignment trainer");
  }

  return data;
}
