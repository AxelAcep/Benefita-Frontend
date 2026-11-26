export type PeringkatProper =
  | "EMAS"
  | "HIJAU"
  | "BIRU"
  | "MERAH"
  | "HITAM"
  | "DITUNDA"
  | "MASALAH"
  | "TUTUP"
  | "DITANGGUHKAN"
  | "MERAH_MUDA";

export interface PerusahaanProperItem {
  noInduk: string;
  namaPerusahaan: string | null;
  acc: string | null;
  alamat: string | null;
  telp: string | null;
  email: string | null;
  updatter: string | null;
  updateTerakhir: string | null;
  kategoriCpn: string | null;
  liniBisnis: string | null;
  tahunPeringkat: string | null;
}

export interface PerusahaanProperPagination {
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetPerusahaanProperResponse {
  data: PerusahaanProperItem[];
  pagination: PerusahaanProperPagination;
}

export type PerusahaanProperParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: "asc" | "desc";
  peringkat?: PeringkatProper | "";
  liniBisnisId?: number | "";
};
