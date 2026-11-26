export interface PerusahaanTbkItem {
  noInduk: string;
  namaPerusahaan: string | null;
  acc: string | null;
  alamat: string | null;
  telp: string | null;
  updateTerakhir: string | null;
  liniBisnis: string | null;
  tglTerakhirTraining: string | null;
}

export interface PerusahaanTbkPagination {
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetPerusahaanTbkResponse {
  data: PerusahaanTbkItem[];
  pagination: PerusahaanTbkPagination;
}
