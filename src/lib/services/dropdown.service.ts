// services/perusahaan.service.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { fetchWithAuth } from "./login.service";

export interface PerusahaanOption {
  noInduk: string;
  company: string | null;
}

export async function getListPerusahaan(
  search?: string,
): Promise<PerusahaanOption[]> {
  const query = new URLSearchParams();
  if (search) query.append("search", search);

  const res = await fetchWithAuth(
    `${API_URL}/api/training/perusahaan?${query.toString()}`,
    { method: "GET" },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil data perusahaan");
  }

  return data.data;
}

// services/judul-training.service.ts — tambahkan di bawah

export interface JudulTrainingOption {
  kode: string;
  judulTraining: string;
  tipe: string;
}

export async function getJudulTrainingOptions(): Promise<
  JudulTrainingOption[]
> {
  const res = await fetchWithAuth(
    `${API_URL}/api/training/judul-training/list`,
    { method: "GET" },
  );

  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil opsi judul training");

  return data.data;
}

export interface TrainerOption {
  kode: string;
  nama: string;
}

export async function getTrainerOptions(): Promise<TrainerOption[]> {
  const res = await fetchWithAuth(`${API_URL}/api/training/trainer/list`, {
    method: "GET",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil opsi trainer");

  return data.data;
}
