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
