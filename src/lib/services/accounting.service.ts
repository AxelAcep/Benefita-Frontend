const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { fetchWithAuth } from "./login.service";

export interface PendapatanItem {
  kodePelatihan: string;
  judulTraining: string;
  judulLengkap: string;
  biaya: number;
  jenisTraining: "REG" | "INH" | "KON"; // tambahkan
  totalPeserta: number;
  pendapatan: number;
  kodeJadwal: string;
  tglSelesai: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PendapatanResponse {
  data: PendapatanItem[];
  pagination: Pagination;
}

export interface PendapatanResponse {
  data: PendapatanItem[];
  pagination: Pagination;
  grandTotal: {
    totalPeserta: number;
    pendapatan: number;
  };
}

export interface GetPendapatanParams {
  page?: number;
  limit?: number;
  sortBy?:
    | "kodePelatihan"
    | "judulTraining"
    | "biaya"
    | "totalPeserta"
    | "pendapatan"
    | "tglSelesai";
  order?: "asc" | "desc";
  startMonth?: number;
  startYear?: number;
  endMonth?: number;
  endYear?: number;
  jenis?: "REG" | "INH" | "KON"; // tambahkan
}

export async function getPendapatan(
  params: GetPendapatanParams = {},
): Promise<PendapatanResponse> {
  const {
    page = 1,
    limit = 10,
    sortBy = "kodePelatihan",
    order = "asc",
    startMonth,
    startYear,
    endMonth,
    endYear,
    jenis,
  } = params;

  const queryParams = new URLSearchParams();
  queryParams.append("page", String(page));
  queryParams.append("limit", String(limit));
  queryParams.append("sortBy", sortBy);
  queryParams.append("order", order);

  if (startMonth !== undefined && startYear !== undefined) {
    queryParams.append("startMonth", String(startMonth));
    queryParams.append("startYear", String(startYear));
  }
  if (endMonth !== undefined && endYear !== undefined) {
    queryParams.append("endMonth", String(endMonth));
    queryParams.append("endYear", String(endYear));
  }
  if (jenis) {
    queryParams.append("jenis", jenis);
  }

  const url = `${API_URL}/api/accounting/pendapatan?${queryParams.toString()}`;

  const res = await fetchWithAuth(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil data pendapatan");
  }

  return data;
}

// ─── Piutang Types ─────────────────────────────────────────────

export interface PiutangItem {
  kodeJadwal: string;
  kodePelatihan: string;
  judulTraining: string;
  judulLengkap: string;
  biaya: number;
  jenisTraining: "REG" | "INH" | "KON";
  tglSelesai: string | null;
  totalPesertaFix: number; // total peserta FIX
  totalPesertaBelumLunas: number; // peserta yang masih kurang bayar
  totalPiutang: number; // total nominal piutang
  totalPendapatan: number;
}

export interface PiutangResponse {
  data: PiutangItem[];
  pagination: Pagination;
  grandTotal: {
    totalPeserta: number;
    totalBelumBayar: number;
    totalPiutang: number;
  };
}

export interface DetailPiutangResponse {
  data: {
    kodeJadwal: string;
    judulLengkap: string;
    peserta: {
      nama: string;
      hargaTotal: number;
      bayar: number;
      kurang: number;
    }[];
  };
}

// ─── API Calls ───────────────────────────────────────────────────

export async function getPiutang(
  params: GetPendapatanParams = {},
): Promise<PiutangResponse> {
  const {
    page = 1,
    limit = 10,
    sortBy = "totalPiutang",
    order = "desc",
    startMonth,
    startYear,
    endMonth,
    endYear,
    jenis,
  } = params;

  const queryParams = new URLSearchParams();
  queryParams.append("page", String(page));
  queryParams.append("limit", String(limit));
  queryParams.append("sortBy", sortBy);
  queryParams.append("order", order);
  if (startMonth !== undefined && startYear !== undefined) {
    queryParams.append("startMonth", String(startMonth));
    queryParams.append("startYear", String(startYear));
  }
  if (endMonth !== undefined && endYear !== undefined) {
    queryParams.append("endMonth", String(endMonth));
    queryParams.append("endYear", String(endYear));
  }
  if (jenis) {
    queryParams.append("jenis", jenis);
  }

  const url = `${API_URL}/api/accounting/piutang?${queryParams.toString()}`;
  const res = await fetchWithAuth(url, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil data piutang");
  return data;
}

export async function getDetailPiutang(
  noJadwal: string,
): Promise<DetailPiutangResponse> {
  const url = `${API_URL}/api/accounting/piutang/${noJadwal}/detail`;
  const res = await fetchWithAuth(url, { method: "GET" });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil detail piutang");
  return data;
}
