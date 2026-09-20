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
// Real-time: semua jurnal statusnya POSTED, gak ada lagi CLOSED (tutup buku
// dihapus). Field ini dipertahankan di tipe biar kompatibel sama data lama.
export type StatusJurnal = "POSTED" | "CLOSED";

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
  params: { page?: number; limit?: number; startDate?: string; endDate?: string; search?: string } = {},
): Promise<JurnalListResponse> {
  const { page = 1, limit = 10, startDate, endDate, search } = params;
  const query = new URLSearchParams();
  query.append("page", String(page));
  query.append("limit", String(limit));
  if (startDate) query.append("startDate", startDate);
  if (endDate) query.append("endDate", endDate);
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

// ─── Fitur 4: Laba Rugi (real-time, filter by date range) ──────────

export interface LabaRugiRow {
  akun: AkunRingkas;
  saldo: number;
}

export interface LabaRugiResponse {
  startDate: string;
  endDate: string;
  pendapatan: LabaRugiRow[];
  totalPendapatan: number;
  hargaPokok: LabaRugiRow[];
  totalHargaPokok: number;
  labaKotor: number;
  bebanPenjualan: LabaRugiRow[];
  totalBebanPenjualan: number;
  bebanAdministrasi: LabaRugiRow[];
  totalBebanAdministrasi: number;
  totalBeban: number;
  labaRugiBersih: number;
}

export async function getLaporanLabaRugi(
  startDate: string,
  endDate: string,
): Promise<{ data: LabaRugiResponse }> {
  const query = new URLSearchParams({ startDate, endDate });
  const res = await fetchWithAuth(`${API_URL}/api/jurnal/laporan/laba-rugi?${query.toString()}`, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil laporan laba rugi");
  return data;
}

// ─── Fitur 5: Neraca ────────────────────────────────────────────────

export interface NeracaRow {
  // id null buat baris sintetis "Laba (Rugi) Berjalan" (dihitung live, gak
  // ngacu ke satu Akun tertentu).
  akun: { id: number | null; kode: string | null; nama: string };
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
  labaBerjalan: number;
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

// ─── Export PDF ───────────────────────────────────────────────────
// Endpoint PDF butuh auth header (fetchWithAuth), jadi gak bisa dibuka
// langsung lewat <a href>. Fetch sebagai blob, download manual.

async function downloadPdf(url: string, filename: string) {
  const res = await fetchWithAuth(url, { method: "GET" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Gagal mengunduh PDF");
  }
  const blob = await res.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}

export async function exportLabaRugiPdf(startDate: string, endDate: string) {
  const query = new URLSearchParams({ startDate, endDate });
  await downloadPdf(
    `${API_URL}/api/jurnal/laporan/laba-rugi/pdf?${query.toString()}`,
    `laba-rugi-${startDate}_${endDate}.pdf`,
  );
}

export async function exportNeracaPdf(tanggal: string) {
  const query = new URLSearchParams({ tanggal });
  await downloadPdf(`${API_URL}/api/jurnal/laporan/neraca/pdf?${query.toString()}`, `neraca-${tanggal}.pdf`);
}

export async function exportBukuBesarAkunPdf(
  akunId: number,
  params: { startDate?: string; endDate?: string } = {},
) {
  const query = new URLSearchParams();
  if (params.startDate) query.append("startDate", params.startDate);
  if (params.endDate) query.append("endDate", params.endDate);
  await downloadPdf(
    `${API_URL}/api/jurnal/buku-besar/akun/${akunId}/pdf?${query.toString()}`,
    `buku-besar-${akunId}.pdf`,
  );
}

export async function exportKasBankPdf(params: { startDate?: string; endDate?: string } = {}) {
  const query = new URLSearchParams();
  if (params.startDate) query.append("startDate", params.startDate);
  if (params.endDate) query.append("endDate", params.endDate);
  await downloadPdf(`${API_URL}/api/jurnal/kas-bank/pdf?${query.toString()}`, `kas-bank.pdf`);
}
