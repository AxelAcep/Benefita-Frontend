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

export interface MonthRow {
  bulan: string;
  values: (number | null)[];
  totalFix: number;
}

export async function getJadwalFix(quarter: string): Promise<MonthRow[]> {
  const res = await fetchWithAuth(
    `${API_URL}/api/dashboard/jadwal-fix?quarter=${quarter}`,
  );
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil data jadwal fix");
  return data.data;
}

export interface ScheduleDay {
  day: "senin" | "selasa" | "rabu" | "kamis" | "jumat";
  code: string;
  category: "WM" | "CSR" | "TSM" | "EPM";
}

export interface TrainingRow {
  judul: string;
  noJadwal: string;
  jenis: string;
  status: string;
  isHot: boolean;
  metode: string;
  lokasi: string;
  lokasiType: "hybrid" | "online" | "hotel";
  lokasiDetail: string;
  biaya: number;
  ten: number;
  fix: number;
  peserta: number;
  trainers: string[];
  tglMulai: string | null;
  tglSelesai: string | null;
  days: ScheduleDay[];
}

export interface KalenderParams {
  bulan?: number;
  tahun?: number;
  search?: string;
}

export async function getKalenderTraining(
  params: KalenderParams = {},
): Promise<{ data: TrainingRow[]; total: number }> {
  const query = new URLSearchParams();
  if (params.bulan) query.set("bulan", String(params.bulan));
  if (params.tahun) query.set("tahun", String(params.tahun));
  if (params.search) query.set("search", params.search);

  const res = await fetchWithAuth(
    `${API_URL}/api/dashboard/kalender-training?${query}`,
  );
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil kalender training");
  return { data: data.data, total: data.total };
}
