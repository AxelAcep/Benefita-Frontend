// services/jurnal-keuangan.service.ts
// Fitur 2 (Jurnal Keuangan) + Fitur 3 (Buku Besar & Tutup Buku) + Fitur 4
// (Laba Rugi) + Fitur 5 (Neraca) + Fitur 6 (Kas & Bank).
// Skema BARU (double-entry, relasi ke Akun) — terpisah dari TableNeraca
// lama (/accounting/neraca, dibiarkan jadi arsip "(Lama)").

const API_URL = process.env.NEXT_PUBLIC_API_URL;

import { fetchWithAuth } from "./login.service";
import type { JenisAkun, Pagination } from "./accounting.service";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type ModeJurnal = "SIMPLE" | "ADVANCED";
export type StatusJurnal = "POSTED" | "CLOSED";
export type StatusPeriode = "OPEN" | "CLOSED";

export interface AkunRingkas {
  id: number;
  kode: string | null;
  nama: string;
  jenis: JenisAkun;
}

export interface JurnalBarisItem {
  id: number;
  transaksiId: number;
  akunId: number;
  akun: AkunRingkas;
  debit: string;
  kredit: string;
  keterangan: string | null;
}

export interface JurnalTransaksiItem {
  id: number;
  noJurnal: string;
  tanggal: string;
  deskripsi: string;
  mode: ModeJurnal;
  status: StatusJurnal;
  totalNominal: string;
  periode: string;
  sumber: string;
  createdBy: string | null;
  dibuatOleh: { id: string; nama: string } | null;
  closedAt: string | null;
  baris: JurnalBarisItem[];
}

export interface JurnalListResponse {
  data: JurnalTransaksiItem[];
  pagination: Pagination;
}

export interface JurnalBarisInput {
  akunId: number;
  debit?: number;
  kredit?: number;
  keterangan?: string;
}

// ─── Fitur 2: Jurnal Keuangan ──────────────────────────────────────

export async function getJurnalList(
  params: { page?: number; limit?: number; status?: StatusJurnal; periode?: string; search?: string } = {},
): Promise<JurnalListResponse> {
  const { page = 1, limit = 10, status, periode, search } = params;
  const query = new URLSearchParams();
  query.append("page", String(page));
  query.append("limit", String(limit));
  if (status) query.append("status", status);
  if (periode) query.append("periode", periode);
  if (search) query.append("search", search);

  const res = await fetchWithAuth(`${API_URL}/api/jurnal?${query.toString()}`, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil data jurnal");
  return data;
}

export async function getJurnalById(id: number): Promise<{ data: JurnalTransaksiItem }> {
  const res = await fetchWithAuth(`${API_URL}/api/jurnal/${id}`, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil detail jurnal");
  return data;
}

export async function createJurnal(payload: {
  tanggal: string;
  deskripsi: string;
  mode: ModeJurnal;
  baris: JurnalBarisInput[];
}): Promise<{ message: string; data: JurnalTransaksiItem }> {
  const res = await fetchWithAuth(`${API_URL}/api/jurnal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal menyimpan jurnal");
  return data;
}

// ─── Fitur 3: Buku Besar & Tutup Buku ──────────────────────────────

export interface BukuBesarRingkasItem {
  akun: AkunRingkas;
  saldoAwal: string;
  totalDebit: number;
  totalKredit: number;
  saldoAkhir: number;
}

export async function getBukuBesarRingkasan(
  params: { jenis?: JenisAkun; startDate?: string; endDate?: string } = {},
): Promise<{ data: BukuBesarRingkasItem[] }> {
  const query = new URLSearchParams();
  if (params.jenis) query.append("jenis", params.jenis);
  if (params.startDate) query.append("startDate", params.startDate);
  if (params.endDate) query.append("endDate", params.endDate);

  const res = await fetchWithAuth(`${API_URL}/api/jurnal/buku-besar/ringkasan?${query.toString()}`, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil ringkasan buku besar");
  return data;
}

export interface BukuBesarRow {
  transaksiId: number;
  noJurnal: string;
  tanggal: string;
  status: StatusJurnal;
  keterangan: string;
  debit: string;
  kredit: string;
  saldo: number;
}

export interface BukuBesarAkunResponse {
  akun: AkunRingkas;
  saldoAwal: string;
  saldoAkhir: number;
  rows: BukuBesarRow[];
}

export async function getBukuBesarAkun(
  akunId: number,
  params: { startDate?: string; endDate?: string } = {},
): Promise<BukuBesarAkunResponse> {
  const query = new URLSearchParams();
  if (params.startDate) query.append("startDate", params.startDate);
  if (params.endDate) query.append("endDate", params.endDate);

  const res = await fetchWithAuth(`${API_URL}/api/jurnal/buku-besar/akun/${akunId}?${query.toString()}`, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil buku besar akun");
  return data;
}

export interface PeriodeItem {
  periode: string;
  status: StatusPeriode;
  labaRugiBersih: string | null;
  closedAt: string | null;
}

export async function getPeriodeList(): Promise<{ data: PeriodeItem[] }> {
  const res = await fetchWithAuth(`${API_URL}/api/jurnal/periode`, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil daftar periode");
  return data;
}

export async function tutupBuku(periode: string): Promise<{
  message: string;
  data: { periodeRow: PeriodeItem; labaRugiBersih: number; totalPendapatan: number; totalBeban: number };
}> {
  const res = await fetchWithAuth(`${API_URL}/api/jurnal/tutup-buku`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ periode }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal menutup buku");
  return data;
}

// ─── Fitur 4: Laba Rugi ─────────────────────────────────────────────

export interface LabaRugiRow {
  akun: AkunRingkas;
  saldo: number;
}

export interface LabaRugiResponse {
  startPeriode: string;
  endPeriode: string;
  rows: LabaRugiRow[];
  totalPendapatan: number;
  totalBeban: number;
  labaRugiBersih: number;
  status: "DRAFT" | "FINAL";
}

export async function getLaporanLabaRugi(
  startPeriode: string,
  endPeriode: string,
): Promise<{ data: LabaRugiResponse }> {
  const query = new URLSearchParams({ startPeriode, endPeriode });
  const res = await fetchWithAuth(`${API_URL}/api/jurnal/laporan/laba-rugi?${query.toString()}`, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil laporan laba rugi");
  return data;
}

// ─── Fitur 5: Neraca ────────────────────────────────────────────────

export interface NeracaRow {
  akun: { id: number; kode: string | null; nama: string };
  saldo: number;
}

export interface NeracaResponse {
  tanggal: string;
  aktivaLancar: NeracaRow[];
  totalAktivaLancar: number;
  aktivaTetap: NeracaRow[];
  totalAktivaTetap: number;
  hutangLancar: NeracaRow[];
  totalHutangLancar: number;
  hutangJangkaPanjang: NeracaRow[];
  totalHutangJangkaPanjang: number;
  modal: NeracaRow[];
  totalAset: number;
  totalLiabilitas: number;
  totalModal: number;
  isBalance: boolean;
  selisih: number;
}

export async function getNeracaSnapshot(tanggal?: string): Promise<{ data: NeracaResponse }> {
  const query = new URLSearchParams();
  if (tanggal) query.append("tanggal", tanggal);
  const res = await fetchWithAuth(`${API_URL}/api/jurnal/laporan/neraca?${query.toString()}`, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil neraca");
  return data;
}

// ─── Fitur 6: Kas & Bank ────────────────────────────────────────────

export interface KasBankMutasiRow {
  noJurnal: string;
  tanggal: string;
  keterangan: string;
  masuk: string;
  keluar: string;
  saldo: number;
}

export interface KasBankAkunMutasi {
  akun: { id: number; kode: string | null; nama: string };
  saldoAwal: string;
  saldoAkhir: number;
  rows: KasBankMutasiRow[];
}

export interface KasBankResponse {
  mutasi: KasBankAkunMutasi[];
  totalSaldoGabungan: number;
}

export async function getKasBank(
  params: { startDate?: string; endDate?: string } = {},
): Promise<{ data: KasBankResponse }> {
  const query = new URLSearchParams();
  if (params.startDate) query.append("startDate", params.startDate);
  if (params.endDate) query.append("endDate", params.endDate);
  const res = await fetchWithAuth(`${API_URL}/api/jurnal/kas-bank?${query.toString()}`, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil data Kas & Bank");
  return data;
}
