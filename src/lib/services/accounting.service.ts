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

// ─── Laporan Hasil Usaha Types ─────────────────────────────────

export interface LaporanHasilUsahaItem {
  kode: string; // kode JudulTraining
  keterangan: string; // judulTraining dari JudulTraining
  anggaran: number; // 0 (sementara)
  realisasi: number; // total hargaTotal peserta FIX dari semua jadwal dengan kode tersebut
}

export interface LaporanHasilUsahaResponse {
  data: LaporanHasilUsahaItem[];
  pagination: Pagination;
  grandTotal: {
    totalRealisasi: number;
    totalAnggaran: number;
  };
}

// ─── API Call ─────────────────────────────────────────────────

export async function getLaporanHasilUsaha(
  params: GetPendapatanParams = {},
): Promise<LaporanHasilUsahaResponse> {
  const {
    page = 1,
    limit = 10,
    sortBy = "realisasi",
    order = "desc",
    startMonth,
    startYear,
    endMonth,
    endYear,
    // jenis tidak dipakai di laporan ini, tapi bisa dilewatkan jika ada
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

  const url = `${API_URL}/api/accounting/laporan-hasil?${queryParams.toString()}`;
  const res = await fetchWithAuth(url, { method: "GET" });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message || "Gagal mengambil laporan hasil usaha");
  return data;
}

// ─── UMK Types ──────────────────────────────────────────────────────────

export interface UmkItem {
  id: number;
  tglInput: string;
  noUmk: string;
  jumlahUmk: number;
  picId: string | null;
  pic: {
    id: string;
    nama: string;
  } | null;
  tujuanUmk: string;
  tglPenyerahanUang: string | null;
  realisasiUmk: number;
  tglPutmKmk: string | null;
  sisaUangUmk: number;
  ketUmk: string | null;
  periodeUmk: string;
  inputterId: string;
  inputter: {
    id: string;
    nama: string;
  };
}

export interface UmkResponse {
  data: UmkItem[];
  pagination: Pagination;
  grandTotal: {
    totalJumlah: number;
    totalRealisasi: number;
    totalSisa: number;
  };
}

export interface UmkDetailResponse {
  data: UmkItem;
}

// ─── UMK API Calls ─────────────────────────────────────────────────────

export async function getUmk(
  params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: "asc" | "desc";
    startMonth?: number;
    startYear?: number;
    endMonth?: number;
    endYear?: number;
    picId?: string;
    search?: string;
  } = {},
): Promise<UmkResponse> {
  const {
    page = 1,
    limit = 10,
    sortBy = "tglInput",
    order = "desc",
    startMonth,
    startYear,
    endMonth,
    endYear,
    picId,
    search,
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
  if (picId) {
    queryParams.append("picId", picId);
  }
  if (search) {
    queryParams.append("search", search);
  }

  const url = `${API_URL}/api/accounting/umk?${queryParams.toString()}`;
  const res = await fetchWithAuth(url, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil data UMK");
  return data;
}

export async function createUmk(payload: {
  noUmk: string;
  tujuanUmk: string;
  picId: string;
  jumlahUmk: number;
  tglPenyerahanUang?: string;
  realisasiUmk?: number;
  ketUmk?: string;
}): Promise<{ message: string; data: UmkItem }> {
  const url = `${API_URL}/api/accounting/umk`;
  const res = await fetchWithAuth(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal membuat UMK");
  return data;
}

export async function updateUmk(
  id: number,
  payload: {
    tujuanUmk?: string;
    picId?: string;
    jumlahUmk?: number;
    tglPenyerahanUang?: string;
    realisasiUmk?: number;
    ketUmk?: string;
  },
): Promise<{ message: string; data: UmkItem }> {
  const url = `${API_URL}/api/accounting/umk/${id}`;
  const res = await fetchWithAuth(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal memperbarui UMK");
  return data;
}

export async function getUmkById(id: number): Promise<UmkDetailResponse> {
  const url = `${API_URL}/api/accounting/umk/${id}`;
  const res = await fetchWithAuth(url, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil detail UMK");
  return data;
}

// ─────────────────────────────────────────────
// MASTER AKUN — Keuangan Tahap 1
// 5 jenis akun baku, gak bisa custom dari UI.
// ─────────────────────────────────────────────

export const JENIS_AKUN_OPTIONS = [
  "ASET",
  "LIABILITAS",
  "MODAL",
  "PENDAPATAN",
  "BEBAN",
] as const;

export type JenisAkun = (typeof JENIS_AKUN_OPTIONS)[number];

export const KATEGORI_AKUN_OPTIONS = [
  "KAS_BANK",
  "PIUTANG_USAHA",
  "PIUTANG_LAINNYA",
  "AKTIVA_TETAP",
  "HUTANG_LANCAR",
  "HUTANG_JANGKA_PANJANG",
  "MODAL_AKUN",
  "BEBAN_PENJUALAN",
  "BEBAN_ADMINISTRASI",
] as const;

export type KategoriAkun = (typeof KATEGORI_AKUN_OPTIONS)[number];

// Kategori mana yang valid buat tiap jenis akun — dipakai buat filter opsi
// di form Master Akun (PENDAPATAN gak punya subgrup, BEBAN dipecah
// Penjualan/Administrasi biar Laba Rugi mirip layout Beban Usaha asli).
export const KATEGORI_BY_JENIS: Record<JenisAkun, KategoriAkun[]> = {
  ASET: ["KAS_BANK", "PIUTANG_USAHA", "PIUTANG_LAINNYA", "AKTIVA_TETAP"],
  LIABILITAS: ["HUTANG_LANCAR", "HUTANG_JANGKA_PANJANG"],
  MODAL: ["MODAL_AKUN"],
  PENDAPATAN: [],
  BEBAN: ["BEBAN_PENJUALAN", "BEBAN_ADMINISTRASI"],
};

export interface AkunItem {
  id: number;
  kode: string | null;
  nama: string;
  jenis: JenisAkun;
  saldoAwal: string; // Prisma Decimal → string di JSON
  isActive: boolean;
  isKasBank: boolean;
  kategori: KategoriAkun | null;
  createdAt: string;
  updatedAt: string;
}

export interface AkunResponse {
  data: AkunItem[];
  pagination: Pagination;
}

// ─── Akun API Calls ────────────────────────────────────────────────

export async function getAkunList(
  params: {
    page?: number;
    limit?: number;
    jenis?: JenisAkun;
    search?: string;
    isActive?: boolean;
  } = {},
): Promise<AkunResponse> {
  const { page = 1, limit = 10, jenis, search, isActive } = params;

  const queryParams = new URLSearchParams();
  queryParams.append("page", String(page));
  queryParams.append("limit", String(limit));
  if (jenis) queryParams.append("jenis", jenis);
  if (search) queryParams.append("search", search);
  if (isActive !== undefined) queryParams.append("isActive", String(isActive));

  const url = `${API_URL}/api/accounting/akun?${queryParams.toString()}`;
  const res = await fetchWithAuth(url, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil data akun");
  return data;
}

export async function getAkunById(id: number): Promise<{ data: AkunItem }> {
  const url = `${API_URL}/api/accounting/akun/${id}`;
  const res = await fetchWithAuth(url, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil detail akun");
  return data;
}

export async function createAkun(payload: {
  kode?: string;
  nama: string;
  jenis: JenisAkun;
  saldoAwal?: number;
  isKasBank?: boolean;
  kategori?: KategoriAkun | "";
}): Promise<{ message: string; data: AkunItem }> {
  const url = `${API_URL}/api/accounting/akun`;
  const res = await fetchWithAuth(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal membuat akun");
  return data;
}

export async function updateAkun(
  id: number,
  payload: {
    kode?: string;
    nama?: string;
    jenis?: JenisAkun;
    saldoAwal?: number;
    isKasBank?: boolean;
    kategori?: KategoriAkun | "";
  },
): Promise<{ message: string; data: AkunItem }> {
  const url = `${API_URL}/api/accounting/akun/${id}`;
  const res = await fetchWithAuth(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal memperbarui akun");
  return data;
}

export async function toggleAkunStatus(
  id: number,
  isActive?: boolean,
): Promise<{ message: string; data: AkunItem }> {
  const url = `${API_URL}/api/accounting/akun/${id}/status`;
  const res = await fetchWithAuth(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(isActive === undefined ? {} : { isActive }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengubah status akun");
  return data;
}

// ─────────────────────────────────────────────
// PENGELUARAN & PEMASUKAN — Fitur 0 (lanjutan)
// Alur: user request → approver approve/reject → selesai (belum nyentuh
// Jurnal Keuangan).
// ─────────────────────────────────────────────

export const JENIS_REQUEST_OPTIONS = ["PENGELUARAN", "PEMASUKAN"] as const;
export type JenisRequestKeuangan = (typeof JENIS_REQUEST_OPTIONS)[number];

export const STATUS_REQUEST_OPTIONS = ["PENDING", "APPROVED", "REJECTED"] as const;
export type StatusRequestKeuangan = (typeof STATUS_REQUEST_OPTIONS)[number];

// PENGELUARAN → dropdown akun jenis BEBAN, PEMASUKAN → dropdown akun jenis PENDAPATAN
export const JENIS_REQUEST_TO_AKUN: Record<JenisRequestKeuangan, JenisAkun> = {
  PENGELUARAN: "BEBAN",
  PEMASUKAN: "PENDAPATAN",
};

export interface RequestKeuanganItem {
  id: number;
  jenis: JenisRequestKeuangan;
  akunId: number | null;
  akun: { id: number; kode: string | null; nama: string; jenis: JenisAkun } | null;
  deskripsi: string;
  nominal: string; // Prisma Decimal → string di JSON
  tanggal: string;
  requestedBy: string;
  requestedOleh: { id: string; nama: string };
  status: StatusRequestKeuangan;
  approvedBy: string | null;
  approvedOleh: { id: string; nama: string } | null;
  approvedAt: string | null;
  catatan: string | null;
  buktiFile: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RequestKeuanganResponse {
  data: RequestKeuanganItem[];
  pagination: Pagination;
}

// ─── Request Keuangan API Calls ────────────────────────────────────

export async function getRequestKeuanganList(
  params: {
    page?: number;
    limit?: number;
    status?: StatusRequestKeuangan;
    jenis?: JenisRequestKeuangan;
    search?: string;
  } = {},
): Promise<RequestKeuanganResponse> {
  const { page = 1, limit = 10, status, jenis, search } = params;

  const queryParams = new URLSearchParams();
  queryParams.append("page", String(page));
  queryParams.append("limit", String(limit));
  if (status) queryParams.append("status", status);
  if (jenis) queryParams.append("jenis", jenis);
  if (search) queryParams.append("search", search);

  const url = `${API_URL}/api/accounting/request-keuangan?${queryParams.toString()}`;
  const res = await fetchWithAuth(url, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil data request keuangan");
  return data;
}

export async function createRequestKeuangan(payload: {
  jenis: JenisRequestKeuangan;
  akunId?: number;
  deskripsi: string;
  nominal: number;
  tanggal?: string;
  buktiFile?: File;
}): Promise<{ message: string; data: RequestKeuanganItem }> {
  const formData = new FormData();
  formData.append("jenis", payload.jenis);
  if (payload.akunId) formData.append("akunId", String(payload.akunId));
  formData.append("deskripsi", payload.deskripsi);
  formData.append("nominal", String(payload.nominal));
  if (payload.tanggal) formData.append("tanggal", payload.tanggal);
  if (payload.buktiFile) formData.append("buktiFile", payload.buktiFile);

  const url = `${API_URL}/api/accounting/request-keuangan`;
  const res = await fetchWithAuth(url, { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengajukan request");
  return data;
}

export async function approveRequestKeuangan(
  id: number,
): Promise<{ message: string; data: RequestKeuanganItem }> {
  const url = `${API_URL}/api/accounting/request-keuangan/${id}/approve`;
  const res = await fetchWithAuth(url, { method: "PATCH" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal menyetujui request");
  return data;
}

export async function rejectRequestKeuangan(
  id: number,
  catatan: string,
): Promise<{ message: string; data: RequestKeuanganItem }> {
  const url = `${API_URL}/api/accounting/request-keuangan/${id}/reject`;
  const res = await fetchWithAuth(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ catatan }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal menolak request");
  return data;
}
