export interface PerusahaanPrioritasItem {
  noInduk: string;
  namaPerusahaan: string | null;
  alamat: string | null;
  telp: string | null;
  email: string | null;
  prioritasMa: string | null;
  prioritasAe: string | null;
  updatter: string | null;
  updateTerakhir: string | null;
  env: string | null;
  csr: string | null;
}

export interface PerusahaanPrioritasPagination {
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetPerusahaanPrioritasResponse {
  data: PerusahaanPrioritasItem[];
  pagination: PerusahaanPrioritasPagination;
}

export type PerusahaanPrioritasParams = {
  page?: number;
  limit?: number;
  search?: string;
  prioritasMa?: string;
  prioritasAe?: string;
};
