export interface Perusahaan {
  id: string;
  nama: string | null;
  alamatPusat: string | null;
  noTelp: string | null;
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface GetPerusahaanParams {
  search?: string;
  page?: number;
  pageSize?: number;
  jenisInstansi?: string;
}

export interface GetPerusahaanResponse {
  data: Perusahaan[];
  meta: PaginationMeta;
}
