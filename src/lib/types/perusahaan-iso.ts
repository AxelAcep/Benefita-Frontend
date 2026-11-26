export interface PerusahaanIsoItem {
  noInduk: string;
  namaPerusahaan: string | null;
  alamat: string | null;
  telp: string | null;
  updatter: string | null;
  updateTerakhir: string | null;
  kategoriCpn: string | null;
  liniBisnis: string | null;
  tahunPeringkat: string | null;
  env: string | null;
  csr: string | null;
  tsm: string | null;
  epm: string | null;
}

export interface PerusahaanIsoPagination {
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetPerusahaanIsoResponse {
  data: PerusahaanIsoItem[];
  pagination: PerusahaanIsoPagination;
}

export type PerusahaanIsoParams = {
  page?: number;
  limit?: number;
  search?: string;
  sort?: "asc" | "desc";
  liniBisnisId?: number | "";
};
