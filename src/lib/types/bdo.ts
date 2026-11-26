/** Menu BDO & Aktivitas: ASAP dan Tugas. */

export interface PegawaiRingkas {
  id: string;
  nama: string;
  userData: string | null;
}

export interface PerusahaanRingkas {
  noInduk: string;
  company: string | null;
}

export interface Asap {
  id: string;
  perusahaanId: string | null;
  saran: string;
  kategori: string | null;
  kirimKeId: string | null;
  /** Nama mentah dari data lama, dipakai bila pegawainya tidak ketemu. */
  kirimKeNama: string | null;
  sambungId: number | null;
  tanggal: string;
  selesai: boolean;
  kirimKe: PegawaiRingkas | null;
  pembuat: PegawaiRingkas | null;
  perusahaan: PerusahaanRingkas | null;
}

export interface CreateAsapRequest {
  saran: string;
  perusahaanId?: string | null;
  kategori?: string | null;
  kirimKeId?: string | null;
  tanggal?: string;
}

export type UpdateAsapRequest = Partial<CreateAsapRequest> & {
  selesai?: boolean;
};

export interface Tugas {
  id: string;
  perusahaanId: string | null;
  kategori: string | null;
  kegiatan: string;
  picId: string | null;
  picNama: string | null;
  penerimaId: string | null;
  penerimaNama: string | null;
  sambungId: number | null;
  tanggalInput: string;
  dueDate: string | null;
  selesai: boolean;
  pic: PegawaiRingkas | null;
  penerima: PegawaiRingkas | null;
  perusahaan: PerusahaanRingkas | null;
}

export interface CreateTugasRequest {
  kegiatan: string;
  picId?: string | null;
  penerimaId?: string | null;
  perusahaanId?: string | null;
  kategori?: string | null;
  dueDate?: string | null;
  tanggalInput?: string;
}

export type UpdateTugasRequest = Partial<CreateTugasRequest> & {
  selesai?: boolean;
};

export interface Pengingat {
  tugas: Tugas[];
  asap: Asap[];
  total: number;
}

/**
 * Tugas tanpa penerima laporan berarti tugas biasa; yang punya penerima
 * harus dilaporkan. Data lama tidak menyimpan label ini, jadi diturunkan,
 * bukan disimpan.
 */
export function jenisTugas(t: Tugas): "Tugas" | "Tugas dan Pelaporan" {
  return t.penerimaId || t.penerimaNama ? "Tugas dan Pelaporan" : "Tugas";
}
