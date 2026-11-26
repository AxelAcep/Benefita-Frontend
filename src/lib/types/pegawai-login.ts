export interface PegawaiLoginItem {
  id: string;
  nama: string;
  user: {
    lastOnlineAt: string | null;
    lastIpAddress: string | null;
  } | null;
}

export interface PegawaiLoginMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PegawaiLoginResponse {
  data: PegawaiLoginItem[];
  meta: PegawaiLoginMeta;
}
