/** Pengajuan Judul Training — usulan judul dari marketing, menunggu respons MA. */

export type ResponMA = "PENDING" | "DISETUJUI" | "DITOLAK";

/** Bentuk detail dari GET /api/training/pengajuan-judul/:id */
export interface PengajuanJudulTraining {
  id: string;
  judulTraining: string;
  jumlahHari: number;
  namaKontak: string | null;
  kontak: string | null;
  jumlahPeserta: number | null;
  jumlahPesertaTeks?: string | null;
  catatanMA?: string | null;
  tanggalKeputusan?: string | null;
  canEdit: boolean;
  canApprove: boolean;
  responMA: ResponMA;
  tanggalPengajuan: string;
  perusahaanId: string | null;
  inputOleh: {
    id: string;
    nama: string;
    jabatan?: string | null;
  };
}

/**
 * Bentuk baris dari GET /api/training/pengajuan-judul.
 * Berbeda dari detail: ada `perusahaan` (nama tampilan) tapi tidak ada
 * `perusahaanId`, jadi formulir edit harus menarik detailnya sendiri.
 */
export interface PengajuanListItem {
  id: string;
  judulTraining: string;
  jumlahHari: number;
  jumlahPeserta: number | null;
  jumlahPesertaTeks?: string | null;
  catatanMA?: string | null;
  tanggalKeputusan?: string | null;
  canEdit: boolean;
  canApprove: boolean;
  namaKontak: string | null;
  kontak: string | null;
  responMA: string;
  tanggalPengajuan: string;
  perusahaan: string | null;
  inputOleh: {
    id: string;
    nama: string;
  };
}

export interface CreatePengajuanRequest {
  judulTraining: string;
  jumlahHari: number;
  perusahaanId?: string;
  namaKontak?: string;
  kontak?: string;
  jumlahPeserta?: number | string | null;
}

export interface UpdatePengajuanRequest {
  judulTraining?: string;
  jumlahHari?: number;
  perusahaanId?: string;
  namaKontak?: string;
  kontak?: string;
  jumlahPeserta?: number | string | null;
}

export const WARNA_RESPON_MA: Record<string, string> = {
  PENDING: "bg-zinc-100 text-zinc-500",
  DISETUJUI: "bg-emerald-50 text-emerald-600",
  DITOLAK: "bg-red-50 text-red-500",
};

export const LABEL_RESPON_MA: Record<string, string> = {
  PENDING: "Pending",
  DISETUJUI: "Disetujui",
  DITOLAK: "Ditolak",
};
