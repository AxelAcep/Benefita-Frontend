export interface PerusahaanVendorItem {
  noInduk: string;
  namaPerusahaan: string | null;
  acc: string[];
  status: string | null;
  expired: string | null;
}

export interface PerusahaanVendorPagination {
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetPerusahaanVendorResponse {
  data: PerusahaanVendorItem[];
  pagination: PerusahaanVendorPagination;
}

export type PerusahaanVendorParams = {
  page?: number;
  limit?: number;
  search?: string;
};
