export interface TabPerusahaan {
  noInduk: string;
  jenisInstansi: string;
  company: string | null;
  alamat?: string | null;
  telepon?: string | null;
  email?: string | null;
}

export interface Pegawai {
  id: string;
  nama: string;
  nip: string | null;
  prefix: string | null;
  kode: string | null;
  jabatan: string | null;
  departemen: string | null;
  email: string | null;
  noTelepon: string | null;
}

export type TipeSurat = "umum" | "marketing" | "lsp";

export interface PermintaanNomorSurat {
  id: number;
  noSurat: string;
  keterangan: string | null;
  tanggalKirim: string;
  tipe: TipeSurat;
  tujuanNoInduk: string | null;
  pengirimId: string | null;
  pengirimNama?: string | null;
  tujuanNama?: string | null;
  canEdit: boolean;
  canDelete: boolean;
  createdAt: string;
  updatedAt: string;
  tujuan?: TabPerusahaan | null;
  pengirim: Pegawai | null;
}

export interface PermintaanSuratPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetPermintaanSuratResponse {
  success: boolean;
  data: PermintaanNomorSurat[];
  pagination: PermintaanSuratPagination;
}

export interface CreatePermintaanSuratRequest {
  keterangan: string;
  tujuanNoInduk: string;
  tipe: TipeSurat;
}

export interface UpdatePermintaanSuratRequest {
  keterangan?: string;
  tujuanNoInduk?: string;
}
