/** Peserta Uji — asesi pada pelaksanaan uji kompetensi. */

/** Berkas yang harus dilengkapi sebelum seorang calon boleh diuji. */
export const CHECKLIST_FIELDS = [
  "suratKetKerja",
  "suratRekom",
  "sertPel",
  "cv",
  "ktp",
  "ijazah",
  "pasFoto",
  "verTUK",
  "ksediaTUK",
  "apl01",
  "apl02",
] as const;

export type ChecklistField = (typeof CHECKLIST_FIELDS)[number];

export interface PesertaUji {
  id: number;
  pesertaTrainingId: number | null;
  nama: string;
  instansi: string | null;
  tempatTinggal: string | null;
  email: string | null;
  wa: string | null;

  skemaId: number;
  skema: { id: number; kode: string; nama: string };

  tukId: number | null;
  tuk: { id: number; nama: string } | null;

  asesorId: number | null;
  asesor: { id: number; nama: string } | null;

  tglUji: string | null;
  noReg: string | null;
  noSerBNSP: string | null;
  tglTerbit: string | null;
  statusHasil: string | null;

  suratKetKerja: boolean;
  suratRekom: boolean;
  sertPel: boolean;
  cv: boolean;
  ktp: boolean;
  ijazah: boolean;
  pasFoto: boolean;
  verTUK: boolean;
  ksediaTUK: boolean;
  apl01: boolean;
  apl02: boolean;

  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignPelaksanaanPayload {
  tukId?: number | "";
  asesorId?: number | "";
  tglUji?: string;
}

export interface UpdateHasilPayload {
  statusHasil: "K" | "BK";
  noReg?: string;
  noSerBNSP?: string;
  tglTerbit?: string;
}

/** Satu baris rekap Laporan KLHK: jumlah K, BK, dan total per tanggal dan skema. */
export interface LaporanKlhkRow {
  tglUjian: string;
  kodeSkema: string;
  namaSkema: string;
  jumlahK: number;
  jumlahBk: number;
  jumlahTotal: number;
}

/** Berapa berkas yang sudah lengkap dari seluruh checklist. */
export function hitungKelengkapan(row: PesertaUji) {
  const lengkap = CHECKLIST_FIELDS.filter((f) => row[f]).length;
  const total = CHECKLIST_FIELDS.length;
  return { lengkap, total, persen: Math.round((lengkap / total) * 100) };
}
