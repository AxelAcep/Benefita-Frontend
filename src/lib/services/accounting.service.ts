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

// ─── NERACA TYPES ─────────────────────────────────────────────

export interface NeracaItem {
  id: number;
  tanggal: string; // ISO date string
  jenisBiaya: {
    kode: string;
    ket: string;
  };
  uraian: string;
  bukti: string;
  debit: number; // from BigInt, converted to number
  kredit: number;
  saldo: number;
  periode: string; // format YYYYMM
  userInput: {
    nama: string;
  } | null;
  userUpdate: {
    nama: string;
  } | null;
  tanggalInput: string;
  tanggalUpdate: string | null;
}

export interface NeracaResponse {
  data: NeracaItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
}

export interface CreateNeracaPayload {
  tanggal: string; // ISO date string
  kode: string; // kode jenis biaya
  uraian?: string;
  bukti?: string;
  debit?: number;
  kredit?: number;
}

export interface UpdateNeracaPayload {
  tanggal?: string;
  kode?: string;
  uraian?: string;
  bukti?: string;
  debit?: number;
  kredit?: number;
}

export interface GetNeracaParams {
  startMonth?: number;
  startYear?: number;
  endMonth?: number;
  endYear?: number;
  page?: number;
  limit?: number;
  startDate?: string; // ISO date string
  endDate?: string;
  month?: number; // 1-12
  year?: number; // YYYY
  jenisBiayaKode?: string;
  debitMin?: number;
  debitMax?: number;
  kreditMin?: number;
  kreditMax?: number;
  search?: string; // cari di uraian, bukti, periode
}

// ─── NERACA API CALLS ─────────────────────────────────────────

/**
 * GET Neraca dengan pagination & filter
 */
export async function getNeraca(
  params: GetNeracaParams = {},
): Promise<NeracaResponse> {
  const {
    page = 1,
    limit = 10,
    startDate,
    endDate,
    month,
    year,
    jenisBiayaKode,
    debitMin,
    debitMax,
    kreditMin,
    kreditMax,
    search,
  } = params;

  const queryParams = new URLSearchParams();
  queryParams.append("page", String(page));
  queryParams.append("limit", String(limit));

  if (startDate) queryParams.append("startDate", startDate);
  if (endDate) queryParams.append("endDate", endDate);
  if (month !== undefined) queryParams.append("month", String(month));
  if (year !== undefined) queryParams.append("year", String(year));
  if (jenisBiayaKode) queryParams.append("jenisBiayaKode", jenisBiayaKode);
  if (debitMin !== undefined) queryParams.append("debitMin", String(debitMin));
  if (debitMax !== undefined) queryParams.append("debitMax", String(debitMax));
  if (kreditMin !== undefined)
    queryParams.append("kreditMin", String(kreditMin));
  if (kreditMax !== undefined)
    queryParams.append("kreditMax", String(kreditMax));
  if (search) queryParams.append("search", search);

  const url = `${API_URL}/api/accounting/neraca?${queryParams.toString()}`;

  const res = await fetchWithAuth(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengambil data neraca");
  }

  return data;
}

/**
 * CREATE Neraca baru
 */
export async function createNeraca(
  payload: CreateNeracaPayload,
): Promise<{ message: string; data: NeracaItem }> {
  const url = `${API_URL}/api/accounting/neraca`;

  const res = await fetchWithAuth(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal membuat data neraca");
  }

  return data;
}

/**
 * UPDATE Neraca
 */
export async function updateNeraca(
  id: number,
  payload: UpdateNeracaPayload,
): Promise<{ message: string; data: NeracaItem }> {
  const url = `${API_URL}/api/accounting/neraca/${id}`;

  const res = await fetchWithAuth(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal mengupdate data neraca");
  }

  return data;
}

/**
 * DELETE Neraca
 */
export async function deleteNeraca(id: number): Promise<{ message: string }> {
  const url = `${API_URL}/api/accounting/neraca/${id}`;

  const res = await fetchWithAuth(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Gagal menghapus data neraca");
  }

  return data;
}
