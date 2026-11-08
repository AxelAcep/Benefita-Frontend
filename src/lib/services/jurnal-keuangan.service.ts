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

export async function updateJurnal(
  id: number,
  payload: {
    tanggal: string;
    deskripsi: string;
    mode: ModeJurnal;
    baris: JurnalBarisInput[];
  },
): Promise<{ message: string; data: JurnalTransaksiItem }> {
  const res = await fetchWithAuth(`${API_URL}/api/jurnal/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal memperbarui jurnal");
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
  params: { jenis?: JenisAkun; startDate?: string; endDate?: string; search?: string } = {},
): Promise<{ data: BukuBesarRingkasItem[] }> {
  const query = new URLSearchParams();
  if (params.jenis) query.append("jenis", params.jenis);
  if (params.startDate) query.append("startDate", params.startDate);
  if (params.endDate) query.append("endDate", params.endDate);
  if (params.search) query.append("search", params.search);

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

  pendapatanUsaha: LabaRugiRow[];
  totalPendapatanUsaha: number;
  hargaPokok: LabaRugiRow[];
  totalHargaPokok: number;
  labaKotor: number;

  bebanPenjualan: LabaRugiRow[];
  totalBebanPenjualan: number;
  bebanAdministrasi: LabaRugiRow[];
  totalBebanAdministrasi: number;
  totalBebanUsaha: number;
  labaUsaha: number;

  pendapatanLain: LabaRugiRow[];
  totalPendapatanLain: number;
  bebanLain: LabaRugiRow[];
  totalBebanLain: number;
  totalPendapatanLainBersih: number;
  labaSebelumPajak: number;

  pajakPenghasilan: LabaRugiRow[];
  totalPajakPenghasilan: number;
  labaBersih: number;

  /** @deprecated pakai pendapatanUsaha */
  pendapatan: LabaRugiRow[];
  totalPendapatan: number;
  totalBeban: number;
  /** @deprecated pakai labaBersih */
  labaRugiBersih: number;

  /** Kolom pembanding, terisi kalau `startPembanding`/`endPembanding` dikirim. */
  pembanding?: LabaRugiResponse;
}

// ─── Laba Rugi Rinci (beban digabung per grupBeban) ─────────────────

export interface LabaRugiRinciRow {
  label: string;
  saldo: number;
  akun: AkunRingkas[];
}

export interface LabaRugiRinciResponse extends LabaRugiResponse {
  hargaPokokRinci: LabaRugiRinciRow[];
  bebanPenjualanRinci: LabaRugiRinciRow[];
  bebanAdministrasiRinci: LabaRugiRinciRow[];
  bebanUsahaRinci: LabaRugiRinciRow[];
}

export async function getLaporanLabaRugiRinci(
  startDate: string,
  endDate: string,
): Promise<{ data: LabaRugiRinciResponse }> {
  const query = new URLSearchParams({ startDate, endDate });
  const res = await fetchWithAuth(`${API_URL}/api/jurnal/laporan/laba-rugi-rinci?${query.toString()}`, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil laporan laba rugi rinci");
  return data;
}

export async function getLaporanLabaRugi(
  startDate: string,
  endDate: string,
  pembanding?: { startDate: string; endDate: string },
): Promise<{ data: LabaRugiResponse }> {
  const query = new URLSearchParams({ startDate, endDate });
  if (pembanding) {
    query.append("startPembanding", pembanding.startDate);
    query.append("endPembanding", pembanding.endDate);
  }
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

/** Sub-bagian ber-subtotal di dalam satu grup Neraca, mis. "Kas dan Bank". */
export interface NeracaGrup {
  kategori: string | null;
  label: string;
  items: NeracaRow[];
  total: number;
}

export interface NeracaResponse {
  tanggal: string;

  aktivaLancar: NeracaRow[];
  aktivaLancarGrup: NeracaGrup[];
  totalAktivaLancar: number;

  aktivaTetap: NeracaRow[];
  aktivaTetapGrup: NeracaGrup[];
  totalAktivaTetap: number;

  aktivaTidakLancarLainnya: NeracaRow[];
  aktivaTidakLancarLainnyaGrup: NeracaGrup[];
  totalAktivaTidakLancarLainnya: number;

  hutangLancar: NeracaRow[];
  hutangLancarGrup: NeracaGrup[];
  totalHutangLancar: number;

  hutangJangkaPanjang: NeracaRow[];
  hutangJangkaPanjangGrup: NeracaGrup[];
  totalHutangJangkaPanjang: number;

  modal: NeracaRow[];
  modalGrup: NeracaGrup[];
  labaBerjalan: number;

  totalAset: number;
  totalLiabilitas: number;
  totalModal: number;
  isBalance: boolean;
  selisih: number;

  /** Kolom pembanding, terisi kalau `tanggalPembanding` dikirim. */
  pembanding?: NeracaResponse;
}

export async function getNeracaSnapshot(
  tanggal?: string,
  tanggalPembanding?: string,
): Promise<{ data: NeracaResponse }> {
  const query = new URLSearchParams();
  if (tanggal) query.append("tanggal", tanggal);
  if (tanggalPembanding) query.append("tanggalPembanding", tanggalPembanding);
  const res = await fetchWithAuth(`${API_URL}/api/jurnal/laporan/neraca?${query.toString()}`, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil neraca");
  return data;
}

// ─── Neraca Saldo (padanan sheet "TB") ──────────────────────────────

export interface NeracaSaldoRow {
  akun: AkunRingkas & { kategori: string | null; kategoriLabel: string | null };
  saldoAwal: number;
  debit: number;
  kredit: number;
  saldoAkhir: number;
  saldoAkhirDebit: number;
  saldoAkhirKredit: number;
}

export interface NeracaSaldoResponse {
  startDate: string;
  endDate: string;
  rows: NeracaSaldoRow[];
  total: {
    saldoAwal: number;
    debit: number;
    kredit: number;
    saldoAkhirDebit: number;
    saldoAkhirKredit: number;
  };
  selisihMutasi: number;
  selisihSaldo: number;
  isBalance: boolean;
}

export async function getNeracaSaldo(
  startDate: string,
  endDate: string,
): Promise<{ data: NeracaSaldoResponse }> {
  const query = new URLSearchParams({ startDate, endDate });
  const res = await fetchWithAuth(`${API_URL}/api/jurnal/laporan/neraca-saldo?${query.toString()}`, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil neraca saldo");
  return data;
}

// ─── Arus Kas (padanan sheet "CF") ──────────────────────────────────

export interface ArusKasRow {
  label: string;
  nilai: number;
}

export interface ArusKasResponse {
  startDate: string;
  endDate: string;
  saldoAwal: number;
  penerimaan: ArusKasRow[];
  totalPenerimaan: number;
  pengeluaran: ArusKasRow[];
  totalPengeluaran: number;
  kenaikanBersih: number;
  saldoAkhir: number;
  selisih: number;
  isBalance: boolean;
}

export async function getArusKas(
  startDate: string,
  endDate: string,
): Promise<{ data: ArusKasResponse }> {
  const query = new URLSearchParams({ startDate, endDate });
  const res = await fetchWithAuth(`${API_URL}/api/jurnal/laporan/arus-kas?${query.toString()}`, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil laporan arus kas");
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
  params: { startDate?: string; endDate?: string; search?: string } = {},
): Promise<{ data: KasBankResponse }> {
  const query = new URLSearchParams();
  if (params.startDate) query.append("startDate", params.startDate);
  if (params.endDate) query.append("endDate", params.endDate);
  if (params.search) query.append("search", params.search);
  const res = await fetchWithAuth(`${API_URL}/api/jurnal/kas-bank?${query.toString()}`, { method: "GET" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal mengambil data Kas & Bank");
  return data;
}

// ─── Import Jurnal dari Excel ───────────────────────────────────────

export interface ImportJurnalRow {
  id: number;
  noJurnal: string;
  sumber: "Pendapatan" | "Kas-Bank";
  jenis: string | null;
  baris: number;
  buku: string | null;
  akunKas: string | null;
  tanggal: string | null;
  noBukti: string;
  keterangan: string;
  nominal: number;
  akunDebit: string | null;
  akunKredit: string | null;
  akunDebitId: number | null;
  akunDebitNama: string | null;
  akunKreditId: number | null;
  akunKreditNama: string | null;
  /** Nama aturan keyword yang cocok, null kalau tidak ketemu. */
  aturan: string | null;
  /** Pindah buku antar kas/bank — akun lawannya harus dipilih user. */
  transferInternal: boolean;
  /** Akun debit atau kredit belum terisi; baris ini di-highlight kuning. */
  anomali: boolean;
  kodeTidakDikenal: boolean;
  sudahDiimport: boolean;
}

export interface ImportJurnalRingkasan {
  total: number;
  pendapatan: number;
  kasBank: number;
  cocok: number;
  anomali: number;
  transferInternal: number;
  sudahDiimport: number;
  sheetDitemukan: string[];
}

export async function previewImportJurnal(
  file: File,
): Promise<{ data: { rows: ImportJurnalRow[]; ringkasan: ImportJurnalRingkasan } }> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetchWithAuth(`${API_URL}/api/jurnal/import/preview`, {
    method: "POST",
    body: form,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Gagal membaca file");
  return data;
}

export interface CommitImportHasil {
  dibuat: number;
  dilewati: number;
  detailDilewati: { noJurnal: string; alasan: string }[];
}

/** Maksimal baris per request. Lebih dari ini kena 413 Payload Too Large. */
const UKURAN_BATCH = 400;

/**
 * Backend cuma butuh 6 field per baris. Field sisanya (nama akun, aturan,
 * flag UI) cuma dipakai buat tampilan, jangan ikut dikirim — payload-nya
 * turun sekitar 60%.
 */
function ringkasBaris(r: ImportJurnalRow) {
  return {
    noJurnal: r.noJurnal,
    tanggal: r.tanggal,
    noBukti: r.noBukti,
    keterangan: r.keterangan,
    nominal: r.nominal,
    akunDebit: r.akunDebit,
    akunKredit: r.akunKredit,
  };
}

/**
 * Kirim per batch supaya gak kena limit body dan progressnya kelihatan.
 * Batch yang sudah masuk tetap tersimpan walaupun batch berikutnya gagal.
 */
export async function commitImportJurnal(
  rows: ImportJurnalRow[],
  onProgress?: (terkirim: number, total: number) => void,
): Promise<{ message: string; data: CommitImportHasil }> {
  const hasil: CommitImportHasil = { dibuat: 0, dilewati: 0, detailDilewati: [] };

  for (let i = 0; i < rows.length; i += UKURAN_BATCH) {
    const batch = rows.slice(i, i + UKURAN_BATCH).map(ringkasBaris);
    const res = await fetchWithAuth(`${API_URL}/api/jurnal/import/commit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: batch }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(
        `${data.message || "Gagal menyimpan import"} (berhasil ${hasil.dibuat} jurnal sebelum gagal)`,
      );
    }
    hasil.dibuat += data.data.dibuat;
    hasil.dilewati += data.data.dilewati;
    hasil.detailDilewati.push(...data.data.detailDilewati);
    onProgress?.(Math.min(i + UKURAN_BATCH, rows.length), rows.length);
  }

  return { message: `${hasil.dibuat} jurnal berhasil diimport`, data: hasil };
}

// ─── Export Excel ─────────────────────────────────────────────────
// Endpoint export butuh auth header (fetchWithAuth), jadi gak bisa dibuka
// langsung lewat <a href>. Fetch sebagai blob, download manual.

async function unduhBerkas(url: string, namaFile: string) {
  const res = await fetchWithAuth(url, { method: "GET" });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Gagal mengunduh file");
  }
  const blob = await res.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = namaFile;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}

export async function exportLabaRugiExcel(startDate: string, endDate: string) {
  const query = new URLSearchParams({ startDate, endDate });
  await unduhBerkas(
    `${API_URL}/api/jurnal/laporan/laba-rugi/excel?${query.toString()}`,
    `laba-rugi-${startDate}_${endDate}.xlsx`,
  );
}

export async function exportNeracaExcel(tanggal: string) {
  const query = new URLSearchParams({ tanggal });
  await unduhBerkas(`${API_URL}/api/jurnal/laporan/neraca/excel?${query.toString()}`, `neraca-${tanggal}.xlsx`);
}

export async function exportBukuBesarAkunExcel(
  akunId: number,
  params: { startDate?: string; endDate?: string } = {},
) {
  const query = new URLSearchParams();
  if (params.startDate) query.append("startDate", params.startDate);
  if (params.endDate) query.append("endDate", params.endDate);
  await unduhBerkas(
    `${API_URL}/api/jurnal/buku-besar/akun/${akunId}/excel?${query.toString()}`,
    `buku-besar-${akunId}.xlsx`,
  );
}

export async function exportKasBankExcel(params: { startDate?: string; endDate?: string } = {}) {
  const query = new URLSearchParams();
  if (params.startDate) query.append("startDate", params.startDate);
  if (params.endDate) query.append("endDate", params.endDate);
  await unduhBerkas(`${API_URL}/api/jurnal/kas-bank/excel?${query.toString()}`, `kas-bank.xlsx`);
}
