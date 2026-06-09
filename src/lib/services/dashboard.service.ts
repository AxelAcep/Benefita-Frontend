const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { fetchWithAuth } from "./login.service";

// ─── Types ───

export interface AERow {
  initial: string;
  name: string;
  senin: number;
  selasa: number;
  rabu: number;
  kamis: number;
  jumat: number;
  fix: number;
  ten: number;
  env: number;
  csr: number;
  tsm: number;
  epm: number;
  updateData: number;
}

export interface AttendanceItem {
  initial: string;
  name: string;
  divisi: string;
  status: "Masuk" | "Sakit" | "Izin";
}

export interface PieItem {
  name: string;
  value: number;
  color: string;
}

export interface KehadiranData {
  attendanceData: AttendanceItem[];
  pieData: PieItem[];
  total: number;
}

// ─── API ───

export async function getMarketingActivity(): Promise<AERow[]> {
  const res = await fetchWithAuth(
    `${API_URL}/api/dashboard/marketing-activity`,
  );
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil data marketing activity");
  return data.data;
}

export async function getKehadiran(): Promise<KehadiranData> {
  const res = await fetchWithAuth(`${API_URL}/api/dashboard/kehadiran`);
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil data kehadiran");
  return data.data;
}
