export interface PelatihanRange {
  tglMulai: string | null;
  tglSelesai: string | null;
}

export interface PerusahaanCustomerItem {
  noInduk: string;
  namaPerusahaan: string | null;
  env: string | null;
  csr: string | null;
  tsm: string | null;
  epm: string | null;
  proper: string | null;
  pelatihanPertama: PelatihanRange;
  pelatihanTerakhir: PelatihanRange;
}

export interface PerusahaanCustomerPagination {
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetPerusahaanCustomerResponse {
  data: PerusahaanCustomerItem[];
  pagination: PerusahaanCustomerPagination;
}

export type PerusahaanCustomerParams = {
  page?: number;
  limit?: number;
  search?: string;
  tahun?: number | "";
};
