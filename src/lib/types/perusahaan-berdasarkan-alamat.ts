export interface PerusahaanByAlamatItem {
  noInduk: string;
  namaPerusahaan: string | null;
  alamat: string | null;
  alamatFactory: string | null;
  acc: string | null;
}

export interface PerusahaanByAlamatPagination {
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetPerusahaanByAlamatResponse {
  data: PerusahaanByAlamatItem[];
  pagination: PerusahaanByAlamatPagination;
}

export type PerusahaanByAlamatParams = {
  page?: number;
  limit?: number;
  search?: string;
};
