export type JenisIzin = "CUTI" | "SAKIT" | "IZIN";
export type StatusIzin = "PENDING" | "DISETUJUI" | "DITOLAK";

export interface BuktiIzin {
  id: string;
  pengajuanIzinId: string;
  nama: string;
  url: string;
  key: string;
  createdAt: string;
}

export interface PengajuanIzin {
  id: string;
  pegawaiId: string;
  jenisIzin: JenisIzin;
  tanggalMulai: string;
  tanggalSelesai: string;
  alasan: string;
  alasanTolak: string | null;
  status: StatusIzin;
  tanggalKonfirmasi: string | null;
  createdAt: string;
  bukti: BuktiIzin[];
  pegawai: {
    id: string;
    nama: string;
    nip: string | null;
    jabatan: string | null;
    departemen: string | null;
    fotoUrl: string | null;
  };
}

export interface PengajuanIzinListItem {
  id: string;
  jenisIzin: JenisIzin;
  tanggalMulai: string;
  tanggalSelesai: string;
  alasan: string;
  status: StatusIzin;
  createdAt: string;
  pegawai: {
    id: string;
    nama: string;
    nip: string | null;
    jabatan: string | null;
    departemen: string | null;
  };
}

export interface RiwayatIzinItem {
  id: string;
  jenisIzin: JenisIzin;
  tanggalMulai: string;
  tanggalSelesai: string;
  alasan: string;
  alasanTolak: string | null;
  status: StatusIzin;
  createdAt: string;
  tanggalKonfirmasi: string | null;
  pegawai?: {
    id: string;
    nama: string;
    nip: string | null;
    jabatan: string | null;
    departemen: string | null;
  };
}

export interface KaryawanCutiItem {
  id: string;
  nama: string;
  jabatan: string | null;
  departemen: string | null;
  fotoUrl: string | null;
  totalCutiDanIzin: number;
  totalSakit: number;
}

export interface IzinSummary {
  totalCuti: number;
  totalIzin: number;
  totalSakit: number;
  totalCutiDanIzin: number;
}

export interface IzinPagination {
  total: number;
  page: number;
  limit: number;
  totalPage: number;
}

export interface GetPengajuanListResponse {
  data: PengajuanIzinListItem[];
  meta: IzinPagination;
}

export interface GetRiwayatResponse {
  data: RiwayatIzinItem[];
  meta: IzinPagination;
  summary: IzinSummary;
}

export interface GetKaryawanCutiResponse {
  data: KaryawanCutiItem[];
  meta: IzinPagination;
}

export interface CreatePengajuanRequest {
  pegawaiId: string;
  jenisIzin: JenisIzin;
  tanggalMulai: string;
  tanggalSelesai: string;
  alasan: string;
  bukti?: File[];
}

export interface KonfirmasiRequest {
  status: "DISETUJUI" | "DITOLAK";
  alasanTolak?: string;
}
